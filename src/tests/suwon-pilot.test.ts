import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SUWON_REGIONS } from '../data/regions/suwon';
import { P0_KEYWORDS } from '../data/keywords/p0-keywords';
import { resolveBaseRoute, createPageContext } from '../engine/resolver';
import { getInternalLinks } from '../engine/link-engine';
import { getIndexableUrlEntries, getIndexableUrls } from '../lib/sitemap-generator';
import { getAbsoluteUrl } from '../config/site';

describe('STEP 3-B2 Suwon Region Coverage & Collision Correction Tests', () => {
  // =========================================================================
  // 1. REGION DATASET & HIERARCHY INTEGRITY
  // =========================================================================
  describe('1. Suwon Region Dataset & Hierarchy Integrity', () => {
    it('수원시 본체(SI)는 정확히 1개 존재해야 한다', () => {
      const si = SUWON_REGIONS.filter((r) => r.regionType === 'SI');
      assert.equal(si.length, 1);
      assert.equal(si[0].routeKey, '수원시');
      assert.equal(si[0].officialName, '수원시');
      assert.equal(si[0].upperRegionId, 'gyeonggi');
    });

    it('일반구(GU)는 장안구, 권선구, 팔달구, 영통구 총 4개여야 한다', () => {
      const gus = SUWON_REGIONS.filter((r) => r.regionType === 'GU');
      assert.equal(gus.length, 4);

      const guNames = new Set(gus.map((g) => g.officialName));
      assert.ok(guNames.has('장안구'));
      assert.ok(guNames.has('권선구'));
      assert.ok(guNames.has('팔달구'));
      assert.ok(guNames.has('영통구'));

      for (const gu of gus) {
        assert.equal(gu.parentRegionId, 'gg-suwon');
      }
    });

    it('독립 법정동 및 통합 행정동을 모두 포함한 활성 DONG은 정확히 55개여야 한다', () => {
      const dongs = SUWON_REGIONS.filter((r) => r.regionType === 'DONG');
      assert.equal(dongs.length, 55);

      // 구별 동 분포 검증
      const janganDongs = dongs.filter((d) => d.parentRegionId === 'gg-suwon-ja');
      const gwonseonDongs = dongs.filter((d) => d.parentRegionId === 'gg-suwon-gs');
      const paldalDongs = dongs.filter((d) => d.parentRegionId === 'gg-suwon-pd');
      const yeongtongDongs = dongs.filter((d) => d.parentRegionId === 'gg-suwon-yt');

      assert.equal(janganDongs.length, 12, '장안구 산하 동은 12개여야 함');
      assert.equal(gwonseonDongs.length, 17, '권선구 산하 동은 17개여야 함');
      assert.equal(paldalDongs.length, 18, '팔달구 산하 동은 18개여야 함');
      assert.equal(yeongtongDongs.length, 8, '영통구 산하 동은 8개여야 함');
    });

    it('수원 파일럿 활성 Region 총 개수는 정확히 60개(1 SI + 4 GU + 55 DONG)여야 한다', () => {
      assert.equal(SUWON_REGIONS.length, 60);

      for (const r of SUWON_REGIONS) {
        assert.equal(r.isActive, true, `${r.routeKey}는 isActive=true여야 함`);
        assert.equal(r.isIndexable, true, `${r.routeKey}는 isIndexable=true여야 함`);
        assert.equal(r.isSitemapEligible, true, `${r.routeKey}는 isSitemapEligible=true여야 함`);
        assert.equal(r.isHubEligible, true, `${r.routeKey}는 isHubEligible=true여야 함`);
      }
    });

    it('60개 Region의 routeKey 및 regionId는 중복이 전혀 없어야 한다 (중복 = 0)', () => {
      const routeKeys = SUWON_REGIONS.map((r) => r.routeKey);
      const regionIds = SUWON_REGIONS.map((r) => r.regionId);

      assert.equal(new Set(routeKeys).size, 60, 'routeKey 중복 발생');
      assert.equal(new Set(regionIds).size, 60, 'regionId 중복 발생');
    });
  });

  // =========================================================================
  // 2. 14 WORK KEYWORDS COMBINATIONS & RESOLVER (60 × 14 = 840)
  // =========================================================================
  describe('2. 14 Work Keywords × 60 Regions Dynamic URL Resolution', () => {
    const expectedCount = 60 * 14; // 840개

    it(`60개 지역과 14개 P0 키워드의 조합은 정확히 ${expectedCount}개의 고유 URL이어야 한다`, () => {
      const generatedUrls = new Set<string>();

      for (const region of SUWON_REGIONS) {
        for (const keyword of P0_KEYWORDS) {
          const urlQuery = `${region.routeKey}-${keyword.routeKey}`;
          generatedUrls.add(urlQuery);
        }
      }

      assert.equal(generatedUrls.size, expectedCount);
    });

    it(`${expectedCount}개 전체 조합이 Resolver를 통해 100% 성공적으로 매칭되어야 한다 (실패 = 0)`, () => {
      let resolvedCount = 0;

      for (const region of SUWON_REGIONS) {
        for (const keyword of P0_KEYWORDS) {
          const rawK = `${region.routeKey}-${keyword.routeKey}`;
          const resolved = resolveBaseRoute(rawK);

          assert.ok(resolved, `해석 실패 URL: ${rawK}`);
          assert.equal(resolved.region.routeKey, region.routeKey);
          assert.equal(resolved.work.routeKey, keyword.routeKey);
          assert.equal(resolved.canonicalQuery, rawK);
          assert.equal(resolved.isIndexable, true);

          resolvedCount++;
        }
      }

      assert.equal(resolvedCount, expectedCount);
    });
  });

  // =========================================================================
  // 3. INDEPENDENT LEGAL DONG URL VERIFICATION
  // =========================================================================
  describe('3. Independent Legal Dong URL Resolution', () => {
    it('실제 생활권 독립 법정동들이 독립 200 URL로 정상 해석되어야 한다', () => {
      const legalDongQueries = [
        '율전동-폐기물처리업체',
        '천천동-폐기물처리업체',
        '고색동-가구수거',
        '오목천동-이사폐기물처리',
        '곡반정동-폐기물처리비용',
        '이의동-폐기물수거업체',
        '당수동-가구수거',
        '이목동-폐기물처리업체',
        '대황교동-사업장폐기물',
      ];

      for (const query of legalDongQueries) {
        const resolved = resolveBaseRoute(query);
        assert.ok(resolved, `독립 법정동 매칭 실패: ${query}`);
        assert.equal(resolved.isIndexable, true);
        assert.equal(resolved.canonicalQuery, query);
      }
    });

    it('행정동과 법정동이 공존하는 경우(율천동 vs 율전동/천천동) 각각 독립 URL로 매칭되어야 한다', () => {
      const yulcheon = resolveBaseRoute('율천동-폐기물수거');
      const yuljeon = resolveBaseRoute('율전동-폐기물수거');
      const cheoncheon = resolveBaseRoute('천천동-폐기물수거');

      assert.ok(yulcheon);
      assert.ok(yuljeon);
      assert.ok(cheoncheon);

      assert.equal(yulcheon.region.routeKey, '율천동');
      assert.equal(yuljeon.region.routeKey, '율전동');
      assert.equal(cheoncheon.region.routeKey, '천천동');
    });
  });

  // =========================================================================
  // 4. NUMBERED DONG & ALIAS SAFETY
  // =========================================================================
  describe('4. Numbered Dong & Alias Safety (404 Enforcement)', () => {
    it('숫자동(1동, 2동...)으로 직접 쿼리 시 canonical URL로 오인 매칭되지 않고 404를 유도(null)해야 한다', () => {
      const invalidAliasQueries = [
        '정자1동-폐기물처리업체',
        '정자2동-폐기물수거',
        '매탄1동-가구수거',
        '매탄3동-폐기물처리업체',
        '세류1동-가정폐기물처리',
        '영통1동-이사폐기물처리',
        '화서1동-폐기물처리비용',
        '광교1동-사무실폐기물처리',
        '조원1동-상가폐기물처리',
      ];

      for (const query of invalidAliasQueries) {
        const resolved = resolveBaseRoute(query);
        assert.equal(
          resolved,
          null,
          `숫자동 쿼리(${query})는 null을 반환하여 404를 유도해야 함`
        );
      }
    });
  });

  // =========================================================================
  // 5. NATIONWIDE COLLISION REGISTRY
  // =========================================================================
  describe('5. Nationwide Collision Registry & Canonical Route Key', () => {
    it('전국 충돌 명칭(정자동, 금곡동, 조원동, 중동 등)은 수원시 접두어 결합 routeKey로만 매칭되어야 한다', () => {
      const validCollisionQueries = [
        '수원시-정자동-폐기물처리업체',
        '수원시-금곡동-폐기물처리비용',
        '수원시-조원동-가구수거',
        '수원시-고등동-사무실폐기물처리',
        '수원시-중동-폐기물처리업체',
        '수원시-교동-가정폐기물처리',
        '수원시-신동-이사폐기물처리',
        '수원시-하동-폐기물수거업체',
        '수원시-평동-폐기물처리',
        '수원시-탑동-폐기물수거',
      ];

      for (const query of validCollisionQueries) {
        const resolved = resolveBaseRoute(query);
        assert.ok(resolved, `전국 충돌 정규 URL 해석 실패: ${query}`);
        assert.equal(resolved.canonicalQuery, query);
        assert.ok(resolved.region.hasNationwideCollision);
        assert.ok(resolved.region.seoDisplayName.startsWith('수원시 '));
      }
    });

    it('전국 충돌 명칭을 단독(접두어 없이)으로 요청할 경우 Canonical 정책에 따라 404를 유도(null)해야 한다', () => {
      const invalidSoloQueries = [
        '정자동-폐기물처리업체',
        '금곡동-폐기물처리업체',
        '조원동-가구수거',
        '중동-폐기물처리업체',
        '교동-폐기물처리업체',
        '하동-폐기물처리업체',
        '신동-폐기물처리업체',
        '탑동-폐기물수거',
      ];

      for (const query of invalidSoloQueries) {
        const resolved = resolveBaseRoute(query);
        assert.equal(
          resolved,
          null,
          `충돌 명칭 단독 요청(${query})은 null을 반환하여 404를 유도해야 함`
        );
      }
    });
  });

  // =========================================================================
  // 6. DYNAMIC CONTEXTUAL INTERNAL LINKS
  // =========================================================================
  describe('6. Dynamic Contextual Internal Links Engine', () => {
    it('동(DONG) 단위 페이지는 상위 구(GU) 링크를 parentLink로 가져야 한다', () => {
      const yuljeon = SUWON_REGIONS.find((r) => r.routeKey === '율전동')!;
      const work = P0_KEYWORDS.find((w) => w.routeKey === '폐기물처리업체')!;

      const links = getInternalLinks(yuljeon, work);
      assert.ok(links.parentLink, '상위 링크가 존재해야 함');
      assert.equal(links.parentLink.label, '장안구 폐기물처리업체');
      assert.equal(links.parentLink.href, '/?k=장안구-폐기물처리업체');
    });

    it('구(GU) 단위 페이지는 상위 시(SI) 링크를 parentLink로 가져야 한다', () => {
      const paldal = SUWON_REGIONS.find((r) => r.routeKey === '팔달구')!;
      const work = P0_KEYWORDS.find((w) => w.routeKey === '폐기물수거')!;

      const links = getInternalLinks(paldal, work);
      assert.ok(links.parentLink, '상위 링크가 존재해야 함');
      assert.equal(links.parentLink.label, '수원시 폐기물수거');
      assert.equal(links.parentLink.href, '/?k=수원시-폐기물수거');
    });

    it('시(SI) 단위 페이지는 parentLink가 null이어야 한다 (최상위)', () => {
      const suwon = SUWON_REGIONS.find((r) => r.routeKey === '수원시')!;
      const work = P0_KEYWORDS.find((w) => w.routeKey === '가구수거')!;

      const links = getInternalLinks(suwon, work);
      assert.equal(links.parentLink, null);
    });

    it('동일 지역 연관 작업 링크는 3~4개 선별 제공되고 현재 작업명은 제외되어야 한다', () => {
      const gosaek = SUWON_REGIONS.find((r) => r.routeKey === '고색동')!;
      const work = P0_KEYWORDS.find((w) => w.routeKey === '사업장폐기물')!;

      const links = getInternalLinks(gosaek, work);
      assert.ok(links.relatedLinks.length >= 3 && links.relatedLinks.length <= 4);

      for (const rel of links.relatedLinks) {
        assert.notEqual(rel.href, '/?k=고색동-사업장폐기물');
        assert.ok(rel.href.startsWith('/?k=고색동-'));
      }
    });
  });

  // =========================================================================
  // 7. SITEMAP & CANONICAL EQUALITY (842 URLs)
  // =========================================================================
  describe('7. Sitemap & Canonical URL 100% Equality Audit', () => {
    it('Sitemap 항목 수는 Core(6) + WASTE 동적(840) + DEMOLITION 동적(540) = 총 1386개여야 한다', () => {
      const entries = getIndexableUrlEntries();
      assert.equal(entries.length, 1386);

      const coreEntries = entries.filter((e) => e.type === 'ROOT' || e.type === 'HUB');
      const wasteDynamicEntries = entries.filter((e) => e.type === 'DYNAMIC' && e.serviceFamily === 'WASTE');
      const demolitionDynamicEntries = entries.filter((e) => e.type === 'DYNAMIC' && e.serviceFamily === 'DEMOLITION');

      assert.equal(coreEntries.length, 6);
      assert.equal(wasteDynamicEntries.length, 840);
      assert.equal(demolitionDynamicEntries.length, 540);
    });

    it('Sitemap에 포함된 모든 동적 URL은 PageContext의 Canonical URL과 100% 일치해야 한다', () => {
      const entries = getIndexableUrlEntries();
      const dynamicEntries = entries.filter((e) => e.type === 'DYNAMIC');

      for (const entry of dynamicEntries) {
        const urlObj = new URL(entry.url);
        const kParam = urlObj.searchParams.get('k');
        assert.ok(kParam, `k 파라미터 누락: ${entry.url}`);

        const resolved = resolveBaseRoute(kParam);
        assert.ok(resolved, `해석 불가 URL: ${entry.url}`);

        const context = createPageContext(resolved);
        const expectedCanonical = getAbsoluteUrl(`/?k=${context.canonicalRoute}`);

        assert.equal(
          entry.url,
          expectedCanonical,
          `Sitemap URL(${entry.url})과 Canonical(${expectedCanonical}) 불일치`
        );
      }
    });

    it('Sitemap에 중복 URL이 단 1개도 없어야 한다 (Duplicate URL = 0)', () => {
      const urls = getIndexableUrls();
      assert.equal(new Set(urls).size, 1386);
    });

    it('Sitemap에 테스트용 Fixture(안산시 중앙동, 역삼동)가 노출되지 않아야 한다', () => {
      const urls = getIndexableUrls();
      for (const url of urls) {
        assert.ok(!url.includes('안산시-중앙동'), '안산시 중앙동 Fixture 누출');
        assert.ok(!url.includes('역삼동'), '역삼동 Fixture 누출');
      }
    });
  });
});

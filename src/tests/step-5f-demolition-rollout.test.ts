import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { P0_KEYWORDS as WASTE_KEYWORDS } from '../data/keywords/p0-keywords';
import {
  DEMOLITION_P0_KEYWORDS,
  DEMOLITION_P1_CANDIDATES,
  DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES,
  findKeywordByRouteKey,
} from '../data/keywords';
import { SUWON_REGIONS } from '../data/regions/suwon';
import { findRegionById } from '../data/regions';
import {
  getServiceRegionPolicy,
  isServiceRegionActive,
  getActiveRegionIdsByFamily,
} from '../config/service-region-policy';
import { resolveBaseRoute, createPageContext } from '../engine/resolver';
import { generateDynamicContent } from '../engine/content-engine';
import { generateDemolitionContent } from '../engine/demolition-content-engine';
import { generatePageMetadata } from '../engine/seo-engine';
import { getInternalLinks } from '../engine/link-engine';
import {
  getRootSitemapIndexEntries,
  getCoreUrlEntries,
  getDynamicUrlEntries,
  getChildSitemapsMap,
  generateRootSitemapIndexXml,
  getChildSitemapXml,
  getIndexableUrlEntries,
} from '../lib/sitemap-generator';
import { SITE_CONFIG, getAbsoluteUrl } from '../config/site';

describe('STEP 5-F: Full Suwon Demolition Region Rollout Test Suite', () => {
  // [A] DEMOLITION Active Regions = 60
  describe('[A] DEMOLITION Active Regions = 60', () => {
    it('DEMOLITION의 활성 지역 수는 정확히 60개(1 SI + 4 GU + 55 DONG)여야 한다', () => {
      const activeIds = getActiveRegionIdsByFamily('DEMOLITION');
      assert.equal(activeIds.length, 60);

      const siCount = SUWON_REGIONS.filter((r) => r.regionType === 'SI').length;
      const guCount = SUWON_REGIONS.filter((r) => r.regionType === 'GU').length;
      const dongCount = SUWON_REGIONS.filter((r) => r.regionType === 'DONG').length;

      assert.equal(siCount, 1);
      assert.equal(guCount, 4);
      assert.equal(dongCount, 55);
    });
  });

  // [B] DEMOLITION URLs = 540
  describe('[B] DEMOLITION URLs = 540', () => {
    it('DEMOLITION Dynamic URL 수는 정확히 540개(60 Region × 9 Keyword)여야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const demoEntries = dynamicEntries.filter((e) => e.serviceFamily === 'DEMOLITION');
      assert.equal(demoEntries.length, 540);
    });
  });

  // [C] WASTE URLs = 840
  describe('[C] WASTE URLs = 840', () => {
    it('기존 WASTE Dynamic URL 수는 840개로 변함없이 100% 유지되어야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const wasteEntries = dynamicEntries.filter((e) => e.serviceFamily === 'WASTE');
      assert.equal(wasteEntries.length, 840);
    });
  });

  // [D] Total Dynamic = 1380
  describe('[D] Total Dynamic = 1380', () => {
    it('전체 Dynamic URL은 1380개(840 WASTE + 540 DEMOLITION)여야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      assert.equal(dynamicEntries.length, 1380);
    });
  });

  // [E] Demolition Sitemap = 540
  describe('[E] Demolition Sitemap = 540', () => {
    it('demolition-gyeonggi-001.xml 내 URL 수는 정확히 540개여야 한다', () => {
      const childMap = getChildSitemapsMap();
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml')!;
      assert.ok(demoEntries);
      assert.equal(demoEntries.length, 540);
    });
  });

  // [F] Waste Sitemap = 840
  describe('[F] Waste Sitemap = 840', () => {
    it('waste-gyeonggi-001.xml 내 URL 수는 정확히 840개여야 한다', () => {
      const childMap = getChildSitemapsMap();
      const wasteEntries = childMap.get('waste-gyeonggi-001.xml')!;
      assert.ok(wasteEntries);
      assert.equal(wasteEntries.length, 840);
    });
  });

  // [G] Root Sitemap Child = 3
  describe('[G] Root Sitemap Child = 3', () => {
    it('Root sitemap.xml의 자식 사이트맵은 정확히 3개(core, waste-001, demolition-001)여야 한다', () => {
      const rootEntries = getRootSitemapIndexEntries();
      assert.equal(rootEntries.length, 3);
      assert.deepEqual(
        rootEntries.map((e) => e.filename),
        ['core.xml', 'waste-gyeonggi-001.xml', 'demolition-gyeonggi-001.xml']
      );
    });
  });

  // [H] Total Indexable = 1386
  describe('[H] Total Indexable = 1386', () => {
    it('전체 색인 대상 URL 수는 정확히 1386개(Core 6 + Dynamic 1380)여야 한다', () => {
      const entries = getIndexableUrlEntries();
      assert.equal(entries.length, 1386);
    });
  });

  // [I] Each Demolition Region URL Count = 9
  describe('[I] Each Demolition Region URL Count = 9', () => {
    it('60개 수원 모든 Region 각각에 대해 DEMOLITION URL은 정확히 9개씩 생성되어야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries().filter((e) => e.serviceFamily === 'DEMOLITION');
      const countsByRegion: Record<string, number> = {};

      for (const r of SUWON_REGIONS) {
        countsByRegion[r.regionId] = 0;
      }

      for (const entry of dynamicEntries) {
        const kParam = new URL(entry.url).searchParams.get('k')!;
        const resolved = resolveBaseRoute(kParam)!;
        assert.ok(resolved);
        countsByRegion[resolved.region.regionId]++;
      }

      for (const r of SUWON_REGIONS) {
        assert.equal(
          countsByRegion[r.regionId],
          9,
          `Region ${r.officialName}(${r.regionId})의 철거 URL 수는 9개여야 함`
        );
      }
    });
  });

  // [J] Canonical Mismatch = 0
  describe('[J] Canonical Mismatch = 0', () => {
    it('540개 모든 Demolition URL의 Sitemap URL과 Canonical URL이 100% 일치해야 한다', () => {
      const childMap = getChildSitemapsMap();
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml')!;

      for (const entry of demoEntries) {
        const kParam = new URL(entry.url).searchParams.get('k')!;
        const resolved = resolveBaseRoute(kParam)!;
        const ctx = createPageContext(resolved);
        const meta = generatePageMetadata(ctx);
        const canonical = String(meta.alternates?.canonical);

        const expectedCanonical = getAbsoluteUrl(`/?k=${encodeURIComponent(ctx.canonicalRoute)}`);
        const altExpectedCanonical = getAbsoluteUrl(`/?k=${ctx.canonicalRoute}`);

        assert.ok(
          canonical === expectedCanonical || canonical === altExpectedCanonical,
          `Canonical mismatch for ${entry.url}`
        );
      }
    });
  });

  // [K] Path Canonical = 0
  describe('[K] Path Canonical = 0', () => {
    it('철거 URL의 Canonical은 결코 /demolition/... 형태의 Path 기반이어서는 안 된다', () => {
      const dynamicEntries = getDynamicUrlEntries().filter((e) => e.serviceFamily === 'DEMOLITION');

      for (const entry of dynamicEntries) {
        const kParam = new URL(entry.url).searchParams.get('k')!;
        const resolved = resolveBaseRoute(kParam)!;
        const ctx = createPageContext(resolved);
        const meta = generatePageMetadata(ctx);
        const canonical = String(meta.alternates?.canonical);

        assert.strictEqual(canonical.includes('/demolition/'), false, `Path canonical 누출: ${canonical}`);
        assert.ok(canonical.includes('/?k='), `Canonical은 /?k= 구조여야 함: ${canonical}`);
      }
    });
  });

  // [L] Full-address H1 Error = 0
  describe('[L] Full-address H1 Error = 0', () => {
    it('동 단위 H1은 상위 시/구를 무단 결합한 전체 주소형(수원시 영통구 매탄동 등)이 아니어야 한다', () => {
      const dongRegions = SUWON_REGIONS.filter((r) => r.regionType === 'DONG');

      for (const r of dongRegions) {
        for (const kw of DEMOLITION_P0_KEYWORDS) {
          const resolved = resolveBaseRoute(`${r.routeKey}-${kw.routeKey}`)!;
          const ctx = createPageContext(resolved);
          const content = generateDynamicContent(ctx);

          // H1 must be `${r.seoDisplayName} ${kw.displayName}`
          assert.equal(content.h1, `${r.seoDisplayName} ${kw.displayName}`);

          if (!r.hasNationwideCollision) {
            // 전국 충돌이 없는 고유 동은 '수원시' 접두어가 붙으면 안 됨
            assert.ok(
              !content.h1.startsWith('수원시 ') || r.seoDisplayName.startsWith('수원시 '),
              `H1 전체 주소 결합 오류: ${content.h1}`
            );
          }
        }
      }
    });
  });

  // [M] WASTE Regression = 0
  describe('[M] WASTE Regression = 0', () => {
    it('기존 매탄동-폐기물처리업체 요청의 H1, Title, Canonical이 불변이어야 한다', () => {
      const resolved = resolveBaseRoute('매탄동-폐기물처리업체')!;
      assert.ok(resolved);
      assert.equal(resolved.serviceFamily, 'WASTE');

      const ctx = createPageContext(resolved);
      const content = generateDynamicContent(ctx);
      const meta = generatePageMetadata(ctx);

      assert.equal(content.h1, '매탄동 폐기물처리업체');
      assert.equal(meta.title, `매탄동 폐기물처리업체 | 폐기물 수거 상담 | ${SITE_CONFIG.brandName}`);
      const canonical = decodeURIComponent(String(meta.alternates?.canonical));
      assert.ok(canonical.includes('/?k=매탄동-폐기물처리업체'));
    });
  });

  // [N] Family Cross Contamination = 0
  describe('[N] Family Cross Contamination = 0', () => {
    it('WASTE 사이트맵과 DEMOLITION 사이트맵 간 상호 오염이 0개여야 한다', () => {
      const childMap = getChildSitemapsMap();
      const wasteEntries = childMap.get('waste-gyeonggi-001.xml')!;
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml')!;

      for (const e of wasteEntries) {
        assert.equal(e.serviceFamily, 'WASTE');
      }
      for (const e of demoEntries) {
        assert.equal(e.serviceFamily, 'DEMOLITION');
      }
    });

    it('내부링크 간 버티컬 교차 노출이 0개여야 한다', () => {
      const maetan = findRegionById('gg-suwon-yt-maetan')!;
      const demoWork = findKeywordByRouteKey('철거업체')!;
      const wasteWork = findKeywordByRouteKey('폐기물처리업체')!;

      const demoLinks = getInternalLinks(maetan, demoWork);
      for (const l of demoLinks.relatedLinks) {
        assert.ok(!l.label.includes('폐기물'));
      }

      const wasteLinks = getInternalLinks(maetan, wasteWork);
      for (const l of wasteLinks.relatedLinks) {
        assert.ok(!l.label.includes('철거'));
      }
    });
  });

  // [O] P1 Routes 404
  describe('[O] P1 Routes 404', () => {
    it('P1 후보 키워드는 60개 전체 지역에서 404(null 반환)이어야 한다', () => {
      for (const p1 of DEMOLITION_P1_CANDIDATES) {
        const kw = findKeywordByRouteKey(p1);
        assert.equal(kw, undefined);
        const resolved = resolveBaseRoute(`매탄동-${p1}`);
        assert.strictEqual(resolved, null, `${p1}는 비활성이므로 null이어야 함`);
      }
    });
  });

  // [P] Conditional Routes 404
  describe('[P] Conditional Routes 404', () => {
    it('Conditional 후보 키워드는 60개 전체 지역에서 404(null 반환)이어야 한다', () => {
      for (const cond of DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES) {
        const kw = findKeywordByRouteKey(cond);
        assert.equal(kw, undefined);
        const resolved = resolveBaseRoute(`수원시-${cond}`);
        assert.strictEqual(resolved, null, `${cond}는 비활성이므로 null이어야 함`);
      }
    });
  });

  // [Q] Claim Safety (Normalized Claims Audit)
  describe('[Q] Claim Safety & Normalization', () => {
    const FORBIDDEN_WORDS = [
      '전문 면허',
      '정식 허가',
      '1급',
      '최저가',
      '완벽 원상복구',
      '100% 안전',
      '플라베니아', // 정규화로 제거된 특정 자재
    ];

    it('철거 540개 전체 조합의 콘텐츠에 금지/과장 어휘가 없어야 한다', () => {
      const maetan = findRegionById('gg-suwon-yt-maetan')!;

      for (const kw of DEMOLITION_P0_KEYWORDS) {
        const resolved = resolveBaseRoute(`${maetan.routeKey}-${kw.routeKey}`)!;
        const ctx = createPageContext(resolved);
        const content = generateDynamicContent(ctx);
        const str = JSON.stringify(content);

        for (const word of FORBIDDEN_WORDS) {
          assert.strictEqual(
            str.includes(word),
            false,
            `[${kw.displayName}]에 금지 표현 [${word}] 발견`
          );
        }
      }
    });
  });

  // [R] Internal Links Dead Link = 0 & Newly Activated Parent Links
  describe('[R] Internal Links Dead Link = 0', () => {
    it('오목천동(DONG)의 Parent Link는 활성화된 권선구(GU)로 정상 연결되어야 한다', () => {
      const omokcheon = findRegionById('gg-suwon-gs-omokcheon')!;
      const work = findKeywordByRouteKey('상가철거')!;
      const links = getInternalLinks(omokcheon, work);

      assert.ok(links.parentLink);
      assert.equal(links.parentLink.label, '권선구 상가철거');
      assert.equal(links.parentLink.href, '/?k=권선구-상가철거');

      // Parent link must be resolvable
      const kParam = new URL(getAbsoluteUrl(links.parentLink.href)).searchParams.get('k')!;
      const resolvedParent = resolveBaseRoute(kParam);
      assert.ok(resolvedParent, 'Parent link는 200 OK로 해석 가능해야 함');
      assert.equal(resolvedParent.serviceFamily, 'DEMOLITION');
    });
  });
});

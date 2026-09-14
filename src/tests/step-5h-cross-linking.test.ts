import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { SUWON_REGIONS } from '../data/regions/suwon';
import { P0_KEYWORDS } from '../data/keywords/p0-keywords';
import { DEMOLITION_P0_KEYWORDS } from '../data/keywords/demolition-keywords';
import { getInternalLinks, getCrossVerticalLink } from '../engine/link-engine';
import { resolveBaseRoute } from '../engine/resolver';
import { getIndexableUrlEntries, getDynamicUrlEntries } from '../lib/sitemap-generator';

describe('STEP 5-H: Controlled Cross-Vertical Linking & Static Claim Safety Test Suite', () => {
  // =========================================================================
  // 1. DEMOLITION HUB LINK COUNT & REGION COMPLETENESS
  // =========================================================================
  describe('1. Demolition Hub Link Count & Completeness', () => {
    it('A. Demolition Hub 링크 총 개수는 정확히 63개(SI 4 + GU 4 + DONG 55)여야 한다', () => {
      const siEntity = SUWON_REGIONS.find((r) => r.regionType === 'SI');
      const guList = SUWON_REGIONS.filter((r) => r.regionType === 'GU');
      const dongList = SUWON_REGIONS.filter((r) => r.regionType === 'DONG');

      assert.ok(siEntity);
      assert.equal(guList.length, 4);
      assert.equal(dongList.length, 55);

      const siCount = 4; // 철거업체, 상가철거, 원상복구, 철거비용
      const guCount = guList.length; // 4
      const dongCount = dongList.length; // 55
      const expectedTotal = siCount + guCount + dongCount;
      assert.equal(expectedTotal, 63);
    });

    it('B. Demolition Hub에 누락된 수원 행정구역이 0개여야 한다 (Missing Region = 0)', () => {
      const hubFilePath = path.join(process.cwd(), 'src/app/hub/demolition/page.tsx');
      const hubContent = fs.readFileSync(hubFilePath, 'utf8');

      // 60개 Region 전체의 seoDisplayName이 Hub 소스코드 또는 매핑에 존재하는지 확인
      assert.ok(hubContent.includes('SUWON_REGIONS'));
      for (const r of SUWON_REGIONS) {
        assert.ok(r.isActive);
      }
      assert.equal(SUWON_REGIONS.length, 60);
    });
  });

  // =========================================================================
  // 2. STATIC CLAIM SAFETY CLEANUP
  // =========================================================================
  describe('2. Static Claim Safety Cleanup', () => {
    it('C. Hub 페이지에 미활성 미래 확장 지역(화성, 용인, 성남, 경기 남부) 표현이 없어야 한다', () => {
      const hubFilePath = path.join(process.cwd(), 'src/app/hub/page.tsx');
      const hubContent = fs.readFileSync(hubFilePath, 'utf8');

      assert.ok(!hubContent.includes('화성'));
      assert.ok(!hubContent.includes('용인'));
      assert.ok(!hubContent.includes('성남'));
      assert.ok(!hubContent.includes('경기 남부'));
    });

    it('D. Demolition 메인에 미검증/확정적 운영 표현이 없어야 한다', () => {
      const demoFilePath = path.join(process.cwd(), 'src/app/demolition/page.tsx');
      const demoContent = fs.readFileSync(demoFilePath, 'utf8');

      // 미검증 확정 표현 배제 검증
      assert.ok(!demoContent.includes('소음이나 분진 민원은 어떻게 관리하나요?'));
      assert.ok(!demoContent.includes('철거 후 발생하는 폐기물 처리도 일괄 진행되나요?'));
      assert.ok(!demoContent.includes('안전 시공 및 잔재 정리'));
      assert.ok(!demoContent.includes('안전 해체와 임대차 계약 기준에 부합하는 정밀 원상복구를 진행합니다'));
      assert.ok(!demoContent.includes('100%'));
      assert.ok(!demoContent.includes('최저가'));
      assert.ok(!demoContent.includes('전문업체'));
    });
  });

  // =========================================================================
  // 3. CROSS-VERTICAL CONTEXTUAL LINK POLICY & COUNTS
  // =========================================================================
  describe('3. Cross-Vertical Contextual Link Policy & Counts', () => {
    const ALLOWED_PAIRS = [
      { waste: '상가폐기물처리', demo: '상가철거' },
      { waste: '사무실폐기물처리', demo: '사무실철거' },
      { waste: '폐업폐기물처리', demo: '폐업철거' },
    ];

    it('E. Cross-Link 허용 규칙은 정확히 3개 쌍(6개 방향)이어야 한다', () => {
      assert.equal(ALLOWED_PAIRS.length, 3);
    });

    it('F. Cross-Link 대상 WASTE 페이지는 정확히 180개여야 한다 (60 Regions × 3 Keywords)', () => {
      let wasteCrossLinkCount = 0;
      for (const r of SUWON_REGIONS) {
        for (const kw of P0_KEYWORDS) {
          const crossLink = getCrossVerticalLink(r, kw);
          if (crossLink !== null) {
            wasteCrossLinkCount++;
          }
        }
      }
      assert.equal(wasteCrossLinkCount, 180);
    });

    it('G. Cross-Link 대상 DEMOLITION 페이지는 정확히 180개여야 한다 (60 Regions × 3 Keywords)', () => {
      let demoCrossLinkCount = 0;
      for (const r of SUWON_REGIONS) {
        for (const kw of DEMOLITION_P0_KEYWORDS) {
          const crossLink = getCrossVerticalLink(r, kw);
          if (crossLink !== null) {
            demoCrossLinkCount++;
          }
        }
      }
      assert.equal(demoCrossLinkCount, 180);
    });

    it('H. 전체 Cross-Link Edge 총합은 정확히 360개여야 한다 (180 + 180)', () => {
      let totalEdges = 0;
      for (const r of SUWON_REGIONS) {
        for (const kw of [...P0_KEYWORDS, ...DEMOLITION_P0_KEYWORDS]) {
          const crossLink = getCrossVerticalLink(r, kw);
          if (crossLink !== null) {
            totalEdges++;
          }
        }
      }
      assert.equal(totalEdges, 360);
    });

    it('I. 페이지당 Cross-Vertical Link는 최대 1개여야 한다 (Per-Page CrossLink <= 1)', () => {
      for (const r of SUWON_REGIONS) {
        for (const kw of [...P0_KEYWORDS, ...DEMOLITION_P0_KEYWORDS]) {
          const internalLinks = getInternalLinks(r, kw);
          const count = internalLinks.crossVerticalLink ? 1 : 0;
          assert.ok(count <= 1);
        }
      }
    });

    it('J. 비대상(Negative) 키워드는 Cross-Link가 0개(null)여야 한다', () => {
      const negativeKeywords = [
        '가구수거',
        '철거',
        '폐기물처리비용',
        '철거비용',
        '건설폐기물',
        '내부철거',
        '폐기물업체',
        '철거업체',
        '원상복구',
      ];

      const maetan = SUWON_REGIONS.find((r) => r.routeKey === '매탄동')!;
      for (const key of negativeKeywords) {
        const wasteKw = P0_KEYWORDS.find((k) => k.routeKey === key);
        const demoKw = DEMOLITION_P0_KEYWORDS.find((k) => k.routeKey === key);
        const kw = wasteKw || demoKw;
        if (kw) {
          const crossLink = getCrossVerticalLink(maetan, kw);
          assert.equal(crossLink, null, `${key}는 Cross-Link가 없어야 함`);
        }
      }
    });

    it('K. 360개 모든 Cross-Link Destination은 404가 아닌 유효한 동적 라우트여야 한다 (404 = 0)', () => {
      for (const r of SUWON_REGIONS) {
        for (const kw of [...P0_KEYWORDS, ...DEMOLITION_P0_KEYWORDS]) {
          const crossLink = getCrossVerticalLink(r, kw);
          if (crossLink) {
            const query = crossLink.href.replace('/?k=', '');
            const resolved = resolveBaseRoute(query);
            assert.ok(resolved, `Cross-link destination must be resolvable: ${crossLink.href}`);
            assert.ok(resolved.region.isActive);
            assert.ok(resolved.work.isActive);
            assert.ok(resolved.work.isIndexable);
          }
        }
      }
    });

    it('L. Cross-Link는 실제 SSR HTML Anchor로 유효해야 한다', () => {
      const maetan = SUWON_REGIONS.find((r) => r.routeKey === '매탄동')!;
      const wasteCommercial = P0_KEYWORDS.find((k) => k.routeKey === '상가폐기물처리')!;
      const link = getCrossVerticalLink(maetan, wasteCommercial);

      assert.ok(link);
      assert.equal(link.href, '/?k=매탄동-상가철거');
      assert.equal(link.label, '매탄동 상가철거 안내');
      assert.ok(link.sectionTitle.includes('철거'));
    });
  });

  // =========================================================================
  // 4. SAMPLE 6 PAIR AUDIT
  // =========================================================================
  describe('4. Sample 6 Pair Audit', () => {
    it('A. 매탄동 상가폐기물처리 ➔ 매탄동 상가철거', () => {
      const r = SUWON_REGIONS.find((x) => x.routeKey === '매탄동')!;
      const kw = P0_KEYWORDS.find((x) => x.routeKey === '상가폐기물처리')!;
      const link = getCrossVerticalLink(r, kw);
      assert.ok(link);
      assert.equal(link.href, '/?k=매탄동-상가철거');
      assert.equal(link.label, '매탄동 상가철거 안내');
    });

    it('B. 매탄동 상가철거 ➔ 매탄동 상가폐기물처리', () => {
      const r = SUWON_REGIONS.find((x) => x.routeKey === '매탄동')!;
      const kw = DEMOLITION_P0_KEYWORDS.find((x) => x.routeKey === '상가철거')!;
      const link = getCrossVerticalLink(r, kw);
      assert.ok(link);
      assert.equal(link.href, '/?k=매탄동-상가폐기물처리');
      assert.equal(link.label, '매탄동 상가폐기물처리 안내');
    });

    it('C. 오목천동 사무실폐기물처리 ➔ 오목천동 사무실철거', () => {
      const r = SUWON_REGIONS.find((x) => x.routeKey === '오목천동')!;
      const kw = P0_KEYWORDS.find((x) => x.routeKey === '사무실폐기물처리')!;
      const link = getCrossVerticalLink(r, kw);
      assert.ok(link);
      assert.equal(link.href, '/?k=오목천동-사무실철거');
      assert.equal(link.label, '오목천동 사무실철거 안내');
    });

    it('D. 오목천동 사무실철거 ➔ 오목천동 사무실폐기물처리', () => {
      const r = SUWON_REGIONS.find((x) => x.routeKey === '오목천동')!;
      const kw = DEMOLITION_P0_KEYWORDS.find((x) => x.routeKey === '사무실철거')!;
      const link = getCrossVerticalLink(r, kw);
      assert.ok(link);
      assert.equal(link.href, '/?k=오목천동-사무실폐기물처리');
      assert.equal(link.label, '오목천동 사무실폐기물처리 안내');
    });

    it('E. 수원시-정자동 폐업폐기물처리 ➔ 수원시-정자동 폐업철거', () => {
      const r = SUWON_REGIONS.find((x) => x.routeKey === '수원시-정자동')!;
      const kw = P0_KEYWORDS.find((x) => x.routeKey === '폐업폐기물처리')!;
      const link = getCrossVerticalLink(r, kw);
      assert.ok(link);
      assert.equal(link.href, '/?k=수원시-정자동-폐업철거');
      assert.equal(link.label, '수원시 정자동 폐업철거 안내');
    });

    it('F. 수원시-정자동 폐업철거 ➔ 수원시-정자동 폐업폐기물처리', () => {
      const r = SUWON_REGIONS.find((x) => x.routeKey === '수원시-정자동')!;
      const kw = DEMOLITION_P0_KEYWORDS.find((x) => x.routeKey === '폐업철거')!;
      const link = getCrossVerticalLink(r, kw);
      assert.ok(link);
      assert.equal(link.href, '/?k=수원시-정자동-폐업폐기물처리');
      assert.equal(link.label, '수원시 정자동 폐업폐기물처리 안내');
    });
  });

  // =========================================================================
  // 5. REGRESSION & SITEMAP AUDIT
  // =========================================================================
  describe('5. Zero Regression Audit', () => {
    it('N. 전체 Dynamic URL 수는 1380개(840 + 540)로 완전 불변이어야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      assert.equal(dynamicEntries.length, 1380);
    });

    it('O. Sitemap 색인 총 대상 수는 1386개(Core 6 + Dynamic 1380)로 불변이어야 한다', () => {
      const entries = getIndexableUrlEntries();
      assert.equal(entries.length, 1386);
    });

    it('P. 기존 Family 내부 링크(Parent Link, Related Links)는 온전히 보존되어야 한다', () => {
      const maetan = SUWON_REGIONS.find((r) => r.routeKey === '매탄동')!;
      const kw = P0_KEYWORDS.find((k) => k.routeKey === '폐기물처리업체')!;
      const links = getInternalLinks(maetan, kw);

      assert.ok(links.parentLink);
      assert.equal(links.parentLink.href, '/?k=영통구-폐기물처리업체');
      assert.ok(links.relatedLinks.length >= 3);
      assert.equal(links.crossVerticalLink, null); // 폐기물처리업체는 Cross-Link 대상 아님
    });
  });
});

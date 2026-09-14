import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { P0_KEYWORDS as WASTE_KEYWORDS } from '../data/keywords/p0-keywords';
import {
  DEMOLITION_P0_KEYWORDS,
  ALL_KEYWORDS,
  findKeywordByRouteKey,
} from '../data/keywords';
import { SUWON_REGIONS } from '../data/regions/suwon';
import { findRegionById } from '../data/regions';
import {
  SERVICE_FAMILY_REGISTRY,
  getServiceFamilyConfig,
  getActiveServiceFamilies,
} from '../config/service-family';
import {
  getServiceRegionPolicy,
  isServiceRegionActive,
  getDemolitionPilotRegionIds,
  getActiveRegionIdsByFamily,
} from '../config/service-region-policy';
import { resolveBaseRoute, createPageContext } from '../engine/resolver';
import { generateDynamicContent } from '../engine/content-engine';
import { generateDemolitionContent } from '../engine/demolition-content-engine';
import { generatePageMetadata } from '../engine/seo-engine';
import { getInternalLinks, getParentRegionLink, getRelatedIntentLinks } from '../engine/link-engine';
import {
  getRootSitemapIndexEntries,
  getCoreUrlEntries,
  getDynamicUrlEntries,
  getChildSitemapsMap,
  generateRootSitemapIndexXml,
  getChildSitemapXml,
  buildSitemapChunks,
  IndexableUrlEntry,
} from '../lib/sitemap-generator';
import { SITE_CONFIG, getAbsoluteUrl } from '../config/site';

describe('STEP 5-D: Demolition Content Engine & 45 Pilot URL Activation Test Suite', () => {
  // =========================================================================
  // [A] 9 DEMOLITION CONTENT TEMPLATES COMPLETENESS
  // =========================================================================
  describe('[A] 9 DEMOLITION Content Templates Completeness', () => {
    it('철거 9개 키워드 각각에 대해 결정론적 콘텐츠가 온전하게 생성되어야 한다', () => {
      const region = SUWON_REGIONS.find((r) => r.regionId === 'gg-suwon-yt-maetan')!;

      for (const kw of DEMOLITION_P0_KEYWORDS) {
        const resolved = resolveBaseRoute(`${region.routeKey}-${kw.routeKey}`)!;
        assert.ok(resolved, `${region.routeKey}-${kw.routeKey} 해석 성공`);
        const ctx = createPageContext(resolved);
        const content = generateDynamicContent(ctx);

        // H1 check
        assert.equal(content.h1, `${region.seoDisplayName} ${kw.displayName}`);
        // Hero Hook & Description
        assert.ok(content.heroHook.length > 10);
        assert.ok(content.heroDescription.includes(region.seoDisplayName));
        // Section titles & items
        assert.ok(content.serviceSectionTitle.length > 0);
        assert.equal(content.serviceItems.length, 4);
        assert.ok(content.decisionTitle.length > 0);
        assert.equal(content.decisionPoints.length, 3);
        assert.ok(content.estimateTitle.length > 0);
        assert.ok(content.estimateDescription.length > 10);
        assert.ok(content.processTitle.length > 0);
        assert.equal(content.faqItems.length, 4);
        assert.ok(content.finalCtaTitle.length > 0);
        assert.ok(content.finalCtaDescription.includes(region.seoDisplayName));
      }
    });
  });

  // =========================================================================
  // [B] EXACT H1 FORMAT (1 per page: {seoDisplayName} {workKeyword.displayName})
  // =========================================================================
  describe('[B] Exact H1 Format', () => {
    it('모든 철거 Dynamic 페이지의 H1은 정확히 {seoDisplayName} {workKeyword.displayName} 형식이어야 한다', () => {
      const testCases = [
        { query: '매탄동-상가철거', expectedH1: '매탄동 상가철거' },
        { query: '수원시-철거비용', expectedH1: '수원시 철거비용' },
        { query: '영통구-내부철거', expectedH1: '영통구 내부철거' },
        { query: '수원시-정자동-사무실철거', expectedH1: '수원시 정자동 사무실철거' },
        { query: '오목천동-원상복구', expectedH1: '오목천동 원상복구' },
      ];

      for (const tc of testCases) {
        const resolved = resolveBaseRoute(tc.query)!;
        assert.ok(resolved, `${tc.query} 해석 성공`);
        const ctx = createPageContext(resolved);
        const content = generateDynamicContent(ctx);
        assert.equal(content.h1, tc.expectedH1);
      }
    });
  });

  // =========================================================================
  // [C] CLAIM SAFETY AUDIT (Zero unverified claims)
  // =========================================================================
  describe('[C] Demolition Claim Safety Audit', () => {
    const FORBIDDEN_STRINGS = [
      '전문 면허',
      '정식 허가 철거업체',
      '1급 철거',
      '최저가',
      '완벽 원상복구',
      '100% 안전',
      '무조건 당일',
      '추가비용 일체 없음',
    ];

    it('9개 철거 키워드의 생성 콘텐츠에 미검증/과장 표현이 전혀 없어야 한다', () => {
      const region = SUWON_REGIONS.find((r) => r.regionId === 'gg-suwon-yt-maetan')!;

      for (const kw of DEMOLITION_P0_KEYWORDS) {
        const resolved = resolveBaseRoute(`${region.routeKey}-${kw.routeKey}`)!;
        const ctx = createPageContext(resolved);
        const content = generateDynamicContent(ctx);
        const serialized = JSON.stringify(content);

        for (const forbidden of FORBIDDEN_STRINGS) {
          assert.strictEqual(
            serialized.includes(forbidden),
            false,
            `[${kw.displayName}] 콘텐츠에 금지된 표현 [${forbidden}] 발견`
          );
        }
      }
    });
  });

  // =========================================================================
  // [D] CONDITION-BASED STATEMENTS (No fabrication)
  // =========================================================================
  describe('[D] Condition-Based Statements', () => {
    it('건물 및 현장 여건은 조건부("~있는 경우", "~라면")로 표현되어야 한다', () => {
      const region = SUWON_REGIONS.find((r) => r.regionId === 'gg-suwon-yt-maetan')!;
      const resolved = resolveBaseRoute('매탄동-철거')!;
      const ctx = createPageContext(resolved);
      const content = generateDynamicContent(ctx);

      const decisionText = content.decisionPoints.map((p) => p.desc).join(' ');
      assert.ok(
        decisionText.includes('건물 관리규정이 있는 현장의 경우') ||
        decisionText.includes('경우') ||
        decisionText.includes('라면'),
        '현장 여건은 조건부 서술을 따라야 함'
      );
    });
  });

  // =========================================================================
  // [E] SERVICE FAMILY-FIRST CONTENT ROUTING
  // =========================================================================
  describe('[E] Service Family-First Content Routing', () => {
    it('동일/유사 Intent라도 serviceFamily에 따라 다른 콘텐츠 엔진으로 라우팅되어야 한다', () => {
      const wasteResolved = resolveBaseRoute('매탄동-사무실폐기물처리')!;
      const wasteCtx = createPageContext(wasteResolved);
      const wasteContent = generateDynamicContent(wasteCtx);

      const demoResolved = resolveBaseRoute('매탄동-사무실철거')!;
      const demoCtx = createPageContext(demoResolved);
      const demoContent = generateDynamicContent(demoCtx);

      // Verify separation
      assert.notEqual(wasteContent.serviceSectionTitle, demoContent.serviceSectionTitle);
      assert.notEqual(wasteContent.heroHook, demoContent.heroHook);
      assert.notEqual(wasteContent.decisionTitle, demoContent.decisionTitle);
      assert.ok(wasteContent.serviceItems.some((i) => i.includes('책상') || i.includes('파티션') || i.includes('집기')));
      assert.ok(demoContent.serviceItems.some((i) => i.includes('칸막이') || i.includes('철거')));
    });
  });

  // =========================================================================
  // [F] DEMOLITION METADATA & SEO ENGINE
  // =========================================================================
  describe('[F] Demolition Metadata & SEO Engine', () => {
    it('철거 Dynamic 페이지의 Title과 Description이 철거 전용으로 안전하게 생성되어야 한다', () => {
      const resolved = resolveBaseRoute('매탄동-철거비용')!;
      const ctx = createPageContext(resolved);
      const metadata = generatePageMetadata(ctx);

      assert.equal(metadata.title, `매탄동 철거비용 | 투명한 철거 견적 기준 | ${SITE_CONFIG.brandName}`);
      assert.ok(String(metadata.description).includes('매탄동 철거비용 상담'));
      assert.ok(String(metadata.description).includes('마감재 성상과 폐기물 반출 여건'));
      assert.ok(!String(metadata.description).includes('폐기물 수거 절차'));
      assert.equal(
        metadata.alternates?.canonical,
        getAbsoluteUrl(`/?k=${encodeURIComponent('매탄동-철거비용')}`)
      );
    });
  });

  // =========================================================================
  // [G] 9 DEMOLITION KEYWORDS ACTIVATED (isActive=true, isIndexable=true)
  // =========================================================================
  describe('[G] 9 DEMOLITION Keywords Activated', () => {
    it('DEMOLITION 9개 P0 키워드는 모두 isActive=true, isIndexable=true 여야 한다', () => {
      assert.equal(DEMOLITION_P0_KEYWORDS.length, 9);
      for (const kw of DEMOLITION_P0_KEYWORDS) {
        assert.equal(kw.isActive, true, `${kw.displayName} 활성화 상태 확인`);
        assert.equal(kw.isIndexable, true, `${kw.displayName} 색인 가능 상태 확인`);
      }
    });
  });

  // =========================================================================
  // [H] 60 DEMOLITION REGIONS ACTIVATED
  // =========================================================================
  describe('[H] 60 DEMOLITION Regions Activated', () => {
    it('전체 60개 수원 지역은 DEMOLITION에서 활성화되어야 한다', () => {
      const activeDemoRegionIds = getActiveRegionIdsByFamily('DEMOLITION');
      assert.equal(activeDemoRegionIds.length, 60);

      for (const r of SUWON_REGIONS) {
        const policy = getServiceRegionPolicy('DEMOLITION', r.regionId);
        assert.ok(policy, `${r.regionId} DEMOLITION 정책 존재`);
        assert.equal(policy.isActive, true);
        assert.equal(policy.isIndexable, true);
        assert.equal(policy.isSitemapEligible, true);
        assert.equal(isServiceRegionActive('DEMOLITION', r.regionId), true);
      }
    });
  });

  // =========================================================================
  // [I] NON-SUWON REGIONS INACTIVE IN DEMOLITION (HTTP 404)
  // =========================================================================
  describe('[I] Non-Suwon Regions Inactive in DEMOLITION (HTTP 404)', () => {
    it('수원 외 타 지자체 및 Fixture 지역은 DEMOLITION에서 비활성이어야 한다 (null 반환 -> 404)', () => {
      const nonDemoQueries = [
        '안산시-중앙동-철거',
        '역삼동-철거업체',
      ];

      for (const q of nonDemoQueries) {
        const res = resolveBaseRoute(q);
        assert.strictEqual(res, null, `${q}는 DEMOLITION 미활성 지역이므로 null이어야 함`);
      }
    });
  });

  // =========================================================================
  // [J] EXACT 540 DEMOLITION DYNAMIC URLS
  // =========================================================================
  describe('[J] Exact 540 DEMOLITION Dynamic URLs', () => {
    it('DEMOLITION 서비스의 Dynamic URL은 정확히 540개(60 Region × 9 Keyword)여야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const demoEntries = dynamicEntries.filter((e) => e.serviceFamily === 'DEMOLITION');
      assert.equal(demoEntries.length, 540);

      // Verify each URL is resolvable
      for (const entry of demoEntries) {
        const urlObj = new URL(entry.url);
        const kParam = urlObj.searchParams.get('k')!;
        const resolved = resolveBaseRoute(kParam);
        assert.ok(resolved, `${kParam} 해석 성공`);
        assert.equal(resolved.serviceFamily, 'DEMOLITION');
        assert.equal(resolved.isIndexable, true);
      }
    });
  });

  // =========================================================================
  // [K] WASTE 840 URLS 100% IMMUTABLE
  // =========================================================================
  describe('[K] WASTE 840 URLs 100% Immutable', () => {
    it('WASTE 서비스의 Dynamic URL은 정확히 840개(60 Region × 14 Keyword)를 유지해야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const wasteEntries = dynamicEntries.filter((e) => e.serviceFamily === 'WASTE');
      assert.equal(wasteEntries.length, 840);
    });

    it('WASTE 키워드 14개와 지역 60개 정책은 전부 변함없이 활성 상태여야 한다', () => {
      assert.equal(WASTE_KEYWORDS.length, 14);
      for (const kw of WASTE_KEYWORDS) {
        assert.equal(kw.serviceFamily, 'WASTE');
        assert.equal(kw.isActive, true);
        assert.equal(kw.isIndexable, true);
      }

      const activeWasteRegionIds = getActiveRegionIdsByFamily('WASTE');
      assert.equal(activeWasteRegionIds.length, 60);
    });
  });

  // =========================================================================
  // [L] TOTAL DYNAMIC URLS = 1380, TOTAL SITEMAP URLS = 1382
  // =========================================================================
  describe('[L] Total URL Counts', () => {
    it('전체 Dynamic URL은 1380개(840 + 540)여야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      assert.equal(dynamicEntries.length, 1380);
    });

    it('전체 색인 대상 URL은 1386개(Core 6 + Dynamic 1380)여야 한다', () => {
      const childMap = getChildSitemapsMap();
      let total = 0;
      for (const list of childMap.values()) {
        total += list.length;
      }
      assert.equal(total, 1386);
    });
  });

  // =========================================================================
  // [M] ROOT SITEMAP INDEX EXPANSION (2 -> 3 CHILDREN)
  // =========================================================================
  describe('[M] Root Sitemap Index Expansion', () => {
    it('Root Sitemap Index는 정확히 3개의 Child Sitemap을 가져야 한다', () => {
      const indexEntries = getRootSitemapIndexEntries();
      assert.equal(indexEntries.length, 3);

      const filenames = indexEntries.map((e) => e.filename);
      assert.deepEqual(filenames, [
        'core.xml',
        'waste-gyeonggi-001.xml',
        'demolition-gyeonggi-001.xml',
      ]);
    });

    it('Root XML에 3개의 child sitemap loc가 모두 포함되어야 한다', () => {
      const rootXml = generateRootSitemapIndexXml();
      assert.ok(rootXml.includes(getAbsoluteUrl('/sitemaps/core.xml')));
      assert.ok(rootXml.includes(getAbsoluteUrl('/sitemaps/waste-gyeonggi-001.xml')));
      assert.ok(rootXml.includes(getAbsoluteUrl('/sitemaps/demolition-gyeonggi-001.xml')));
    });
  });

  // =========================================================================
  // [N] DEMOLITION CHILD SITEMAP (/sitemaps/demolition-gyeonggi-001.xml)
  // =========================================================================
  describe('[N] Demolition Child Sitemap', () => {
    it('demolition-gyeonggi-001.xml은 정확히 540개 URL을 가져야 한다', () => {
      const childMap = getChildSitemapsMap();
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml');
      assert.ok(demoEntries, 'demolition-gyeonggi-001.xml 존재');
      assert.equal(demoEntries.length, 540);

      const xml = getChildSitemapXml('demolition-gyeonggi-001.xml');
      assert.ok(xml);
      const urlMatches = xml.match(/<url>/g) || [];
      assert.equal(urlMatches.length, 540);
    });
  });

  // =========================================================================
  // [O] DEMOLITION INTERNAL LINKS (Parent & Related, No 404 links)
  // =========================================================================
  describe('[O] Demolition Internal Links', () => {
    it('매탄동(DONG)은 상위 영통구(GU)가 활성이므로 parentLink를 가져야 한다', () => {
      const maetan = findRegionById('gg-suwon-yt-maetan')!;
      const work = findKeywordByRouteKey('상가철거')!;
      const links = getInternalLinks(maetan, work);

      assert.ok(links.parentLink);
      assert.equal(links.parentLink.label, '영통구 상가철거');
      assert.equal(links.parentLink.href, '/?k=영통구-상가철거');
    });

    it('오목천동(DONG)은 상위 권선구(GU)가 활성화되었으므로 parentLink를 정상 연결해야 한다 (Dead Link = 0)', () => {
      const omokcheon = findRegionById('gg-suwon-gs-omokcheon')!;
      const work = findKeywordByRouteKey('상가철거')!;
      const links = getInternalLinks(omokcheon, work);

      assert.ok(links.parentLink);
      assert.equal(links.parentLink.label, '권선구 상가철거');
      assert.equal(links.parentLink.href, '/?k=권선구-상가철거');
    });

    it('연관 작업 링크는 동일 지역 내 DEMOLITION 활성 키워드만 추천해야 한다 (Cross-Link = 0)', () => {
      const maetan = findRegionById('gg-suwon-yt-maetan')!;
      const work = findKeywordByRouteKey('상가철거')!; // COMMERCIAL intent
      const links = getInternalLinks(maetan, work);

      assert.ok(links.relatedLinks.length > 0);
      for (const rel of links.relatedLinks) {
        // Link target check: must resolve to DEMOLITION
        const urlParams = new URL(getAbsoluteUrl(rel.href)).searchParams;
        const kParam = urlParams.get('k')!;
        const resolved = resolveBaseRoute(kParam);
        assert.ok(resolved);
        assert.equal(resolved.serviceFamily, 'DEMOLITION');
        assert.notEqual(resolved.work.routeKey, work.routeKey);
      }
    });
  });

  // =========================================================================
  // [P] CROSS-VERTICAL ISOLATION (WASTE <-> DEMOLITION)
  // =========================================================================
  describe('[P] Cross-Vertical Isolation', () => {
    it('WASTE 페이지의 내부링크에는 DEMOLITION 키워드가 0개여야 한다', () => {
      const maetan = findRegionById('gg-suwon-yt-maetan')!;
      const wasteWork = findKeywordByRouteKey('폐기물처리업체')!;
      const links = getInternalLinks(maetan, wasteWork);

      for (const rel of links.relatedLinks) {
        assert.ok(!rel.label.includes('철거'));
        assert.ok(!rel.href.includes('철거'));
      }
    });

    it('DEMOLITION 페이지의 내부링크에는 WASTE 키워드가 0개여야 한다', () => {
      const maetan = findRegionById('gg-suwon-yt-maetan')!;
      const demoWork = findKeywordByRouteKey('철거업체')!;
      const links = getInternalLinks(maetan, demoWork);

      for (const rel of links.relatedLinks) {
        assert.ok(!rel.label.includes('폐기물'));
        assert.ok(!rel.href.includes('폐기물'));
      }
    });
  });

  // =========================================================================
  // [Q] DEMOLITION HUB ELIGIBILITY
  // =========================================================================
  describe('[Q] Demolition Hub Eligibility', () => {
    it('철거 파일럿 지역들의 isHubEligible은 true여야 한다 (STEP 5-G 허브 구축 완료)', () => {
      for (const pid of getDemolitionPilotRegionIds()) {
        const policy = getServiceRegionPolicy('DEMOLITION', pid)!;
        assert.equal(policy.isHubEligible, true);
      }
    });
  });

  // =========================================================================
  // [R] NON-ACTIVE / P1 / CONDITIONAL ROUTE 404 CONFIRMATION
  // =========================================================================
  describe('[R] Non-Active / P1 / Conditional Route 404 Confirmation', () => {
    it('비활성 지역 및 P1/Conditional 철거 요청은 반드시 null을 반환하여 404를 유도해야 한다', () => {
      const nonActiveQueries = [
        '안산시-중앙동-철거',
        '역삼동-철거업체',
        '매탄동-인테리어철거',
        '수원시-철거공사',
        '영통구-상가원상복구',
        '권선구-건물철거',
        '팔달구-주택철거',
        '장안구-공장철거',
        '세류동-건축물철거',
      ];

      for (const q of nonActiveQueries) {
        assert.strictEqual(resolveBaseRoute(q), null, `${q}는 404여야 함`);
      }
    });
  });

  // =========================================================================
  // [S] CANONICAL 100% EQUALITY (540 Demolition URLs)
  // =========================================================================
  describe('[S] Canonical 100% Equality for 540 Demolition URLs', () => {
    it('540개 모든 Demolition URL의 Sitemap URL과 Canonical URL이 100% 일치해야 한다', () => {
      const childMap = getChildSitemapsMap();
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml')!;
      assert.equal(demoEntries.length, 540);

      for (const entry of demoEntries) {
        const urlObj = new URL(entry.url);
        const kParam = urlObj.searchParams.get('k')!;
        const resolved = resolveBaseRoute(kParam)!;
        assert.ok(resolved);

        const ctx = createPageContext(resolved);
        const expectedCanonical = getAbsoluteUrl(`/?k=${ctx.canonicalRoute}`);
        assert.equal(entry.url, expectedCanonical);

        const meta = generatePageMetadata(ctx);
        assert.ok(
          meta.alternates?.canonical === expectedCanonical ||
          meta.alternates?.canonical === getAbsoluteUrl(`/?k=${encodeURIComponent(ctx.canonicalRoute)}`)
        );
      }
    });
  });
});

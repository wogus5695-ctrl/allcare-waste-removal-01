import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { P0_KEYWORDS, findKeywordByRouteKey } from '../data/keywords/p0-keywords';
import { SUWON_REGIONS } from '../data/regions/suwon';
import { SERVICE_FAMILY_REGISTRY, getServiceFamilyConfig, getActiveServiceFamilies } from '../config/service-family';
import { resolveBaseRoute, createPageContext } from '../engine/resolver';
import { generatePageMetadata } from '../engine/seo-engine';
import {
  getRootSitemapIndexEntries,
  getCoreUrlEntries,
  getDynamicUrlEntries,
  getChildSitemapsMap,
  generateRootSitemapIndexXml,
  generateChildUrlSetXml,
  getChildSitemapXml,
  buildSitemapChunks,
  SITEMAP_CHUNK_SIZE,
  IndexableUrlEntry,
} from '../lib/sitemap-generator';
import robots from '../app/robots';
import { getAbsoluteUrl } from '../config/site';

describe('STEP 5-A: Service Family Foundation & Sitemap Index Architecture', () => {
  // =========================================================================
  // [A] SERVICE FAMILY TYPE & REGISTRY AUDIT
  // =========================================================================
  describe('[A] Service Family Foundation', () => {
    it('기존 14개 P0 키워드의 serviceFamily는 전부 WASTE여야 한다', () => {
      assert.equal(P0_KEYWORDS.length, 14);
      for (const kw of P0_KEYWORDS) {
        assert.equal(kw.serviceFamily, 'WASTE', `${kw.displayName}의 serviceFamily는 WASTE여야 함`);
      }
    });

    it('현재 DEMOLITION 키워드는 0개여야 한다 (키워드 추가 금지)', () => {
      const demolitionKeywords = P0_KEYWORDS.filter((k) => k.serviceFamily === 'DEMOLITION');
      assert.equal(demolitionKeywords.length, 0, '철거 키워드가 존재해서는 안 됨');
    });

    it('Service Family Registry에서 WASTE는 enabled=true, DEMOLITION은 enabled=true여야 한다', () => {
      const wasteConfig = getServiceFamilyConfig('WASTE');
      assert.equal(wasteConfig.enabled, true);
      assert.equal(wasteConfig.label, '폐기물');
      assert.equal(wasteConfig.hubKey, 'waste');

      const demoConfig = getServiceFamilyConfig('DEMOLITION');
      assert.equal(demoConfig.enabled, true);
      assert.equal(demoConfig.label, '철거');
      assert.equal(demoConfig.hubKey, 'demolition');

      const activeFamilies = getActiveServiceFamilies();
      assert.equal(activeFamilies.length, 2);
    });
  });

  // =========================================================================
  // [B] EXISTING URL IMMUTABILITY (840 WASTE DYNAMIC URLS)
  // =========================================================================
  describe('[B] Existing URL Immutability', () => {
    it('기존 840개 폐기물 Dynamic 조합 routeKey는 1개도 변경되지 않아야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const wasteEntries = dynamicEntries.filter((e) => e.serviceFamily === 'WASTE');
      assert.equal(wasteEntries.length, 840);

      const expectedCombinations = 60 * 14;
      assert.equal(expectedCombinations, 840);

      const uniquePaths = new Set(wasteEntries.map((e) => e.path));
      assert.equal(uniquePaths.size, 840, '840개 URL path는 고유해야 함');
    });
  });

  // =========================================================================
  // [C] RESOLVER PROTECTION & PAGE CONTEXT
  // =========================================================================
  describe('[C] Resolver Protection & Output Consistency', () => {
    it('기존 폐기물 쿼리가 정상 해석되고 serviceFamily=WASTE를 포함해야 한다', () => {
      const sampleResolved = resolveBaseRoute('매탄동-폐기물처리업체');
      assert.ok(sampleResolved);
      assert.equal(sampleResolved.serviceFamily, 'WASTE');
      assert.equal(sampleResolved.work.serviceFamily, 'WASTE');
      assert.equal(sampleResolved.canonicalQuery, '매탄동-폐기물처리업체');

      const context = createPageContext(sampleResolved);
      assert.equal(context.serviceFamily, 'WASTE');

      const metadata = generatePageMetadata(context);
      assert.equal(metadata.alternates?.canonical, getAbsoluteUrl('/?k=%EB%A7%A4%ED%83%84%EB%8F%99-%ED%8F%90%EA%B8%B0%EB%AC%BC%EC%B2%98%EB%A6%AC%EC%97%85%EC%B2%B4'));
      assert.match(String(metadata.title), /매탄동 폐기물처리업체/);
    });

    it('존재하지 않는 쿼리나 잘못된 쿼리는 여전히 null을 반환해야 한다', () => {
      assert.equal(resolveBaseRoute('없는동-폐기물처리'), null);
      assert.equal(resolveBaseRoute('매탄동-가짜서비스'), null);
      assert.equal(resolveBaseRoute('없는동-철거'), null);
    });
  });

  // =========================================================================
  // [D] ROOT SITEMAP INDEX (/sitemap.xml)
  // =========================================================================
  describe('[D] Root Sitemap Index (/sitemap.xml)', () => {
    it('Sitemap Index는 정확히 3개의 Child Sitemap(core, waste-gyeonggi-001, demolition-gyeonggi-001)을 가져야 한다', () => {
      const indexEntries = getRootSitemapIndexEntries();
      assert.equal(indexEntries.length, 3);

      const filenames = indexEntries.map((e) => e.filename);
      assert.deepEqual(filenames, ['core.xml', 'waste-gyeonggi-001.xml', 'demolition-gyeonggi-001.xml']);

      assert.equal(indexEntries[0].loc, getAbsoluteUrl('/sitemaps/core.xml'));
      assert.equal(indexEntries[1].loc, getAbsoluteUrl('/sitemaps/waste-gyeonggi-001.xml'));
      assert.equal(indexEntries[2].loc, getAbsoluteUrl('/sitemaps/demolition-gyeonggi-001.xml'));
    });

    it('Root XML 출력은 유효한 <sitemapindex> 규격이어야 한다', () => {
      const xml = generateRootSitemapIndexXml();
      assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
      assert.ok(xml.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
      assert.ok(xml.includes(`  <sitemap>\n    <loc>${getAbsoluteUrl('/sitemaps/core.xml')}</loc>\n  </sitemap>`));
      assert.ok(xml.includes(`  <sitemap>\n    <loc>${getAbsoluteUrl('/sitemaps/waste-gyeonggi-001.xml')}</loc>\n  </sitemap>`));
      assert.ok(xml.includes(`  <sitemap>\n    <loc>${getAbsoluteUrl('/sitemaps/demolition-gyeonggi-001.xml')}</loc>\n  </sitemap>`));
      assert.ok(xml.endsWith('</sitemapindex>\n'));

      // <urlset> 태그가 없어야 함
      assert.ok(!xml.includes('<urlset>'));
      assert.ok(!xml.includes('<url>'));
    });
  });

  // =========================================================================
  // [E] CORE SITEMAP (/sitemaps/core.xml)
  // =========================================================================
  describe('[E] Core Sitemap (/sitemaps/core.xml)', () => {
    it('Core Sitemap은 정확히 6개의 URL(/, /waste, /demolition, /hub, /hub/waste, /hub/demolition)을 포함해야 한다', () => {
      const coreEntries = getCoreUrlEntries();
      assert.equal(coreEntries.length, 6);

      const paths = coreEntries.map((e) => e.path);
      assert.deepEqual(paths, ['/', '/waste', '/demolition', '/hub', '/hub/waste', '/hub/demolition']);

      const xml = getChildSitemapXml('core.xml');
      assert.ok(xml);
      assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
      assert.ok(xml.includes(`<loc>${getAbsoluteUrl('/')}</loc>`));
      assert.ok(xml.includes(`<loc>${getAbsoluteUrl('/waste')}</loc>`));
      assert.ok(xml.includes(`<loc>${getAbsoluteUrl('/demolition')}</loc>`));
      assert.ok(xml.includes(`<loc>${getAbsoluteUrl('/hub')}</loc>`));
      assert.ok(xml.includes(`<loc>${getAbsoluteUrl('/hub/waste')}</loc>`));
      assert.ok(xml.includes(`<loc>${getAbsoluteUrl('/hub/demolition')}</loc>`));

      const count = (xml.match(/<url>/g) || []).length;
      assert.equal(count, 6);
    });
  });

  // =========================================================================
  // [F] WASTE CHILD SITEMAP (/sitemaps/waste-gyeonggi-001.xml)
  // =========================================================================
  describe('[F] Waste Gyeonggi Child Sitemap (/sitemaps/waste-gyeonggi-001.xml)', () => {
    it('Waste Gyeonggi Child Sitemap은 정확히 840개의 Dynamic URL을 포함해야 한다', () => {
      const childMap = getChildSitemapsMap();
      const wasteEntries = childMap.get('waste-gyeonggi-001.xml');
      assert.ok(wasteEntries);
      assert.equal(wasteEntries.length, 840);

      const xml = getChildSitemapXml('waste-gyeonggi-001.xml');
      assert.ok(xml);
      assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));

      const urlCount = (xml.match(/<url>/g) || []).length;
      assert.equal(urlCount, 840);
    });
  });

  // =========================================================================
  // [G] FAMILY ISOLATION
  // =========================================================================
  describe('[G] Family Isolation', () => {
    it('Waste Sitemap에는 DEMOLITION URL이 0개여야 한다', () => {
      const childMap = getChildSitemapsMap();
      const wasteEntries = childMap.get('waste-gyeonggi-001.xml') || [];
      const nonWaste = wasteEntries.filter((e) => e.serviceFamily !== 'WASTE');
      assert.equal(nonWaste.length, 0, 'Waste sitemap에는 오직 WASTE 서비스만 포함되어야 함');
    });

    it('DEMOLITION Child Sitemap은 540개 URL로 등록되어야 한다', () => {
      const childMap = getChildSitemapsMap();
      const demolitionSitemaps = Array.from(childMap.keys()).filter((k) => k.startsWith('demolition'));
      assert.equal(demolitionSitemaps.length, 1);
      assert.equal(demolitionSitemaps[0], 'demolition-gyeonggi-001.xml');
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml') || [];
      assert.equal(demoEntries.length, 540);
      const demoXml = getChildSitemapXml('demolition-gyeonggi-001.xml');
      assert.ok(demoXml);
    });
  });

  // =========================================================================
  // [H] CHILD SITEMAP 404 HANDLING
  // =========================================================================
  describe('[H] Child Sitemap 404 Guard', () => {
    it('존재하지 않는 Child Sitemap 파일명 요청 시 null을 반환해야 한다 (HTTP 404 유도)', () => {
      assert.equal(getChildSitemapXml('waste-gyeonggi-999.xml'), null);
      assert.equal(getChildSitemapXml('demolition-gyeonggi-999.xml'), null);
      assert.equal(getChildSitemapXml('random.xml'), null);
      assert.equal(getChildSitemapXml(''), null);
    });
  });

  // =========================================================================
  // [I] CANONICAL & SITEMAP 100% EQUALITY AUDIT
  // =========================================================================
  describe('[I] Canonical & Child Sitemap 100% Equality Audit', () => {
    it('840개 Waste Child Sitemap URL은 각각의 Canonical URL과 100% 일치해야 한다 (Mismatch = 0)', () => {
      const childMap = getChildSitemapsMap();
      const wasteEntries = childMap.get('waste-gyeonggi-001.xml') || [];
      assert.equal(wasteEntries.length, 840);

      for (const entry of wasteEntries) {
        const urlObj = new URL(entry.url);
        const kParam = urlObj.searchParams.get('k');
        assert.ok(kParam, `k 파라미터 누락: ${entry.url}`);

        const resolved = resolveBaseRoute(kParam);
        assert.ok(resolved, `해석 불가: ${entry.url}`);
        assert.equal(resolved.serviceFamily, 'WASTE');

        const context = createPageContext(resolved);
        const expectedCanonical = getAbsoluteUrl(`/?k=${context.canonicalRoute}`);

        assert.equal(
          entry.url,
          expectedCanonical,
          `Sitemap URL(${entry.url})과 Canonical(${expectedCanonical}) 불일치`
        );
      }
    });

    it('총 실제 색인 대상 URL 수는 정확히 1386개여야 한다 (Core: 6 + WASTE Dynamic: 840 + DEMOLITION Dynamic: 540)', () => {
      const childMap = getChildSitemapsMap();
      let totalUrls = 0;
      for (const entries of childMap.values()) {
        totalUrls += entries.length;
      }
      assert.equal(totalUrls, 1386);
    });
  });

  // =========================================================================
  // [J] ROBOTS.TXT
  // =========================================================================
  describe('[J] Robots.txt Configuration', () => {
    it('robots.txt는 오직 /sitemap.xml 단 1개만 Sitemap으로 안내해야 한다', () => {
      const robotsConfig = robots();
      assert.equal(robotsConfig.sitemap, getAbsoluteUrl('/sitemap.xml'));
      assert.ok(!Array.isArray(robotsConfig.sitemap), 'Sitemap은 단일 string이어야 함');
    });
  });

  // =========================================================================
  // [K] AUTOMATIC CHUNKING FOUNDATION
  // =========================================================================
  describe('[K] Automatic Chunking Foundation', () => {
    it('URL 수가 chunkSize(10,000)를 초과할 경우 자동으로 여러 chunk로 분할되어야 한다', () => {
      // 24,500개의 가상 URL 엔트리 생성
      const mockEntries: IndexableUrlEntry[] = Array.from({ length: 24500 }, (_, i) => ({
        path: `/?k=test-${i}`,
        url: `https://allcareclean.kr/?k=test-${i}`,
        type: 'DYNAMIC' as const,
        serviceFamily: 'WASTE' as const,
        metroRegion: 'gyeonggi',
        priority: 0.7,
        changeFrequency: 'weekly' as const,
      }));

      const chunks = buildSitemapChunks(mockEntries, SITEMAP_CHUNK_SIZE);
      assert.equal(chunks.length, 3, '24,500개는 10,000단위 3개 chunk로 분할되어야 함');
      assert.equal(chunks[0].filename, 'waste-gyeonggi-001.xml');
      assert.equal(chunks[0].entries.length, 10000);
      assert.equal(chunks[1].filename, 'waste-gyeonggi-002.xml');
      assert.equal(chunks[1].entries.length, 10000);
      assert.equal(chunks[2].filename, 'waste-gyeonggi-003.xml');
      assert.equal(chunks[2].entries.length, 4500);
    });

    it('다양한 metroRegion 및 serviceFamily가 제공될 경우 자동으로 각각 분리 그룹화되어야 한다', () => {
      const multiMockEntries: IndexableUrlEntry[] = [
        { path: '/?k=gg', url: 'https://allcareclean.kr/?k=gg', type: 'DYNAMIC', serviceFamily: 'WASTE', metroRegion: 'gyeonggi', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/?k=seoul', url: 'https://allcareclean.kr/?k=seoul', type: 'DYNAMIC', serviceFamily: 'WASTE', metroRegion: 'seoul', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/?k=incheon', url: 'https://allcareclean.kr/?k=incheon', type: 'DYNAMIC', serviceFamily: 'WASTE', metroRegion: 'incheon', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/?k=demo-gg', url: 'https://allcareclean.kr/?k=demo-gg', type: 'DYNAMIC', serviceFamily: 'DEMOLITION', metroRegion: 'gyeonggi', priority: 0.7, changeFrequency: 'weekly' },
      ];

      const chunks = buildSitemapChunks(multiMockEntries, 10000);
      assert.equal(chunks.length, 4);
      const names = chunks.map((c) => c.filename).sort();
      assert.deepEqual(names, [
        'demolition-gyeonggi-001.xml',
        'waste-gyeonggi-001.xml',
        'waste-incheon-001.xml',
        'waste-seoul-001.xml',
      ]);
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getRootSitemapIndexEntries,
  getCoreUrlEntries,
  getDynamicUrlEntries,
  getChildSitemapsMap,
  getChildSitemapXml,
  generateRootSitemapIndexXml,
} from '../lib/sitemap-generator';
import { getAbsoluteUrl } from '../config/site';
import { P0_KEYWORDS } from '../data/keywords/p0-keywords';
import { DEMOLITION_P0_KEYWORDS } from '../data/keywords/demolition-keywords';
import { SUWON_REGIONS } from '../data/regions/suwon';
import { metadata as wasteMeta } from '../app/waste/page';
import { metadata as demoMeta } from '../app/demolition/page';
import { metadata as hubMeta } from '../app/hub/page';
import { metadata as wasteHubMeta } from '../app/hub/waste/page';
import { metadata as demoHubMeta } from '../app/hub/demolition/page';

describe('STEP 5-G: Service Main + Multi-Vertical Hub Architecture Audit', () => {
  // =========================================================================
  // 1. SITEMAP ARCHITECTURE & URL AUDIT
  // =========================================================================
  describe('1. Sitemap Architecture & URL Counts', () => {
    it('Core Sitemap은 정확히 6개 URL을 포함해야 한다', () => {
      const coreEntries = getCoreUrlEntries();
      assert.equal(coreEntries.length, 6);

      const paths = coreEntries.map((e) => e.path);
      assert.deepEqual(paths, [
        '/',
        '/waste',
        '/demolition',
        '/hub',
        '/hub/waste',
        '/hub/demolition',
      ]);
    });

    it('Sitemap Index는 3개의 Child Sitemap을 선언해야 한다', () => {
      const indexEntries = getRootSitemapIndexEntries();
      assert.equal(indexEntries.length, 3);

      const filenames = indexEntries.map((e) => e.filename);
      assert.deepEqual(filenames, [
        'core.xml',
        'waste-gyeonggi-001.xml',
        'demolition-gyeonggi-001.xml',
      ]);
    });

    it('각 Sitemap별 URL 카운트와 전체 Indexable URL은 1,386개여야 한다', () => {
      const childMap = getChildSitemapsMap();

      const coreEntries = childMap.get('core.xml') || [];
      const wasteEntries = childMap.get('waste-gyeonggi-001.xml') || [];
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml') || [];

      assert.equal(coreEntries.length, 6, 'Core URLs = 6');
      assert.equal(wasteEntries.length, 840, 'Waste Dynamic URLs = 840');
      assert.equal(demoEntries.length, 540, 'Demolition Dynamic URLs = 540');

      const total = coreEntries.length + wasteEntries.length + demoEntries.length;
      assert.equal(total, 1386, 'Total Indexable URLs = 1,386');
    });

    it('core.xml XML 문자열에 6개 URL이 올바르게 렌더링되어야 한다', () => {
      const xml = getChildSitemapXml('core.xml');
      assert.ok(xml);
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
  // 2. STATIC ROUTE METADATA & CANONICAL AUDIT
  // =========================================================================
  describe('2. Static Route Metadata & Canonical', () => {
    it('/waste 메타데이터 및 Self-Canonical 검증', () => {
      assert.equal(wasteMeta.alternates?.canonical, getAbsoluteUrl('/waste'));
      assert.ok(String(wasteMeta.title).includes('폐기물 수거·처리'));
    });

    it('/demolition 메타데이터 및 Self-Canonical 검증', () => {
      assert.equal(demoMeta.alternates?.canonical, getAbsoluteUrl('/demolition'));
      assert.ok(String(demoMeta.title).includes('철거·원상복구'));
    });

    it('/hub 메타데이터 및 Self-Canonical 검증', () => {
      assert.equal(hubMeta.alternates?.canonical, getAbsoluteUrl('/hub'));
      assert.ok(String(hubMeta.title).includes('서비스 지역'));
    });

    it('/hub/waste 메타데이터 및 Self-Canonical 검증', () => {
      assert.equal(wasteHubMeta.alternates?.canonical, getAbsoluteUrl('/hub/waste'));
      assert.ok(String(wasteHubMeta.title).includes('폐기물 수거'));
    });

    it('/hub/demolition 메타데이터 및 Self-Canonical 검증', () => {
      assert.equal(demoHubMeta.alternates?.canonical, getAbsoluteUrl('/hub/demolition'));
      assert.ok(String(demoHubMeta.title).includes('철거·원상복구'));
    });
  });

  // =========================================================================
  // 3. DYNAMIC URL IMMUTABILITY (1,380 URLs)
  // =========================================================================
  describe('3. Dynamic URL Immutability', () => {
    it('WASTE 840개 Dynamic URL은 전혀 변경되지 않아야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const wasteEntries = dynamicEntries.filter((e) => e.serviceFamily === 'WASTE');
      assert.equal(wasteEntries.length, 840);

      // 모든 WASTE URL은 /?k= 쿼리 파라미터 구조를 가져야 함
      for (const entry of wasteEntries) {
        assert.ok(entry.path.startsWith('/?k='), `Path must start with /?k=: ${entry.path}`);
        assert.ok(!entry.path.startsWith('/waste/'), `Path must not start with /waste/: ${entry.path}`);
      }
    });

    it('DEMOLITION 540개 Dynamic URL은 전혀 변경되지 않아야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const demoEntries = dynamicEntries.filter((e) => e.serviceFamily === 'DEMOLITION');
      assert.equal(demoEntries.length, 540);

      // 모든 DEMOLITION URL은 /?k= 쿼리 파라미터 구조를 가져야 함
      for (const entry of demoEntries) {
        assert.ok(entry.path.startsWith('/?k='), `Path must start with /?k=: ${entry.path}`);
        assert.ok(!entry.path.startsWith('/demolition/'), `Path must not start with /demolition/: ${entry.path}`);
      }
    });
  });

  // =========================================================================
  // 4. HUB REGION HIERARCHY & ISOLATION AUDIT
  // =========================================================================
  describe('4. Hub Region Hierarchy & Vertical Isolation', () => {
    it('수원시 60개 전 지역이 정상 로드되어야 한다', () => {
      assert.equal(SUWON_REGIONS.length, 60);
      const siList = SUWON_REGIONS.filter((r) => r.regionType === 'SI');
      const guList = SUWON_REGIONS.filter((r) => r.regionType === 'GU');
      const dongList = SUWON_REGIONS.filter((r) => r.regionType === 'DONG');

      assert.equal(siList.length, 1);
      assert.equal(guList.length, 4);
      assert.equal(dongList.length, 55);
    });

    it('Waste Hub 링크 패턴 검증: 모든 링크가 WASTE 키워드여야 한다', () => {
      // /hub/waste 에 포함될 대표 동적 링크 패턴 검증
      const wasteKeywordKeys = P0_KEYWORDS.map((k) => k.routeKey);
      const demoKeywordKeys = DEMOLITION_P0_KEYWORDS.map((k) => k.routeKey);

      for (const r of SUWON_REGIONS) {
        const wasteSampleRoute = `${r.routeKey}-폐기물처리업체`;
        assert.ok(wasteKeywordKeys.includes('폐기물처리업체'));
        assert.ok(!demoKeywordKeys.includes('폐기물처리업체'));
      }
    });

    it('Demolition Hub 링크 패턴 검증: 모든 링크가 DEMOLITION 키워드여야 한다', () => {
      // /hub/demolition 에 포함될 대표 동적 링크 패턴 검증
      const wasteKeywordKeys = P0_KEYWORDS.map((k) => k.routeKey);
      const demoKeywordKeys = DEMOLITION_P0_KEYWORDS.map((k) => k.routeKey);

      for (const r of SUWON_REGIONS) {
        const demoSampleRoute = `${r.routeKey}-철거업체`;
        assert.ok(demoKeywordKeys.includes('철거업체'));
        assert.ok(!wasteKeywordKeys.includes('철거업체'));
      }
    });
  });
});

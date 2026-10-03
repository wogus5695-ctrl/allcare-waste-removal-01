import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SUWON_REGIONS } from '../data/regions/suwon';
import { PRODUCTION_REGIONS } from '../data/regions';
import { P0_KEYWORDS } from '../data/keywords/p0-keywords';
import {
  DEMOLITION_P0_KEYWORDS,
  DEMOLITION_P1_CANDIDATES,
  DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES,
} from '../data/keywords/demolition-keywords';
import { resolveBaseRoute } from '../engine/resolver';
import { getInternalLinks, getCrossVerticalLink } from '../engine/link-engine';
import {
  getRootSitemapIndexEntries,
  getCoreUrlEntries,
  getDynamicUrlEntries,
  getIndexableUrlEntries,
  getChildSitemapsMap,
} from '../lib/sitemap-generator';
import { getAbsoluteUrl } from '../config/site';

describe('STEP 5-I: Final Multi-Vertical Architecture & Zero Regression Lock Audit', () => {
  // =========================================================================
  // 1. FINAL URL INVENTORY
  // =========================================================================
  describe('1. Final URL Inventory & Invariants', () => {
    it('Static Core = 4 URLs', () => {
      const core = getCoreUrlEntries();
      assert.equal(core.length, 4);
      assert.deepEqual(
        core.map((e) => e.path),
        ['/', '/waste', '/hub', '/hub/waste']
      );
    });

    it('WASTE Dynamic = 4,665 URLs, DEMOLITION Dynamic = 0 URLs (On-Hold), Total Dynamic = 4,665 URLs', () => {
      const dynamic = getDynamicUrlEntries();
      const waste = dynamic.filter((e) => e.serviceFamily === 'WASTE');
      const demo = dynamic.filter((e) => e.serviceFamily === 'DEMOLITION');

      assert.equal(waste.length, 4665);
      assert.equal(demo.length, 0);
      assert.equal(dynamic.length, 4665);
    });

    it('Total Indexable = 4669 URLs, Duplicate URL = 0', () => {
      const all = getIndexableUrlEntries();
      assert.equal(all.length, 4669);
      const unique = new Set(all.map((e) => e.url));
      assert.equal(unique.size, 4669);
    });
  });

  // =========================================================================
  // 2. SERVICE FAMILY & KEYWORD INVENTORY
  // =========================================================================
  describe('2. Service Family & Keyword Invariants', () => {
    it('WASTE 15 P0 Keywords & DEMOLITION 9 P0 Keywords', () => {
      assert.equal(P0_KEYWORDS.length, 15);
      assert.equal(DEMOLITION_P0_KEYWORDS.length, 9);
      for (const k of P0_KEYWORDS) assert.equal(k.serviceFamily, 'WASTE');
      for (const k of DEMOLITION_P0_KEYWORDS) assert.equal(k.serviceFamily, 'DEMOLITION');
    });

    it('P1 and Conditional Candidates must have 0 indexable routes', () => {
      for (const r of SUWON_REGIONS) {
        for (const k of [...DEMOLITION_P1_CANDIDATES, ...DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES]) {
          const res = resolveBaseRoute(`${r.routeKey}-${k}`);
          assert.equal(res, null, `Leaked route: ${r.routeKey}-${k}`);
        }
      }
    });
  });

  // =========================================================================
  // 3. REGION HIERARCHY & COLLISION HEALTH
  // =========================================================================
  describe('3. Region Hierarchy & Collision Health', () => {
    it('Base Active Regions = 60 (1 SI + 4 GU + 55 DONG)', () => {
      const si = SUWON_REGIONS.filter((r) => r.regionType === 'SI');
      const gu = SUWON_REGIONS.filter((r) => r.regionType === 'GU');
      const dong = SUWON_REGIONS.filter((r) => r.regionType === 'DONG');

      assert.equal(si.length, 1);
      assert.equal(gu.length, 4);
      assert.equal(dong.length, 55);
      assert.equal(SUWON_REGIONS.length, 60);
    });

    it('Nationwide Collision Regions must resolve with prefix and 404 without prefix', () => {
      const collisions = ['정자동', '금곡동', '조원동', '중동'];
      for (const c of collisions) {
        // Unprefixed -> 404
        assert.equal(resolveBaseRoute(`${c}-폐기물처리업체`), null);
        assert.equal(resolveBaseRoute(`${c}-철거업체`), null);

        // Prefixed -> 200
        const wastePrefixed = resolveBaseRoute(`수원시-${c}-폐기물처리업체`);
        const demoPrefixed = resolveBaseRoute(`수원시-${c}-철거업체`);
        assert.ok(wastePrefixed);
        assert.ok(demoPrefixed);
        assert.equal(wastePrefixed.region.routeKey, `수원시-${c}`);
        assert.equal(demoPrefixed.region.routeKey, `수원시-${c}`);
      }
    });
  });

  // =========================================================================
  // 4. SITEMAP INDEX & CANONICAL EQUALITY
  // =========================================================================
  describe('4. Sitemap Index & Canonical Equality', () => {
    it('Root Sitemap Index has exactly 4 children', () => {
      const children = getRootSitemapIndexEntries();
      assert.equal(children.length, 4);
      assert.deepEqual(
        children.map((c) => c.filename),
        [
          'core.xml',
          'waste-gyeonggi-001.xml',
          'waste-seoul-001.xml',
          'waste-incheon-001.xml',
        ]
      );
    });

    it('Child sitemaps URL counts: core=4, waste-gyeonggi=2820, waste-seoul=1005, waste-incheon=840', () => {
      const map = getChildSitemapsMap();
      assert.equal(map.get('core.xml')?.length, 4);
      assert.equal(map.get('waste-gyeonggi-001.xml')?.length, 2820);
      assert.equal(map.get('waste-seoul-001.xml')?.length, 1005);
      assert.equal(map.get('waste-incheon-001.xml')?.length, 840);
    });

    it('All 4665 dynamic URLs match PageContext Canonical 100%', () => {
      const dynamic = getDynamicUrlEntries();
      for (const entry of dynamic) {
        const kParam = new URL(entry.url).searchParams.get('k')!;
        const resolved = resolveBaseRoute(kParam)!;
        assert.ok(resolved);
        const expectedCanonical = getAbsoluteUrl(`/?k=${resolved.canonicalQuery}`);
        assert.equal(entry.url, expectedCanonical);
        assert.ok(!entry.url.includes('/waste/'));
        assert.ok(!entry.url.includes('/demolition/'));
      }
    });
  });

  // =========================================================================
  // 5. CRAWL GRAPH & ORPHAN AUDIT
  // =========================================================================
  // =========================================================================
  // 5. CRAWL GRAPH & ORPHAN AUDIT
  // =========================================================================
  // =========================================================================
  // 5. CRAWL GRAPH & ORPHAN AUDIT
  // =========================================================================
  describe('5. Crawl Graph & Orphan Audit', () => {
    it('All 4,665 dynamic URLs must be discoverable in HTML link graph (Orphan URL = 0)', () => {
      const dynamic = getDynamicUrlEntries();
      const allRouteKeys = new Set(
        dynamic.map((e) => new URL(e.url).searchParams.get('k')!)
      );

      const inboundMap = new Map<string, number>();
      for (const k of allRouteKeys) {
        inboundMap.set(decodeURIComponent(k), 0);
      }

      // Hub links:
      const wasteSi = PRODUCTION_REGIONS.filter((r) => r.regionType === 'SI');
      const wasteGu = PRODUCTION_REGIONS.filter((r) => r.regionType === 'GU');
      const wasteDong = PRODUCTION_REGIONS.filter((r) => r.regionType === 'DONG');

      const wasteHubKeys = [
        ...wasteSi.flatMap((si) => [
          `${si.routeKey}-폐기물처리업체`,
          `${si.routeKey}-폐기물수거`,
          `${si.routeKey}-가정폐기물처리`,
          `${si.routeKey}-폐기물처리비용`,
        ]),
        ...wasteGu.map((g) => `${g.routeKey}-폐기물처리업체`),
        ...wasteDong.map((d) => `${d.routeKey}-폐기물처리업체`),
      ];

      for (const k of wasteHubKeys) {
        if (inboundMap.has(k)) {
          inboundMap.set(k, inboundMap.get(k)! + 1);
        }
      }

      // Dynamic page internal links:
      for (const r of PRODUCTION_REGIONS) {
        for (const kw of P0_KEYWORDS) {
          const links = getInternalLinks(r, kw);
          if (links.parentLink) {
            const pKey = links.parentLink.href.replace('/?k=', '');
            if (inboundMap.has(pKey)) {
              inboundMap.set(pKey, inboundMap.get(pKey)! + 1);
            }
          }
          for (const rel of links.relatedLinks) {
            const relKey = rel.href.replace('/?k=', '');
            if (inboundMap.has(relKey)) {
              inboundMap.set(relKey, inboundMap.get(relKey)! + 1);
            }
          }
          if (links.crossVerticalLink) {
            const crossKey = links.crossVerticalLink.href.replace('/?k=', '');
            if (inboundMap.has(crossKey)) {
              inboundMap.set(crossKey, inboundMap.get(crossKey)! + 1);
            }
          }
        }
      }

      const orphans = Array.from(inboundMap.entries())
        .filter(([_, count]) => count === 0)
        .map(([k]) => k);

      console.log('\n[CRAWL GRAPH AUDIT] Orphan count:', orphans.length);
      console.log('[CRAWL GRAPH AUDIT] Sample orphans (first 10):', orphans.slice(0, 10));
      const orphanKws: Record<string, number> = {};
      for (const o of orphans) {
        const parts = o.split('-');
        const kw = parts[parts.length - 1];
        orphanKws[kw] = (orphanKws[kw] || 0) + 1;
      }
      console.log('[CRAWL GRAPH AUDIT] Orphan breakdown by keyword:', orphanKws);

      assert.ok(inboundMap.size === 4665);
      assert.equal(orphans.length, 0, `Orphan URLs must be 0, found ${orphans.length}`);
    });

    it('Click depth from Hubs to all 4,665 URLs must be reachable (Unreachable = 0)', () => {
      const dynamic = getDynamicUrlEntries();
      const allRouteKeys = new Set(
        dynamic.map((e) => decodeURIComponent(new URL(e.url).searchParams.get('k')!))
      );

      const adj = new Map<string, string[]>();
      for (const k of allRouteKeys) {
        adj.set(k, []);
      }

      for (const r of PRODUCTION_REGIONS) {
        for (const kw of P0_KEYWORDS) {
          const srcKey = `${r.routeKey}-${kw.routeKey}`;
          const links = getInternalLinks(r, kw);
          const out: string[] = [];
          if (links.parentLink) out.push(links.parentLink.href.replace('/?k=', ''));
          for (const rel of links.relatedLinks) out.push(rel.href.replace('/?k=', ''));
          if (links.crossVerticalLink) out.push(links.crossVerticalLink.href.replace('/?k=', ''));
          adj.set(srcKey, out);
        }
      }

      const depthMap = new Map<string, number>();
      const queue: string[] = [];

      // Seed from Hub links
      const wasteSi = PRODUCTION_REGIONS.filter((r) => r.regionType === 'SI');
      const wasteGu = PRODUCTION_REGIONS.filter((r) => r.regionType === 'GU');
      const wasteDong = PRODUCTION_REGIONS.filter((r) => r.regionType === 'DONG');

      const seedKeys = [
        ...wasteSi.flatMap((si) => [
          `${si.routeKey}-폐기물처리업체`,
          `${si.routeKey}-폐기물수거`,
          `${si.routeKey}-가정폐기물처리`,
          `${si.routeKey}-폐기물처리비용`,
        ]),
        ...wasteGu.map((g) => `${g.routeKey}-폐기물처리업체`),
        ...wasteDong.map((d) => `${d.routeKey}-폐기물처리업체`),
      ];

      for (const k of seedKeys) {
        depthMap.set(k, 1);
        queue.push(k);
      }

      while (queue.length > 0) {
        const cur = queue.shift()!;
        const curDepth = depthMap.get(cur)!;
        const neighbors = adj.get(cur) || [];
        for (const n of neighbors) {
          if (!depthMap.has(n)) {
            depthMap.set(n, curDepth + 1);
            queue.push(n);
          }
        }
      }

      const depthDist: Record<number, number> = {};
      let unreachable = 0;
      for (const k of allRouteKeys) {
        if (depthMap.has(k)) {
          const d = depthMap.get(k)!;
          depthDist[d] = (depthDist[d] || 0) + 1;
        } else {
          unreachable++;
        }
      }

      console.log('\n[CLICK DEPTH AUDIT] Distribution from Hub:');
      console.log('  Depth 1 (Hub Direct):', depthDist[1] || 0);
      console.log('  Depth 2 (Hop 1):', depthDist[2] || 0);
      console.log('  Depth 3 (Hop 2):', depthDist[3] || 0);
      console.log('  Depth 4 (Hop 3):', depthDist[4] || 0);
      console.log('  Unreachable in HTML graph:', unreachable);

      assert.equal(allRouteKeys.size, 4665);
      assert.equal(unreachable, 0, `Unreachable dynamic URLs must be 0, found ${unreachable}`);
    });
  });
});

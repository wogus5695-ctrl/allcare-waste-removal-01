import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildWasteHubDirectoryModel } from '@/lib/hub/waste-hub-model';
import { PRODUCTION_REGIONS } from '@/data/regions';
import { WASTE_P0_KEYWORDS } from '@/data/keywords';
import { resolveProductionRoute } from '@/engine/resolver';
import { metadata } from '@/app/hub/waste/page';

describe('STEP H-1: WASTE Dynamic SEO Directory Hub Refactor Test Suite', () => {
  const model = buildWasteHubDirectoryModel();

  describe('1. Single Source of Truth & Derived Counts Audit', () => {
    it('Active WASTE Regions count must be exactly 311 derived from PRODUCTION_REGIONS', () => {
      assert.equal(model.summaryStats.totalRegions, 311);
      assert.equal(model.summaryStats.totalRegions, PRODUCTION_REGIONS.filter((r) => r.isHubEligible && r.isActive).length);
    });

    it('Active WASTE Keywords count must be exactly 15 derived from WASTE_P0_KEYWORDS', () => {
      assert.equal(model.summaryStats.totalKeywords, 15);
      assert.equal(model.summaryStats.totalKeywords, WASTE_P0_KEYWORDS.filter((k) => k.isActive).length);
    });

    it('Expected Combinations must be exactly 311 * 15 = 4,665', () => {
      assert.equal(model.summaryStats.expectedCombinations, 4665);
      assert.equal(model.summaryStats.expectedCombinations, model.summaryStats.totalRegions * model.summaryStats.totalKeywords);
    });

    it('Resolved Combinations must be exactly 4,665 with 100% resolution rate', () => {
      assert.equal(model.summaryStats.resolvedCombinations, 4665);
    });

    it('Missing Combinations count must be exactly 0', () => {
      assert.equal(model.summaryStats.missingCombinations, 0);
      assert.equal(model.missingCombinations.length, 0);
    });
  });

  describe('2. Metro Distribution Integrity', () => {
    it('Metro grouping must accurately derive Seoul (67), Incheon (56), Gyeonggi (188)', () => {
      const seoul = model.metroSummary.find((m) => m.metroId === 'seoul');
      const incheon = model.metroSummary.find((m) => m.metroId === 'incheon');
      const gyeonggi = model.metroSummary.find((m) => m.metroId === 'gyeonggi');

      assert.ok(seoul, 'Seoul metro must exist');
      assert.equal(seoul.regionCount, 67);
      assert.equal(seoul.combinationCount, 67 * 15); // 1,005

      assert.ok(incheon, 'Incheon metro must exist');
      assert.equal(incheon.regionCount, 56);
      assert.equal(incheon.combinationCount, 56 * 15); // 840

      assert.ok(gyeonggi, 'Gyeonggi metro must exist');
      assert.equal(gyeonggi.regionCount, 188);
      assert.equal(gyeonggi.combinationCount, 188 * 15); // 2,820

      assert.equal(seoul.regionCount + incheon.regionCount + gyeonggi.regionCount, 311);
    });

    it('Hierarchy tree must contain all 3 Metros with correct SIs and GUs', () => {
      assert.equal(model.hierarchy.length, 3);
      const gg = model.hierarchy.find((h) => h.metroId === 'gyeonggi');
      assert.ok(gg);
      assert.equal(gg.sis.length, 5); // 수원시, 화성시, 평택시, 고양시, 용인시
    });
  });

  describe('3. Region Combination Status & Every Region 15/15 Integrity', () => {
    it('Every single one of the 311 regions must have 15/15 active keywords', () => {
      assert.equal(model.regions.length, 311);
      for (const region of model.regions) {
        assert.equal(
          region.activeKeywordsCount,
          15,
          `Region ${region.seoDisplayName} (${region.regionId}) must have 15 active keywords`
        );
        assert.equal(region.totalKeywordsCount, 15);
      }
    });

    it('Keywords in each region must match WASTE_P0_KEYWORDS order and identity', () => {
      const sampleRegion = model.regions[0];
      assert.equal(sampleRegion.keywords.length, 15);
      for (let i = 0; i < 15; i++) {
        assert.equal(sampleRegion.keywords[i].keywordId, WASTE_P0_KEYWORDS[i].keywordId);
        assert.equal(sampleRegion.keywords[i].routeKey, WASTE_P0_KEYWORDS[i].routeKey);
        assert.equal(sampleRegion.keywords[i].isResolved, true);
      }
    });
  });

  describe('4. Keyword Coverage Integrity (311 / 311 for All Keywords)', () => {
    it('All 15 WASTE keywords must cover exactly 311 / 311 regions (100%)', () => {
      assert.equal(model.keywordCoverage.length, 15);
      for (const kw of model.keywordCoverage) {
        assert.equal(kw.totalRegionsCount, 311);
        assert.equal(kw.activeRegionsCount, 311);
        assert.equal(kw.coverageRatio, 1.0);
      }
    });
  });

  describe('5. Representative Link Validation & Nationwide Collision Safety', () => {
    it('Representative sample links must all resolve successfully (HTTP 200 equivalent)', () => {
      assert.ok(model.representativeLinks.length >= 5);
      for (const sample of model.representativeLinks) {
        assert.equal(sample.isResolved, true, `${sample.label} must be resolved`);
        const resolved = resolveProductionRoute(sample.routeKey);
        assert.ok(resolved, `Resolver must return ResolvedRoute for ${sample.routeKey}`);
        assert.equal(resolved.canonicalQuery, sample.routeKey);
      }
    });

    it('Nationwide collision region (Suwon Jeongja-dong) must use canonical routeKey prefix', () => {
      const jeongjaRegion = model.regions.find((r) => r.regionId === 'gg-suwon-ja-jeongja');
      assert.ok(jeongjaRegion, 'Suwon Jeongja-dong must exist in active regions');
      assert.equal(jeongjaRegion.routeKey, '수원시-정자동');
      assert.equal(jeongjaRegion.hasCollision, true);

      // Verify URL starts with 수원시-정자동
      const sampleKw = jeongjaRegion.keywords[0];
      assert.equal(sampleKw.urlPath, `/?k=수원시-정자동-${sampleKw.routeKey}`);
      const res = resolveProductionRoute(`수원시-정자동-${sampleKw.routeKey}`);
      assert.ok(res);
      assert.equal(res.canonicalQuery, `수원시-정자동-${sampleKw.routeKey}`);

      // Bare collision query without prefix must return null (404)
      const bareRes = resolveProductionRoute(`정자동-${sampleKw.routeKey}`);
      assert.equal(bareRes, null, 'Bare collision query must return null (404)');
    });
  });

  describe('6. DEMOLITION Isolation & Safety Locks', () => {
    it('Waste Hub model must contain ZERO Demolition keywords and ZERO Demolition URLs', () => {
      for (const region of model.regions) {
        for (const kw of region.keywords) {
          assert.equal(
            kw.urlPath.includes('철거'),
            false,
            `Waste Hub must not contain demolition keyword in urlPath: ${kw.urlPath}`
          );
        }
      }
      for (const kw of model.keywordCoverage) {
        assert.equal(
          kw.displayName.includes('철거'),
          false,
          `Waste Hub keyword coverage must not contain demolition: ${kw.displayName}`
        );
      }
    });
  });

  describe('7. Public SEO Metadata & Canonical Integrity', () => {
    it('Metadata title, canonical, and robots must remain intact and valid', () => {
      assert.ok(metadata);
      assert.ok(typeof metadata.title === 'string' && metadata.title.includes('수도권 폐기물 수거 서비스 지역 허브'));
      assert.deepEqual(metadata.robots, { index: true, follow: true });
      assert.ok(metadata.alternates?.canonical);
      const canonicalStr = String(metadata.alternates.canonical);
      assert.ok(canonicalStr.endsWith('/hub/waste'));
    });
  });
});

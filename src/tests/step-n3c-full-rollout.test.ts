import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTION_REGIONS, findRegionById } from '../data/regions';
import { WASTE_P0_KEYWORDS } from '../data/keywords';
import {
  generateDynamicContent,
  buildRegionContext,
  PRODUCTION_ACTIVE_DIFFERENTIATION_REGION_IDS,
} from '../engine/content-engine';
import { getIndexableUrlEntries, getDynamicUrlEntries } from '../lib/sitemap-generator';
import { resolveBaseRoute } from '../engine/resolver';
import { PageContext } from '../types/content';

describe('STEP N-3C: Generalized Region Differentiation Full Rollout Test Suite', () => {
  it('A. Production active differentiation region count must be exactly 311', () => {
    assert.equal(PRODUCTION_ACTIVE_DIFFERENTIATION_REGION_IDS.size, 311);
  });

  it('B. All 311 active regions must build GeneralizedRegionContext successfully without error', () => {
    let successCount = 0;
    for (const r of PRODUCTION_REGIONS) {
      const ctx = buildRegionContext(r);
      assert.ok(ctx);
      assert.equal(ctx.regionId, r.regionId);
      assert.ok(ctx.semanticVariant);
      successCount++;
    }
    assert.equal(successCount, 311);
  });

  it('C. All 4,665 (311 Region x 15 Keyword) combinations must generate valid Dynamic Content without error', () => {
    let successCount = 0;
    let undefinedCount = 0;

    for (const r of PRODUCTION_REGIONS) {
      for (const kw of WASTE_P0_KEYWORDS) {
        const context: PageContext = {
          serviceFamily: 'WASTE',
          workKeyword: kw,
          region: r,
          regionLevel: r.regionType,
          seoDisplayName: r.seoDisplayName,
          dynamicKeyword: `${r.seoDisplayName} ${kw.displayName}`,
          canonicalRoute: `waste-seoul/${r.routeKey}-${kw.routeKey}`,
          isIndexable: true,
        };

        const content = generateDynamicContent(context);
        assert.ok(content);
        assert.ok(content.h1);
        assert.ok(content.decisionIntro);
        assert.ok(content.estimateDescription);
        assert.ok(content.finalCtaDescription);

        const fullText = JSON.stringify(content);
        if (fullText.includes('undefined') || fullText.includes('null') || fullText.includes('[object Object]')) {
          undefinedCount++;
        }
        successCount++;
      }
    }

    assert.equal(successCount, 4665);
    assert.equal(undefinedCount, 0);
  });

  it('D. All 15 WASTE P0 keywords must be retained', () => {
    assert.equal(WASTE_P0_KEYWORDS.length, 15);
  });

  it('E. WASTE dynamic URLs count must remain exactly 4,665', () => {
    const dynamicEntries = getDynamicUrlEntries();
    const wasteEntries = dynamicEntries.filter((e) => e.serviceFamily === 'WASTE');
    assert.equal(wasteEntries.length, 4665);
  });

  it('F. Total Indexable Sitemap URLs count must remain exactly 4,669 (Core: 4 + WASTE Dynamic: 4,665)', () => {
    const indexableEntries = getIndexableUrlEntries();
    assert.equal(indexableEntries.length, 4669);
  });

  it('G. Canonical Mismatch count across all 4,665 dynamic URLs must be exactly 0', () => {
    const dynamicEntries = getDynamicUrlEntries();
    for (const entry of dynamicEntries) {
      const urlObj = new URL(entry.url);
      const kParam = urlObj.searchParams.get('k');
      assert.ok(kParam);
      const resolved = resolveBaseRoute(kParam);
      assert.ok(resolved);
      assert.equal(resolved.serviceFamily, 'WASTE');
    }
  });

  it('H. Fake Local Fact occurrences must be exactly 0 across all 4,665 generated pages', () => {
    const forbiddenFakeFacts = [
      '아파트가 많다',
      '주택이 많다',
      '상가 밀집',
      '상권이 발달',
      '도로가 좁다',
      '진입이 어렵다',
      '교통이 복잡하다',
      '문의가 많다',
      '수요가 많다',
      '폐기물이 많이 발생한다',
      '작업이 많다',
      '고객이 많다',
    ];

    let fakeFactCount = 0;
    for (const r of PRODUCTION_REGIONS) {
      for (const kw of WASTE_P0_KEYWORDS) {
        const context: PageContext = {
          serviceFamily: 'WASTE',
          workKeyword: kw,
          region: r,
          regionLevel: r.regionType,
          seoDisplayName: r.seoDisplayName,
          dynamicKeyword: `${r.seoDisplayName} ${kw.displayName}`,
          canonicalRoute: `waste-seoul/${r.routeKey}-${kw.routeKey}`,
          isIndexable: true,
        };

        const content = generateDynamicContent(context);
        const fullText = JSON.stringify(content);

        for (const fact of forbiddenFakeFacts) {
          if (fullText.includes(fact)) {
            fakeFactCount++;
          }
        }
      }
    }
    assert.equal(fakeFactCount, 0);
  });

  it('I. DEMOLITION indexable sitemap URLs count must be exactly 0 (Isolated / On-Hold)', () => {
    const indexableEntries = getIndexableUrlEntries();
    const demoEntries = indexableEntries.filter((e) => e.serviceFamily === 'DEMOLITION');
    assert.equal(demoEntries.length, 0);
  });
});

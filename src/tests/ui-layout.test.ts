import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { resolveBaseRoute, createPageContext } from '../engine/resolver';
import { generateDynamicContent } from '../engine/content-engine';
import { generatePageMetadata } from '../engine/seo-engine';
import { P0_KEYWORDS } from '../data/keywords/p0-keywords';
import { INITIAL_REGION_FIXTURES } from '../data/regions/initial-fixture';

describe('STEP 3-A UI, Responsive & Claim Safety Tests', () => {
  // 1. Long Keyword Layout & Resolution Test
  describe('Long Keyword Handling', () => {
    it('긴 한글 키워드(안산시-중앙동-사무실폐기물처리)가 정상 해석되고 H1 및 메타데이터가 무결해야 한다', () => {
      const resolved = resolveBaseRoute('안산시-중앙동-사무실폐기물처리');
      assert.ok(resolved, '안산시-중앙동-사무실폐기물처리 resolve 성공');

      const ctx = createPageContext(resolved);
      const content = generateDynamicContent(ctx);
      const meta = generatePageMetadata(ctx);

      assert.equal(content.h1, '안산시 중앙동 사무실폐기물처리');
      assert.ok(content.h1.length >= 15, '긴 키워드 길이 확인');
      assert.ok(content.heroHook.includes('사무실'));
      assert.ok(typeof meta.title === 'string');
      assert.ok(meta.title.includes('안산시 중앙동 사무실폐기물처리'));
      assert.ok(meta.alternates?.canonical);
    });
  });

  // 2. Marketing Claim Safety Regression Audit
  describe('Marketing Claim Safety Audit', () => {
    const PROHIBITED_WORDS = [
      '최저가',
      '100% 안전',
      '지역 1위',
      '흠집 없이 보장',
      '무조건 당일',
      '완벽 처리',
      '전문 인력 보유',
      '자체 차량 보유',
    ];

    it('모든 14개 작업 키워드 및 지역 조합에서 금지된 과장/미검증 홍보 문구가 없어야 한다', () => {
      for (const region of INITIAL_REGION_FIXTURES) {
        if (!region.isActive) continue;
        for (const kw of P0_KEYWORDS) {
          const ctx = {
            region,
            workKeyword: kw,
            serviceFamily: kw.serviceFamily,
            regionLevel: region.regionType,
            seoDisplayName: region.seoDisplayName,
            dynamicKeyword: `${region.seoDisplayName} ${kw.displayName}`,
            canonicalRoute: `${region.routeKey}-${kw.routeKey}`,
            isIndexable: region.isIndexable && kw.isIndexable,
          };

          const content = generateDynamicContent(ctx);
          const meta = generatePageMetadata(ctx);

          const fullText = [
            content.h1,
            content.heroHook,
            content.heroDescription,
            content.decisionTitle,
            content.decisionIntro,
            ...content.decisionPoints.map((p) => `${p.title} ${p.desc}`),
            ...content.faqItems.map((f) => `${f.question} ${f.answer}`),
            content.finalCtaTitle,
            content.finalCtaDescription,
            String(meta.title),
            String(meta.description),
          ].join(' ');

          for (const badWord of PROHIBITED_WORDS) {
            assert.equal(
              fullText.includes(badWord),
              false,
              `금지된 마케팅 문구 "${badWord}" 발견: [${region.seoDisplayName} ${kw.displayName}]`
            );
          }
        }
      }
    });
  });

  // 3. 7 Sections Content Completeness
  describe('7 Sections Completeness', () => {
    it('각 섹션에 필요한 데이터가 온전히 제공되어야 한다', () => {
      const resolved = resolveBaseRoute('매탄동-가구수거')!;
      const ctx = createPageContext(resolved);
      const content = generateDynamicContent(ctx);

      // Section 1 Hero
      assert.ok(content.h1);
      assert.ok(content.heroHook);
      assert.ok(content.heroDescription);

      // Section 2 What we collect
      assert.ok(content.serviceSectionTitle);
      assert.ok(content.serviceItems.length >= 4);

      // Section 3 Decision
      assert.ok(content.decisionTitle);
      assert.ok(content.decisionPoints.length >= 3);

      // Section 4 Estimate
      assert.ok(content.estimateTitle);
      assert.ok(content.estimateDescription);

      // Section 5 Process
      assert.ok(content.processTitle);

      // Section 6 FAQ
      assert.ok(content.faqItems.length >= 3);

      // Section 7 Final CTA
      assert.ok(content.finalCtaTitle);
      assert.ok(content.finalCtaDescription);
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { resolveBaseRoute, createPageContext } from '../engine/resolver';
import { generateDynamicContent } from '../engine/content-engine';
import { generatePageMetadata } from '../engine/seo-engine';
import { generatePageSchema } from '../engine/schema-engine';
import { SITE_CONFIG } from '../config/site';

describe('STEP 2-B Dynamic SEO & Content Engine Tests', () => {
  // 1. ROUTE TESTS
  describe('[ROUTE] Resolution & 404 Rules', () => {
    it('k가 없는 경우 메인 루트로 정상 인식되어야 한다 (Resolver null 반환 -> Page 200 OK 처리)', () => {
      assert.equal(resolveBaseRoute(undefined), null);
      assert.equal(resolveBaseRoute(''), null);
    });

    it('유효한 k 요청은 정상 ResolvedRoute를 반환해야 한다', () => {
      const r = resolveBaseRoute('매탄동-폐기물처리비용');
      assert.ok(r);
      assert.equal(r.region.seoDisplayName, '매탄동');
      assert.equal(r.work.displayName, '폐기물처리 비용');
      assert.equal(r.canonicalQuery, '매탄동-폐기물처리비용');
      assert.equal(r.isIndexable, true);
    });

    it('유효하지 않은 지역 쿼리는 null을 반환해야 한다 (Page에서 notFound 404 유도)', () => {
      assert.equal(resolveBaseRoute('없는동-폐기물처리'), null);
      assert.equal(resolveBaseRoute('가짜지역-가구수거'), null);
    });

    it('유효하지 않은 작업명 쿼리는 null을 반환해야 한다 (Page에서 notFound 404 유도)', () => {
      assert.equal(resolveBaseRoute('매탄동-없는작업'), null);
      assert.equal(resolveBaseRoute('매탄동-가짜서비스'), null);
    });

    it('비활성화(isActive=false) 지역은 null을 반환해야 한다 (Soft 404 방지)', () => {
      const inactiveRegionFinder = () => ({
        regionId: 'inactive-dong',
        officialName: '비활성동',
        routeKey: '비활성동',
        seoDisplayName: '비활성동',
        regionType: 'DONG' as const,
        upperRegionId: 'gyeonggi',
        aliases: [],
        hasNationwideCollision: false,
        priority: 'P2' as const,
        isActive: false,
        isIndexable: false,
        isSitemapEligible: false,
        isHubEligible: false,
      });
      assert.equal(resolveBaseRoute('비활성동-폐기물처리', inactiveRegionFinder), null);
    });
  });

  // 2. SEO ENGINE TESTS
  describe('[SEO] Metadata, Canonical, Robots', () => {
    const resolved = resolveBaseRoute('매탄동-폐기물처리비용')!;
    const context = createPageContext(resolved);
    const metadata = generatePageMetadata(context);

    it('Title은 {Dynamic Keyword} | {Supporting Phrase} | 올케어환경 형식이어야 한다', () => {
      assert.ok(typeof metadata.title === 'string');
      assert.ok(metadata.title.startsWith('매탄동 폐기물처리 비용 |'));
      assert.ok(metadata.title.endsWith(`| ${SITE_CONFIG.brandName}`));
    });

    it('Meta Description은 단순 치환이 아니며 문제, 의도, 상담 안내를 포함해야 한다', () => {
      assert.ok(typeof metadata.description === 'string');
      assert.ok(metadata.description.includes('매탄동'));
      assert.ok(metadata.description.includes('폐기물처리 비용'));
      assert.ok(metadata.description.includes('견적'));
    });

    it('Self-Canonical URL이 정확히 일치해야 한다', () => {
      assert.ok(metadata.alternates?.canonical);
      const canonicalStr = String(metadata.alternates.canonical);
      assert.ok(canonicalStr.includes('/?k=%EB%A7%A4%ED%83%84%EB%8F%99-%ED%8F%90%EA%B8%B0%EB%AC%BC%EC%B2%98%EB%A6%AC%EB%B9%84%EC%9A%A9') ||
                canonicalStr.includes('/?k=매탄동-폐기물처리비용'));
    });

    it('Indexable Route의 경우 robots는 index: true, follow: true여야 한다', () => {
      const robots = metadata.robots as { index: boolean; follow: boolean };
      assert.equal(robots.index, true);
      assert.equal(robots.follow, true);
    });

    it('Non-indexable Route의 경우 robots는 index: false, follow: true여야 한다', () => {
      const nonIndexableContext = { ...context, isIndexable: false };
      const nonIndexableMetadata = generatePageMetadata(nonIndexableContext);
      const robots = nonIndexableMetadata.robots as { index: boolean; follow: boolean };
      assert.equal(robots.index, false);
      assert.equal(robots.follow, true);
    });

    it('OpenGraph 데이터가 올바르게 설정되어야 한다', () => {
      assert.ok(metadata.openGraph);
      assert.equal(metadata.openGraph.siteName, SITE_CONFIG.brandName);
      assert.ok(metadata.openGraph.title?.toString().includes('매탄동 폐기물처리 비용'));
    });
  });

  // 3. CONTENT DIFFERENTIATION TESTS
  describe('[CONTENT] 14 Keywords & Intent Differentiation', () => {
    const rDisposal = resolveBaseRoute('매탄동-폐기물처리')!;
    const rCompany = resolveBaseRoute('매탄동-폐기물처리업체')!;
    const rPrice = resolveBaseRoute('매탄동-폐기물처리비용')!;
    const rFurniture = resolveBaseRoute('매탄동-가구수거')!;
    const rMoving = resolveBaseRoute('매탄동-이사폐기물처리')!;
    const rOffice = resolveBaseRoute('매탄동-사무실폐기물처리')!;

    const cDisposal = generateDynamicContent(createPageContext(rDisposal));
    const cCompany = generateDynamicContent(createPageContext(rCompany));
    const cPrice = generateDynamicContent(createPageContext(rPrice));
    const cFurniture = generateDynamicContent(createPageContext(rFurniture));
    const cMoving = generateDynamicContent(createPageContext(rMoving));
    const cOffice = generateDynamicContent(createPageContext(rOffice));

    it('H1은 정확히 {seoDisplayName} {work.displayName} 형식으로 단 1개 생성되어야 한다', () => {
      assert.equal(cDisposal.h1, '매탄동 폐기물처리');
      assert.equal(cCompany.h1, '매탄동 폐기물처리업체');
      assert.equal(cPrice.h1, '매탄동 폐기물처리 비용');
      assert.equal(cFurniture.h1, '매탄동 가구수거');
      assert.equal(cMoving.h1, '매탄동 이사폐기물처리');
      assert.equal(cOffice.h1, '매탄동 사무실폐기물처리');
    });

    it('Hero Hook은 각 Search Intent별로 고유하게 분기되어야 한다', () => {
      const hooks = [
        cDisposal.heroHook,
        cCompany.heroHook,
        cPrice.heroHook,
        cFurniture.heroHook,
        cMoving.heroHook,
        cOffice.heroHook,
      ];
      // 모든 훅이 고유한지 확인
      const uniqueHooks = new Set(hooks);
      assert.equal(uniqueHooks.size, 6, '6개 Intent의 Hero Hook은 모두 서로 달라야 함');

      // Price는 질문형 비용 의도 포함 확인
      assert.ok(cPrice.heroHook.includes('비용이 어떤 기준으로 달라지는지'));
      // Furniture는 대형 가구 안전 반출 의도 포함 확인
      assert.ok(cFurniture.heroHook.includes('침대, 소파, 장롱'));
    });

    it('Decision Title 및 Decision Points가 Intent별로 고유하게 분기되어야 한다', () => {
      assert.notEqual(cPrice.decisionTitle, cFurniture.decisionTitle);
      assert.notEqual(cPrice.decisionPoints[0].title, cFurniture.decisionPoints[0].title);

      // Price 의도: 4대 비용 요소(물량/톤수, 층수/승강기 등) 포함
      assert.ok(cPrice.decisionPoints.some((p) => p.title.includes('톤수')));
      // Furniture 의도: 분해 및 문 크기 등 포함
      assert.ok(cFurniture.decisionPoints.some((p) => p.title.includes('분해')));
    });

    it('FAQ 항목이 각 Intent별 특성에 맞추어 고유하게 제공되어야 한다', () => {
      assert.notEqual(cPrice.faqItems[0].question, cFurniture.faqItems[0].question);
      assert.notEqual(cMoving.faqItems[0].question, cOffice.faqItems[0].question);

      // Furniture FAQ에 붙박이장/바닥 긁힘 관련 질의 포함 확인
      assert.ok(cFurniture.faqItems.some((f) => f.question.includes('붙박이장')));
      // Moving FAQ에 이사 일정 관련 질의 포함 확인
      assert.ok(cMoving.faqItems.some((f) => f.question.includes('이삿짐')));
    });

    it('동일한 URL 요청에 대해서는 100% 동일한 콘텐츠를 결정론적으로 반환해야 한다 (Deterministic)', () => {
      const run1 = generateDynamicContent(createPageContext(rPrice));
      const run2 = generateDynamicContent(createPageContext(rPrice));
      assert.deepEqual(run1, run2, '동일 컨텍스트에 대해 콘텐츠는 불변이어야 함');
    });
  });

  // 4. SCHEMA ENGINE TESTS
  describe('[SCHEMA] JSON-LD Validation', () => {
    const resolved = resolveBaseRoute('매탄동-폐기물처리비용')!;
    const context = createPageContext(resolved);
    const schema = generatePageSchema(context);

    it('유효한 JSON 형식이어야 하며 문법 에러가 없어야 한다', () => {
      const jsonStr = JSON.stringify(schema);
      assert.doesNotThrow(() => JSON.parse(jsonStr));
    });

    it('LocalBusiness 스키마는 포함되지 않아야 한다 (허위 지점 오인 방지)', () => {
      const graph = (schema as { '@graph': Array<{ '@type': string }> })['@graph'];
      assert.equal(graph.some((item) => item['@type'] === 'LocalBusiness'), false);
    });

    it('Organization, WebSite, Service, BreadcrumbList 스키마가 포함되어야 한다', () => {
      const graph = (schema as { '@graph': Array<{ '@type': string }> })['@graph'];
      const types = graph.map((i) => i['@type']);
      assert.ok(types.includes('Organization'));
      assert.ok(types.includes('WebSite'));
      assert.ok(types.includes('Service'));
      assert.ok(types.includes('BreadcrumbList'));
    });

    it('Service 스키마의 serviceType에 내부 enum 코드(PRICE_ESTIMATE 등)가 노출되지 않아야 한다', () => {
      const graph = (schema as { '@graph': Array<{ '@type': string; serviceType?: string }> })['@graph'];
      const service = graph.find((i) => i['@type'] === 'Service');
      assert.ok(service);
      assert.equal(service.serviceType?.includes('PRICE_ESTIMATE'), false);
      assert.ok(service.serviceType?.includes('폐기물처리 비용'));
    });

    it('전화번호가 없을 경우 빈 문자열 telephone 필드를 생성하지 않아야 한다', () => {
      const graph = (schema as { '@graph': Array<{ '@type': string; telephone?: string }> })['@graph'];
      const org = graph.find((i) => i['@type'] === 'Organization');
      assert.ok(org);
      if (org.telephone !== undefined) {
        assert.notEqual(org.telephone, '');
        assert.notEqual(org.telephone, '010-0000-0000');
      }
    });

    it('허위 주소, 평점, 리뷰 스키마가 없어야 한다', () => {
      const graph = (schema as { '@graph': Array<Record<string, unknown>> })['@graph'];
      for (const item of graph) {
        assert.equal('address' in item, false);
        assert.equal('aggregateRating' in item, false);
        assert.equal('review' in item, false);
      }
    });
  });

  // 5. SSR / RAW INITIAL HTML ELEMENTS TEST
  describe('[SSR] Initial Raw HTML Component Simulation', () => {
    it('지정된 3개 주요 URL의 핵심 정보가 최초 SSR 출력에 완벽히 포함되어야 한다', () => {
      const testCases = [
        '매탄동-폐기물처리업체',
        '매탄동-폐기물처리비용',
        '매탄동-가구수거',
      ];

      for (const query of testCases) {
        const r = resolveBaseRoute(query);
        assert.ok(r, `${query} resolve 성공`);
        const ctx = createPageContext(r);
        const content = generateDynamicContent(ctx);
        const meta = generatePageMetadata(ctx);
        const schema = generatePageSchema(ctx);

        // 필수 태그 존재성 검증
        assert.ok(meta.title, 'Title 존재');
        assert.ok(meta.description, 'Meta Description 존재');
        assert.ok(meta.alternates?.canonical, 'Canonical 존재');
        assert.ok(content.h1, 'H1 존재');
        assert.ok(content.heroHook, 'Hero Hook 존재');
        assert.ok(content.decisionTitle, '주요 H2 존재');
        assert.ok(content.decisionPoints.length >= 3, 'Decision Text 3개 이상');
        assert.ok(content.faqItems.length >= 3, 'FAQ 3개 이상');
        assert.ok(schema['@context'] === 'https://schema.org', 'JSON-LD Schema 존재');
      }
    });
  });
});

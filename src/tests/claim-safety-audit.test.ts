import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveBaseRoute, createPageContext } from '@/engine/resolver';
import { generateDynamicContent } from '@/engine/content-engine';
import { generatePageSchema } from '@/engine/schema-engine';
import { hasValidContactPhone } from '@/config/site';
import fs from 'node:fs';
import path from 'node:path';

describe('STEP 3-C2 Claim Safety, Fake Contact & Dynamic Intent Audit', () => {
  describe('1. Fake Contact & Phone Number Safety', () => {
    it('더미 및 가짜 전화번호는 무효 처리되어야 한다', () => {
      assert.strictEqual(hasValidContactPhone('1666-0000'), false);
      assert.strictEqual(hasValidContactPhone('1588-0000'), false);
      assert.strictEqual(hasValidContactPhone('010-0000-0000'), false);
      assert.strictEqual(hasValidContactPhone('000-0000-0000'), false);
      assert.strictEqual(hasValidContactPhone(''), false);
      assert.strictEqual(hasValidContactPhone(undefined), false);
    });

    it('실제 유효한 번호가 설정된 경우에만 true를 반환해야 한다', () => {
      assert.strictEqual(hasValidContactPhone('02-1234-5678'), true);
      assert.strictEqual(hasValidContactPhone('010-9876-5432'), true);
      assert.strictEqual(hasValidContactPhone('1544-1234'), true);
    });

    it('전화번호가 등록되지 않은 환경에서는 Schema에 telephone 필드가 없어야 한다', () => {
      const resolved = resolveBaseRoute('매탄동-폐기물처리업체');
      assert.ok(resolved);
      const ctx = createPageContext(resolved);
      const schema = generatePageSchema(ctx);
      const graph = schema['@graph'] as Record<string, unknown>[];
      const org = graph.find(item => item['@type'] === 'Organization');
      assert.ok(org);
      assert.strictEqual(org.telephone, undefined);
    });
  });

  describe('2. Unverified Marketing Claim String Audit (FOUND = 0)', () => {
    const FORBIDDEN_CLAIMS = [
      '1666-0000',
      '최저가',
      '지역 1위',
      '무조건 당일',
      '당일·야간 수거 가능',
      '야간 수거 가능',
      '주말·공휴일 정상 수거',
      '추가비용 방지',
      '정식 인허가',
      '적법 처리',
      '적법 폐기장',
      '숙련 인력 보유',
      '자체 차량 보유',
      '카드 결제 가능',
      '세금계산서 발행 가능',
      '허가 보유',
      '정식 운반업체',
      '지정 처리장',
      '폐기증명 발행',
      '모든 건설폐기물 처리',
      '원천 방지',
      '확정 견적',
      '숙련 인력 신속 수거',
      '안전 반출',
      '뒷정리 기본',
      '뒷정리 청소 기본 포함',
    ];

    it('content-engine.ts의 14개 작업 템플릿에 금지된 마케팅 클레임이 일체 없어야 한다', () => {
      const contentEngineFile = fs.readFileSync(
        path.join(process.cwd(), 'src/engine/content-engine.ts'),
        'utf-8'
      );
      for (const claim of FORBIDDEN_CLAIMS) {
        assert.strictEqual(
          contentEngineFile.includes(claim),
          false,
          `content-engine.ts에 금지된 클레임 [${claim}]이(가) 발견되었습니다.`
        );
      }
    });

    it('page.tsx 소스 코드에 금지된 마케팅 클레임이 일체 없어야 한다', () => {
      const pageFile = fs.readFileSync(
        path.join(process.cwd(), 'src/app/page.tsx'),
        'utf-8'
      );
      for (const claim of FORBIDDEN_CLAIMS) {
        assert.strictEqual(
          pageFile.includes(claim),
          false,
          `page.tsx에 금지된 클레임 [${claim}]이(가) 발견되었습니다.`
        );
      }
    });
  });

  describe('3. Dynamic Intent Sample Comparison (5 Core Intent Pages)', () => {
    const routeKeys = [
      '매탄동-폐기물처리업체',
      '매탄동-폐기물처리비용',
      '매탄동-가구수거',
      '매탄동-이사폐기물처리',
      '매탄동-사무실폐기물처리',
    ];

    const sampleOutputs = routeKeys.map(key => {
      const resolved = resolveBaseRoute(key);
      assert.ok(resolved, `${key} 경로가 정상 해석되어야 함`);
      const ctx = createPageContext(resolved);
      return {
        key,
        content: generateDynamicContent(ctx),
      };
    });

    it('5개 샘플의 H1은 고유해야 한다 (중복 = 0)', () => {
      const h1s = sampleOutputs.map(s => s.content.h1);
      const uniqueH1s = new Set(h1s);
      assert.strictEqual(uniqueH1s.size, 5);
    });

    it('5개 샘플의 Hero Hook은 Intent별로 상이해야 한다 (중복 = 0)', () => {
      const hooks = sampleOutputs.map(s => s.content.heroHook);
      const uniqueHooks = new Set(hooks);
      assert.strictEqual(uniqueHooks.size, 5);
    });

    it('5개 샘플의 Section 03 Decision Title은 Intent별로 완전히 상이해야 한다 (중복 = 0)', () => {
      const decisionTitles = sampleOutputs.map(s => s.content.decisionTitle);
      const uniqueTitles = new Set(decisionTitles);
      assert.strictEqual(uniqueTitles.size, 5);
    });

    it('5개 샘플의 Section 03 Decision Points는 실질적으로 서로 다른 관점을 제공해야 한다', () => {
      const coPoints = sampleOutputs[0].content.decisionPoints.map(p => p.title);
      assert.ok(coPoints.some(t => t.includes('작업 범위') || t.includes('견적 상담')));

      const pricePoints = sampleOutputs[1].content.decisionPoints.map(p => p.title);
      assert.ok(pricePoints.some(t => t.includes('물량') || t.includes('승강기') || t.includes('분해')));

      const furniturePoints = sampleOutputs[2].content.decisionPoints.map(p => p.title);
      assert.ok(furniturePoints.some(t => t.includes('분해') || t.includes('통로') || t.includes('승강기')));

      const movingPoints = sampleOutputs[3].content.decisionPoints.map(p => p.title);
      assert.ok(movingPoints.some(t => t.includes('퇴거') || t.includes('시간') || t.includes('분리')));

      const officePoints = sampleOutputs[4].content.decisionPoints.map(p => p.title);
      assert.ok(officePoints.some(t => t.includes('엘리베이터') || t.includes('파티션') || t.includes('빌딩')));
    });

    it('5개 샘플의 FAQ 항목들은 각 Intent별 고유 질문을 다루어야 한다', () => {
      const faqs = sampleOutputs.map(s => s.content.faqItems.map(f => f.question).join('|'));
      const uniqueFaqs = new Set(faqs);
      assert.strictEqual(uniqueFaqs.size, 5);
    });
  });

  describe('4. STEP 3-D UX Micro Corrections Audit', () => {
    it('FAQ summary 태그는 details의 직계 자식이어야 하며 dt/dd 태그로 감싸지지 않아야 한다', () => {
      const pageFile = fs.readFileSync(
        path.join(process.cwd(), 'src/app/page.tsx'),
        'utf-8'
      );
      assert.strictEqual(pageFile.includes('<dt'), false, 'page.tsx에 불필요한 <dt> 태그가 존재하지 않아야 합니다.');
      assert.strictEqual(pageFile.includes('<dd'), false, 'page.tsx에 불필요한 <dd> 태그가 존재하지 않아야 합니다.');
      assert.strictEqual(pageFile.includes('<details'), true, 'page.tsx에 <details> 태그가 존재해야 합니다.');
      assert.strictEqual(pageFile.includes('<summary'), true, 'page.tsx에 <summary> 태그가 존재해야 합니다.');
    });

    it('Footer 링크에서 내부 용어 (허브)가 제거되어야 한다', () => {
      const footerFile = fs.readFileSync(
        path.join(process.cwd(), 'src/components/Footer.tsx'),
        'utf-8'
      );
      assert.strictEqual(footerFile.includes('(허브)'), false, 'Footer에 "(허브)" 텍스트가 노출되지 않아야 합니다.');
      assert.ok(footerFile.includes('수원시 서비스 지역 안내'), 'Footer에 정제된 지역 안내 문구가 포함되어야 합니다.');
    });

    it('Hero CTA는 모바일에서 flex-1 기반 2열 배치를 지원해야 한다', () => {
      const pageFile = fs.readFileSync(
        path.join(process.cwd(), 'src/app/page.tsx'),
        'utf-8'
      );
      assert.ok(pageFile.includes('flex items-center gap-2.5 sm:flex-wrap sm:gap-3'));
      assert.ok(pageFile.includes('flex-1 sm:flex-initial'));
    });
  });

  describe('5. STEP 4-B Business & Contact CTA Audit', () => {
    it('코드베이스 전체 UI에서 sms: 프로토콜이 일체 존재하지 않아야 한다 (0 found)', () => {
      const pageFile = fs.readFileSync(
        path.join(process.cwd(), 'src/app/page.tsx'),
        'utf-8'
      );
      const floatingCtaFile = fs.readFileSync(
        path.join(process.cwd(), 'src/components/FloatingCta.tsx'),
        'utf-8'
      );
      const headerFile = fs.readFileSync(
        path.join(process.cwd(), 'src/components/Header.tsx'),
        'utf-8'
      );
      assert.strictEqual(pageFile.includes('sms:'), false, 'page.tsx에 sms: 프로토콜이 남아있지 않아야 합니다');
      assert.strictEqual(floatingCtaFile.includes('sms:'), false, 'FloatingCta에 sms: 프로토콜이 남아있지 않아야 합니다');
      assert.strictEqual(headerFile.includes('sms:'), false, 'Header에 sms: 프로토콜이 남아있지 않아야 합니다');
    });

    it('businessVerified 또는 phoneVerified가 false일 때 Schema에 address 및 telephone이 누출되지 않아야 한다', () => {
      const resolved = resolveBaseRoute('매탄동-폐기물처리업체');
      assert.ok(resolved);
      const ctx = createPageContext(resolved);
      const schema = generatePageSchema(ctx);
      const graph = schema['@graph'] as Record<string, unknown>[];
      const org = graph.find(item => item['@type'] === 'Organization');
      assert.ok(org);
      assert.strictEqual(org.telephone, undefined, '미검증 상태에서는 telephone이 누출되지 않아야 합니다');
      assert.strictEqual(org.address, undefined, '미검증 상태에서는 address가 누출되지 않아야 합니다');
    });
  });
});



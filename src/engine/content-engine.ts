import { PageContext, ContentOutput, DecisionPoint, FaqItem } from '@/types/content';
import { generateDemolitionContent } from './demolition-content-engine';
import { findRegionById, PRODUCTION_REGIONS } from '@/data/regions';
import { RegionEntity } from '@/types/region';

interface KeywordContentTemplate {
  heroBenefit: string;
  heroHook: (regionName: string) => string;
  heroDescription: (regionName: string) => string;
  serviceSectionTitle: string;
  serviceItems: string[];
  decisionTitle: string;
  decisionIntro: (regionName: string) => string;
  decisionPoints: (regionName: string) => DecisionPoint[];
  estimateTitle: string;
  estimateDescription: (regionName: string) => string;
  processTitle: string;
  faqItems: (regionName: string) => FaqItem[];
  finalCtaTitle: string;
  finalCtaDescription: (regionName: string) => string;
}

/**
 * 폐기물 계열 표준 5개 FAQ 생성 헬퍼
 * - 방문견적 강제 표현 제거, 사진·물량 우선 상담 구조 확립
 * - 각 답변 2~3문장의 풍부하고 유용한 정보 제공
 */
function createStandardFaqs(
  regionName: string,
  workName: string,
  customFaq3?: { question: string; answer: string }
): FaqItem[] {
  return [
    {
      question: `${regionName} ${workName} 견적 상담에는 어떤 정보가 필요한가요?`,
      answer:
        '수거할 품목이 한눈에 보이는 전체 사진과 대략적인 수량 또는 양을 먼저 보내주세요. 건물 층수, 엘리베이터 사용 여부, 차량 접근 조건까지 알려주시면 작업 범위를 보다 정확하게 확인할 수 있습니다.',
    },
    {
      question: '폐기물 종류에 따라 견적이 달라지나요?',
      answer:
        '가구, 가전, 목재, 생활폐기물, 혼합 폐기물 등 품목 구성과 처리 조건에 따라 필요한 작업이 달라질 수 있습니다. 분해·해체가 필요한 품목이나 반출 난이도도 함께 확인합니다.',
    },
    customFaq3 || {
      question: '장롱이나 소파 같은 대형 가구도 수거할 수 있나요?',
      answer:
        '대형 가구와 무거운 집기는 크기와 반출 동선을 사진으로 먼저 확인합니다. 필요한 경우 분해 여부와 계단·엘리베이터 사용 조건까지 확인해 가능한 작업 방법을 안내합니다.',
    },
    {
      question: '여러 종류의 폐기물이 함께 있어도 상담할 수 있나요?',
      answer:
        '여러 품목이 섞여 있다면 현장 전체가 보이는 사진과 대략적인 양을 먼저 보내주세요. 품목 구성을 확인한 뒤 수거 가능한 범위와 사전에 필요한 정리 사항을 안내합니다.',
    },
    {
      question: '일정이 촉박한 경우에는 어떻게 문의하면 되나요?',
      answer:
        '현장 사진과 폐기물의 대략적인 양, 희망 일정을 먼저 전달해 주세요. 현재 작업 일정과 방문 가능 여부를 확인한 뒤 가능한 범위에서 일정을 안내합니다.',
    },
  ];
}

/**
 * 15개 작업 키워드별 Search Intent 차별화 템플릿 매핑
 * - 런타임 랜덤/인공지능 추론 일체 배제 (100% 결정론적 매핑)
 * - 허위 지역 특성 날조 금지 (지역명은 위치 컨텍스트로만 안전 결합)
 * - 마케팅 과장 및 미검증 표현 배제 (안전 수칙 준수)
 */
const TEMPLATE_BY_KEYWORD_ID: Record<string, KeywordContentTemplate> = {
  // 01. 폐기물처리 (GENERAL_DISPOSAL)
  'kw-general-disposal': {
    heroBenefit: '현장 조건에 맞춰 안전하게 처리합니다',
    heroHook: (r) => `${r}에서 버려야 할 폐기물이 많은데 어떻게 분리하고 처리해야 할지 고민이신가요?`,
    heroDescription: () =>
      '수거 대상 품목과 현장 조건을 사진으로 보내주시면 체계적인 분리 배출 및 수거 절차를 안내해드립니다.',
    serviceSectionTitle: '주요 처리 대상 품목',
    serviceItems: ['대형 생활가구', '가전제품 및 잡화', '혼합 배출 폐기물', '창고·베란다 묵은 짐'],
    decisionTitle: '폐기물 배출 시 사전 확인 사항',
    decisionIntro: (r) =>
      `${r} 현장에서 폐기물처리를 진행하기 전에는 반출 경로와 수거 품목의 종류를 먼저 파악하는 것이 중요합니다.`,
    decisionPoints: () => [
      { title: '품목별 분류 확인', desc: '가구류, 가전류, 일반 잡화류의 분리 여부와 전체 부피를 미리 가늠합니다.' },
      { title: '반출 동선 확보', desc: '현관문, 복도, 계단, 승강기 등 작업 통로의 폭과 높이를 확인합니다.' },
      { title: '차량 접근성', desc: '건물 입구 인근 작업 차량의 정차 및 상차 가능 여부를 사전에 조율합니다.' },
    ],
    estimateTitle: '폐기물처리 비용 산정 요소',
    estimateDescription: () =>
      '폐기물 처리는 전체 적재 부피, 품목의 무게, 수작업 반출 층수 및 승강기 유무에 따라 필요한 인력과 차량 톤수가 결정됩니다.',
    processTitle: '간편한 4단계 수거 진행 절차',
    faqItems: (r) => createStandardFaqs(r, '폐기물처리'),
    finalCtaTitle: '정확한 폐기물 처리 상담이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 수거 현장 사진과 대략적인 품목을 보내주시면 작업 내용과 적정 일정을 확인해 드립니다.`,
  },

  // 02. 폐기물처리업체 (GENERAL_COMPANY)
  'kw-general-company': {
    heroBenefit: '전담 인력이 방문하여 정리해드립니다',
    heroHook: (r) => `${r}에서 수거 인력이 직접 방문하여 규칙에 맞춰 처리하는 폐기물 업체를 찾고 계신가요?`,
    heroDescription: () =>
      '작업 현장의 짐 양과 통로 여건을 사진으로 공유해 주시면 전담 인력 배치와 수거 계획을 안내해드립니다.',
    serviceSectionTitle: '업체 전담 방문 수거 분야',
    serviceItems: ['가정집 대형폐기물', '사업장 및 매장 집기', '무거운 중량물 반출', '현장 맞춤형 분리수거'],
    decisionTitle: '수거 업체 선택 시 고려 기준',
    decisionIntro: (r) =>
      `${r} 지역에서 폐기물처리업체를 선정할 때는 현장 여건을 충분히 상담하고 책임감 있게 수거하는지 확인해야 합니다.`,
    decisionPoints: () => [
      { title: '명확한 작업 범위', desc: '실내 반출, 분해 필요 여부, 마무리 정리까지 포함된 작업인지 점검합니다.' },
      { title: '현장 인력 및 차량 배치', desc: '고층 건물, 좁은 통로, 무거운 가구 등 현장 특성에 맞는 수거 인력과 차량을 배치합니다.' },
      { title: '사진 기반 투명 상담', desc: '사진 기반으로 현장 조건을 세밀히 검토하여 추가 변수를 최소화합니다.' },
    ],
    estimateTitle: '업체 수거 견적 안내 기준',
    estimateDescription: () =>
      '투입 인원수, 차량 대수, 승강기 유무 및 현장 작업 조건 난이도를 종합적으로 반영하여 견적을 산출합니다.',
    processTitle: '방문 수거 대행 진행 절차',
    faqItems: (r) => createStandardFaqs(r, '폐기물처리업체'),
    finalCtaTitle: '수거 업체의 도움이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 수거 현장 사진을 보내주시면 작업 내용과 적정 일정을 확인해 드립니다.`,
  },

  // 03. 폐기물처리 비용 (PRICE_ESTIMATE)
  'kw-price-estimate': {
    heroBenefit: '현장 조건에 맞춰 안내해드립니다',
    heroHook: (r) => `${r} 폐기물 처리 비용이 어떤 기준으로 달라지는지 투명한 확인이 필요하신가요?`,
    heroDescription: () =>
      '사진과 대략적인 양을 보내주시면 부피, 무게, 층수, 엘리베이터 여부를 반영한 견적 기준을 안내해드립니다.',
    serviceSectionTitle: '비용 산정 대상 주요 품목',
    serviceItems: ['가구 단품 및 세트', '트럭 단위 적재 물량', '계단 수작업 반출 품목', '해체·분해 작업 필요 품목'],
    decisionTitle: '폐기물 처리 비용을 좌우하는 4대 요소',
    decisionIntro: (r) =>
      `${r} 현장의 폐기물처리 비용은 단순 품목뿐 아니라 상하차 여건과 작업 난이도에 따라 달라집니다.`,
    decisionPoints: () => [
      { title: '물량 및 적재 톤수', desc: '폐기물의 총 부피와 무게에 따라 1톤 트럭 등 필요 차량 규모가 결정됩니다.' },
      { title: '층수 및 승강기 유무', desc: '엘리베이터 이용 가능 여부 또는 계단 반출 층수에 따라 작업 공수가 달라집니다.' },
      { title: '분해 및 해체 작업', desc: '장롱, 대형 침대 등 문 통과를 위해 현장 분해가 필요한지 여부를 확인합니다.' },
      { title: '차량 정차 위치 및 동선', desc: '건물 입구와 차량 정차 위치 사이의 이동 거리가 작업 시간에 영향을 줍니다.' },
    ],
    estimateTitle: '사진 기반 맞춤 견적 확인',
    estimateDescription: () =>
      '수거 품목과 주변 환경이 담긴 사진을 전달해 주시면 부피와 반출 여건을 반영한 견적을 정확히 안내해드립니다.',
    processTitle: '비용 확인 및 견적 상담 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '폐기물처리 비용', {
        question: '추가 비용이 발생하는 주요 요인은 무엇인가요?',
        answer:
          '사다리차 사용 여부, 엘리베이터 없는 고층 계단 반출, 대형 품목의 현장 분해 해체 난이도 등에 따라 작업 조건이 달라질 수 있습니다. 사전 사진 상담 시 이러한 조건을 미리 확인해 드립니다.',
      }),
    finalCtaTitle: '투명하고 정직한 비용 상담',
    finalCtaDescription: (r) => `${r} 현장 사진을 전송하시면 물량과 조건에 맞는 합리적인 견적을 안내해 드립니다.`,
  },

  // 04. 폐기물업체 (GENERAL_COMPANY - SHORT)
  'kw-general-short-co': {
    heroBenefit: '차질 없이 현장 수거를 지원합니다',
    heroHook: (r) => `${r} 지역에서 빠르게 방문하여 폐기물을 정리해 줄 업체를 찾고 계신가요?`,
    heroDescription: () =>
      '주소, 희망 일정, 사진을 보내주시면 현장 진입 여건을 확인해 수거 일정을 조율해드립니다.',
    serviceSectionTitle: '방문 수거 지원 분야',
    serviceItems: ['가정 및 원룸 폐기물', '상가 매장 비품', '대형 폐기물 방문 수거', '이사 전후 폐기물'],
    decisionTitle: '폐기물 업체 선정 체크포인트',
    decisionIntro: (r) => `${r} 현장 여건을 고려해 차량 진입과 방문 일정을 수립하는지 확인해보세요.`,
    decisionPoints: () => [
      { title: '방문 일정 조율', desc: '고객님의 희망 일자와 퇴거 시점에 맞춰 현장 방문 일정을 조율합니다.' },
      { title: '현장 진입 여건 점검', desc: '골목길, 상가 입구 등 차량 진입 및 정차 여건에 맞춘 수거 동선을 확보합니다.' },
      { title: '품목별 수거 마감', desc: '다양한 잡화와 가구가 섞인 현장도 정돈하여 마감합니다.' },
    ],
    estimateTitle: '업체 수거 조건 안내',
    estimateDescription: () =>
      '수거할 짐의 양과 현장 진입 여건을 바탕으로 알맞은 차량과 인력을 검토합니다.',
    processTitle: '수거 신청 및 일정 절차',
    faqItems: (r) => createStandardFaqs(r, '폐기물업체'),
    finalCtaTitle: '폐기물 수거 지원이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 현장의 품목 사진을 보내주시면 일정과 처리 방안을 안내해 드립니다.`,
  },

  // 05. 폐기물수거 (GENERAL_COLLECTION)
  'kw-general-collection': {
    heroBenefit: '실내에서 직접 들어내어 수거합니다',
    heroHook: (r) => `${r}에서 직접 밖으로 내놓기 힘든 무거운 폐기물, 실내 방문 수거가 필요하신가요?`,
    heroDescription: () =>
      '집 안에 있는 무거운 짐도 외부로 들어낼 필요 없이 실내에서부터 안전하게 반출 수거해드립니다.',
    serviceSectionTitle: '실내 방문 반출 품목',
    serviceItems: ['직접 들기 힘든 대형가구', '베란다 누적 폐기물', '무거운 가전 및 집기', '실내 포장 폐기물 일체'],
    decisionTitle: '실내 방문 수거 시 주요 체크 항목',
    decisionIntro: (r) => `${r} 실내 수거 작업을 위해 현관 입구와 복도 동선 여건을 사전에 점검합니다.`,
    decisionPoints: () => [
      { title: '실내 직접 반출 대행', desc: '집 밖으로 내놓지 않으셔도 실내에서부터 들어내어 외부로 운반합니다.' },
      { title: '출입문 통과 크기', desc: '가구 완제품이 문을 통과하기 어려울 경우 분해 후 안전하게 반출합니다.' },
      { title: '이동 통로 확보', desc: '승강기 내부 공간 또는 계단 폭을 고려하여 알맞은 운반 방식을 선택합니다.' },
    ],
    estimateTitle: '방문 수거 견적 고려사항',
    estimateDescription: () =>
      '수거 인력이 투입되는 수작업 반출 난이도와 이동 경로를 종합적으로 감안하여 견적이 책정됩니다.',
    processTitle: '방문 수거 진행 절차',
    faqItems: (r) => createStandardFaqs(r, '폐기물수거'),
    finalCtaTitle: '편리한 방문 수거를 신청하세요',
    finalCtaDescription: (r) => `${r}에서 직접 옮기기 벅찬 짐이 있다면 사진을 전송해 견적 상담을 진행해 보세요.`,
  },

  // 06. 폐기물수거업체 (COLLECTION_COMPANY)
  'kw-collection-company': {
    heroBenefit: '전담 수거 인력이 일괄 처리합니다',
    heroHook: (r) => `${r}에서 대량의 짐과 폐기물을 차량에 차곡차곡 수거할 수거 전담 업체를 찾으시나요?`,
    heroDescription: () =>
      '수거할 짐의 양과 위치를 공유해 주시면 맞춤 차량 배차와 수거 작업 인력을 투입하여 깔끔히 정리해드립니다.',
    serviceSectionTitle: '대량 수거 전담 영역',
    serviceItems: ['가정 내 복합 폐기물', '원룸·오피스텔 전체 정리', '상가 대량 집기 수거', '창고 보관 물품'],
    decisionTitle: '수거 대행 업체 의뢰 시 점검사항',
    decisionIntro: (r) => `${r} 현장 작업 시 차량 적재 공간 확보와 효율적인 인력 배치가 중요합니다.`,
    decisionPoints: () => [
      { title: '맞춤 차량 배차 및 적재', desc: '물량 규모에 알맞은 1톤 화물차 등을 준비하여 안전하게 적재 수거합니다.' },
      { title: '현장 정리 정돈', desc: '짐이 빠져나간 자리에 남은 잔여물을 빗자루질로 청소하여 깔끔히 마감합니다.' },
      { title: '공동주택 통행 배려', desc: '복도 및 엘리베이터 이용 시 주민 통행에 방해가 되지 않도록 작업합니다.' },
    ],
    estimateTitle: '대량 수거 전담 견적 기준',
    estimateDescription: () =>
      '전체 폐기물의 적재 부피와 작업 인력 투입 규모에 맞춰 견적을 안내합니다.',
    processTitle: '대량 수거 진행 절차',
    faqItems: (r) => createStandardFaqs(r, '폐기물수거업체'),
    finalCtaTitle: '대량 폐기물 수거 상담',
    finalCtaDescription: (r) => `${r} 현장 전체 사진을 전달해 주시면 알맞은 수거 견적을 안내해 드립니다.`,
  },

  // 07. 대형폐기물수거 (BULKY_WASTE_COLLECTION)
  'kw-bulky-collection': {
    heroBenefit: '무겁고 큰 대형 품목을 반출해드립니다',
    heroHook: (r) => `${r}에서 직접 밖으로 내놓기 어려운 무거운 대형 가구와 집기의 방문 수거가 필요하신가요?`,
    heroDescription: () =>
      '가구 사진과 층수, 엘리베이터 여부를 보내주시면 해체 및 반출 조건을 확인해 수거를 진행해드립니다.',
    serviceSectionTitle: '대형 폐기물 방문 수거 품목',
    serviceItems: ['직접 배출이 곤란한 대형 가구류', '무거운 중량 생활 집기 및 비품', '여러 개의 복합 대형 품목 일괄 배출', '해체·분해 필요 대형 집기'],
    decisionTitle: '대형폐기물 반출 전 현장 확인 기준',
    decisionIntro: (r) => `${r} 현장에서 무거운 대형 물품을 안전하게 반출하기 위해서는 이동 경로와 분해 필요성을 미리 확인해야 합니다.`,
    decisionPoints: () => [
      { title: '품목 크기와 무게', desc: '분해 없이 문이나 복도를 통과할 수 있는지, 현장 분해 작업이 필요한 크기인지 확인합니다.' },
      { title: '실내 반출 동선', desc: '현관문 폭, 복도 여유 공간, 계단 폭 및 엘리베이터 승강기 적재 가능 여부를 점검합니다.' },
      { title: '차량 접근 및 상차 여건', desc: '건물 입구 인근 수거 화물차량의 진입 및 주정차 가능 여부를 사전에 조율합니다.' },
    ],
    estimateTitle: '대형폐기물수거 견적 산정 요소',
    estimateDescription: () =>
      '수거 품목의 수량과 무게, 현장 분해 난이도, 계단 수작업 층수 또는 승강기 이용 여부, 투입 인력 및 차량 적재 부피에 따라 견적이 결정됩니다.',
    processTitle: '대형폐기물 방문 수거 진행 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '대형폐기물수거', {
        question: '문틀보다 큰 대형 가구도 수거 가능한가요?',
        answer:
          '문틀이나 복도가 좁은 경우 현장에서 분해 또는 부분 해체 후 안전하게 반출합니다. 분해 가능 여부를 미리 판단할 수 있도록 가구 전체 사진을 전달해 주시면 좋습니다.',
      }),
    finalCtaTitle: '직접 옮기기 힘든 대형 폐기물 수거 상담',
    finalCtaDescription: (r) => `${r} 현장의 대형 물품 사진과 반출 환경을 알려주시면 작업 가능 여부와 예상 일정을 상담해 드립니다.`,
  },

  // 08. 가정폐기물처리 (HOUSEHOLD)
  'kw-household': {
    heroBenefit: '가정집 살림 비우기를 도와드립니다',
    heroHook: (r) => `${r} 집안 곳곳에 쌓인 생활 쓰레기와 대형 가정 폐기물을 한 번에 비우고 싶으신가요?`,
    heroDescription: () =>
      '정리할 방과 거실의 사진, 대략적인 짐 양을 보내주시면 가정집 배출 조건에 알맞은 수거 범위를 안내해드립니다.',
    serviceSectionTitle: '가정 폐기물 주요 수거 품목',
    serviceItems: ['가구 및 인테리어 소품', '생활 주방용품 및 식기', '베란다·창고 적치물', '옷가지 및 이불류'],
    decisionTitle: '가정집 정리 시 주요 고려사항',
    decisionIntro: (r) => `${r} 가정폐기물처리는 품목이 다양하므로 품목별 특성에 맞춘 반출 계획이 필요합니다.`,
    decisionPoints: () => [
      { title: '다양한 혼합 품목 일괄 배출', desc: '잡화, 가구, 소형 가전이 섞여 있어도 현장에서 차례로 구분하여 수거합니다.' },
      { title: '귀중품 사전 분리', desc: '보관할 서류, 통장, 귀중품은 작업 착수 전 미리 마킹하고 구분하셔야 합니다.' },
      { title: '이웃 소음 및 먼지 배려', desc: '공동주택 특성을 고려하여 소음과 먼지를 예방하는 정돈된 반출을 진행합니다.' },
    ],
    estimateTitle: '가정 폐기물 견적 산정',
    estimateDescription: () =>
      '방 개수, 가구 및 잡화의 총량, 엘리베이터 유무 및 층수에 따라 수거 비용이 산출됩니다.',
    processTitle: '가정집 비움 진행 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '가정폐기물처리', {
        question: '가정 내 잔여 가재도구와 잡화도 일괄 수거되나요?',
        answer:
          '가구, 가전뿐만 아니라 그릇, 침구, 잡화 등 가정 내 남은 짐도 사진으로 확인 후 한 번에 정리 수거를 도와드립니다. 재활용 가능 여부와 폐기 대상을 구분해 안내합니다.',
      }),
    finalCtaTitle: '가정집 묵은 짐 정리 상담',
    finalCtaDescription: (r) => `${r} 집안의 정리할 공간 사진을 보내주시면 편리한 정리 방법을 안내해 드립니다.`,
  },

  // 09. 가구수거 (FURNITURE)
  'kw-furniture': {
    heroBenefit: '대형 가구 분해 및 수거 안내',
    heroHook: (r) => `${r}에서 침대, 소파, 장롱 등 부피 큰 가구의 해체 및 반출이 필요하신가요?`,
    heroDescription: () =>
      '가구 사진과 층수, 엘리베이터 여부를 보내주시면 현장 분해 가능 여부와 통과 경로를 확인해 안내해드립니다.',
    serviceSectionTitle: '수거 가능 주요 대형 가구',
    serviceItems: ['매트리스 및 침대 프레임', '소파 및 리클라이너', '장롱 및 붙박이장', '원목 책상 및 식탁'],
    decisionTitle: '대형 가구 수거 시 필수 확인 포인트',
    decisionIntro: (r) => `${r} 가구수거 작업 시에는 가구 크기와 출입문, 복도 등 이동 경로 간의 간섭 여부를 먼저 확인합니다.`,
    decisionPoints: () => [
      { title: '현장 분해 및 해체', desc: '부피가 큰 장롱이나 침대 프레임은 방 안에서 공구로 해체한 후 안전히 반출합니다.' },
      { title: '방문·현관문 폭 측정', desc: '방문, 현관문 폭이 가구 두께보다 좁을 경우 파손 방지 분해 조치를 취합니다.' },
      { title: '승강기 적재 공간 확인', desc: '엘리베이터 깊이와 높이를 확인하여 계단 반출 여부를 판단합니다.' },
    ],
    estimateTitle: '가구 수거 비용 구성',
    estimateDescription: () =>
      '가구 품목의 규격, 해체 분해 필요 여부, 계단 운반 층수를 고려하여 견적이 결정됩니다.',
    processTitle: '안전한 가구 수거 4단계',
    faqItems: (r) =>
      createStandardFaqs(r, '가구수거', {
        question: '붙박이장이나 조립형 침대도 해체 후 수거되나요?',
        answer:
          '네, 고정형 붙박이장이나 복잡한 프레임 침대도 분해하여 실외로 반출합니다. 구조 파악을 위해 가구 전체 모습과 고정 부위 사진을 함께 보내주시면 수월합니다.',
      }),
    finalCtaTitle: '대형 가구 수거 신청',
    finalCtaDescription: (r) => `${r} 수거할 가구 전체 모습이 담긴 사진을 보내주시면 작업 일정을 확인해 드립니다.`,
  },

  // 10. 이사폐기물처리 (MOVING)
  'kw-moving': {
    heroBenefit: '이사 전후 잔여 짐을 비워드립니다',
    heroHook: (r) => `${r} 이사 전후 퇴거 일정에 맞춰 남은 대형 가구와 생활 폐기물을 정리해야 하나요?`,
    heroDescription: () =>
      '이사 전후 남은 물품의 사진과 희망 일정을 보내주시면 이삿짐 반출 시점과 맞춰 수거해드립니다.',
    serviceSectionTitle: '이사 전후 다발 품목',
    serviceItems: ['교체 대상 낡은 가구', '이사 잔여 생활용품', '베란다 화분 및 잡화', '빌트인 외 남은 가전'],
    decisionTitle: '이사 폐기물 처리 핵심 체크리스트',
    decisionIntro: (r) => `${r} 이사폐기물처리는 시간 약속 준수와 퇴거 마감 시점 관리가 가장 중요합니다.`,
    decisionPoints: () => [
      { title: '퇴거 시점 및 일정 연계', desc: '이삿짐 반출 완료 시점과 폐기물 수거 착수 시간을 빈틈없이 맞춥니다.' },
      { title: '승강기 이용 예약 확인', desc: '아파트나 오피스텔의 승강기 이용 예약 시간을 사전에 확인하여 혼선을 방지합니다.' },
      { title: '남길 짐과의 명확한 구분', desc: '가져갈 이삿짐과 버릴 짐이 섞이지 않도록 사전 확인 조치를 취합니다.' },
    ],
    estimateTitle: '이사 폐기물 견적 기준',
    estimateDescription: () =>
      '이사 후 잔여 물량의 총 부피, 승강기 또는 계단 이용 조건에 맞춰 산정합니다.',
    processTitle: '이사 폐기물 처리 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '이사폐기물처리', {
        question: '이사 당일 이삿짐 퇴거 시간에 맞춰 수거 일정을 조율할 수 있나요?',
        answer:
          '이사 짐 반출 완료 시점에 맞춰 폐기물 수거 차량과 인력이 투입되도록 일정을 사전 조율합니다. 희망 수거 시간을 미리 알려주시면 좋습니다.',
      }),
    finalCtaTitle: '이사 일정에 맞춘 폐기물 수거',
    finalCtaDescription: (r) => `${r} 이사 예정일과 남길 짐 사진을 공유해 주시면 작업 일정을 협의해 드립니다.`,
  },

  // 11. 사무실폐기물처리 (OFFICE)
  'kw-office': {
    heroBenefit: '사무실 집기 및 파티션을 정리합니다',
    heroHook: (r) => `${r} 사무실 이전이나 원상복구를 앞두고 남은 책상, 의자, 파티션 정리가 필요하신가요?`,
    heroDescription: () =>
      '오피스 집기 사진과 빌딩 반출 규정을 전달해 주시면 파티션 해체와 화물 승강기 반출 플랜을 안내해드립니다.',
    serviceSectionTitle: '사무실 주요 수거 품목',
    serviceItems: ['사무용 책상 및 서랍장', '회의용 탁자 및 의자', '파티션(칸막이) 해체물', '캐비닛 및 서류 책장'],
    decisionTitle: '오피스 빌딩 사무실 정리 점검사항',
    decisionIntro: (r) => `${r} 오피스 빌딩에서 사무실폐기물처리를 진행할 때는 화물 승강기 이용 규정과 반출 동선 확보가 핵심입니다.`,
    decisionPoints: () => [
      { title: '화물 엘리베이터 및 빌딩 규정', desc: '승강기 이용 가능 시간과 빌딩 출입 승인 절차를 미리 확인합니다.' },
      { title: '파티션 및 사무 집기 해체', desc: '복도 반출을 위해 현장에서 책상과 파티션 볼트 해체를 진행합니다.' },
      { title: 'B2B 집기 일괄 정리', desc: '사무용 가구, 철제 캐비닛 등 다양한 B2B 비품을 규정에 맞춰 배출합니다.' },
    ],
    estimateTitle: '사무실 정리 견적 산정 요소',
    estimateDescription: () =>
      '책상 세트 수량, 파티션 분해 작업량, 화물 승강기 운행 여건에 따라 결정됩니다.',
    processTitle: '체계적인 사무실 비움 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '사무실폐기물처리', {
        question: '사무용 책상, 파티션, 대형 회의 테이블도 수거되나요?',
        answer:
          '대형 책상, 의자, 파티션, 서류 캐비닛 등 오피스 집기 일체를 분해하여 화물 승강기를 통해 반출합니다. 빌딩 관리실 승강기 예약 조건과 작업 가능 시간대를 함께 알려주시면 됩니다.',
      }),
    finalCtaTitle: '사무실 집기 정리 상담',
    finalCtaDescription: (r) => `${r} 사무실 내부 전경과 품목 사진을 보내주시면 견적을 안내해 드립니다.`,
  },

  // 12. 상가폐기물처리 (COMMERCIAL)
  'kw-commercial': {
    heroBenefit: '매장 집기 및 진열대를 비워드립니다',
    heroHook: (r) => `${r} 매장 리모델링이나 상가 정리로 인한 진열대, 쇼케이스, 대형 집기 처리가 필요하신가요?`,
    heroDescription: () =>
      '매장 내부 집기 사진과 희망 작업 시간대를 보내주시면 상가 입구 주차 여건과 안전한 반출 플랜을 상의해드립니다.',
    serviceSectionTitle: '상가 주요 수거 품목',
    serviceItems: ['매장 진열대 및 쇼케이스', '상업용 테이블 및 의자', '카운터 및 선반장', '주방 보조 집기'],
    decisionTitle: '상가 폐기물 배출 시 확인사항',
    decisionIntro: (r) => `${r} 상가 매장 및 수거 현장에서 상가폐기물처리를 진행할 때는 고객 통행 방해를 줄이는 반출 계획이 필요합니다.`,
    decisionPoints: () => [
      { title: '매장 진입로 및 주정차 여건', desc: '트럭이 매장 입구 가까이 정차할 수 있는지 주변 주차 여건을 확인합니다.' },
      { title: '쇼케이스 및 집기 반출 예방', desc: '유리가 포함된 진열장은 조심스럽게 파손 예방 조치 후 들어냅니다.' },
      { title: '영업 외 시간 작업 조율', desc: '주변 상가 영업에 지장을 주지 않도록 야간/휴무일 등 작업 시간대를 조율합니다.' },
    ],
    estimateTitle: '상가 집기 수거 견적 안내',
    estimateDescription: () =>
      '매장 집기 종류와 무게, 분해 난이도 및 상차 환경을 검토하여 견적을 제시합니다.',
    processTitle: '상가 집기 수거 4단계',
    faqItems: (r) =>
      createStandardFaqs(r, '상가폐기물처리', {
        question: '매장 내 진열대나 집기류도 수거 대상인가요?',
        answer:
          '진열대, 쇼케이스, 매장 비품, 테이블 및 집기류 전반을 확인 후 수거합니다. 집기 부피와 반출 난이도를 확인할 수 있도록 매장 내부 전경 사진을 보내주시면 됩니다.',
      }),
    finalCtaTitle: '상가 매장 집기 수거 상담',
    finalCtaDescription: (r) => `${r} 매장 내부 집기 사진을 보내주시면 반출 플랜을 상의해 드립니다.`,
  },

  // 13. 폐업폐기물처리 (CLOSURE)
  'kw-closure': {
    heroBenefit: '폐업 매장 실내를 깔끔히 비워드립니다',
    heroHook: (r) => `${r} 영업 종료 및 폐업으로 인한 임대차 계약 만료 전 매장 내부 짐을 모두 비워야 하나요?`,
    heroDescription: () =>
      '매장 내부 전경 사진과 반출 마감 일자를 보내주시면 집기 일괄 배출과 원상복구 연계 준비를 도와드립니다.',
    serviceSectionTitle: '폐업 정리 수거 대상',
    serviceItems: ['영업용 집기 및 비품 전체', '남은 포장재 및 소모품', '카운터·간이 칸막이', '불용 재고 및 집기'],
    decisionTitle: '원상복구 전 공간 비움 포인트',
    decisionIntro: (r) => `${r} 폐업폐기물처리는 인도 일정에 맞춰 실내 짐을 일정에 맞춰 비우는 것이 중요합니다.`,
    decisionPoints: () => [
      { title: '실내 짐 완전 비움', desc: '임대인 인도 기준에 맞춰 남겨진 집기와 물품이 없도록 꼼꼼히 수거합니다.' },
      { title: '원상복구 철거 연계 구분', desc: '단순 집기 반출과 인테리어 철거 구분을 사전 협의하여 비용을 절감합니다.' },
      { title: '임대차 계약 만료일 준수', desc: '반납 기한에 차질이 없도록 확정된 지정 날짜에 집중 작업을 진행합니다.' },
    ],
    estimateTitle: '폐업 정리 견적 안내',
    estimateDescription: () =>
      '매장 전체 물량 규모와 반출 횟수, 잔재물 종류에 따라 합리적인 견적을 제안합니다.',
    processTitle: '폐업 정리 원스톱 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '폐업폐기물처리', {
        question: '폐업 매장의 집기 정리와 잔여 폐기물 처리를 한 번에 할 수 있나요?',
        answer:
          '사업장 폐업 시 발생하는 집기 처분과 잔여 폐기물 일체를 일괄 정리해 드립니다. 원상복구 대상 품목과 단순 반출 품목을 구분해 안내해 드립니다.',
      }),
    finalCtaTitle: '폐업 정리 비움 상담',
    finalCtaDescription: (r) => `${r} 현장 사진을 보내주시면 일정과 견적으로 정리를 도와드립니다.`,
  },

  // 14. 사업장폐기물 (BUSINESS_FACILITY)
  'kw-business': {
    heroBenefit: '창고 및 사업장 불용자재 정리',
    heroHook: (r) => `${r} 사업장이나 물류 창고에 적치된 불용 자재, 파렛트, 대량 잔재물 처리가 필요하신가요?`,
    heroDescription: () =>
      '불용품 적치 사진과 하차장 접근 여건을 공유해 주시면 수거 가능 성상과 차량 상차 방안을 안내해드립니다.',
    serviceSectionTitle: '사업장 수거 가능 품목',
    serviceItems: ['창고 불용 자재 및 파렛트', '포장 박스 및 폐목재류', '사무실·창고 교체 비품', '대량 포장 잔재물'],
    decisionTitle: '사업장 폐기물 수거 시 주의점',
    decisionIntro: (r) => `${r} 사업장폐기물은 품목의 종류와 성상에 따라 수거 가능 여부와 차량 진입 여건을 사전 검토해야 합니다.`,
    decisionPoints: () => [
      { title: '수거 품목 성상 및 분류', desc: '일반 사업장 불용품 수거 범위인지 사진과 품목 목록으로 사전 검토합니다.' },
      { title: '도크 및 화물차 접근성', desc: '작업장 하차장, 도크, 1톤/2.5톤 차량 진입로 통과 높이를 확인합니다.' },
      { title: '사업장 조업 동선 배려', desc: '공장이나 창고의 입출고 작업에 방해가 되지 않도록 반출 시간을 조율합니다.' },
    ],
    estimateTitle: '사업장 폐기물 상담 안내',
    estimateDescription: () =>
      '품목 종류, 부피, 현장 상차 여건(지게차 유무, 수작업 여부)을 종합하여 견적을 안내합니다.',
    processTitle: '사업장 폐기물 처리 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '사업장폐기물', {
        question: '창고나 작업장에 쌓인 사업장 잔재물도 수거 가능한가요?',
        answer:
          '창고 적재물, 파렛트, 포장재, 사업장 비품 등을 사진과 수량으로 확인 후 수거를 진행합니다. 품목별 성상과 상차 차량 진입 여건을 함께 검토합니다.',
      }),
    finalCtaTitle: '사업장 불용품 수거 상담',
    finalCtaDescription: (r) => `${r} 사업장 내 폐기물 적치 사진을 전송해 주시면 수거 가능 여부와 절차를 안내드립니다.`,
  },

  // 15. 건설폐기물 (CONSTRUCTION)
  'kw-construction': {
    heroBenefit: '인테리어 공사 잔재물 수거 안내',
    heroHook: (r) => `${r} 인테리어 리모델링 공사 후 남은 마대 잔재물과 폐목재 수거 상담을 원하시나요?`,
    heroDescription: () =>
      '마대 개수와 현장 마감재 사진을 보내주시면 엘리베이터 보양 및 마대 상차 수거 플랜을 안내해드립니다.',
    serviceSectionTitle: '인테리어 잔재물 상담 품목',
    serviceItems: ['마대 포장 건축 잔재물', '철거 후 남은 폐목재류', '석고보드 및 단열재 잔재', '철거 잡자재 및 몰딩류'],
    decisionTitle: '건축 잔재물 배출 시 확인사항',
    decisionIntro: (r) => `${r} 건설폐기물 및 인테리어 잔재물은 흩날림 방지와 안전한 포장 상태가 선행되어야 합니다.`,
    decisionPoints: () => [
      { title: '마대 포장 상태 점검', desc: '자잘한 콘크리트/석고 잔재는 튼튼한 마대에 나눠 담겨야 안전한 반출이 가능합니다.' },
      { title: '공동주택 승강기 보양', desc: '아파트나 빌라 승강기 이용 시 바닥과 벽면 파손 예방 보양 상태를 확인합니다.' },
      { title: '중량 마대 상차 위치', desc: '무거운 마대를 화물차에 옮겨 싣기 위한 지상 정차 위치를 미리 확보합니다.' },
    ],
    estimateTitle: '건축 잔재물 견적 안내',
    estimateDescription: () =>
      '마대 개수, 폐목재 부피, 수작업 층수 및 사다리차 이용 여부에 따라 견적을 산출합니다.',
    processTitle: '현장 잔재물 반출 절차',
    faqItems: (r) =>
      createStandardFaqs(r, '건설폐기물', {
        question: '인테리어 공사 후 마대에 담긴 혼합 잔재물도 수거되나요?',
        answer:
          '마대에 정돈된 건축 폐자재, 폐목재, 석고 잔재물 등의 수량을 확인 후 트럭 상차를 진행합니다. 마대 개수와 현장 상차 위치를 사진으로 알려주시면 확인 후 안내합니다.',
      }),
    finalCtaTitle: '인테리어 현장 폐기물 상담',
    finalCtaDescription: (r) => `${r} 현장의 마대 수량과 폐자재 사진을 보내주시면 작업 가능 여부를 상담해 드립니다.`,
  },
};

export const PRODUCTION_ACTIVE_DIFFERENTIATION_REGION_IDS = new Set(
  PRODUCTION_REGIONS.map((r) => r.regionId)
);

export interface GeneralizedRegionContext {
  regionId: string;
  seoDisplayName: string;
  officialName: string;
  regionType: RegionEntity['regionType'];
  upperRegionId: string;
  parentRegion?: RegionEntity;
  parentName?: string;
  parentType?: RegionEntity['regionType'];
  representativeChildren: string[];
  representativeSiblings: string[];
  semanticVariant:
    | 'SI_WITH_GU'
    | 'SI_WITH_DONG'
    | 'GU_WITH_DONG'
    | 'DONG_WITH_GU_PARENT'
    | 'DONG_WITH_SI_PARENT'
    | 'DONG_STANDALONE';
}

export function buildRegionContext(region: RegionEntity): GeneralizedRegionContext {
  const parent = region.parentRegionId ? findRegionById(region.parentRegionId) : undefined;

  const children = PRODUCTION_REGIONS.filter(
    (r) =>
      r.parentRegionId === region.regionId ||
      (region.regionType === 'SI' && r.upperRegionId === region.regionId && r.regionType === 'GU')
  );

  const siblings = region.parentRegionId
    ? PRODUCTION_REGIONS.filter((r) => r.parentRegionId === region.parentRegionId && r.regionId !== region.regionId)
    : [];

  const representativeChildren = children.slice(0, 3).map((c) => c.officialName);
  const representativeSiblings = siblings.slice(0, 3).map((s) => s.officialName);

  let semanticVariant: GeneralizedRegionContext['semanticVariant'] = 'DONG_STANDALONE';

  if (region.regionType === 'SI') {
    semanticVariant = children.some((c) => c.regionType === 'GU') ? 'SI_WITH_GU' : 'SI_WITH_DONG';
  } else if (region.regionType === 'GU') {
    semanticVariant = 'GU_WITH_DONG';
  } else if (parent) {
    semanticVariant = parent.regionType === 'GU' ? 'DONG_WITH_GU_PARENT' : 'DONG_WITH_SI_PARENT';
  }

  return {
    regionId: region.regionId,
    seoDisplayName: region.seoDisplayName,
    officialName: region.officialName,
    regionType: region.regionType,
    upperRegionId: region.upperRegionId,
    parentRegion: parent,
    parentName: parent ? parent.officialName : undefined,
    parentType: parent ? (parent.regionType as 'SI' | 'GU') : undefined,
    representativeChildren,
    representativeSiblings,
    semanticVariant,
  };
}

/**
 * STEP N-3B Generalized Region Content Differentiation Engine
 * - Active ONLY for Pilot Regions in Production (Production Active Count = 3)
 * - 100% Deterministic (No Math.random(), No runtime variation)
 * - Zero Fake Local Facts (Only verified dataset facts)
 * - Preserves Keyword Intent & Claims Safety
 */
export function applyGeneralizedRegionDifferentiation(
  context: PageContext,
  baseOutput: ContentOutput
): ContentOutput {
  const { region, seoDisplayName, workKeyword } = context;
  if (!region) return baseOutput;

  const rCtx = buildRegionContext(region);
  let decisionIntro = baseOutput.decisionIntro;
  let estimateDescription = baseOutput.estimateDescription;
  let finalCtaDescription = baseOutput.finalCtaDescription;
  let faqItems = [...baseOutput.faqItems];

  const parentStr = rCtx.parentName || '관할';
  const childStr = rCtx.representativeChildren.length > 0 ? rCtx.representativeChildren.join(', ') + ' 등' : '주요 지역';

  switch (rCtx.semanticVariant) {
    case 'SI_WITH_GU':
      decisionIntro = `${baseOutput.decisionIntro} (${seoDisplayName} 내 ${childStr} 등 관할 구역 수거 동선 사전 점검)`;
      estimateDescription = `${baseOutput.estimateDescription} (${seoDisplayName} 관할 구·동별 주거 및 사업장 여건 반영)`;
      finalCtaDescription = `${seoDisplayName} 현장의 수거 품목 사진을 전달해 주시면 ${seoDisplayName} 전체 관할 방문 가능 일정을 확인해 드립니다.`;
      if (faqItems.length > 0) {
        faqItems[0] = {
          question: `${seoDisplayName} 현장에서 ${workKeyword.displayName} 상담 시 사전에 준비할 정보는 무엇인가요?`,
          answer: `${seoDisplayName} 수거 현장 전체 사진과 대략적인 물량, 엘리베이터 유무 및 층수 조건을 공유해 주시면 시 관할 작업 일정을 확인해 안내해 드립니다.`,
        };
      }
      break;

    case 'SI_WITH_DONG':
      decisionIntro = `${baseOutput.decisionIntro} (${seoDisplayName} 관할 내 ${childStr} 주요 동 현장 상차 여건 점검)`;
      estimateDescription = `${baseOutput.estimateDescription} (${seoDisplayName} 현장 정차 여건 및 수작업 이동 공수 안내)`;
      finalCtaDescription = `${seoDisplayName} 현장 사진과 품목 목록을 전송해 주시면 시 연계 방문 가능 일정을 조율해 드립니다.`;
      if (faqItems.length > 0) {
        faqItems[0] = {
          question: `${seoDisplayName} 관할 현장에서 ${workKeyword.displayName} 상담 시 필요 정보는 무엇인가요?`,
          answer: `${seoDisplayName} 수거 현장의 사진과 짐의 양, 승강기 이용 조건 정보를 공유해 주시면 시 연계 작업 일정을 상의해 드립니다.`,
        };
      }
      break;

    case 'GU_WITH_DONG':
      decisionIntro = `${baseOutput.decisionIntro} (${seoDisplayName} 전체 서비스 지역 ${childStr} 등 각 동별 반출 경로 사전 확인)`;
      estimateDescription = `${baseOutput.estimateDescription} (${seoDisplayName} 각 동별 현장 조건 및 승강기 이용 여건 안내)`;
      finalCtaDescription = `${seoDisplayName} 주요 동별 수거 현장의 사진과 품목 정보를 전달해 주시면 관할 방문 일정을 확인해 드립니다.`;
      if (faqItems.length > 0) {
        faqItems[0] = {
          question: `${seoDisplayName} 내 주요 동별 ${workKeyword.displayName} 견적 상담 시 필요 정보는 무엇인가요?`,
          answer: `${seoDisplayName} 수거 현장 사진과 대략적인 물량, 엘리베이터 유무 및 층수 조건을 공유해 주시면 자치구 내 작업 일정을 반영해 안내해 드립니다.`,
        };
      }
      break;

    case 'DONG_WITH_GU_PARENT':
    case 'DONG_WITH_SI_PARENT':
    case 'DONG_STANDALONE': {
      // Deterministic DONG Angle Focus Selection (0, 1, 2) based on regionId char sum
      const charSum = rCtx.regionId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const angle = charSum % 3;

      if (angle === 0) {
        // Focus Angle 0: Site Verification & Parent Relationship
        decisionIntro = `${baseOutput.decisionIntro} (${seoDisplayName} 현장 실내 반출 동선 및 ${parentStr} 관할 연계 이동 경로 점검)`;
        estimateDescription = `${baseOutput.estimateDescription} (${seoDisplayName} 현장 짐 부피·무게 및 ${parentStr} 관할 반출 여건 반영)`;
        finalCtaDescription = `${seoDisplayName} 현장의 작업 공간 사진과 품목 목록을 공유해 주시면 ${parentStr} 관할 수거 인력 방문 일정을 상의해 드립니다.`;
        if (faqItems.length > 0) {
          faqItems[0] = {
            question: `${seoDisplayName} 현장에서 ${workKeyword.displayName} 상담 시 어떤 정보를 미리 준비해야 하나요?`,
            answer: `${seoDisplayName} 수거 현장의 전체 사진과 짐의 양, 승강기 이용 가능 여부를 공유해 주시면 ${parentStr} 관할 작업 일정을 확인해 안내해 드립니다.`,
          };
        }
      } else if (angle === 1) {
        // Focus Angle 1: Site Access & Transit Path
        decisionIntro = `${baseOutput.decisionIntro} (${seoDisplayName} 건물 입구 차량 정차 위치 및 ${parentStr} 연계 배출 동선 점검)`;
        estimateDescription = `${baseOutput.estimateDescription} (${seoDisplayName} 현장 진입 여건 및 ${parentStr} 연계 수작업 공수 평가)`;
        finalCtaDescription = `${seoDisplayName} 현장의 진입로 및 수거 품목 사진을 전송해 주시면 ${parentStr} 지역 방문 가능 일정을 확인해 드립니다.`;
        if (faqItems.length > 0) {
          faqItems[0] = {
            question: `${seoDisplayName} 현장의 차량 진입 여건이나 ${workKeyword.displayName} 상담 시 필요 정보는 무엇인가요?`,
            answer: `${seoDisplayName} 현장 입구 차량 정차 가능 여부와 반출 품목 사진을 공유해 주시면 현장 조건에 맞춘 방문 수거 절차를 상담해 드립니다.`,
          };
        }
      } else {
        // Focus Angle 2: Neighboring Exploration & Batch Loading
        const siblingStr = rCtx.representativeSiblings.length > 0 ? rCtx.representativeSiblings.join(', ') + ' 등 인접 지역과 함께' : '주변 현장과 함께';
        decisionIntro = `${baseOutput.decisionIntro} (${seoDisplayName} 현장 및 ${parentStr} 내 ${siblingStr} 수거 동선 종합 점검)`;
        estimateDescription = `${baseOutput.estimateDescription} (${seoDisplayName} 현장 층수 조건 및 대형 품목 분해 반출 기준 적용)`;
        finalCtaDescription = `${seoDisplayName} 수거 공간 사진과 현장 위치를 공유해 주시면 ${parentStr} 지역 수거 인력 방문 절차를 조율해 드립니다.`;
        if (faqItems.length > 0) {
          faqItems[0] = {
            question: `${seoDisplayName} 현장에서 여러 품목을 일괄 수거할 때 사전에 확인해야 할 사항은 무엇인가요?`,
            answer: `${seoDisplayName} 현장 전체 사진과 반출 층수, 엘리베이터 이용 여부를 공유해 주시면 수거 인력 방문 절차를 상의해 드립니다.`,
          };
        }
      }
      break;
    }
  }

  return {
    ...baseOutput,
    decisionIntro,
    estimateDescription,
    finalCtaDescription,
    faqItems,
  };
}

/**
 * 결정론적 Dynamic Content Engine
 * - context.serviceFamily 우선 라우팅 (WASTE vs DEMOLITION)
 */
export function generateDynamicContent(
  context: PageContext,
  enableAllRegionsForDryRun = false
): ContentOutput {
  if (context.serviceFamily === 'DEMOLITION') {
    return generateDemolitionContent(context);
  }

  const { seoDisplayName, workKeyword, region } = context;
  const template = TEMPLATE_BY_KEYWORD_ID[workKeyword.keywordId] || TEMPLATE_BY_KEYWORD_ID['kw-general-disposal'];

  // H1: 정확히 1개, {seoDisplayName} {workKeyword.displayName}
  const h1 = `${seoDisplayName} ${workKeyword.displayName}`;
  const heroBenefit = template.heroBenefit;
  const heroHook = template.heroHook(seoDisplayName);
  const heroDescription = template.heroDescription(seoDisplayName);

  const baseOutput: ContentOutput = {
    h1,
    heroBenefit,
    heroHook,
    heroDescription,
    serviceSectionTitle: template.serviceSectionTitle,
    serviceItems: template.serviceItems,
    decisionTitle: template.decisionTitle,
    decisionIntro: template.decisionIntro(seoDisplayName),
    decisionPoints: template.decisionPoints(seoDisplayName),
    estimateTitle: template.estimateTitle,
    estimateDescription: template.estimateDescription(seoDisplayName),
    processTitle: template.processTitle,
    faqItems: template.faqItems(seoDisplayName),
    finalCtaTitle: template.finalCtaTitle,
    finalCtaDescription: template.finalCtaDescription(seoDisplayName),
  };

  // Production Activation Guard: Production active differentiation count is 3 (Pilot Regions only)
  // Dry-run simulation mode can set enableAllRegionsForDryRun = true
  const isDifferentiationActive =
    enableAllRegionsForDryRun ||
    (region && PRODUCTION_ACTIVE_DIFFERENTIATION_REGION_IDS.has(region.regionId));

  if (isDifferentiationActive) {
    return applyGeneralizedRegionDifferentiation(context, baseOutput);
  }

  return baseOutput;
}

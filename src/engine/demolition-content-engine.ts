import { PageContext, ContentOutput, DecisionPoint, FaqItem } from '@/types/content';

interface DemolitionKeywordContentTemplate {
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
 * 철거 (DEMOLITION) 9개 P0 키워드별 Search Intent 차별화 템플릿 매핑
 * - 런타임 랜덤/인공지능 일체 배제 (100% 결정론적 매핑)
 * - 허위 지역 특성 날조 금지 (지역명은 위치 컨텍스트로만 결합)
 * - 과장·미검증 표현(전문 면허, 정식 허가, 1급, 100% 안전, 최저가 등) 엄격 배제
 * - 모든 현장 조건은 조건부 사실("건물 관리규정이 있는 경우", "승강기를 사용하는 현장이라면" 등)로 서술
 */
const DEMOLITION_TEMPLATES_BY_KEYWORD_ID: Record<string, DemolitionKeywordContentTemplate> = {
  // 01. 철거 (GENERAL_DEMOLITION)
  'kw-demo-general': {
    heroBenefit: '필요한 범위부터 확인해드립니다',
    heroHook: (r) => `${r}에서 실내 시설물과 마감재 철거를 계획 중이신가요?`,
    heroDescription: () =>
      '철거할 공간의 사진과 작업 범위를 보내주시면 현장 구조를 확인해 필요한 철거 범위를 안내해드립니다.',
    serviceSectionTitle: '주요 철거 작업 범위',
    serviceItems: ['실내 가벽 철거', '천장 마감재 철거', '바닥재 철거', '상업 시설물 철거'],
    decisionTitle: '철거 작업 전 사전 확인 사항',
    decisionIntro: (r) =>
      `${r} 현장 철거를 진행하기 전에는 철거할 부분과 보존할 구역, 건물 여건을 미리 파악하는 것이 중요합니다.`,
    decisionPoints: () => [
      { title: '철거 대상 부위 구분', desc: '제거해야 할 가벽, 천장, 바닥재 및 고정 시설물의 범위를 사전에 명확히 나눕니다.' },
      { title: '보존 시설 보호 계획', desc: '계속 사용할 배관, 전선, 유리창, 도어 프레임 등 보존 대상의 훼손 방지 방안을 검토합니다.' },
      { title: '건물 관리 및 반출 여건', desc: '건물 관리규정이 있는 현장의 경우 작업 가능 시간, 승강기 보양 여부, 차량 진입 동선을 조율합니다.' },
    ],
    estimateTitle: '철거 견적 안내 기준',
    estimateDescription: () =>
      '철거 면적, 마감재 성상, 폐기물 발생량, 작업 층수 및 장비 접근 여건 등을 종합적으로 검토하여 합리적인 상담을 도와드립니다.',
    processTitle: '체계적인 4단계 철거 절차',
    faqItems: (r) => [
      {
        question: `${r}에서 소규모 실내 철거도 상담이 가능한가요?`,
        answer: '네, 소규모 단일 시설물부터 상가·사무실 전체 철거까지 현장 사진을 토대로 작업 가능 여부를 상담해 드립니다.',
      },
      {
        question: '철거 전 현장에서 미리 준비해야 할 사항이 있나요?',
        answer: '이동 가능한 집기는 미리 반출해 주시고, 전기 및 수도 차단 위치를 파악해 두시면 원활한 점검에 도움이 됩니다.',
      },
      {
        question: '철거 과정에서 발생하는 폐기물도 함께 정리되나요?',
        answer: '철거 공정과 함께 현장에서 해체된 잔재물의 반출 처리 계획을 사전에 협의하여 진행합니다.',
      },
      {
        question: '비용은 어떤 방식으로 확인해 볼 수 있나요?',
        answer: '철거할 공간의 전경과 대상 부위 사진을 전달해 주시면 작업 여건을 확인하여 대략적인 기준을 안내해 드립니다.',
      },
    ],
    finalCtaTitle: '안전한 실내 철거 상담이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 현장 공간 사진과 철거 범위를 알려주시면 필요한 작업 조건과 일정을 안내해 드립니다.`,
  },

  // 02. 철거업체 (COMPANY_SELECTION)
  'kw-demo-company': {
    heroBenefit: '현장 조건에 맞춰 시공해드립니다',
    heroHook: (r) => `${r} 현장 조건에 맞춰 꼼꼼하게 시공해 줄 철거 업체를 찾고 계신가요?`,
    heroDescription: () =>
      '현장 사진과 대략적인 면적, 작업 범위를 알려주시면 현장 여건을 확인해 시공 계획을 상담해드립니다.',
    serviceSectionTitle: '지원 가능 시공 부문',
    serviceItems: ['상가 매장 철거', '사무실 집기·가벽 철거', '인테리어 선행 철거', '원상복구 철거'],
    decisionTitle: '철거 업체 선정 시 핵심 확인 사항',
    decisionIntro: (r) =>
      `${r} 지역에서 철거 업체를 알아볼 때는 단순 가격 외에도 공사 범위 명시와 현장 대응 여건을 꼼꼼히 확인해야 합니다.`,
    decisionPoints: () => [
      { title: '견적 포함 범위 확인', desc: '철거 공정뿐 아니라 바닥 면정리, 폐기물 상차, 반출 운반비 포함 여부를 명확히 확인합니다.' },
      { title: '건물 규정 준수 여건', desc: '관리사무소 사전 신고, 승강기 보양, 소음 제한 시간 등 현장 제약 조건의 협의 가능 여부를 살핍니다.' },
      { title: '상세 일정 조율', desc: '퇴거 일정이나 후속 인테리어 착공 일정에 차질이 없도록 철거 완료 일자를 면밀히 맞춥니다.' },
    ],
    estimateTitle: '철거 업체 견적 검토 요소',
    estimateDescription: () =>
      '철거 현장의 작업 면적, 철거 난이도, 마감재 성상, 반출 동선 등에 따라 소요 인력과 적재 차량 편성이 달라집니다.',
    processTitle: '안심 진행 절차 안내',
    faqItems: (r) => [
      {
        question: `${r} 일대 현장 방문 실측 상담도 가능한가요?`,
        answer: '사진 상담 후 현장 구조가 복잡하거나 정확한 물량 파악이 필요한 경우 일정 조율을 통해 방문 실측을 도와드립니다.',
      },
      {
        question: '이웃 세대 및 주변 상가 소음 민원은 어떻게 대처하나요?',
        answer: '공사 가능 시간이 정해진 현장이라면 소음 유발 작업을 집중 시간대에 진행하고 사전 양해 안내를 권장합니다.',
      },
      {
        question: '업체 상담 시 어떤 자료를 준비하면 빠른가요?',
        answer: '철거 공간 전체 전경 사진, 관리실 특이사항, 대략적인 실평수를 알려주시면 더욱 신속한 확인이 가능합니다.',
      },
      {
        question: '추가 비용이 발생하지 않으려면 무엇을 점검해야 하나요?',
        answer: '바닥 덧방 타일 유무, 천장 속 추가 배관 등 눈에 보이지 않는 구조적 추가 공정 요소를 사전 상담 시 함께 점검합니다.',
      },
    ],
    finalCtaTitle: '신뢰할 수 있는 철거 상담을 원하시나요?',
    finalCtaDescription: (r) => `${r} 철거 작업 대상 사진을 남겨주시면 현장 특성에 맞는 투명한 작업 방안을 상담해 드립니다.`,
  },

  // 03. 철거비용 (PRICE_ESTIMATE)
  'kw-demo-price': {
    heroBenefit: '현장 조건에 맞춰 안내해드립니다',
    heroHook: (r) => `${r} 실내 철거 비용이 어떤 기준에 따라 달라지는지 궁금하신가요?`,
    heroDescription: () =>
      '철거할 공간 사진과 대략적인 면적을 보내주시면 마감재와 반출 여건을 확인해 비용 기준을 안내해드립니다.',
    serviceSectionTitle: '견적 산정 검토 항목',
    serviceItems: ['가벽 분해 철거비', '천장 텍스 철거비', '바닥재 철거비', '폐기물 상차·운반비'],
    decisionTitle: '철거 비용을 좌우하는 3대 핵심 변수',
    decisionIntro: (r) =>
      `${r} 현장의 철거 견적은 단순 평수뿐 아니라 폐기물 성상과 작업 동선 난이도에 직접적으로 영향을 받습니다.`,
    decisionPoints: () => [
      { title: '마감재 종류와 두께', desc: '석고보드, 합판, 콘크리트 옹벽, 압착 타일 등 해체 도구와 작업 시간에 따른 차이를 반영합니다.' },
      { title: '폐기물 반출량', desc: '철거 후 발생하는 목재, 왈가닥, 혼합 폐기물의 실제 적재 톤수와 반출 차량 수가 핵심 요소입니다.' },
      { title: '승강기 및 사다리차 여건', desc: '승강기를 사용하는 현장인지, 계단 수작업 운반인지, 사다리차 접근이 가능한지에 따라 노무비가 달라집니다.' },
    ],
    estimateTitle: '철거 비용 산정 기준 안내',
    estimateDescription: () =>
      '정형화된 평당 단가 대신 현장의 실측 여건, 자재 성상, 장비 진입로, 폐기물 수량을 종합 반영하여 안내합니다.',
    processTitle: '투명한 비용 확인 4단계',
    faqItems: (r) => [
      {
        question: `${r}에서 평당 철거 비용은 대략 얼마인가요?`,
        answer: '철거는 실내 마감재 성상(석고, 타일, 조적벽 등)과 폐기물 반출 동선에 따라 차이가 커 현장 사진 확인 후 안내해 드립니다.',
      },
      {
        question: '폐기물 처리 비용이 철거 견적에 포함되어 있나요?',
        answer: '네, 기본적으로 철거 공정에서 나오는 잔재물의 수거 및 반출 운반 비용을 포함하여 견적 범위를 협의합니다.',
      },
      {
        question: '현장 방문 없이 대략적인 견적 확인이 가능한가요?',
        answer: '공간 전경 사진과 평수, 철거 부위를 사진으로 보내주시면 1차 예상 범위를 상담해 드립니다.',
      },
      {
        question: '주말이나 야간에 작업하면 비용이 추가되나요?',
        answer: '건물 규정으로 인해 야간 또는 휴일 할증이 적용되는 시간대에 작업할 경우 노무비 차이가 발생할 수 있습니다.',
      },
    ],
    finalCtaTitle: '정확하고 투명한 철거 비용이 궁금하신가요?',
    finalCtaDescription: (r) => `${r} 철거 예정 공간 사진과 평수를 전달해 주시면 조건별 예상 기준을 친절히 상담해 드립니다.`,
  },

  // 04. 내부철거 (INTERIOR)
  'kw-demo-interior': {
    heroBenefit: '필요한 부분만 철거해드립니다',
    heroHook: (r) => `${r} 건물 내부 인테리어 철거 및 마감재 제거를 준비하고 계신가요?`,
    heroDescription: () =>
      '철거할 구역의 사진과 작업 범위를 보내주시면 구조와 마감재를 확인해 상담해드립니다.',
    serviceSectionTitle: '내부 철거 시공 범위',
    serviceItems: ['석고보드 가벽 철거', '천장 석고·텍스 철거', '데코타일·마루 철거', '실내 조명·배선 정리'],
    decisionTitle: '내부 철거 시 사전 점검 요소',
    decisionIntro: (r) =>
      `${r} 내부 마감 철거는 후속 인테리어 작업의 바탕이 되므로 훼손하지 말아야 할 기본 배관과 배선을 확인해야 합니다.`,
    decisionPoints: () => [
      { title: '구조 안전 및 철거 범위 점검', desc: '구조체 여부와 철거 가능 범위를 먼저 확인하며, 구조 안전에 영향을 줄 수 있는 부분은 임의로 철거 대상으로 판단하지 않습니다.' },
      { title: '매립 배관·배선 확인', desc: '벽체와 바닥 속 수도 배관, 가스관, 전기 전선관의 위치를 사전에 확인하여 안전을 확보합니다.' },
      { title: '바닥 면정리 수준', desc: '후속 마루나 타일 시공에 적합하도록 바닥 본드 및 잔여 타르의 샌딩 여부를 조율합니다.' },
    ],
    estimateTitle: '내부 철거 견적 검토 항목',
    estimateDescription: () =>
      '철거할 내부 마감재의 겹수(석고 2P, 덧방 타일 등), 분진 차단용 비닐 보양 범위, 반출 동선에 따라 견적이 결정됩니다.',
    processTitle: '실내 안전 내부 철거 공정',
    faqItems: (r) => [
      {
        question: `${r}에서 천장이나 가벽 일부만 철거하는 것도 가능한가요?`,
        answer: '네, 필요한 부분만 정밀하게 절단하여 주변 마감재의 손상 없이 선별 철거가 가능합니다.',
      },
      {
        question: '스프링클러나 소방 설비가 있는 천장도 철거되나요?',
        answer: '소방 배관 및 헤드는 훼손되지 않도록 사전 보양 및 주의 작업이 필요하며, 관련 조건을 사전에 확인합니다.',
      },
      {
        question: '바닥 본드 자국도 깨끗하게 제거되나요?',
        answer: '기본 철거 외에 후속 마감재 시공에 필요한 바닥 샌딩이나 연삭 작업 필요 여부를 협의 후 진행합니다.',
      },
      {
        question: '분진이 많이 발생하는데 보양 작업도 진행되나요?',
        answer: '보존해야 할 시설이나 통로가 있는 경우 비닐 커버링 등 사전 보양 계획을 세워 작업을 진행합니다.',
      },
    ],
    finalCtaTitle: '체계적인 내부 철거 상담이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 내부 철거 대상 사진을 보내주시면 철거 가능 범위와 일정을 꼼꼼히 확인해 드립니다.`,
  },

  // 05. 상가철거 (COMMERCIAL)
  'kw-demo-commercial': {
    heroBenefit: '일정에 맞춰 신속히 철거해드립니다',
    heroHook: (r) => `${r} 상가 매장 정리나 리모델링을 위한 내부 시설 철거를 앞두고 계신가요?`,
    heroDescription: () =>
      '매장 사진과 집기 철거 범위, 희망 일정을 보내주시면 현장 조건을 확인해 작업 범위를 안내해드립니다.',
    serviceSectionTitle: '상가 철거 주요 품목',
    serviceItems: ['매장 진열 시설물', '카운터 및 수납장', '유리 파티션·도어', '바닥 타일 및 천장 마감'],
    decisionTitle: '상가 철거 전 필수 협의 사항',
    decisionIntro: (r) =>
      `${r} 상가 철거는 임대인 및 상가 관리 규정에 따라 철거 범위가 상이하므로 명확한 기준 확인이 우선입니다.`,
    decisionPoints: () => [
      { title: '인도 기준 범위 확정', desc: '임대차 계약서에 명시된 원상회복 조건과 건물주 인도 범위를 사전 조율합니다.' },
      { title: '영업 시간대 소음 규정', desc: '인접 매장 영업에 피해가 없도록 건물 관리규정이 정한 공사 허용 시간대를 준수합니다.' },
      { title: '외부 간판 및 덕트 여부', desc: '해당되는 경우 외부 간판 철거 및 주방 배기 덕트 라인의 철거 포함 여부를 확인합니다.' },
    ],
    estimateTitle: '상가 철거 견적 결정 요소',
    estimateDescription: () =>
      '매장 평수, 주방 설비 유무, 목공 인테리어 철거 물량, 화물 승강기 이용 여건 등을 종합하여 견적을 산출합니다.',
    processTitle: '상가 맞춤 원스톱 철거 절차',
    faqItems: (r) => [
      {
        question: `${r}에서 식당이나 카페 주방 시설도 철거 가능한가요?`,
        answer: '네, 주방 집기 반출 후 방수턱, 조적벽, 배관 마감 등 현장 조건에 맞춰 철거 작업을 진행합니다.',
      },
      {
        question: '상가 복도나 엘리베이터 보양은 어떻게 진행되나요?',
        answer: '보양 규정이 있는 건물이라면 필요한 보양 범위와 반출 조건을 사전에 확인합니다.',
      },
      {
        question: '다음 임차인이 일부 시설을 인수할 경우는 어떻게 하나요?',
        answer: '남겨둘 시설과 철거할 시설을 현장 도면이나 사진으로 구분하여 지정된 부분만 정확히 철거합니다.',
      },
      {
        question: '공사 기간은 보통 며칠 정도 소요되나요?',
        answer: '일반 소형 매장은 1~2일, 대형 평수나 복잡한 구조는 3일 이상 소요될 수 있으며 현장 조건에 따라 조율합니다.',
      },
    ],
    finalCtaTitle: '상가 매장 철거 상담이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 매장 내부 사진과 면적을 알려주시면 철거 범위와 일정을 신속히 상의해 드립니다.`,
  },

  // 06. 사무실철거 (OFFICE)
  'kw-demo-office': {
    heroBenefit: '현장에 맞춰 신속히 철거해드립니다',
    heroHook: (r) => `${r} 사무실 이전이나 계약 만료에 따른 오피스 내부 철거가 필요하신가요?`,
    heroDescription: () =>
      '사무실 사진과 가벽·집기 철거 범위, 희망 일정을 보내주시면 빌딩 여건을 확인해 작업 범위를 안내해드립니다.',
    serviceSectionTitle: '사무실 철거 범위',
    serviceItems: ['경량 래핑·유리 칸막이', '바닥 데코타일·디럭스타일', '천장 텍스·매립등', '랜선 및 배선 정리'],
    decisionTitle: '빌딩 사무실 철거 사전 체크포인트',
    decisionIntro: (r) =>
      `${r} 오피스 빌딩 철거는 빌딩 관리사무소의 사전 승인과 출입 절차를 준수하는 것이 필수적입니다.`,
    decisionPoints: () => [
      { title: '관리소 공사 승인 조건', desc: '빌딩 공사 예치금, 화재감지기 차단 신청, 공사 시간대(야간/주말) 승인 여부를 확인합니다.' },
      { title: '화물 승강기 보양', desc: '공용부 승강기 및 복도 카펫 보호를 위한 전용 보양재 설치 기준을 점검합니다.' },
      { title: '천장 소방 라인 보호', desc: '칸막이 철거 시 천장 텍스 파손 및 스프링클러 배관 손상이 없도록 정밀 시공합니다.' },
    ],
    estimateTitle: '사무실 철거 견적 산정 요소',
    estimateDescription: () =>
      '사무실 전용 면적, 칸막이(가벽) 총 길이, 바닥 타일 철거 여부, 건물 작업 시간대 제약 조건 등을 고려합니다.',
    processTitle: '체계적인 오피스 철거 스텝',
    faqItems: (r) => [
      {
        question: `${r}에서 주말이나 야간에만 철거 공사를 해야 하는데 가능한가요?`,
        answer: '네, 빌딩 관리규정상 주간 소음 작업이 불가능한 현장이라면 주말 또는 야간 일정을 사전 협의하여 조율합니다.',
      },
      {
        question: '불용 사무용 가구(책상, 파티션)도 함께 수거되나요?',
        answer: '네, 실내 칸막이 철거와 함께 반출할 폐가구 및 집기 물량을 사전에 알려주시면 통합 일정을 계획합니다.',
      },
      {
        question: '바닥 랜선과 전기 트렌치 마감도 정리해 주나요?',
        answer: '바닥에 깔린 불필요한 통신선 철거 및 배선 마감 범위를 사전에 확인하여 깔끔하게 정리합니다.',
      },
      {
        question: '빌딩 관리사무소 원상복구 점검을 통과할 수 있나요?',
        answer: '빌딩 측의 마감재 원상복구 체크리스트 기준에 맞춰 사전 철거 범위를 정확히 이행합니다.',
      },
    ],
    finalCtaTitle: '사무실 원상복구 및 철거 상담',
    finalCtaDescription: (r) => `${r} 사무실 공간 사진과 빌딩 공사 규정을 공유해 주시면 최적의 작업 일정을 상담해 드립니다.`,
  },

  // 07. 부분철거 (PARTIAL)
  'kw-demo-partial': {
    heroBenefit: '필요한 부분만 철거해드립니다',
    heroHook: (r) => `${r}에서 필요한 공간이나 특정 시설물만 선택하여 철거하고 싶으신가요?`,
    heroDescription: () =>
      '철거할 구역의 사진과 작업 범위를 보내주시면 보존 부위를 확인해 필요한 부분만 깔끔히 안내해드립니다.',
    serviceSectionTitle: '선별 부분 철거 부문',
    serviceItems: ['비내력벽 가벽 일부', '주방 싱크대·상부장', '욕실 타일·도기류', '베란다 화단·수납장'],
    decisionTitle: '부분 철거 시 필수 점검 사항',
    decisionIntro: (r) =>
      `${r} 부분 철거는 전체를 부수는 것보다 남겨둘 구조물의 훼손을 방지하는 정밀 작업이 핵심입니다.`,
    decisionPoints: () => [
      { title: '철거 경계면 마감', desc: '철거 구역과 보존 구역의 경계선이 울퉁불퉁하지 않도록 커팅 라인을 사전에 확보합니다.' },
      { title: '비산 분진 차단 보양', desc: '거주 중이거나 다른 공간을 사용할 경우 분진이 넘어가지 않도록 밀폐 비닐 보양을 철저히 합니다.' },
      { title: '단독 철거 안전성', desc: '제거할 부위가 인접 구조물이나 매립 배관에 미치는 영향을 검토하여 안전하게 작업합니다.' },
    ],
    estimateTitle: '부분 철거 견적 검토 요소',
    estimateDescription: () =>
      '철거 부위의 면적, 자재 재질, 주변 보양 난이도, 소량 폐기물의 반출 경로를 종합 검토하여 안내합니다.',
    processTitle: '정밀 맞춤 부분 철거 공정',
    faqItems: (r) => [
      {
        question: `${r}에서 가벽 하나만 철거하는 작업도 가능한가요?`,
        answer: '네, 소규모 단일 가벽 철거도 작업 면적과 주변 마감재 손상 방지 대책을 확인한 후 진행합니다.',
      },
      {
        question: '거주 중인 상태에서 부분 철거를 진행할 수 있나요?',
        answer: '생활 공간과 작업 구역을 분리하는 차단 보양을 철저히 진행한 후 작업을 상의해 드립니다.',
      },
      {
        question: '철거 후 벽면이나 천장 도배 마감은 어떻게 하나요?',
        answer: '부분 철거는 마감 전 단계까지 불필요한 부위를 철거하는 작업이며, 철거 후 필요한 면정리 범위와 후속 공정 조건을 함께 확인합니다.',
      },
      {
        question: '욕실 타일 철거 시 방수층 손상은 어떻게 점검하나요?',
        answer: '바닥 덧방 철거인지 올철거인지 사전에 확인하고, 방수 재시공 필요 여부를 상의합니다.',
      },
    ],
    finalCtaTitle: '정밀한 부분 철거 상담이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 철거할 부분의 상세 사진을 전달해 주시면 주변 손상 없는 맞춤 작업을 안내해 드립니다.`,
  },

  // 08. 폐업철거 (CLOSURE)
  'kw-demo-closure': {
    heroBenefit: '원상복구 범위를 확인해드립니다',
    heroHook: (r) => `${r} 매장 폐업 일정에 맞춰 내부 시설물 철거와 비움을 계획 중이신가요?`,
    heroDescription: () =>
      '점포 사진과 퇴거 일정, 원상복구 범위를 알려주시면 필요한 철거와 마감 범위를 안내해드립니다.',
    serviceSectionTitle: '폐업 철거 지원 범위',
    serviceItems: ['홀 인테리어 철거', '주방 조적·닥트 시설', '간판 및 외부 부착물', '매장 바닥·천장 정리'],
    decisionTitle: '폐업 철거 시 사전 고려 사항',
    decisionIntro: (r) =>
      `${r} 폐업 시에는 보증금 반환 일정과 직결되므로 임대인과의 원상복구 합의 기준을 명확히 확인해야 합니다.`,
    decisionPoints: () => [
      { title: '임대차 인도 일정 준수', desc: '계약 만료일 전에 철거와 잔재물 반출을 완료할 수 있도록 시공 일정을 여유 있게 배정합니다.' },
      { title: '시설 인수 대상 분리', desc: '재활용하거나 양도할 집기류는 미리 선별 반출하여 철거 대상과 혼동되지 않도록 합니다.' },
      { title: '계약서 원상복구 특약', desc: '건물주와 협의된 철거 수준(기본 골조 인도 또는 바닥/천장 마감 유지 등)을 서면이나 사진으로 확인합니다.' },
    ],
    estimateTitle: '폐업 철거 견적 산정 기준',
    estimateDescription: () =>
      '매장 업종별 시설물 물량, 주방 방수턱 및 설비 철거 여부, 현장 폐기물 적재 톤수 등을 종합 검토합니다.',
    processTitle: '사업 정리 원스톱 철거 절차',
    faqItems: (r) => [
      {
        question: `${r}에서 폐업 지원금 관련 서류 발급이 가능한가요?`,
        answer: '소상공인 점포철거비 지원사업 등에 필요한 견적서, 전자세금계산서 등 관련 서류 발급을 지원합니다.',
      },
      {
        question: '집기 처분과 철거를 함께 상의할 수 있나요?',
        answer: '네, 실내 잔여 폐기물 반출과 고정 인테리어 시설물 철거를 순차적으로 연계하여 정리해 드립니다.',
      },
      {
        question: '임대인과 철거 범위로 의견이 다른 경우 어떻게 하나요?',
        answer: '현장 실측 시 임대인과 임차인이 함께 확인하실 수 있도록 주요 시설물 상태를 객관적으로 점검해 드립니다.',
      },
      {
        question: '간판 철거도 함께 진행되나요?',
        answer: '해당되는 경우 외부 간판 철거 및 전기선 마감 처리를 사전에 협의하여 함께 진행 가능합니다.',
      },
    ],
    finalCtaTitle: '부담 없는 폐업 철거 상담',
    finalCtaDescription: (r) => `${r} 매장 사진과 퇴거 일정을 알려주시면 일정 차질 없는 맞춤 철거 상담을 도와드립니다.`,
  },

  // 09. 원상복구 (RESTORATION)
  'kw-demo-restoration': {
    heroBenefit: '원상복구 범위를 확인해드립니다',
    heroHook: (r) => `${r} 임대 공간 계약 만료 후 건물주 인도 기준 원상복구 범위를 확인하고 계신가요?`,
    heroDescription: () =>
      '현장 사진과 임대차 종료 일정, 복구 범위를 보내주시면 필요한 철거·원상복구 작업을 안내해드립니다.',
    serviceSectionTitle: '원상복구 주요 시공 분야',
    serviceItems: ['임차 시설물 해체 철거', '가벽 분해 및 벽면 정리', '바닥 마감재 철거', '천장 조명·텍스 정돈'],
    decisionTitle: '원상복구 공사 전 핵심 점검 사항',
    decisionIntro: (r) =>
      `${r} 원상복구는 계약 당시 상태를 기준으로 하므로 입주 시점 사진과 건물주 요구 수준을 대조하는 것이 중요합니다.`,
    decisionPoints: () => [
      { title: '원상복구 기준선 확정', desc: '입주 전 사진이나 임대차 계약서 특약을 확인하여 어디까지 철거하고 복구해야 하는지 파악합니다.' },
      { title: '건물 기본 시설 보호', desc: '건물 본래의 소방 설비, 공용 배관, 시스템 에어컨 기본 라인을 손상 없이 보존합니다.' },
      { title: '철거와 복구 공정 구분', desc: '단순 시설 철거로 끝나는지, 추가적인 페인트 도장이나 바닥 샌딩이 요구되는지 확인합니다.' },
    ],
    estimateTitle: '원상복구 견적 결정 요소',
    estimateDescription: () =>
      '철거 대상 인테리어 시설물의 규모, 기본 시설 훼손 여부, 폐기물 반출 동선, 마감 수준을 확인하여 상담합니다.',
    processTitle: '안전한 원상복구 진행 절차',
    faqItems: (r) => [
      {
        question: `${r}에서 어디까지 철거하고 복구해야 하는지 모르겠는데 어떻게 하나요?`,
        answer: '현재 공간 사진과 입주 당시의 계약 조건(사진 등)을 공유해 주시면 점검해야 할 항목을 차근차근 안내해 드립니다.',
      },
      {
        question: '천장이나 바닥에 구멍이 난 부분도 복구 상담이 가능한가요?',
        answer: '가벽 철거 후 발생하는 천장 텍스 땜빵 및 바닥 부분 보수 필요 범위를 확인하여 진행 가능 여부를 조율합니다.',
      },
      {
        question: '임대인이 과도한 복구를 요구할 때는 어떻게 대처하나요?',
        answer: '일반적인 임대차 계약 원상회복 관례와 현장 상태를 바탕으로 합리적인 공사 범위를 조율하실 수 있도록 조언해 드립니다.',
      },
      {
        question: '보증금 반환 일정에 맞춰 공사를 마칠 수 있나요?',
        answer: '반드시 퇴거 전 최종 점검까지 마칠 수 있도록 작업 일정을 넉넉하게 산정하여 안내해 드립니다.',
      },
    ],
    finalCtaTitle: '정확한 원상복구 상담이 필요하신가요?',
    finalCtaDescription: (r) => `${r} 공간의 현재 사진과 계약서 조건을 전달해 주시면 원상복구 필요 범위를 꼼꼼히 확인해 드립니다.`,
  },
};

/**
 * 철거 (DEMOLITION) Dynamic Content 생성기
 */
export function generateDemolitionContent(context: PageContext): ContentOutput {
  const { seoDisplayName, workKeyword } = context;
  const template =
    DEMOLITION_TEMPLATES_BY_KEYWORD_ID[workKeyword.keywordId] ||
    DEMOLITION_TEMPLATES_BY_KEYWORD_ID['kw-demo-general'];

  // H1: 정확히 1개, {seoDisplayName} {workKeyword.displayName} (예: 매탄동 상가철거)
  const h1 = `${seoDisplayName} ${workKeyword.displayName}`;
  const heroBenefit = template.heroBenefit;
  const heroHook = template.heroHook(seoDisplayName);
  const heroDescription = template.heroDescription(seoDisplayName);

  return {
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
}

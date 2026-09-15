export interface ServiceScopeCard {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface ServiceScopeConfig {
  eyebrow: string;
  h2: string;
  supportingCopy: string;
  cards: ServiceScopeCard[];
  scopeNote: string;
}

export const WASTE_SCOPE_CONFIG: ServiceScopeConfig = {
  eyebrow: 'SERVICE SCOPE',
  h2: '이런 폐기물 수거를 도와드립니다',
  supportingCopy:
    '가정집 정리부터 사업장 폐기물까지, 현장 상황에 맞는 수거 범위와 반출 방법을 안내합니다.',
  cards: [
    {
      id: 'furniture',
      title: '대형 가구·가전 수거',
      description:
        '장롱, 침대, 책장, 소파 등 부피가 큰 가구와 생활 가전을 정리합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '대형 가구 가전 수거 현장',
    },
    {
      id: 'homeMove',
      title: '가정집 비움·이사 폐기물',
      description:
        '이사 전후 남은 생활 폐기물과 집 정리 과정에서 나온 물품을 수거합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '가정집 비움 이사 폐기물 정리 현장',
    },
    {
      id: 'businessFixtures',
      title: '사무실·상가 집기 정리',
      description:
        '책상, 의자, 진열장, 카운터 등 이전·폐업 과정에서 나온 집기를 정리합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '사무실 상가 불용 집기 정리 현장',
    },
    {
      id: 'siteDebris',
      title: '공사·현장 잔재물 수거',
      description:
        '공사 후 남은 폐자재, 마대, 박스류 등 현장 정리 과정에서 나온 잔재물을 수거합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '공사 현장 잔재물 마대 수거 현장',
    },
  ],
  scopeNote:
    '대형 가구, 생활 폐기물, 이사 정리, 사무실·상가 집기, 공사 잔재물 등 현장 상황에 따라 상담 가능합니다.',
};

export const DEMOLITION_SCOPE_CONFIG: ServiceScopeConfig = {
  eyebrow: 'SERVICE SCOPE',
  h2: '이런 철거·원상복구 작업을 진행합니다',
  supportingCopy:
    '상가 원상복구부터 부분 철거까지, 현장 구조와 작업 범위에 맞춰 필요한 철거를 안내합니다.',
  cards: [
    {
      id: 'storeRestoration',
      title: '상가 원상복구',
      description:
        '임대차 종료에 맞춰 매장 철거와 원상복구 범위를 확인해 작업을 진행합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '상가 원상복구 철거 현장',
    },
    {
      id: 'officePartition',
      title: '사무실 가벽·칸막이 철거',
      description:
        '사무실 구조 변경이나 퇴거 전 정리에 필요한 가벽, 칸막이와 관련 구조물을 철거합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '사무실 가벽 칸막이 철거 현장',
    },
    {
      id: 'partialDemolition',
      title: '실내 부분 철거',
      description:
        '주방, 욕실, 카운터, 벽체 등 필요한 구역을 확인해 부분 철거를 진행합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '실내 인테리어 부분 철거 현장',
    },
    {
      id: 'floorCeiling',
      title: '바닥·천장 마감 철거',
      description:
        '바닥재, 텍스, 천장 마감재 등 마감재 해체와 필요한 기초 정리를 진행합니다.',
      imageSrc: undefined, // Operator will provide real field photo
      imageAlt: '바닥재 천장 텍스 마감 철거 현장',
    },
  ],
  scopeNote:
    '상가 원상복구, 사무실 철거, 부분 철거, 바닥·천장 마감 철거 등 현장별 작업 범위를 상담할 수 있습니다.',
};

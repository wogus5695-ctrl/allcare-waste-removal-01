export interface ServiceScopeCard {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  objectPosition?: string;
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
        '장롱, 침대, 책장, 소파 등 부피가 큰 가구와 생활 가전을 수거·정리합니다.',
      imageSrc: '/images/service-scope/waste-card-furniture.jpg',
      imageAlt: '대형 폐가구 수거 현장',
      objectPosition: 'center 35%',
    },
    {
      id: 'clutterHouse',
      title: '쓰레기집·고독사 현장',
      description:
        '생활 폐기물과 집기 등이 쌓인 공간을 확인해 현장 상황에 맞는 수거·정리 범위를 안내합니다.',
      imageSrc: '/images/service-scope/waste-card-clutter.jpg',
      imageAlt: '생활 폐기물이 쌓여 있는 주거 공간 정리 현장',
      objectPosition: 'center 45%',
    },
    {
      id: 'businessFixtures',
      title: '사무실·상가 폐기물',
      description:
        '책상, 의자, 진열장, 카운터 등 이전·폐업 과정에서 나온 사업장 폐기물을 정리합니다.',
      imageSrc: '/images/service-scope/waste-card-commercial.jpg',
      imageAlt: '사무실·상가 집기 및 폐기물 정리 현장',
      objectPosition: 'center 40%',
    },
    {
      id: 'siteDebris',
      title: '공사·인테리어 현장 폐기물',
      description:
        '공사·인테리어 후 남은 폐자재와 마대 등 현장 정리 과정에서 발생한 잔재물을 수거합니다.',
      imageSrc: '/images/service-scope/waste-card-construction.jpg',
      imageAlt: '공사·인테리어 잔재물 수거 현장',
      objectPosition: 'center 40%',
    },
  ],
  scopeNote:
    '대형 가구·가전, 생활 폐기물, 쓰레기집 정리, 사무실·상가 폐기물, 공사·인테리어 잔재물 등 현장 상황에 따라 상담 가능합니다.',
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
      imageSrc: '/images/service-scope/demolition-card-restoration.jpg',
      imageAlt: '상가 원상복구 현장',
      objectPosition: 'center 35%',
    },
    {
      id: 'interiorDemolition',
      title: '인테리어 철거',
      description:
        '실내 마감과 구조물을 확인해 공간 특성에 맞는 인테리어 철거를 진행합니다.',
      imageSrc: '/images/service-scope/demolition-card-interior.jpg',
      imageAlt: '실내 인테리어 철거 현장',
      objectPosition: 'center 45%',
    },
    {
      id: 'partialDemolition',
      title: '실내 부분 철거',
      description:
        '주방, 욕실, 카운터, 벽체 등 필요한 구역을 확인해 부분 철거를 진행합니다.',
      imageSrc: '/images/service-scope/demolition-card-partial.jpg',
      imageAlt: '주방을 포함한 실내 부분 철거 현장',
      objectPosition: 'center 45%',
    },
    {
      id: 'floorCeiling',
      title: '바닥·천장 마감 철거',
      description:
        '바닥재, 텍스, 천장 마감재 등 마감재 해체와 필요한 기초 정리를 진행합니다.',
      imageSrc: '/images/service-scope/demolition-card-finishes.jpg',
      imageAlt: '텍스 천장 및 천장 마감 철거 현장',
      objectPosition: 'center 35%',
    },
  ],
  scopeNote:
    '상가 원상복구, 인테리어 철거, 실내 부분 철거, 바닥·천장 마감 철거 등 현장별 작업 범위를 상담할 수 있습니다.',
};

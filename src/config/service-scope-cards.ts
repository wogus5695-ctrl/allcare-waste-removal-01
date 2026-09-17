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

import { IntentGroup } from '@/types/keyword';

export type WasteScopeIntentGroup =
  | 'GENERAL'
  | 'PRICE'
  | 'BULKY_FURNITURE'
  | 'HOUSEHOLD_MOVING'
  | 'COMMERCIAL_OFFICE'
  | 'BUSINESS_CONST';

/**
 * 기존 intentGroup을 Service Scope 전용 6개 그룹으로 결정론적 매핑
 * (Keyword String 직접 비교 0건, IntentCategory 기반 자동 분류)
 */
export function deriveWasteScopeIntentGroup(intentGroup?: IntentGroup): WasteScopeIntentGroup {
  switch (intentGroup) {
    case 'PRICE_ESTIMATE':
      return 'PRICE';
    case 'BULKY_WASTE_COLLECTION':
    case 'FURNITURE':
      return 'BULKY_FURNITURE';
    case 'HOUSEHOLD':
    case 'MOVING':
      return 'HOUSEHOLD_MOVING';
    case 'OFFICE':
    case 'COMMERCIAL':
    case 'CLOSURE':
      return 'COMMERCIAL_OFFICE';
    case 'BUSINESS_FACILITY':
    case 'CONSTRUCTION':
      return 'BUSINESS_CONST';
    case 'GENERAL_DISPOSAL':
    case 'GENERAL_COMPANY':
    case 'GENERAL_COLLECTION':
    default:
      return 'GENERAL';
  }
}

/**
 * 공통 4개 Base Card Pool (기존 실사 에셋 100% 보존)
 * - A = furniture (대형 가구·가전 수거)
 * - B = clutterHouse (쓰레기집·고독사 현장)
 * - C = businessFixtures (사무실·상가 폐기물)
 * - D = siteDebris (공사·인테리어 현장 폐기물)
 */
export const BASE_WASTE_SCOPE_CARDS: Record<string, ServiceScopeCard> = {
  furniture: {
    id: 'furniture',
    title: '대형 가구·가전 수거',
    description: '장롱, 침대, 책장, 소파 등 부피가 큰 가구와 생활 가전을 수거·정리합니다.',
    imageSrc: '/images/service-scope/waste-card-furniture.jpg',
    imageAlt: '대형 폐가구 수거 현장',
    objectPosition: 'center 35%',
  },
  clutterHouse: {
    id: 'clutterHouse',
    title: '쓰레기집·고독사 현장',
    description: '생활 폐기물과 집기 등이 쌓인 공간을 확인해 현장 상황에 맞는 수거·정리 범위를 안내합니다.',
    imageSrc: '/images/service-scope/waste-card-clutter.jpg',
    imageAlt: '생활 폐기물이 쌓여 있는 주거 공간 정리 현장',
    objectPosition: 'center 45%',
  },
  businessFixtures: {
    id: 'businessFixtures',
    title: '사무실·상가 폐기물',
    description: '책상, 의자, 진열장, 카운터 등 이전·폐업 과정에서 나온 사업장 폐기물을 정리합니다.',
    imageSrc: '/images/service-scope/waste-card-commercial.jpg',
    imageAlt: '사무실·상가 집기 및 폐기물 정리 현장',
    objectPosition: 'center 40%',
  },
  siteDebris: {
    id: 'siteDebris',
    title: '공사·인테리어 현장 폐기물',
    description: '공사·인테리어 후 남은 폐자재와 마대 등 현장 정리 과정에서 발생한 잔재물을 수거합니다.',
    imageSrc: '/images/service-scope/waste-card-construction.jpg',
    imageAlt: '공사·인테리어 잔재물 수거 현장',
    objectPosition: 'center 40%',
  },
};

/**
 * 6개 Intent Group별 최종 카드 노출 순서 매핑 (Option B)
 * - GENERAL:           A -> C -> D -> B
 * - PRICE:             A -> C -> D -> B
 * - BULKY_FURNITURE:   A -> C -> D -> B (대형폐기물/가구수거에서 B 후순위 배치)
 * - HOUSEHOLD_MOVING:  B* -> A -> C -> D (가정·생활 폐기물 정리 1순위)
 * - COMMERCIAL_OFFICE: C -> D -> A -> B (사무실·상가 집기 1순위)
 * - BUSINESS_CONST:    D -> C -> A -> B (공사·인테리어 잔재물 1순위)
 */
export const WASTE_SCOPE_ORDER_BY_INTENT_GROUP: Record<WasteScopeIntentGroup, readonly string[]> = {
  GENERAL: ['furniture', 'businessFixtures', 'siteDebris', 'clutterHouse'],
  PRICE: ['furniture', 'businessFixtures', 'siteDebris', 'clutterHouse'],
  BULKY_FURNITURE: ['furniture', 'businessFixtures', 'siteDebris', 'clutterHouse'],
  HOUSEHOLD_MOVING: ['clutterHouse', 'furniture', 'businessFixtures', 'siteDebris'],
  COMMERCIAL_OFFICE: ['businessFixtures', 'siteDebris', 'furniture', 'clutterHouse'],
  BUSINESS_CONST: ['siteDebris', 'businessFixtures', 'furniture', 'clutterHouse'],
};

/**
 * Card B Text Override (HOUSEHOLD_MOVING 의도군 전용)
 * - 기존 waste-card-clutter.jpg 실사 이미지 그대로 재사용
 * - 자극적인 고독사/쓰레기집 명칭을 가정집/이사 정리에 적합한 자연어로 치환
 */
export const CARD_B_HOUSEHOLD_OVERRIDE: Partial<ServiceScopeCard> = {
  title: '가정·생활 폐기물 정리',
  description: '생활용품, 잡화, 묵은 짐 등 가정집과 이사 전후 공간에 남은 폐기물을 수거·정리합니다.',
  imageAlt: '가정·생활 폐기물 정리 현장',
};

const WASTE_SCOPE_COMMON_HEADER = {
  eyebrow: 'SERVICE SCOPE',
  h2: '이런 폐기물 수거를 도와드립니다',
  supportingCopy:
    '가정집 정리부터 사업장 폐기물까지, 현장 상황에 맞는 수거 범위와 반출 방법을 안내합니다.',
  scopeNote:
    '대형 가구·가전, 생활 폐기물, 쓰레기집 정리, 사무실·상가 폐기물, 공사·인테리어 잔재물 등 현장 상황에 따라 상담 가능합니다.',
};

/**
 * Intent Group에 따른 최종 ServiceScopeConfig 생성기
 * - DOM/HTML 순서와 시각적 순서가 100% 일치하도록 배열 직접 정렬
 */
export function getWasteScopeConfig(intentGroup?: IntentGroup): ServiceScopeConfig {
  const scopeGroup = deriveWasteScopeIntentGroup(intentGroup);
  const cardIds = WASTE_SCOPE_ORDER_BY_INTENT_GROUP[scopeGroup];

  const cards: ServiceScopeCard[] = cardIds.map((id) => {
    const base = BASE_WASTE_SCOPE_CARDS[id];
    if (id === 'clutterHouse' && scopeGroup === 'HOUSEHOLD_MOVING') {
      return {
        ...base,
        ...CARD_B_HOUSEHOLD_OVERRIDE,
      };
    }
    return { ...base };
  });

  return {
    ...WASTE_SCOPE_COMMON_HEADER,
    cards,
  };
}

/** 하위 호환용 기본 설정 (Static /waste 및 Fallback용: GENERAL 순서 적용) */
export const WASTE_SCOPE_CONFIG: ServiceScopeConfig = getWasteScopeConfig();

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

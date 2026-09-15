export interface EstimateCriterion {
  num: string;
  title: string;
  description: string;
}

export interface EstimateCriteriaConfig {
  serviceFamily: 'WASTE' | 'DEMOLITION';
  eyebrow: string;
  h2: string;
  supportingCopy: string;
  imageSrc?: string | null;
  imageAlt?: string;
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
  items: [EstimateCriterion, EstimateCriterion, EstimateCriterion, EstimateCriterion];
}

/**
 * 폐기물 견적 산정 기준 4대 항목 설정
 */
export const WASTE_ESTIMATE_CONFIG: EstimateCriteriaConfig = {
  serviceFamily: 'WASTE',
  eyebrow: 'ESTIMATE CRITERIA',
  h2: '폐기물 견적은 이렇게 결정됩니다',
  supportingCopy:
    '단순 무게만이 아닌 품목 구성, 전체 물량, 현장 반출 환경, 차량 접근성까지 종합적으로 고려하여 합리적인 견적을 안내합니다.',
  // 운영자 실제 현장 사진 적용 (비식별화 privacy-safe 적용)
  imageSrc: '/images/estimate/waste-estimate-privacy.webp',
  imageAlt: '폐기물을 차량에 적재한 수거 현장',
  desktopObjectPosition: '50% 52%',
  mobileObjectPosition: '50% 50%',
  items: [
    {
      num: '01',
      title: '품목 종류·분해 여부',
      description:
        '가구, 가전, 목재, 혼합 폐기물 여부와 분해·해체가 필요한 품목인지 확인합니다.',
    },
    {
      num: '02',
      title: '전체 물량',
      description:
        '단품 수거인지 여러 품목인지, 현장 전체 물량과 필요한 적재 규모를 확인합니다.',
    },
    {
      num: '03',
      title: '반출 환경',
      description:
        '작업 층수와 엘리베이터 사용 여부, 계단 작업 등 실제 반출 조건을 확인합니다.',
    },
    {
      num: '04',
      title: '차량 접근성',
      description:
        '건물 입구 접근과 주차 가능 여부, 상차 동선과 작업 공간을 함께 확인합니다.',
    },
  ],
};

/**
 * 철거·원상복구 견적 산정 기준 4대 항목 설정
 */
export const DEMOLITION_ESTIMATE_CONFIG: EstimateCriteriaConfig = {
  serviceFamily: 'DEMOLITION',
  eyebrow: 'ESTIMATE CRITERIA',
  h2: '철거 견적은 이렇게 결정됩니다',
  supportingCopy:
    '단순 평당 단가가 아닌 철거 범위, 구조·마감재 종류, 현장 반출 여건, 원상복구 조건까지 종합적으로 검토하여 정확한 견적을 안내합니다.',
  // 운영자 실제 현장 사진 적용 (전동 장비 실내 철거 현장)
  imageSrc: '/images/estimate/demolition-estimate.webp',
  imageAlt: '전동 장비를 이용한 실내 철거 작업 현장',
  desktopObjectPosition: '42% 50%',
  mobileObjectPosition: '38% 50%',
  items: [
    {
      num: '01',
      title: '철거 범위·면적',
      description:
        '부분 철거인지 전체 철거인지, 작업 면적과 실제 철거 범위를 확인합니다.',
    },
    {
      num: '02',
      title: '구조·마감재 종류',
      description:
        '석고보드, 텍스, 타일, 경량철골 등 철거 대상의 구조와 마감재를 확인합니다.',
    },
    {
      num: '03',
      title: '반출·작업 환경',
      description:
        '이동 동선과 계단·엘리베이터 사용 여부, 철거 잔재물의 반출 조건을 확인합니다.',
    },
    {
      num: '04',
      title: '원상복구·현장 조건',
      description:
        '원상복구 범위와 소음 제한, 건물 관리 규정 및 작업 가능 시간을 확인합니다.',
    },
  ],
};

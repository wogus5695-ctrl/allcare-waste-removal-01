import { WorkKeywordEntity } from '@/types/keyword';

/**
 * 철거 (DEMOLITION) P0 핵심 키워드 데이터셋 (9개)
 * - STEP 5-D: 파일럿 45개 Dynamic URL 생성을 위해 활성화 (isActive = true, isIndexable = true)
 */
export const DEMOLITION_P0_KEYWORDS: readonly WorkKeywordEntity[] = [
  {
    keywordId: 'kw-demo-general',
    displayName: '철거',
    routeKey: '철거',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'GENERAL_DEMOLITION',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-company',
    displayName: '철거업체',
    routeKey: '철거업체',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'COMPANY_SELECTION',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-price',
    displayName: '철거비용',
    routeKey: '철거비용',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'PRICE_ESTIMATE',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-interior',
    displayName: '내부철거',
    routeKey: '내부철거',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'INTERIOR',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-commercial',
    displayName: '상가철거',
    routeKey: '상가철거',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'COMMERCIAL',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-office',
    displayName: '사무실철거',
    routeKey: '사무실철거',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'OFFICE',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-partial',
    displayName: '부분철거',
    routeKey: '부분철거',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'PARTIAL',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-closure',
    displayName: '폐업철거',
    routeKey: '폐업철거',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'CLOSURE',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-demo-restoration',
    displayName: '원상복구',
    routeKey: '원상복구',
    serviceFamily: 'DEMOLITION',
    intentGroup: 'RESTORATION',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
] as const;

/**
 * P1 후보 키워드 풀 (인텐트 중복 완화 및 카니발라이제이션 방지를 위해 P0 배제)
 */
export const DEMOLITION_P1_CANDIDATES = [
  '인테리어철거',
  '철거공사',
  '상가원상복구',
] as const;

/**
 * 조건부 보류 키워드 풀 (면허/허가/공사 역량 정식 검증 전 비활성 유지)
 */
export const DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES = [
  '건물철거',
  '주택철거',
  '공장철거',
  '건축물철거',
] as const;

import { WorkKeywordEntity, ServiceFamily } from '@/types/keyword';
import { P0_KEYWORDS as WASTE_P0_KEYWORDS, validateKeywordDataset } from './p0-keywords';
import {
  DEMOLITION_P0_KEYWORDS,
  DEMOLITION_P1_CANDIDATES,
  DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES,
} from './demolition-keywords';

export {
  WASTE_P0_KEYWORDS,
  DEMOLITION_P0_KEYWORDS,
  DEMOLITION_P1_CANDIDATES,
  DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES,
  validateKeywordDataset,
};

/**
 * 전체 등록 키워드 엔티티 (폐기물 14개 + 철거 9개 = 총 23개)
 */
export const ALL_KEYWORDS: readonly WorkKeywordEntity[] = [
  ...WASTE_P0_KEYWORDS,
  ...DEMOLITION_P0_KEYWORDS,
];

/** routeKey 기반 빠른 조회를 위한 전체 Map */
const KEYWORD_BY_ROUTE_KEY = new Map<string, WorkKeywordEntity>(
  ALL_KEYWORDS.map((k) => [k.routeKey, k])
);

/** keywordId 기반 빠른 조회를 위한 전체 Map */
const KEYWORD_BY_ID = new Map<string, WorkKeywordEntity>(
  ALL_KEYWORDS.map((k) => [k.keywordId, k])
);

/**
 * routeKey 및 선택적 serviceFamily 필터를 적용한 키워드 조회
 */
export function findKeywordByRouteKey(
  routeKey: string,
  serviceFamily?: ServiceFamily
): WorkKeywordEntity | undefined {
  const kw = KEYWORD_BY_ROUTE_KEY.get(routeKey);
  if (!kw) return undefined;
  if (serviceFamily && kw.serviceFamily !== serviceFamily) return undefined;
  return kw;
}

/**
 * keywordId 기반 키워드 조회
 */
export function findKeywordById(keywordId: string): WorkKeywordEntity | undefined {
  return KEYWORD_BY_ID.get(keywordId);
}

/**
 * 서비스 계열별 키워드 목록 조회
 */
export function getKeywordsByFamily(family: ServiceFamily): readonly WorkKeywordEntity[] {
  return family === 'WASTE' ? WASTE_P0_KEYWORDS : DEMOLITION_P0_KEYWORDS;
}

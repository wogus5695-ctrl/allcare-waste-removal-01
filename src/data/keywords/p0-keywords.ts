import { WorkKeywordEntity } from '@/types/keyword';

export const P0_KEYWORDS: readonly WorkKeywordEntity[] = [
  {
    keywordId: 'kw-general-disposal',
    displayName: '폐기물처리',
    routeKey: '폐기물처리',
    serviceFamily: 'WASTE',
    intentGroup: 'GENERAL_DISPOSAL',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-general-company',
    displayName: '폐기물처리업체',
    routeKey: '폐기물처리업체',
    serviceFamily: 'WASTE',
    intentGroup: 'GENERAL_COMPANY',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-price-estimate',
    displayName: '폐기물처리 비용',
    routeKey: '폐기물처리비용',
    serviceFamily: 'WASTE',
    intentGroup: 'PRICE_ESTIMATE',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-general-short-co',
    displayName: '폐기물업체',
    routeKey: '폐기물업체',
    serviceFamily: 'WASTE',
    intentGroup: 'GENERAL_COMPANY',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-general-collection',
    displayName: '폐기물수거',
    routeKey: '폐기물수거',
    serviceFamily: 'WASTE',
    intentGroup: 'GENERAL_COLLECTION',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-collection-company',
    displayName: '폐기물수거업체',
    routeKey: '폐기물수거업체',
    serviceFamily: 'WASTE',
    intentGroup: 'GENERAL_COLLECTION',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-bulky-collection',
    displayName: '대형폐기물수거',
    routeKey: '대형폐기물수거',
    serviceFamily: 'WASTE',
    intentGroup: 'BULKY_WASTE_COLLECTION',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-household',
    displayName: '가정폐기물처리',
    routeKey: '가정폐기물처리',
    serviceFamily: 'WASTE',
    intentGroup: 'HOUSEHOLD',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-furniture',
    displayName: '가구수거',
    routeKey: '가구수거',
    serviceFamily: 'WASTE',
    intentGroup: 'FURNITURE',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-moving',
    displayName: '이사폐기물처리',
    routeKey: '이사폐기물처리',
    serviceFamily: 'WASTE',
    intentGroup: 'MOVING',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-office',
    displayName: '사무실폐기물처리',
    routeKey: '사무실폐기물처리',
    serviceFamily: 'WASTE',
    intentGroup: 'OFFICE',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-commercial',
    displayName: '상가폐기물처리',
    routeKey: '상가폐기물처리',
    serviceFamily: 'WASTE',
    intentGroup: 'COMMERCIAL',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-closure',
    displayName: '폐업폐기물처리',
    routeKey: '폐업폐기물처리',
    serviceFamily: 'WASTE',
    intentGroup: 'CLOSURE',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-business',
    displayName: '사업장폐기물',
    routeKey: '사업장폐기물',
    serviceFamily: 'WASTE',
    intentGroup: 'BUSINESS_FACILITY',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
  {
    keywordId: 'kw-construction',
    displayName: '건설폐기물',
    routeKey: '건설폐기물',
    serviceFamily: 'WASTE',
    intentGroup: 'CONSTRUCTION',
    priority: 'P0',
    isActive: true,
    isIndexable: true,
  },
] as const;

/** WASTE 계열 P0 키워드 명시적 별칭 */
export const WASTE_P0_KEYWORDS = P0_KEYWORDS;

/** routeKey 기반 빠른 조회를 위한 Map 사전 생성 */
const KEYWORD_BY_ROUTE_KEY = new Map<string, WorkKeywordEntity>(
  P0_KEYWORDS.map((k) => [k.routeKey, k])
);

export function findKeywordByRouteKey(routeKey: string): WorkKeywordEntity | undefined {
  return KEYWORD_BY_ROUTE_KEY.get(routeKey);
}

/** 데이터셋 무결성 검증 함수 */
export function validateKeywordDataset(keywords: readonly WorkKeywordEntity[]): {
  isValid: boolean;
  duplicateIds: string[];
  duplicateRouteKeys: string[];
} {
  const idSet = new Set<string>();
  const routeKeySet = new Set<string>();
  const duplicateIds: string[] = [];
  const duplicateRouteKeys: string[] = [];

  for (const k of keywords) {
    if (idSet.has(k.keywordId)) {
      duplicateIds.push(k.keywordId);
    }
    idSet.add(k.keywordId);

    if (routeKeySet.has(k.routeKey)) {
      duplicateRouteKeys.push(k.routeKey);
    }
    routeKeySet.add(k.routeKey);
  }

  return {
    isValid: duplicateIds.length === 0 && duplicateRouteKeys.length === 0,
    duplicateIds,
    duplicateRouteKeys,
  };
}

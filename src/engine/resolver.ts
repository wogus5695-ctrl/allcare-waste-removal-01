import { WorkKeywordEntity, ServiceFamily } from '@/types/keyword';
import { RegionEntity } from '@/types/region';
import { PageContext } from '@/types/content';
import { ALL_KEYWORDS, findKeywordByRouteKey } from '@/data/keywords';
import { findRegionByRouteKey } from '@/data/regions';
import { getServiceFamilyConfig } from '@/config/service-family';
import { getServiceRegionPolicy } from '@/config/service-region-policy';

export interface ResolvedRoute {
  region: RegionEntity;
  work: WorkKeywordEntity;
  serviceFamily: ServiceFamily;
  canonicalQuery: string;
  isIndexable: boolean;
}

/**
 * 전체 등록 작업 키워드 routeKey 목록 (긴 문자열 우선 정렬: Maximal Match 보장)
 */
const SORTED_WORK_ROUTE_KEYS = [...ALL_KEYWORDS]
  .map((w) => w.routeKey)
  .sort((a, b) => b.length - a.length);

/**
 * URL Query (?k=) 기반 Base URL Resolver
 */
export function resolveBaseRoute(
  rawK?: string | null,
  customRegionFinder: (routeKey: string) => RegionEntity | undefined = findRegionByRouteKey
): ResolvedRoute | null {
  if (!rawK || typeof rawK !== 'string') {
    return null;
  }

  // 1. Unicode NFC Normalize & Decode
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawK).normalize('NFC').trim();
  } catch {
    return null;
  }

  if (!decoded || !decoded.includes('-')) {
    return null;
  }

  // 2. Exact Work RouteKey Match (후방 매칭)
  let matchedWorkKey: string | null = null;
  let candidateRegionKey: string | null = null;

  for (const workKey of SORTED_WORK_ROUTE_KEYS) {
    const suffix = `-${workKey}`;
    if (decoded.endsWith(suffix)) {
      matchedWorkKey = workKey;
      candidateRegionKey = decoded.slice(0, decoded.length - suffix.length);
      break;
    }
  }

  if (!matchedWorkKey || !candidateRegionKey) {
    return null;
  }

  // 3. 작업 키워드 엔티티 조회 및 키워드 자체 활성화 검증
  const workEntity = findKeywordByRouteKey(matchedWorkKey);
  if (!workEntity || !workEntity.isActive) {
    return null;
  }

  // 4. 서비스 패밀리 자체 활성화 여부 검증 (DEMOLITION은 현재 비활성)
  const familyConfig = getServiceFamilyConfig(workEntity.serviceFamily);
  if (!familyConfig || !familyConfig.enabled) {
    return null;
  }

  // 5. Exact Region RouteKey 매칭 (Canonical routeKey만 일치 허용, alias 단독 허용 불가)
  const regionEntity = customRegionFinder(candidateRegionKey);
  if (!regionEntity || !regionEntity.isActive) {
    return null;
  }

  // 6. 서비스별 지역 정책(ServiceRegionPolicy) 활성화 검증
  const regionPolicy = getServiceRegionPolicy(workEntity.serviceFamily, regionEntity.regionId);
  if (!regionPolicy || !regionPolicy.isActive) {
    return null;
  }

  // 7. Indexability 의미론 결정
  const isIndexable = regionEntity.isIndexable && regionPolicy.isIndexable && workEntity.isIndexable;

  return {
    region: regionEntity,
    work: workEntity,
    serviceFamily: workEntity.serviceFamily,
    canonicalQuery: `${regionEntity.routeKey}-${workEntity.routeKey}`,
    isIndexable,
  };
}

/**
 * ResolvedRoute 기반 표준 PageContext 생성
 */
export function createPageContext(resolved: ResolvedRoute): PageContext {
  return {
    region: resolved.region,
    workKeyword: resolved.work,
    serviceFamily: resolved.serviceFamily,
    regionLevel: resolved.region.regionType,
    seoDisplayName: resolved.region.seoDisplayName,
    dynamicKeyword: `${resolved.region.seoDisplayName} ${resolved.work.displayName}`,
    canonicalRoute: resolved.canonicalQuery,
    isIndexable: resolved.isIndexable,
  };
}

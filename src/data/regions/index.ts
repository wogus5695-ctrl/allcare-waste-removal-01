import { RegionEntity } from '@/types/region';
import { SUWON_REGIONS } from './suwon';

/**
 * 테스트 및 레퍼런스용 보조 Fixture (안산시 중앙동 충돌 검증용 및 서울 역삼동)
 * isSitemapEligible: false, isHubEligible: false로 설정하여
 * 실제 Pilot Sitemap 및 Hub에는 노출되지 않으며 Unit Test 호환성만 유지.
 */
export const TEST_REFERENCE_REGIONS: readonly RegionEntity[] = [
  {
    regionId: 'gg-ansan-jungang',
    officialName: '중앙동',
    routeKey: '안산시-중앙동',
    seoDisplayName: '안산시 중앙동',
    regionType: 'DONG',
    parentRegionId: 'gg-ansan',
    upperRegionId: 'gyeonggi',
    aliases: ['안산 중앙동'],
    hasNationwideCollision: true,
    priority: 'P0',
    isActive: true,
    isIndexable: true,
    isSitemapEligible: false, // Pilot Sitemap 제외
    isHubEligible: false,     // Hub 크롤러 제외
  },
  {
    regionId: 'seoul-gn-yeoksam',
    officialName: '역삼동',
    routeKey: '역삼동',
    seoDisplayName: '역삼동',
    regionType: 'DONG',
    parentRegionId: 'seoul-gn',
    upperRegionId: 'seoul',
    aliases: ['역삼'],
    hasNationwideCollision: false,
    priority: 'P0',
    isActive: true,
    isIndexable: true,
    isSitemapEligible: false, // Pilot Sitemap 제외
    isHubEligible: false,     // Hub 크롤러 제외
  },
];

/**
 * 전체 등록 Region (수원 파일럿 34개 + 테스트 레퍼런스 2개)
 */
export const ALL_REGIONS: readonly RegionEntity[] = [
  ...SUWON_REGIONS,
  ...TEST_REFERENCE_REGIONS,
];

/** routeKey 기반 빠른 매핑 */
const REGION_BY_ROUTE_KEY = new Map<string, RegionEntity>(
  ALL_REGIONS.map((r) => [r.routeKey, r])
);

/** regionId 기반 빠른 매핑 */
const REGION_BY_ID = new Map<string, RegionEntity>(
  ALL_REGIONS.map((r) => [r.regionId, r])
);

export function findRegionByRouteKey(routeKey: string): RegionEntity | undefined {
  return REGION_BY_ROUTE_KEY.get(routeKey);
}

export function findRegionById(regionId: string): RegionEntity | undefined {
  return REGION_BY_ID.get(regionId);
}

export function getAllRegions(): readonly RegionEntity[] {
  return ALL_REGIONS;
}

/**
 * 수원 파일럿 활성 지역 목록 (34개)
 */
export function getSuwonRegions(): readonly RegionEntity[] {
  return SUWON_REGIONS;
}

export { SUWON_REGIONS };

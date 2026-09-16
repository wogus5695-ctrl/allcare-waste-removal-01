import { RegionEntity } from '@/types/region';
import { SUWON_REGIONS } from './suwon';
import { SEOUL_REGIONS } from './seoul';
import { INCHEON_REGIONS } from './incheon';
import { GYEONGGI_REGIONS } from './gyeonggi';

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
 * 전체 등록 Region (수원 60개 + 서울 67개 + 인천 56개 + 경기 157개 + 테스트 레퍼런스 2개 = 총 342개)
 * - 신규 등록 지역은 W-3B 정책에 따라 모두 비활성(isActive=false, isIndexable=false) 상태.
 */
export const ALL_REGIONS: readonly RegionEntity[] = [
  ...SUWON_REGIONS,
  ...SEOUL_REGIONS,
  ...INCHEON_REGIONS,
  ...GYEONGGI_REGIONS,
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

/**
 * 경기 파일럿 활성 지역 식별자 목록 (3개: 평택시, 고덕동, 동삭동 - W-4 호환용)
 */
export const GYEONGGI_PILOT_REGION_IDS = [
  'gg-pt',
  'gg-pt-godeok',
  'gg-pt-dongsak',
] as const;

export const GYEONGGI_PILOT_REGIONS: readonly RegionEntity[] = GYEONGGI_REGIONS.filter((r) =>
  (GYEONGGI_PILOT_REGION_IDS as readonly string[]).includes(r.regionId)
);

/**
 * 경기 전역 활성 후보 지역 목록 (STEP W-5C: 128개 지역)
 * - 읍/면 29개 지역은 비활성 상태 유지
 */
export const GYEONGGI_ACTIVE_REGIONS: readonly RegionEntity[] = GYEONGGI_REGIONS.filter(
  (r) => r.isActive && r.regionType !== 'EUP' && r.regionType !== 'MYEON'
);

/**
 * 프로덕션 라우팅 전용 활성 지역 (STEP W-5C: 수원 60개 + 서울 전역 67개 + 인천 전역 56개 + 경기 전역 128개 = 총 311개 지역)
 * - 테스트/레퍼런스 픽스처(gg-ansan-jungang, seoul-gn-yeoksam) 및 미활성 경기 읍/면 29개 지역을 제외하여
 *   실제 프로덕션 런타임 라우팅에서 404를 반환하도록 엄격 격리.
 */
export const PRODUCTION_REGIONS: readonly RegionEntity[] = [
  ...SUWON_REGIONS,
  ...SEOUL_REGIONS,
  ...INCHEON_REGIONS,
  ...GYEONGGI_ACTIVE_REGIONS,
];

const PRODUCTION_REGION_BY_ROUTE_KEY = new Map<string, RegionEntity>(
  PRODUCTION_REGIONS.map((r) => [r.routeKey, r])
);

export function findProductionRegionByRouteKey(routeKey: string): RegionEntity | undefined {
  return PRODUCTION_REGION_BY_ROUTE_KEY.get(routeKey);
}

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

export { SUWON_REGIONS, SEOUL_REGIONS, INCHEON_REGIONS, GYEONGGI_REGIONS };

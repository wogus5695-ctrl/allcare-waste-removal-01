import { RegionEntity } from '@/types/region';

/**
 * STEP 2-B 행정구역 Fixture
 * - 수원시 정상 계층 (SI -> GU -> DONG)
 * - 서울 강남구 역삼동 (고유 동명 샘플)
 * - 안산시 중앙동 (공식 행정동명 '중앙동'의 전국 충돌 검증 사례: 단독 '중앙동' 대신 '안산시 중앙동' 결합)
 */
export const INITIAL_REGION_FIXTURES: readonly RegionEntity[] = [
  // 1. 수원시 계층: SI
  {
    regionId: 'gg-suwon',
    officialName: '수원시',
    routeKey: '수원시',
    seoDisplayName: '수원시',
    regionType: 'SI',
    upperRegionId: 'gyeonggi',
    aliases: ['수원'],
    hasNationwideCollision: false,
    priority: 'P0',
    isActive: true,
    isIndexable: true,
    isSitemapEligible: true,
    isHubEligible: true,
    verifiedProfile: undefined,
  },
  // 2. 수원시 계층: GU
  {
    regionId: 'gg-suwon-yt',
    officialName: '영통구',
    routeKey: '영통구',
    seoDisplayName: '영통구',
    regionType: 'GU',
    parentRegionId: 'gg-suwon',
    upperRegionId: 'gyeonggi',
    aliases: ['영통'],
    hasNationwideCollision: false,
    priority: 'P0',
    isActive: true,
    isIndexable: true,
    isSitemapEligible: true,
    isHubEligible: true,
    verifiedProfile: undefined,
  },
  // 3. 수원시 계층: DONG (전국 고유 명칭)
  {
    regionId: 'gg-suwon-yt-maetan',
    officialName: '매탄동',
    routeKey: '매탄동',
    seoDisplayName: '매탄동',
    regionType: 'DONG',
    parentRegionId: 'gg-suwon-yt',
    upperRegionId: 'gyeonggi',
    aliases: ['매탄'],
    hasNationwideCollision: false,
    priority: 'P0',
    isActive: true,
    isIndexable: true,
    isSitemapEligible: true,
    isHubEligible: true,
    verifiedProfile: undefined,
  },
  // 4. 전국 충돌 정합성 검증 샘플: 안산시 중앙동
  // 공식 행정동명이 '중앙동'이며, 전국 다수 지자체에 동일 동명이 존재하므로 상위 지자체(안산시)를 결합하여 안정적 불변 URL 유지
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
    isSitemapEligible: true,
    isHubEligible: true,
    verifiedProfile: undefined,
  },
  // 5. 서울 고유 동명 샘플: 역삼동
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
    isSitemapEligible: true,
    isHubEligible: true,
    verifiedProfile: undefined,
  },
] as const;

/** routeKey 기반 빠른 조회 매핑 */
const REGION_BY_ROUTE_KEY = new Map<string, RegionEntity>(
  INITIAL_REGION_FIXTURES.map((r) => [r.routeKey, r])
);

export function findRegionByRouteKey(routeKey: string): RegionEntity | undefined {
  return REGION_BY_ROUTE_KEY.get(routeKey);
}

export function getAllRegions(): readonly RegionEntity[] {
  return INITIAL_REGION_FIXTURES;
}

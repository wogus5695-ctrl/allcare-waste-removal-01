import { ServiceFamily } from '@/types/service-family';
import { ServiceRegionPolicy } from '@/types/service-region';
import { SUWON_REGIONS } from '@/data/regions/suwon';

/**
 * 철거 (DEMOLITION) 5개 핵심 파일럿 지역 식별자 목록
 * - 수원시 (SI)
 * - 영통구 (GU)
 * - 매탄동 (DONG)
 * - 오목천동 (Legal DONG)
 * - 수원시 정자동 (Nationwide Collision DONG)
 */
export const DEMOLITION_PILOT_REGION_IDS = [
  'gg-suwon',
  'gg-suwon-yt',
  'gg-suwon-yt-maetan',
  'gg-suwon-gs-omokcheon',
  'gg-suwon-ja-jeongja',
] as const;

/**
 * 폐기물 (WASTE) 전체 60개 파일럿 지역 활성화 정책 (100% 활성 상태 유지)
 */
const WASTE_REGION_POLICIES: readonly ServiceRegionPolicy[] = SUWON_REGIONS.map((r) => ({
  serviceFamily: 'WASTE' as const,
  regionId: r.regionId,
  isActive: r.isActive,
  isIndexable: r.isIndexable,
  isSitemapEligible: r.isSitemapEligible,
  isHubEligible: r.isHubEligible,
  isPilotEligible: true,
}));

/**
 * 테스트 및 레퍼런스용 보조 Fixture 정책 (안산시 중앙동, 역삼동)
 * - Unit Test 호환성을 위해 WASTE 서비스에서 해석은 허용(isActive=true)하되,
 * - 사이트맵 및 허브에는 노출되지 않음(isSitemapEligible=false, isHubEligible=false)
 */
const TEST_REFERENCE_POLICIES: readonly ServiceRegionPolicy[] = [
  {
    serviceFamily: 'WASTE',
    regionId: 'gg-ansan-jungang',
    isActive: true,
    isIndexable: true,
    isSitemapEligible: false,
    isHubEligible: false,
    isPilotEligible: false,
  },
  {
    serviceFamily: 'WASTE',
    regionId: 'seoul-gn-yeoksam',
    isActive: true,
    isIndexable: true,
    isSitemapEligible: false,
    isHubEligible: false,
    isPilotEligible: false,
  },
];

/**
 * 철거 (DEMOLITION) 전체 60개 수원 지역 활성화 정책 (STEP 5-F Full Rollout)
 * - 60 Region × 9 Keyword = 540 URLs
 * - isHubEligible: false (철거 허브는 이번 단계에서 생성하지 않음)
 */
const DEMOLITION_REGION_POLICIES: readonly ServiceRegionPolicy[] = SUWON_REGIONS.map(
  (r) => ({
    serviceFamily: 'DEMOLITION' as const,
    regionId: r.regionId,
    isActive: r.isActive,         // 전체 60개 지역 활성화
    isIndexable: r.isIndexable,   // 검색엔진 색인 허용
    isSitemapEligible: r.isSitemapEligible, // 사이트맵 포함 (demolition-gyeonggi-001.xml)
    isHubEligible: r.isHubEligible, // STEP 5-G: 60개 수원 지역 DEMOLITION Hub Eligible 활성화
    isPilotEligible: (DEMOLITION_PILOT_REGION_IDS as readonly string[]).includes(r.regionId),
  })
);

/**
 * 빠른 조회를 위한 복합키 (family:regionId) Map
 */
const POLICY_MAP = new Map<string, ServiceRegionPolicy>();

for (const policy of [
  ...WASTE_REGION_POLICIES,
  ...TEST_REFERENCE_POLICIES,
  ...DEMOLITION_REGION_POLICIES,
]) {
  POLICY_MAP.set(`${policy.serviceFamily}:${policy.regionId}`, policy);
}

/**
 * 특정 서비스 및 지역에 대한 활성화 정책 조회
 */
export function getServiceRegionPolicy(
  family: ServiceFamily,
  regionId: string
): ServiceRegionPolicy | undefined {
  return POLICY_MAP.get(`${family}:${regionId}`);
}

/**
 * 특정 서비스에서 해당 지역이 현재 활성화되어 있는지 여부 반환
 */
export function isServiceRegionActive(family: ServiceFamily, regionId: string): boolean {
  const policy = getServiceRegionPolicy(family, regionId);
  return policy ? policy.isActive : false;
}

/**
 * 철거 파일럿 지역 식별자 목록 반환
 */
export function getDemolitionPilotRegionIds(): readonly string[] {
  return DEMOLITION_PILOT_REGION_IDS;
}

/**
 * 서비스 계열별 활성화된 공식 파일럿 지역 식별자 목록 반환
 * - WASTE: 공식 60개 수원 Region ID 반환
 * - DEMOLITION: 파일럿 5개 수원 Region ID 반환
 */
export function getActiveRegionIdsByFamily(family: ServiceFamily): string[] {
  if (family === 'WASTE') {
    return WASTE_REGION_POLICIES.filter((p) => p.isActive).map((p) => p.regionId);
  }
  return DEMOLITION_REGION_POLICIES.filter((p) => p.isActive).map((p) => p.regionId);
}

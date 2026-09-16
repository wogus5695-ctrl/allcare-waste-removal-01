import { ServiceFamily } from '@/types/service-family';
import { ServiceRegionPolicy } from '@/types/service-region';
import { PRODUCTION_REGIONS } from '@/data/regions';

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
 * 폐기물 (WASTE) 프로덕션 활성화 정책 (수원 60개 + 파일럿 9개 = 총 69개 지역)
 */
const WASTE_REGION_POLICIES: readonly ServiceRegionPolicy[] = PRODUCTION_REGIONS.map((r) => ({
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
 * 철거 (DEMOLITION) 60개 수원 파일럿 지역 ID 고정 목록 (STEP W-1B Decoupling)
 * - 향후 WASTE 지역 확장 시 DEMOLITION이 자동 동기화되어 활성화되는 것을 방지하기 위해 독립적인 ID 목록으로 고정
 */
export const DEMOLITION_SUWON_REGION_IDS: readonly string[] = [
  'gg-suwon',
  'gg-suwon-ja',
  'gg-suwon-gs',
  'gg-suwon-pd',
  'gg-suwon-yt',
  'gg-suwon-ja-pajang',
  'gg-suwon-ja-imok',
  'gg-suwon-ja-yulcheon',
  'gg-suwon-ja-yuljeon',
  'gg-suwon-ja-cheoncheon',
  'gg-suwon-ja-jeongja',
  'gg-suwon-ja-yeonghwa',
  'gg-suwon-ja-songjuk',
  'gg-suwon-ja-jowon',
  'gg-suwon-ja-yeonmu',
  'gg-suwon-ja-sgwanggyo',
  'gg-suwon-ja-hgwanggyo',
  'gg-suwon-gs-seryu',
  'gg-suwon-gs-jangji',
  'gg-suwon-gs-pyeong',
  'gg-suwon-gs-gosaek',
  'gg-suwon-gs-omokcheon',
  'gg-suwon-gs-pyeongri',
  'gg-suwon-gs-seodun',
  'gg-suwon-gs-tap',
  'gg-suwon-gs-guun',
  'gg-suwon-gs-geumgok',
  'gg-suwon-gs-homaesil',
  'gg-suwon-gs-gwonseon',
  'gg-suwon-gs-gokseon',
  'gg-suwon-gs-gokbanjeong',
  'gg-suwon-gs-daehwanggyo',
  'gg-suwon-gs-ipbuk',
  'gg-suwon-gs-dangsu',
  'gg-suwon-pd-haenggung',
  'gg-suwon-pd-gucheon',
  'gg-suwon-pd-namsu',
  'gg-suwon-pd-namchang',
  'gg-suwon-pd-maehyang',
  'gg-suwon-pd-buksu',
  'gg-suwon-pd-sinpung',
  'gg-suwon-pd-yeong',
  'gg-suwon-pd-jangan',
  'gg-suwon-pd-jung',
  'gg-suwon-pd-maegyo',
  'gg-suwon-pd-gyo',
  'gg-suwon-pd-maesan',
  'gg-suwon-pd-godeung',
  'gg-suwon-pd-hwaseo',
  'gg-suwon-pd-ji',
  'gg-suwon-pd-uman',
  'gg-suwon-pd-ingye',
  'gg-suwon-yt-maetan',
  'gg-suwon-yt-woncheon',
  'gg-suwon-yt-yeongtong',
  'gg-suwon-yt-sin',
  'gg-suwon-yt-mangpo',
  'gg-suwon-yt-gwanggyo',
  'gg-suwon-yt-ui',
  'gg-suwon-yt-ha',
];

/**
 * 철거 (DEMOLITION) 지역 정책
 * - STEP W-1B: 검색 노출 및 크롤러 수집 보류 (온홀드)
 * - 라우팅 및 렌더링 유지: isActive = true (HTTP 200 유지)
 * - 검색 엔진 색인 차단: isIndexable = false (noindex, follow)
 * - 사이트맵 제외: isSitemapEligible = false (demolition-gyeonggi-001.xml 생성 방지)
 * - 허브 크롤러 최소화: isHubEligible = false
 */
const DEMOLITION_REGION_POLICIES: readonly ServiceRegionPolicy[] = DEMOLITION_SUWON_REGION_IDS.map(
  (regionId) => ({
    serviceFamily: 'DEMOLITION' as const,
    regionId,
    isActive: true,               // 라우팅 활성화 유지 (HTTP 200)
    isIndexable: false,           // 검색엔진 색인 보류 (noindex, follow)
    isSitemapEligible: false,     // 사이트맵 보류 (Sitemap Index에서 분리)
    isHubEligible: false,         // 허브 크롤러 수집 보류
    isPilotEligible: (DEMOLITION_PILOT_REGION_IDS as readonly string[]).includes(regionId),
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

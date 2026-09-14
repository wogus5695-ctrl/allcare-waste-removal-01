import { ServiceFamily } from './service-family';

/**
 * 서비스 계열별 지역 활성화 및 색인 정책
 * - 기본 행정/SEO 지역 지리 Identity(RegionEntity)와 분리하여
 * - WASTE, DEMOLITION 등 각 Vertical별 독자적인 운영 활성 상태 관리
 */
export interface ServiceRegionPolicy {
  /** 소속 서비스 계열 (WASTE | DEMOLITION) */
  readonly serviceFamily: ServiceFamily;
  /** 대상 지역 식별자 (예: 'gg-suwon-yt-maetan') */
  readonly regionId: string;
  /** 해당 서비스에서의 지역 활성화 여부 */
  readonly isActive: boolean;
  /** 해당 서비스에서의 검색엔진 색인 허용 여부 */
  readonly isIndexable: boolean;
  /** 해당 서비스에서의 사이트맵 포함 여부 */
  readonly isSitemapEligible: boolean;
  /** 해당 서비스에서의 허브 노출 여부 */
  readonly isHubEligible: boolean;
  /** 파일럿 선도 검증 대상 여부 */
  readonly isPilotEligible?: boolean;
}

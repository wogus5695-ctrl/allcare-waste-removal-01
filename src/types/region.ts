export type RegionType = 'SI' | 'GU' | 'GUN' | 'DONG' | 'EUP' | 'MYEON';

export interface VerifiedRegionProfile {
  /** 공공 데이터 기반 공식 검증된 주요 환승역/IC */
  majorTransitHubs?: string[];
  /** 관할 행정복지센터 공식 명칭 */
  administrativeOffice?: string;
}

export interface RegionEntity {
  /** 시스템 고유 식별자 (예: 'gg-suwon-yt-maetan') */
  regionId: string;
  /** 행정상 공식 명칭 (예: '매탄동') */
  officialName: string;
  /** URL ?k= 매칭용 불변 식별자 (예: '매탄동', '안산시-중앙동') */
  routeKey: string;
  /** 검색 및 UI 표기용 불변 명칭 (예: '매탄동', '안산시 중앙동') */
  seoDisplayName: string;
  /** 행정 레벨 */
  regionType: RegionType;
  /** 직속 상위 지역 식별자 */
  parentRegionId?: string;
  /** 광역 시/도 식별자 ('seoul' | 'gyeonggi' | 'incheon' 등) */
  upperRegionId: string;
  /** 유의어/별칭 (데이터 매칭/참조용이며 별도 canonical route를 생성하지 않음) */
  aliases: string[];
  /** 전국 공식 행정구역 기준 동명/구명/군명 중복 여부 */
  hasNationwideCollision: boolean;
  /** 우선순위 */
  priority: 'P0' | 'P1' | 'P2';
  /** 서비스 활성화 여부 */
  isActive: boolean;
  /** 검색엔진 색인 허용 여부 */
  isIndexable: boolean;
  /** sitemap.xml 포함 대상 여부 */
  isSitemapEligible: boolean;
  /** 크롤러 허브 및 네비게이션 노출 여부 */
  isHubEligible: boolean;
  /** 실제 검증된 프로필 (미검증 시 반드시 undefined) */
  verifiedProfile?: VerifiedRegionProfile;
}

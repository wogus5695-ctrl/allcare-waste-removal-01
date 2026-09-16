import { ServiceFamily } from './service-family';

export type { ServiceFamily };

export type IntentGroup =
  // 폐기물 (WASTE) 검색 의도 그룹
  | 'GENERAL_DISPOSAL'
  | 'GENERAL_COMPANY'
  | 'PRICE_ESTIMATE'
  | 'GENERAL_COLLECTION'
  | 'BULKY_WASTE_COLLECTION'
  | 'HOUSEHOLD'
  | 'FURNITURE'
  | 'MOVING'
  | 'OFFICE'
  | 'COMMERCIAL'
  | 'CLOSURE'
  | 'BUSINESS_FACILITY'
  | 'CONSTRUCTION'
  // 철거 (DEMOLITION) 검색 의도 그룹
  | 'GENERAL_DEMOLITION'
  | 'COMPANY_SELECTION'
  | 'INTERIOR'
  | 'PARTIAL'
  | 'RESTORATION';

export interface WorkKeywordEntity {
  /** 고유 식별자 */
  keywordId: string;
  /** UI, H1, Title, Visible 텍스트용 표기명 (공백 유지) */
  displayName: string;
  /** URL ?k= 쿼리 파싱 및 라우팅용 불변 식별자 (공백 제거) */
  routeKey: string;
  /** 소속 서비스 계열 (WASTE | DEMOLITION) */
  serviceFamily: ServiceFamily;
  /** 검색 의도 그룹 */
  intentGroup: IntentGroup;
  /** 노출 우선순위 */
  priority: 'P0' | 'P1';
  /** 활성화 여부 */
  isActive: boolean;
  /** 검색엔진 색인 허용 여부 */
  isIndexable: boolean;
}

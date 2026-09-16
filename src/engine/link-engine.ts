import { RegionEntity } from '@/types/region';
import { WorkKeywordEntity, IntentGroup } from '@/types/keyword';
import { findRegionById } from '@/data/regions';
import { findKeywordByRouteKey } from '@/data/keywords';
import { isServiceRegionActive } from '@/config/service-region-policy';
import { isServiceFamilySearchExposureEnabled } from '@/config/service-family';

export interface InternalLinkItem {
  readonly label: string;
  readonly href: string;
}

export interface CrossVerticalLinkItem {
  readonly sectionTitle: string;
  readonly description: string;
  readonly label: string;
  readonly href: string;
}

export interface InternalLinksContext {
  readonly parentLink: InternalLinkItem | null;
  readonly relatedLinks: readonly InternalLinkItem[];
  readonly crossVerticalLink: CrossVerticalLinkItem | null;
}

/**
 * Search Intent 그룹별 연관 작업 키워드 routeKey 추천 매핑 (각 3~4개)
 * - Service Family Isolation: 폐기물(WASTE)과 철거(DEMOLITION) 간 교차 링크 엄격 배제
 */
const RELATED_WORK_KEYS_BY_INTENT: Record<IntentGroup, readonly string[]> = {
  GENERAL_DISPOSAL: ['폐기물처리업체', '폐기물수거', '가정폐기물처리', '사무실폐기물처리'],
  GENERAL_COMPANY: ['폐기물처리', '폐기물처리비용', '가정폐기물처리', '사무실폐기물처리'],
  PRICE_ESTIMATE: ['폐기물처리업체', '가정폐기물처리', '이사폐기물처리', '사무실폐기물처리'],
  GENERAL_COLLECTION: ['가구수거', '대형폐기물수거', '폐기물처리비용', '폐기물업체'],
  BULKY_WASTE_COLLECTION: ['폐기물수거', '가구수거', '가정폐기물처리', '폐기물수거업체'],
  HOUSEHOLD: ['가구수거', '이사폐기물처리', '폐기물수거업체', '폐기물처리비용'],
  FURNITURE: ['대형폐기물수거', '가정폐기물처리', '폐기물수거', '폐기물처리비용'],
  MOVING: ['가정폐기물처리', '가구수거', '폐기물수거', '폐기물처리업체'],
  OFFICE: ['사업장폐기물', '폐업폐기물처리', '상가폐기물처리', '폐기물처리업체'],
  COMMERCIAL: ['폐업폐기물처리', '사무실폐기물처리', '사업장폐기물', '폐기물처리업체'],
  CLOSURE: ['상가폐기물처리', '사무실폐기물처리', '사업장폐기물', '폐기물처리업체'],
  BUSINESS_FACILITY: ['사무실폐기물처리', '상가폐기물처리', '건설폐기물', '폐기물처리업체'],
  CONSTRUCTION: ['사업장폐기물', '폐기물처리업체', '폐기물처리비용', '폐기물수거'],
  // DEMOLITION 전용 인텐트 매핑 (철거 키워드 간에만 순환 추천)
  GENERAL_DEMOLITION: ['철거업체', '철거비용', '내부철거', '상가철거'],
  COMPANY_SELECTION: ['철거', '철거비용', '내부철거', '상가철거'],
  INTERIOR: ['부분철거', '상가철거', '사무실철거', '원상복구'],
  PARTIAL: ['내부철거', '철거비용', '철거업체', '상가철거'],
  RESTORATION: ['폐업철거', '상가철거', '사무실철거', '내부철거'],
};

/**
 * 특정 작업 키워드별 세부 연관 작업 오버라이드 매핑
 */
const SPECIFIC_RELATED_WORK_OVERRIDES: Record<string, readonly string[]> = {
  // WASTE
  'WASTE:대형폐기물수거': ['폐기물수거', '가구수거', '가정폐기물처리', '폐기물수거업체'],
  'WASTE:가구수거': ['대형폐기물수거', '가정폐기물처리', '폐기물수거', '이사폐기물처리'],
  'WASTE:가정폐기물처리': ['가구수거', '이사폐기물처리', '폐기물수거업체', '폐기물처리비용'],
  'WASTE:이사폐기물처리': ['가정폐기물처리', '가구수거', '폐기물수거', '폐기물처리업체'],
  'WASTE:사무실폐기물처리': ['사업장폐기물', '폐업폐기물처리', '상가폐기물처리', '폐기물처리업체'],
  'WASTE:상가폐기물처리': ['폐업폐기물처리', '사무실폐기물처리', '사업장폐기물', '폐기물처리업체'],
  'WASTE:폐업폐기물처리': ['상가폐기물처리', '사무실폐기물처리', '사업장폐기물', '폐기물처리업체'],
  'WASTE:사업장폐기물': ['사무실폐기물처리', '상가폐기물처리', '건설폐기물', '폐기물처리업체'],
  'WASTE:건설폐기물': ['사업장폐기물', '폐기물처리업체', '폐기물처리비용', '폐기물수거'],
  'WASTE:폐기물처리비용': ['폐기물처리업체', '가정폐기물처리', '이사폐기물처리', '사무실폐기물처리'],
  'WASTE:폐기물처리': ['폐기물처리업체', '폐기물수거', '가정폐기물처리', '사무실폐기물처리'],
  'WASTE:폐기물처리업체': ['폐기물처리', '폐기물처리비용', '가정폐기물처리', '사무실폐기물처리'],
  'WASTE:폐기물업체': ['폐기물처리', '폐기물처리비용', '가정폐기물처리', '사무실폐기물처리'],
  'WASTE:폐기물수거': ['대형폐기물수거', '가구수거', '폐기물업체', '폐기물처리비용'],
  'WASTE:폐기물수거업체': ['가정폐기물처리', '가구수거', '대형폐기물수거', '폐기물처리업체'],

  // DEMOLITION
  'DEMOLITION:철거': ['철거업체', '철거비용', '내부철거', '상가철거'],
  'DEMOLITION:철거업체': ['철거', '철거비용', '내부철거', '상가철거'],
  'DEMOLITION:철거비용': ['철거업체', '내부철거', '상가철거', '부분철거'],
  'DEMOLITION:내부철거': ['부분철거', '상가철거', '사무실철거', '원상복구'],
  'DEMOLITION:상가철거': ['사무실철거', '폐업철거', '원상복구', '내부철거'],
  'DEMOLITION:사무실철거': ['상가철거', '내부철거', '원상복구', '폐업철거'],
  'DEMOLITION:부분철거': ['내부철거', '철거비용', '철거업체', '상가철거'],
  'DEMOLITION:폐업철거': ['상가철거', '원상복구', '사무실철거', '철거비용'],
  'DEMOLITION:원상복구': ['상가철거', '사무실철거', '폐업철거', '내부철거'],
};

/**
 * 상위 행정구역 링크 생성 (DONG -> GU, GU -> SI)
 * - 상위 지역이 해당 serviceFamily에서 활성 상태인지 검증 (비활성 지역 링크로 인한 404 방지)
 */
export function getParentRegionLink(
  region: RegionEntity,
  work: WorkKeywordEntity
): InternalLinkItem | null {
  if (!region.parentRegionId) {
    return null;
  }

  const parent = findRegionById(region.parentRegionId);
  if (!parent || !parent.isActive) {
    return null;
  }

  // 상위 지역이 해당 serviceFamily에서 활성화되어 있는지 확인
  if (!isServiceRegionActive(work.serviceFamily, parent.regionId)) {
    return null;
  }

  return {
    label: `${parent.seoDisplayName} ${work.displayName}`,
    href: `/?k=${parent.routeKey}-${work.routeKey}`,
  };
}

/**
 * 동일 지역 내 검색 의도별 연관 작업 링크 생성 (최대 3~4개)
 * - 동일 serviceFamily 내 활성 키워드만 선별 (Service Family Cross-Link 엄격 배제)
 */
export function getRelatedIntentLinks(
  region: RegionEntity,
  work: WorkKeywordEntity
): readonly InternalLinkItem[] {
  const familyScopedKey = `${work.serviceFamily}:${work.routeKey}`;
  const candidateKeys =
    SPECIFIC_RELATED_WORK_OVERRIDES[familyScopedKey] ||
    RELATED_WORK_KEYS_BY_INTENT[work.intentGroup] ||
    [];

  const links: InternalLinkItem[] = [];

  for (const targetKey of candidateKeys) {
    if (targetKey === work.routeKey) continue;

    const targetWork = findKeywordByRouteKey(targetKey, work.serviceFamily);
    if (targetWork && targetWork.isActive && targetWork.isIndexable) {
      links.push({
        label: `${region.seoDisplayName} ${targetWork.displayName}`,
        href: `/?k=${region.routeKey}-${targetWork.routeKey}`,
      });
    }

    if (links.length >= 4) break;
  }

  return links;
}

interface CrossLinkRule {
  readonly targetFamily: 'WASTE' | 'DEMOLITION';
  readonly targetKeywordKey: string;
  readonly sectionTitle: string;
  readonly description: string;
}

/**
 * STEP 5-H: 엄격 통제된 3개 키워드 쌍 간 Cross-Vertical Contextual Link 정책
 * - PAIR A: 상가폐기물처리 ↔ 상가철거
 * - PAIR B: 사무실폐기물처리 ↔ 사무실철거
 * - PAIR C: 폐업폐기물처리 ↔ 폐업철거
 * - 이외 모든 키워드는 Cross-Vertical Link = 0 (엄격 차단)
 */
const CROSS_LINK_RULES: Record<string, CrossLinkRule> = {
  // PAIR A
  'WASTE:상가폐기물처리': {
    targetFamily: 'DEMOLITION',
    targetKeywordKey: '상가철거',
    sectionTitle: '철거가 함께 필요한 경우',
    description: '상가 내부 시설 철거도 함께 알아보고 있다면 같은 지역의 상가철거 안내를 확인해 보세요.',
  },
  'DEMOLITION:상가철거': {
    targetFamily: 'WASTE',
    targetKeywordKey: '상가폐기물처리',
    sectionTitle: '철거 후 남은 물품 정리가 필요한 경우',
    description: '상가 매장 집기 및 잔여 폐기물 수거가 필요하다면 같은 지역의 상가폐기물처리 안내를 확인해 보세요.',
  },

  // PAIR B
  'WASTE:사무실폐기물처리': {
    targetFamily: 'DEMOLITION',
    targetKeywordKey: '사무실철거',
    sectionTitle: '철거가 함께 필요한 경우',
    description: '사무실 가벽 및 칸막이 철거 시공도 함께 알아보고 있다면 같은 지역의 사무실철거 안내를 확인해 보세요.',
  },
  'DEMOLITION:사무실철거': {
    targetFamily: 'WASTE',
    targetKeywordKey: '사무실폐기물처리',
    sectionTitle: '철거 후 남은 물품 정리가 필요한 경우',
    description: '사무실 집기, 파티션, 책상 등 불용 물품 수거가 필요하다면 같은 지역의 사무실폐기물처리 안내를 확인해 보세요.',
  },

  // PAIR C
  'WASTE:폐업폐기물처리': {
    targetFamily: 'DEMOLITION',
    targetKeywordKey: '폐업철거',
    sectionTitle: '철거가 함께 필요한 경우',
    description: '점포 폐업에 따른 매장 내부 철거 및 원상복구가 함께 필요하다면 같은 지역의 폐업철거 안내를 확인해 보세요.',
  },
  'DEMOLITION:폐업철거': {
    targetFamily: 'WASTE',
    targetKeywordKey: '폐업폐기물처리',
    sectionTitle: '철거 후 남은 물품 정리가 필요한 경우',
    description: '폐업 매장의 불용 집기 및 남은 재고 폐기물 일괄 수거가 필요하다면 같은 지역의 폐업폐기물처리 안내를 확인해 보세요.',
  },
};

/**
 * 교차 버티컬 문맥 링크 생성기 (Strict 3 Pairs Only)
 * - 동일 지역 내에서만 연결 (Same Region Only)
 * - 상대 경로의 활성 상태, 인덱서블 여부, HTTP 유효성 사전 검증 (404 방지)
 */
export function getCrossVerticalLink(
  region: RegionEntity,
  work: WorkKeywordEntity
): CrossVerticalLinkItem | null {
  const ruleKey = `${work.serviceFamily}:${work.routeKey}`;
  const rule = CROSS_LINK_RULES[ruleKey];
  if (!rule) {
    return null;
  }

  // 0. 타겟 서비스 패밀리의 검색 노출이 허용되어 있는지 검증 (STEP W-1B: DEMOLITION 온홀드 시 차단)
  if (!isServiceFamilySearchExposureEnabled(rule.targetFamily)) {
    return null;
  }

  // 1. 해당 지역이 대상 serviceFamily에서 활성화되어 있는지 검증
  if (!isServiceRegionActive(rule.targetFamily, region.regionId)) {
    return null;
  }

  // 2. 대상 키워드가 실제로 존재하며 활성/색인 가능한지 검증
  const targetWork = findKeywordByRouteKey(rule.targetKeywordKey, rule.targetFamily);
  if (!targetWork || !targetWork.isActive || !targetWork.isIndexable) {
    return null;
  }

  return {
    sectionTitle: rule.sectionTitle,
    description: rule.description,
    label: `${region.seoDisplayName} ${targetWork.displayName} 안내`,
    href: `/?k=${region.routeKey}-${targetWork.routeKey}`,
  };
}

/**
 * Dynamic Landing용 통합 내부링크 컨텍스트 생성기
 */
export function getInternalLinks(
  region: RegionEntity,
  work: WorkKeywordEntity
): InternalLinksContext {
  return {
    parentLink: getParentRegionLink(region, work),
    relatedLinks: getRelatedIntentLinks(region, work),
    crossVerticalLink: getCrossVerticalLink(region, work),
  };
}

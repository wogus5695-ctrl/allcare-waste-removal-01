import { PRODUCTION_REGIONS } from '@/data/regions';
import { WASTE_P0_KEYWORDS } from '@/data/keywords';
import { resolveProductionRoute } from '@/engine/resolver';
import { RegionEntity, RegionType } from '@/types/region';
import { WorkKeywordEntity } from '@/types/keyword';

export interface HubSummaryStats {
  totalRegions: number;
  totalKeywords: number;
  expectedCombinations: number;
  resolvedCombinations: number;
  missingCombinations: number;
}

export interface MetroSummaryItem {
  metroId: string;
  metroName: string;
  regionCount: number;
  combinationCount: number;
}

export interface RegionKeywordItem {
  keywordId: string;
  keywordName: string;
  routeKey: string;
  urlPath: string;
  isResolved: boolean;
}

export interface RegionDirectoryItem {
  regionId: string;
  officialName: string;
  seoDisplayName: string;
  routeKey: string;
  regionType: RegionType;
  upperRegionId: string;
  parentRegionId?: string;
  parentName?: string;
  metroName: string;
  hasCollision: boolean;
  activeKeywordsCount: number;
  totalKeywordsCount: number;
  keywords: RegionKeywordItem[];
}

export interface HierarchyDongNode {
  region: RegionDirectoryItem;
}

export interface HierarchyGuNode {
  region: RegionDirectoryItem;
  dongs: HierarchyDongNode[];
}

export interface HierarchySiNode {
  region: RegionDirectoryItem;
  gus: HierarchyGuNode[];
  directDongs: HierarchyDongNode[];
}

export interface HierarchyMetroNode {
  metroId: string;
  metroName: string;
  regionCount: number;
  combinationCount: number;
  sis: HierarchySiNode[];
  gus: HierarchyGuNode[];
}

export interface KeywordCoverageItem {
  keywordId: string;
  displayName: string;
  routeKey: string;
  totalRegionsCount: number;
  activeRegionsCount: number;
  coverageRatio: number;
  metroBreakdown: {
    metroId: string;
    metroName: string;
    count: number;
    total: number;
  }[];
}

export interface MissingCombinationItem {
  regionId: string;
  regionName: string;
  keywordId: string;
  keywordName: string;
  routeKey: string;
  reason: string;
}

export interface RepresentativeLinkItem {
  label: string;
  routeKey: string;
  urlPath: string;
  isResolved: boolean;
  resolvedQuery?: string;
}

export interface WasteHubDirectoryModel {
  summaryStats: HubSummaryStats;
  metroSummary: MetroSummaryItem[];
  hierarchy: HierarchyMetroNode[];
  regions: RegionDirectoryItem[];
  keywordCoverage: KeywordCoverageItem[];
  missingCombinations: MissingCombinationItem[];
  representativeLinks: RepresentativeLinkItem[];
}

const METRO_NAME_MAP: Record<string, string> = {
  seoul: '서울특별시',
  incheon: '인천광역시',
  gyeonggi: '경기도',
};

const METRO_DISPLAY_ORDER = ['seoul', 'incheon', 'gyeonggi'];

/**
 * Waste Dynamic SEO Directory Hub 단일 진실 원천(Single Source of Truth) 모델 빌더
 * - PRODUCTION_REGIONS (311개 활성 지역)
 * - WASTE_P0_KEYWORDS (15개 활성 폐기물 키워드)
 * - resolveProductionRoute (런타임 동적 URL 리졸버)
 * 에서 모든 수치와 계층을 계산(Derive)하여 반환한다.
 */
export function buildWasteHubDirectoryModel(): WasteHubDirectoryModel {
  const activeRegions = PRODUCTION_REGIONS.filter((r) => r.isHubEligible && r.isActive);
  const activeKeywords = WASTE_P0_KEYWORDS.filter((k) => k.isActive);

  const regionEntityMap = new Map<string, RegionEntity>(activeRegions.map((r) => [r.regionId, r]));

  // 1. 개별 Region 정보 및 조합 검증
  const regions: RegionDirectoryItem[] = [];
  const regionItemMap = new Map<string, RegionDirectoryItem>();
  const missingCombinations: MissingCombinationItem[] = [];

  for (const region of activeRegions) {
    const parentEntity = region.parentRegionId ? regionEntityMap.get(region.parentRegionId) : undefined;
    const metroName = METRO_NAME_MAP[region.upperRegionId] || region.upperRegionId;

    const keywords: RegionKeywordItem[] = [];
    let resolvedCount = 0;

    for (const kw of activeKeywords) {
      const candidateQuery = `${region.routeKey}-${kw.routeKey}`;
      const resolved = resolveProductionRoute(candidateQuery);
      const isResolved = Boolean(
        resolved &&
        resolved.region.regionId === region.regionId &&
        resolved.work.keywordId === kw.keywordId &&
        resolved.canonicalQuery === candidateQuery
      );

      if (isResolved) {
        resolvedCount++;
      } else {
        missingCombinations.push({
          regionId: region.regionId,
          regionName: region.seoDisplayName,
          keywordId: kw.keywordId,
          keywordName: kw.displayName,
          routeKey: candidateQuery,
          reason: !resolved ? '리졸버 미해석 (404)' : '리졸버 매칭 불일치',
        });
      }

      keywords.push({
        keywordId: kw.keywordId,
        keywordName: kw.displayName,
        routeKey: kw.routeKey,
        urlPath: `/?k=${candidateQuery}`,
        isResolved,
      });
    }

    const item: RegionDirectoryItem = {
      regionId: region.regionId,
      officialName: region.officialName,
      seoDisplayName: region.seoDisplayName,
      routeKey: region.routeKey,
      regionType: region.regionType,
      upperRegionId: region.upperRegionId,
      parentRegionId: region.parentRegionId,
      parentName: parentEntity?.officialName,
      metroName,
      hasCollision: region.hasNationwideCollision,
      activeKeywordsCount: resolvedCount,
      totalKeywordsCount: activeKeywords.length,
      keywords,
    };

    regions.push(item);
    regionItemMap.set(region.regionId, item);
  }

  // 2. 권역별 요약 통계 (동적 계산)
  const metroGroups = new Map<string, number>();
  for (const region of activeRegions) {
    metroGroups.set(region.upperRegionId, (metroGroups.get(region.upperRegionId) || 0) + 1);
  }

  const sortedMetroIds = Array.from(metroGroups.keys()).sort((a, b) => {
    const indexA = METRO_DISPLAY_ORDER.indexOf(a);
    const indexB = METRO_DISPLAY_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    return a.localeCompare(b);
  });

  const metroSummary: MetroSummaryItem[] = sortedMetroIds.map((metroId) => {
    const count = metroGroups.get(metroId) || 0;
    return {
      metroId,
      metroName: METRO_NAME_MAP[metroId] || metroId,
      regionCount: count,
      combinationCount: count * activeKeywords.length,
    };
  });

  // 3. 계층 구조 트리 (Metro -> SI / GU -> DONG)
  const hierarchy: HierarchyMetroNode[] = metroSummary.map((m) => {
    const metroRegions = activeRegions.filter((r) => r.upperRegionId === m.metroId);

    // 시(SI) 목록
    const siEntities = metroRegions.filter((r) => r.regionType === 'SI');
    const sis: HierarchySiNode[] = siEntities.map((si) => {
      const siItem = regionItemMap.get(si.regionId)!;

      // 시 소속 구(GU)
      const guEntities = metroRegions.filter((r) => r.parentRegionId === si.regionId && r.regionType === 'GU');
      const gus: HierarchyGuNode[] = guEntities.map((gu) => {
        const guItem = regionItemMap.get(gu.regionId)!;
        const dongEntities = metroRegions.filter(
          (r) => r.parentRegionId === gu.regionId && r.regionType === 'DONG'
        );
        const dongs: HierarchyDongNode[] = dongEntities.map((d) => ({
          region: regionItemMap.get(d.regionId)!,
        }));
        return {
          region: guItem,
          dongs,
        };
      });

      // 시 직할 동(DONG) (예: 평택시)
      const directDongEntities = metroRegions.filter(
        (r) => r.parentRegionId === si.regionId && r.regionType === 'DONG'
      );
      const directDongs: HierarchyDongNode[] = directDongEntities.map((d) => ({
        region: regionItemMap.get(d.regionId)!,
      }));

      return {
        region: siItem,
        gus,
        directDongs,
      };
    });

    // 광역시/특별시 직할 구(GU) (예: 서울특별시, 인천광역시)
    const directGuEntities = metroRegions.filter(
      (r) => r.regionType === 'GU' && (!r.parentRegionId || r.parentRegionId === m.metroId)
    );
    const directGus: HierarchyGuNode[] = directGuEntities.map((gu) => {
      const guItem = regionItemMap.get(gu.regionId)!;
      const dongEntities = metroRegions.filter(
        (r) => r.parentRegionId === gu.regionId && r.regionType === 'DONG'
      );
      const dongs: HierarchyDongNode[] = dongEntities.map((d) => ({
        region: regionItemMap.get(d.regionId)!,
      }));
      return {
        region: guItem,
        dongs,
      };
    });

    return {
      metroId: m.metroId,
      metroName: m.metroName,
      regionCount: m.regionCount,
      combinationCount: m.combinationCount,
      sis,
      gus: directGus,
    };
  });

  // 4. 작업명(Keyword)별 커버리지 현황
  const keywordCoverage: KeywordCoverageItem[] = activeKeywords.map((kw) => {
    const metroBreakdown = metroSummary.map((m) => {
      const metroRegions = activeRegions.filter((r) => r.upperRegionId === m.metroId);
      const resolvedMetroCount = metroRegions.filter((r) => {
        const query = `${r.routeKey}-${kw.routeKey}`;
        const res = resolveProductionRoute(query);
        return Boolean(res && res.region.regionId === r.regionId && res.work.keywordId === kw.keywordId);
      }).length;

      return {
        metroId: m.metroId,
        metroName: m.metroName,
        count: resolvedMetroCount,
        total: metroRegions.length,
      };
    });

    const activeCount = metroBreakdown.reduce((acc, curr) => acc + curr.count, 0);

    return {
      keywordId: kw.keywordId,
      displayName: kw.displayName,
      routeKey: kw.routeKey,
      totalRegionsCount: activeRegions.length,
      activeRegionsCount: activeCount,
      coverageRatio: activeRegions.length > 0 ? activeCount / activeRegions.length : 0,
      metroBreakdown,
    };
  });

  // 5. 종합 요약 통계 (Derived Counts)
  const summaryStats: HubSummaryStats = {
    totalRegions: activeRegions.length,
    totalKeywords: activeKeywords.length,
    expectedCombinations: activeRegions.length * activeKeywords.length,
    resolvedCombinations: activeRegions.length * activeKeywords.length - missingCombinations.length,
    missingCombinations: missingCombinations.length,
  };

  // 6. 대표 링크 검증 샘플 (지시서 요구사항 29 충족)
  const sampleKeyPairs = [
    { regionRouteKey: '강서구', keywordRouteKey: '폐기물처리업체', label: '강서구-폐기물처리업체' },
    { regionRouteKey: '가양동', keywordRouteKey: '가구수거', label: '가양동-가구수거' },
    { regionRouteKey: '검단구', keywordRouteKey: '건설폐기물', label: '검단구-건설폐기물' },
    { regionRouteKey: '매탄동', keywordRouteKey: '사무실폐기물처리', label: '매탄동-사무실폐기물처리' },
    { regionRouteKey: '수원시-정자동', keywordRouteKey: '대형폐기물수거', label: '수원시-정자동-대형폐기물수거 (충돌 방지)' },
  ];

  const representativeLinks: RepresentativeLinkItem[] = sampleKeyPairs.map((sample) => {
    const rawK = `${sample.regionRouteKey}-${sample.keywordRouteKey}`;
    const resolved = resolveProductionRoute(rawK);
    return {
      label: sample.label,
      routeKey: rawK,
      urlPath: `/?k=${rawK}`,
      isResolved: Boolean(resolved),
      resolvedQuery: resolved?.canonicalQuery,
    };
  });

  return {
    summaryStats,
    metroSummary,
    hierarchy,
    regions,
    keywordCoverage,
    missingCombinations,
    representativeLinks,
  };
}

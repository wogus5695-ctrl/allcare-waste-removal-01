import { SUWON_REGIONS } from '@/data/regions/suwon';
import { ALL_KEYWORDS } from '@/data/keywords';
import { RegionEntity } from '@/types/region';
import { ServiceFamily } from '@/types/service-family';
import { getAbsoluteUrl } from '@/config/site';
import { isServiceRegionActive } from '@/config/service-region-policy';

/** 내부 운영 Chunk 크기 기준 (10,000 URLs) */
export const SITEMAP_CHUNK_SIZE = 10000;

export interface IndexableUrlEntry {
  /** 사이트 내부 상대 경로 (예: '/', '/hub', '/?k=수원시-폐기물처리업체') */
  readonly path: string;
  /** 검색엔진 수집용 절대 Canonical URL */
  readonly url: string;
  /** 정적/동적 분류 */
  readonly type: 'ROOT' | 'HUB' | 'DYNAMIC';
  /** 소속 서비스 계열 */
  readonly serviceFamily?: ServiceFamily;
  /** 광역 행정구역 식별자 */
  readonly metroRegion?: string;
  /** 우선순위 (0.0 ~ 1.0) */
  readonly priority: number;
  /** 변경 주기 */
  readonly changeFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface SitemapIndexEntry {
  /** 파일명 (예: 'core.xml', 'waste-gyeonggi-001.xml') */
  readonly filename: string;
  /** 절대 URL (예: 'https://DOMAIN/sitemaps/core.xml') */
  readonly loc: string;
  /** 해당 Child Sitemap 내 URL 수 */
  readonly urlCount: number;
}

export interface ChildSitemapChunk {
  readonly filename: string;
  readonly serviceFamily?: ServiceFamily;
  readonly metroRegion?: string;
  readonly chunkNumber: number;
  readonly entries: readonly IndexableUrlEntry[];
}

/**
 * RegionEntity로부터 metroRegion 식별자 추출 (예: 'gyeonggi', 'seoul', 'incheon')
 */
export function getMetroRegion(region: RegionEntity): string {
  return region.upperRegionId.toLowerCase();
}

/**
 * Core Sitemap 대상 URL 목록 (6개: Root, Service Mains, Hubs)
 * - / (Brand Main)
 * - /waste (WASTE Service Main)
 * - /demolition (DEMOLITION Service Main)
 * - /hub (Service Hub Directory)
 * - /hub/waste (WASTE Region Hub)
 * - /hub/demolition (DEMOLITION Region Hub)
 */
export function getCoreUrlEntries(): readonly IndexableUrlEntry[] {
  return [
    {
      path: '/',
      url: getAbsoluteUrl('/'),
      type: 'ROOT',
      priority: 1.0,
      changeFrequency: 'weekly',
    },
    {
      path: '/waste',
      url: getAbsoluteUrl('/waste'),
      type: 'ROOT',
      serviceFamily: 'WASTE',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/demolition',
      url: getAbsoluteUrl('/demolition'),
      type: 'ROOT',
      serviceFamily: 'DEMOLITION',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/hub',
      url: getAbsoluteUrl('/hub'),
      type: 'HUB',
      priority: 0.8,
      changeFrequency: 'weekly',
    },
    {
      path: '/hub/waste',
      url: getAbsoluteUrl('/hub/waste'),
      type: 'HUB',
      serviceFamily: 'WASTE',
      priority: 0.8,
      changeFrequency: 'weekly',
    },
    {
      path: '/hub/demolition',
      url: getAbsoluteUrl('/hub/demolition'),
      type: 'HUB',
      serviceFamily: 'DEMOLITION',
      priority: 0.8,
      changeFrequency: 'weekly',
    },
  ];
}

/**
 * Dynamic 색인 대상 URL 목록 추출
 * - 활성화된 키워드(isActive=true) 및 서비스별 지역 정책(isServiceRegionActive=true) 동시 만족 대상만 선별
 * - 현재 WASTE: 60 Region × 14 Keyword = 840 URLs
 * - 현재 DEMOLITION: 0 URLs
 */
export function getDynamicUrlEntries(): readonly IndexableUrlEntry[] {
  const eligibleRegions = SUWON_REGIONS.filter(
    (r) => r.isActive && r.isIndexable && r.isSitemapEligible
  );

  const eligibleKeywords = ALL_KEYWORDS.filter(
    (w) => w.isActive && w.isIndexable
  );

  const entries: IndexableUrlEntry[] = [];

  for (const region of eligibleRegions) {
    const metro = getMetroRegion(region);
    for (const keyword of eligibleKeywords) {
      if (!isServiceRegionActive(keyword.serviceFamily, region.regionId)) {
        continue;
      }

      const path = `/?k=${region.routeKey}-${keyword.routeKey}`;
      entries.push({
        path,
        url: getAbsoluteUrl(path),
        type: 'DYNAMIC',
        serviceFamily: keyword.serviceFamily,
        metroRegion: metro,
        priority: region.regionType === 'SI' ? 0.9 : region.regionType === 'GU' ? 0.8 : 0.7,
        changeFrequency: 'weekly',
      });
    }
  }

  return entries;
}

/**
 * 전체 색인 대상 URL 추출 엔진 (하위 호환 및 통합 무결성 검증용, 총 842개)
 */
export function getIndexableUrlEntries(): readonly IndexableUrlEntry[] {
  return [...getCoreUrlEntries(), ...getDynamicUrlEntries()];
}

/**
 * 단순 절대 URL 문자열 목록 반환 (Sitemap/검증용)
 */
export function getIndexableUrls(): readonly string[] {
  return getIndexableUrlEntries().map((e) => e.url);
}

/**
 * serviceFamily 및 metroRegion 기반 그룹핑 및 10,000 단위 자동 Chunking 엔진
 */
export function buildSitemapChunks(
  dynamicEntries: readonly IndexableUrlEntry[] = getDynamicUrlEntries(),
  chunkSize: number = SITEMAP_CHUNK_SIZE
): ChildSitemapChunk[] {
  // 1. Group by `${serviceFamily.toLowerCase()}-${metroRegion.toLowerCase()}`
  const groupMap = new Map<string, IndexableUrlEntry[]>();

  for (const entry of dynamicEntries) {
    if (!entry.serviceFamily || !entry.metroRegion) continue;
    const groupKey = `${entry.serviceFamily.toLowerCase()}-${entry.metroRegion.toLowerCase()}`;
    const list = groupMap.get(groupKey) || [];
    list.push(entry);
    groupMap.set(groupKey, list);
  }

  const chunks: ChildSitemapChunk[] = [];

  // 2. 각 그룹별로 chunkSize(10,000) 단위 자동 분할
  for (const [groupKey, entries] of groupMap.entries()) {
    if (entries.length === 0) continue; // 빈 그룹 제외

    const totalChunks = Math.ceil(entries.length / chunkSize);
    for (let i = 0; i < totalChunks; i++) {
      const chunkNumber = i + 1;
      const chunkNumberStr = String(chunkNumber).padStart(3, '0');
      const filename = `${groupKey}-${chunkNumberStr}.xml`;
      const chunkEntries = entries.slice(i * chunkSize, (i + 1) * chunkSize);

      chunks.push({
        filename,
        serviceFamily: entries[0].serviceFamily,
        metroRegion: entries[0].metroRegion,
        chunkNumber,
        entries: chunkEntries,
      });
    }
  }

  return chunks;
}

/**
 * 전체 Child Sitemap Map 생성 (core.xml + dynamic chunks)
 */
export function getChildSitemapsMap(
  chunkSize: number = SITEMAP_CHUNK_SIZE
): Map<string, readonly IndexableUrlEntry[]> {
  const map = new Map<string, readonly IndexableUrlEntry[]>();

  // 1. core.xml 등록
  map.set('core.xml', getCoreUrlEntries());

  // 2. 동적 chunk 등록 (예: waste-gyeonggi-001.xml)
  const chunks = buildSitemapChunks(getDynamicUrlEntries(), chunkSize);
  for (const chunk of chunks) {
    map.set(chunk.filename, chunk.entries);
  }

  return map;
}

/**
 * Root Sitemap Index 목록 반환
 */
export function getRootSitemapIndexEntries(
  chunkSize: number = SITEMAP_CHUNK_SIZE
): readonly SitemapIndexEntry[] {
  const childMap = getChildSitemapsMap(chunkSize);
  const indexEntries: SitemapIndexEntry[] = [];

  for (const [filename, entries] of childMap.entries()) {
    indexEntries.push({
      filename,
      loc: getAbsoluteUrl(`/sitemaps/${filename}`),
      urlCount: entries.length,
    });
  }

  return indexEntries;
}

/**
 * Root Sitemap Index XML 문자열 생성 (/sitemap.xml)
 */
export function generateRootSitemapIndexXml(
  chunkSize: number = SITEMAP_CHUNK_SIZE
): string {
  const indexEntries = getRootSitemapIndexEntries(chunkSize);

  const sitemapsXml = indexEntries
    .map(
      (entry) => `  <sitemap>
    <loc>${entry.loc}</loc>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>
`;
}

/**
 * Child Sitemap URLSet XML 문자열 생성 (/sitemaps/[name])
 */
export function generateChildUrlSetXml(
  entries: readonly IndexableUrlEntry[]
): string {
  const urlsXml = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
}

/**
 * Child Sitemap 요청 시 파일명 기반 XML 반환 (존재하지 않으면 null -> 404)
 */
export function getChildSitemapXml(
  filename: string,
  chunkSize: number = SITEMAP_CHUNK_SIZE
): string | null {
  const childMap = getChildSitemapsMap(chunkSize);
  const entries = childMap.get(filename);
  if (!entries || entries.length === 0) {
    return null;
  }
  return generateChildUrlSetXml(entries);
}

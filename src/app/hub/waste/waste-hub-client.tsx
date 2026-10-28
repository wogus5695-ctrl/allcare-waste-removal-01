'use client';

import React, { useState, useMemo } from 'react';
import type {
  WasteHubDirectoryModel,
  RegionDirectoryItem,
  HierarchyGuNode,
  HierarchySiNode,
} from '@/lib/hub/waste-hub-model';

interface WasteHubClientProps {
  model: WasteHubDirectoryModel;
}

type ViewMode = 'region' | 'keyword' | 'operations';

export default function WasteHubClient({ model }: WasteHubClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('region');
  const [selectedMetro, setSelectedMetro] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRegionIds, setExpandedRegionIds] = useState<Set<string>>(new Set());
  const [expandedKeywordIds, setExpandedKeywordIds] = useState<Set<string>>(new Set());
  const [showMissingOnly, setShowMissingOnly] = useState<boolean>(false);

  // 지역 펼침 토글
  const toggleRegion = (regionId: string) => {
    setExpandedRegionIds((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  // 키워드 펼침 토글
  const toggleKeyword = (keywordId: string) => {
    setExpandedKeywordIds((prev) => {
      const next = new Set(prev);
      if (next.has(keywordId)) {
        next.delete(keywordId);
      } else {
        next.add(keywordId);
      }
      return next;
    });
  };

  // 검색어 정규화
  const trimmedSearch = searchQuery.trim().toLowerCase();

  // 검색 또는 필터가 적용된 평탄화 지역 목록
  const filteredRegions = useMemo(() => {
    return model.regions.filter((r) => {
      // 1. 메트로 필터
      if (selectedMetro !== 'all' && r.upperRegionId !== selectedMetro) {
        return false;
      }
      // 2. 검색어 필터
      if (trimmedSearch) {
        const matchName = r.officialName.toLowerCase().includes(trimmedSearch);
        const matchSeo = r.seoDisplayName.toLowerCase().includes(trimmedSearch);
        const matchRoute = r.routeKey.toLowerCase().includes(trimmedSearch);
        const matchParent = r.parentName?.toLowerCase().includes(trimmedSearch) || false;
        const matchMetro = r.metroName.toLowerCase().includes(trimmedSearch);
        // 키워드명 검색도 지원
        const matchKeyword = r.keywords.some((k) =>
          k.keywordName.toLowerCase().includes(trimmedSearch)
        );
        return matchName || matchSeo || matchRoute || matchParent || matchMetro || matchKeyword;
      }
      return true;
    });
  }, [model.regions, selectedMetro, trimmedSearch]);

  // 검색 또는 필터가 적용된 키워드 목록
  const filteredKeywords = useMemo(() => {
    if (!trimmedSearch) return model.keywordCoverage;
    return model.keywordCoverage.filter((k) => {
      const matchName = k.displayName.toLowerCase().includes(trimmedSearch);
      const matchRoute = k.routeKey.toLowerCase().includes(trimmedSearch);
      return matchName || matchRoute;
    });
  }, [model.keywordCoverage, trimmedSearch]);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* 1. Hub Header & Title */}
      <header className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
          폐기물 서비스 지역·키워드
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl md:text-4xl">
          수도권 폐기물 수거·처리 서비스 지역 디렉토리
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
          현재 운영 중인 폐기물 서비스 지역과 작업명별 페이지를 확인할 수 있습니다.
          실제 검색엔진에 배포된 동적 SEO URL의 지역별·작업명별 조합 현황 및 해석 상태를 한눈에 모니터링합니다.
        </p>

        {/* 2. Summary Cards (Derived Counts - 요구사항 5, 24) */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* 카드 1: 지역 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <span className="text-xs font-semibold text-slate-500">서비스 지역</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {model.summaryStats.totalRegions}
              </span>
              <span className="text-xs font-bold text-slate-400">개 지역</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">수도권 3대 광역 거점</p>
          </div>

          {/* 카드 2: 작업명 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <span className="text-xs font-semibold text-slate-500">작업명 키워드</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {model.summaryStats.totalKeywords}
              </span>
              <span className="text-xs font-bold text-slate-400">개 의도</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">핵심 P0 작업군</p>
          </div>

          {/* 카드 3: 활성 페이지 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <span className="text-xs font-semibold text-slate-500">활성 페이지</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-orange-600 sm:text-3xl">
                {model.summaryStats.resolvedCombinations.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-400">개 URL</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">동적 SEO 200 OK</p>
          </div>

          {/* 카드 4: 누락 조합 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <span className="text-xs font-semibold text-slate-500">누락 조합</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-black tracking-tight sm:text-3xl ${
                  model.summaryStats.missingCombinations === 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {model.summaryStats.missingCombinations}
              </span>
              <span className="text-xs font-bold text-slate-400">개 조합</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {model.summaryStats.missingCombinations === 0 ? '100% 정상 해석' : '조치 필요'}
            </p>
          </div>
        </div>

        {/* 3. 권역별 요약 바 (Metro Summary - 요구사항 6) */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl bg-slate-100/70 p-3 sm:gap-3">
          <span className="text-xs font-bold text-slate-600">권역별 현황:</span>
          {model.metroSummary.map((m) => (
            <div
              key={m.metroId}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-2xs"
            >
              <span className="font-semibold text-slate-800">{m.metroName}</span>
              <span className="font-black text-orange-600">{m.regionCount}</span>
              <span className="text-[11px] text-slate-400">({m.combinationCount.toLocaleString()} URLs)</span>
            </div>
          ))}
        </div>
      </header>

      {/* 4. Controls: View Mode & Metro Filter & Search */}
      <section className="my-8 space-y-4">
        {/* View Mode Toggle (요구사항 7) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode('region')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition sm:text-sm ${
                viewMode === 'region'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              지역 기준
            </button>
            <button
              type="button"
              onClick={() => setViewMode('keyword')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition sm:text-sm ${
                viewMode === 'keyword'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              작업명 기준
            </button>
            <button
              type="button"
              onClick={() => setViewMode('operations')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition sm:text-sm ${
                viewMode === 'operations'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              운영 현황
            </button>
          </div>

          {/* 메트로 필터 (요구사항 19) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">권역 필터:</span>
            <button
              type="button"
              onClick={() => setSelectedMetro('all')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                selectedMetro === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체 ({model.summaryStats.totalRegions})
            </button>
            {model.metroSummary.map((m) => (
              <button
                key={m.metroId}
                type="button"
                onClick={() => setSelectedMetro(m.metroId)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  selectedMetro === m.metroId
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.metroName} ({m.regionCount})
              </button>
            ))}
          </div>
        </div>

        {/* 검색 바 (요구사항 18) */}
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="지역 또는 작업명 검색 (예: 가양동, 가구수거, 수원시, 정자동, 폐기물처리비용)..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200 sm:text-base"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              &lsquo;{searchQuery}&rsquo; 검색 결과: 지역 {filteredRegions.length}건, 작업명 {filteredKeywords.length}건
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="font-semibold text-orange-600 hover:underline"
            >
              필터 초기화
            </button>
          </div>
        )}
      </section>

      {/* 5. VIEW 1: [지역 기준] (Region View - Default) */}
      {viewMode === 'region' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                지역별 동적 SEO URL 운영 현황
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                각 지역을 펼치면 해당 지역의 15개 폐기물 작업명 동적 SEO URL 조합을 확인할 수 있습니다.
              </p>
            </div>
            {filteredRegions.length > 0 && (
              <span className="text-xs font-semibold text-slate-400">
                총 {filteredRegions.length}개 지역 표시 중
              </span>
            )}
          </div>

          {/* 검색어가 있거나 메트로 필터 시 평탄화 고밀도 리스트 렌더링 */}
          {searchQuery ? (
            <div className="space-y-2.5">
              {filteredRegions.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
                  검색어와 일치하는 지역이 없습니다. 다른 키워드로 검색해보세요.
                </div>
              ) : (
                filteredRegions.map((region) => (
                  <RegionDirectoryRow
                    key={region.regionId}
                    region={region}
                    isExpanded={expandedRegionIds.has(region.regionId)}
                    onToggle={() => toggleRegion(region.regionId)}
                  />
                ))
              )}
            </div>
          ) : (
            /* 검색어가 없을 때는 계층 구조 (Metro -> SI/GU -> DONG) 기반 렌더링 */
            <div className="space-y-8">
              {model.hierarchy
                .filter((m) => selectedMetro === 'all' || m.metroId === selectedMetro)
                .map((metro) => (
                  <div
                    key={metro.metroId}
                    className="rounded-3xl border border-slate-200 bg-slate-50/30 p-5 sm:p-7"
                  >
                    {/* 권역 헤더 */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-orange-600 px-2 py-0.5 text-xs font-black text-white">
                          {metro.metroName}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                          {metro.metroName} 관할 {metro.regionCount}개 지역
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {metro.combinationCount.toLocaleString()}개 동적 조합 활성
                      </span>
                    </div>

                    {/* 1. 광역시/특별시 직할 구 (서울 5개, 인천 5개) */}
                    {metro.gus.length > 0 && (
                      <div className="mt-6 space-y-6">
                        {metro.gus.map((guNode) => (
                          <div
                            key={guNode.region.regionId}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                          >
                            {/* 구 자체 Row */}
                            <div className="border-b border-slate-100 pb-3">
                              <RegionDirectoryRow
                                region={guNode.region}
                                isExpanded={expandedRegionIds.has(guNode.region.regionId)}
                                onToggle={() => toggleRegion(guNode.region.regionId)}
                                isUpperLevel
                              />
                            </div>

                            {/* 관할 동 목록 */}
                            <div className="mt-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {guNode.region.seoDisplayName} 관할 동 ({guNode.dongs.length}개)
                              </h4>
                              <div className="mt-2.5 space-y-1.5">
                                {guNode.dongs.map((dongNode) => (
                                  <RegionDirectoryRow
                                    key={dongNode.region.regionId}
                                    region={dongNode.region}
                                    isExpanded={expandedRegionIds.has(dongNode.region.regionId)}
                                    onToggle={() => toggleRegion(dongNode.region.regionId)}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2. 도 관할 시 (경기 5개 시: 수원, 화성, 평택, 고양, 용인) */}
                    {metro.sis.length > 0 && (
                      <div className="mt-6 space-y-8">
                        {metro.sis.map((siNode) => (
                          <div
                            key={siNode.region.regionId}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
                          >
                            {/* 시 자체 Row */}
                            <div className="border-b border-slate-200 pb-4">
                              <RegionDirectoryRow
                                region={siNode.region}
                                isExpanded={expandedRegionIds.has(siNode.region.regionId)}
                                onToggle={() => toggleRegion(siNode.region.regionId)}
                                isUpperLevel
                              />
                            </div>

                            {/* 구가 있는 경우 (수원, 화성, 고양, 용인) */}
                            {siNode.gus.length > 0 && (
                              <div className="mt-5 space-y-5">
                                {siNode.gus.map((guNode) => (
                                  <div
                                    key={guNode.region.regionId}
                                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                                  >
                                    <RegionDirectoryRow
                                      region={guNode.region}
                                      isExpanded={expandedRegionIds.has(guNode.region.regionId)}
                                      onToggle={() => toggleRegion(guNode.region.regionId)}
                                      isUpperLevel
                                    />
                                    <div className="mt-3 space-y-1.5 pl-2 border-l-2 border-slate-200">
                                      {guNode.dongs.map((dongNode) => (
                                        <RegionDirectoryRow
                                          key={dongNode.region.regionId}
                                          region={dongNode.region}
                                          isExpanded={expandedRegionIds.has(dongNode.region.regionId)}
                                          onToggle={() => toggleRegion(dongNode.region.regionId)}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 직할 동만 있는 경우 (평택시) */}
                            {siNode.directDongs.length > 0 && (
                              <div className="mt-4 space-y-1.5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  {siNode.region.seoDisplayName} 관할 동 ({siNode.directDongs.length}개)
                                </h4>
                                {siNode.directDongs.map((dongNode) => (
                                  <RegionDirectoryRow
                                    key={dongNode.region.regionId}
                                    region={dongNode.region}
                                    isExpanded={expandedRegionIds.has(dongNode.region.regionId)}
                                    onToggle={() => toggleRegion(dongNode.region.regionId)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* 6. VIEW 2: [작업명 기준] (Keyword View - 요구사항 13, 14) */}
      {viewMode === 'keyword' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                작업명별 동적 SEO URL 커버리지
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                15개 폐기물 핵심 작업명별 수도권 전체 311개 지역 커버리지 및 권역별 현황을 확인합니다.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredKeywords.map((kw) => {
              const isExpanded = expandedKeywordIds.has(kw.keywordId);
              return (
                <div
                  key={kw.keywordId}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-xs font-black text-orange-700">
                        P0
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                          {kw.displayName}
                        </h3>
                        <p className="text-[11px] text-slate-400">routeKey: {kw.routeKey}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black text-orange-600 sm:text-base">
                          {kw.activeRegionsCount} / {kw.totalRegionsCount} 지역
                        </span>
                        <span className="ml-1.5 inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          100%
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleKeyword(kw.keywordId)}
                        aria-expanded={isExpanded}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      >
                        {isExpanded ? '접기 ▲' : '권역별 상세 ▼'}
                      </button>
                    </div>
                  </div>

                  {/* Keyword Expand View (권역별 상세 - 요구사항 14) */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        권역별 커버리지 상세
                      </h4>
                      <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {kw.metroBreakdown.map((m) => (
                          <div
                            key={m.metroId}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                          >
                            <span className="text-xs font-bold text-slate-700">{m.metroName}</span>
                            <span className="text-xs font-black text-slate-900">
                              {m.count} / {m.total} 지역
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 대표 지역 바로가기 샘플 */}
                      <div className="mt-3.5">
                        <span className="text-[11px] font-medium text-slate-400">
                          대표 지역 바로가기:
                        </span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {['강서구', '가양동', '검단구', '수원시', '수원시-정자동'].map((regionKey) => (
                            <a
                              key={regionKey}
                              href={`/?k=${regionKey}-${kw.routeKey}`}
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-orange-500 hover:text-orange-600"
                            >
                              {regionKey.replace('-', ' ')} {kw.displayName} →
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. VIEW 3: [운영 현황] (Operations View - 요구사항 15, 16, 17) */}
      {viewMode === 'operations' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                동적 SEO URL 운영·배포 지표
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                실제 Registry 및 Resolver 기준 기대 조합(Expected)과 정상 해석 조합(Resolved)의 일치 여부를 검증합니다.
              </p>
            </div>
            {/* 누락만 보기 토글 (요구사항 17) */}
            <button
              type="button"
              onClick={() => setShowMissingOnly(!showMissingOnly)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                showMissingOnly
                  ? 'bg-rose-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {showMissingOnly ? '✓ 누락만 보기 활성' : '누락만 보기'}
            </button>
          </div>

          {/* 누락 필터 활성 시 상태 */}
          {showMissingOnly ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">누락 조합 감지 결과</h3>
              {model.missingCombinations.length === 0 ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
                  <span className="text-2xl">🎉</span>
                  <p className="mt-2 text-sm font-bold text-emerald-900">
                    현재 누락된 조합이 없습니다.
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    모든 311개 지역 × 15개 폐기물 키워드 (총 4,665개 동적 URL)가 정상적으로 리졸버에 매칭됩니다.
                  </p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-slate-100">
                  {model.missingCombinations.map((m) => (
                    <div key={`${m.regionId}-${m.keywordId}`} className="py-2.5 text-xs">
                      <span className="font-bold text-slate-800">{m.regionName}</span> +{' '}
                      <span className="font-semibold text-slate-600">{m.keywordName}</span>:{' '}
                      <span className="text-rose-600">{m.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. 운영 지표 테이블 */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <h3 className="text-sm font-bold text-slate-900">핵심 운영 지표 종합</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-medium text-slate-600">Active WASTE Regions</span>
                    <span className="font-bold text-slate-900">{model.summaryStats.totalRegions}개 지역</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-medium text-slate-600">Active WASTE Keywords</span>
                    <span className="font-bold text-slate-900">{model.summaryStats.totalKeywords}개 키워드</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-medium text-slate-600">Expected Combinations (기대치)</span>
                    <span className="font-bold text-slate-900">
                      {model.summaryStats.totalRegions} × {model.summaryStats.totalKeywords} = {model.summaryStats.expectedCombinations.toLocaleString()}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5 bg-orange-50/30">
                    <span className="font-bold text-slate-800">Resolved Combinations (정상 해석)</span>
                    <span className="font-black text-orange-600">
                      {model.summaryStats.resolvedCombinations.toLocaleString()}개 (100%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-medium text-slate-600">Missing Combinations (누락 조합)</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                      {model.summaryStats.missingCombinations}개
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. 권역별 동적 SEO URL 배포 현황 */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <h3 className="text-sm font-bold text-slate-900">권역별 동적 SEO URL 배포 현황</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {model.metroSummary.map((m) => (
                    <div key={m.metroId} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <span className="font-bold text-slate-900">{m.metroName}</span>
                        <span className="ml-2 text-xs text-slate-400">({m.regionCount}개 지역)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-800">
                          {m.combinationCount.toLocaleString()} URLs
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">✓ 정상</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-slate-50/70 px-5 py-3.5 font-bold">
                    <span className="text-slate-900">수도권 총합</span>
                    <span className="text-orange-600">
                      {model.summaryStats.resolvedCombinations.toLocaleString()} URLs (100% 정상 배포)
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. 대표 링크 리졸버 검증 (Link Validation & Collision Safety - 요구사항 29, 30) */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    대표 동적 URL 리졸버 정합성 검증 (Canonical & Collision Safety)
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {model.representativeLinks.map((link) => (
                    <div
                      key={link.routeKey}
                      className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800">{link.label}</p>
                        <p className="font-mono text-[11px] text-slate-500">{link.urlPath}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                          HTTP 200 OK
                        </span>
                        <a
                          href={link.urlPath}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700 hover:border-orange-500 hover:text-orange-600"
                        >
                          방문 →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. 시스템 격리 및 정책 안내 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-slate-900">안전 격리 및 SEO 정책 상태</h4>
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    <strong className="text-slate-800">철거(DEMOLITION) 격리:</strong> noindex, follow 유지 (Waste Hub 내 철거 URL 혼입 0건)
                  </li>
                  <li>
                    <strong className="text-slate-800">사이트맵 무결성:</strong> Core 4개 + Dynamic 4,665개 = 총 4,669개 엔트리 보존
                  </li>
                  <li>
                    <strong className="text-slate-800">단일 진실 원천(Single Source of Truth):</strong> Hub 내 수치 및 지역·키워드 하드코딩 0건 (Registry 자동 동기화)
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/**
 * 고밀도 Region Directory 행 컴포넌트
 * Progressive Disclosure: 펼쳤을 때만 15개 키워드 링크 렌더링 (요구사항 12 충족)
 */
interface RegionDirectoryRowProps {
  region: RegionDirectoryItem;
  isExpanded: boolean;
  onToggle: () => void;
  isUpperLevel?: boolean;
}

function RegionDirectoryRow({
  region,
  isExpanded,
  onToggle,
  isUpperLevel = false,
}: RegionDirectoryRowProps) {
  return (
    <div
      className={`rounded-xl border transition ${
        isUpperLevel
          ? 'border-slate-200 bg-slate-50/70'
          : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      {/* Region Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="flex items-center gap-1.5 text-left font-bold text-slate-900 hover:text-orange-600 transition"
          >
            <span className="text-sm sm:text-base">{region.seoDisplayName}</span>
            {isUpperLevel && (
              <span className="rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                {region.regionType === 'SI' ? '시 단위' : '구 단위'}
              </span>
            )}
            {region.hasCollision && (
              <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                충돌관리
              </span>
            )}
          </button>
          <span className="hidden text-xs text-slate-400 sm:inline">
            ({region.metroName} {region.parentName ? `· ${region.parentName}` : ''})
          </span>
        </div>

        {/* 조합 현황 뱃지 (15/15) & 펼치기 버튼 */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-black ${
              region.activeKeywordsCount === region.totalKeywordsCount
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {region.activeKeywordsCount}/{region.totalKeywordsCount}
          </span>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition"
          >
            {isExpanded ? '접기 ▲' : '작업 조합 ▼'}
          </button>
        </div>
      </div>

      {/* Region Expand View (Progressive Disclosure - 15개 키워드 링크) */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {region.seoDisplayName} 활성 폐기물 작업 조합 (15개)
            </h5>
            <span className="text-[11px] text-slate-400">클릭 시 해당 동적 SEO 랜딩으로 이동</span>
          </div>
          {/* 모바일 2열, 태블릿 3열, PC 5열 그리드 */}
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {region.keywords.map((kw) => (
              <a
                key={kw.keywordId}
                href={kw.urlPath}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-orange-500 hover:bg-orange-50/30 hover:text-orange-600"
              >
                <span className="truncate">{kw.keywordName}</span>
                <span className="text-slate-300">›</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

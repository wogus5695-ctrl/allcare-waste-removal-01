import type { Metadata } from 'next';
import { SITE_CONFIG, getAbsoluteUrl } from '@/config/site';
import { SUWON_REGIONS } from '@/data/regions/suwon';
import { RegionEntity } from '@/types/region';

export const metadata: Metadata = {
  title: `수원시 철거·원상복구 서비스 지역 허브 | ${SITE_CONFIG.brandName}`,
  description: `${SITE_CONFIG.brandName} 수원시 전 지역(장안구, 권선구, 팔달구, 영통구 60개 동) 철거·원상복구 공사 및 시공 상담 서비스 지역 안내 허브입니다.`,
  alternates: {
    canonical: getAbsoluteUrl('/hub/demolition'),
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: `수원시 철거·원상복구 서비스 지역 허브 | ${SITE_CONFIG.brandName}`,
    description: `${SITE_CONFIG.brandName} 수원시 전 지역 철거·원상복구 공사 및 시공 상담 서비스 지역 안내 허브입니다.`,
    url: getAbsoluteUrl('/hub/demolition'),
    siteName: SITE_CONFIG.brandName,
    locale: 'ko_KR',
    type: 'website',
  },
};

/**
 * Demolition Service Hub (/hub/demolition)
 * 수원시 4개 구 55개 동 철거·원상복구 전용 계층 탐색 디렉토리
 */
export default function DemolitionHubPage() {
  const siEntity = SUWON_REGIONS.find((r) => r.regionType === 'SI');
  const guList = SUWON_REGIONS.filter((r) => r.regionType === 'GU');
  const dongByParentId = new Map<string, RegionEntity[]>();

  for (const r of SUWON_REGIONS) {
    if (r.regionType === 'DONG' && r.parentRegionId) {
      const existing = dongByParentId.get(r.parentRegionId) || [];
      existing.push(r);
      dongByParentId.set(r.parentRegionId, existing);
    }
  }

  const siQuickServices = [
    { label: '철거업체', key: '철거업체' },
    { label: '상가철거', key: '상가철거' },
    { label: '원상복구', key: '원상복구' },
    { label: '철거비용', key: '철거비용' },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-slate-500">
          <li>
            <a href="/" className="transition hover:text-slate-900">홈</a>
          </li>
          <li>/</li>
          <li>
            <a href="/hub" className="transition hover:text-slate-900">서비스 지역</a>
          </li>
          <li>/</li>
          <li className="font-semibold text-slate-800" aria-current="page">철거·원상복구</li>
        </ol>
      </nav>

      {/* Hub Header */}
      <header className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
          철거·원상복구 지역 안내
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl md:text-4xl">
          수원시 철거·원상복구 서비스 지역 안내
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
          올케어환경은 수원시 4개 일반구(장안구, 권선구, 팔달구, 영통구) 및 관할 전 동 단위 철거·원상복구 시공 상담을 지원합니다.
          아래 지역 목록에서 원하시는 행정구역을 선택하시면 상세 시공 안내 및 견적 기준을 확인하실 수 있습니다.
        </p>
      </header>

      {/* 수원시 전역 대표 서비스 바로가기 */}
      {siEntity && (
        <section className="my-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">
            수원시 전역 대표 철거 서비스
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            수원시 전 지역을 대상으로 제공되는 핵심 철거·원상복구 서비스 안내입니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {siQuickServices.map((srv) => (
              <a
                key={srv.key}
                href={`/?k=${siEntity.routeKey}-${srv.key}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-orange-500 hover:text-orange-600 sm:text-sm"
              >
                <span>🏗️</span>
                <span>수원시 {srv.label}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 구별 하위 동 디렉토리 그리드 */}
      <div className="space-y-8">
        {guList.map((gu) => {
          const dongs = dongByParentId.get(gu.regionId) || [];

          return (
            <section
              key={gu.regionId}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    {gu.seoDisplayName}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    관할 {dongs.length}개 동 단위 철거·원상복구 안내
                  </p>
                </div>
                <a
                  href={`/?k=${gu.routeKey}-철거업체`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline sm:text-sm"
                >
                  <span>{gu.seoDisplayName} 대표 철거 안내</span>
                  <span>→</span>
                </a>
              </div>

              {/* 관할 동 링크 그리드 */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  동별 철거 서비스 안내 바로가기
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                  {dongs.map((dong) => (
                    <a
                      key={dong.regionId}
                      href={`/?k=${dong.routeKey}-철거업체`}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:text-sm"
                    >
                      <span>{dong.seoDisplayName}</span>
                      <span className="text-slate-300">›</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

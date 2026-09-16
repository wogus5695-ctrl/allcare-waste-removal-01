import type { Metadata } from 'next';
import { SITE_CONFIG, getAbsoluteUrl } from '@/config/site';
import { PRODUCTION_REGIONS } from '@/data/regions';
import { RegionEntity } from '@/types/region';

export const metadata: Metadata = {
  title: `수도권 폐기물 수거 서비스 지역 허브 | ${SITE_CONFIG.brandName}`,
  description: `${SITE_CONFIG.brandName} 수도권(서울 67개 지역, 인천 56개 지역, 경기 188개 지역 등 총 311개 지역) 폐기물 수거 및 현장 정리 서비스 안내 허브입니다.`,
  alternates: {
    canonical: getAbsoluteUrl('/hub/waste'),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `수도권 폐기물 수거 서비스 지역 허브 | ${SITE_CONFIG.brandName}`,
    description: `${SITE_CONFIG.brandName} 수도권 전 지역 폐기물 수거 및 현장 정리 서비스 지역 안내 허브입니다.`,
    url: getAbsoluteUrl('/hub/waste'),
    siteName: SITE_CONFIG.brandName,
    locale: 'ko_KR',
    type: 'website',
  },
};

/**
 * Waste Service Hub (/hub/waste)
 * 서울 5개 자치구(67개), 인천 5개 자치구(56개), 경기 5개 시(188개) 등 총 311개 활성 지역 폐기물 수거 전용 계층 탐색 디렉토리
 */
export default function WasteHubPage() {
  const activeRegions = PRODUCTION_REGIONS.filter((r) => r.isHubEligible);

  // 1. 서울 5개 자치구
  const seoulGus = activeRegions.filter((r) => r.upperRegionId === 'seoul' && r.regionType === 'GU');
  const seoulDongsByGu = new Map<string, RegionEntity[]>();
  for (const r of activeRegions) {
    if (r.regionType === 'DONG' && r.parentRegionId && seoulGus.some((g) => g.regionId === r.parentRegionId)) {
      const list = seoulDongsByGu.get(r.parentRegionId) || [];
      list.push(r);
      seoulDongsByGu.set(r.parentRegionId, list);
    }
  }

  // 2. 인천 5개 자치구
  const incheonGus = activeRegions.filter((r) => r.upperRegionId === 'incheon' && r.regionType === 'GU');
  const incheonDongsByGu = new Map<string, RegionEntity[]>();
  for (const r of activeRegions) {
    if (r.regionType === 'DONG' && r.parentRegionId && incheonGus.some((g) => g.regionId === r.parentRegionId)) {
      const list = incheonDongsByGu.get(r.parentRegionId) || [];
      list.push(r);
      incheonDongsByGu.set(r.parentRegionId, list);
    }
  }

  // 3. 경기도 5개 시 (수원시, 화성시, 평택시, 고양시, 용인시)
  const gyeonggiCities = [
    {
      id: 'gg-suwon',
      name: '수원시',
      badge: '수원시 전역',
      desc: '장안구, 권선구, 팔달구, 영통구 60개 지역 폐기물 수거 디렉토리입니다.',
    },
    {
      id: 'gg-hs',
      name: '화성시',
      badge: '화성시 전역',
      desc: '만세구, 효행구, 병점구, 동탄구 30개 지역 폐기물 수거 디렉토리입니다.',
    },
    {
      id: 'gg-pt',
      name: '평택시',
      badge: '평택시 전역',
      desc: '비전동, 동삭동, 고덕동 등 관할 20개 지역 폐기물 수거 디렉토리입니다.',
    },
    {
      id: 'gg-gy',
      name: '고양시',
      badge: '고양시 전역',
      desc: '덕양구, 일산동구, 일산서구 44개 지역 폐기물 수거 디렉토리입니다.',
    },
    {
      id: 'gg-yi',
      name: '용인시',
      badge: '용인시 전역',
      desc: '처인구, 기흥구, 수지구 34개 지역 폐기물 수거 디렉토리입니다.',
    },
  ];

  const siQuickServices = [
    { label: '폐기물처리업체', key: '폐기물처리업체' },
    { label: '폐기물수거', key: '폐기물수거' },
    { label: '가정폐기물처리', key: '가정폐기물처리' },
    { label: '폐기물처리비용', key: '폐기물처리비용' },
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
          <li className="font-semibold text-slate-800" aria-current="page">폐기물 수거</li>
        </ol>
      </nav>

      {/* Hub Header */}
      <header className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
          폐기물 수거 서비스 지역 안내
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl md:text-4xl">
          수도권 폐기물 수거·처리 서비스 지역 디렉토리
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
          올케어환경은 수도권 주요 거점(서울 5개 자치구 67개 지역, 인천 5개 자치구 56개 지역, 경기 5개 시 188개 지역 등 총 311개 지역)의
          현장 수거·정리 상담을 전문적으로 지원합니다. 원하시는 지역을 선택하시면 상세 안내를 확인하실 수 있습니다.
        </p>
      </header>

      {/* 서울특별시 5개 자치구 서비스 지역 */}
      <section className="my-8">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">서울특별시</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            서울특별시 5개 자치구 및 관할 동 서비스 안내
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            강서구, 송파구, 서초구, 영등포구, 성동구 67개 지역 폐기물 수거 디렉토리입니다.
          </p>
        </div>

        <div className="space-y-8">
          {seoulGus.map((gu) => {
            const dongs = seoulDongsByGu.get(gu.regionId) || [];

            return (
              <div
                key={gu.regionId}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      {gu.seoDisplayName}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      관할 {dongs.length}개 동 단위 서비스 안내
                    </p>
                  </div>
                  <a
                    href={`/?k=${gu.routeKey}-폐기물처리업체`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline sm:text-sm"
                  >
                    <span>{gu.seoDisplayName} 대표 안내</span>
                    <span>→</span>
                  </a>
                </div>

                {/* 관할 동 링크 그리드 */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    동별 서비스 안내 바로가기
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                    {dongs.map((dong) => (
                      <a
                        key={dong.regionId}
                        href={`/?k=${dong.routeKey}-폐기물처리업체`}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:text-sm"
                      >
                        <span>{dong.seoDisplayName}</span>
                        <span className="text-slate-300">›</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 인천광역시 5개 자치구 서비스 지역 */}
      <section className="my-8">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">인천광역시</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            인천광역시 5개 자치구 및 관할 동 서비스 안내
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            검단구, 서해구, 남동구, 부평구, 미추홀구 56개 지역 폐기물 수거 디렉토리입니다.
          </p>
        </div>

        <div className="space-y-8">
          {incheonGus.map((gu) => {
            const dongs = incheonDongsByGu.get(gu.regionId) || [];

            return (
              <div
                key={gu.regionId}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      {gu.seoDisplayName}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      관할 {dongs.length}개 동 단위 서비스 안내
                    </p>
                  </div>
                  <a
                    href={`/?k=${gu.routeKey}-폐기물처리업체`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline sm:text-sm"
                  >
                    <span>{gu.seoDisplayName} 대표 안내</span>
                    <span>→</span>
                  </a>
                </div>

                {/* 관할 동 링크 그리드 */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    동별 서비스 안내 바로가기
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                    {dongs.map((dong) => (
                      <a
                        key={dong.regionId}
                        href={`/?k=${dong.routeKey}-폐기물처리업체`}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:text-sm"
                      >
                        <span>{dong.seoDisplayName}</span>
                        <span className="text-slate-300">›</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 경기도 5개 시 서비스 지역 */}
      <section className="my-8">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">경기도</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            경기도 5개 시 및 관할 구·동 서비스 안내
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            수원시, 화성시, 평택시, 고양시, 용인시 188개 지역 폐기물 수거 디렉토리입니다.
          </p>
        </div>

        <div className="space-y-12">
          {gyeonggiCities.map((city) => {
            const si = activeRegions.find((r) => r.regionId === city.id);
            if (!si) return null;

            const gus = activeRegions.filter((r) => r.parentRegionId === city.id && r.regionType === 'GU');
            const directDongs = activeRegions.filter((r) => r.parentRegionId === city.id && r.regionType === 'DONG');

            return (
              <div key={city.id} className="rounded-3xl border border-slate-200 bg-slate-50/40 p-6 sm:p-8">
                {/* 시 대표 헤더 */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-orange-100/70 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                      {city.badge}
                    </div>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                      {si.seoDisplayName}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {city.desc}
                    </p>
                  </div>
                  <a
                    href={`/?k=${si.routeKey}-폐기물처리업체`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline sm:text-sm"
                  >
                    <span>{si.seoDisplayName} 대표 안내</span>
                    <span>→</span>
                  </a>
                </div>

                {/* 수원시 특별 퀵서비스 링크 (시 단위 전역 서비스) */}
                {city.id === 'gg-suwon' && (
                  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800">
                      수원시 전역 핵심 서비스 바로가기
                    </h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {siQuickServices.map((srv) => (
                        <a
                          key={srv.key}
                          href={`/?k=${si.routeKey}-${srv.key}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-orange-500 hover:bg-white hover:text-orange-600"
                        >
                          <span>📍</span>
                          <span>수원시 {srv.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 구가 있는 경우 (수원, 화성, 고양, 용인) */}
                {gus.length > 0 && (
                  <div className="mt-6 space-y-6">
                    {gus.map((gu) => {
                      const guDongs = activeRegions.filter(
                        (r) => r.parentRegionId === gu.regionId && r.regionType === 'DONG'
                      );

                      return (
                        <div
                          key={gu.regionId}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                            <div>
                              <h4 className="text-lg font-bold tracking-tight text-slate-900">
                                {gu.seoDisplayName}
                              </h4>
                              <p className="text-xs text-slate-500">
                                관할 {guDongs.length}개 동 단위 폐기물 수거 안내
                              </p>
                            </div>
                            <a
                              href={`/?k=${gu.routeKey}-폐기물처리업체`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline sm:text-sm"
                            >
                              <span>{gu.seoDisplayName} 대표 안내</span>
                              <span>→</span>
                            </a>
                          </div>

                          <div className="mt-4">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              동별 서비스 안내 바로가기
                            </h5>
                            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                              {guDongs.map((dong) => (
                                <a
                                  key={dong.regionId}
                                  href={`/?k=${dong.routeKey}-폐기물처리업체`}
                                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:text-sm"
                                >
                                  <span>{dong.seoDisplayName}</span>
                                  <span className="text-slate-300">›</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 구 없이 시 직할 동만 있는 경우 (평택시) */}
                {directDongs.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      평택시 관할 동별 서비스 안내 바로가기
                    </h4>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {directDongs.map((dong) => (
                        <a
                          key={dong.regionId}
                          href={`/?k=${dong.routeKey}-폐기물처리업체`}
                          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:text-sm"
                        >
                          <span>{dong.seoDisplayName}</span>
                          <span className="text-slate-300">›</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

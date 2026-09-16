import type { Metadata } from 'next';
import { SITE_CONFIG, getAbsoluteUrl } from '@/config/site';

export const metadata: Metadata = {
  title: `서비스 지역 안내 및 탐색 디렉토리 | ${SITE_CONFIG.brandName}`,
  description: `${SITE_CONFIG.brandName}의 폐기물 수거 및 철거·원상복구 서비스 지역을 안내하는 메인 디렉토리입니다.`,
  alternates: {
    canonical: getAbsoluteUrl('/hub'),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `서비스 지역 안내 및 탐색 디렉토리 | ${SITE_CONFIG.brandName}`,
    description: `${SITE_CONFIG.brandName}의 폐기물 수거 및 철거·원상복구 서비스 지역을 안내하는 메인 디렉토리입니다.`,
    url: getAbsoluteUrl('/hub'),
    siteName: SITE_CONFIG.brandName,
    locale: 'ko_KR',
    type: 'website',
  },
};

/**
 * Service Hub Directory (/hub)
 * 폐기물 수거 허브(/hub/waste)와 철거·원상복구 허브(/hub/demolition)로 분기하는 통합 디렉토리
 */
export default function ServiceHubDirectoryPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-slate-500">
          <li>
            <a href="/" className="transition hover:text-slate-900">홈</a>
          </li>
          <li>/</li>
          <li className="font-semibold text-slate-800" aria-current="page">서비스 지역</li>
        </ol>
      </nav>

      {/* Directory Header */}
      <header className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
          서비스 지역 탐색 디렉토리
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl md:text-4xl">
          올케어환경 서비스 지역 디렉토리
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
          올케어환경이 제공하는 폐기물 수거·처리 및 철거·원상복구 서비스의 지역별 안내 창구입니다.
          원하시는 서비스 분야를 선택하시면 관할 구·동 단위의 상세 지역 안내를 확인하실 수 있습니다.
        </p>
      </header>

      {/* Two Hub Cards */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Waste Hub Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-orange-300 hover:shadow-md sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                폐기물 수거·처리
              </span>
              <span className="text-2xl">🚛</span>
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              폐기물 수거 서비스 지역
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              수원시 4개 구(장안구, 권선구, 팔달구, 영통구) 및 55개 동 단위 현장 수거·정리 안내입니다. 가정집 대형 가구부터 이사 폐기물, 사업장 비품까지 관할 지역별 안내를 제공합니다.
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {['대형가구수거', '가정집비움', '이사폐기물', '사무실집기'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <a
              href="/hub/waste"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <span>수원시 폐기물 지역 허브 바로가기</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Demolition Hub Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-orange-300 hover:shadow-md sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                철거·원상복구
              </span>
              <span className="text-2xl">🏗️</span>
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              철거·원상복구 서비스 지역
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              수원시 4개 구(장안구, 권선구, 팔달구, 영통구) 및 55개 동 단위 철거·원상복구 시공 안내입니다. 상가 원상복구, 사무실 가벽 철거, 실내 인테리어 부분 철거 현장 안내를 제공합니다.
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {['상가원상복구', '사무실가벽철거', '실내인테리어철거', '바닥재면처리'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <a
              href="/hub/demolition"
              rel="nofollow"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <span>수원시 철거 지역 허브 바로가기</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Current Service Area Information */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
          서비스 지역 안내
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
          올케어환경은 현재 수원시 전역(장안구, 권선구, 팔달구, 영통구 60개 구·동)을 대상으로 폐기물 수거 및 철거·원상복구 시공 상담을 제공하고 있습니다.
          각 서비스 허브에서 관할 동별 상세 안내를 확인하실 수 있습니다.
        </p>
      </section>
    </main>
  );
}

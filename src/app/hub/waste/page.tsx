import type { Metadata } from 'next';
import { SITE_CONFIG, getAbsoluteUrl } from '@/config/site';
import { buildWasteHubDirectoryModel } from '@/lib/hub/waste-hub-model';
import WasteHubClient from './waste-hub-client';

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
    images: [
      {
        url: getAbsoluteUrl('/images/hero/waste-hero.jpg'),
        width: 1024,
        height: 935,
        alt: '올케어환경 폐기물 수거 및 처리 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `수도권 폐기물 수거 서비스 지역 허브 | ${SITE_CONFIG.brandName}`,
    description: `${SITE_CONFIG.brandName} 수도권 전 지역 폐기물 수거 및 현장 정리 서비스 지역 안내 허브입니다.`,
    images: [getAbsoluteUrl('/images/hero/waste-hero.jpg')],
  },
};

/**
 * Waste Service Hub (/hub/waste)
 * 동적 SEO URL 운영·확장 현황 디렉토리
 * - Single Source of Truth: PRODUCTION_REGIONS (311) × WASTE_P0_KEYWORDS (15) = 4,665 Dynamic URLs
 * - Progressive Disclosure: On-demand Detail Expansion
 */
export default function WasteHubPage() {
  const model = buildWasteHubDirectoryModel();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
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

      {/* Directory Operations Client View */}
      <WasteHubClient model={model} />
    </main>
  );
}

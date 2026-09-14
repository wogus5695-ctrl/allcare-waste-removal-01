import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';

export function Footer() {
  const business = SITE_CONFIG.business;
  const hasBusinessDetails = Boolean(
    business?.companyName ||
    business?.representative ||
    business?.registrationNumber ||
    business?.address
  );

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-slate-600">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Brand & Mission */}
          <div className="max-w-md">
            <Link href="/" className="text-lg font-black text-slate-900">
              {SITE_CONFIG.brandName}
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 break-keep">
              가정집·사업장 폐기물 수거부터 실내 시설물 철거·원상복구까지
              현장 맞춤형 전문 상담 서비스를 제공합니다.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
              <Link href="/waste" className="transition hover:text-orange-600 hover:underline underline-offset-2">
                📦 폐기물 수거 안내
              </Link>
              <span className="text-slate-300">•</span>
              <Link href="/demolition" className="transition hover:text-orange-600 hover:underline underline-offset-2">
                🔨 철거·원상복구 안내
              </Link>
              <span className="text-slate-300">•</span>
              <Link href="/hub" className="transition hover:text-orange-600 hover:underline underline-offset-2">
                📍 수원시 서비스 지역 안내
              </Link>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="text-xs leading-relaxed text-slate-500">
            <h3 className="font-semibold text-slate-700">사업자 정보</h3>
            {hasBusinessDetails ? (
              <ul className="mt-2 space-y-1">
                {business?.companyName && <li>상호명: {business.companyName}</li>}
                {business?.representative && <li>대표자: {business.representative}</li>}
                {business?.registrationNumber && <li>사업자등록번호: {business.registrationNumber}</li>}
                {business?.address && <li>사업장 주소: {business.address}</li>}
              </ul>
            ) : (
              <p className="mt-2 text-slate-400">
                정식 상호 및 사업자 정보는 운영자 등록 완료 후 반영됩니다.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

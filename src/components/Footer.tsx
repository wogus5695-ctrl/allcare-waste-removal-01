import Link from 'next/link';
import Image from 'next/image';
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
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-black text-slate-900 transition hover:opacity-90"
            >
              <Image
                src="/logo.png"
                alt={SITE_CONFIG.brandName}
                width={26}
                height={26}
                className="h-6.5 w-6.5 object-contain"
              />
              <span>{SITE_CONFIG.brandName}</span>
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
            </div>
          </div>

          {/* Business Information Section */}
          <div className="text-xs leading-relaxed text-slate-500">
            <h3 className="font-semibold text-slate-700">사업자 정보</h3>
            {hasBusinessDetails ? (
              <ul className="mt-2 space-y-1">
                {business?.companyName && <li>상호(사업자명): {business.companyName}</li>}
                {business?.representative && <li>대표자: {business.representative}</li>}
                {business?.registrationNumber && <li>사업자등록번호: {business.registrationNumber}</li>}
                {business?.address && <li>사업장 주소: {business.address}</li>}
                {SITE_CONFIG.contact.phone && (
                  <li>
                    문의연락처:{' '}
                    <a
                      href={`tel:${SITE_CONFIG.contact.phone}`}
                      className="font-medium text-slate-700 transition hover:text-orange-600 hover:underline underline-offset-2"
                    >
                      {SITE_CONFIG.contact.phone}
                    </a>
                  </li>
                )}
                {SITE_CONFIG.contact.kakaoUrl && (
                  <li>
                    카카오톡 채널:{' '}
                    <a
                      href={SITE_CONFIG.contact.kakaoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-700 transition hover:text-orange-600 hover:underline underline-offset-2"
                    >
                      채널 바로가기
                    </a>
                  </li>
                )}
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

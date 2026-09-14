import Link from 'next/link';
import { SITE_CONFIG, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';

export function Header() {
  const hasPhone = hasValidContactPhone(SITE_CONFIG.contact.phone);
  const hasKakao = hasValidKakaoUrl(SITE_CONFIG.contact.kakaoUrl);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-900 transition hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            올
          </span>
          <span>{SITE_CONFIG.brandName}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/waste" className="transition hover:text-slate-900">
            폐기물 수거
          </Link>
          <Link href="/demolition" className="transition hover:text-slate-900">
            철거·원상복구
          </Link>
          <Link href="/hub" className="transition hover:text-slate-900">
            서비스 지역
          </Link>
          <a href="#faq" className="transition hover:text-slate-900">
            FAQ/문의
          </a>
        </nav>

        {/* Header Action CTA (과도한 노출 방지: PC 카카오+전화, MO 전화 축소) */}
        <div className="flex items-center gap-2">
          {/* PC Header: 카카오톡 문의 (Primary) */}
          {hasKakao ? (
            <a
              href={SITE_CONFIG.contact.kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex min-h-[38px] items-center justify-center gap-1 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-orange-700"
            >
              <span>💬</span>
              <span>카카오톡 문의</span>
            </a>
          ) : (
            <span
              className="hidden md:inline-flex min-h-[38px] cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500"
              title="카카오톡 채널 연동 시 활성화됩니다"
              aria-disabled="true"
            >
              <span>💬</span>
              <span>카카오톡 (준비중)</span>
            </span>
          )}

          {/* 전화문의 (Secondary, PC & Mobile) */}
          {hasPhone ? (
            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50"
            >
              <span>📞</span>
              <span className="hidden sm:inline">{SITE_CONFIG.contact.phone}</span>
              <span className="sm:hidden">전화문의</span>
            </a>
          ) : (
            <span
              className="inline-flex min-h-[38px] cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"
              title="운영자 대표번호 등록 시 실제 연결됩니다"
              aria-disabled="true"
            >
              <span>📞</span>
              <span>전화문의 (준비중)</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

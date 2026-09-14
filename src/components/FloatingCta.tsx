import { SITE_CONFIG, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';

/**
 * 모바일 하단 플로팅 전환 바 (Conversion Bar)
 * 1순위 핵심 문의 채널: 카카오톡 문의 (Primary, Warm Orange)
 * 2순위 직통 상담 채널: 전화문의 (Secondary, Slate 900)
 */
export function FloatingCta() {
  const hasPhone = hasValidContactPhone(SITE_CONFIG.contact.phone);
  const hasKakao = hasValidKakaoUrl(SITE_CONFIG.contact.kakaoUrl);

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md md:hidden"
      aria-label="빠른 견적 및 상담 문의"
    >
      <div className="mx-auto flex max-w-md items-center gap-2.5">
        {/* 1순위 Primary Action: 카카오톡 문의 */}
        {hasKakao ? (
          <a
            href={SITE_CONFIG.contact.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[46px] flex-[1.2] items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 text-center text-sm font-bold text-white shadow-sm transition active:scale-[0.98] active:bg-orange-700"
          >
            <span>💬</span>
            <span>카카오톡 문의</span>
          </a>
        ) : (
          <span
            className="flex min-h-[46px] flex-[1.2] cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 text-center text-xs font-medium text-slate-500"
            aria-disabled="true"
            title="카카오톡 채널 연동 시 활성화됩니다"
          >
            <span>💬</span>
            <span>카카오톡 문의 (준비중)</span>
          </span>
        )}

        {/* 2순위 Secondary Action: 전화문의 */}
        {hasPhone ? (
          <a
            href={`tel:${SITE_CONFIG.contact.phone}`}
            className="flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-900 px-3 text-center text-sm font-bold text-white shadow-xs transition active:scale-[0.98] active:bg-slate-800"
          >
            <span>📞</span>
            <span>전화문의</span>
          </a>
        ) : (
          <span
            className="flex min-h-[46px] flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 text-center text-xs font-medium text-slate-500"
            aria-disabled="true"
            title="운영자 대표번호 등록 시 실제 연결됩니다"
          >
            <span>📞</span>
            <span>전화문의 (준비중)</span>
          </span>
        )}
      </div>
    </aside>
  );
}

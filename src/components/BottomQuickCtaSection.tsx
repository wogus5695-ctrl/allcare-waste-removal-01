import { SITE_CONFIG, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';

interface BottomQuickCtaSectionProps {
  serviceFamily: 'WASTE' | 'DEMOLITION';
  title?: string;
  supportingCopy?: string;
  id?: string;
}

export function BottomQuickCtaSection({
  serviceFamily,
  title,
  supportingCopy,
  id = 'quick-estimate',
}: BottomQuickCtaSectionProps) {
  const hasPhone = hasValidContactPhone(SITE_CONFIG.contact.phone);
  const hasKakao = hasValidKakaoUrl(SITE_CONFIG.contact.kakaoUrl);

  const cleanPhone = SITE_CONFIG.contact.phone.replace(/[^0-9]/g, '');

  if (serviceFamily === 'DEMOLITION') {
    const defaultTitle = '철거 범위 및 현장 여건 사진을 보내주세요';
    const defaultCopy =
      '철거할 현장 공간 사진이나 평면도를 남겨주시면, 담당자가 확인 후 구조 및 공사 일정에 맞춘 견적을 신속히 안내해 드립니다.';

    const h2Text = title || defaultTitle;
    const copyText = supportingCopy || defaultCopy;

    return (
      <section
        id={id}
        aria-labelledby={`${id}-heading`}
        className="border-t border-slate-800 bg-slate-900 py-14 text-white md:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            id={`${id}-heading`}
            className="text-2xl font-black tracking-tight text-white break-keep sm:text-3xl md:text-4xl"
          >
            {h2Text}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-slate-300 break-keep sm:text-sm md:text-base">
            {copyText}
          </p>

          {/* CTA Row: Mobile 1-Column Stack, Desktop Center-Aligned 1-Row */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            {/* PRIMARY CTA: 전화로 바로 상담 */}
            {hasPhone ? (
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98]"
              >
                <span aria-hidden="true">📞</span>
                <span>전화로 바로 상담</span>
              </a>
            ) : (
              <span
                className="inline-flex min-h-[48px] w-full sm:w-auto cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-center text-xs font-medium text-slate-400"
                title="대표번호 등록 시 실제 연결됩니다"
                aria-disabled="true"
              >
                <span aria-hidden="true">📞</span>
                <span>전화 상담 (준비중)</span>
              </span>
            )}

            {/* SECONDARY CTA: 카카오톡 문의 */}
            {hasKakao ? (
              <a
                href={SITE_CONFIG.contact.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-900 shadow-xs transition hover:bg-slate-50 active:scale-[0.98]"
              >
                <span aria-hidden="true">💬</span>
                <span>카카오톡 문의</span>
              </a>
            ) : (
              <span
                className="inline-flex min-h-[48px] w-full sm:w-auto cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-center text-xs font-medium text-slate-400"
                title="카카오톡 채널 연동 시 실제 연결됩니다"
                aria-disabled="true"
              >
                <span aria-hidden="true">💬</span>
                <span>카카오톡 문의 (준비중)</span>
              </span>
            )}
          </div>
        </div>
      </section>
    );
  }

  // WASTE Vertical (Deep Navy Rounded Panel, Left Aligned)
  const defaultTitle = '어떤 폐기물을 정리해야 할지 막막하신가요?';
  const defaultCopy =
    '품목 사진을 찍어 보내주시면 현장 조건에 맞춰 가장 합리적인 수거 방안을 안내해 드립니다.';

  const h2Text = title || defaultTitle;
  const copyText = supportingCopy || defaultCopy;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:p-12 md:p-14">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Quick Estimate
            </span>
            <h2
              id={`${id}-heading`}
              className="mt-3 text-2xl font-black tracking-tight text-white break-keep sm:text-3xl lg:text-4xl"
            >
              {h2Text}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 break-keep sm:text-base">
              {copyText}
            </p>

            {/* CTA Row: Mobile 1-Column Stack, Desktop Left-Aligned 1-Row */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
              {/* PRIMARY CTA: 전화로 바로 상담 */}
              {hasPhone ? (
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98]"
                >
                  <span aria-hidden="true">📞</span>
                  <span>전화로 바로 상담</span>
                </a>
              ) : (
                <span
                  className="inline-flex min-h-[48px] w-full sm:w-auto cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-center text-xs font-medium text-slate-400"
                  title="대표번호 등록 시 실제 연결됩니다"
                  aria-disabled="true"
                >
                  <span aria-hidden="true">📞</span>
                  <span>전화 상담 (준비중)</span>
                </span>
              )}

              {/* SECONDARY CTA: 카카오톡 문의 */}
              {hasKakao ? (
                <a
                  href={SITE_CONFIG.contact.kakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-900 shadow-xs transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  <span aria-hidden="true">💬</span>
                  <span>카카오톡 문의</span>
                </a>
              ) : (
                <span
                  className="inline-flex min-h-[48px] w-full sm:w-auto cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-center text-xs font-medium text-slate-400"
                  title="카카오톡 채널 연동 시 실제 연결됩니다"
                  aria-disabled="true"
                >
                  <span aria-hidden="true">💬</span>
                  <span>카카오톡 문의 (준비중)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';
import { getHeroTheme, ServiceFamilyType } from '@/config/hero-theme';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ServiceHeroProps {
  /** 서비스 분류: 'WASTE' (폐기물) 또는 'DEMOLITION' (철거·원상복구) */
  serviceFamily: ServiceFamilyType;
  /** 상단 서비스 라벨 (예: "폐기물 수거 · 처리" 또는 "철거 · 원상복구") */
  serviceLabel: string;
  /** H1 전반부 문구 */
  h1Main: string;
  /** H1 후반부 문구 (단일 semantic <h1> 태그 내부에서 시각적 2행 분리) */
  h1Sub: string;
  /** H1 하단 서포팅 카피 (자연어 안내문) */
  supportingCopy: string;
  /** 네비게이션 경로 (Breadcrumbs) */
  breadcrumbs: BreadcrumbItem[];
}

/**
 * 올케어환경 Full-Width Visual Service HERO Component
 *
 * [핵심 특징]
 * 1. FULL-WIDTH BACKGROUND VISUAL + LEFT-ALIGNED CONTENT LAYER
 * 2. 5단계 엄격한 정보 위계: Breadcrumb -> Service Label -> H1 -> Supporting Copy -> CTA
 * 3. 단일 Semantic <h1> 렌더링 (줄바꿈 지원)
 * 4. 세로 높이 최적화: Desktop 약 1.6~1.8배 (min-h-[720px] lg:min-h-[820px]), Mobile 약 1.35~1.45배 (min-h-[580px])
 * 5. 콘텐츠 배치: Visual Center보다 약 5~10% 상단 안착하여 CTA 시인성 및 우측/하단 현장 사진 노출 극대화
 * 6. 가독성 오버레이: 좌측 고불투명도 화이트/뉴트럴 그라디언트 -> 우측 78%부터 완전 투명 (사진 본래 질감 100% 보존)
 * 7. 긴급 서비스 최적화 표준 CTA: 1순위 전화 바로 상담(Primary, Orange) + 2순위 카카오톡 문의(Secondary, White)
 */
export function ServiceHero({
  serviceFamily,
  serviceLabel,
  h1Main,
  h1Sub,
  supportingCopy,
  breadcrumbs,
}: ServiceHeroProps) {
  const theme = getHeroTheme(serviceFamily);
  const hasPhone = hasValidContactPhone(SITE_CONFIG.contact.phone);
  const hasKakao = hasValidKakaoUrl(SITE_CONFIG.contact.kakaoUrl);

  return (
    <section className="relative w-full overflow-hidden bg-slate-100 min-h-[580px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[820px] flex flex-col justify-center">
      {/* BACKGROUND VISUAL LAYER */}
      {theme.bgImage ? (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={theme.bgImage}
            alt=""
            aria-hidden="true"
            // @ts-expect-error - Next.js/HTML fetchpriority
            fetchpriority="high"
            loading="eager"
            className="h-full w-full object-cover [object-position:var(--bg-pos-mo)] sm:[object-position:var(--bg-pos-pc)] [transform:var(--bg-tf-mo)] sm:[transform:var(--bg-tf-pc)] origin-center"
            style={
              {
                '--bg-pos-mo': theme.mobilePosition || 'center center',
                '--bg-pos-pc': theme.desktopPosition || '60% center',
                '--bg-tf-mo': theme.mobileTransform || 'none',
                '--bg-tf-pc': theme.desktopTransform || 'none',
              } as React.CSSProperties
            }
          />
        </div>
      ) : (
        /* FALLBACK AMBIENT BACKGROUND: Deep Navy & Warm Orange Glow */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-[#0a1128] to-slate-900 pointer-events-none" aria-hidden="true">
          <div className="absolute -right-20 -top-20 h-[480px] w-[480px] rounded-full bg-orange-600/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
        </div>
      )}

      {/* GRADIENT OVERLAY (좌측 텍스트 가독성 100% 보장 & 우측 실제 현장 사진 100% 가시성) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 32%, rgba(255,255,255,0.78) 46%, rgba(255,255,255,0.25) 62%, rgba(255,255,255,0) 78%)',
        }}
        aria-hidden="true"
      />
      {/* 모바일 전용 2-Layer 오버레이 (현장 사진 가시성 대폭 확보 + 상단 텍스트 가독성 최적화) */}
      {/* Layer 2: Light Global Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none block md:hidden"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
        aria-hidden="true"
      />
      {/* Layer 3: Soft Text Readability Gradient */}
      <div
        className="absolute inset-0 z-10 pointer-events-none block md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.72) 42%, rgba(255,255,255,0.30) 70%, rgba(255,255,255,0.05) 100%)',
        }}
        aria-hidden="true"
      />

      {/* FOREGROUND CONTENT LAYER (Left-aligned container, visual center보다 5~10% 상단 안착) */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-28 md:pt-20 md:pb-36 lg:px-8 lg:pt-24 lg:pb-44">
        <div className="max-w-xl lg:max-w-2xl">
          {/* STEP 1: BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={index}>
                    {index > 0 && <li className="text-slate-400" aria-hidden="true">/</li>}
                    <li>
                      {item.href && !isLast ? (
                        <Link href={item.href} className="transition hover:text-slate-900">
                          {item.label}
                        </Link>
                      ) : (
                        <span className={isLast ? 'font-bold text-slate-800' : ''} aria-current={isLast ? 'page' : undefined}>
                          {item.label}
                        </span>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>

          {/* STEP 2: SERVICE LABEL BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-orange-50/95 px-3.5 py-1 text-xs font-bold text-orange-700 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" aria-hidden="true"></span>
            <span>{serviceLabel}</span>
          </div>

          {/* STEP 3: SINGLE SEMANTIC H1 */}
          <h1 className="mt-3.5 text-2xl font-black tracking-tight text-slate-950 break-keep sm:text-4xl lg:text-5xl sm:leading-[1.18]">
            <span className="block">{h1Main}</span>
            <span className="mt-1 block text-slate-800 font-extrabold sm:mt-2 text-xl sm:text-3xl lg:text-4xl">
              {h1Sub}
            </span>
          </h1>

          {/* STEP 4: SUPPORTING COPY */}
          <p className="mt-3.5 text-sm leading-relaxed text-slate-700 font-medium break-keep sm:mt-4 sm:text-base sm:leading-relaxed">
            {supportingCopy}
          </p>

          {/* STEP 5: STANDARDIZED DUAL CTA (1st Phone, 2nd Kakao) */}
          <div className="mt-7 flex items-center gap-2.5 sm:flex-wrap sm:gap-3">
            {/* PRIMARY CTA: 전화로 바로 상담 */}
            {hasPhone ? (
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-orange-600 px-3 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-orange-700 active:scale-[0.98] text-center"
              >
                <span aria-hidden="true">📞</span>
                <span className="sm:hidden">전화 상담</span>
                <span className="hidden sm:inline">전화로 바로 상담</span>
              </a>
            ) : (
              <span
                className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-400 text-center"
                title="운영자 대표번호 등록 시 실제 연결됩니다"
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
                className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-300 bg-white/95 px-3 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-900 shadow-xs transition hover:bg-white active:scale-[0.98] text-center"
              >
                <span aria-hidden="true">💬</span>
                <span className="sm:hidden">카카오톡 문의</span>
                <span className="hidden sm:inline">카카오톡으로 견적 문의</span>
              </a>
            ) : (
              <span
                className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-400 text-center"
                title="카카오톡 채널 연동 시 활성화됩니다"
                aria-disabled="true"
              >
                <span aria-hidden="true">💬</span>
                <span>카카오톡 (준비중)</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


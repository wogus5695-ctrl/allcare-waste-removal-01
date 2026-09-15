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
 * 4. 긴급 서비스 최적화 표준 CTA: 1순위 전화 바로 상담(Primary, Orange) + 2순위 카카오톡 문의(Secondary, White)
 * 5. 운영자 사진이 없을 때 깨진 이미지 없이 Deep Navy + Subtle Orange Ambient Fallback 제공
 * 6. 운영자 사진 등록 시 hero-theme.ts의 단일 경로 지정만으로 즉시 안전 적용
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
    <section className="relative w-full overflow-hidden bg-slate-900 min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-center">
      {/* BACKGROUND VISUAL LAYER */}
      {theme.bgImage ? (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={theme.bgImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{
              objectPosition: theme.desktopPosition || 'right center',
            }}
          />
        </div>
      ) : (
        /* FALLBACK AMBIENT BACKGROUND: Deep Navy & Warm Orange Glow */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-[#0a1128] to-slate-900 pointer-events-none" aria-hidden="true">
          {/* 우측 상단 앰비언트 글로우 (현장 비주얼 중심 영역) */}
          <div className="absolute -right-20 -top-20 h-[480px] w-[480px] rounded-full bg-orange-600/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
        </div>
      )}

      {/* GRADIENT OVERLAY (텍스트 영역 가독성 100% 보호) */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/90 md:bg-gradient-to-r md:from-slate-950/95 md:via-slate-900/80 md:to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* FOREGROUND CONTENT LAYER (Left-aligned container) */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="max-w-xl lg:max-w-2xl">
          {/* STEP 1: BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={index}>
                    {index > 0 && <li className="text-slate-500" aria-hidden="true">/</li>}
                    <li>
                      {item.href && !isLast ? (
                        <Link href={item.href} className="transition hover:text-slate-200">
                          {item.label}
                        </Link>
                      ) : (
                        <span className={isLast ? 'font-medium text-slate-300' : ''} aria-current={isLast ? 'page' : undefined}>
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
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/50 px-3.5 py-1 text-xs font-bold text-orange-400 backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true"></span>
            <span>{serviceLabel}</span>
          </div>

          {/* STEP 3: SINGLE SEMANTIC H1 */}
          <h1 className="mt-3.5 text-2xl font-black tracking-tight text-white break-keep sm:text-4xl lg:text-5xl sm:leading-[1.18]">
            <span className="block">{h1Main}</span>
            <span className="mt-1 block text-slate-100 font-extrabold sm:mt-2 text-xl sm:text-3xl lg:text-4xl">
              {h1Sub}
            </span>
          </h1>

          {/* STEP 4: SUPPORTING COPY */}
          <p className="mt-3.5 text-sm leading-relaxed text-slate-300 break-keep sm:mt-4 sm:text-base sm:leading-relaxed">
            {supportingCopy}
          </p>

          {/* STEP 5: STANDARDIZED DUAL CTA (1st Phone, 2nd Kakao) */}
          <div className="mt-7 flex items-center gap-2.5 sm:flex-wrap sm:gap-3">
            {/* PRIMARY CTA: 전화로 바로 상담 */}
            {hasPhone ? (
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-orange-600 px-3 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98] text-center"
              >
                <span aria-hidden="true">📞</span>
                <span className="sm:hidden">전화 상담</span>
                <span className="hidden sm:inline">전화로 바로 상담</span>
              </a>
            ) : (
              <span
                className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-400 text-center"
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
                className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-400 text-center"
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

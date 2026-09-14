import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveBaseRoute, createPageContext } from '@/engine/resolver';
import { generateDynamicContent } from '@/engine/content-engine';
import { generatePageMetadata } from '@/engine/seo-engine';
import { generatePageSchema } from '@/engine/schema-engine';
import { getInternalLinks } from '@/engine/link-engine';
import { SITE_CONFIG, getAbsoluteUrl, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';
import { ImagePlaceholder } from '@/components/ImagePlaceholder';

interface PageProps {
  searchParams: Promise<{ k?: string }>;
}

/**
 * Next.js App Router Dynamic Metadata 생성기
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { k } = await searchParams;

  // 1. k 쿼리가 없는 메인 루트 요청 (200 OK)
  if (!k) {
    return {
      title: `${SITE_CONFIG.brandName} - 폐기물 수거·처리 및 철거·원상복구 전문 상담`,
      description: '가정 및 사업장 폐기물 수거, 대형 가구 반출부터 상가·사무실 실내 시설물 철거, 원상복구까지 현장 맞춤형 전문 상담을 제공하는 올케어환경입니다.',
      alternates: {
        canonical: getAbsoluteUrl('/'),
      },
      openGraph: {
        title: `${SITE_CONFIG.brandName} - 폐기물 수거·처리 및 철거·원상복구 전문 상담`,
        description: '가정 및 사업장 폐기물 수거, 대형 가구 반출부터 상가·사무실 실내 시설물 철거, 원상복구까지 현장 맞춤형 전문 상담을 제공하는 올케어환경입니다.',
        url: getAbsoluteUrl('/'),
        siteName: SITE_CONFIG.brandName,
        locale: 'ko_KR',
        type: 'website',
      },
    };
  }

  // 2. k 쿼리가 전달된 동적 요청
  const resolved = resolveBaseRoute(k);
  if (!resolved) {
    return {
      title: `페이지를 찾을 수 없습니다 | ${SITE_CONFIG.brandName}`,
      robots: { index: false, follow: false },
    };
  }

  const context = createPageContext(resolved);
  return generatePageMetadata(context);
}

/**
 * 메인 기본 수거 카테고리 데이터 (6개)
 */
const MAIN_SERVICES = [
  { title: '대형 가구 수거', desc: '장롱, 침대, 소파 등 분해 및 실내 반출', icon: '🛋️' },
  { title: '가정집 비움 정리', desc: '원룸, 베란다, 창고의 생활 폐기물 정리', icon: '🏠' },
  { title: '이사 폐기물 처리', desc: '퇴거 일정에 맞춘 잔여 짐 일괄 수거', icon: '📦' },
  { title: '사무실 집기 정리', desc: '책상, 의자, 파티션 분해 및 빌딩 반출', icon: '🏢' },
  { title: '상가 매장 정리', desc: '진열대, 쇼케이스, 매장 비품 정리', icon: '🏪' },
  { title: '사업장 폐기물', desc: '창고 적재물, 현장 잔재물 맞춤 수거', icon: '🏭' },
];

/**
 * 견적 전 확인하는 6가지 요소 (Section 04 기준)
 */
const ESTIMATE_FACTORS = [
  { num: '01', title: '품목 종류', desc: '가구, 가전, 목재, 혼합 폐기물 등 성상별 처리 방식 확인' },
  { num: '02', title: '전체 물량', desc: '단품 소량 수거부터 1톤·다수 차량 적재 물량까지 체계적 파악' },
  { num: '03', title: '건물 층수', desc: '현장 층수와 보행 이동 거리에 따른 반출 동선 검토' },
  { num: '04', title: '엘리베이터 유무', desc: '승강기 이용 가능 여부 또는 계단 반출 난이도 확인' },
  { num: '05', title: '차량 접근성', desc: '작업 차량 진입 및 주차 가능 여부 사전 파악' },
  { num: '06', title: '분해·해체 여부', desc: '문틀 통과를 위한 가구 분해 및 사전 해체 필요성 확인' },
];

/**
 * 4단계 진행 절차 (Section 05 기준)
 */
const PROCESS_STEPS = [
  { step: '01', title: '사진 전달', desc: '수거 대상 품목 전체 사진 전송' },
  { step: '02', title: '품목·현장 조건 확인', desc: '폐기물 종류 및 반출 여건 확인' },
  { step: '03', title: '견적 및 일정 상담', desc: '상세 조건 및 방문 일정 조율' },
  { step: '04', title: '방문 수거', desc: '협의된 일정에 현장 방문하여 수거' },
];

/**
 * 메인 홈페이지 기본 FAQ (Section 06 기준)
 */
const MAIN_FAQS = [
  {
    question: '수거 견적은 어떻게 산정되나요?',
    answer: '폐기물의 전체 부피와 무게, 품목 성상(가구·가전·혼합), 엘리베이터 유무, 층수, 사다리차 필요 여부 등 현장 반출 조건을 종합하여 안내해 드립니다.',
  },
  {
    question: '직접 밖으로 내놓아야 하나요?',
    answer: '실내에 있는 상태 그대로 사진을 보내주시면 작업 여건을 확인하여 실내 반출 가능 여부를 안내해 드립니다.',
  },
  {
    question: '당일 수거도 가능한가요?',
    answer: '당일 수거는 현장 배차 상황과 이동 경로에 따라 가능 여부가 달라집니다. 급한 일정이실 경우 품목 사진을 먼저 보내주시면 가능 여부를 확인해 드립니다.',
  },
  {
    question: '가구 분해 작업도 현장에서 진행되나요?',
    answer: '문틀 통과가 어려운 대형 가구는 현장 분해 필요 여부를 사전에 확인한 뒤 작업을 진행합니다.',
  },
];

export default async function HomePage({ searchParams }: PageProps) {
  const { k } = await searchParams;

  // 연락처 유효성 검사 (가짜 링크 방지)
  const hasPhone = hasValidContactPhone(SITE_CONFIG.contact.phone);
  const hasKakao = hasValidKakaoUrl(SITE_CONFIG.contact.kakaoUrl);

  // =========================================================================
  // CASE A: 동적 키워드 랜딩 페이지 (?k=지역명-작업명)
  // =========================================================================
  if (k) {
    const resolved = resolveBaseRoute(k);
    if (!resolved) {
      // 잘못된 지역/작업/비활성 쿼리는 즉시 실제 HTTP 404 반환
      notFound();
    }

    const context = createPageContext(resolved);
    const content = generateDynamicContent(context);
    const schema = generatePageSchema(context);
    const internalLinks = getInternalLinks(resolved.region, resolved.work);

    return (
      <>
        {/* Schema.org JSON-LD 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <div className="w-full">
          {/* SECTION 01: HERO (Rhythm: White Bg, 2-Col Split, Photo Estimate Primary) */}
          <section className="bg-white py-12 md:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Hero Left: Text Content & Dual CTA */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
                    {content.serviceSectionTitle}
                  </div>
                  <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 break-keep sm:text-4xl lg:text-5xl">
                    {content.h1}
                  </h1>
                  <p className="mt-4 text-lg font-bold text-slate-800 break-keep sm:text-xl">
                    {content.heroHook}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                    {content.heroDescription}
                  </p>

                  {/* Dual CTA: 1순위 카카오톡 견적(Warm Orange) + 2순위 전화 상담(Navy) */}
                  <div className="mt-8 flex items-center gap-2.5 sm:flex-wrap sm:gap-3">
                    {hasKakao ? (
                      <a
                        href={SITE_CONFIG.contact.kakaoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-orange-600 px-3 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98] text-center"
                      >
                        <span>💬</span>
                        <span className="sm:hidden">카카오톡 문의</span>
                        <span className="hidden sm:inline">카카오톡으로 견적 문의</span>
                      </a>
                    ) : (
                      <span
                        className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-500 text-center"
                        title="카카오톡 채널 등록 시 실제 연결됩니다"
                        aria-disabled="true"
                      >
                        <span>💬</span>
                        <span className="sm:hidden">카카오톡 (준비중)</span>
                        <span className="hidden sm:inline">카카오톡 견적 (준비중)</span>
                      </span>
                    )}

                    {hasPhone ? (
                      <a
                        href={`tel:${SITE_CONFIG.contact.phone}`}
                        className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-300 bg-white px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 active:scale-[0.98] text-center"
                      >
                        <span>📞</span>
                        <span>전화 상담</span>
                      </a>
                    ) : (
                      <span
                        className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-500 text-center"
                        title="운영자 대표번호 등록 시 실제 연결됩니다"
                        aria-disabled="true"
                      >
                        <span>📞</span>
                        <span>전화 상담 (준비중)</span>
                      </span>
                    )}
                  </div>

                  {/* Safe Trust Points */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
                      ✓ 사진으로 품목 먼저 확인
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
                      ✓ 현장 조건 확인 후 상담
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
                      ✓ 견적 기준 사전 안내
                    </span>
                  </div>
                </div>

                {/* Hero Right: Operator Photo Slot */}
                <div className="lg:col-span-5">
                  <ImagePlaceholder
                    label="운영자 제공 현장 사진 영역"
                    sublabel={`${context.seoDisplayName} 수거 작업 현장 사진 반영 예정`}
                    aspectRatio="video"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 02: WHAT WE COLLECT (Rhythm: Soft Gray Bg, Visual Cards Grid) */}
          <section id="services" className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Service Scope
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                  {content.serviceSectionTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                  현장 여건과 배출 물품의 특성에 맞춰 안전하고 체계적으로 분류·반출합니다.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
                {content.serviceItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      📦
                    </span>
                    <span className="mt-2 text-sm font-bold text-slate-900 break-keep">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 03: DECISION GUIDE (Rhythm: White Bg, 3 Structured Points) */}
          <section id="decision" className="bg-white py-14 md:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Decision Guide
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                  {content.decisionTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                  {content.decisionIntro}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                {content.decisionPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-xs transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  >
                    <div>
                      <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs ring-1 ring-slate-200/70">
                        Point 0{idx + 1}
                      </span>
                      <h3 className="mt-4 text-base font-bold text-slate-900 break-keep">
                        {point.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 04: ESTIMATE FACTORS (Rhythm: Soft Gray Bg, Big Numbered Cards) */}
          <section id="estimate" className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Estimate Criteria
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                  {content.estimateTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                  {content.estimateDescription}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4">
                {ESTIMATE_FACTORS.map((factor, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <span className="font-mono text-xl font-black text-orange-600/90 sm:text-2xl">
                      {factor.num}
                    </span>
                    <div className="mt-3">
                      <h3 className="text-sm font-bold text-slate-900 break-keep sm:text-base">
                        {factor.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 break-keep sm:text-xs">
                        {factor.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 05: PROCESS TIMELINE (Rhythm: White Bg, Numbered Process Steps) */}
          <section id="process" className="bg-white py-14 md:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Work Flow
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                  {content.processTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                  간단한 사진 전송으로 작업 가능 여부와 예상 절차를 신속하게 확인하실 수 있습니다.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-4">
                {PROCESS_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div>
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-2xs">
                        {step.step}
                      </span>
                      <h3 className="mt-3 text-sm font-bold text-slate-900 break-keep sm:text-base">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500 break-keep">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 06: FAQ (Rhythm: Soft Gray Bg, Native Accordion with Large Tap Area) */}
          <section id="faq" className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Questions & Answers
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                  자주 묻는 질문
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                  {context.seoDisplayName} {context.workKeyword.displayName} 진행 시 고객님께서 자주 확인하시는 사항입니다.
                </p>
              </div>

              <div className="mt-8 space-y-3.5">
                {content.faqItems.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 sm:p-6"
                  >
                    <summary className="flex min-h-[36px] cursor-pointer items-center justify-between gap-3 sm:gap-4 select-none list-none [&::-webkit-details-marker]:hidden">
                      <span className="text-sm font-bold text-slate-900 break-keep sm:text-base pr-2">
                        Q. {faq.question}
                      </span>
                      <span className="faq-chevron flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition-transform duration-200 group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                      A. {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CONTEXTUAL INTERNAL LINKS & CROSS-VERTICAL RECOMMENDATION */}
          {(internalLinks.parentLink || internalLinks.relatedLinks.length > 0 || internalLinks.crossVerticalLink) && (
            <div className="bg-white py-8">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4">
                {/* Same-Vertical Internal Links */}
                {(internalLinks.parentLink || internalLinks.relatedLinks.length > 0) && (
                  <section className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-xs sm:p-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      연관 서비스 및 인접 지역 안내
                    </h3>
                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      {internalLinks.parentLink && (
                        <a
                          href={internalLinks.parentLink.href}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-orange-500 hover:text-orange-600 sm:text-sm"
                        >
                          <span>📍</span>
                          <span>{internalLinks.parentLink.label}</span>
                        </a>
                      )}
                      {internalLinks.relatedLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-2xs transition hover:border-slate-400 hover:text-slate-900 sm:text-sm"
                        >
                          <span>🏷️</span>
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                {/* Controlled Cross-Vertical Recommendation Card (Strict 3 Pairs Only) */}
                {internalLinks.crossVerticalLink && (
                  <section className="rounded-2xl border border-orange-200/80 bg-orange-50/40 p-5 shadow-2xs sm:p-6">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                          <span>💡</span>
                          <span>{internalLinks.crossVerticalLink.sectionTitle}</span>
                        </span>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                          {internalLinks.crossVerticalLink.description}
                        </p>
                      </div>
                      <a
                        href={internalLinks.crossVerticalLink.href}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-orange-300 bg-white px-4 py-2.5 text-xs font-bold text-orange-700 shadow-2xs transition hover:bg-orange-600 hover:text-white sm:text-sm whitespace-nowrap shrink-0"
                      >
                        <span>{internalLinks.crossVerticalLink.label}</span>
                        <span>→</span>
                      </a>
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}

          {/* SECTION 07: FINAL CTA (Rhythm: Deep Navy Box, Left Content + Checklist, Right Image Slot) */}
          <section className="bg-white pb-16 pt-6 md:pb-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
                <div className="grid grid-cols-1 items-center gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:gap-12 lg:p-14">
                  {/* Left Column: CTA Content & Quick Info Guide */}
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-orange-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                      간편 견적 상담
                    </div>
                    <h2 className="mt-4 text-2xl font-black tracking-tight text-white break-keep sm:text-3xl lg:text-4xl">
                      {content.finalCtaTitle}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300 break-keep sm:text-base">
                      {content.finalCtaDescription}
                    </p>

                    {/* Quick Guide Box */}
                    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-800/60 p-4 text-xs">
                      <span className="font-bold text-slate-200">💡 사진 상담 시 도움이 되는 정보:</span>
                      <ul className="mt-2 grid grid-cols-1 gap-1 text-slate-300 sm:grid-cols-2">
                        <li>• 수거 대상 전체 사진</li>
                        <li>• 큰 품목 크기</li>
                        <li>• 대략적인 물량</li>
                        <li>• 층수 및 엘리베이터 여부</li>
                      </ul>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {hasKakao ? (
                        <a
                          href={SITE_CONFIG.contact.kakaoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98]"
                        >
                          <span>💬</span>
                          <span>카카오톡으로 사진 견적 문의</span>
                        </a>
                      ) : (
                        <span className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-xs font-medium text-slate-400">
                          <span>💬</span>
                          <span>카카오톡 견적 (준비중)</span>
                        </span>
                      )}

                      {hasPhone ? (
                        <a
                          href={`tel:${SITE_CONFIG.contact.phone}`}
                          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-slate-750 active:scale-[0.98]"
                        >
                          <span>📞</span>
                          <span>전화 상담</span>
                        </a>
                      ) : (
                        <span className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-xs font-medium text-slate-400">
                          <span>📞</span>
                          <span>전화 상담 (준비중)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Image Placeholder */}
                  <div className="lg:col-span-5">
                    <ImagePlaceholder
                      label="현장 작업 사진 슬롯"
                      sublabel="수거 및 적재 완료 현장 사진 반영 예정"
                      aspectRatio="video"
                      className="border-slate-700 bg-slate-800/70 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  // =========================================================================
  // CASE B: 메인 홈페이지 (GET /)
  // =========================================================================
  const schema = generatePageSchema();

  return (
    <>
      {/* 메인 홈페이지 Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="w-full">
        {/* SECTION 01: HERO */}
        <section className="bg-white py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
                  체계적인 현장 비움 & 원상복구 파트너
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 break-keep sm:text-4xl lg:text-5xl">
                  폐기물 정리와 철거 상담, 올케어환경
                </h1>
                <p className="mt-4 text-lg font-bold text-slate-800 break-keep sm:text-xl">
                  버릴 물건의 수거부터 실내 시설물 철거까지 한 번에 상담받으세요
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                  가정집 대형 가구 반출과 이사·사업장 폐기물 수거부터 상가·사무실 실내 시설물 철거 및 계약 만료 원상복구까지.
                  현장 사진을 확인하여 필요한 작업 조건과 합리적인 견적 기준을 신속하게 안내해 드립니다.
                </p>

                {/* Dual Service Entry Cards */}
                <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <a
                    href="/waste"
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-xs transition hover:border-orange-300 hover:bg-white hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📦</span>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-orange-600">
                          폐기물 수거·처리
                        </h2>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        대형 가구, 가정집 비움, 이사 폐기물, 사무실·상가 불용 집기 수거
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center text-xs font-bold text-orange-600">
                      폐기물 서비스 안내 바로가기 →
                    </span>
                  </a>

                  <a
                    href="/demolition"
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-xs transition hover:border-orange-300 hover:bg-white hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔨</span>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-orange-600">
                          철거·원상복구
                        </h2>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        상가·사무실 인테리어 철거, 가벽·바닥 마감재 해체, 계약 만료 복구
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center text-xs font-bold text-orange-600">
                      철거 서비스 안내 바로가기 →
                    </span>
                  </a>
                </div>

                {/* Hero Dual CTA: 1순위 카카오톡 견적(Warm Orange) + 2순위 전화 상담(Navy) */}
                <div className="mt-8 flex items-center gap-2.5 sm:flex-wrap sm:gap-3">
                  {hasKakao ? (
                    <a
                      href={SITE_CONFIG.contact.kakaoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-orange-600 px-3 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98] text-center"
                    >
                      <span>💬</span>
                      <span className="sm:hidden">카카오톡 문의</span>
                      <span className="hidden sm:inline">카카오톡으로 견적 문의</span>
                    </a>
                  ) : (
                    <span
                      className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-500 text-center"
                      title="카카오톡 채널 등록 시 실제 연결됩니다"
                      aria-disabled="true"
                    >
                      <span>💬</span>
                      <span className="sm:hidden">카카오톡 (준비중)</span>
                      <span className="hidden sm:inline">카카오톡 견적 (준비중)</span>
                    </span>
                  )}

                  {hasPhone ? (
                    <a
                      href={`tel:${SITE_CONFIG.contact.phone}`}
                      className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-300 bg-white px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 active:scale-[0.98] text-center"
                    >
                      <span>📞</span>
                      <span>전화 상담</span>
                    </a>
                  ) : (
                    <span
                      className="inline-flex min-h-[48px] flex-1 sm:flex-initial cursor-not-allowed items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-500 text-center"
                      title="운영자 대표번호 등록 시 실제 연결됩니다"
                      aria-disabled="true"
                    >
                      <span>📞</span>
                      <span>전화 상담 (준비중)</span>
                    </span>
                  )}
                </div>

                {/* Safe Trust Points */}
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
                    ✓ 사진으로 품목 먼저 확인
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
                    ✓ 현장 조건 확인 후 상담
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
                    ✓ 견적 기준 사전 안내
                  </span>
                </div>
              </div>

              {/* Hero Right: Main Photo Slot */}
              <div className="lg:col-span-5">
                <ImagePlaceholder
                  label="대표 현장 사진 적용 영역"
                  sublabel="올케어환경 수거 작업 현장 이미지 반영 예정"
                  aspectRatio="video"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: WHAT WE COLLECT */}
        <section id="services" className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Service Scope
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                어떤 폐기물을 정리해야 하나요?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                현장 여건과 품목에 맞춰 안전하고 체계적인 수거 절차를 지원합니다.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              {MAIN_SERVICES.map((srv, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                >
                  <span className="text-3xl" aria-hidden="true">
                    {srv.icon}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-900 break-keep">
                    {srv.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 break-keep sm:text-sm">
                    {srv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 03: DECISION GUIDE */}
        <section id="decision" className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Check Points
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                수거 전에 이것부터 확인해보세요
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                사진 상담 전 아래 세 가지를 미리 확인해 주시면 더욱 정확하고 빠른 안내가 가능합니다.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-xs transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-orange-600 shadow-2xs ring-1 ring-slate-200/70">
                  Check 01
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900 break-keep">
                  품목과 물량 확인
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep">
                  가구류, 가전류, 일반 생활 잡화 등 버리실 품목의 종류와 대략적인 전체 물량을 사진으로 남겨주세요.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-xs transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-orange-600 shadow-2xs ring-1 ring-slate-200/70">
                  Check 02
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900 break-keep">
                  층수·승강기·차량 접근 등 반출 조건 확인
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep">
                  건물 층수, 엘리베이터 이용 가능 여부, 계단 반출 여건 및 작업 차량의 진입 환경을 검토합니다.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-xs transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-orange-600 shadow-2xs ring-1 ring-slate-200/70">
                  Check 03
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900 break-keep">
                  작업 범위와 견적 조건 사전 확인
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep">
                  문틀 통과를 위한 분해 필요성 및 이동 동선 등 구체적인 작업 범위를 사전에 확인합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04: ESTIMATE FACTORS */}
        <section id="estimate" className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Estimate Criteria
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                폐기물 견적은 어떤 기준으로 달라질까요?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                단순 무게뿐 아니라 현장 작업 난이도에 직결되는 6가지 요소를 투명하게 검토합니다.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4">
              {ESTIMATE_FACTORS.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                >
                  <span className="font-mono text-xl font-black text-orange-600/90 sm:text-2xl">
                    {factor.num}
                  </span>
                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-slate-900 break-keep sm:text-base">
                      {factor.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 break-keep sm:text-xs">
                      {factor.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: PROCESS */}
        <section id="process" className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Work Flow
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                문의부터 수거 상담까지 어렵지 않습니다
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                전화 한 통 또는 카카오톡 사진 전송으로 4단계 간편 절차를 시작하세요.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-4">
              {PROCESS_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-2xs">
                      {step.step}
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-slate-900 break-keep sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 break-keep">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 06: FAQ */}
        <section id="faq" className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Questions & Answers
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
                자주 묻는 질문
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                폐기물 수거 의뢰 시 고객님들이 가장 자주 궁금해하시는 질문입니다.
              </p>
            </div>

            <div className="mt-8 space-y-3.5">
              {MAIN_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 sm:p-6"
                >
                  <summary className="flex min-h-[36px] cursor-pointer items-center justify-between gap-3 sm:gap-4 select-none list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-sm font-bold text-slate-900 break-keep sm:text-base pr-2">
                      Q. {faq.question}
                    </span>
                    <span className="faq-chevron flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition-transform duration-200 group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                    A. {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 07: FINAL CTA */}
        <section className="bg-white pb-16 pt-6 md:pb-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
              <div className="grid grid-cols-1 items-center gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:gap-12 lg:p-14">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-orange-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                    간편 견적 상담
                  </div>
                  <h2 className="mt-4 text-2xl font-black tracking-tight text-white break-keep sm:text-3xl lg:text-4xl">
                    버릴 물건, 사진으로 먼저 확인해보세요
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 break-keep sm:text-base">
                    현장 사진을 카카오톡으로 보내주시면 품목과 현장 조건을 확인해 상담합니다.
                  </p>

                  {/* Quick Guide Box */}
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-800/60 p-4 text-xs">
                    <span className="font-bold text-slate-200">💡 사진 상담 시 도움이 되는 정보:</span>
                    <ul className="mt-2 grid grid-cols-1 gap-1 text-slate-300 sm:grid-cols-2">
                      <li>• 수거 대상 전체 사진</li>
                      <li>• 큰 품목 크기</li>
                      <li>• 대략적인 물량</li>
                      <li>• 층수 및 엘리베이터 여부</li>
                    </ul>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {hasKakao ? (
                      <a
                        href={SITE_CONFIG.contact.kakaoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98]"
                      >
                        <span>💬</span>
                        <span>카카오톡으로 사진 견적 문의</span>
                      </a>
                    ) : (
                      <span className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-xs font-medium text-slate-400">
                        <span>💬</span>
                        <span>카카오톡 견적 (준비중)</span>
                      </span>
                    )}

                    {hasPhone ? (
                      <a
                        href={`tel:${SITE_CONFIG.contact.phone}`}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-slate-750 active:scale-[0.98]"
                      >
                        <span>📞</span>
                        <span>전화 상담</span>
                      </a>
                    ) : (
                      <span className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-xs font-medium text-slate-400">
                        <span>📞</span>
                        <span>전화 상담 (준비중)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <ImagePlaceholder
                    label="대표 현장 사진 적용 영역"
                    sublabel="올케어환경 수거 작업 현장 이미지 반영 예정"
                    aspectRatio="video"
                    className="border-slate-700 bg-slate-800/70 text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

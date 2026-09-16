import type { Metadata } from 'next';
import { SITE_CONFIG, getAbsoluteUrl } from '@/config/site';
import { ServiceHero } from '@/components/ServiceHero';
import { ServiceScopeSection } from '@/components/ServiceScopeSection';
import { EstimateCriteriaSection } from '@/components/EstimateCriteriaSection';
import { BottomQuickCtaSection } from '@/components/BottomQuickCtaSection';

export const metadata: Metadata = {
  title: `철거·원상복구 공사 및 시공 상담 | ${SITE_CONFIG.brandName}`,
  description:
    '상가 원상복구, 사무실 가벽 철거, 실내 인테리어 철거 및 바닥재 철거까지. 현장 맞춤형 견적 산정 기준과 안전한 철거 시공 절차를 안내해 드립니다.',
  alternates: {
    canonical: getAbsoluteUrl('/demolition'),
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: `철거·원상복구 공사 및 시공 상담 | ${SITE_CONFIG.brandName}`,
    description:
      '상가 원상복구, 사무실 가벽 철거, 실내 인테리어 철거 및 바닥재 철거까지. 현장 맞춤형 견적 산정 기준과 안전한 철거 시공 절차를 안내해 드립니다.',
    url: getAbsoluteUrl('/demolition'),
    siteName: SITE_CONFIG.brandName,
    locale: 'ko_KR',
    type: 'website',
  },
};


const PROCESS_STEPS = [
  { step: '01', title: '현장 사진·도면 전달', desc: '철거 대상 부위 사진 또는 실측 도면을 카카오톡 또는 문자로 전송' },
  { step: '02', title: '시공 조건 확인', desc: '원상복구 범위, 소음 규제, 승강기 보양 및 반출 동선 등 제반 환경 검토' },
  { step: '03', title: '세부 견적 산출', desc: '투입 인력, 장비대, 폐기물 처리비가 명시된 투명 견적 제공' },
  { step: '04', title: '작업 진행 및 현장 정리', desc: '주변 시설 보호 보양 후 철거 공정 진행 및 협의된 잔재물 정리' },
];

const FAQS = [
  {
    question: '철거 견적 산출 시 현장 방문이 필수인가요?',
    answer: '단순 가벽 철거는 사진과 규격 치수로 사전 가견적이 가능합니다. 다만 바닥재 본드 접착 상태, 천장 내부 배선·배관 상태, 건물 엘리베이터 보양 기준 등에 따라 정확한 최종 견적은 현장 실측을 통해 확정됩니다.',
  },
  {
    question: '상가 원상복구 기준은 어떻게 협의해야 하나요?',
    answer: '입점 당시 임대차 계약서 상의 시설 원상회복 특약 조항 및 임대인이 요구하는 명도 기준(천장 텍스 마감, 바닥 원상복구, 조명 원위치 등)을 사전에 확인해 주시면 불필요한 추가 공사를 예방할 수 있습니다.',
  },
  {
    question: '소음이나 분진 등 공사 조건은 어떻게 확인하나요?',
    answer: '건물 관리사무소의 공사 규정과 작업 허용 시간대, 엘리베이터 보양 기준을 사전에 확인하여 현장 여건에 맞추어 일정을 조율합니다.',
  },
  {
    question: '철거 후 발생하는 잔재물 처리는 어떻게 진행되나요?',
    answer: '철거 공사 시 발생하는 잔재물(폐콘크리트, 목재, 석고보드 등)의 반출 범위와 처리 조건을 사전에 협의하여 견적 및 작업 계획에 반영합니다.',
  },
];

export default function DemolitionServiceMainPage() {
  return (
    <div className="w-full">
      {/* SECTION 01: HERO (Full-Width Visual & Standardized CTA) */}
      <ServiceHero
        serviceFamily="DEMOLITION"
        serviceLabel="철거 · 원상복구"
        h1Main="철거부터 원상복구까지,"
        h1Sub="현장에 필요한 작업을 한 번에"
        supportingCopy="상가·사무실 원상복구부터 가벽과 부분 철거까지 현장 상태와 철거 범위를 확인해 필요한 작업을 안내합니다."
        breadcrumbs={[
          { label: '홈', href: '/' },
          { label: '철거·원상복구' },
        ]}
      />


      {/* SECTION 02: SERVICE SCOPE (4 Representative Cards & Image Architecture) */}
      <ServiceScopeSection serviceFamily="DEMOLITION" />

      {/* SECTION 03: ESTIMATE CRITERIA */}
      <EstimateCriteriaSection serviceFamily="DEMOLITION" variant="white" />

      {/* SECTION 04: WORK PROCESS */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              철거 및 원상복구 진행 절차
            </h2>
            <p className="mt-2 text-sm text-slate-600 break-keep sm:text-base">
              사전 상담부터 잔재물 반출까지 투명하고 체계적인 단계로 진행됩니다.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
                  {step.step}
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05: REGIONAL SERVICE HUB LINK BANNER */}
      <section className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <span className="inline-block rounded-md bg-orange-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  지역별 서비스 안내
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                  수원시 전 지역 철거·원상복구 현장 안내
                </h3>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  장안구, 권선구, 팔달구, 영통구 60개 동별 철거 시공 사례 및 지역별 상담 창구를 확인해 보세요.
                </p>
              </div>
              <a
                href="/hub/demolition"
                className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-orange-700 whitespace-nowrap"
              >
                <span>수원시 철거 지역 안내 바로가기</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06: FAQ */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              철거 및 원상복구 상담 전 고객님들께서 가장 많이 문의하시는 내용입니다.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-900">
                  <span className="mr-2 text-orange-600">Q.</span>
                  {faq.question}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  <span className="mr-2 font-bold text-slate-400">A.</span>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 07: CTA FOOTER (QUICK ESTIMATE) */}
      <BottomQuickCtaSection serviceFamily="DEMOLITION" />
    </div>
  );
}

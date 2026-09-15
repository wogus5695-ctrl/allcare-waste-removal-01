import type { Metadata } from 'next';
import { SITE_CONFIG, getAbsoluteUrl, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';
import { ServiceHero } from '@/components/ServiceHero';
import { ServiceScopeSection } from '@/components/ServiceScopeSection';

export const metadata: Metadata = {
  title: `폐기물 수거·처리 서비스 안내 | ${SITE_CONFIG.brandName}`,
  description:
    '가정집 대형 가구 반출부터 이사 폐기물, 사무실 및 상가 불용 집기 수거까지. 현장 맞춤형 견적 기준과 수거 진행 절차를 안내해 드립니다.',
  alternates: {
    canonical: getAbsoluteUrl('/waste'),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `폐기물 수거·처리 서비스 안내 | ${SITE_CONFIG.brandName}`,
    description:
      '가정집 대형 가구 반출부터 이사 폐기물, 사무실 및 상가 불용 집기 수거까지. 현장 맞춤형 견적 기준과 수거 진행 절차를 안내해 드립니다.',
    url: getAbsoluteUrl('/waste'),
    siteName: SITE_CONFIG.brandName,
    locale: 'ko_KR',
    type: 'website',
  },
};

const ESTIMATE_FACTORS = [
  { num: '01', title: '품목 성상', desc: '가구, 가전, 목재, 혼합 잡화 등 성상별 적재 및 처리 방식' },
  { num: '02', title: '전체 물량', desc: '단품 소량 수거부터 1톤·다수 트럭 분량까지 실측 파악' },
  { num: '03', title: '작업 층수', desc: '건물 층수와 실내에서 작업 차량까지의 보행 이동 동선' },
  { num: '04', title: '엘리베이터 여부', desc: '승강기 이용 가능 여부 및 계단 반출 작업 난이도' },
  { num: '05', title: '차량 접근성', desc: '건물 입구 인근 작업 차량 주차 및 상차 환경' },
  { num: '06', title: '분해 필요성', desc: '문틀 및 통로 통과를 위한 사전 분해·해체 공수' },
];

const PROCESS_STEPS = [
  { step: '01', title: '사진 전달', desc: '버리실 품목 전체 사진을 카카오톡 또는 문자로 전송' },
  { step: '02', title: '현장 여건 확인', desc: '품목 성상, 층수, 엘리베이터 여부 등 기본 작업 환경 검토' },
  { step: '03', title: '견적 및 일정 안내', desc: '적정 투입 인원과 차량 기준에 맞춘 투명 견적 산출' },
  { step: '04', title: '방문 수거', desc: '협의된 일정에 현장 방문하여 안전하게 반출 및 정리' },
];

const FAQS = [
  {
    question: '수거 견적은 어떤 기준으로 산정되나요?',
    answer: '버리실 폐기물의 전체 부피와 무게, 품목 성상(가구·가전·혼합), 층수, 엘리베이터 유무 및 사다리차 필요 여부를 종합적으로 고려하여 산정합니다.',
  },
  {
    question: '방문 전 물건을 직접 밖으로 내놓아야 하나요?',
    answer: '아닙니다. 실내에 놓인 상태 그대로 사진을 보내주시면 작업 인력이 직접 방문하여 외부로 안전하게 반출해 드립니다.',
  },
  {
    question: '당일 수거도 가능한가요?',
    answer: '당일 수거는 관내 배차 상황과 이동 경로에 따라 가능 여부가 달라집니다. 급한 일정이실 경우 사진을 먼저 전송해 주시면 배차 가능 여부를 신속히 확인해 드립니다.',
  },
  {
    question: '폐기물 수거 서비스 지역은 어디인가요?',
    answer: '현재 수원시 전 지역(장안구, 권선구, 팔달구, 영통구 60개 동)을 중심으로 상시 방문 수거를 진행하고 있습니다.',
  },
];

export default function WasteServiceMainPage() {
  const hasPhone = hasValidContactPhone(SITE_CONFIG.contact.phone);
  const hasKakao = hasValidKakaoUrl(SITE_CONFIG.contact.kakaoUrl);

  return (
    <div className="w-full">
      {/* SECTION 01: HERO (Full-Width Visual & Standardized CTA) */}
      <ServiceHero
        serviceFamily="WASTE"
        serviceLabel="폐기물 수거 · 처리"
        h1Main="폐기물 수거·처리,"
        h1Sub="필요한 현장을 빠르게 비워드립니다"
        supportingCopy="가정집·이사·상가·사무실에서 나온 폐기물까지 현장과 물량을 확인해 수거 방법과 견적을 안내합니다."
        breadcrumbs={[
          { label: '홈', href: '/' },
          { label: '폐기물 수거·처리' },
        ]}
      />


      {/* SECTION 02: SERVICE SCOPE (4 Representative Cards & Image Architecture) */}
      <ServiceScopeSection serviceFamily="WASTE" />

      {/* SECTION 03: REGION HUB ENTRY BANNER */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-lg bg-orange-600 px-2.5 py-1 text-xs font-bold text-white">
                지역별 안내
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                수원시 전 지역 동 단위 폐기물 수거 안내
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                장안구, 권선구, 팔달구, 영통구 60개 동별 상세 수거 정보와 작업 조건을 확인하실 수 있습니다.
              </p>
            </div>
            <a
              href="/hub/waste"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <span>수원시 폐기물 지역 허브 바로가기</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 04: ESTIMATE FACTORS */}
      <section className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Estimate Criteria
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
              폐기물 견적 산정 기준
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
              단순 무게뿐 아니라 현장 반출 난이도에 직결되는 6가지 요소를 투명하게 검토합니다.
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
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Work Flow
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl">
              체계적인 4단계 수거 절차
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
              사진 한 장으로 시작하는 간편하고 명확한 폐기물 수거 상담 절차입니다.
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
              폐기물 수거 신청 및 견적 상담 시 고객님께서 자주 확인하시는 사항입니다.
            </p>
          </div>

          <div className="mt-8 space-y-3.5">
            {FAQS.map((faq, idx) => (
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
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Quick Estimate
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                어떤 폐기물을 정리해야 할지 막막하신가요?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                품목 사진을 찍어 보내주시면 현장 조건에 맞춰 가장 합리적인 수거 방안을 안내해 드립니다.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {hasKakao && (
                  <a
                    href={SITE_CONFIG.contact.kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"
                  >
                    <span>💬</span>
                    <span>카카오톡으로 견적 상담</span>
                  </a>
                )}
                {hasPhone && (
                  <a
                    href={`tel:${SITE_CONFIG.contact.phone}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-750"
                  >
                    <span>📞</span>
                    <span>전화 문의</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import { SITE_CONFIG, getAbsoluteUrl, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';
import { ImagePlaceholder } from '@/components/ImagePlaceholder';

export const metadata: Metadata = {
  title: `철거·원상복구 공사 및 시공 상담 | ${SITE_CONFIG.brandName}`,
  description:
    '상가 원상복구, 사무실 가벽 철거, 실내 인테리어 철거 및 바닥재 철거까지. 현장 맞춤형 견적 산정 기준과 안전한 철거 시공 절차를 안내해 드립니다.',
  alternates: {
    canonical: getAbsoluteUrl('/demolition'),
  },
  robots: {
    index: true,
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

const DEMOLITION_CATEGORIES = [
  { title: '상가 원상복구', desc: '임대차 계약 종료에 따른 마감재 철거 및 임대인 인도 기준 원상회복', icon: '🏪' },
  { title: '사무실 가벽·칸막이 철거', desc: '경량 석고보드 스터드, 유리벽, 래핑 칸막이 해체 및 천장 몰딩 마감', icon: '🏢' },
  { title: '실내 인테리어 부분 철거', desc: '주방 싱크대, 욕실 타일, 붙박이장, 신발장 등 리모델링 전 선별 철거', icon: '🔨' },
  { title: '바닥재 철거 및 면처리', desc: '데코타일, 디럭스타일, 강화마루, 에폭시 바닥재 철거 및 샌딩 면정리', icon: '🧱' },
  { title: '천장재·텍스 해체', desc: 'M-bar, T-bar 경량 철골 천장틀 및 석고 텍스 안전 철거 분리', icon: '🏗️' },
  { title: '폐업 매장 철거 정리', desc: '영업 종료 매장 내부 인테리어 철거, 주방 설비 및 집기 일괄 정리', icon: '🏬' },
];

const ESTIMATE_FACTORS = [
  { num: '01', title: '철거 면적 및 평수', desc: '시공 면적(전용 평수)과 천장 높이에 따른 철거 및 해체 공수 산출' },
  { num: '02', title: '구조재 성상', desc: '석고보드, 조적(벽돌), 콘크리트, 경량 철골, 유리 등 철거 대상 재질' },
  { num: '03', title: '야간·소음 규정', desc: '건물 관리소 규약에 따른 주말·야간 시공 필요 여부 및 소음 제한 조건' },
  { num: '04', title: '반출 이동 동선', desc: '승강기 보양 후 운반 가능 여부, 사다리차 접근성 및 계단 작업 조건' },
  { num: '05', title: '원상복구 범위', desc: '천장 텍스 복구, 바닥 디럭스타일 복구 등 임대인 명도 조건 부합 여부' },
  { num: '06', title: '잔재물 반출 여건', desc: '철거 폐기물 적재 공간 및 폐기물 운반 차량 진입 여건 확인' },
];

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
  const hasPhone = hasValidContactPhone(SITE_CONFIG.contact.phone);
  const hasKakao = hasValidKakaoUrl(SITE_CONFIG.contact.kakaoUrl);

  return (
    <div className="w-full">
      {/* SECTION 01: HERO */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <a href="/" className="transition hover:text-slate-900">홈</a>
              </li>
              <li>/</li>
              <li className="font-semibold text-slate-800" aria-current="page">철거·원상복구</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
                철거·원상복구 시공 상담
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 break-keep sm:text-4xl lg:text-5xl">
                철거·원상복구 시공 및 견적 상담
              </h1>
              <p className="mt-4 text-lg font-bold text-slate-800 break-keep sm:text-xl">
                상가 원상복구부터 사무실 가벽 철거, 인테리어 부분 철거까지
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
                올케어환경은 실내 구조물 해체와 임대차 계약 조건에 맞춘 원상복구 상담을 제공합니다.
                현장 여건에 맞춘 합리적인 견적 산정 기준과 체계적인 반출 절차를 확인해 보세요.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {hasKakao && (
                  <a
                    href={SITE_CONFIG.contact.kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-[#FEE500] px-6 py-3.5 text-sm font-bold text-[#3c1e1e] shadow-sm transition hover:bg-[#FADA0A]"
                  >
                    카카오톡 사진 전송 및 철거 견적 상담
                  </a>
                )}
                {hasPhone && (
                  <a
                    href={`tel:${SITE_CONFIG.contact.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-500 hover:text-orange-600"
                  >
                    전화 상담 문의
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <ImagePlaceholder
                label="철거·원상복구 시공 현장"
                sublabel="실제 철거 작업 현장 사진 반영 예정"
                aspectRatio="video"
                className="w-full shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: CATEGORIES */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              주요 철거 및 원상복구 분야
            </h2>
            <p className="mt-2 text-sm text-slate-600 break-keep sm:text-base">
              상업 공간, 업무 시설, 주거 공간의 구조와 요구 조건에 맞춘 맞춤형 철거를 제공합니다.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMOLITION_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="text-2xl">{cat.icon}</div>
                <h3 className="mt-3 text-base font-bold text-slate-900">{cat.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03: ESTIMATE FACTORS */}
      <section className="border-t border-slate-100 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              철거 견적 산정 기준 6가지
            </h2>
            <p className="mt-2 text-sm text-slate-600 break-keep sm:text-base">
              철거 비용은 단순 평당 단가로 책정되지 않으며, 현장의 제반 구조적 요인과 시공 여건에 따라 결정됩니다.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ESTIMATE_FACTORS.map((factor) => (
              <div
                key={factor.num}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5"
              >
                <div>
                  <span className="text-xs font-black tracking-wider text-orange-600">{factor.num}</span>
                  <h3 className="mt-1 text-base font-bold text-slate-900">{factor.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{factor.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* SECTION 07: CTA FOOTER */}
      <section className="border-t border-slate-100 bg-slate-900 py-12 text-white md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
            철거 범위 및 현장 여건 사진을 보내주세요
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-slate-300 sm:text-sm md:text-base">
            철거할 현장 공간 사진이나 평면도를 남겨주시면, 담당자가 확인 후 구조 및 공사 일정에 맞춘 견적을 신속히 안내해 드립니다.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {hasKakao && (
              <a
                href={SITE_CONFIG.contact.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#FEE500] px-6 py-3.5 text-sm font-bold text-[#3c1e1e] shadow transition hover:bg-[#FADA0A]"
              >
                카카오톡 사진 전송 및 견적 문의
              </a>
            )}
            {hasPhone && (
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-bold text-white shadow transition hover:bg-slate-700"
              >
                전화 상담 ({SITE_CONFIG.contact.phone})
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

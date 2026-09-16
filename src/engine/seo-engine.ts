import type { Metadata } from 'next';
import { PageContext } from '@/types/content';
import { SITE_CONFIG, getAbsoluteUrl } from '@/config/site';
import { getServiceSocialImage } from '@/config/hero-theme';

interface KeywordSeoPhrases {
  supportingTitle: string;
  actionVerb: string;
}

/**
 * 14개 폐기물 (WASTE) 작업 키워드별 안전한 SEO 문구 (과장 및 미검증 표현 배제)
 */
const WASTE_SEO_PHRASES_BY_KEYWORD_ID: Record<string, KeywordSeoPhrases> = {
  'kw-general-disposal': { supportingTitle: '현장 맞춤 수거 안내', actionVerb: '품목과 현장 조건을 확인해 필요한 수거 절차를 안내합니다' },
  'kw-general-company': { supportingTitle: '폐기물 수거 상담', actionVerb: '품목과 현장 조건을 확인해 필요한 수거 방법을 안내합니다' },
  'kw-price-estimate': { supportingTitle: '투명한 견적 및 비용 기준', actionVerb: '품목별 투명한 비용 산정 기준을 안내합니다' },
  'kw-general-short-co': { supportingTitle: '방문 수거 일정 상담', actionVerb: '현장 배출 여건에 맞춘 방문 일정을 상담합니다' },
  'kw-general-collection': { supportingTitle: '실내 방문 반출 상담', actionVerb: '직접 옮기기 어려운 짐의 실내 반출 여건을 확인합니다' },
  'kw-collection-company': { supportingTitle: '대량 폐기물 수거 상담', actionVerb: '많은 물량도 현장 조건에 맞춰 단계별 수거를 안내합니다' },
  'kw-bulky-collection': { supportingTitle: '대형 폐기물 방문 수거 상담', actionVerb: '실내 대형 물품과 무거운 가구·집기의 안전한 반출 여건을 확인합니다' },
  'kw-household': { supportingTitle: '가정집·원룸 짐 정리', actionVerb: '생활 쓰레기와 가구 배출에 필요한 점검 사항을 안내합니다' },
  'kw-furniture': { supportingTitle: '대형 가구 분해 및 반출', actionVerb: '가구 크기와 반출 조건을 먼저 확인합니다' },
  'kw-moving': { supportingTitle: '이사 전후 폐기물 처리', actionVerb: '퇴거 일정에 맞춰 남은 짐의 수거 방안을 상담합니다' },
  'kw-office': { supportingTitle: '사무실 집기 및 파티션 정리', actionVerb: '빌딩 반출 규정과 집기 수량을 고려해 수거 절차를 안내합니다' },
  'kw-commercial': { supportingTitle: '상가 매장 집기 정리', actionVerb: '진열대와 상업용 비품의 반출 여건을 확인합니다' },
  'kw-closure': { supportingTitle: '폐업 정리 실내 비움', actionVerb: '남은 집기와 비품의 일괄 정리 방안을 상담합니다' },
  'kw-business': { supportingTitle: '사업장 불용 자재 수거 상담', actionVerb: '사전 품목 확인을 통해 수거 가능 여부와 절차를 안내합니다' },
  'kw-construction': { supportingTitle: '인테리어 현장 잔재물 상담', actionVerb: '마대 포장 상태와 반출 동선을 확인해 일정을 조율합니다' },
};

/**
 * 9개 철거 (DEMOLITION) P0 키워드별 안전한 SEO 문구 (과장 및 미검증 표현 배제)
 */
const DEMOLITION_SEO_PHRASES_BY_KEYWORD_ID: Record<string, KeywordSeoPhrases> = {
  'kw-demo-general': { supportingTitle: '실내 시설 철거 상담', actionVerb: '철거 범위와 현장 여건을 확인해 안전한 작업 절차를 안내합니다' },
  'kw-demo-company': { supportingTitle: '맞춤 철거 시공 상담', actionVerb: '건물 규정과 공사 범위를 꼼꼼히 확인해 합리적인 시공을 안내합니다' },
  'kw-demo-price': { supportingTitle: '투명한 철거 견적 기준', actionVerb: '마감재 성상과 폐기물 반출 여건에 맞춘 투명한 견적 기준을 안내합니다' },
  'kw-demo-interior': { supportingTitle: '내부 마감재 철거', actionVerb: '구조체를 보호하고 실내 가벽과 마감재를 안전하게 철거합니다' },
  'kw-demo-commercial': { supportingTitle: '상가 매장 시설 철거', actionVerb: '매장 특성과 원상회복 인도 기준에 맞춰 시설물 철거를 안내합니다' },
  'kw-demo-office': { supportingTitle: '사무실 가벽 및 원상복구', actionVerb: '빌딩 출입 규정과 화물 승강기 여건에 맞춘 오피스 철거를 지원합니다' },
  'kw-demo-partial': { supportingTitle: '선별 부분 철거 상담', actionVerb: '살릴 구조물을 안전하게 보호하고 원하는 부위만 선별 철거합니다' },
  'kw-demo-closure': { supportingTitle: '폐업 매장 원상복구 철거', actionVerb: '임대차 계약 만료 일정에 차질 없도록 매장 내부 철거를 진행합니다' },
  'kw-demo-restoration': { supportingTitle: '계약 만료 원상복구 공사', actionVerb: '임대인 인도 기준과 특약 사항을 확인해 필요한 원상복구 범위를 상담합니다' },
};

/**
 * Dynamic PageContext 기반 Next.js Metadata 생성기
 */
export function generatePageMetadata(context: PageContext): Metadata {
  const { dynamicKeyword, canonicalRoute, isIndexable, workKeyword, seoDisplayName, serviceFamily } = context;

  const phrase = serviceFamily === 'DEMOLITION'
    ? (DEMOLITION_SEO_PHRASES_BY_KEYWORD_ID[workKeyword.keywordId] || {
        supportingTitle: '안전 철거 상담',
        actionVerb: '현장 맞춤 철거 절차를 안내합니다',
      })
    : (WASTE_SEO_PHRASES_BY_KEYWORD_ID[workKeyword.keywordId] || {
        supportingTitle: '안전 수거 상담',
        actionVerb: '현장 맞춤 수거 절차를 안내합니다',
      });

  // 1. Title: {Dynamic Keyword} | {Intent Supporting Phrase} | 올케어환경
  const title = `${dynamicKeyword} | ${phrase.supportingTitle} | ${SITE_CONFIG.brandName}`;

  // 2. Meta Description: Problem + Intent + Decision Info + Consultation (Service Family별 차별화)
  const description = serviceFamily === 'DEMOLITION'
    ? `${seoDisplayName} ${workKeyword.displayName} 상담. ${phrase.actionVerb}. 현장 사진과 철거 범위, 승강기 및 건물 여건을 알려주시면 합리적인 견적을 신속히 안내해 드립니다.`
    : `${seoDisplayName} ${workKeyword.displayName} 상담. ${phrase.actionVerb}. 품목 사진과 층수, 엘리베이터 여부를 전달해 주시면 합리적인 견적을 신속히 안내해 드립니다.`;

  // 3. Canonical URL
  const canonicalUrl = getAbsoluteUrl(`/?k=${encodeURIComponent(canonicalRoute)}`);

  // 4. Robots 설정 (Indexability 정책 준수: DEMOLITION은 온홀드 상태로 항상 noindex, follow)
  const shouldIndex = serviceFamily !== 'DEMOLITION' && isIndexable;
  const robots = shouldIndex
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      }
    : {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      };

  const socialImageConfig = getServiceSocialImage(serviceFamily);
  const socialImageUrl = getAbsoluteUrl(socialImageConfig.path);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
    openGraph: {
      title: `${dynamicKeyword} | ${SITE_CONFIG.brandName}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.brandName,
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: socialImageUrl,
          width: socialImageConfig.width,
          height: socialImageConfig.height,
          alt: socialImageConfig.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dynamicKeyword} | ${SITE_CONFIG.brandName}`,
      description,
      images: [socialImageUrl],
    },
  };
}

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
  'kw-general-disposal': { supportingTitle: '폐기물 종류별 처리 절차', actionVerb: '품목 분류와 반출 동선을 사전 확인해 체계적인 수거 절차를 안내합니다' },
  'kw-general-company': { supportingTitle: '전문 수거 업체 안내', actionVerb: '작업 인력 배치와 현장 조건에 맞춘 전문 수거 계획을 안내합니다' },
  'kw-price-estimate': { supportingTitle: '투명한 견적 및 비용 기준', actionVerb: '부피, 무게, 층수, 승강기 여건에 맞춘 투명한 견적 기준을 안내합니다' },
  'kw-general-short-co': { supportingTitle: '신속 현장 방문 수거', actionVerb: '현장 진입 여건과 희망 일정에 맞춘 신속한 방문 수거를 안내합니다' },
  'kw-general-collection': { supportingTitle: '실내 방문 반출 상담', actionVerb: '실내에서 직접 들어내어 상차하는 방문 수거 절차를 안내합니다' },
  'kw-collection-company': { supportingTitle: '대량 수거 전담팀 안내', actionVerb: '맞춤 차량 배차와 수거팀 인력 투입에 따른 일괄 수거를 안내합니다' },
  'kw-bulky-collection': { supportingTitle: '대형 폐기물 해체·반출', actionVerb: '대형 가구와 무거운 집기의 현장 분해 및 안전 반출 여건을 확인합니다' },
  'kw-household': { supportingTitle: '가정집 살림 정리 수거', actionVerb: '가정집 혼합 폐기물과 생활 가구 일괄 수거 절차를 안내합니다' },
  'kw-furniture': { supportingTitle: '가구 분해 및 반출', actionVerb: '침대, 장롱, 소파 등 가구 해체와 출입문 통과 여건을 확인합니다' },
  'kw-moving': { supportingTitle: '이사 전후 퇴거 짐 정리', actionVerb: '퇴거 일정과 이삿짐 반출 시점에 맞춘 잔여 폐기물 처리 방안을 상담합니다' },
  'kw-office': { supportingTitle: '사무실 집기·파티션 정리', actionVerb: '빌딩 화물 승강기 규정과 파티션 해체 작업에 맞춘 오피스 비움을 안내합니다' },
  'kw-commercial': { supportingTitle: '매장 집기·진열대 수거', actionVerb: '상가 주차 여건과 매장 쇼케이스·진열대의 안전한 반출 절차를 안내합니다' },
  'kw-closure': { supportingTitle: '폐업 매장 실내 일괄 비움', actionVerb: '임대차 만료 기한에 맞춘 폐업 매장 집기 일괄 반출 및 비움을 안내합니다' },
  'kw-business': { supportingTitle: '사업장·창고 불용자재 수거', actionVerb: '창고 하차장 진입 여건과 불용 자재 성상 확인을 통한 B2B 수거를 안내합니다' },
  'kw-construction': { supportingTitle: '인테리어 현장 잔재물 수거', actionVerb: '마대 포장 상태와 승강기 보양 여건에 맞춘 건축 잔재물 수거를 안내합니다' },
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

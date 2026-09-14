import { PageContext } from '@/types/content';
import { SITE_CONFIG, getAbsoluteUrl, hasValidContactPhone } from '@/config/site';

/**
 * 구조화 데이터 (Schema.org JSON-LD) 생성기
 */
export function generatePageSchema(context?: PageContext): Record<string, unknown> {
  const siteOrigin = getAbsoluteUrl('/');
  
  // Organization 스키마
  const organizationSchema: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${siteOrigin}#organization`,
    name: SITE_CONFIG.brandName,
    url: siteOrigin,
  };

  // 실제 검증(verification.phoneVerified === true)된 유효 번호만 Schema telephone에 출력
  if (SITE_CONFIG.verification.phoneVerified && hasValidContactPhone(SITE_CONFIG.contact.phone)) {
    organizationSchema.telephone = SITE_CONFIG.contact.phone;
  }

  // 실제 검증(verification.businessVerified === true)된 주소만 Schema address에 출력
  if (SITE_CONFIG.verification.businessVerified && SITE_CONFIG.business.address) {
    organizationSchema.address = {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.business.address,
    };
  }

  // WebSite 스키마
  const webSiteSchema: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': `${siteOrigin}#website`,
    url: siteOrigin,
    name: SITE_CONFIG.brandName,
    publisher: {
      '@id': `${siteOrigin}#organization`,
    },
  };

  const graph: Record<string, unknown>[] = [organizationSchema, webSiteSchema];

  // Dynamic Landing Page일 경우 Service 및 BreadcrumbList 추가
  if (context) {
    const { seoDisplayName, workKeyword, canonicalRoute } = context;
    const pageUrl = getAbsoluteUrl(`/?k=${encodeURIComponent(canonicalRoute)}`);

    // Service 스키마 (serviceType에 human-readable 명칭 매핑)
    const serviceSchema: Record<string, unknown> = {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: `${seoDisplayName} ${workKeyword.displayName}`,
      serviceType: `${workKeyword.displayName} 서비스`,
      provider: {
        '@id': `${siteOrigin}#organization`,
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: seoDisplayName,
      },
    };

    // BreadcrumbList 스키마
    const breadcrumbSchema: Record<string, unknown> = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: siteOrigin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: `${seoDisplayName} ${workKeyword.displayName}`,
          item: pageUrl,
        },
      ],
    };

    graph.push(serviceSchema, breadcrumbSchema);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

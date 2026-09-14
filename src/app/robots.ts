import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/config/site';

/**
 * Next.js App Router robots.txt 생성기 (/robots.txt)
 * - Production 환경에서 SITE_ORIGIN Safety Guard를 통해 localhost 누출 차단
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}

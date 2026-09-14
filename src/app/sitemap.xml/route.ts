import { NextResponse } from 'next/server';
import { generateRootSitemapIndexXml } from '@/lib/sitemap-generator';

/**
 * Root Sitemap Index 핸들러 (/sitemap.xml)
 * - 외부 검색엔진(Naver, Google) 공식 제출 단일 진입점
 * - <sitemapindex> 규격 반환
 */
export async function GET() {
  const xml = generateRootSitemapIndexXml();

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

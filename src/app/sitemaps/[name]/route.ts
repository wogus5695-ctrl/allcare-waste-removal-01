import { NextResponse } from 'next/server';
import { getChildSitemapXml } from '@/lib/sitemap-generator';

interface RouteProps {
  params: Promise<{ name: string }>;
}

/**
 * Child Sitemap 핸들러 (/sitemaps/[name])
 * - /sitemaps/core.xml (Core URLs: /, /hub)
 * - /sitemaps/waste-gyeonggi-001.xml (840 Dynamic URLs)
 * - 유효하지 않은 파일 요청 시 404 반환 (예: waste-gyeonggi-999.xml)
 */
export async function GET(_request: Request, { params }: RouteProps) {
  const { name } = await params;
  const xml = getChildSitemapXml(name);

  if (!xml) {
    return new NextResponse('Sitemap Not Found', { status: 404 });
  }

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

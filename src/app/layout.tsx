import type { Metadata } from 'next';
import './globals.css';
import { SITE_CONFIG } from '@/config/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCta } from '@/components/FloatingCta';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.brandName} - 체계적인 폐기물 수거 및 현장 정리 상담`,
  description: '가정 및 사업장 폐기물 수거, 대형 가구 반출, 이사 폐기물 정리 상담 전문 올케어환경입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-white text-slate-800 antialiased">
        <Header />
        <div className="flex-1 pb-20 md:pb-0">
          {children}
        </div>
        <FloatingCta />
        <Footer />
      </body>
    </html>
  );
}

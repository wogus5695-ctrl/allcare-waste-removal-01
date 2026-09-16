import type { Metadata } from 'next';
import './globals.css';
import { SITE_CONFIG } from '@/config/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCta } from '@/components/FloatingCta';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.brandName} - 체계적인 폐기물 수거 및 현장 정리 상담`,
  description: '가정 및 사업장 폐기물 수거, 대형 가구 반출, 이사 폐기물 정리 상담 전문 올케어환경입니다.',
  verification: {
    other: {
      'naver-site-verification': '7d4871946d9a18a800f8385beb07d5da9e3d0af7',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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

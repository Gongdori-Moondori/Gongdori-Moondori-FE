import type { Metadata } from 'next';
import './globals.css';
import AppWrapper from '@/components/AppWrapper';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Rzi Mobile App',
  description: '모바일 최적화된 Rzi 애플리케이션',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/manifestImage.svg',
    icon: '/icons/manifestImage.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rzi App" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/manifestImage.svg" />
      </head>
      <body className="mobile-app-container safe-area-top safe-area-bottom">
        <Providers>
          <AppWrapper>
            <div className="mobile-scroll">{children}</div>
          </AppWrapper>
        </Providers>
      </body>
    </html>
  );
}

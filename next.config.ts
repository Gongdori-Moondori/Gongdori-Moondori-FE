import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  // Next.js 15에서는 appDir이 기본값이므로 제거

  // 이미지 도메인 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.apigw.ntruss.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const isDev = process.env.NODE_ENV === 'development';

export default isDev ? nextConfig : withPWA(nextConfig);

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';
import { AuthAPI } from '@/lib/api/diplomats';
import PWAInstallPrompt from './PWAInstallPrompt';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 인증이 필요하지 않은 페이지들
  const publicPaths = ['/auth/login', '/auth/signup', '/oauth2/redirect'];

  useEffect(() => {
    // 이전에 스플래시를 본 적이 있는지 확인 (세션 동안만)
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if (hasSeenSplash) {
      setShowSplash(false);
      setIsFirstLoad(false);
    }
  }, []);

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await AuthAPI.currentUser();
        if (response.success && response.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    if (!showSplash) {
      checkAuth();
    }
  }, [showSplash]);

  // 인증 상태에 따른 리다이렉팅
  useEffect(() => {
    if (isAuthenticated === false && !publicPaths.includes(pathname)) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, pathname, router]);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  if (showSplash && isFirstLoad) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // 인증이 필요한 페이지에서 로딩 중일 때
  if (isAuthenticated === null && !publicPaths.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <PWAInstallPrompt />
    </>
  );
}

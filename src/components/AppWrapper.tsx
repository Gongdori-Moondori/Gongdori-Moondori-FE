'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // 이전에 스플래시를 본 적이 있는지 확인 (세션 동안만)
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if (hasSeenSplash) {
      setShowSplash(false);
      setIsFirstLoad(false);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  if (showSplash && isFirstLoad) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <>{children}</>;
}

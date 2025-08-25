'use client';

import BottomNavigation from '@/components/layout/BottomNavigation';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import MarketSelector from '@/components/home/MarketSelector';
import AIChatBot from '@/components/home/AIChatBot';
import TopThreeProducts from '@/components/home/TopThreeProducts';
import AllProductsSection from '@/components/home/AllProductsSection';
import { useState, useEffect } from 'react';
import { marketAPI } from '@/lib/api/client';

interface Market {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

export default function Home() {
  const [currentUser] = useState({ id: 1, name: '이예림' });
  const [activeMarket, setActiveMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 간단한 데이터 로딩 시뮬레이션
    const loadData = async () => {
      try {
        const data = await marketAPI.getMarkets();
        const active = data.find((m: Market) => m.isActive);
        setActiveMarket(active || data[0]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMarketChange = (market: Market) => {
    setActiveMarket(market);
    console.log('Market changed to:', market.name);
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-foreground gap-1">
      <WelcomeHeader userName={currentUser?.name || '이예림'} />
      <MarketSelector
        selectedMarketId={activeMarket?.id}
        onMarketChange={handleMarketChange}
      />
      <main className="flex-1 px-6 py-6 pb-20">
        <AIChatBot userName={currentUser?.name || '이예림'} />

        <TopThreeProducts userName={currentUser?.name || '이예림'} />

        <AllProductsSection maxSavings={15000} />
      </main>

      <BottomNavigation />
    </div>
  );
}

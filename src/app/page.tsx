'use client';

import BottomNavigation from '@/components/layout/BottomNavigation';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import MarketSelector from '@/components/home/MarketSelector';
import AIChatBot from '@/components/home/AIChatBot';
import TopThreeProducts from '@/components/home/TopThreeProducts';
import AllProductsSection from '@/components/home/AllProductsSection';
import { useState, useEffect } from 'react';
import { PriceDataAPI, AuthAPI, RecommendationAPI } from '@/lib/api/diplomats';
import type { MarketRecommendationResponse } from '@/lib/api/types';

interface Market {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [activeMarket, setActiveMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [marketRecommendations, setMarketRecommendations] =
    useState<MarketRecommendationResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) 현재 사용자 불러오기
        try {
          const me = await AuthAPI.currentUser();
          const user =
            (me?.data as { userId?: string | number; name?: string }) || null;
          if (user) {
            setCurrentUser({
              id: Number(user.userId) || 0,
              name: user.name || '사용자',
            });
          } else {
            setCurrentUser({ id: 0, name: '사용자' });
          }
        } catch {
          setCurrentUser({ id: 0, name: '사용자' });
        }

        // 2) 마켓 목록 불러오기
        const res = await PriceDataAPI.getItemLists();
        const names = res.data?.marketNames || [];
        const mapped: Market[] = names.map((n: string, idx: number) => ({
          id: idx + 1,
          name: n,
          location: '',
          isActive: idx === 0,
        }));
        setActiveMarket(mapped[0] || null);
      } catch (error) {
        console.error('Failed to load market names:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 시장이 변경될 때마다 해당 시장의 추천 데이터 로드
  useEffect(() => {
    const loadMarketRecommendations = async () => {
      if (!activeMarket?.name) return;

      try {
        const res = await RecommendationAPI.getComprehensive(activeMarket.name);
        if (res.success) {
          setMarketRecommendations(res.data);
        }
      } catch (error) {
        console.error('Failed to load market recommendations:', error);
        setMarketRecommendations(null);
      }
    };

    loadMarketRecommendations();
  }, [activeMarket?.name]);

  const handleMarketChange = (market: Market) => {
    setActiveMarket(market);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-foreground gap-1">
      <WelcomeHeader userName={currentUser?.name || '사용자'} />
      <MarketSelector
        selectedMarketId={activeMarket?.id}
        onMarketChange={handleMarketChange}
      />
      <main className="flex-1 px-6 py-6 pb-20">
        <AIChatBot
          userName={currentUser?.name || '사용자'}
          seasonalRecommendations={
            marketRecommendations?.seasonalRecommendations
          }
        />

        <TopThreeProducts
          userName={currentUser?.name || '사용자'}
          marketId={activeMarket?.id}
          marketName={activeMarket?.name}
          savingRecommendations={marketRecommendations?.savingRecommendations}
        />

        <AllProductsSection
          maxSavings={marketRecommendations?.summary?.maxSavingAmount || 15000}
          marketName={activeMarket?.name}
          marketId={activeMarket?.id}
          marketVsMartComparisons={
            marketRecommendations?.marketVsMartComparisons
          }
        />
      </main>

      <BottomNavigation />
    </div>
  );
}

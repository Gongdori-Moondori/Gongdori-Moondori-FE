'use client';

import BottomNavigation from '@/components/layout/BottomNavigation';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import MarketSelector from '@/components/home/MarketSelector';
import AIChatBot from '@/components/home/AIChatBot';
import TopThreeProducts from '@/components/home/TopThreeProducts';
import AllProductsSection from '@/components/home/AllProductsSection';
import { useState, useEffect } from 'react';
import {
  PriceDataAPI,
  AuthAPI,
  RecommendationAPI,
  ShoppingAPI,
} from '@/lib/api/diplomats';

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
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketRecommendations, setMarketRecommendations] =
    useState<unknown>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) 현재 사용자 불러오기
        try {
          const me = await AuthAPI.currentUser();
          if (me?.success && me.data) {
            const user = me.data;
            setCurrentUser({
              id: Number(user.userId) || 0,
              name: user.name || '사용자',
            });
          } else {
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          setCurrentUser(null);
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
        setMarkets(mapped);
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

      setLoading(true);
      try {
        const res = await RecommendationAPI.getComprehensive(activeMarket.name);
        if (res.success) {
          setMarketRecommendations(res.data);
        }
      } catch (error) {
        console.error('Failed to load market recommendations:', error);
        setMarketRecommendations(null);
      } finally {
        setLoading(false);
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

  // 사용자가 로그인되지 않은 경우 (AppWrapper에서 이미 리다이렉팅 처리됨)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-foreground gap-1">
      <WelcomeHeader userName={currentUser.name} />
      <MarketSelector
        selectedMarketId={activeMarket?.id}
        onMarketChange={handleMarketChange}
        markets={markets}
      />
      <main className="flex-1 px-6 py-6 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">시장 데이터 로딩 중...</p>
            </div>
          </div>
        ) : (
          <>
            <AIChatBot
              userName={currentUser.name}
              seasonalRecommendations={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (marketRecommendations as any)?.seasonalRecommendations
              }
            />

            <TopThreeProducts
              userName={currentUser.name}
              marketId={activeMarket?.id}
              marketName={activeMarket?.name}
              savingRecommendations={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (marketRecommendations as any)?.savingRecommendations
              }
            />

            <AllProductsSection
              maxSavings={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (marketRecommendations as any)?.summary?.maxSavingAmount ||
                15000
              }
              marketName={activeMarket?.name}
              marketId={activeMarket?.id}
              marketVsMartComparisons={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (marketRecommendations as any)?.marketVsMartComparisons
              }
            />
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

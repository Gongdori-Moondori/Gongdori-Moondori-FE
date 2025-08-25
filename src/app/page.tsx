'use client';

import BottomNavigation from '@/components/layout/BottomNavigation';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import MarketSelector from '@/components/home/MarketSelector';
import AIChatBot from '@/components/home/AIChatBot';
import TopThreeProducts from '@/components/home/TopThreeProducts';
import AllProductsSection from '@/components/home/AllProductsSection';
import {
  useCurrentUser,
  useActiveMarket,
  useSetActiveMarket,
  useSeasonalRecommendation,
  useTopProducts,
  useProducts,
  useAddToCart,
  useToggleFavorite,
  useFavorites,
} from '@/lib/api/hooks';
import { Market } from '@/lib/api/types';

export default function Home() {
  // API 데이터 가져오기
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: activeMarket, isLoading: marketLoading } = useActiveMarket();
  const { data: seasonalRecommendation } = useSeasonalRecommendation();
  const {
    data: topProducts,
    isLoading: topProductsLoading,
    error: topProductsError,
    refetch: refetchTopProducts,
  } = useTopProducts(activeMarket?.id);
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts(activeMarket?.id);
  const { data: favorites } = useFavorites();

  // API mutations
  const setActiveMarketMutation = useSetActiveMarket();
  const addToCartMutation = useAddToCart();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleMarketChange = (market: Market) => {
    console.log('Market changed to:', market.name);
    // MarketSelector 내부에서 이미 setActiveMarket을 호출하므로 추가 작업 불필요
  };

  const handleAddToCart = (productId: string) => {
    if (!currentUser) return;

    addToCartMutation.mutate({
      productId: parseInt(productId),
      userId: currentUser.id,
      quantity: 1,
    });
  };

  const handleToggleFavorite = (productId: string) => {
    if (!currentUser) return;

    toggleFavoriteMutation.mutate({
      userId: currentUser.id,
      productId: parseInt(productId),
    });
  };

  // 로딩 상태 처리
  if (userLoading || marketLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 상품 데이터 가공
  const productsWithFavorites = products?.map((product) => ({
    ...product,
    id: product.id.toString(),
    isFavorite: favorites?.some((fav) => fav.productId === product.id) || false,
  }));

  // TOP 3 상품 데이터 가공
  const topProductsData = topProducts?.map((product) => ({
    id: product.id.toString(),
    emoji: product.emoji,
    name: product.name,
    description: product.description,
    savings: product.savings,
    actionText: product.actionText,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-foreground gap-6">
      <WelcomeHeader userName={currentUser?.name || '이예림'} />
      <MarketSelector
        selectedMarketId={activeMarket?.id}
        onMarketChange={handleMarketChange}
      />
      {/* <main className="flex-1 px-6 py-6 pb-20">
        <AIChatBot
          userName={currentUser?.name || '이예림'}
          recommendedItem={
            seasonalRecommendation
              ? {
                  emoji: seasonalRecommendation.emoji,
                  name: seasonalRecommendation.name,
                  message: seasonalRecommendation.message,
                }
              : {
                  emoji: '🍉',
                  name: '수박',
                  message: '지금 이 시기에는',
                }
          }
        />

        <TopThreeProducts
          products={topProductsData}
          isLoading={topProductsLoading}
          error={topProductsError?.message}
          onRetry={() => refetchTopProducts()}
        />

        <AllProductsSection
          maxSavings={15000}
          products={productsWithFavorites}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          isLoading={productsLoading}
          error={productsError?.message}
          onRetry={() => refetchProducts()}
        />
      </main> */}

      <BottomNavigation />
    </div>
  );
}

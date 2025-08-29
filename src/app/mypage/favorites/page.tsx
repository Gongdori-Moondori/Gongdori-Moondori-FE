'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useFavorites, useRemoveFavorite } from '@/lib/api/hooks';
import { ShoppingAPI, AuthAPI } from '@/lib/api/diplomats';

interface Product {
  id: string;
  emoji: string;
  name: string;
  category: string;
  marketPrice: number;
  supermarketPrice: number;
  savings: number;
  marketId: number;
  inStock: boolean;
}

interface FavoriteProduct extends Product {
  addedAt: string;
  favoriteId: string;
}

export default function FavoritesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [currentUser, setCurrentUser] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  // API 훅 사용
  const { data: favoritesData, isLoading: loading, error } = useFavorites();
  const removeFavorite = useRemoveFavorite();

  // 현재 사용자 정보 로드
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await AuthAPI.currentUser();
        if (response?.success && response.data) {
          setCurrentUser({
            userId: response.data.userId,
            name: response.data.name,
          });
        }
      } catch (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다:', error);
      }
    };

    loadCurrentUser();
  }, []);

  // API 응답 구조 확인을 위한 디버깅
  console.log('favoritesData:', favoritesData);

  // 기존 데이터 구조에 맞게 변환 (API 응답 구조에 맞춤)
  const favoriteProducts =
    (
      favoritesData?.data as {
        favorites?: Array<{
          id: number;
          itemName: string;
          itemCategory: string;
          favoritePrice: number;
          createdAt: string;
        }>;
      }
    )?.favorites?.map((fav) => ({
      id: fav.id.toString(),
      emoji: '/assets/tomato.svg', // 기본 이모지
      name: fav.itemName,
      category: fav.itemCategory,
      marketPrice: fav.favoritePrice,
      supermarketPrice: fav.favoritePrice * 1.2, // 임시로 20% 높게 설정
      savings: fav.favoritePrice * 0.2, // 임시로 20% 절약으로 설정
      marketId: 0,
      inStock: true,
      addedAt: fav.createdAt,
      favoriteId: fav.id.toString(),
    })) || [];

  const markets = [
    { id: '0', name: '경동시장', location: '동대문구', isActive: true },
  ];

  const getMarketName = (marketId: number) => {
    const market = markets.find((m) => parseInt(m.id) === marketId);
    return market ? market.name : '알 수 없는 마트';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const removeFromFavorites = async (favoriteId: string) => {
    try {
      // API를 통해 즐겨찾기 제거
      const itemName =
        favoriteProducts.find(
          (item: FavoriteProduct) => item.favoriteId === favoriteId
        )?.name || '';
      if (!itemName) {
        alert('상품을 찾을 수 없습니다.');
        return;
      }

      await removeFavorite.mutateAsync({ favoriteId });
      alert(`${itemName}을(를) 즐겨찾기에서 제거했습니다.`);
    } catch (err) {
      console.error('즐겨찾기 삭제에 실패했습니다:', err);
      alert('즐겨찾기 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const addToCart = async (product: FavoriteProduct) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await ShoppingAPI.addItem({
        itemName: product.name,
        quantity: 1,
        category: product.category,
        memo: `즐겨찾기에서 추가: ${product.name}`,
      });

      if (response.success) {
        alert(`${product.name}이(가) 장보기 리스트에 추가되었습니다!`);
      } else {
        alert('장보기 리스트 추가에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('장보기 리스트 추가에 실패했습니다:', err);
      alert('장보기 리스트 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const getFilteredProducts = () => {
    if (selectedCategory === '전체') {
      return favoriteProducts;
    }
    return favoriteProducts.filter(
      (product: FavoriteProduct) => product.category === selectedCategory
    );
  };

  const getCategories = () => {
    const categories = Array.from(
      new Set(favoriteProducts.map((p: FavoriteProduct) => p.category))
    );
    return ['전체', ...categories] as string[];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageHeader title="즐겨찾기" showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageHeader title="즐겨찾기" showBackButton />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorMessage message="즐겨찾기를 불러오는데 실패했습니다." />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-foreground">
      <PageHeader title="즐겨찾기" showBackButton className="bg-white" />

      <main className="flex-1 p-6 pb-20">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-semibold mb-2">
              즐겨찾기가 비어있어요
            </h3>
            <p className="text-gray-500 text-center">
              마음에 드는 상품을 즐겨찾기에 추가해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 즐겨찾기 통계 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">즐겨찾기 현황</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">
                    {favoriteProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">즐겨찾기 상품</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">
                    {favoriteProducts
                      .reduce(
                        (total: number, item: FavoriteProduct) =>
                          total + item.savings,
                        0
                      )
                      .toLocaleString()}
                    원
                  </div>
                  <div className="text-sm text-gray-600">총 절약 가능 금액</div>
                </div>
              </div>
            </div>

            {/* 카테고리별 필터 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">카테고리별 보기</h3>
              <div className="flex flex-wrap gap-2">
                {getCategories().map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {category} (
                    {category === '전체'
                      ? favoriteProducts.length
                      : favoriteProducts.filter(
                          (p: FavoriteProduct) => p.category === category
                        ).length}
                    )
                  </button>
                ))}
              </div>
            </div>

            {/* 즐겨찾기 상품 리스트 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                즐겨찾기 상품 ({getFilteredProducts().length}개)
              </h2>
              {getFilteredProducts().map((item: FavoriteProduct) => (
                <div
                  key={item.favoriteId}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.emoji}
                        alt={item.name}
                        className="w-12 h-12"
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-xs text-gray-500">
                          {getMarketName(item.marketId)}
                        </p>
                        <p className="text-xs text-gray-400">
                          추가일: {formatDate(item.addedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {item.marketPrice.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {item.supermarketPrice.toLocaleString()}원
                      </div>
                      <div className="text-sm text-primary-500">
                        {item.savings.toLocaleString()}원 절약
                      </div>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
                        >
                          담기
                        </button>
                        <button
                          onClick={() => removeFromFavorites(item.favoriteId)}
                          className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded hover:bg-red-200 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 재고 상태 */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.inStock
                            ? 'bg-secondary-100 text-primary-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {/* {item.inStock ? '재고 있음' : '재고 없음'} */}
                      </span>
                      <div className="text-xs text-gray-500">
                        대형마트 대비{' '}
                        {((item.savings / item.supermarketPrice) * 100).toFixed(
                          1
                        )}
                        % 절약
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

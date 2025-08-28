'use client';

import { useEffect, useState } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

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

interface Favorite {
  id: string;
  productId: number;
  userId: number;
  addedAt: string;
}

interface Market {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface FavoriteProduct extends Product {
  addedAt: string;
  favoriteId: string;
}

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    []
  );
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/db.json');
      const data = await response.json();

      const favorites: Favorite[] = data.favorites || [];
      const products: Product[] = data.products || [];
      const markets: Market[] = data.markets || [];

      // 즐겨찾기와 상품 데이터를 조합
      const favoriteProductsData = favorites
        .map((favorite) => {
          const product = products.find(
            (p) => parseInt(p.id) === favorite.productId
          );
          if (product) {
            return {
              ...product,
              addedAt: favorite.addedAt,
              favoriteId: favorite.id,
            };
          }
          return null;
        })
        .filter(Boolean) as FavoriteProduct[];

      setFavoriteProducts(favoriteProductsData);
      setMarkets(markets);
    } catch (err) {
      setError('즐겨찾기를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      // 실제 API 호출 대신 로컬 상태 업데이트
      setFavoriteProducts((prev) =>
        prev.filter((item) => item.favoriteId !== favoriteId)
      );
    } catch (err) {
      setError('즐겨찾기 삭제에 실패했습니다.');
    }
  };

  const addToCart = async (product: FavoriteProduct) => {
    try {
      // 실제 API 호출 대신 알림 표시
      alert(`${product.name}이(가) 장보기 리스트에 추가되었습니다!`);
    } catch (err) {
      setError('장보기 리스트 추가에 실패했습니다.');
    }
  };

  const getFilteredProducts = () => {
    if (selectedCategory === '전체') {
      return favoriteProducts;
    }
    return favoriteProducts.filter(
      (product) => product.category === selectedCategory
    );
  };

  const getCategories = () => {
    const categories = Array.from(
      new Set(favoriteProducts.map((p) => p.category))
    );
    return ['전체', ...categories];
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
          <ErrorMessage message={error} />
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
                      .reduce((total, item) => total + item.savings, 0)
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
                      : favoriteProducts.filter((p) => p.category === category)
                          .length}
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
              {getFilteredProducts().map((item) => (
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

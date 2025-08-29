import Image from 'next/image';
import { useState } from 'react';
import {
  ShoppingAPI,
  isAuthenticated,
  logAuthStatus,
} from '@/lib/api/diplomats';
import type { SavingRecommendationItem } from '@/lib/api/types';

interface TopThreeProductsProps {
  userName?: string;
  marketId?: number; // 현재 선택된 마켓 ID
  marketName?: string; // 현재 선택된 마켓 이름
  savingRecommendations?: SavingRecommendationItem[];
}

interface SimpleTopProduct {
  id: number;
  emoji: string;
  name: string;
  savings: number;
  currentPrice: number;
}

export default function TopThreeProducts({
  userName = '사용자',
  marketName = '경동시장',
  savingRecommendations = [],
}: TopThreeProductsProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [favoriteItems, setFavoriteItems] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<Set<number>>(
    new Set()
  );

  // 장바구니 추가 함수
  const handleAddToCart = async (
    productId: number,
    itemName: string,
    category: string
  ) => {
    if (loadingItems.has(productId)) return;

    // 인증 상태 확인
    if (!isAuthenticated()) {
      window.alert('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    setLoadingItems((prev) => new Set([...prev, productId]));

    try {
      // 디버깅: 현재 인증 상태 확인
      logAuthStatus();

      await ShoppingAPI.addItem({
        itemName,
        quantity: 1,
        category,
        memo: `${itemName} TOP3 상품 장바구니 추가`,
      });

      // 성공 메시지 표시
      if (typeof window !== 'undefined') {
        window.alert(`${itemName}이(가) 장바구니에 추가되었습니다!`);
      }
    } catch (error: unknown) {
      console.error('장바구니 추가 중 오류:', error);
      const axiosError = error as {
        response?: { data?: unknown; status?: number };
      };
      console.error('Error response:', axiosError.response?.data);
      console.error('Error status:', axiosError.response?.status);

      if (typeof window !== 'undefined') {
        if (axiosError.response?.status === 403) {
          window.alert('권한이 없습니다. 로그인을 다시 확인해주세요.');
        } else {
          window.alert('장바구니 추가 중 오류가 발생했습니다.');
        }
      }
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // 즐겨찾기 추가/제거 함수
  const handleToggleFavorite = async (productId: number, itemName: string) => {
    if (favoriteLoading.has(productId)) return;

    // 인증 상태 확인
    if (!isAuthenticated()) {
      window.alert('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    setFavoriteLoading((prev) => new Set([...prev, productId]));

    try {
      if (!favoriteItems.has(productId)) {
        // 즐겨찾기 추가
        const product = products.find((p) => p.id === productId);
        if (!product) {
          throw new Error('상품을 찾을 수 없습니다.');
        }

        await ShoppingAPI.addFavoriteItem({
          itemName,
          marketName,
          price: product.currentPrice, // 실제 가격 정보 사용
          priceUnit: '1kg', // 기본 단위
          memo: `${itemName} TOP3 상품 즐겨찾기 추가`,
        });

        setFavoriteItems((prev) => new Set([...prev, productId]));
        window.alert(`${itemName}이(가) 즐겨찾기에 추가되었습니다!`);
      } else {
        // 즐겨찾기 제거 (실제 API 호출은 생략, 로컬 상태만 업데이트)
        setFavoriteItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        window.alert(`${itemName}이(가) 즐겨찾기에서 제거되었습니다.`);
      }
    } catch (error) {
      console.error('즐겨찾기 처리 중 오류:', error);
      window.alert('즐겨찾기 처리 중 오류가 발생했습니다.');
    } finally {
      setFavoriteLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // props로 받은 데이터를 직접 변환
  const products: SimpleTopProduct[] =
    savingRecommendations && savingRecommendations.length > 0
      ? savingRecommendations.slice(0, 3).map((item, idx) => ({
          id: idx + 1,
          emoji: '/assets/tomato.svg',
          name: item.itemName,
          savings: item.savingAmount,
          currentPrice: item.currentPrice, // 실제 가격 정보 추가
        }))
      : [];

  const isLoading = false; // props로 받은 데이터를 사용하므로 로딩 상태 불필요

  const onRetry = () => {
    // 에러가 발생했을 때 재시도 로직
    setError(null);
  };

  if (error) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">TOP 3</h2>
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <div className="text-red-500 mb-2">
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm mb-3">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col items-start gap-3">
        <Image src="/assets/graph.svg" alt="그래프" width={40} height={40} />
        <span className="font-semibold">{userName}님을 위해 모아봤어요</span>
      </div>
      <p className="text-lg text-gray-500 font-medium ">
        지난주에 비해{' '}
        <span className="text-primary-400 font-semibold">할인된 상품</span>
        이에요
      </p>
      <h2 className="text-lg font-bold mb-4">TOP 3</h2>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-4 border border-gray-200 touch-feedback"
            >
              <div className="flex flex-row gap-4">
                <div className="flex flex-col items-center justify-center gap-3 ">
                  <Image
                    src={product.emoji}
                    alt={product.name}
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{product.name}을 구매하면</span>
                  <p className="text-sm text-gray-600 mb-3">
                    {Math.floor(product.savings).toLocaleString()}원 절약할 수
                    있어요
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  {product.name} 구매하고
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">내 지갑 지키기</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-2">
                {/* 장바구니 추가 버튼 */}
                <button
                  onClick={() =>
                    handleAddToCart(product.id, product.name, '채소류')
                  }
                  disabled={loadingItems.has(product.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 
                    ${
                      loadingItems.has(product.id)
                        ? 'bg-primary-400 text-white cursor-wait'
                        : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow-md active:scale-95'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {loadingItems.has(product.id) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>담는중...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H3m4 10v4a2 2 0 002 2h8a2 2 0 002-2v-4M7 13l-2-8m0 0h16"
                        />
                      </svg>
                      <span>담기</span>
                    </>
                  )}
                </button>

                {/* 즐겨찾기 버튼 */}
                <button
                  onClick={() => handleToggleFavorite(product.id, product.name)}
                  disabled={favoriteLoading.has(product.id)}
                  className={`
                    p-2.5 rounded-lg transition-all duration-200 border
                    ${
                      favoriteItems.has(product.id)
                        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 active:bg-red-200'
                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200'
                    }
                    ${favoriteLoading.has(product.id) ? 'animate-pulse' : 'hover:shadow-sm active:scale-95'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {favoriteLoading.has(product.id) ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      className={`w-5 h-5 transition-all duration-200 ${favoriteItems.has(product.id) ? 'scale-110' : ''}`}
                      fill={
                        favoriteItems.has(product.id) ? 'currentColor' : 'none'
                      }
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

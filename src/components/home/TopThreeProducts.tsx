import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { topProductAPI } from '@/lib/api/client';
import { TopProduct } from '@/lib/api/types';

interface TopThreeProductsProps {
  userName?: string;
  marketId?: number; // 현재 선택된 마켓 ID
}

export default function TopThreeProducts({
  userName = '사용자',
  marketId = 1, // 기본값으로 첫 번째 마켓 선택
}: TopThreeProductsProps) {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('TopThreeProducts: Fetching data for marketId:', marketId);

      const topProducts = await topProductAPI.getTopProducts(marketId);
      const limitedProducts = topProducts.slice(0, 3); // TOP 3만 가져오기

      console.log('TopThreeProducts: Fetched products:', limitedProducts);
      setProducts(limitedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [marketId]);

  useEffect(() => {
    fetchTopProducts();
  }, [fetchTopProducts]);

  const onRetry = () => {
    fetchTopProducts();
  };

  const handleProductClick = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      alert(`${product.name}이(가) 장보기 리스트에 추가되었습니다!`);
    }
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
              onClick={() => handleProductClick(product.id)}
            >
              <div className="flex flex-row gap-4">
                <div className="flex flex-col items-center justify-center gap-3 ">
                  {product.emoji.startsWith('/') ? (
                    <Image
                      src={product.emoji}
                      alt={product.name}
                      width={24}
                      height={24}
                    />
                  ) : (
                    <span className="text-2xl">{product.emoji}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">
                    지금 {product.name} 구매하면
                  </span>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.savings.toLocaleString()}원을 절약할 수 있어요
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {product.name} 구매하고
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {product.savings.toLocaleString()}원 절약하기
                  </span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

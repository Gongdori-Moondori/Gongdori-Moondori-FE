import Image from 'next/image';

interface Product {
  id: string;
  emoji: string;
  name: string;
  description: string;
  savings: number;
  actionText: string;
}

interface TopThreeProductsProps {
  products?: Product[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    emoji: '🍅',
    name: '토마토(물)',
    description: '지금 토마토(물) 구매하면',
    savings: 4000,
    actionText: '토마토 구매하고',
  },
  {
    id: '2',
    emoji: '🥕',
    name: '당근(물)',
    description: '지금 당근(물) 구매하면',
    savings: 8000,
    actionText: '당근 구매하고',
  },
  {
    id: '3',
    emoji: '🥩',
    name: '삼겹살(200g)(물)',
    description: '지금 삼겹살(200g)(물) 구매하면',
    savings: 8000,
    actionText: '당근 구매하고',
  },
];

export default function TopThreeProducts({
  products = defaultProducts,
  isLoading = false,
  error,
  onRetry,
}: TopThreeProductsProps) {
  const handleProductClick = (productId: string) => {
    console.log(`Product ${productId} clicked`);
    // 상품 상세 페이지로 이동하는 로직 구현
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
              className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
      <div className="flex items-center gap-2 text-blue-500 text-sm">
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.003 8.003 0 01-7.799-6.666M3 12c0-4.418 3.582-8 8-8s8 3.582 8 8"
          />
        </svg>
        {/* <span>{userName}님을 위해 모아봤어요</span> */}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        지난주에 비해{' '}
        <span className="text-blue-600 font-medium">할인된 상품</span>이에요
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
              <div className="flex items-center gap-3 mb-2">
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
                <span className="font-medium">{product.description}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {product.savings.toLocaleString()}원을 절약할 수 있어요
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {product.actionText}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
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

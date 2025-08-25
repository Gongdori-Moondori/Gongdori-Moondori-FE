import ProductCard from './ProductCard';

interface ProductData {
  id: string;
  emoji: string;
  name: string;
  savings: number;
  marketPrice: number;
  supermarketPrice: number;
  isFavorite?: boolean;
}

interface AllProductsSectionProps {
  maxSavings?: number;
  products?: ProductData[];
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

const defaultProducts: ProductData[] = [
  {
    id: 'tomato-1',
    emoji: '🍅',
    name: '토마토',
    savings: 2000,
    marketPrice: 3000,
    supermarketPrice: 5000,
    isFavorite: false,
  },
  {
    id: 'tomato-2',
    emoji: '🍅',
    name: '토마토',
    savings: 2000,
    marketPrice: 3000,
    supermarketPrice: 5000,
    isFavorite: false,
  },
];

export default function AllProductsSection({
  maxSavings = 15000,
  products = defaultProducts,
  onAddToCart,
  onToggleFavorite,
  isLoading = false,
  error,
  onRetry,
}: AllProductsSectionProps) {
  if (error) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🛒</span>
          <span className="font-bold">지금 전체 상품을 이용하며</span>
        </div>
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
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🛒</span>
        <span className="font-bold">지금 전체 상품을 이용하며</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        대형마트보다 최대{' '}
        <span className="text-green-600 font-bold">
          {maxSavings.toLocaleString()}원
        </span>
        이 싸요
      </p>

      {/* 상품 카드들 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="space-y-1 mb-3">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

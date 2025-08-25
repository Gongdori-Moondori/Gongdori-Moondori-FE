interface ProductCardProps {
  id: string;
  emoji: string;
  name: string;
  savings: number;
  marketPrice: number;
  supermarketPrice: number;
  marketName?: string;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  id,
  emoji,
  name,
  savings,
  marketPrice,
  supermarketPrice,
  marketName = '경동시장',
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 touch-feedback">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{emoji}</span>
        <span className="font-medium text-sm">{name}</span>
      </div>
      <p className="text-green-600 font-bold text-lg mb-3">
        {savings.toLocaleString()}원 저렴해요
      </p>
      <div className="space-y-1 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span>🏪</span>
          <span>
            {marketName} {marketPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>🏪</span>
          <span>대형마트 {supermarketPrice.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <button onClick={handleAddToCart} className="p-1 touch-feedback">
          <svg
            className="w-5 h-5 text-green-500"
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
        </button>
        <button onClick={handleToggleFavorite} className="p-1 touch-feedback">
          <svg
            className={`w-5 h-5 ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
            fill={isFavorite ? 'currentColor' : 'none'}
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
        </button>
      </div>
    </div>
  );
}

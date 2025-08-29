import Image from 'next/image';
import { useState } from 'react';
import { AiOutlineNotification } from 'react-icons/ai';
import { AiTwotoneShop } from 'react-icons/ai';

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
  isInCart?: boolean;
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
  isInCart = false,
}: ProductCardProps) {
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && !isCartLoading) {
      setIsCartLoading(true);
      try {
        await onAddToCart(id);
      } finally {
        setTimeout(() => setIsCartLoading(false), 500); // 버튼 상태 표시를 위한 딜레이
      }
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite && !isFavoriteLoading) {
      setIsFavoriteLoading(true);
      try {
        await onToggleFavorite(id);
      } finally {
        setTimeout(() => setIsFavoriteLoading(false), 300);
      }
    }
  };

  const handleCardClick = async () => {
    if (onAddToCart && !isCartLoading && !isInCart) {
      setIsCartLoading(true);
      try {
        await onAddToCart(id);
        if (typeof window !== 'undefined') {
          window.alert('장바구니에 추가되었습니다');
        }
      } finally {
        setTimeout(() => setIsCartLoading(false), 500);
      }
    }
  };

  return (
    <div
      className={`
      ${isInCart ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'} 
      rounded-xl p-4 border touch-feedback transition-colors duration-200
    `}
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-2 mb-2">
        {emoji.startsWith('/') ? (
          <Image src={emoji} alt={name} width={20} height={20} />
        ) : (
          <span className="text-xl">{emoji}</span>
        )}
        <span
          className={`font-medium text-sm ${isInCart ? 'text-gray-900' : 'text-gray-600'}`}
        >
          {name}
        </span>
      </div>
      <p
        className={`font-bold text-lg mb-3 ${isInCart ? 'text-primary-600' : 'text-primary-500'}`}
      >
        {Math.floor(savings).toLocaleString()}원 저렴해요
      </p>
      <div
        className={`space-y-1 text-xs ${isInCart ? 'text-gray-500' : 'text-gray-400'}`}
      >
        <div className="flex items-center gap-1">
          <span>
            <AiOutlineNotification />
          </span>
          <span>
            {marketName} {Math.floor(marketPrice).toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>
            <AiTwotoneShop />
          </span>
          <span>
            대형마트 {Math.floor(supermarketPrice).toLocaleString()}원
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        {/* 카트 담기 버튼 */}
        <button
          onClick={handleAddToCart}
          disabled={isCartLoading || isInCart}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 
            ${
              isInCart
                ? 'bg-primary-100 text-primary-700 border border-primary-200 cursor-default'
                : isCartLoading
                  ? 'bg-primary-400 text-white cursor-wait'
                  : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow-md active:scale-95'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isCartLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>담는중...</span>
            </>
          ) : isInCart ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>담김</span>
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
          onClick={handleToggleFavorite}
          disabled={isFavoriteLoading}
          className={`
            p-2.5 rounded-lg transition-all duration-200 border
            ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 active:bg-red-200'
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200'
            }
            ${isFavoriteLoading ? 'animate-pulse' : 'hover:shadow-sm active:scale-95'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isFavoriteLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className={`w-5 h-5 transition-all duration-200 ${isFavorite ? 'scale-110' : ''}`}
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
          )}
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import {
  ProductGrid,
  ProductSkeleton,
  ErrorDisplay,
  SectionHeader,
  ProductData,
  ProductActionsProps,
} from '@/components/product';
import { ToastContainer, useToast } from '@/components/ui/Toast';

interface AllProductsSectionProps extends ProductActionsProps {
  maxSavings?: number;
  products?: ProductData[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export default function AllProductsSection({
  maxSavings,
  products,
  onAddToCart,
  onToggleFavorite,
  isLoading = false,
  error,
  onRetry,
}: AllProductsSectionProps) {
  const {
    products: hookProducts,
    loading,
    addToCart,
    toggleFavorite,
  } = useProducts();
  const { toasts, removeToast } = useToast();

  // products가 props로 전달된 경우 해당 데이터 사용, 아니면 hook에서 가져온 데이터 사용
  const displayProducts = products || hookProducts;
  const calculatedMaxSavings =
    maxSavings ||
    displayProducts.reduce((max, product) => Math.max(max, product.savings), 0);
  const isLoadingData = isLoading || loading;

  // 카트 담기 핸들러 - hook의 함수와 props 함수를 함께 호출
  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
    if (onAddToCart) {
      onAddToCart(productId);
    }
  };

  // 즐겨찾기 토글 핸들러 - hook의 함수와 props 함수를 함께 호출
  const handleToggleFavorite = async (productId: string) => {
    await toggleFavorite(productId);
    if (onToggleFavorite) {
      onToggleFavorite(productId);
    }
  };
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  return (
    <>
      <div className="mb-6">
        <SectionHeader maxSavings={calculatedMaxSavings} />

        {/* 상품 카드들 */}
        {isLoadingData ? (
          <ProductSkeleton />
        ) : (
          <ProductGrid
            products={displayProducts}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {/* 토스트 컨테이너 */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

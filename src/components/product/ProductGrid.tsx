import React from 'react';
import ProductCard from '../home/ProductCard';
import { ProductData, ProductActionsProps } from './types';

interface ProductGridProps extends ProductActionsProps {
  products: ProductData[];
}

export default function ProductGrid({
  products,
  onAddToCart,
  onToggleFavorite,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">상품이 없습니다.</div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide horizontal-scroll touch-scroll">
      <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-48">
            <ProductCard
              id={product.id}
              emoji={product.emoji}
              name={product.name}
              savings={product.savings}
              marketPrice={product.marketPrice}
              supermarketPrice={product.supermarketPrice}
              isFavorite={product.isFavorite}
              isInCart={product.isInCart}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ProductData {
  id: string;
  emoji: string;
  name: string;
  category: string;
  marketPrice: number;
  supermarketPrice: number;
  savings: number;
  marketId: number;
  inStock: boolean;
  isFavorite?: boolean;
  isInCart?: boolean;
}

export interface ProductActionsProps {
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
}

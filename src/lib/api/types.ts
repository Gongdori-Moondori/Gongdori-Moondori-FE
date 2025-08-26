// API 응답 타입 정의
export interface User {
  id: number;
  name: string;
  email: string;
  profileImage: string;
}

export interface Market {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

export interface Recommendation {
  id: number;
  type: 'seasonal' | 'discount';
  emoji: string;
  name: string;
  message: string;
  description: string;
  userId: number;
}

export interface TopProduct {
  id: number;
  emoji: string;
  name: string;
  description: string;
  savings: number;
  actionText: string;
  marketId: number;
  rank: number;
}

export interface Product {
  id: number;
  emoji: string;
  name: string;
  category: string;
  marketPrice: number;
  supermarketPrice: number;
  savings: number;
  marketId: number;
  inStock: boolean;
  description: string;
}

export interface CartItem {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
  addedAt: string;
}

export interface Favorite {
  id: number;
  productId: number;
  userId: number;
  addedAt: string;
}

// API 요청 타입
export interface AddToCartRequest {
  productId: number;
  userId: number;
  quantity: number;
}

export interface AddToFavoritesRequest {
  productId: number;
  userId: number;
}

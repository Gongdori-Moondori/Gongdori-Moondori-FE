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

// 가격 비교 관련 타입
export interface PriceCompareMarket {
  id: string;
  name: string;
  distance: string;
  walkTime: string;
  rating: number;
  address: string;
  phone: string;
  operatingHours: string;
  lastUpdated: string;
}

export interface PriceCompareProduct {
  id: string;
  name: string;
  marketId: string;
  price: number;
  originalPrice?: number;
  isOnSale: boolean;
}

export interface MarketInfo {
  id: string;
  name: string;
  distance: string;
  walkTime: string;
  rating: number;
  price: number;
  originalPrice?: number;
  isOnSale: boolean;
  address: string;
  phone: string;
  operatingHours: string;
  lastUpdated: string;
}

// 카테고리 관련 타입
export interface Category {
  id: string;
  name: string;
  emoji: string;
  totalItems: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  unit: string;
  categoryId: string;
  subcategoryId: string;
}

// 장바구니 추가 요청 (마켓 정보 포함)
export interface AddToCartWithMarketRequest {
  productName: string;
  marketName: string;
  price: number;
  userId: number;
  quantity?: number;
}

// 시장 추천 API 응답 타입
export interface SeasonalRecommendationItem {
  itemName: string;
  category: string;
  reason: string;
  seasonalScore: number;
  season: string;
  benefits: string[];
}

export interface SavingRecommendationItem {
  itemName: string;
  category: string;
  marketName: string;
  currentPrice: number;
  averageMarketPrice: number;
  savingAmount: number;
  savingPercentage: number;
  priceLevel: string;
  recommendation: string;
  confidence: number;
  trendAnalysis: string;
  savingReason: string;
  dataPoints: number;
  seasonalItem: boolean;
}

export interface MartPrice {
  martName: string;
  price: number;
  priceUnit: string;
  available: boolean;
}

export interface MarketVsMartComparison {
  itemName: string;
  category: string;
  marketName: string;
  marketPrice: number;
  cheapestMartName: string;
  cheapestMartPrice: number;
  expensiveMartName: string;
  expensiveMartPrice: number;
  averageMartPrice: number;
  priceDifference: number;
  savingPercentage: number;
  winner: string;
  recommendation: string;
  martPrices: MartPrice[];
  comparisonSummary: string;
  seasonalItem: boolean;
}

export interface MarketRecommendationSummary {
  totalAnalyzedItems: number;
  seasonalItemsCount: number;
  savingItemsCount: number;
  marketWinCount: number;
  martWinCount: number;
  maxSavingAmount: number;
  maxSavingPercentage: number;
  bestDealItem: string;
  overallRecommendation: string;
  shoppingTips: string[];
}

export interface MarketRecommendationResponse {
  marketName: string;
  seasonalRecommendations: SeasonalRecommendationItem[];
  savingRecommendations: SavingRecommendationItem[];
  marketVsMartComparisons: MarketVsMartComparison[];
  summary: MarketRecommendationSummary;
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AuthAPI,
  MarketAPI,
  RecommendationAPI,
  ShoppingAPI,
  PriceDataAPI,
  ItemDetailAPI,
  SavingsAPI,
} from './diplomats';
import type { CompleteItemsRequest } from './diplomats';

// Query Keys
export const queryKeys = {
  user: (id: number) => ['user', id] as const,
  currentUser: () => ['user', 'current'] as const,
  markets: () => ['markets'] as const,
  marketItems: (marketName: string) => ['market', 'items', marketName] as const,
  recommendations: () => ['recommendations'] as const,
  seasonalRecommendation: () => ['recommendations', 'seasonal'] as const,
  topProducts: (marketId: number) => ['topProducts', marketId] as const,
  products: (marketId: number) => ['products', marketId] as const,
  product: (id: number) => ['products', id] as const,
  cart: (userId: number) => ['cart', userId] as const,
  favorites: (userId: number) => ['favorites', userId] as const,
  frequentItems: () => ['shopping', 'frequent-items'] as const,
  categories: () => ['shopping', 'categories'] as const,
  itemsByCategory: (category: string) =>
    ['shopping', 'categories', category, 'items'] as const,
  priceData: (params: { marketName?: string; itemName?: string }) =>
    ['price-data', params] as const,
  savings: () => ['savings'] as const,
};

// 사용자 관련 훅
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: AuthAPI.currentUser,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 시장 관련 훅
export const useMarketItems = (marketName: string) => {
  return useQuery({
    queryKey: queryKeys.marketItems(marketName),
    queryFn: () => MarketAPI.getMarketItemPrices(marketName),
    staleTime: 1000 * 60 * 10, // 10분
  });
};

export const usePredictMarketItems = (marketName: string) => {
  return useQuery({
    queryKey: ['market', 'predict', marketName],
    queryFn: () => MarketAPI.getPredictMarketItemPrices(marketName),
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 추천 관련 훅
export const useSeasonalRecommendation = () => {
  return useQuery({
    queryKey: queryKeys.seasonalRecommendation(),
    queryFn: RecommendationAPI.getSeasonal,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useComprehensiveRecommendation = (marketName: string) => {
  return useQuery({
    queryKey: ['recommendations', 'comprehensive', marketName],
    queryFn: () => RecommendationAPI.getComprehensive(marketName),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 쇼핑 관련 훅
export const useFrequentItems = () => {
  return useQuery({
    queryKey: queryKeys.frequentItems(),
    queryFn: ShoppingAPI.getFrequentItems,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: ShoppingAPI.getAllCategories,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

export const useItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: queryKeys.itemsByCategory(category),
    queryFn: () => ShoppingAPI.getItemsByCategory(category),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useShoppingLists = () => {
  return useQuery({
    queryKey: ['shopping', 'lists'],
    queryFn: ShoppingAPI.getUserShoppingLists,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useShoppingList = (shoppingListId: number) => {
  return useQuery({
    queryKey: ['shopping', 'list', shoppingListId],
    queryFn: () => ShoppingAPI.getShoppingList(shoppingListId),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useShoppingListStatistics = (shoppingListId: number) => {
  return useQuery({
    queryKey: ['shopping', 'statistics', shoppingListId],
    queryFn: () => ShoppingAPI.getShoppingListStatistics(shoppingListId),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 가격 데이터 관련 훅
export const usePriceDataItems = () => {
  return useQuery({
    queryKey: ['price-data', 'items'],
    queryFn: PriceDataAPI.getItemLists,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

export const usePriceData = (params: {
  marketName?: string;
  itemName?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.priceData(params),
    queryFn: () => PriceDataAPI.getPriceData(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 아이템 상세 관련 훅
export const useItemDetail = (itemName: string, marketName: string) => {
  return useQuery({
    queryKey: ['item', 'detail', itemName, marketName],
    queryFn: () => ItemDetailAPI.getMarketItemDetail(itemName, marketName),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useItemPrices = (itemName: string) => {
  return useQuery({
    queryKey: ['item', 'prices', itemName],
    queryFn: () => ItemDetailAPI.getItemPrices(itemName),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!itemName,
  });
};

// 시스템 관련 훅
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => import('./diplomats').then((m) => m.SystemAPI.health()),
    staleTime: 1000 * 60 * 1, // 1분
  });
};

// 쇼핑 리스트 생성/수정 훅
export const useCreateShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ShoppingAPI.createShoppingList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping', 'lists'] });
    },
  });
};

export const useCompleteShoppingItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shoppingListId,
      payload,
    }: {
      shoppingListId: number;
      payload: CompleteItemsRequest;
    }) => ShoppingAPI.completeShoppingItems(shoppingListId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shopping', 'list', variables.shoppingListId],
      });
      queryClient.invalidateQueries({
        queryKey: ['shopping', 'statistics', variables.shoppingListId],
      });
    },
  });
};

export const useCancelShoppingItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shoppingListId,
      payload,
    }: {
      shoppingListId: number;
      payload: CompleteItemsRequest;
    }) => ShoppingAPI.cancelShoppingItems(shoppingListId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shopping', 'list', variables.shoppingListId],
      });
      queryClient.invalidateQueries({
        queryKey: ['shopping', 'statistics', variables.shoppingListId],
      });
    },
  });
};

export const useSavingsStatistics = () => {
  return useQuery({
    queryKey: queryKeys.savings(),
    queryFn: SavingsAPI.getSavingsStatistics,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 즐겨찾기 관련 훅들
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: ShoppingAPI.getFavoriteItems,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ShoppingAPI.addFavoriteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ favoriteId }: { favoriteId: string }) =>
      ShoppingAPI.removeFavoriteItem(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ShoppingAPI.addItem,
    onSuccess: () => {
      // 장보기 리스트 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['shopping', 'lists'] });
      queryClient.invalidateQueries({ queryKey: ['shopping', 'current'] });
    },
  });
};

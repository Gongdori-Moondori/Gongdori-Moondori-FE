'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userAPI,
  marketAPI,
  recommendationAPI,
  topProductAPI,
  productAPI,
  cartAPI,
  favoriteAPI,
} from './client';
import { AddToCartRequest, AddToFavoritesRequest } from './types';

// Query Keys
export const queryKeys = {
  user: (id: number) => ['user', id] as const,
  currentUser: () => ['user', 'current'] as const,
  markets: () => ['markets'] as const,
  activeMarket: () => ['markets', 'active'] as const,
  recommendations: (userId: number) => ['recommendations', userId] as const,
  seasonalRecommendation: (userId: number) =>
    ['recommendations', 'seasonal', userId] as const,
  topProducts: (marketId: number) => ['topProducts', marketId] as const,
  products: (marketId: number) => ['products', marketId] as const,
  product: (id: number) => ['products', id] as const,
  cart: (userId: number) => ['cart', userId] as const,
  favorites: (userId: number) => ['favorites', userId] as const,
};

// 사용자 관련 훅
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: userAPI.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 시장 관련 훅
export const useMarkets = () => {
  return useQuery({
    queryKey: queryKeys.markets(),
    queryFn: marketAPI.getMarkets,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

export const useActiveMarket = () => {
  return useQuery({
    queryKey: queryKeys.activeMarket(),
    queryFn: marketAPI.getActiveMarket,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useSetActiveMarket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: marketAPI.setActiveMarket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.markets() });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeMarket() });
    },
  });
};

// 추천 관련 훅
export const useRecommendations = (userId: number = 1) => {
  return useQuery({
    queryKey: queryKeys.recommendations(userId),
    queryFn: () => recommendationAPI.getRecommendations(userId),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useSeasonalRecommendation = (userId: number = 1) => {
  return useQuery({
    queryKey: queryKeys.seasonalRecommendation(userId),
    queryFn: () => recommendationAPI.getSeasonalRecommendation(userId),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// TOP 3 상품 관련 훅
export const useTopProducts = (marketId: number = 1) => {
  return useQuery({
    queryKey: queryKeys.topProducts(marketId),
    queryFn: () => topProductAPI.getTopProducts(marketId),
    staleTime: 1000 * 60 * 3, // 3분
  });
};

// 상품 관련 훅
export const useProducts = (marketId: number = 1) => {
  return useQuery({
    queryKey: queryKeys.products(marketId),
    queryFn: () => productAPI.getProducts(marketId),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productAPI.getProduct(id),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 장바구니 관련 훅
export const useCart = (userId: number = 1) => {
  return useQuery({
    queryKey: queryKeys.cart(userId),
    queryFn: () => cartAPI.getCartItems(userId),
    staleTime: 1000 * 30, // 30초
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartAPI.addToCart(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart(variables.userId),
      });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// 즐겨찾기 관련 훅
export const useFavorites = (userId: number = 1) => {
  return useQuery({
    queryKey: queryKeys.favorites(userId),
    queryFn: () => favoriteAPI.getFavorites(userId),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToFavoritesRequest) =>
      favoriteAPI.addToFavorites(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites(variables.userId),
      });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      productId,
    }: {
      userId: number;
      productId: number;
    }) => favoriteAPI.removeFromFavorites(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  return useMutation({
    mutationFn: async ({
      userId,
      productId,
    }: {
      userId: number;
      productId: number;
    }) => {
      const isFav = await favoriteAPI.isFavorite(userId, productId);

      if (isFav) {
        await removeFromFavorites.mutateAsync({ userId, productId });
        return false;
      } else {
        await addToFavorites.mutateAsync({ userId, productId });
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

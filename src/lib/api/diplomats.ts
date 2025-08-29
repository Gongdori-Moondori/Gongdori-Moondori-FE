import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type { MarketRecommendationResponse } from './types';

const BASE_URL = (
  (process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    '') as string
).replace(/\/+$/, '');

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

let isRefreshing = false;
interface PendingItem {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig & { _retry?: boolean };
}
let pendingQueue: PendingItem[] = [];

client.interceptors.request.use((config) => {
  const token = getCookie('access_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (!original) throw error;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config: original });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie('refresh_token');
        if (!refreshToken) throw error;

        const refreshRes = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const accessToken = (
          refreshRes.data as {
            data?: { accessToken?: string; refreshToken?: string };
          }
        )?.data?.accessToken;
        const newRefresh = (
          refreshRes.data as {
            data?: { accessToken?: string; refreshToken?: string };
          }
        )?.data?.refreshToken;
        if (typeof document !== 'undefined') {
          if (accessToken) {
            document.cookie = `access_token=${encodeURIComponent(accessToken)}; path=/; max-age=${60 * 60}`;
          }
          if (newRefresh) {
            document.cookie = `refresh_token=${encodeURIComponent(newRefresh)}; path=/; max-age=${30 * 24 * 60 * 60}`;
          }
        }

        const token = accessToken || getCookie('access_token');
        if (token) {
          original.headers = original.headers || {};
          (original.headers as Record<string, string>).Authorization =
            `Bearer ${token}`;
        }

        const retryRes = await client(original);

        pendingQueue.forEach(async ({ resolve, config }) => {
          const cfg = { ...config };
          if (token) {
            cfg.headers = cfg.headers || {};
            (cfg.headers as Record<string, string>).Authorization =
              `Bearer ${token}`;
          }
          resolve(await client(cfg));
        });
        pendingQueue = [];

        return retryRes;
      } catch (e) {
        pendingQueue.forEach(({ reject }) => reject(e));
        pendingQueue = [];
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

// 공통 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

// ===== 타입 및 API 메서드 (이하 동일) =====
export interface ShoppingItemRequest {
  itemName: string;
  category: string;
  quantity: number;
}
export interface CreateShoppingListRequest {
  items: ShoppingItemRequest[];
}
export interface ShoppingRecordResponse {
  id: number;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  status: string;
}
export interface ShoppingListResponse {
  id: number;
  status: string;
  createdAt: string;
  items: ShoppingRecordResponse[];
}
export interface ShoppingListStatistics {
  shoppingListId: number;
  totalItems: number;
  completedItems: number;
  plannedItems: number;
  cancelledItems: number;
  completionRate: number;
}
export interface CompleteItemsRequest {
  itemIds: number[];
  reason?: string;
}
export interface FrequentItemResponse {
  itemName: string;
  category: string;
  purchaseCount: number;
  totalQuantity: number;
  averageQuantityPerPurchase: number;
  averagePrice: number;
  totalSpent: number;
  lastPurchaseDate: string;
  daysSinceLastPurchase: number;
  purchaseFrequency: string;
  recommendation?: string;
  seasonalItem?: boolean;
}
export interface JwtAuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}
export interface User {
  userId: string;
  name: string;
  socialProvider: string;
  socialId: string;
  email: string;
  profileImage: string;
}
export interface SeasonalRecommendation {
  itemName: string;
  category: string;
  reason: string;
  seasonalScore: number;
  season: string;
  benefits: string[];
}
export interface MarketItemPriceResponse {
  marketName: string;
  itemName: string;
  category: string;
  priceDataList?: unknown[];
  itemPriceList?: unknown[];
}
export interface PriceAnalysis {
  name: string;
  currentPrice: number;
  averagePrice: number;
}
export interface ItemListResponse {
  itemNames: string[];
  marketNames: string[];
}
export interface PriceDataResponse {
  serialNumber: string;
  marketName: string;
  itemName: string;
  price: string;
  date: string;
}

export const ShoppingAPI = {
  addItemTest: (payload: Record<string, unknown>) =>
    client
      .post<ApiResponse<object>>('/api/shopping/test', payload)
      .then((r) => r.data),
  getUserShoppingLists: () =>
    client
      .get<ApiResponse<ShoppingListResponse[]>>('/api/shopping/lists')
      .then((r) => r.data),
  createShoppingList: (payload: CreateShoppingListRequest) =>
    client
      .post<ApiResponse<ShoppingListResponse>>('/api/shopping/lists', payload)
      .then((r) => r.data),
  getShoppingList: (shoppingListId: number) =>
    client
      .get<
        ApiResponse<ShoppingListResponse>
      >(`/api/shopping/lists/${shoppingListId}`)
      .then((r) => r.data),
  getShoppingListStatistics: (shoppingListId: number) =>
    client
      .get<
        ApiResponse<ShoppingListStatistics>
      >(`/api/shopping/lists/${shoppingListId}/statistics`)
      .then((r) => r.data),
  completeShoppingItems: (
    shoppingListId: number,
    payload: CompleteItemsRequest
  ) =>
    client
      .patch<
        ApiResponse<ShoppingListResponse>
      >(`/api/shopping/lists/${shoppingListId}/items/complete`, payload)
      .then((r) => r.data),
  cancelShoppingItems: (
    shoppingListId: number,
    payload: CompleteItemsRequest
  ) =>
    client
      .patch<
        ApiResponse<ShoppingListResponse>
      >(`/api/shopping/lists/${shoppingListId}/items/cancel`, payload)
      .then((r) => r.data),
  getFrequentItems: () =>
    client
      .get<ApiResponse<FrequentItemResponse[]>>('/api/shopping/frequent-items')
      .then((r) => r.data),
  getAllCategories: () =>
    client
      .get<ApiResponse<string[]>>('/api/shopping/categories')
      .then((r) => r.data),
  getItemsByCategory: (category: string) =>
    client
      .get<
        ApiResponse<string[]>
      >(`/api/shopping/categories/${encodeURIComponent(category)}/items`)
      .then((r) => r.data),
  updateItemCategories: () =>
    client
      .post<ApiResponse<object>>('/api/shopping/admin/update-categories')
      .then((r) => r.data),
};

export const AuthAPI = {
  currentUser: () =>
    client.get<ApiResponse<User>>('/api/auth').then((r) => r.data),
  refresh: () =>
    client
      .post<ApiResponse<JwtAuthenticationResponse>>('/api/auth/refresh')
      .then((r) => r.data),
};

export const RecommendationAPI = {
  getSeasonal: () =>
    client
      .get<
        ApiResponse<SeasonalRecommendation[]>
      >('/api/recommendation/seasonal')
      .then((r) => r.data),
  getComprehensive: (marketName: string) =>
    client
      .get<
        ApiResponse<MarketRecommendationResponse>
      >(`/api/recommendation/market/${encodeURIComponent(marketName)}/main`)
      .then((r) => r.data),
};

export const PriceDataAPI = {
  getItemLists: () =>
    client
      .get<ApiResponse<ItemListResponse>>('/api/price_data/items')
      .then((r) => r.data),
  getPriceData: (params: { marketName?: string; itemName?: string }) =>
    client
      .get<ApiResponse<PriceDataResponse[]>>('/api/price_data/data', { params })
      .then((r) => r.data),
};

export const MarketAPI = {
  getMarketItemPrices: (marketName: string) =>
    client
      .get<
        ApiResponse<MarketItemPriceResponse[]>
      >(`/api/market/${encodeURIComponent(marketName)}/items`)
      .then((r) => r.data),
  getPredictMarketItemPrices: (marketName: string) =>
    client
      .get<
        ApiResponse<PriceAnalysis[]>
      >(`/api/market/${encodeURIComponent(marketName)}/items/predict`)
      .then((r) => r.data),
};

export const ItemDetailAPI = {
  getMarketItemDetail: (itemName: string, marketName: string) =>
    client
      .get<
        ApiResponse<unknown>
      >(`/api/item/${encodeURIComponent(itemName)}/market/${encodeURIComponent(marketName)}/detail`)
      .then((r) => r.data),
};

export const SystemAPI = {
  health: () => client.get<ApiResponse<string>>('/health').then((r) => r.data),
};

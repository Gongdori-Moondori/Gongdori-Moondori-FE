import {
  User,
  Market,
  Recommendation,
  TopProduct,
  Product,
  CartItem,
  Favorite,
  AddToCartRequest,
  AddToFavoritesRequest,
  PriceCompareMarket,
  PriceCompareProduct,
  MarketInfo,
  Category,
  CategoryItem,
  AddToCartWithMarketRequest,
} from './types';

const API_BASE_URL = 'http://localhost:3001';

// 기본 fetch 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// 사용자 관련 API
export const userAPI = {
  getUser: (id: number): Promise<User> => apiRequest<User>(`/users/${id}`),

  getCurrentUser: (): Promise<User> => apiRequest<User>('/users/1'), // 임시로 ID 1 사용
};

// 시장 관련 API
export const marketAPI = {
  getMarkets: (): Promise<Market[]> => apiRequest<Market[]>('/markets'),

  getActiveMarket: (): Promise<Market> =>
    apiRequest<Market[]>('/markets?isActive=true').then(
      (markets) => markets[0]
    ),

  setActiveMarket: async (marketId: number): Promise<Market> => {
    // 모든 시장을 비활성화
    const markets = await apiRequest<Market[]>('/markets');
    await Promise.all(
      markets.map((market) =>
        apiRequest(`/markets/${market.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ isActive: false }),
        })
      )
    );

    // 선택한 시장을 활성화
    return apiRequest<Market>(`/markets/${marketId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: true }),
    });
  },
};

// 추천 관련 API
export const recommendationAPI = {
  getRecommendations: (userId: number = 1): Promise<Recommendation[]> =>
    apiRequest<Recommendation[]>(`/recommendations?userId=${userId}`),

  getSeasonalRecommendation: (userId: number = 1): Promise<Recommendation> =>
    apiRequest<Recommendation[]>(
      `/recommendations?userId=${userId}&type=seasonal`
    ).then((recommendations) => recommendations[0]),
};

// TOP 3 상품 관련 API
export const topProductAPI = {
  getTopProducts: (marketId: number = 1): Promise<TopProduct[]> =>
    apiRequest<TopProduct[]>(
      `/topProducts?marketId=${marketId}&_sort=rank&_order=asc`
    ),
};

// 상품 관련 API
export const productAPI = {
  getProducts: (marketId: number = 1): Promise<Product[]> =>
    apiRequest<Product[]>(`/products?marketId=${marketId}`),

  getProduct: (id: number): Promise<Product> =>
    apiRequest<Product>(`/products/${id}`),

  getProductsByCategory: (
    category: string,
    marketId: number = 1
  ): Promise<Product[]> =>
    apiRequest<Product[]>(
      `/products?marketId=${marketId}&category=${category}`
    ),
};

// 장바구니 관련 API
export const cartAPI = {
  getCartItems: (userId: number = 1): Promise<CartItem[]> =>
    apiRequest<CartItem[]>(`/cart?userId=${userId}`),

  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    // 이미 장바구니에 있는 상품인지 확인
    const existingItems = await apiRequest<CartItem[]>(
      `/cart?userId=${data.userId}&productId=${data.productId}`
    );

    if (existingItems.length > 0) {
      // 기존 수량에 추가
      const existingItem = existingItems[0];
      return apiRequest<CartItem>(`/cart/${existingItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          quantity: existingItem.quantity + data.quantity,
        }),
      });
    } else {
      // 새로운 아이템 추가
      return apiRequest<CartItem>('/cart', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          addedAt: new Date().toISOString(),
        }),
      });
    }
  },

  removeFromCart: (id: number): Promise<void> =>
    apiRequest<void>(`/cart/${id}`, { method: 'DELETE' }),

  updateCartQuantity: (id: number, quantity: number): Promise<CartItem> =>
    apiRequest<CartItem>(`/cart/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
};

// 즐겨찾기 관련 API
export const favoriteAPI = {
  getFavorites: (userId: number = 1): Promise<Favorite[]> =>
    apiRequest<Favorite[]>(`/favorites?userId=${userId}`),

  addToFavorites: (data: AddToFavoritesRequest): Promise<Favorite> =>
    apiRequest<Favorite>('/favorites', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        addedAt: new Date().toISOString(),
      }),
    }),

  removeFromFavorites: async (
    userId: number,
    productId: number
  ): Promise<void> => {
    const favorites = await apiRequest<Favorite[]>(
      `/favorites?userId=${userId}&productId=${productId}`
    );
    if (favorites.length > 0) {
      await apiRequest<void>(`/favorites/${favorites[0].id}`, {
        method: 'DELETE',
      });
    }
  },

  isFavorite: async (userId: number, productId: number): Promise<boolean> => {
    const favorites = await apiRequest<Favorite[]>(
      `/favorites?userId=${userId}&productId=${productId}`
    );
    return favorites.length > 0;
  },
};

// 가격 비교 관련 API
export const priceCompareAPI = {
  getMarkets: (): Promise<PriceCompareMarket[]> =>
    apiRequest<PriceCompareMarket[]>('/priceCompareMarkets'),

  getProductPrices: (productName: string): Promise<MarketInfo[]> =>
    apiRequest<PriceCompareProduct[]>(
      `/priceCompareProducts?name=${encodeURIComponent(productName)}`
    ).then(async (products) => {
      const markets = await apiRequest<PriceCompareMarket[]>(
        '/priceCompareMarkets'
      );

      return products
        .map((product) => {
          const market = markets.find((m) => m.id === product.marketId);
          if (!market) return null;

          return {
            id: market.id,
            name: market.name,
            distance: market.distance,
            walkTime: market.walkTime,
            rating: market.rating,
            price: product.price,
            originalPrice: product.originalPrice,
            isOnSale: product.isOnSale,
            address: market.address,
            phone: market.phone,
            operatingHours: market.operatingHours,
            lastUpdated: market.lastUpdated,
          } as MarketInfo;
        })
        .filter((item): item is MarketInfo => item !== null)
        .sort((a, b) => a.price - b.price);
    }),

  addToCartWithMarket: async (
    data: AddToCartWithMarketRequest
  ): Promise<void> => {
    // 실제로는 마켓 정보와 함께 장바구니에 추가
    // 현재는 콘솔 로그로 처리
    console.log('장바구니에 추가:', {
      productName: data.productName,
      marketName: data.marketName,
      price: data.price,
      quantity: data.quantity || 1,
      userId: data.userId,
      addedAt: new Date().toISOString(),
    });

    // TODO: 실제 API 구현
    // return apiRequest('/cart-with-market', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     ...data,
    //     quantity: data.quantity || 1,
    //     addedAt: new Date().toISOString(),
    //   }),
    // });
  },
};

// 카테고리 관련 API
export const categoryAPI = {
  getCategories: (): Promise<Category[]> =>
    apiRequest<Category[]>('/categories'),

  getCategoryItems: (categoryId?: string): Promise<CategoryItem[]> => {
    const url = categoryId
      ? `/categoryItems?categoryId=${categoryId}`
      : '/categoryItems';
    return apiRequest<CategoryItem[]>(url);
  },

  searchCategoryItems: (searchTerm: string): Promise<CategoryItem[]> =>
    apiRequest<CategoryItem[]>(
      `/categoryItems?name_like=${encodeURIComponent(searchTerm)}`
    ),
};

import { useState, useEffect } from 'react';
import { ProductData } from '@/components/product/types';
import { useToast } from '@/components/ui/Toast';
import {
  PriceDataAPI,
  ShoppingAPI,
  isAuthenticated,
  logAuthStatus,
} from '@/lib/api/diplomats';

export interface UseProductsReturn {
  products: ProductData[];
  favorites: Set<string>;
  cartItems: Set<string>;
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
}

export function useProducts(marketId?: number): UseProductsReturn {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showInfo } = useToast();

  // 데이터 초기 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // marketId → marketName 매핑이 없으므로 우선 전체 아이템을 가져와 샘플 구성
        console.log('useProducts: Fetching data for marketId:', marketId);

        const itemLists = await PriceDataAPI.getItemLists();
        const marketNames = itemLists.data?.marketNames || [];
        const marketName = marketNames[0];

        const priceDataRes = await PriceDataAPI.getPriceData({ marketName });
        const rows = priceDataRes.data || [];

        const normalized: ProductData[] = rows.slice(0, 30).map((row, idx) => ({
          id: `${row.itemName}-${idx}`,
          emoji: '/assets/tomato.svg',
          name: row.itemName,
          category: '기타',
          marketPrice: Number(row.price) || 0,
          supermarketPrice: 0,
          savings: 0,
          marketId: 0,
          inStock: true,
          isFavorite: false,
          isInCart: false,
        }));

        setProducts(normalized);
        setFavorites(new Set<string>());
        setCartItems(new Set<string>());
      } catch (err) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [marketId]);

  // 카트 담기 기능
  const addToCart = async (productId: string): Promise<void> => {
    try {
      // 인증 상태 확인
      if (!isAuthenticated()) {
        showError('로그인이 필요합니다. 다시 로그인해주세요.');
        return;
      }

      if (cartItems.has(productId)) {
        showInfo('이미 카트에 담긴 상품입니다.');
        return;
      }

      const productToAdd = products.find((p) => p.id.toString() === productId);

      if (productToAdd) {
        // 실제 API 호출
        try {
          // 디버깅: 현재 인증 상태 확인
          logAuthStatus();

          await ShoppingAPI.addItem({
            itemName: productToAdd.name,
            quantity: 1,
            category: productToAdd.category,
            memo: `${productToAdd.name} 장바구니 추가`,
          });

          // 성공 시 로컬 상태 업데이트
          setCartItems((prev) => new Set([...prev, productId]));
          setProducts((prev) =>
            prev.map((product) =>
              product.id.toString() === productId
                ? { ...product, isInCart: true }
                : product
            )
          );

          showSuccess(`${productToAdd.name}이(가) 장바구니에 추가되었습니다!`);
        } catch (apiError: unknown) {
          console.error('API 호출 중 오류:', apiError);
          const axiosError = apiError as {
            response?: { data?: unknown; status?: number };
          };
          console.error('Error response:', axiosError.response?.data);
          console.error('Error status:', axiosError.response?.status);

          if (axiosError.response?.status === 403) {
            showError('권한이 없습니다. 로그인을 다시 확인해주세요.');
          } else {
            showError('장바구니 추가 중 서버 오류가 발생했습니다.');
          }
        }
      } else {
        showError('상품을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('카트 추가 중 오류:', error);
      showError('카트 추가 중 오류가 발생했습니다.');
    }
  };

  // 즐겨찾기 토글 기능
  const toggleFavorite = async (productId: string): Promise<void> => {
    const isFavorite = favorites.has(productId);
    const productName =
      products.find((p) => p.id.toString() === productId)?.name || '상품';

    try {
      if (isFavorite) {
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        setProducts((prev) =>
          prev.map((product) =>
            product.id.toString() === productId
              ? { ...product, isFavorite: false }
              : product
          )
        );
        showInfo(`${productName}을(를) 즐겨찾기에서 제거했습니다.`);
      } else {
        setFavorites((prev) => new Set([...prev, productId]));
        setProducts((prev) =>
          prev.map((product) =>
            product.id.toString() === productId
              ? { ...product, isFavorite: true }
              : product
          )
        );
        showSuccess(`${productName}을(를) 즐겨찾기에 추가했습니다!`);
      }
    } catch (error) {
      console.error('즐겨찾기 토글 중 오류:', error);
      showError('즐겨찾기 처리 중 오류가 발생했습니다.');

      if (!isFavorite) {
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        setProducts((prev) =>
          prev.map((product) =>
            product.id.toString() === productId
              ? { ...product, isFavorite: false }
              : product
          )
        );
      } else {
        setFavorites((prev) => new Set([...prev, productId]));
        setProducts((prev) =>
          prev.map((product) =>
            product.id.toString() === productId
              ? { ...product, isFavorite: true }
              : product
          )
        );
      }
    }
  };

  return {
    products,
    favorites,
    cartItems,
    loading,
    addToCart,
    toggleFavorite,
  };
}

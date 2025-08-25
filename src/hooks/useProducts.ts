import { useState, useEffect } from 'react';
import { ProductData } from '@/components/product/types';
import { useToast } from '@/components/ui/Toast';

// DB 데이터 타입 정의
interface CartItem {
  id: string;
  productId?: string | number;
  emoji: string;
  name: string;
  category: string;
  marketPrice: number;
  supermarketPrice: number;
  savings: number;
  marketId: number;
  inStock: boolean;
}

interface FavoriteItem {
  id: string;
  productId: string | number;
  userId: string | number;
  addedAt?: string;
}

interface Product {
  id: string | number;
  emoji: string;
  name: string;
  category: string;
  marketPrice: number;
  supermarketPrice: number;
  savings: number;
  marketId: number;
  inStock: boolean;
}

interface DBData {
  cart: CartItem[];
  favorites: FavoriteItem[];
  products: Product[];
}

export interface UseProductsReturn {
  products: ProductData[];
  favorites: Set<string>;
  cartItems: Set<string>;
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
}

export function useProducts(): UseProductsReturn {
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
        const response = await fetch('/db.json');
        const data: DBData = await response.json();

        // cart에 있는 productId들 추출
        const cartProductIds = data.cart.map((cartItem: CartItem) =>
          cartItem.productId
            ? cartItem.productId.toString()
            : cartItem.id.toString()
        );
        const cartProductsSet = new Set<string>(cartProductIds);

        // 전체 products 데이터를 가져오되, 카트와 즐겨찾기 상태 정보 포함
        const allProducts: ProductData[] = data.products.map(
          (product: Product) => ({
            ...product,
            id: product.id.toString(),
            isFavorite: false, // 초기값, 아래에서 설정
            isInCart: cartProductsSet.has(product.id.toString()),
          })
        );

        // favorites 데이터 처리
        const favoriteProductIds = data.favorites.map((fav: FavoriteItem) =>
          fav.productId.toString()
        );
        const favoritesSet = new Set<string>(favoriteProductIds);

        // 즐겨찾기 정보를 allProducts에 반영
        allProducts.forEach((product) => {
          product.isFavorite = favoritesSet.has(product.id.toString());
        });

        setProducts(allProducts);
        setFavorites(favoritesSet);
        setCartItems(cartProductsSet);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 카트 담기 기능
  const addToCart = async (productId: string): Promise<void> => {
    try {
      // 이미 카트에 있는지 확인
      if (cartItems.has(productId)) {
        showInfo('이미 카트에 담긴 상품입니다.');
        return;
      }

      // 상품 정보 찾기
      const productToAdd = products.find((p) => p.id.toString() === productId);

      if (productToAdd) {
        // 카트에 추가
        setCartItems((prev) => new Set([...prev, productId]));

        // products 상태 업데이트
        setProducts((prev) =>
          prev.map((product) =>
            product.id.toString() === productId
              ? { ...product, isInCart: true }
              : product
          )
        );

        showSuccess(`${productToAdd.name}이(가) 카트에 추가되었습니다!`);
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
      // UI 즉시 업데이트
      if (isFavorite) {
        // 즐겨찾기에서 제거
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        // products 상태도 즉시 업데이트
        setProducts((prev) =>
          prev.map((product) =>
            product.id.toString() === productId
              ? { ...product, isFavorite: false }
              : product
          )
        );

        showInfo(`${productName}을(를) 즐겨찾기에서 제거했습니다.`);
      } else {
        // 즐겨찾기에 추가
        setFavorites((prev) => new Set([...prev, productId]));

        // products 상태도 즉시 업데이트
        setProducts((prev) =>
          prev.map((product) =>
            product.id.toString() === productId
              ? { ...product, isFavorite: true }
              : product
          )
        );

        showSuccess(`${productName}을(를) 즐겨찾기에 추가했습니다!`);
      }

      // 여기에서 실제 서버 API 호출을 할 수 있음
      // await updateFavoriteOnServer(productId, !isFavorite);
    } catch (error) {
      console.error('즐겨찾기 토글 중 오류:', error);
      showError('즐겨찾기 처리 중 오류가 발생했습니다.');

      // 에러 발생 시 UI 상태를 되돌림
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

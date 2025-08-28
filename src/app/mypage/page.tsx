'use client';

import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import {
  ProfileSection,
  MenuSection,
  ActionButtons,
  type UserProfile,
  type MenuItem,
} from '@/components/mypage';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  emoji: string;
  name: string;
  category: string;
  marketPrice: number;
  supermarketPrice: number;
  savings: number;
  marketId: number;
  inStock: boolean;
}

interface FrequentlyPurchasedProduct extends Product {
  purchaseCount: number;
  lastPurchaseDate: string;
  totalSpent: number;
  totalSavings: number;
  averagePrice: number;
}

interface PurchaseData {
  id: string;
  userId: number;
  productId: number;
  quantity: number;
  price: number;
  purchaseDate: string;
}

export default function MyPage() {
  // 사용자 프로필 데이터
  const userProfile: UserProfile = {
    name: '이예림',
    profileImage: '/assets/userImage1.svg',
    totalSavings: 14543230000,
  };

  // 메뉴 아이템 데이터 (필요시 커스텀 가능)
  const menuItems: MenuItem[] = [
    {
      id: 'shopping-list',
      title: '나의 장보기 리스트',
      icon: 'shopping-list',
      onClick: () => {
        window.location.href = '/mypage/shopping-list';
      },
    },
    {
      id: 'favorites',
      title: '즐겨찾기',
      icon: 'heart',
      onClick: () => {
        window.location.href = '/mypage/favorites';
      },
    },
    // {
    //   id: 'frequently-purchased',
    //   title: '자주 구매한 상품',
    //   icon: 'chart',
    //   onClick: () => {
    //     window.location.href = '/mypage/frequently-purchased';
    //   },
    // },
  ];

  // 액션 핸들러들
  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log('로그아웃 클릭');
  };

  const handleDeleteAccount = () => {
    // TODO: 계정 삭제 로직 구현
    console.log('계정 삭제 클릭');
  };

  const [frequentProducts, setFrequentProducts] = useState<
    FrequentlyPurchasedProduct[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<'count' | 'recent' | 'savings'>('count');

  useEffect(() => {
    generateFrequentlyPurchasedData();
  }, []);

  const generateFrequentlyPurchasedData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/db.json');
      const data = await response.json();

      const products: Product[] = data.products || [];
      const purchaseHistory = data.purchaseHistory || [];

      // 구매 이력을 기반으로 자주 구매한 상품 데이터 생성
      const productPurchaseMap = new Map();

      purchaseHistory.forEach((purchase: PurchaseData) => {
        const productId = purchase.productId;
        if (!productPurchaseMap.has(productId)) {
          productPurchaseMap.set(productId, {
            purchases: [],
            totalQuantity: 0,
            totalSpent: 0,
          });
        }

        const existing = productPurchaseMap.get(productId);
        existing.purchases.push(purchase);
        existing.totalQuantity += purchase.quantity;
        existing.totalSpent += purchase.price * purchase.quantity;
      });

      const frequentData: FrequentlyPurchasedProduct[] = [];

      productPurchaseMap.forEach((purchaseData, productId) => {
        const product = products.find((p) => parseInt(p.id) === productId);
        if (product && purchaseData.purchases.length >= 2) {
          // 최소 2회 이상 구매한 상품만
          const purchaseCount = purchaseData.purchases.length;
          const lastPurchase = purchaseData.purchases.sort(
            (a: PurchaseData, b: PurchaseData) =>
              new Date(b.purchaseDate).getTime() -
              new Date(a.purchaseDate).getTime()
          )[0];

          const totalSpent = purchaseData.totalSpent;
          const totalSavings = product.savings * purchaseData.totalQuantity;
          const averagePrice = Math.floor(
            totalSpent / purchaseData.totalQuantity
          );

          frequentData.push({
            ...product,
            purchaseCount,
            lastPurchaseDate: lastPurchase.purchaseDate,
            totalSpent,
            totalSavings,
            averagePrice,
          });
        }
      });

      // 구매 횟수로 정렬
      frequentData.sort((a, b) => b.purchaseCount - a.purchaseCount);

      setFrequentProducts(frequentData);
    } catch {
      setError('자주 구매한 상품 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    let filtered = frequentProducts;

    if (selectedCategory !== '전체') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // 정렬
    switch (sortBy) {
      case 'count':
        return filtered.sort((a, b) => b.purchaseCount - a.purchaseCount);
      case 'recent':
        return filtered.sort(
          (a, b) =>
            new Date(b.lastPurchaseDate).getTime() -
            new Date(a.lastPurchaseDate).getTime()
        );
      case 'savings':
        return filtered.sort((a, b) => b.totalSavings - a.totalSavings);
      default:
        return filtered;
    }
  };

  const getCategories = () => {
    const categories = Array.from(
      new Set(frequentProducts.map((p) => p.category))
    );
    return ['전체', ...categories];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1일 전';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return `${Math.floor(diffDays / 30)}개월 전`;
  };

  const addToCart = async (product: FrequentlyPurchasedProduct) => {
    try {
      alert(`${product.name}이(가) 장보기 리스트에 추가되었습니다!`);
    } catch {
      setError('장보기 리스트 추가에 실패했습니다.');
    }
  };

  const getTotalStats = () => {
    const totalPurchases = frequentProducts.reduce(
      (sum, p) => sum + p.purchaseCount,
      0
    );
    const totalSpent = frequentProducts.reduce(
      (sum, p) => sum + p.totalSpent,
      0
    );
    const totalSavings = frequentProducts.reduce(
      (sum, p) => sum + p.totalSavings,
      0
    );

    return { totalPurchases, totalSpent, totalSavings };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageHeader title="자주 구매한 상품" showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageHeader title="자주 구매한 상품" showBackButton />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorMessage message={error} />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const stats = getTotalStats();
  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-foreground">
      {/* 헤더 */}
      <PageHeader title="내정보" className="bg-white" />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 pb-20">
        <div className="space-y-6">
          {/* 프로필 섹션 */}
          <ProfileSection
            name={userProfile.name}
            profileImage={userProfile.profileImage}
            totalSavings={userProfile.totalSavings}
          />

          {/* 메뉴 섹션 */}
          <MenuSection menuItems={menuItems} />

          {/* 상품 리스트 - 가로 스크롤로 수정된 부분 */}
          <div className="space-y-4">
            {/* 제목은 스크롤 영역 밖으로 분리 */}
            <h2 className="text-lg font-semibold">자주 구매한 상품</h2>

            {/* 가로 스크롤 컨테이너 */}
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-max">
                {filteredProducts.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm w-80 flex-shrink-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Image
                            src={item.emoji}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-12 h-12"
                          />
                          <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-600">
                            {item.category}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>
                              구매 횟수:{' '}
                              <span className="font-semibold text-primary-500">
                                {item.purchaseCount}회
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {item.marketPrice.toLocaleString()}원
                        </div>
                        <div className="text-xs text-gray-500">
                          평균 {item.averagePrice.toLocaleString()}원
                        </div>
                        <div className="text-xs text-primary-500">
                          총 {item.totalSavings.toLocaleString()}원 절약
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="mt-2 px-3 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
                        >
                          다시 담기
                        </button>
                      </div>
                    </div>

                    {/* 구매 통계 바 */}
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">구매 빈도</span>
                        <span className="text-xs text-gray-600">
                          {item.purchaseCount}회
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((item.purchaseCount / 20) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <ActionButtons
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

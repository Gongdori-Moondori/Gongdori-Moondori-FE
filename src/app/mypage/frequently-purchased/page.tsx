'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

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

export default function FrequentlyPurchasedPage() {
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
    <div className="min-h-screen flex flex-col bg-gray-50 text-foreground">
      <PageHeader
        title="자주 구매한 상품"
        showBackButton
        className="bg-white"
      />

      <main className="flex-1 p-6 pb-20">
        {frequentProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">구매 이력이 없어요</h3>
            <p className="text-gray-500 text-center">
              상품을 구매하시면 여기에 표시됩니다!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 구매 통계 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">구매 통계</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">
                    {stats.totalPurchases}
                  </div>
                  <div className="text-sm text-gray-600">총 구매 횟수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">
                    {stats.totalSpent.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-600">총 구매 금액</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">
                    {stats.totalSavings.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-600">총 절약 금액</div>
                </div>
              </div>
            </div>

            {/* 필터 및 정렬 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col space-y-4">
                {/* 카테고리 필터 */}
                <div>
                  <h3 className="font-semibold mb-2">카테고리</h3>
                  <div className="flex flex-wrap gap-2">
                    {getCategories().map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 정렬 옵션 */}
                <div>
                  <h3 className="font-semibold mb-2">정렬</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortBy('count')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        sortBy === 'count'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      구매 횟수순
                    </button>
                    <button
                      onClick={() => setSortBy('recent')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        sortBy === 'recent'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      최근 구매순
                    </button>
                    <button
                      onClick={() => setSortBy('savings')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        sortBy === 'savings'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      절약 금액순
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 상품 리스트 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                자주 구매한 상품 ({filteredProducts.length}개)
              </h2>
              {filteredProducts.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
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
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>
                            구매 횟수:{' '}
                            <span className="font-semibold text-primary-500">
                              {item.purchaseCount}회
                            </span>
                          </div>
                          <div>
                            마지막 구매: {formatDate(item.lastPurchaseDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">
                        {item.marketPrice.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500">
                        평균 {item.averagePrice.toLocaleString()}원
                      </div>
                      <div className="text-sm text-primary-500">
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
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

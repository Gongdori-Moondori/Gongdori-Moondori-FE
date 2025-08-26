'use client';

import { useEffect, useState } from 'react';
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

interface ShoppingListItem {
  id: string;
  userId: number;
  productId: number;
  quantity: number;
  addedAt: string;
}

interface Market {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface ShoppingListProduct extends Product {
  quantity: number;
  addedAt: string;
  shoppingListId: string;
}

export default function ShoppingListPage() {
  const [shoppingListItems, setShoppingListItems] = useState<
    ShoppingListProduct[]
  >([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    try {
      setLoading(true);
      const response = await fetch('/db.json');
      const data = await response.json();

      const shoppingList: ShoppingListItem[] = data.shoppingList || [];
      const products: Product[] = data.products || [];
      const markets: Market[] = data.markets || [];

      // 장보기 리스트와 상품 데이터를 조합
      const shoppingListProductsData = shoppingList
        .map((item) => {
          const product = products.find(
            (p) => parseInt(p.id) === item.productId
          );
          if (product) {
            return {
              ...product,
              quantity: item.quantity,
              addedAt: item.addedAt,
              shoppingListId: item.id,
            };
          }
          return null;
        })
        .filter(Boolean) as ShoppingListProduct[];

      setShoppingListItems(shoppingListProductsData);
      setMarkets(markets);
    } catch (err) {
      setError('장보기 리스트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getMarketName = (marketId: number) => {
    const market = markets.find((m) => parseInt(m.id) === marketId);
    return market ? market.name : '알 수 없는 마트';
  };

  const getTotalPrice = () => {
    return shoppingListItems.reduce(
      (total, item) => total + item.marketPrice * item.quantity,
      0
    );
  };

  const getTotalSavings = () => {
    return shoppingListItems.reduce(
      (total, item) => total + item.savings * item.quantity,
      0
    );
  };

  const removeFromShoppingList = async (shoppingListId: string) => {
    try {
      // 실제 API 호출 대신 로컬 상태 업데이트
      setShoppingListItems((prev) =>
        prev.filter((item) => item.shoppingListId !== shoppingListId)
      );
    } catch (err) {
      setError('상품 삭제에 실패했습니다.');
    }
  };

  const updateQuantity = async (
    shoppingListId: string,
    newQuantity: number
  ) => {
    try {
      if (newQuantity <= 0) {
        removeFromShoppingList(shoppingListId);
        return;
      }

      setShoppingListItems((prev) =>
        prev.map((item) =>
          item.shoppingListId === shoppingListId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError('수량 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <PageHeader title="나의 장보기 리스트" showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <PageHeader title="나의 장보기 리스트" showBackButton />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorMessage message={error} />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-foreground">
      <PageHeader
        title="나의 장보기 리스트"
        showBackButton
        className="bg-white"
      />

      <main
        className={`flex-1 p-6 ${shoppingListItems.length > 0 ? 'pb-48' : 'pb-20'}`}
      >
        {shoppingListItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold mb-2">
              장보기 리스트가 비어있어요
            </h3>
            <p className="text-gray-500 text-center">
              상품을 검색하여 장보기 리스트에 추가해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 요약 정보 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">총 상품 종류</span>
                  <span className="font-semibold">
                    {shoppingListItems.length}개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">총 수량</span>
                  <span className="font-semibold">
                    {shoppingListItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                    개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">총 가격</span>
                  <span className="font-semibold">
                    {getTotalPrice().toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>총 절약 금액</span>
                  <span className="font-semibold">
                    -{getTotalSavings().toLocaleString()}원
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>최종 금액</span>
                  <span>{getTotalPrice().toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 상품 리스트 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              {shoppingListItems.map((item) => (
                <div
                  key={item.shoppingListId}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.emoji}
                        alt={item.name}
                        className="w-12 h-12"
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-xs text-gray-500">
                          {getMarketName(item.marketId)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {(item.marketPrice * item.quantity).toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.marketPrice.toLocaleString()}원 × {item.quantity}
                        개
                      </div>
                      <div className="text-sm text-green-600">
                        {(item.savings * item.quantity).toLocaleString()}원 절약
                      </div>
                    </div>
                  </div>

                  {/* 수량 조절 및 삭제 버튼 */}
                  <div className="mt-4 pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">수량:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.shoppingListId,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.shoppingListId,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        removeFromShoppingList(item.shoppingListId)
                      }
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 주문하기 버튼 */}
            {shoppingListItems.length > 0 && (
              <div className="fixed bottom-20 left-0 right-0 p-6 bg-gray-100">
                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  주문하기 ({getTotalPrice().toLocaleString()}원)
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

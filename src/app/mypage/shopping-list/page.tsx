'use client';

import { useEffect, useState } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { ShoppingAPI, type ShoppingListResponse } from '@/lib/api/diplomats';

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
  completed: boolean; // 체크박스 상태를 나타내는 필드
}

export default function ShoppingListPage() {
  const [shoppingListItems, setShoppingListItems] = useState<
    ShoppingListProduct[]
  >([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // 확인 다이얼로그 상태

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    try {
      setLoading(true);

      const res = await ShoppingAPI.getUserShoppingLists();
      if (!res.success) {
        throw new Error(res.message || '장바구니 조회 실패');
      }

      const lists: ShoppingListResponse[] = res.data || [];
      const first = lists[0];

      if (!first || !first.items) {
        setShoppingListItems([]);
        setMarkets([]);
        setLoading(false);
        return;
      }

      const mapped: ShoppingListProduct[] = first.items
        .map((it) => ({
          id: String(it.id),
          emoji: '/assets/tomato.svg',
          name: it.itemName,
          category: it.category,
          marketPrice: it.unitPrice ?? 0,
          supermarketPrice: 0,
          savings: 0,
          marketId: 0,
          inStock: true,
          description: undefined as unknown as string,
        }))
        .map((p, idx) => ({
          ...(p as unknown as Product),
          quantity: first.items[idx]?.quantity ?? 1,
          addedAt: new Date(first.createdAt).toISOString(),
          shoppingListId: String(first.items[idx]?.id),
          completed: first.items[idx]?.status === 'PURCHASED',
        }));

      setShoppingListItems(mapped);
      setMarkets([]);
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

  // 체크박스 토글 함수
  const toggleCompleted = (shoppingListId: string) => {
    setShoppingListItems((prev) =>
      prev.map((item) =>
        item.shoppingListId === shoppingListId
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  // 장보기 완료 버튼 클릭 시 처리
  const handleCompleteShoppingClick = () => {
    const uncompletedItems = shoppingListItems.filter(
      (item) => !item.completed
    );

    if (uncompletedItems.length > 0) {
      setShowConfirmDialog(true);
    } else {
      completeShoppingList();
    }
  };

  // 장바구니 초기화 (장보기 완료)
  const completeShoppingList = () => {
    setShoppingListItems([]);
    setShowConfirmDialog(false);
    alert('장보기가 완료되었습니다!');
  };

  // 다이얼로그 취소
  const handleDialogCancel = () => {
    setShowConfirmDialog(false);
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
                  <span className="text-gray-600">완료된 상품</span>
                  <span className="font-semibold text-green-600">
                    {shoppingListItems.filter((item) => item.completed).length}{' '}
                    / {shoppingListItems.length}개
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
                  className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                    item.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {/* 체크박스 */}
                      <button
                        onClick={() => toggleCompleted(item.shoppingListId)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {item.completed && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <img
                        src={item.emoji}
                        alt={item.name}
                        className="w-12 h-12"
                      />
                      <div>
                        <h3
                          className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-xs text-gray-500">
                          {getMarketName(item.marketId)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}
                      >
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
          </div>
        )}
      </main>

      {/* 장보기 완료 버튼 */}
      {shoppingListItems.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-gray-100 px-4 py-3 max-w-md mx-auto">
          <button
            onClick={handleCompleteShoppingClick}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-sm sm:text-base hover:bg-green-700 transition-colors"
          >
            장보기 완료 (
            {shoppingListItems.filter((item) => item.completed).length} /{' '}
            {shoppingListItems.length})
          </button>
        </div>
      )}

      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2 text-center">
              아직 구매하지 않은 상품이 있어요
            </h3>
            <p className="text-gray-600 text-center mb-6">
              장보기를 완료할까요?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDialogCancel}
                className="flex-1 py-3 px-4 bg_GRAY-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={completeShoppingList}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                확인
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              확인하면 장바구니에서 삭제됩니다.
            </p>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}

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

      const mapped: ShoppingListProduct[] = first.items.map((it, idx) => ({
        id: String(it.id), // ShoppingRecordResponse의 id (아이템 ID) - number를 string으로 변환
        emoji: '/assets/tomato.svg',
        name: it.itemName,
        category: it.category,
        marketPrice: it.unitPrice ?? 0,
        supermarketPrice: 0,
        savings: 0,
        marketId: 0,
        inStock: true,
        description: undefined as unknown as string,
        quantity: it.quantity ?? 1,
        addedAt: new Date(first.createdAt).toISOString(),
        shoppingListId: String(first.id), // ShoppingListResponse의 id (장바구니 ID)
        completed: it.status === 'PURCHASED',
      }));

      // 디버깅: 매핑된 데이터 확인
      console.log(
        '매핑된 데이터:',
        mapped.map((item) => ({
          name: item.name,
          id: item.id,
          shoppingListId: item.shoppingListId,
          quantity: item.quantity,
        }))
      );

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

  const removeFromShoppingList = async (
    itemId: string,
    quantityToRemove?: number
  ) => {
    try {
      const item = shoppingListItems.find((item) => item.id === itemId);
      if (!item) {
        console.error('삭제할 아이템을 찾을 수 없습니다:', itemId);
        return;
      }

      // quantityToRemove가 지정되지 않았거나 전체 수량과 같으면 전체 삭제
      const removeQuantity = quantityToRemove || item.quantity;

      // 디버깅: ID 값들 확인
      console.log('삭제 요청 데이터:', {
        shoppingListId: item.shoppingListId,
        itemId: item.id,
        parsedItemId: parseInt(item.id),
        quantityToRemove: removeQuantity,
        itemName: item.name,
      });

      // API 호출하여 서버에서 아이템 삭제
      const response = await ShoppingAPI.removeShoppingItem({
        shoppingListId: parseInt(item.shoppingListId), // 장바구니 ID
        itemId: parseInt(item.id), // 아이템 ID - string을 number로 변환
        quantityToRemove: removeQuantity,
      });

      console.log('삭제 API 응답:', response);

      // 성공 시 로컬 상태 업데이트
      if (removeQuantity >= item.quantity) {
        // 전체 삭제
        setShoppingListItems((prev) =>
          prev.filter((item) => item.id !== itemId)
        );
      } else {
        // 부분 삭제 (수량만 감소)
        setShoppingListItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity - removeQuantity }
              : item
          )
        );
      }
    } catch (err) {
      console.error('상품 삭제 중 오류:', err);
      if (err instanceof Error) {
        setError(`상품 삭제에 실패했습니다: ${err.message}`);
      } else {
        setError('상품 삭제에 실패했습니다.');
      }
    }
  };

  // 장바구니 상품 수량 업데이트 함수
  const updateShoppingItemQuantity = async (
    item: ShoppingListProduct,
    newQuantity: number
  ) => {
    try {
      // 디버깅: 수량 업데이트 요청 데이터 확인
      console.log('수량 업데이트 요청 데이터:', {
        itemName: item.name,
        quantity: 1, // + 버튼으로 추가할 때는 항상 1
        category: item.category,
        memo: `수량 추가: ${item.quantity} → ${newQuantity}`,
      });

      // API 호출하여 서버에서 상품 수량 업데이트
      // /api/shopping/add-item API 사용
      const response = await ShoppingAPI.addItem({
        itemName: item.name,
        quantity: 1, // + 버튼으로 추가할 때는 항상 1
        category: item.category,
        memo: `수량 추가: ${item.quantity} → ${newQuantity}`,
      });

      console.log('수량 업데이트 API 응답:', response);

      // 성공 시 로컬 상태 업데이트
      setShoppingListItems((prev) =>
        prev.map((prevItem) =>
          prevItem.id === item.id
            ? { ...prevItem, quantity: newQuantity }
            : prevItem
        )
      );
    } catch (err) {
      console.error('상품 수량 업데이트 중 오류:', err);
      if (err instanceof Error) {
        setError(`상품 수량 업데이트에 실패했습니다: ${err.message}`);
      } else {
        setError('상품 수량 업데이트에 실패했습니다.');
      }
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        // 수량이 0 이하가 되면 전체 삭제
        await removeFromShoppingList(itemId);
        return;
      }

      const currentItem = shoppingListItems.find((item) => item.id === itemId);
      if (!currentItem) return;

      if (newQuantity < currentItem.quantity) {
        // 수량이 줄어드는 경우: 삭제 API 호출
        const quantityToRemove = currentItem.quantity - newQuantity;
        await removeFromShoppingList(itemId, quantityToRemove);
      } else if (newQuantity > currentItem.quantity) {
        // 수량이 늘어나는 경우: 수량 업데이트 API 호출
        await updateShoppingItemQuantity(currentItem, newQuantity);
      }
      // 수량이 같은 경우는 아무것도 하지 않음
    } catch (err) {
      console.error('수량 변경 중 오류:', err);
      setError('수량 변경에 실패했습니다.');
    }
  };

  // 체크박스 토글 함수
  const toggleCompleted = (itemId: string) => {
    setShoppingListItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
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
                  key={item.id}
                  className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                    item.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {/* 체크박스 */}
                      <button
                        onClick={() => toggleCompleted(item.id)}
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
                            updateQuantity(item.id, item.quantity - 1)
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
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromShoppingList(item.id)}
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

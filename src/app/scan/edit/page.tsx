'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  IoCheckmarkCircle,
  IoTrashOutline,
  IoAddOutline,
} from 'react-icons/io5';
import PageHeader from '@/components/layout/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function EditShoppingListContent() {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
        setItems(parsedItems);
      } catch (error) {
        console.error('아이템 파싱 오류:', error);
        setItems([]);
      }
    }
  }, [searchParams]);

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const saveList = () => {
    if (items.length === 0) {
      alert('최소 1개 이상의 항목이 필요합니다.');
      return;
    }

    // 로컬 스토리지에 저장
    localStorage.setItem('extractedShoppingList', JSON.stringify(items));

    // 홈으로 이동
    router.push('/');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader title="장보기 리스트 편집" className="bg-white" />

      <main className="flex-1 p-6 pb-24">
        <div className="space-y-6">
          {/* 현재 리스트 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">현재 리스트</h3>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                아직 추가된 항목이 없습니다
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <IoCheckmarkCircle
                        className="text-primary-500"
                        size={20}
                      />
                      <span className="text-gray-800">{item}</span>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 새 항목 추가 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">새 항목 추가</h3>

            <div className="flex gap-3">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="새로운 항목을 입력하세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={addItem}
                disabled={!newItem.trim()}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <IoAddOutline size={20} />
                추가
              </button>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <button
              onClick={saveList}
              disabled={items.length === 0}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-lg"
            >
              장보기 리스트 저장하기 ({items.length}개 항목)
            </button>

            <button
              onClick={() => router.push('/scan')}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 text-sm"
            >
              다시 스캔하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EditShoppingList() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <EditShoppingListContent />
    </Suspense>
  );
}

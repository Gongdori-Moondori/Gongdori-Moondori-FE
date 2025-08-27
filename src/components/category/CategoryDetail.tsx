'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category as APICategory, CategoryItem } from '@/lib/api/types';
import { categoryAPI } from '@/lib/api/client';
import { IoChevronBack } from 'react-icons/io5';

interface CategoryDetailProps {
  category: APICategory;
  onBack: () => void;
}

interface ItemCardProps {
  item: CategoryItem;
  onComparePrice?: (item: CategoryItem) => void;
}

function ItemCard({ item, onComparePrice }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-600">{item.unit}</p>
        </div>
        <button
          onClick={() => onComparePrice?.(item)}
          className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors touch-feedback"
        >
          가격비교
        </button>
      </div>
    </div>
  );
}

export default function CategoryDetail({
  category,
  onBack,
}: CategoryDetailProps) {
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const data = await categoryAPI.getCategoryItems(category.id);
        setCategoryItems(data);
      } catch (error) {
        console.error('카테고리 아이템 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryItems();
  }, [category.id]);

  const handleComparePrice = (item: CategoryItem) => {
    // 가격 비교 페이지로 이동
    router.push(`/scan/price-compare?item=${encodeURIComponent(item.name)}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="touch-feedback p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <IoChevronBack className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-2xl">{category.emoji}</div>
          <h1 className="text-xl font-bold text-gray-900">{category.name}</h1>
        </div>
      </div>

      {/* 아이템 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {category.name} 상품
              </h2>
              <span className="text-sm text-gray-500">
                {categoryItems.length}개 상품
              </span>
            </div>

            {categoryItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onComparePrice={handleComparePrice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

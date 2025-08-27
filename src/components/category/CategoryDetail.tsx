'use client';

import React, { useState } from 'react';
import { Category, SubCategory, CategoryItem } from '@/lib/data/categories';
import { IoChevronBack } from 'react-icons/io5';

interface CategoryDetailProps {
  category: Category;
  onBack: () => void;
}

interface ItemCardProps {
  item: CategoryItem;
  onAddToCart?: (item: CategoryItem) => void;
}

function ItemCard({ item, onAddToCart }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-600">{item.unit}</p>
        </div>
        <button
          onClick={() => onAddToCart?.(item)}
          className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors touch-feedback"
        >
          장바구니
        </button>
      </div>
    </div>
  );
}

export default function CategoryDetail({
  category,
  onBack,
}: CategoryDetailProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    category.subcategories[0]?.id || ''
  );

  const currentSubcategory = category.subcategories.find(
    (sub) => sub.id === selectedSubcategory
  );

  const handleAddToCart = (item: CategoryItem) => {
    // TODO: 장바구니 추가 로직 구현
    console.log('장바구니에 추가:', item);
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

        {/* 서브카테고리 탭 */}
        {category.subcategories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {category.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-feedback transition-colors ${
                  selectedSubcategory === sub.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 아이템 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentSubcategory && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentSubcategory.name}
              </h2>
              <span className="text-sm text-gray-500">
                {currentSubcategory.items.length}개 상품
              </span>
            </div>

            {currentSubcategory.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

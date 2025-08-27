'use client';

import React from 'react';
import { Category } from '@/lib/api/types';

interface CategoryCardProps {
  category: Category;
  onClick: (category: Category) => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={() => onClick(category)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer touch-feedback"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{category.emoji}</div>
        <div className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
          {category.totalItems}개
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
      <p className="text-sm text-gray-600 mt-1">
        {category.totalItems > 0
          ? `${category.totalItems}개 품목`
          : '품목 보기'}
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import CategoryCard from '@/components/category/CategoryCard';
import CategoryDetail from '@/components/category/CategoryDetail';
import { categoryData, Category } from '@/lib/data/categories';

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <CategoryDetail category={selectedCategory} onBack={handleBack} />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <PageHeader
        title="카테고리"
        rightElement={
          <div className="text-sm text-gray-600">
            총 {categoryData.reduce((sum, cat) => sum + cat.totalItems, 0)}개
            품목
          </div>
        }
      />

      {/* 카테고리 그리드 */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {categoryData.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

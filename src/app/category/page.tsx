'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import CategoryCard from '@/components/category/CategoryCard';
import CategoryDetail from '@/components/category/CategoryDetail';
import { categoryAPI } from '@/lib/api/client';
import { Category } from '@/lib/api/types';

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
            총 {categories.reduce((sum, cat) => sum + cat.totalItems, 0)}개 품목
          </div>
        }
      />

      {/* 카테고리 그리드 */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

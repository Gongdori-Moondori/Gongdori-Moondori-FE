'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import CategoryCard from '@/components/category/CategoryCard';
import CategoryDetail from '@/components/category/CategoryDetail';
import { ShoppingAPI } from '@/lib/api/diplomats';

interface Category {
  id: string;
  name: string;
  totalItems: number;
  emoji: string;
  icon?: string;
}

const CATEGORY_ICON_SRC: Record<string, string> = {
  과일: '/assets/apple.svg',
  채소: '/assets/vegetable.svg',
  수산: '/assets/fish.svg',
  정육: '/assets/meat.svg',
  반찬: '/assets/pot.svg',
  토마토: '/assets/tomato.svg',
  수박: '/assets/watermelon.svg',
};

const isAssetPath = (v: string): boolean =>
  v.startsWith('/') ||
  v.startsWith('http') ||
  /\.(svg|png|jpg|jpeg|webp)$/i.test(v);

const toDisplayName = (v: string): string => {
  if (!isAssetPath(v)) return v;
  const seg = v.split('?')[0].split('#')[0].split('/').pop() || v;
  const base = seg.replace(/\.(svg|png|jpg|jpeg|webp)$/i, '');
  try {
    return decodeURIComponent(base);
  } catch {
    return base;
  }
};

const getIconForCategory = (value: string): string => {
  if (isAssetPath(value)) return value;
  if (CATEGORY_ICON_SRC[value]) return CATEGORY_ICON_SRC[value];
  const v = value.toLowerCase();
  if (v.includes('과일') || v.includes('fruit')) return '/assets/apple.svg';
  if (v.includes('채소') || v.includes('야채') || v.includes('vegetable'))
    return '/assets/vegetable.svg';
  if (
    v.includes('수산') ||
    v.includes('해산') ||
    v.includes('어') ||
    v.includes('fish')
  )
    return '/assets/fish.svg';
  if (v.includes('육') || v.includes('정육') || v.includes('meat'))
    return '/assets/meat.svg';
  if (v.includes('반찬') || v.includes('던') || v.includes('side'))
    return '/assets/pot.svg';
  if (v.includes('수박')) return '/assets/watermelon.svg';
  if (v.includes('토마토')) return '/assets/tomato.svg';
  return '/assets/vegetable.svg';
};

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ShoppingAPI.getAllCategories();
        if (response.success && response.data) {
          const categoryNames: string[] = response.data;

          // 각 카테고리의 세부 품목 개수 병렬 조회
          const counts = await Promise.all(
            categoryNames.map(async (name) => {
              try {
                const r = await ShoppingAPI.getItemsByCategory(name);
                if (r?.success) {
                  const d = r.data as unknown;
                  const items = Array.isArray(d)
                    ? d
                    : Array.isArray((d as { items?: unknown[] })?.items)
                      ? (d as { items: unknown[] }).items
                      : Array.isArray(
                            (d as { itemNames?: unknown[] })?.itemNames
                          )
                        ? (d as { itemNames: unknown[] }).itemNames
                        : [];
                  return (items as unknown[]).length;
                }
              } catch {
                // ignore and fallback to 0
              }
              return 0;
            })
          );

          const categoryData: Category[] = categoryNames.map((raw, index) => ({
            id: String(index + 1),
            name: toDisplayName(raw),
            totalItems: counts[index] || 0,
            emoji: getIconForCategory(raw),
            icon: getIconForCategory(raw),
          }));

          setCategories(categoryData);
        }
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
          <div className="text-sm text-gray-600 whitespace-nowrap">
            총 {categories.length}개 카테고리
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

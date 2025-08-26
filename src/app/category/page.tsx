import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';

export default function Category() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <PageHeader
        title="카테고리"
        rightElement={
          <button className="mobile-button touch-feedback p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        }
      />

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

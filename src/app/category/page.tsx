import BottomNavigation from '@/components/layout/BottomNavigation';
import BackButton from '@/components/layout/BackButton';

export default function Category() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <BackButton />
        <h1 className="text-xl font-bold">카테고리</h1>
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
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 pb-20">
        <div className="space-y-6">
          {/* 월간 지출 요약 */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold mb-2">1월 총 지출</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">₩287,450</p>
            <p className="text-sm text-gray-600">전월 대비 12% 절약</p>
          </div>

          {/* 카테고리별 지출 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">카테고리별 지출</h3>
            <div className="space-y-3">
              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div>
                    <p className="font-medium">식비</p>
                    <p className="text-sm text-gray-600">15건 • ₩125,600</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">43.7%</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-7 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <p className="font-medium">교통비</p>
                    <p className="text-sm text-gray-600">8건 • ₩67,200</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">23.4%</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-4 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">☕</span>
                  </div>
                  <div>
                    <p className="font-medium">카페/음료</p>
                    <p className="text-sm text-gray-600">12건 • ₩48,300</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">16.8%</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-3 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div>
                    <p className="font-medium">생필품</p>
                    <p className="text-sm text-gray-600">6건 • ₩32,850</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">11.4%</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <div>
                    <p className="font-medium">문화/여가</p>
                    <p className="text-sm text-gray-600">3건 • ₩13,500</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">4.7%</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-1 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 예산 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">월간 예산 설정</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">현재 예산</span>
                <span className="text-lg font-bold">₩300,000</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-gradient-to-r from-green-500 to-yellow-500 to-red-500 rounded-full"
                  style={{ width: '95.8%' }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>사용: ₩287,450</span>
                <span>남은 금액: ₩12,550</span>
              </div>
            </div>
            <button className="mobile-button touch-feedback w-full border border-blue-500 text-blue-500 py-3 rounded-lg font-medium">
              예산 수정하기
            </button>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

import Link from 'next/link';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">대시보드</h1>
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
              d="M15 17h5l-5 5-5-5h5z M9 5h5L9 0 4 5h5z"
            />
          </svg>
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 pb-20">
        <div className="space-y-6">
          {/* 통계 카드 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="touch-feedback p-4 rounded-lg bg-blue-50 bg-blue-50 border border-blue-200 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    총 방문자
                  </p>
                  <p className="text-2xl font-bold text-blue-700 text-blue-700">
                    1,234
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="touch-feedback p-4 rounded-lg bg-green-50 bg-green-50 border border-green-200 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    매출
                  </p>
                  <p className="text-2xl font-bold text-green-700 text-green-700">
                    ₩56K
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">최근 활동</h3>
            <div className="space-y-3">
              <div className="touch-feedback p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">새로운 사용자 등록</p>
                    <p className="text-sm text-gray-600">2분 전</p>
                  </div>
                </div>
              </div>

              <div className="touch-feedback p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">주문 완료</p>
                    <p className="text-sm text-gray-600">5분 전</p>
                  </div>
                </div>
              </div>

              <div className="touch-feedback p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">시스템 업데이트</p>
                    <p className="text-sm text-gray-600">10분 전</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 빠른 액션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">빠른 액션</h3>
            <div className="grid grid-cols-3 gap-3">
              <Link
                href="/dashboard/settings"
                className="mobile-button touch-feedback flex flex-col items-center p-4 rounded-lg border border-gray-200"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full mb-2"></div>
                <span className="text-xs">보고서</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="mobile-button touch-feedback flex flex-col items-center p-4 rounded-lg border border-gray-200"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full mb-2"></div>
                <span className="text-xs">설정</span>
              </Link>
              <Link
                href="/about"
                className="mobile-button touch-feedback flex flex-col items-center p-4 rounded-lg border border-gray-200"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-full mb-2"></div>
                <span className="text-xs">도움말</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

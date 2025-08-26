import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';

export default function MyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-foreground">
      {/* 헤더 */}
      <PageHeader title="내정보" className="bg-white" />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 pb-20">
        <div className="space-y-6">
          {/* 프로필 섹션 */}
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white border-4 border-[#14b8a6] flex items-center justify-center">
              <img
                src="/assets/userImage1.svg"
                alt="프로필"
                className="w-16 h-16"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">이예림님</h2>

            {/* 절약 금액 섹션 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/assets/money.svg" alt="돈" className="w-8 h-8" />
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-primary-500">알지</span>로
                  아낀 총 할인금액은{' '}
                  <span className="font-bold text-primary-500">할인금액</span>은
                </span>
              </div>
              <p className="text-2xl font-bold text-primary-500">
                14543230,000원{' '}
                <span className="text-sm font-normal text-gray-600">
                  이에요!
                </span>
              </p>
            </div>
          </div>

          {/* 메뉴 */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 flex items-center justify-between touch-feedback">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="font-medium text-gray-800">
                  나의 장보기 리스트
                </span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            <div className="bg-white rounded-lg p-4 flex items-center justify-between touch-feedback">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="font-medium text-gray-800">즐겨찾기</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            <div className="bg-white rounded-lg p-4 flex items-center justify-between touch-feedback">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="font-medium text-gray-800">
                  자주 구매한 상품
                </span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* 로그아웃과 계정 관리 */}
          <div className="space-y-3">
            <button className="mobile-button touch-feedback w-full bg-gray-400 text-white py-4 rounded-lg font-medium">
              로그아웃
            </button>

            <button className="mobile-button touch-feedback w-full py-3 rounded-lg font-medium text-gray-600 text-sm border-none bg-transparent">
              계정 삭제 하기
            </button>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

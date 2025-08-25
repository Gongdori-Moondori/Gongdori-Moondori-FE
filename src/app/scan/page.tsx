import BottomNavigation from '@/components/layout/BottomNavigation';
import BackButton from '@/components/layout/BackButton';

export default function Scan() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <BackButton />
        <h1 className="text-xl font-bold">스캔하기</h1>
        <div className="w-10"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 pb-20">
        <div className="space-y-6">
          {/* 스캔 영역 */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 min-h-[300px] border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m0 0V4m0 4h12M4 16h4m0 0v4m0-4h12M20 8h-4m0 0V4m0 4v12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">영수증을 스캔하세요</h2>
            <p className="text-gray-600 text-center mb-6">
              영수증을 카메라로 촬영하거나
              <br />
              갤러리에서 선택해주세요
            </p>

            <div className="space-y-3 w-full max-w-xs">
              <button className="mobile-button touch-feedback w-full bg-blue-500 text-white py-3 rounded-lg font-medium">
                📷 카메라로 촬영
              </button>
              <button className="mobile-button touch-feedback w-full border border-gray-300 text-foreground py-3 rounded-lg font-medium">
                🖼️ 갤러리에서 선택
              </button>
            </div>
          </div>

          {/* 최근 스캔 내역 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">최근 스캔 내역</h3>
            <div className="space-y-3">
              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">이마트 송파점</p>
                    <p className="text-sm text-gray-600">
                      ₩45,320 • 2024.01.15
                    </p>
                  </div>
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

              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">스타벅스 강남역점</p>
                    <p className="text-sm text-gray-600">₩8,500 • 2024.01.14</p>
                  </div>
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

              <div className="touch-feedback p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">⏳</span>
                  </div>
                  <div>
                    <p className="font-medium">CU 역삼점</p>
                    <p className="text-sm text-gray-600">처리중 • 2024.01.14</p>
                  </div>
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
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

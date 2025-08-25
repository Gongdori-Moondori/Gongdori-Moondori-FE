import BottomNavigation from '@/components/layout/BottomNavigation';
import BackButton from '@/components/layout/BackButton';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <BackButton />
        <h1 className="text-xl font-bold">정보</h1>
        <div className="w-10"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Rzi App</h2>
            <p className="text-gray-600 mb-2">버전 1.0.0</p>
            <p className="text-sm text-gray-500">
              모바일 최적화된 웹 애플리케이션
            </p>
          </div>

          <div className="space-y-4">
            <div className="touch-feedback p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">개발팀</h3>
              <p className="text-sm text-gray-600">
                최신 기술을 활용한 모바일 앱 형태의 웹 애플리케이션입니다.
              </p>
            </div>

            <div className="touch-feedback p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">기술 스택</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 bg-blue-100 text-blue-800 text-blue-800 text-xs rounded">
                  Next.js
                </span>
                <span className="px-2 py-1 bg-green-100 bg-green-100 text-green-800 text-green-800 text-xs rounded">
                  React
                </span>
                <span className="px-2 py-1 bg-purple-100 bg-purple-100 text-purple-800 text-purple-800 text-xs rounded">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-yellow-100 bg-yellow-100 text-yellow-800 text-yellow-800 text-xs rounded">
                  Tailwind CSS
                </span>
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

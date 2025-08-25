import Image from 'next/image';
import Link from 'next/link';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Rzi App</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <Image
            className="mx-auto mb-4"
            src="/icons/Rzilogo.svg"
            alt="Rzi logo"
            width={150}
            height={60}
            priority
          />
          <h2 className="text-2xl font-bold mb-2">환영합니다!</h2>
          <p className="text-gray-600 mb-6">
            모바일 앱 형태로 최적화된 웹 애플리케이션입니다.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <Link
            href="/dashboard"
            className="mobile-button touch-feedback w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium block text-center"
          >
            시작하기
          </Link>
          <Link
            href="/about"
            className="mobile-button touch-feedback w-full border border-gray-300 text-foreground px-6 py-3 rounded-lg font-medium block text-center"
          >
            둘러보기
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="touch-feedback flex flex-col items-center p-4 rounded-lg border border-gray-200">
            <Image
              src="/icons/Rzilogo.svg"
              alt="Learn"
              width={32}
              height={32}
              className="mb-2"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              학습
            </span>
          </div>
          <div className="touch-feedback flex flex-col items-center p-4 rounded-lg border border-gray-200">
            <Image
              src="/icons/Rzilogo.svg"
              alt="Examples"
              width={32}
              height={32}
              className="mb-2"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              예제
            </span>
          </div>
          <div className="touch-feedback flex flex-col items-center p-4 rounded-lg border border-gray-200">
            <Image
              src="/icons/Rzilogo.svg"
              alt="Docs"
              width={32}
              height={32}
              className="mb-2"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              문서
            </span>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

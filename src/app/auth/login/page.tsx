import BackButton from '@/components/layout/BackButton';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <BackButton />
        <h1 className="text-xl font-bold">로그인</h1>
        <div className="w-10"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 flex flex-col justify-center">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">환영합니다</h2>
            <p className="text-gray-600">계정에 로그인하세요</p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  로그인 상태 유지
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                비밀번호 찾기
              </a>
            </div>

            <button
              type="submit"
              className="mobile-button touch-feedback w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              로그인
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">계정이 없으신가요? </span>
              <a
                href="/auth/signup"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                회원가입
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

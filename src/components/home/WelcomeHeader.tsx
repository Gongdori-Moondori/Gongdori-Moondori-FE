interface WelcomeHeaderProps {
  userName?: string;
}

export default function WelcomeHeader({
  userName = '이예림',
}: WelcomeHeaderProps) {
  return (
    <section className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white px-6 pt-12 pb-8 relative overflow-hidden">
      {/* 배경 장식 원들 */}
      <div className="absolute top-4 right-8 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
      <div className="absolute top-8 right-16 w-8 h-8 bg-white bg-opacity-30 rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>

      {/* 웰컴 메시지 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-2xl">👨‍🍳</span>
        </div>
        <div>
          <p className="text-lg font-bold">반갑습니다</p>
          <p className="text-lg font-bold">{userName}님</p>
        </div>
      </div>

      <p className="text-sm opacity-90 mb-6">오늘의 장보기를 시작해 보세요.</p>

      {/* 장보기 아이콘 */}
      <div className="absolute bottom-6 right-6">
        <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center">
          <span className="text-2xl">🛒</span>
        </div>
      </div>
    </section>
  );
}

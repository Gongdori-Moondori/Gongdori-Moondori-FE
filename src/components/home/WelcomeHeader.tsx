import Image from 'next/image';

interface WelcomeHeaderProps {
  userName?: string;
}

export default function WelcomeHeader({
  userName = '사용자',
}: WelcomeHeaderProps) {
  return (
    <section
      className="text-neutral-900 px-6 pt-12 pb-8 relative overflow-hidden w-full"
      style={{
        height: '163px',
        borderRadius: '0 0 40px 40px',
        background: '#00D4AC',
        boxShadow: '0 6px 15px 0 rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* 웰컴 메시지 */}
      <div className="flex items-center gap-3 mb-4">
        <Image src="/assets/chef.svg" alt="요리사" width={60} height={60} />

        <div>
          <p className="text-lg font-bold">반갑습니다</p>
          <p className="text-lg font-bold">{userName}님</p>
        </div>
      </div>

      <p className="text-sm opacity-90 mb-6">
        오늘도 알지와 함께 소비를 즐겨보세요.
      </p>

      {/* 장보기 아이콘 */}
      <div className="absolute bottom-6 right-6">
        <Image src="/assets/pot.svg" alt="냄비" width={64} height={64} />
      </div>
    </section>
  );
}

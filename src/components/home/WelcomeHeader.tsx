import Image from 'next/image';

interface WelcomeHeaderProps {
  userName?: string;
}

export default function WelcomeHeader({
  userName = '이예림',
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
      {/* 배경 장식 원들 */}
      {/* <div className="absolute top-4 right-8 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
      <div className="absolute top-8 right-16 w-8 h-8 bg-white bg-opacity-30 rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div> */}

      {/* 웰컴 메시지 */}
      <div className="flex items-center gap-3 mb-4">
        <Image src="/assets/chef.svg" alt="요리사" width={60} height={60} />

        <div>
          <p className="text-lg font-bold">반갑습니다</p>
          <p className="text-lg font-bold">{userName}님</p>
        </div>
      </div>

      <p className="text-sm opacity-90 mb-6">
        오늘의 알지 추천은 어쩌고 저쩌고입니다.
      </p>

      {/* 장보기 아이콘 */}
      <div className="absolute bottom-6 right-6">
        <Image src="/assets/pot.svg" alt="냄비" width={64} height={64} />
      </div>
    </section>
  );
}

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRecommendations } from '@/lib/api/hooks';

interface AIChatBotProps {
  userName?: string;
}

export default function AIChatBot({ userName = '이예림' }: AIChatBotProps) {
  const { data: recommendations } = useRecommendations(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3초마다 추천 아이템 순환
  useEffect(() => {
    if (!recommendations || recommendations.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [recommendations]);

  // 현재 표시할 추천 아이템
  const currentRecommendation = recommendations?.[currentIndex];
  return (
    <div className="mb-6">
      <div className="flex flex-col items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <span className="text-lg">
            <Image src="/assets/robot.svg" alt="로봇" width={60} height={60} />
          </span>
        </div>
        <span className="text-neutral-1000 font-medium">
          <span className="text-primary-500">알지</span>가 {userName}님을 위해
          알려드려요
        </span>
      </div>

      {currentRecommendation && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-4">
          <div className="flex items-center gap-4 ">
            {currentRecommendation.emoji.startsWith('/') ? (
              <Image
                src={currentRecommendation.emoji}
                alt={currentRecommendation.name}
                width={40}
                height={40}
              />
            ) : (
              <span className="text-lg">{currentRecommendation.emoji}</span>
            )}
            <div className="flex flex-col">
              <span className="font-medium">
                지금 이 시기에는
                <span className="text-green-600 font-bold">
                  {currentRecommendation.name}
                </span>
                이(가) 싸요!
              </span>
              <p className="text-sm text-gray-600">장보기 리스트 추가하기</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

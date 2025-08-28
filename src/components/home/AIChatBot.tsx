import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRecommendations } from '@/lib/api/hooks';

interface AIChatBotProps {
  userName?: string;
}

export default function AIChatBot({ userName = '사용자' }: AIChatBotProps) {
  const { data: recommendations } = useRecommendations(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 드래그 시작
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragStartY(clientY);
  };

  // 드래그 종료
  const handleDragEnd = (clientX: number, clientY: number) => {
    if (!isDragging || !recommendations || recommendations.length === 0) return;

    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;

    // 세로 드래그가 가로 드래그보다 크면 무시 (스크롤 우선)
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setIsDragging(false);
      return;
    }

    // 50px 이상 드래그했을 때만 슬라이드 변경
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // 오른쪽으로 드래그 = 이전 아이템
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
        );
      } else {
        // 왼쪽으로 드래그 = 다음 아이템
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % recommendations.length
        );
      }
    }

    setIsDragging(false);
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleDragEnd(e.clientX, e.clientY);
  };

  // 터치 이벤트 (모바일)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    handleDragEnd(touch.clientX, touch.clientY);
  };

  // 특정 인덱스로 직접 이동
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // 3초마다 자동 순환 (드래그 중이 아닐 때만)
  useEffect(() => {
    if (!recommendations || recommendations.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [recommendations, isDragging]);

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

      {currentRecommendation &&
        recommendations &&
        recommendations.length > 0 && (
          <div
            ref={cardRef}
            className="bg-white rounded-2xl p-4 border border-gray-200 mb-4 cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {/* 메인 컨텐츠 */}
            <div className="flex items-center gap-4">
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
                  <span className="text-primary-600 font-bold">
                    {currentRecommendation.name}
                  </span>
                  이(가) 싸요!
                </span>
                <p className="text-sm text-gray-600">장보기 리스트 추가하기</p>
              </div>
            </div>

            {/* 아래쪽 점들 인디케이터 (여러 아이템이 있을 때만 표시) */}
            {recommendations.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {recommendations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex
                        ? 'bg-primary-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`${index + 1}번째 추천 아이템으로 이동`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import type { SeasonalRecommendationItem } from '@/lib/api/types';

interface AIChatBotProps {
  userName?: string;
  seasonalRecommendations?: SeasonalRecommendationItem[];
}

export default function AIChatBot({
  userName = '사용자',
  seasonalRecommendations = [],
}: AIChatBotProps) {
  const [recommendations, setRecommendations] = useState<
    SeasonalRecommendationItem[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // props로 받은 데이터가 있으면 사용, 없으면 빈 배열
    if (seasonalRecommendations && seasonalRecommendations.length > 0) {
      setRecommendations(seasonalRecommendations);
    } else {
      setRecommendations([]);
    }
  }, [seasonalRecommendations]);

  // 드래그 시작
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragStartY(clientY);
  };

  // 드래그 종료
  const handleDragEnd = (clientX: number, clientY: number) => {
    if (!isDragging || recommendations.length === 0) return;

    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setIsDragging(false);
      return;
    }

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
        );
      } else {
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
    if (recommendations.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [recommendations, isDragging]);

  const currentRecommendation = recommendations[currentIndex];
  const handleAddToShoppingList = () => {
    if (isDragging || !currentRecommendation) return;
    alert(
      `${currentRecommendation.itemName}이(가) 장보기 리스트에 추가되었습니다!`
    );
  };

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

      {currentRecommendation && recommendations.length > 0 && (
        <div
          ref={cardRef}
          className="bg-white rounded-2xl p-4 border border-gray-200 mb-4 cursor-grab select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="flex items-center gap-4"
            onClick={handleAddToShoppingList}
            role="button"
          >
            <span className="text-lg">✨</span>
            <div className="flex flex-col">
              <span className="font-medium">
                지금 이 시기에는
                <span className="text-primary-600 font-bold">
                  {' '}
                  {currentRecommendation.itemName}{' '}
                </span>
                이(가) 싸요!
              </span>
              <p className="text-sm text-gray-600">장보기 리스트 추가하기</p>
            </div>
          </div>

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

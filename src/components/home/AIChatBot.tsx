interface AIChatBotProps {
  userName?: string;
  recommendedItem?: {
    emoji: string;
    name: string;
    message: string;
  };
}

export default function AIChatBot({
  userName = '이예림',
  recommendedItem = {
    emoji: '🍉',
    name: '수박',
    message: '지금 이 시기에는',
  },
}: AIChatBotProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <span className="text-blue-600 font-medium">
          알찌가 {userName}님을 위해 알려드려요
        </span>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{recommendedItem.emoji}</span>
          <span className="font-medium">
            {recommendedItem.message}{' '}
            <span className="text-green-600 font-bold">
              {recommendedItem.name}
            </span>
            이 싸요!
          </span>
        </div>
        <p className="text-sm text-gray-600">장보기 리스트 추가하기</p>
      </div>

      <div className="flex items-center gap-2 text-blue-500 text-sm">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.003 8.003 0 01-7.799-6.666M3 12c0-4.418 3.582-8 8-8s8 3.582 8 8"
          />
        </svg>
        <span>{userName}님을 위해 모아봤어요</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        지난주에 비해{' '}
        <span className="text-blue-600 font-medium">할인된 상품</span>이에요
      </p>
    </div>
  );
}

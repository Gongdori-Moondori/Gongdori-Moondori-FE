interface MarketSelectorProps {
  selectedMarket?: string;
  onMarketChange?: (market: string) => void;
}

export default function MarketSelector({
  selectedMarket = '경동시장',
  onMarketChange,
}: MarketSelectorProps) {
  const handleClick = () => {
    // 드롭다운 기능 구현 시 사용
    if (onMarketChange) {
      onMarketChange(selectedMarket);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3">시장 선택하기</h2>
      <button
        onClick={handleClick}
        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 w-full touch-feedback"
      >
        <span className="text-gray-600">{selectedMarket}</span>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { PriceDataAPI } from '@/lib/api/diplomats';

interface Market {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

interface MarketSelectorProps {
  selectedMarketId?: number;
  onMarketChange?: (market: Market) => void;
}

export default function MarketSelector({
  selectedMarketId,
  onMarketChange,
}: MarketSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 시장 데이터 로딩
    const loadMarkets = async () => {
      try {
        const res = await PriceDataAPI.getItemLists();
        const names = res.data?.marketNames || [];
        const mapped: Market[] = names.map((n: string, idx: number) => ({
          id: idx + 1,
          name: n,
          location: '',
          isActive: idx === 0,
        }));
        setMarkets(mapped);
      } catch (error) {
        console.error('Failed to load markets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkets();
  }, []);

  // 선택된 시장 찾기
  const selectedMarket =
    markets.find((market) => market.id === selectedMarketId) || markets[0];

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarketSelect = (market: Market) => {
    setIsOpen(false);
    onMarketChange?.(market);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return (
      <div className="m-6">
        <h2 className="text-lg font-bold mb-3">시장 선택하기</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 w-full">
          <span className="text-gray-400">로딩중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 bg-white p-6" ref={dropdownRef}>
      <h2 className="text-lg font-bold w-1/2 flex items-center">
        시장 선택하기
      </h2>
      <div className="relative w-full">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between p-4 bg.white rounded-lg border border-gray-200 w-full touch-feedback hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-start">
            <span className="text-gray-900 font-medium text-left">
              {selectedMarket?.name || '시장을 선택하세요'}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
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

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {markets.map((market) => (
              <button
                key={market.id}
                onClick={() => handleMarketSelect(market)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  selectedMarket?.id === market.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-900'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{market.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

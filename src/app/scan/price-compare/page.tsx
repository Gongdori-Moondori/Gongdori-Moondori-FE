'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IoLocationOutline,
  IoTimeOutline,
  IoStarOutline,
  IoStar,
  IoMapOutline,
  IoCallOutline,
  IoWalkOutline,
} from 'react-icons/io5';
import PageHeader from '@/components/layout/PageHeader';
import BackButton from '@/components/layout/BackButton';

interface MarketInfo {
  id: string;
  name: string;
  distance: string;
  walkTime: string;
  rating: number;
  price: number;
  originalPrice?: number;
  isOnSale: boolean;
  address: string;
  phone: string;
  operatingHours: string;
  lastUpdated: string;
}

export default function PriceComparePage() {
  const [itemName, setItemName] = useState<string>('');
  const [markets, setMarkets] = useState<MarketInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const item = searchParams.get('item');
    if (item) {
      setItemName(decodeURIComponent(item));
      // 실제로는 API를 호출해서 데이터를 가져올 것
      fetchMarketPrices();
    }
  }, [searchParams]);

  const fetchMarketPrices = async () => {
    setIsLoading(true);

    // 모든 데이터 (실제로는 API에서 가져올 것)
    const mockData: MarketInfo[] = [
      {
        id: '1',
        name: '이마트 성수점',
        distance: '0.3km',
        walkTime: '4분',
        rating: 4.5,
        price: 2500,
        originalPrice: 3000,
        isOnSale: true,
        address: '서울시 성동구 성수동',
        phone: '02-1234-5678',
        operatingHours: '10:00 - 22:00',
        lastUpdated: '2024.01.15 14:30',
      },
      {
        id: '2',
        name: '롯데마트 건대점',
        distance: '0.8km',
        walkTime: '10분',
        rating: 4.2,
        price: 2800,
        isOnSale: false,
        address: '서울시 광진구 건국대학교',
        phone: '02-2345-6789',
        operatingHours: '10:00 - 23:00',
        lastUpdated: '2024.01.15 12:00',
      },
      {
        id: '3',
        name: 'GS25 성수역점',
        distance: '0.2km',
        walkTime: '2분',
        rating: 3.8,
        price: 3200,
        isOnSale: false,
        address: '서울시 성동구 성수역',
        phone: '02-3456-7890',
        operatingHours: '24시간',
        lastUpdated: '2024.01.15 16:45',
      },
      {
        id: '4',
        name: '홈플러스 왕십리점',
        distance: '1.2km',
        walkTime: '15분',
        rating: 4.3,
        price: 2400,
        originalPrice: 2600,
        isOnSale: true,
        address: '서울시 성동구 왕십리',
        phone: '02-4567-8901',
        operatingHours: '10:00 - 24:00',
        lastUpdated: '2024.01.15 13:20',
      },
      {
        id: '5',
        name: '세븐일레븐 성수점',
        distance: '0.1km',
        walkTime: '1분',
        rating: 4.0,
        price: 3100,
        isOnSale: false,
        address: '서울시 성동구 성수동1가',
        phone: '02-5678-9012',
        operatingHours: '24시간',
        lastUpdated: '2024.01.15 15:10',
      },
    ];

    // 가격 순으로 정렬
    const sortedData = mockData.sort((a, b) => a.price - b.price);

    setTimeout(() => {
      setMarkets(sortedData);
      setIsLoading(false);
    }, 1000);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <IoStar key={i} className="text-yellow-400" size={14} />
        ) : (
          <IoStarOutline key={i} className="text-gray-300" size={14} />
        )
      );
    }
    return stars;
  };

  const handleCallMarket = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleShowMap = (address: string) => {
    // 실제로는 지도 앱 연동
    alert(`${address}로 길 안내를 시작합니다.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageHeader title="가격 비교" className="bg-white" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">
              주변 마트 가격 정보를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader title="가격 비교" className="bg-white" />

      <main className="flex-1 p-4">
        <div className="space-y-4">
          {/* 검색한 상품 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">🛒</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{itemName}</h2>
                <p className="text-gray-500 text-sm">
                  주변 {markets.length}개 매장에서 판매 중
                </p>
              </div>
            </div>
          </motion.div>

          {/* 가격 정보 리스트 */}
          <div className="space-y-3">
            {markets.map((market, index) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-gray-900">{market.name}</h3>
                      {index === 0 && (
                        <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                          최저가
                        </span>
                      )}
                      {market.isOnSale && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          세일
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        <IoLocationOutline
                          className="text-gray-400"
                          size={14}
                        />
                        <span className="text-sm text-gray-600">
                          {market.distance}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IoWalkOutline className="text-gray-400" size={14} />
                        <span className="text-sm text-gray-600">
                          도보 {market.walkTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(market.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          {market.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-primary-600">
                        {market.price.toLocaleString()}원
                      </span>
                      {market.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {market.originalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <IoTimeOutline size={12} />
                        <span>{market.operatingHours}</span>
                      </div>
                      <span>업데이트: {market.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleShowMap(market.address)}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                    >
                      <IoMapOutline size={14} />
                      <span>길찾기</span>
                    </button>
                    <button
                      onClick={() => handleCallMarket(market.phone)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                    >
                      <IoCallOutline size={14} />
                      <span>전화</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 하단 안내 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-2xl p-4 mt-6"
          >
            <p className="text-blue-800 text-sm text-center">
              💡 실시간 가격 정보는 매장 상황에 따라 달라질 수 있습니다.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

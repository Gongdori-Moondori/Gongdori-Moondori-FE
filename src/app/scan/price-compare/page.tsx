'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IoLocationOutline,
  IoMapOutline,
  IoCallOutline,
  IoWalkOutline,
} from 'react-icons/io5';
import PageHeader from '@/components/layout/PageHeader';
import { MarketInfo } from '@/lib/api/types';
import Image from 'next/image';

interface MarketPriceData {
  marketCode: string;
  marketName: string;
  marketAddress: string;
  price: number;
  surveyDate: string;
}

export default function PriceComparePage() {
  const [itemName, setItemName] = useState<string>('');
  const [markets, setMarkets] = useState<MarketInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const item = searchParams.get('item');
    if (item) {
      const decodedItem = decodeURIComponent(item);
      setItemName(decodedItem);
      fetchMarketPrices(decodedItem);
    }
  }, [searchParams]);

  const fetchMarketPrices = async (productName: string) => {
    setIsLoading(true);
    try {
      // 실제 API 호출
      const response = await fetch(
        `https://hihigh.lion.it.kr/api/item/name/${encodeURIComponent(productName)}/prices`,
        {
          headers: {
            Authorization: `Bearer ${document.cookie.split('access_token=')[1]?.split(';')[0] || ''}`,
            accept: '*/*',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.pricesByMarkets) {
          const apiMarkets = data.data.pricesByMarkets.map(
            (
              market: {
                marketCode: string;
                marketName: string;
                marketAddress: string;
                price: number;
                surveyDate: string;
              },
              index: number
            ) => ({
              id: market.marketCode || String(index),
              name: market.marketName,
              price: market.price,
              originalPrice: null,
              distance: market.marketAddress || '주소 정보 없음',
              walkTime: '정보 없음',
              address: market.marketAddress || '주소 정보 없음',
              phone: '정보 없음',
              operatingHours: '정보 없음',
              lastUpdated: market.surveyDate || '정보 없음',
              isOnSale: false,
              rating: 0,
            })
          );

          // 가격순으로 정렬 (최저가가 위로)
          apiMarkets.sort((a: MarketInfo, b: MarketInfo) => a.price - b.price);
          setMarkets(apiMarkets);
        } else {
          console.log('API 응답 데이터 구조:', data);
          setMarkets([]);
        }
      } else {
        console.error('API 응답 오류:', response.status);
        setMarkets([]);
      }
    } catch (error) {
      console.error('가격 비교 데이터 로드 실패:', error);
      setMarkets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallMarket = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleShowMap = (address: string, marketName: string) => {
    // 구글 지도로 연동 (모든 플랫폼)
    const encodedAddress = encodeURIComponent(address);
    const encodedMarketName = encodeURIComponent(marketName);

    // 구글 지도 검색 URL (매장명 + 주소로 검색)
    const googleMapsUrl = `https://www.google.com/maps/search/${encodedMarketName}+${encodedAddress}`;

    // 새 탭에서 구글 지도 열기
    window.open(googleMapsUrl, '_blank');
  };

  const handleAddToCart = async (market: MarketInfo) => {
    try {
      // TODO: 실제 장바구니 API 연동 예정
      alert(`${market.name}에서 ${itemName}을(를) 장바구니에 추가했습니다.`);
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다.');
    }
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
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">
                  <Image
                    src="/assets/cart.svg"
                    alt="cart"
                    width={24}
                    height={24}
                  />
                </span>
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
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          최저가
                        </span>
                      )}
                      {/* {market.isOnSale && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          세일
                        </span>
                      )} */}
                    </div>

                    <div className="flex items-start flex-col space-x-4 mb-2">
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

                    {/* <div className="flex items-start flex-col space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <IoTimeOutline size={12} />
                        <span>{market.operatingHours}</span>
                      </div>
                      <span>업데이트: {market.lastUpdated}</span>
                    </div> */}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleAddToCart(market)}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      장바구니 담기
                    </button>
                    <button
                      onClick={() => handleShowMap(market.address, market.name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
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

'use client';

import PageHeader from '@/components/layout/PageHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { DynamicMap } from '@/components/map';
import { useState, useEffect, useCallback } from 'react';

// 동대문구 전통시장 내부 구획 데이터
const sampleShops = [
  // 경동시장 신관
  {
    id: 'section-001',
    name: '경동시장 신관 1층',
    category: '농산물',
    position: { lat: 37.578784, lng: 127.039659 },
    address: '서울 동대문구 고산자로36길 3 (제기동)',
    rating: 4.6,
    reviewCount: 342,
    description: '농산물, 건어물, 곡류 전문',
  },
  {
    id: 'section-002',
    name: '경동시장 신관 2층',
    category: '한약재',
    position: { lat: 37.578784, lng: 127.039659 },
    address: '서울 동대문구 고산자로36길 3 (제기동)',
    rating: 4.7,
    reviewCount: 289,
    description: '한약재, 인삼, 수삼 전문',
  },
  {
    id: 'section-003',
    name: '경동시장 신관 3층',
    category: '건어물',
    position: { lat: 37.578784, lng: 127.039659 },
    address: '서울 동대문구 고산자로36길 3 (제기동)',
    rating: 4.5,
    reviewCount: 156,
    description: '건어물, 견과류 전문',
  },
  // 경동시장 구관
  {
    id: 'section-004',
    name: '경동시장 구관 1층',
    category: '농산물',
    position: { lat: 37.578784, lng: 127.039659 },
    address: '서울 동대문구 고산자로36길 3 (제기동)',
    rating: 4.4,
    reviewCount: 198,
    description: '농산물, 양념류 전문',
  },
  {
    id: 'section-005',
    name: '경동시장 구관 2층',
    category: '한약재',
    position: { lat: 37.578784, lng: 127.039659 },
    address: '서울 동대문구 고산자로36길 3 (제기동)',
    rating: 4.8,
    reviewCount: 423,
    description: '한약재 전문점 60여개',
  },
  // 청량리시장
  {
    id: 'section-006',
    name: '청량리농수산물시장',
    category: '농수산물',
    position: { lat: 37.572, lng: 127.041 },
    address: '서울 동대문구 경동시장로 22 (제기동 629-2)',
    rating: 4.3,
    reviewCount: 167,
    description: '농수산물 도매시장',
  },
  {
    id: 'section-007',
    name: '동서시장(청과물도매)',
    category: '청과물',
    position: { lat: 37.572, lng: 127.043 },
    address: '서울 동대문구 왕산로33길 13 (제기동 650)',
    rating: 4.4,
    reviewCount: 234,
    description: '청과물 도매시장',
  },
  {
    id: 'section-008',
    name: '청량리전통시장',
    category: '전통시장',
    position: { lat: 37.574, lng: 127.038 },
    address: '서울 동대문구 경동시장로 2길 49-3 (청량리동 773)',
    rating: 4.5,
    reviewCount: 189,
    description: '전통시장, 통닭거리',
  },
  {
    id: 'section-009',
    name: '청량리수산시장',
    category: '수산물',
    position: { lat: 37.572, lng: 127.043 },
    address: '서울 동대문구 고산자로34길 48-1 (용신동 20-47)',
    rating: 4.2,
    reviewCount: 145,
    description: '수산물 전문시장',
  },
  {
    id: 'section-010',
    name: '서울약령시장',
    category: '한약재',
    position: { lat: 37.571, lng: 127.039 },
    address: '서울 동대문구 약령중앙로 20 (제기동 1113-2)',
    rating: 4.7,
    reviewCount: 312,
    description: '한약재 전문시장',
  },
  // 기타 전통시장
  {
    id: 'section-011',
    name: '전농로터리시장',
    category: '전통시장',
    position: { lat: 37.588, lng: 127.037 },
    address: '서울 동대문구 전농로15길 7 (전농동 295-52)',
    rating: 4.1,
    reviewCount: 98,
    description: '종합 전통시장',
  },
  {
    id: 'section-012',
    name: '답십리시장',
    category: '전통시장',
    position: { lat: 37.569, lng: 127.031 },
    address: '서울 동대문구 답십리로51길 4-1 (답십리동 66-17)',
    rating: 4.3,
    reviewCount: 134,
    description: '전통시장',
  },
];

interface RouteInfo {
  distance: string;
  duration: string;
  directionsUrl: string;
}

const MapPage = () => {
  const [selectedShop, setSelectedShop] = useState<
    (typeof sampleShops)[0] | null
  >(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapCenter = { lat: 37.578784, lng: 127.039659 }; // 경동시장 중심
  const [center, setCenter] = useState<{ lat: number; lng: number }>(mapCenter);

  // Google Geolocation API 사용
  const getGoogleGeolocation = async (): Promise<{
    position: { lat: number; lng: number };
    accuracy: number;
  } | null> => {
    try {
      console.log('Google Geolocation API 요청 시작...');

      // WiFi 액세스 포인트와 셀 타워 정보를 위한 타입 정의
      interface WifiAccessPoint {
        macAddress: string;
        signalStrength: number;
        signalToNoiseRatio?: number;
        channel?: number;
      }

      interface CellTower {
        cellId: number;
        locationAreaCode: number;
        mobileCountryCode: number;
        mobileNetworkCode: number;
        signalStrength?: number;
        age?: number;
      }

      const wifiAccessPoints: WifiAccessPoint[] = [];
      const cellTowers: CellTower[] = [];

      const requestBody = {
        wifiAccessPoints,
        cellTowers,
      };

      // Google Geolocation API 응답 타입 정의
      interface GoogleGeolocationResponse {
        location: {
          lat: number;
          lng: number;
        };
        accuracy?: number;
      }

      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Geolocation API 오류: ${response.status}`);
      }

      const data: GoogleGeolocationResponse = await response.json();

      if (data.location) {
        const position = {
          lat: data.location.lat,
          lng: data.location.lng,
        };
        const accuracy = data.accuracy || 1000;

        console.log('Google 위치 성공:', position, '정확도:', accuracy);
        return { position, accuracy };
      }

      return null;
    } catch (error) {
      console.log('Google Geolocation API 실패:', error);
      return null;
    }
  };

  // 현재 위치 가져오기 (Google Geolocation API 사용)
  const getCurrentLocation = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Google Geolocation API 사용
      const googleResult = await getGoogleGeolocation();

      if (googleResult) {
        setCurrentLocation(googleResult.position);
        setCenter(googleResult.position);
        console.log('Google 위치 설정 완료:', googleResult.position);
      } else {
        console.log('Google 위치 가져오기 실패');
      }
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // 컴포넌트 마운트 시 한 번만 실행 (무한 루프 방지)
  useEffect(() => {
    // 초기 로딩 시에만 실행
    const initializeMap = () => {
      // 지도 중심을 경동시장으로 설정
      setCenter(mapCenter);
    };

    initializeMap();
  }, []); // 빈 의존성 배열로 한 번만 실행

  // GPS 위치 가져오기
  const getGPSLocation = (): Promise<{
    position: { lat: number; lng: number };
    accuracy: number;
  } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('브라우저가 Geolocation을 지원하지 않습니다');
        resolve(null);
        return;
      }

      console.log('GPS 위치 요청 시작...');

      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          const gpsPos = { lat: latitude, lng: longitude };
          console.log('GPS 위치 성공:', gpsPos, '정확도:', accuracy);
          resolve({ position: gpsPos, accuracy });
        },
        (error) => {
          console.log('GPS 위치 실패:', error.message);
          let errorMessage = '위치를 가져올 수 없습니다.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                '위치 정보를 사용할 수 없습니다. 네트워크 연결을 확인해주세요.';
              break;
            case error.TIMEOUT:
              errorMessage =
                '위치 요청 시간이 초과되었습니다. 다시 시도해주세요.';
              break;
            default:
              errorMessage =
                '위치를 가져올 수 없습니다. 브라우저 설정을 확인해주세요.';
          }

          resolve(null);
        },
        options
      );
    });
  };

  // 구글 Maps Directions API로 실제 경로 정보 가져오기 (프록시를 통해)
  const getGoogleDirections = async (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
  ): Promise<{ distance: string; duration: string } | null> => {
    try {
      // 좌표를 6자리 소수점으로 정리하여 정확한 형식으로 변환
      const startStr = `${start.lat.toFixed(6)},${start.lng.toFixed(6)}`;
      const endStr = `${end.lat.toFixed(6)},${end.lng.toFixed(6)}`;

      // 먼저 보행 경로 시도
      let url = `/api/google-directions?origin=${startStr}&destination=${endStr}&mode=walking`;

      console.log('Google Directions API 프록시 요청 (보행):', url);

      let response = await fetch(url);
      let data = await response.json();

      // 보행 경로가 성공하면 반환
      if (response.ok && data.status === 'OK') {
        console.log('Google Directions 성공 (보행):', {
          distance: data.distance,
          duration: data.duration,
        });
        return { distance: data.distance, duration: data.duration };
      }

      // 보행 경로 실패 시 대중교통으로 재시도
      console.log('보행 경로 실패, 대중교통으로 재시도...');
      url = `/api/google-directions?origin=${startStr}&destination=${endStr}&mode=transit`;

      console.log('Google Directions API 프록시 요청 (대중교통):', url);

      response = await fetch(url);
      data = await response.json();

      if (response.ok && data.status === 'OK') {
        console.log('Google Directions 성공 (대중교통):', {
          distance: data.distance,
          duration: data.duration,
        });
        return { distance: data.distance, duration: data.duration };
      }

      // 모든 방법 실패 시 null 반환
      console.log('모든 경로 찾기 실패:', data);
      return null;
    } catch (error) {
      console.log('Google Directions API 실패:', error);
      return null;
    }
  };

  // 구글 지도 경로 찾기 (현재 위치에서)
  const getRouteFromCurrentLocation = async (shop: (typeof sampleShops)[0]) => {
    if (!currentLocation) {
      alert('먼저 현재 위치를 설정해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 1. Google Directions API로 실제 거리/시간 가져오기
      const directions = await getGoogleDirections(
        currentLocation,
        shop.position
      );

      if (directions) {
        // 실제 API 결과 사용
        const directionsUrl = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${shop.position.lat},${shop.position.lng}/data=!3m1!4b1!4m2!4m1!3e2`;

        setRouteInfo({
          distance: directions.distance,
          duration: directions.duration,
          directionsUrl,
        });
        setSelectedShop(shop);
        return;
      }

      // 2. API 실패 시 대략적인 계산 사용
      const distance = calculateDistance(currentLocation, shop.position);
      const duration = Math.round(distance / 0.08); // 도보 속도 약 4.8km/h

      const directionsUrl = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${shop.position.lat},${shop.position.lng}/data=!3m1!4b1!4m2!4m1!3e2`;

      setRouteInfo({
        distance: `${distance.toFixed(1)}km (대략적)`,
        duration: `${duration}분 (대략적)`,
        directionsUrl,
      });
      setSelectedShop(shop);
    } catch (error) {
      console.error('경로 찾기 실패:', error);
      alert('경로를 찾을 수 없습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 구글 지도 경로 찾기 (지도 중심에서)
  const getRoute = async (shop: (typeof sampleShops)[0]) => {
    setLoading(true);

    try {
      // 1. Google Directions API로 실제 거리/시간 가져오기
      const directions = await getGoogleDirections(center, shop.position);

      if (directions) {
        // 실제 API 결과 사용
        const directionsUrl = `https://www.google.com/maps/dir/${center.lat},${center.lng}/${shop.position.lat},${shop.position.lng}/data=!3m1!4b1!4m2!4m1!3e2`;

        setRouteInfo({
          distance: directions.distance,
          duration: directions.duration,
          directionsUrl,
        });
        setSelectedShop(shop);
        return;
      }

      // 2. API 실패 시 대략적인 계산 사용
      const distance = calculateDistance(center, shop.position);
      const duration = Math.round(distance / 0.08); // 도보 속도 약 4.8km/h

      const directionsUrl = `https://www.google.com/maps/dir/${center.lat},${center.lng}/${shop.position.lat},${shop.position.lng}/data=!3m1!4b1!4m2!4m1!3e2`;

      setRouteInfo({
        distance: `${distance.toFixed(1)}km (대략적)`,
        duration: `${duration}분 (대략적)`,
        directionsUrl,
      });
      setSelectedShop(shop);
    } catch (error) {
      console.error('경로 찾기 실패:', error);
      alert('경로를 찾을 수 없습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 두 지점 간의 거리 계산 (Haversine 공식)
  const calculateDistance = (
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader title="전통시장 찾기" />
      <main className="flex-1 p-4 pb-24 flex flex-col gap-4">
        <div className="space-y-4">
          {/* 경로 찾기 설정 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-md font-semibold mb-3">📍 경로 찾기</h3>
            <div className="space-y-3">
              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? '📍 위치 가져오는 중...' : '📍 GPS 위치 설정'}
              </button>
            </div>
          </div>
        </div>

        {/* 경로 정보 */}
        {routeInfo && selectedShop && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-md font-semibold mb-3">
              🚶‍♂️ {selectedShop.name}까지의 경로
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">총 거리:</span>
                <span className="font-medium">{routeInfo.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">예상 시간:</span>
                <span className="font-medium">{routeInfo.duration}</span>
              </div>
              <div className="mt-3">
                <a
                  href={routeInfo.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🗺️ 구글 지도에서 경로 보기
                </a>
              </div>
              <button
                onClick={() => {
                  setRouteInfo(null);
                  setSelectedShop(null);
                }}
                className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 지도 컨테이너 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">마켓 위치</h2>
          <DynamicMap
            center={center || mapCenter}
            shops={sampleShops}
            width={350}
            height={300}
            zoom={15}
            currentLocation={currentLocation}
          />
        </div>

        {/* 상점 목록 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-md font-semibold mb-3">주변 상점</h3>
          <div className="space-y-3">
            {sampleShops.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                  style={{
                    backgroundColor: getCategoryColor(shop.category),
                  }}
                >
                  {getCategoryIcon(shop.category)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{shop.name}</h4>
                  <p className="text-sm text-gray-600">{shop.description}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  {currentLocation ? (
                    <button
                      onClick={() => getRouteFromCurrentLocation(shop)}
                      disabled={loading}
                      className="text-blue-500 text-sm font-medium hover:text-blue-600 disabled:opacity-50"
                    >
                      🚶‍♂️ 경로보기
                    </button>
                  ) : (
                    <button
                      onClick={() => getRoute(shop)}
                      disabled={loading}
                      className="text-gray-400 text-sm font-medium"
                    >
                      📍 위치 설정 후
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

// 카테고리별 색상과 아이콘 함수
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    농산물: '#27AE60',
    한약재: '#8E44AD',
    건어물: '#3498DB',
    농수산물: '#E67E22',
    청과물: '#F1C40F',
    전통시장: '#E74C3C',
    수산물: '#2980B9',
    음료: '#95A5A6',
    가공식품: '#34495E',
  };
  return colors[category] || '#95A5A6';
};

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    농산물: '🌾',
    한약재: '🌿',
    건어물: '🐟',
    농수산물: '🥬',
    청과물: '🍎',
    전통시장: '🏮',
    수산물: '🦐',
    음료: '🥤',
    가공식품: '🥫',
  };
  return icons[category] || '🏪';
};

export default MapPage;

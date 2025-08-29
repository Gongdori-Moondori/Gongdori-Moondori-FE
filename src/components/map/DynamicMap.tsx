'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { IoLocation, IoInformationCircle } from 'react-icons/io5';

// Google Maps API 키 (실제 사용시 환경변수로 설정)
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export interface Shop {
  id: string;
  name: string;
  category: string;
  position: { lat: number; lng: number };
  address: string;
  rating?: number;
  reviewCount?: number;
}

export interface DynamicMapProps {
  center: { lat: number; lng: number };
  shops: Shop[];
  width?: number;
  height?: number;
  zoom?: number;
  className?: string;
  onShopSelect?: (shop: Shop) => void;
  currentLocation?: { lat: number; lng: number } | null;
}

const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
] as google.maps.MapTypeStyle[];

const DynamicMap: React.FC<DynamicMapProps> = ({
  center,
  shops,
  width = 400,
  height = 300,
  zoom = 15,
  className = '',
  onShopSelect,
  currentLocation,
}) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  return (
    <div className={className} style={{ width, height, position: 'relative' }}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          onLoad={handleMapLoad}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={zoom}
          options={{
            styles: mapStyles,
            clickableIcons: false,
            disableDefaultUI: true,
            zoomControl: true,
            controlSize: 28,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* 현재 위치 마커 */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                url:
                  'data:image/svg+xml;charset=UTF-8,' +
                  encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#4285F4" stroke="#FFFFFF" stroke-width="3"/>
                    <circle cx="20" cy="20" r="8" fill="#FFFFFF"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20),
              }}
              zIndex={9999}
              title="현재 위치"
            />
          )}

          {/* 상점 마커들 */}
          {isMapLoaded &&
            shops &&
            shops.map((shop) => (
              <Marker
                key={shop.id}
                position={shop.position}
                title={shop.name}
                onClick={() => {
                  setSelectedShop(shop);
                  onShopSelect?.(shop);
                }}
              />
            ))}
        </GoogleMap>
      </LoadScript>

      {/* 선택된 상점 정보 표시 */}
      {selectedShop && (
        <div className="absolute top-2 left-2 right-2 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="flex items-center space-x-2">
            <IoLocation className="text-blue-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{selectedShop.name}</h3>
              <p className="text-xs text-gray-600">{selectedShop.address}</p>
              {selectedShop.rating && (
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs text-gray-600">
                    {selectedShop.rating} ({selectedShop.reviewCount || 0})
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedShop(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 로딩 상태 표시 */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">지도 초기화 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicMap;

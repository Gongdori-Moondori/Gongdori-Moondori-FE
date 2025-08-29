const CACHE_NAME = 'gongdori-v1';
const urlsToCache = [
  '/',
  '/mypage',
  '/category',
  '/scan/price-compare',
  '/assets/cart.svg',
  '/assets/tomato.svg',
  '/assets/sauce.svg',
  '/assets/meat.svg',
  '/assets/fish.svg',
  '/assets/dairy.svg',
  '/assets/bread.svg',
  '/assets/drink.svg',
  '/assets/snack.svg',
  '/assets/health.svg',
  '/assets/household.svg',
  '/assets/beauty.svg',
  '/assets/baby.svg',
  '/assets/pet.svg'
];

// Service Worker 설치 시 캐시에 리소스 저장
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 요청 시 캐시에서 먼저 확인
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시된 응답 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크 요청
        return fetch(event.request).then(
          (response) => {
            // 유효한 응답이 아니면 그대로 반환
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 복제하여 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// 캐시 업데이트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

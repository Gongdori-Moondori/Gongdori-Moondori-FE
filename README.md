# 알뜰하게 지출관리하기, 알지

> 스마트 쇼핑 가격 비교 및 절약 앱

알지는 전통시장과 대형마트의 가격을 실시간으로 비교하여 사용자에게 최적의 쇼핑 정보를 제공하는 PWA(Progressive Web App)입니다. OCR 기술을 활용한 장보기 리스트 스캔, AI 기반 상품 추천, 전통시장 위치 안내 등 다양한 기능을 제공합니다.

## 🚀 주요 기능

### 📱 핵심 기능

- **가격 비교**: 전통시장과 대형마트의 실시간 가격 비교
- **AI 추천**: 계절별 상품 추천 및 절약 정보 제공
- **OCR 스캔**: 장보기 리스트 사진 촬영/업로드로 자동 리스트 생성
- **지도 서비스**: 전통시장 위치 안내 및 경로 찾기
- **장보기 관리**: 개인 장보기 리스트 및 즐겨찾기 관리

### 🛍️ 쇼핑 기능

- **TOP 3 상품**: 가장 절약할 수 있는 상품 추천
- **카테고리별 상품**: 채소, 과일, 육류 등 카테고리별 상품 조회
- **즐겨찾기**: 자주 구매하는 상품 즐겨찾기
- **자주 구매 상품**: 개인 구매 패턴 분석

### 🗺️ 위치 서비스

- **전통시장 위치**: 동대문구 전통시장 위치 정보
- **경로 안내**: Google Maps API를 활용한 실시간 경로 안내
- **현재 위치**: GPS 및 Google Geolocation API 지원

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: React Icons

### 상태 관리 & 데이터

- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios

### 외부 서비스

- **Maps**: Google Maps API, @react-google-maps/api
- **OCR**: Tesseract.js
- **PWA**: next-pwa

### 개발 도구

- **Linting**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged
- **Package Manager**: npm

# 개발 서버 실행 (Turbopack 사용)

npm run dev

# 또는 백엔드와 함께 실행

npm run dev:all

````

### 5. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format
````

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API 라우트
│   │   ├── auth/                 # 인증 관련 API
│   │   ├── google-directions/    # Google Maps API 프록시
│   │   └── shopping/             # 쇼핑 관련 API
│   ├── auth/                     # 인증 페이지
│   ├── scan/                     # OCR 스캔 페이지
│   ├── map/                      # 지도 페이지
│   ├── mypage/                   # 마이페이지
│   └── category/                 # 카테고리 페이지
├── components/                    # 재사용 가능한 컴포넌트
│   ├── home/                     # 홈페이지 컴포넌트
│   ├── layout/                   # 레이아웃 컴포넌트
│   ├── product/                  # 상품 관련 컴포넌트
│   ├── scan/                     # 스캔 관련 컴포넌트
│   └── ui/                       # UI 컴포넌트
├── lib/                          # 유틸리티 및 설정
│   ├── api/                      # API 클라이언트
│   ├── data/                     # 정적 데이터
│   └── utils/                    # 유틸리티 함수
├── hooks/                        # 커스텀 훅
└── contexts/                     # React Context
```

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary**: 민트/터키색 (#14b8a6) - 메인 브랜드 컬러
- **Secondary**: 회색 (#64748b) - 중성 컬러
- **Accent**: 노란색 (#f59e0b) - 강조 컬러
- **Success**: 초록색 (#22c55e) - 성공/신선함
- **Error**: 빨간색 (#ef4444) - 에러/경고

### 폰트

- **Primary**: Paperlogy (커스텀 폰트)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

## 📱 PWA 기능

- **오프라인 지원**: Service Worker를 통한 오프라인 캐싱
- **앱 설치**: 홈 화면에 앱 추가 가능
- **모바일 최적화**: 모바일 터치 인터페이스
- **푸시 알림**: 상품 가격 변동 알림 (예정)

## 🔧 주요 컴포넌트

### 홈페이지

- **WelcomeHeader**: 사용자 환영 메시지
- **MarketSelector**: 전통시장 선택
- **AIChatBot**: AI 기반 상품 추천
- **TopThreeProducts**: TOP 3 절약 상품
- **AllProductsSection**: 전체 상품 목록

### 스캔 기능

- **OCR 처리**: Tesseract.js를 활용한 텍스트 추출
- **이미지 전처리**: 그레이스케일 변환, 대비 향상
- **장보기 리스트 파싱**: 식재료 키워드 기반 자동 분류

### 지도 기능

- **DynamicMap**: Google Maps 통합
- **경로 찾기**: Google Directions API
- **위치 서비스**: GPS 및 Google Geolocation

**알뜰하게 지출관리하기** - 스마트한 쇼핑의 시작 🛒✨

'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';
import Image from 'next/image';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import IconWithTitle from '@/components/ui/IconWithTitle';

interface ShoppingItem {
  name: string;
  checked: boolean;
}

interface OCRResult {
  extractedText: string;
  shoppingList: ShoppingItem[];
  confidence: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export default function Scan() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const processingSteps = [
    '이미지 업로드 중...',
    '이미지 전처리 중...',
    'OCR 텍스트 추출 중...',
    '장보기 리스트 분석 중...',
    '처리 완료!',
  ];

  // 이미지 전처리 함수
  const preprocessImage = async (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new HTMLImageElement();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // 이미지 크기 조정 (너무 크면 OCR 성능 저하)
          const maxSize = 1200;
          let { width, height } = img;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // 이미지 그리기
          ctx.drawImage(img, 0, 0, width, height);

          // 그레이스케일 변환 (OCR 정확도 향상)
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const gray =
              data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }

          ctx.putImageData(imageData, 0, 0);

          // 대비 향상
          ctx.filter = 'contrast(1.2) brightness(1.1)';
          ctx.drawImage(canvas, 0, 0);

          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } else {
          resolve(imageData);
        }
      };
      img.src = imageData;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setUploadedImage(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        processImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // OCR 처리 함수
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProcessingStep(0);
    setOcrResult(null);

    try {
      // 단계별 처리 시뮬레이션
      for (let i = 0; i < processingSteps.length - 1; i++) {
        setProcessingStep(i);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // 이미지 전처리
      const processedImage = await preprocessImage(imageData);

      // Tesseract.js를 사용한 OCR 처리
      const result = await Tesseract.recognize(processedImage, 'kor+eng', {
        logger: (m) => console.log(m),
      });

      const extractedText = result.data.text;

      // 장보기 리스트 파싱
      const shoppingList = parseShoppingList(extractedText);

      setProcessingStep(processingSteps.length - 1);

      setOcrResult({
        extractedText,
        shoppingList,
        confidence: result.data.confidence,
        status: 'completed',
      });
    } catch (error) {
      console.error('OCR 처리 중 오류:', error);
      setOcrResult({
        extractedText: '',
        shoppingList: [],
        confidence: 0,
        status: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 장보기 리스트 파싱 함수
  const parseShoppingList = (text: string): ShoppingItem[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    const items: ShoppingItem[] = [];

    // 일반적인 식재료/생필품 키워드
    const foodKeywords = [
      '사과',
      '배',
      '바나나',
      '오렌지',
      '포도',
      '딸기',
      '수박',
      '멜론',
      '토마토',
      '오이',
      '당근',
      '양파',
      '마늘',
      '생강',
      '감자',
      '고구마',
      '배추',
      '상추',
      '시금치',
      '브로콜리',
      '파프리카',
      '호박',
      '가지',
      '무',
      '콩나물',
      '숙주',
      '버섯',
      '느타리버섯',
      '팽이버섯',
      '쌀',
      '현미',
      '찹쌀',
      '보리',
      '귀리',
      '면',
      '라면',
      '파스타',
      '빵',
      '식빵',
      '우유',
      '요거트',
      '치즈',
      '버터',
      '계란',
      '달걀',
      '닭고기',
      '돼지고기',
      '소고기',
      '생선',
      '참치',
      '고등어',
      '연어',
      '새우',
      '오징어',
      '조개',
      '게',
      '랍스터',
      '간장',
      '된장',
      '고추장',
      '식초',
      '설탕',
      '소금',
      '후추',
      '기름',
      '참기름',
      '올리브오일',
      '마요네즈',
      '케첩',
      '물',
      '음료',
      '주스',
      '커피',
      '차',
      '녹차',
      '홍차',
      '맥주',
      '소주',
      '와인',
      '세제',
      '샴푸',
      '린스',
      '비누',
      '치약',
      '칫솔',
      '휴지',
      '화장지',
      '물티슈',
      '세안제',
    ];

    for (const line of lines) {
      const cleanLine = line.trim();

      // 체크 표시가 있는 경우 처리
      const hasCheck =
        /^[✓√☑✔]\s*/.test(cleanLine) || /^\s*[oO]\s*/.test(cleanLine);
      const cleanedItem = cleanLine.replace(/^[✓√☑✔oO]\s*/, '').trim();

      // 빈 줄이나 너무 짧은 줄 제외
      if (cleanedItem.length < 2) continue;

      // 숫자나 특수문자만 있는 줄 제외
      if (/^[\d\s\-_.]+$/.test(cleanedItem)) continue;

      // 식재료/생필품 키워드가 포함되어 있거나, 한글이 포함된 경우 추가
      const containsFood = foodKeywords.some((keyword) =>
        cleanedItem.includes(keyword)
      );
      const containsKorean = /[가-힣]/.test(cleanedItem);

      if (containsFood || (containsKorean && cleanedItem.length >= 2)) {
        // 중복 제거
        if (!items.some((item) => item.name === cleanedItem)) {
          items.push({
            name: cleanedItem,
            checked: hasCheck,
          });
        }
      }
    }

    return items.slice(0, 20); // 최대 20개 항목
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview('');
    setOcrResult(null);
    setIsProcessing(false);
    setProcessingStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = () => {
    // 카메라 촬영 페이지로 이동
    router.push('/scan/camera');
  };

  const handleProcessNext = () => {
    if (ocrResult && ocrResult.shoppingList.length > 0) {
      // 처리된 결과를 가지고 다음 단계로 이동 (결과 페이지나 편집 페이지)
      localStorage.setItem(
        'shoppingList',
        JSON.stringify(ocrResult.shoppingList)
      );
      router.push('/scan/edit');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <PageHeader title="스캔하기" className="bg-white" />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 pb-24">
        <div className="space-y-8">
          {/* 카메라 촬영 섹션 */}
          <div className="px-4">
            <IconWithTitle
              iconSrc="/assets/camera.svg"
              iconAlt="카메라"
              title="이예림님의 장보기 리스트를 찍어주세요"
            />

            {/* 촬영하기 버튼 */}
            <div className="mt-6">
              <button
                onClick={handleCameraCapture}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 px-6 rounded-2xl transition-colors duration-200 text-lg"
              >
                촬영하기
              </button>
            </div>
          </div>

          {/* 또는 구분선 */}
          <div className="flex items-center gap-4 px-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">또는</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* 이미지 업로드 섹션 */}
          <div className="px-4">
            <IconWithTitle
              iconSrc="/assets/photo.svg"
              iconAlt="사진"
              title="앗 이미 찍어둔 사진이 있나요?"
            />

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {!uploadedImage ? (
                <div
                  onClick={handleFileInputClick}
                  className="w-full mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex justify-center mb-4">
                      <div className="text-gray-400">
                        <svg
                          className="mx-auto h-12 w-12"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium text-primary-600 hover:text-primary-700">
                        클릭하여 이미지 선택
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF 최대 5MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="업로드된 이미지"
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-primary-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {uploadedImage.name} (
                    {(uploadedImage.size / 1024 / 1024).toFixed(2)}MB)
                  </p>
                </div>
              )}
            </div>

            {/* OCR 처리 상태 표시 */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-transparent"></div>
                  <span className="font-medium text-primary-700">
                    {processingSteps[processingStep]}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((processingStep + 1) / processingSteps.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}

            {/* OCR 결과 표시 */}
            <AnimatePresence>
              {ocrResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 space-y-4"
                >
                  {ocrResult.status === 'completed' &&
                  ocrResult.shoppingList.length > 0 ? (
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="font-medium text-primary-700">
                          장보기 리스트 추출 완료!
                        </span>
                        <span className="text-sm text-primary-600">
                          ({ocrResult.shoppingList.length}개 항목)
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-3 mb-3 max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-1">
                          {ocrResult.shoppingList
                            .slice(0, 6)
                            .map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center text-sm"
                              >
                                <span
                                  className={`w-3 h-3 rounded-full mr-2 ${item.checked ? 'bg-primary-500' : 'bg-gray-300'}`}
                                ></span>
                                <span
                                  className={
                                    item.checked
                                      ? 'line-through text-gray-500'
                                      : 'text-gray-700'
                                  }
                                >
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          {ocrResult.shoppingList.length > 6 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{ocrResult.shoppingList.length - 6}개 더...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={handleRemoveImage}
                          className="flex-1 bg-secondary-200 hover:bg-primary-200 text-primary-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm "
                        >
                          다시 촬영
                        </button>
                        <button
                          onClick={handleProcessNext}
                          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          리스트 편집
                        </button>
                      </div>
                    </div>
                  ) : ocrResult.status === 'error' ? (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <span className="font-medium text-red-700">
                          처리 중 오류가 발생했습니다
                        </span>
                      </div>
                      <p className="text-red-600 text-sm mb-3">
                        이미지를 다시 업로드하거나 더 선명한 이미지를
                        사용해보세요.
                      </p>
                      <button
                        onClick={handleRemoveImage}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        다시 시도
                      </button>
                    </div>
                  ) : ocrResult.status === 'completed' &&
                    ocrResult.shoppingList.length === 0 ? (
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">?</span>
                        </div>
                        <span className="font-medium text-primary-700">
                          장보기 리스트를 찾을 수 없습니다
                        </span>
                      </div>
                      <p className="text-primary-600 text-sm mb-3">
                        더 선명한 이미지이거나 장보기 리스트가 명확히 보이는
                        사진을 사용해보세요.
                      </p>
                      <button
                        onClick={handleRemoveImage}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        다른 이미지 선택
                      </button>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 완료 상태 표시 (OCR 결과가 없을 때만) */}
            {uploadedImage && !ocrResult && !isProcessing && (
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-primary-500 text-white rounded-full text-sm">
                  이미지 업로드 완료
                  <button
                    onClick={handleRemoveImage}
                    className="ml-2 text-white hover:text-primary-200"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

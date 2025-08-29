'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createWorker } from 'tesseract.js';
import PageHeader from '@/components/layout/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function ScanResultContent() {
  const [ocrResult, setOcrResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [extractedItems, setExtractedItems] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageUrl = searchParams.get('image');

  useEffect(() => {
    if (imageUrl) {
      processImage(imageUrl);
    }
  }, [imageUrl]);

  const processImage = async (imageDataUrl: string) => {
    setIsProcessing(true);
    setError('');

    try {
      // Tesseract.js를 사용한 OCR 처리
      const worker = await createWorker('kor+eng');
      const {
        data: { text },
      } = await worker.recognize(imageDataUrl);
      await worker.terminate();

      setOcrResult(text);

      // 텍스트에서 쇼핑 리스트 항목 추출
      const items = extractShoppingItems(text);
      setExtractedItems(items);
    } catch (err) {
      console.error('OCR 처리 오류:', err);
      setError('이미지를 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractShoppingItems = (text: string): string[] => {
    // 간단한 쇼핑 리스트 추출 로직
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const items: string[] = [];
    const commonItems = [
      '사과',
      '바나나',
      '우유',
      '계란',
      '빵',
      '쌀',
      '당근',
      '양파',
      '감자',
      '토마토',
      '상추',
      '오이',
      '마늘',
      '생강',
      '고기',
      '생선',
      '치킨',
      'yogurt',
      'milk',
      'bread',
      'apple',
      'banana',
      'carrot',
      'onion',
    ];

    lines.forEach((line) => {
      // 숫자나 특수문자 제거하고 정리
      const cleaned = line.replace(/[0-9\-\*\•]/g, '').trim();

      if (cleaned.length > 1) {
        // 일반적인 식품명이 포함되어 있거나 한글 2글자 이상인 경우
        const hasCommonItem = commonItems.some((item) =>
          cleaned.toLowerCase().includes(item.toLowerCase())
        );

        if (hasCommonItem || /[가-힣]{2,}/.test(cleaned)) {
          items.push(cleaned);
        }
      }
    });

    // 중복 제거 및 정리
    return [...new Set(items)].slice(0, 20); // 최대 20개 항목
  };

  const handleRetry = () => {
    router.back();
  };

  const handleSaveToList = () => {
    // TODO: 추출된 항목들을 사용자의 쇼핑 리스트에 저장
    alert('쇼핑 리스트에 저장되었습니다!');
    router.push('/');
  };

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">처리할 이미지가 없습니다.</p>
          <button
            onClick={() => router.push('/scan')}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg"
          >
            스캔 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <PageHeader title="스캔 결과" className="bg-white" />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* 원본 이미지 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">원본 이미지</h3>
            <img
              src={decodeURIComponent(imageUrl)}
              alt="스캔된 이미지"
              className="w-full max-h-64 object-contain rounded-lg border"
            />
          </div>

          {/* 처리 상태 */}
          {isProcessing && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center space-x-3">
                <LoadingSpinner />
                <span className="text-gray-600">이미지를 분석 중입니다...</span>
              </div>
            </div>
          )}

          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <span className="text-red-700">{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 추출된 쇼핑 리스트 */}
          {extractedItems.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">추출된 쇼핑 리스트</h3>
              <div className="space-y-2">
                {extractedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-primary-500">✓</span>
                    <span className="flex-1">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleSaveToList}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  리스트에 저장
                </button>
                <button
                  onClick={handleRetry}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  다시 스캔
                </button>
              </div>
            </div>
          )}

          {/* 원본 OCR 텍스트 (개발용) */}
          {ocrResult && !isProcessing && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <details>
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                  원본 텍스트 보기 (개발용)
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm font-mono whitespace-pre-wrap">
                  {ocrResult}
                </div>
              </details>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ScanResult() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ScanResultContent />
    </Suspense>
  );
}

'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import IconWithTitle from '@/components/ui/IconWithTitle';

export default function Scan() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview('');
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

  const handleProcessScan = () => {
    if (uploadedImage) {
      // OCR 처리를 위해 결과 페이지로 이동 (이미지와 함께)
      const imageUrl = URL.createObjectURL(uploadedImage);
      router.push(`/scan/result?image=${encodeURIComponent(imageUrl)}`);
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

            {/* 스캔하기 버튼 */}
            <div className="mt-6">
              <button
                onClick={handleCameraCapture}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-6 rounded-2xl transition-colors duration-200 text-lg"
              >
                스캔하기
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
                  className="w-full mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
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
                      <span className="font-medium text-blue-600 hover:text-blue-500">
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
                    <img
                      src={imagePreview}
                      alt="업로드된 이미지"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
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

            {/* 완료 상태 표시 */}
            {uploadedImage && (
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                  이미지 업로드 완료
                  <button
                    onClick={handleRemoveImage}
                    className="ml-2 text-white hover:text-gray-200"
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

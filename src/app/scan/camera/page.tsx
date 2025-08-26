'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';

export default function CameraCapture() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // 후면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error);
      setCameraError(
        '카메라에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.'
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // 캔버스 크기를 비디오 크기에 맞춤
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오 프레임을 캔버스에 그리기
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 이미지 데이터 URL 생성
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    setIsCapturing(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const processCapturedImage = () => {
    if (capturedImage) {
      // 캡처된 이미지를 스캔 결과 페이지로 전달
      router.push(`/scan/result?image=${encodeURIComponent(capturedImage)}`);
    }
  };

  const handleBack = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* 헤더 */}
      <PageHeader
        title="카메라 촬영"
        className="bg-black text-white"
        onBack={handleBack}
      />

      {/* 카메라 뷰 */}
      <div className="flex-1 relative">
        {cameraError ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-4">📷</div>
              <p className="text-white text-sm mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        ) : capturedImage ? (
          <div className="flex-1 flex items-center justify-center">
            <img
              src={capturedImage}
              alt="촬영된 이미지"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* 촬영 가이드 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white border-dashed rounded-lg w-80 h-48 flex items-center justify-center">
                <span className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                  장보기 리스트를 이 영역에 맞춰주세요
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 숨겨진 캔버스 */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* 하단 컨트롤 */}
      <div className="p-6 bg-black">
        {capturedImage ? (
          <div className="flex gap-4">
            <button
              onClick={retakePhoto}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-2xl transition-colors"
            >
              다시 촬영
            </button>
            <button
              onClick={processCapturedImage}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-4 px-6 rounded-2xl transition-colors"
            >
              스캔하기
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={capturePhoto}
              disabled={isCapturing || !!cameraError}
              className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              {isCapturing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

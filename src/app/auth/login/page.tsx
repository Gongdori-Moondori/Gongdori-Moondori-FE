'use client';

import BackButton from '@/components/layout/BackButton';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { RiKakaoTalkFill } from 'react-icons/ri';

export default function Login() {
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // URL에서 로그인 에러 체크
    const error = searchParams.get('error');
    if (error) {
      setLoginError(true);
      switch (error) {
        case 'oauth_error':
          setErrorMessage('OAuth 인증 중 오류가 발생했습니다.');
          break;
        case 'no_code':
          setErrorMessage('인증 코드를 받지 못했습니다.');
          break;
        case 'token_exchange_failed':
          setErrorMessage('토큰 교환에 실패했습니다.');
          break;
        case 'no_token':
          setErrorMessage('토큰을 받지 못했습니다.');
          break;
        case 'token_processing_failed':
          setErrorMessage('토큰 처리 중 오류가 발생했습니다.');
          break;
        default:
          setErrorMessage('로그인 중 오류가 발생했습니다.');
      }
    } else {
      console.log('로그인 페이지 로드됨.');
    }
  }, [searchParams]);

  const handleKakaoLogin = () => {
    // 기존 OAuth 시스템의 카카오 로그인 URL로 리다이렉트
    const kakaoAuthUrl = 'https://hihigh.lion.it.kr/oauth2/authorization/kakao';
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <BackButton />
        <h1 className="text-xl font-bold">로그인</h1>
        <div className="w-10"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 flex flex-col justify-center">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">환영합니다</h2>
            <p className="text-gray-600">계정에 로그인하세요</p>
          </div>

          {/* 에러 메시지 */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleKakaoLogin}
            className="w-full flex justify-center items-center gap-2 border border-gray-300 rounded-lg p-4 bg-kakao-yellow hover:bg-yellow-400 transition-colors cursor-pointer"
          >
            <RiKakaoTalkFill className="text-lg" />
            <span className="text-sm font-medium">카카오로 로그인</span>
          </button>
        </div>
      </main>
    </div>
  );
}

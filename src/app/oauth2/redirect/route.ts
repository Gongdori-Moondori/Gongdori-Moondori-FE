import { NextRequest, NextResponse } from 'next/server';
import { setServerSideCookie } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const refresh = searchParams.get('refresh');

  if (!token) {
    return NextResponse.redirect(
      new URL('/auth/login?error=no_token', request.url)
    );
  }

  try {
    // 토큰에서 사용자 정보 추출 (JWT 디코딩)
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.sub; // 'kakao_4419929761' 형태

    // 쿠키 설정
    // 액세스 토큰 쿠키 (1시간 만료)
    await setServerSideCookie('access_token', token, {
      maxAge: 60 * 60,
      httpOnly: false,
    });

    // 리프레시 토큰 쿠키 (30일 만료)
    if (refresh) {
      await setServerSideCookie('refresh_token', refresh, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: false,
      });
    }

    // 사용자 ID 쿠키
    await setServerSideCookie('user_id', userId, {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: false,
    });

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('토큰 처리 에러:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=token_processing_failed', request.url)
    );
  }
}

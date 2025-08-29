import { NextRequest, NextResponse } from 'next/server';
import { setServerSideCookie } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL('/auth/login?error=oauth_error', request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=no_code', request.url)
    );
  }

  try {
    // 카카오 토큰 교환
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        code: code,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('토큰 교환 실패');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // 사용자 정보 가져오기
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('사용자 정보 가져오기 실패');
    }

    const userData = await userResponse.json();

    // 쿠키 설정
    // 액세스 토큰 쿠키 (1시간 만료)
    await setServerSideCookie('access_token', access_token, {
      maxAge: 60 * 60, // 1시간
    });

    // 리프레시 토큰 쿠키 (30일 만료)
    if (refresh_token) {
      await setServerSideCookie('refresh_token', refresh_token, {
        maxAge: 30 * 24 * 60 * 60, // 30일
      });
    }

    // 사용자 ID 쿠키
    await setServerSideCookie('user_id', userData.id.toString(), {
      maxAge: 30 * 24 * 60 * 60, // 30일
    });

    // 로그인 성공 후 대시보드로 리다이렉트
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('카카오 OAuth 에러:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=token_exchange_failed', request.url)
    );
  }
}

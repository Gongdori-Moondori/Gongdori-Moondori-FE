import { NextRequest, NextResponse } from 'next/server';
import { getServerSideCookie, setServerSideCookie } from '@/lib/utils/auth';

export async function POST(_request: NextRequest) {
  try {
    // 쿠키에서 refresh_token 읽기
    const refreshToken = await getServerSideCookie('refresh_token');
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // 백엔드 리프레시 API 호출
    const res = await fetch('https://hihigh.lion.it.kr/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ 토큰 갱신 실패:', res.status, errorText);
      return NextResponse.json(
        { success: false, message: '토큰 갱신 실패' },
        { status: 401 }
      );
    }

    const data = await res.json();
    if (!data?.success || !data?.data?.accessToken) {
      return NextResponse.json(
        { success: false, message: '토큰 응답 형식 오류' },
        { status: 500 }
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data as {
      accessToken: string;
      refreshToken?: string;
    };

    // 새로운 토큰 쿠키로 저장
    await setServerSideCookie('access_token', accessToken, { maxAge: 60 * 60 });
    if (newRefreshToken) {
      await setServerSideCookie('refresh_token', newRefreshToken, {
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ 리프레시 API 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

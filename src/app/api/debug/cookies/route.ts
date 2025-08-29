import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 모든 쿠키 가져오기
    const cookies = request.cookies;
    const cookieData: Record<string, string> = {};

    cookies.getAll().forEach((cookie) => {
      cookieData[cookie.name] = cookie.value;
    });

    console.log('🍪 현재 쿠키 상태:', cookieData);

    return NextResponse.json({
      success: true,
      message: '쿠키 정보 조회 완료',
      cookies: cookieData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('쿠키 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '쿠키 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

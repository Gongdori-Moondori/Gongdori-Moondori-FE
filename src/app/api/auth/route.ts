import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 프록시 API 호출 시작...');

    // 쿠키에서 액세스 토큰 가져오기
    const accessToken = request.cookies.get('access_token')?.value;
    console.log(
      '🍪 쿠키에서 access_token 확인:',
      accessToken ? '존재함' : '없음'
    );

    if (!accessToken) {
      console.log('❌ access_token이 쿠키에 없음');
      return NextResponse.json(
        { success: false, message: '액세스 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    console.log('✅ access_token 확인됨, 외부 API 호출 시작...');
    console.log('🌐 외부 API URL: https://hihigh.lion.it.kr/api/auth');
    console.log('🔑 Authorization 헤더: Bearer [토큰]');

    // 외부 API 호출
    const response = await fetch('https://hihigh.lion.it.kr/api/auth', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 외부 API 응답 상태:', response.status);
    console.log(
      '📡 외부 API 응답 헤더:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 외부 API 에러:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 외부 API 응답 데이터:', data);

    // 응답 헤더 설정 (CORS 해결)
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/json');
    responseHeaders.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');

    console.log('✅ 프록시 API 응답 전송 완료');
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('❌ 프록시 API 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

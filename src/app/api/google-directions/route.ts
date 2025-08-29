import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const mode = searchParams.get('mode') || 'walking';

    console.log('API 요청 파라미터:', { origin, destination, mode });

    if (!origin || !destination) {
      console.log('필수 파라미터 누락:', { origin, destination });
      return NextResponse.json(
        { error: 'origin과 destination 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.log('Google Maps API 키 누락');
      return NextResponse.json(
        { error: 'Google Maps API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 좌표 형식 정리 (공백 제거, 소수점 자릿수 조정)
    const cleanOrigin = origin.replace(/\s/g, '');
    const cleanDestination = destination.replace(/\s/g, '');

    // 보행 경로가 없을 경우를 대비해 대안 옵션 추가
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${cleanOrigin}&destination=${cleanDestination}&mode=${mode}&alternatives=true&key=${apiKey}`;

    console.log('Google Directions API 요청:', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        'Google API 응답 오류:',
        response.status,
        response.statusText
      );
      throw new Error(`Google Directions API 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google API 원본 응답:', JSON.stringify(data, null, 2));

    if (data.status === 'OK' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const leg = route.legs[0];

      const result = {
        distance: leg.distance.text,
        duration: leg.duration.text,
        status: 'OK',
      };

      console.log('Google Directions 성공:', result);
      return NextResponse.json(result);
    } else {
      console.log(
        'Google Directions API 응답 오류:',
        data.status,
        data.error_message
      );
      return NextResponse.json(
        {
          error: `Directions API 오류: ${data.status}`,
          details: data.error_message,
          status: data.status,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Google Directions API 프록시 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

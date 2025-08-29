import { NextRequest, NextResponse } from 'next/server';
import { deleteServerSideCookie } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // 모든 인증 관련 쿠키 삭제
    await deleteServerSideCookie('access_token');
    await deleteServerSideCookie('refresh_token');
    await deleteServerSideCookie('user_id');

    return NextResponse.json({ success: true, message: '로그아웃되었습니다.' });
  } catch (error) {
    console.error('로그아웃 에러:', error);
    return NextResponse.json(
      { success: false, message: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

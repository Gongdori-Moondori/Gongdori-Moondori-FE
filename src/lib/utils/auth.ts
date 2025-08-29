import { cookies } from 'next/headers';

// 서버 사이드에서 쿠키 읽기
export async function getServerSideCookie(
  name: string
): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

// 서버 사이드에서 쿠키 설정
export async function setServerSideCookie(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
  } = {}
) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? process.env.NODE_ENV === 'production',
    sameSite: options.sameSite ?? 'lax',
    maxAge: options.maxAge ?? 60 * 60, // 기본 1시간
    path: options.path ?? '/',
  });
}

// 서버 사이드에서 쿠키 삭제
export async function deleteServerSideCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

// 토큰 유효성 검사 (간단한 예시)
export function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  try {
    // JWT 토큰의 경우 payload를 디코드하여 만료 시간 확인
    // 여기서는 간단하게 토큰 존재 여부만 확인
    return token.length > 0;
  } catch {
    return false;
  }
}

// 사용자 인증 상태 확인
export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getServerSideCookie('access_token');
  return isTokenValid(accessToken);
}

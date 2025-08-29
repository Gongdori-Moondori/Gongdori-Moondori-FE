import axios from 'axios';

// 프록시 API 사용 (CORS 문제 해결)
const API_BASE_URL = 'https://hihigh.lion.it.kr';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 프록시 API이므로 true로 설정 가능
  timeout: 10000, // 10초 타임아웃
});

// API 응답 타입 정의
export interface UserApiResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    name: string;
    socialProvider: string;
    socialId: string;
    email: string;
    profileImage: string;
    password: string;
  };
  errorCode: string;
}

export interface UserProfile {
  name: string;
  profileImage: string;
  totalSavings: number;
}

// 현재 사용자 정보 가져오기
export const getCurrentUser = async (): Promise<UserProfile> => {
  try {
    console.log('🔍 사용자 정보 요청 시작...');
    console.log('🌐 API Base URL:', API_BASE_URL);

    const response = await apiClient.get<UserApiResponse>('/auth');

    console.log('📡 API 응답 상태:', response.status);
    console.log('📦 API 응답 데이터:', response.data);

    if (response.data.success && response.data.data) {
      const userProfile: UserProfile = {
        name: response.data.data.name || '사용자',
        profileImage:
          response.data.data.profileImage || '/assets/userImage1.svg',
        totalSavings: 14543230000, // API에서 제공되지 않는 경우 기본값
      };

      console.log('✅ 사용자 정보 파싱 성공:', userProfile);
      return userProfile;
    } else {
      throw new Error(response.data.message || 'API 응답이 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('❌ 사용자 정보 가져오기 실패:', error);

    if (axios.isAxiosError(error)) {
      console.error('📡 HTTP 상태:', error.response?.status);
      console.error('📡 에러 메시지:', error.message);
      console.error('📡 응답 데이터:', error.response?.data);
    }

    // 에러 발생 시 기본값 반환
    const fallbackProfile: UserProfile = {
      name: '사용자',
      profileImage: '/assets/userImage1.svg',
      totalSavings: 14543230000,
    };

    console.log('🔄 기본값 사용:', fallbackProfile);
    return fallbackProfile;
  }
};

// 로그아웃
export const logout = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      '/api/auth/logout',
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      console.log('✅ 로그아웃 성공');
      return true;
    } else {
      console.error('❌ 로그아웃 실패:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ 로그아웃 중 오류:', error);
    return false;
  }
};

import axios, { AxiosError } from 'axios';

// 내부 프록시 API 사용 (쿠키 기반 인증 처리)
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
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

// 현재 사용자 정보 가져오기 (401 시 토큰 갱신 후 재시도)
export const getCurrentUser = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserApiResponse>('/auth');

    if (response.data.success && response.data.data) {
      const userProfile: UserProfile = {
        name: response.data.data.name || '사용자',
        profileImage:
          response.data.data.profileImage || '/assets/userImage1.svg',
        totalSavings: 14543230000,
      };
      return userProfile;
    }

    throw new Error(response.data.message || 'API 응답이 올바르지 않습니다.');
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response?.status === 401) {
      try {
        const refreshRes = await apiClient.post<{ success: boolean }>(
          '/auth/refresh'
        );
        if (refreshRes.status === 200 && refreshRes.data?.success) {
          const retry = await apiClient.get<UserApiResponse>('/auth');
          if (retry.data.success && retry.data.data) {
            const userProfile: UserProfile = {
              name: retry.data.data.name || '사용자',
              profileImage:
                retry.data.data.profileImage || '/assets/userImage1.svg',
              totalSavings: 14543230000,
            };
            return userProfile;
          }
        }
      } catch (refreshErr) {}
    }

    const fallbackProfile: UserProfile = {
      name: '사용자',
      profileImage: '/assets/userImage1.svg',
      totalSavings: 14543230000,
    };
    return fallbackProfile;
  }
};

// 로그아웃
export const logout = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      '/api/auth/logout',
      {},
      { withCredentials: true }
    );
    return response.status === 200;
  } catch (_e) {
    return false;
  }
};

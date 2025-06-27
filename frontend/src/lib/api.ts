import axios from 'axios';

// API 베이스 URL 설정 - 환경변수에서 가져오거나 기본값 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Axios 인스턴스 생성 및 기본 설정
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함하여 요청
});

// 요청 인터셉터 - 모든 요청에 인증 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 토큰 가져오기
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 응답 로깅 및 에러 처리
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    
    // 401 에러 시 자동 로그아웃 처리
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API 함수들
export const authAPI = {
  // 회원가입
  register: (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    userType: 'adopter' | 'provider';
  }) => api.post('/api/auth/register', userData),
  
  // 로그인
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  
  // 로그아웃
  logout: () => api.post('/api/auth/logout'),
  
  // 사용자 정보 조회
  getMe: () => api.get('/api/auth/me'),
  
  // 프로필 업데이트
  updateProfile: (profileData: FormData) =>
    api.put('/api/auth/profile', profileData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const petAPI = {
  // 펫 목록 조회 (필터 옵션 포함)
  getPets: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    age?: string;
    location?: string;
    search?: string;
  }) => api.get('/api/pets', { params }),
  
  // 펫 상세 정보 조회
  getPet: (id: string) => api.get(`/api/pets/${id}`),
  
  // 펫 등록 (분양자용)
  createPet: (petData: FormData) =>
    api.post('/api/pets', petData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // 펫 정보 수정
  updatePet: (id: string, petData: FormData) =>
    api.put(`/api/pets/${id}`, petData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // 펫 삭제
  deletePet: (id: string) => api.delete(`/api/pets/${id}`),
  
  // 내가 등록한 펫 목록
  getMyPets: () => api.get('/api/pets/my'),
};

export const adoptionAPI = {
  // 입양 신청
  createAdoption: (adoptionData: {
    petId: string;
    message: string;
    experience: string;
    livingSituation: string;
  }) => api.post('/api/adoptions', adoptionData),
  
  // 입양 신청 목록 조회 (입양희망자용)
  getMyAdoptions: () => api.get('/api/adoptions/my'),
  
  // 받은 입양 신청 목록 (분양자용)
  getReceivedAdoptions: () => api.get('/api/adoptions/received'),
  
  // 입양 신청 상태 업데이트
  updateAdoptionStatus: (id: string, status: 'approved' | 'rejected') =>
    api.put(`/api/adoptions/${id}/status`, { status }),
  
  // 입양 신청 상세 조회
  getAdoption: (id: string) => api.get(`/api/adoptions/${id}`),
};

// 유틸리티 함수들
export const apiUtils = {
  // 에러 메시지 추출
  getErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message || '알 수 없는 오류가 발생했습니다.';
  },
  
  // 이미지 URL 생성
  getImageUrl: (imagePath: string): string => {
    if (!imagePath) return '/default-pet.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}/uploads/${imagePath}`;
  },
};
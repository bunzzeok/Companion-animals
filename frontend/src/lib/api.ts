import axios from 'axios';

// API 베이스 URL 설정 - 개발환경에서는 프록시 사용, 프로덕션에서는 실제 URL 사용
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' // 개발환경에서는 프록시 사용 (빈 문자열로 현재 도메인 사용)
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001');

// Axios 인스턴스 생성 및 기본 설정
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃으로 증가
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false, // CORS 이슈 해결을 위해 false 유지
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
    size?: string;
    gender?: string;
    city?: string;
    district?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    urgency?: string;
    featured?: boolean;
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
  getMyPets: () => api.get('/api/pets/my/listings'),
  
  // 펫 좋아요 토글
  toggleLike: (id: string) => api.post(`/api/pets/${id}/like`),
  
  // 추천 펫 목록
  getFeaturedPets: (limit?: number) => api.get('/api/pets/featured', { params: { limit } }),
  
  // 긴급 펫 목록
  getUrgentPets: (limit?: number) => api.get('/api/pets/urgent', { params: { limit } }),
};

export const adoptionAPI = {
  // 입양 신청
  createAdoption: (adoptionData: {
    petId: string;
    message: string;
    experience: string;
    livingSituation: string;
    additionalInfo?: any;
  }) => api.post('/api/adoptions', adoptionData),
  
  // 입양 신청 목록 조회
  getAdoptions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: 'received' | 'sent' | 'all';
  }) => api.get('/api/adoptions', { params }),
  
  // 입양 신청 상세 조회
  getAdoption: (id: string) => api.get(`/api/adoptions/${id}`),
  
  // 입양 신청 상태 업데이트
  updateAdoptionStatus: (id: string, data: {
    status: 'approved' | 'rejected' | 'completed' | 'cancelled';
    reason?: string;
    notes?: string;
  }) => api.put(`/api/adoptions/${id}/status`, data),
  
  // 만남 일정 설정
  scheduleMeeting: (id: string, meetingData: {
    scheduledDate: string;
    location: string;
    notes?: string;
  }) => api.put(`/api/adoptions/${id}/meeting`, meetingData),
  
  // 입양 통계
  getStatistics: () => api.get('/api/adoptions/statistics'),
  
  // 특정 펫의 입양 신청 목록
  getPetAdoptions: (petId: string, status?: string) => 
    api.get(`/api/adoptions/pet/${petId}`, { params: { status } }),
};

// 커뮤니티 API
export const communityAPI = {
  // 게시글 목록 조회
  getPosts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    tags?: string | string[];
    city?: string;
    district?: string;
    sort?: string;
    order?: string;
    featured?: boolean;
  }) => api.get('/api/community', { params }),
  
  // 게시글 상세 조회
  getPost: (id: string) => api.get(`/api/community/${id}`),
  
  // 게시글 작성
  createPost: (postData: FormData) =>
    api.post('/api/community', postData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // 게시글 수정
  updatePost: (id: string, postData: FormData) =>
    api.put(`/api/community/${id}`, postData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // 게시글 삭제
  deletePost: (id: string) => api.delete(`/api/community/${id}`),
  
  // 게시글 좋아요 토글
  toggleLike: (id: string) => api.post(`/api/community/${id}/like`),
  
  // 게시글 싫어요 토글
  toggleDislike: (id: string) => api.post(`/api/community/${id}/dislike`),
  
  // 게시글 북마크 토글
  toggleBookmark: (id: string) => api.post(`/api/community/${id}/bookmark`),
  
  // 추천 게시글 목록
  getFeaturedPosts: (limit?: number) => api.get('/api/community/featured', { params: { limit } }),
  
  // 인기 게시글 목록
  getPopularPosts: (params?: { limit?: number; period?: string }) => 
    api.get('/api/community/popular', { params }),
  
  // 카테고리별 통계
  getCategoryStats: () => api.get('/api/community/categories'),
  
  // 공개 커뮤니티 통계 (홈페이지용)
  getPublicStatistics: () => api.get('/api/community/statistics'),
  
  // 커뮤니티 통계 (관리자용)
  getStatistics: () => api.get('/api/community/statistics'),
  
  // 특정 사용자의 게시글
  getUserPosts: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/api/community/user/${userId}`, { params }),
};

// 댓글 API
export const commentAPI = {
  // 게시글의 댓글 목록
  getComments: (postId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/api/community/${postId}/comments`, { params }),
  
  // 댓글 작성
  createComment: (postId: string, commentData: {
    content: string;
    parentComment?: string;
  }) => api.post(`/api/community/${postId}/comments`, commentData),
  
  // 댓글 수정
  updateComment: (id: string, data: { content: string }) =>
    api.put(`/api/comments/${id}`, data),
  
  // 댓글 삭제
  deleteComment: (id: string) => api.delete(`/api/comments/${id}`),
  
  // 댓글 좋아요 토글
  toggleLike: (id: string) => api.post(`/api/comments/${id}/like`),
  
  // 댓글 채택 (질문답변 게시글)
  acceptAnswer: (id: string) => api.post(`/api/comments/${id}/accept`),
};

// 채팅 API
export const chatAPI = {
  // 채팅방 목록
  getChatRooms: (params?: { page?: number; limit?: number }) =>
    api.get('/api/chat/rooms', { params }),
  
  // 채팅방 상세 정보
  getChatRoom: (id: string) => api.get(`/api/chat/rooms/${id}`),
  
  // 채팅방 생성
  createChatRoom: (data: {
    participants: string[];
    type: 'private' | 'group';
    name?: string;
    relatedPet?: string;
  }) => api.post('/api/chat/rooms', data),
  
  // 펫 기반 채팅방 생성
  createPetChatRoom: (petId: string) => api.post(`/api/chat/rooms/pet/${petId}`),
  
  // 메시지 목록
  getMessages: (roomId: string, params?: {
    page?: number;
    limit?: number;
    before?: string;
  }) => api.get(`/api/chat/rooms/${roomId}/messages`, { params }),
  
  // 메시지 전송
  sendMessage: (roomId: string, messageData: FormData) => {
    // Add chatRoom to the FormData since the backend expects it in the body
    messageData.append('chatRoom', roomId);
    return api.post('/api/chat/messages', messageData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // 메시지 읽음 처리
  markAsRead: (roomId: string, messageId: string) =>
    api.put(`/api/chat/messages/${messageId}/read`),
  
  // 채팅방 전체 메시지 읽음 처리
  markRoomAsRead: (roomId: string) =>
    api.put(`/api/chat/rooms/${roomId}/read`),
  
  // 채팅방 나가기
  leaveChatRoom: (roomId: string) => api.delete(`/api/chat/rooms/${roomId}`),
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
    if (error.response?.data?.details) {
      return Array.isArray(error.response.data.details) 
        ? error.response.data.details.map((d: any) => d.message || d).join(', ')
        : error.response.data.details;
    }
    return error.message || '알 수 없는 오류가 발생했습니다.';
  },
  
  // 이미지 URL 생성
  getImageUrl: (imagePath: string): string => {
    if (!imagePath) return '/default-pet.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}/uploads/${imagePath}`;
  },
  
  // 성공 응답 체크
  isSuccess: (response: any): boolean => {
    return response?.data?.success === true;
  },
  
  // 데이터 추출
  getData: (response: any): any => {
    return response?.data?.data || response?.data || null;
  },
  
  // 페이지네이션 정보 추출
  getPagination: (response: any): any => {
    return response?.data?.pagination || null;
  },
};

// 소켓 유틸리티
export const socketUtils = {
  // 소켓 연결
  connect: (token: string) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const io = require('socket.io-client');
      
      // 소켓은 항상 백엔드 서버에 직접 연결
      const socketUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5001' 
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001');
      
      console.log('🔌 Connecting to socket server:', socketUrl);
      console.log('🔑 Using token (first 20 chars):', token.substring(0, 20) + '...');
      
      const socket = io(socketUrl, {
        auth: { token },
        transports: ['polling', 'websocket'], // polling을 먼저 시도
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        upgrade: true // 폴링에서 웹소켓으로 업그레이드 허용
      });
      
      console.log('🔌 Socket.IO client created, connecting...');
      
      return socket;
    } catch (error) {
      console.error('Failed to import socket.io-client:', error);
      return null;
    }
  },
  
  // 채팅방 참가
  joinRoom: (socket: any, roomId: string) => {
    if (socket) {
      console.log('📱 Joining room:', roomId);
      socket.emit('room:join', { roomId });
    }
  },
  
  // 채팅방 나가기
  leaveRoom: (socket: any, roomId: string) => {
    if (socket) {
      console.log('📱 Leaving room:', roomId);
      socket.emit('room:leave', { roomId });
    }
  },
  
  // 메시지 전송
  sendMessage: (socket: any, messageData: any) => {
    if (socket) {
      console.log('📤 Sending message via socket:', messageData);
      socket.emit('message:send', {
        roomId: messageData.chatRoom,
        content: messageData.content,
        messageType: messageData.type || 'text'
      });
    }
  },
};

// About 페이지 API
export const aboutAPI = {
  // 회사 통계 정보
  getStatistics: () => api.get('/api/about/statistics'),
  
  // 팀 정보
  getTeamMembers: () => api.get('/api/about/team'),
  
  // 회사 연혁
  getHistory: () => api.get('/api/about/history'),
  
  // 회사 정보
  getCompanyInfo: () => api.get('/api/about/company'),
};

// 타입 정의 내보내기
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Pet {
  _id: string;
  name: string;
  type: 'cat' | 'dog' | 'other';
  breed: string;
  age: 'baby' | 'young' | 'adult' | 'senior';
  gender: 'male' | 'female' | 'unknown';
  size: 'small' | 'medium' | 'large';
  color: string;
  weight?: number;
  healthStatus: 'healthy' | 'needs_treatment' | 'chronic_condition';
  isVaccinated: boolean;
  isNeutered: boolean;
  images: string[];
  videos?: string[];
  location: {
    city: string;
    district: string;
  };
  description: string;
  adoptionFee: number;
  urgency: 'low' | 'medium' | 'high';
  owner: {
    _id: string;
    name: string;
    profileImage?: string;
    phone?: string;
    email?: string;
  };
  views: number;
  likes: string[];
  likesCount?: number;
  isLiked?: boolean;
  status: 'available' | 'pending' | 'adopted' | 'removed';
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  images?: string[];
  location?: {
    city: string;
    district: string;
  };
  views: number;
  likes: string[];
  dislikes: string[];
  bookmarks: string[];
  likesCount?: number;
  dislikesCount?: number;
  bookmarksCount?: number;
  commentsCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isBookmarked?: boolean;
  isPinned?: boolean;
  featured?: boolean;
  status: 'active' | 'deleted' | 'reported';
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  post: string;
  parentComment?: string;
  likes: string[];
  likesCount?: number;
  isLiked?: boolean;
  isAccepted?: boolean;
  depth: number;
  replies?: Comment[];
  status: 'active' | 'deleted' | 'reported';
  createdAt: string;
  updatedAt: string;
}
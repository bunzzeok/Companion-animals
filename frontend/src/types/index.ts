// 사용자 관련 타입 정의
export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  userType: 'adopter' | 'provider' | 'admin'; // 입양희망자, 분양자, 관리자
  profileImage?: string;
  address?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// 회원가입 폼 데이터 타입
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  userType: 'adopter' | 'provider';
  address?: string;
  bio?: string;
}

// 로그인 폼 데이터 타입
export interface LoginFormData {
  email: string;
  password: string;
}

// 펫 관련 타입 정의
export interface Pet {
  _id: string;
  name: string;
  type: 'cat' | 'dog' | 'other'; // 고양이, 강아지, 기타
  breed: string; // 품종
  age: 'baby' | 'young' | 'adult' | 'senior'; // 새끼, 어린, 성인, 노령
  gender: 'male' | 'female' | 'unknown'; // 수컷, 암컷, 알 수 없음
  size: 'small' | 'medium' | 'large'; // 소형, 중형, 대형
  color: string; // 색상
  weight?: number; // 몸무게 (kg)
  
  // 건강 정보
  healthStatus: 'healthy' | 'needs_treatment' | 'chronic_condition'; // 건강, 치료필요, 만성질환
  isVaccinated: boolean; // 예방접종 여부
  isNeutered: boolean; // 중성화 여부
  medicalNotes?: string; // 의료 기록
  
  // 성격 및 특성
  temperament: string[]; // 성격 (예: ['friendly', 'calm', 'playful'])
  goodWithKids: boolean; // 아이들과 잘 어울림
  goodWithPets: boolean; // 다른 동물과 잘 어울림
  goodWithStrangers: boolean; // 낯선 사람과 잘 어울림
  
  // 위치 및 상태
  location: {
    city: string;
    district: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  status: 'available' | 'pending' | 'adopted' | 'removed'; // 분양가능, 대기중, 분양완료, 삭제
  
  // 미디어
  images: string[]; // 이미지 경로 배열
  videos?: string[]; // 비디오 경로 배열
  
  // 기타 정보
  description: string; // 상세 설명
  adoptionFee?: number; // 분양비용 (0일 경우 무료)
  urgency: 'low' | 'medium' | 'high'; // 긴급도
  specialNeeds?: string; // 특별한 돌봄이 필요한 경우
  
  // 분양자 정보
  owner: User | string; // 분양자 정보 (populate 여부에 따라 다름)
  
  // 시스템 필드
  views: number; // 조회수
  likes: string[]; // 좋아요한 사용자 ID 배열
  createdAt: string;
  updatedAt: string;
}

// 펫 등록/수정 폼 데이터 타입
export interface PetFormData {
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
  medicalNotes?: string;
  
  temperament: string[];
  goodWithKids: boolean;
  goodWithPets: boolean;
  goodWithStrangers: boolean;
  
  city: string;
  district: string;
  address?: string;
  
  description: string;
  adoptionFee?: number;
  urgency: 'low' | 'medium' | 'high';
  specialNeeds?: string;
  
  images?: FileList | File[];
  videos?: FileList | File[];
}

// 입양 신청 관련 타입
export interface Adoption {
  _id: string;
  pet: Pet | string; // 입양하려는 펫
  adopter: User | string; // 입양 신청자
  provider: User | string; // 분양자
  
  // 신청 정보
  message: string; // 신청 메시지
  experience: string; // 반려동물 경험
  livingSituation: string; // 거주 환경
  
  // 상태 관리
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  statusHistory: {
    status: string;
    changedAt: string;
    reason?: string;
  }[];
  
  // 만남 및 입양 진행
  meetingScheduled?: {
    date: string;
    location: string;
    notes?: string;
  };
  
  completedAt?: string; // 입양 완료일
  
  createdAt: string;
  updatedAt: string;
}

// 입양 신청 폼 데이터 타입
export interface AdoptionFormData {
  petId: string;
  message: string;
  experience: string;
  livingSituation: string;
}

// API 응답 타입들
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// 검색 및 필터 관련 타입
export interface PetSearchFilters {
  type?: 'cat' | 'dog' | 'other';
  age?: 'baby' | 'young' | 'adult' | 'senior';
  size?: 'small' | 'medium' | 'large';
  gender?: 'male' | 'female';
  location?: string;
  healthStatus?: 'healthy' | 'needs_treatment' | 'chronic_condition';
  adoptionFee?: 'free' | 'paid';
  urgency?: 'low' | 'medium' | 'high';
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  search?: string; // 키워드 검색
}

export interface PetSearchParams extends PetSearchFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'views' | 'likes' | 'urgency';
  sortOrder?: 'asc' | 'desc';
}

// 통계 및 대시보드 타입
export interface DashboardStats {
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  pendingAdoptions: number;
  totalUsers: number;
  recentAdoptions: Adoption[];
  popularPets: Pet[];
}

// 알림 타입
export interface Notification {
  _id: string;
  userId: string;
  type: 'adoption_request' | 'adoption_approved' | 'adoption_rejected' | 'message' | 'system';
  title: string;
  message: string;
  data?: any; // 추가 데이터
  isRead: boolean;
  createdAt: string;
}

// 채팅/메시지 타입 (나중에 구현할 기능)
export interface Message {
  _id: string;
  sender: User | string;
  receiver: User | string;
  adoptionId?: string; // 입양 신청과 연관된 메시지
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

// 공통 선택 옵션 타입들
export const PET_TYPES = ['cat', 'dog', 'other'] as const;
export const PET_AGES = ['baby', 'young', 'adult', 'senior'] as const;
export const PET_SIZES = ['small', 'medium', 'large'] as const;
export const PET_GENDERS = ['male', 'female', 'unknown'] as const;
export const HEALTH_STATUS = ['healthy', 'needs_treatment', 'chronic_condition'] as const;
export const URGENCY_LEVELS = ['low', 'medium', 'high'] as const;
export const USER_TYPES = ['adopter', 'provider', 'admin'] as const;
export const ADOPTION_STATUS = ['pending', 'approved', 'rejected', 'completed', 'cancelled'] as const;
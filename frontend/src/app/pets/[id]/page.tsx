'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { petAPI, chatAPI, apiUtils } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Heart, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Eye,
  Share2,
  Flag,
  MessageCircle,
  Phone,
  Star,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Shield,
  Award,
  User
} from 'lucide-react';

// Pet detail interface
interface PetDetail {
  _id: string;
  name: string;
  type: 'cat' | 'dog' | 'other';
  breed: string;
  age: 'baby' | 'young' | 'adult' | 'senior';
  gender: 'male' | 'female' | 'unknown';
  size: 'small' | 'medium' | 'large';
  color: string;
  images: string[];
  location: {
    city: string;
    district: string;
    detailAddress?: string;
  };
  description: string;
  adoptionFee: number;
  urgency: 'low' | 'medium' | 'high';
  owner: {
    id: string;
    name: string;
    profileImage?: string;
    rating: number;
    reviewCount: number;
    verifiedStatus: boolean;
    responseRate: number;
    responseTime: string;
  };
  healthInfo: {
    neutered: boolean;
    vaccinated: 'complete' | 'partial' | 'none' | 'unknown';
    healthStatus: string;
    medicalHistory?: string;
  };
  personality: string[];
  specialNeeds?: string;
  adoptionRequirements?: string;
  views: number;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'available' | 'pending' | 'adopted';
}

// Pet detail page component
export default function PetDetailPage() {
  const params = useParams();
  const petId = params.id as string;
  const { user, isAuthenticated } = useAuth();
  
  // State management
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Load pet details on component mount
  useEffect(() => {
    if (petId) {
      loadPetDetail(petId);
    }
  }, [petId]);

  // Load pet details from API
  const loadPetDetail = async (id: string) => {
    try {
      setLoading(true);
      
      const response = await petAPI.getPet(id);
      
      if (apiUtils.isSuccess(response)) {
        const petData = apiUtils.getData(response);
        
        // Convert API data to PetDetail format
        const petDetail: PetDetail = {
          _id: petData._id,
          name: petData.name,
          type: petData.type,
          breed: petData.breed,
          age: petData.age,
          gender: petData.gender,
          size: petData.size,
          color: petData.color,
          images: petData.images || [],
          location: petData.location,
          description: petData.description,
          adoptionFee: petData.adoptionFee,
          urgency: petData.urgency,
          owner: {
            id: petData.owner._id,
            name: petData.owner.name,
            profileImage: petData.owner.profileImage,
            rating: 4.8, // Default rating if not provided
            reviewCount: 12, // Default review count
            verifiedStatus: true, // Default verification status
            responseRate: 95, // Default response rate
            responseTime: '평균 1시간 이내' // Default response time
          },
          healthInfo: {
            neutered: petData.isNeutered,
            vaccinated: petData.isVaccinated ? 'complete' : 'partial',
            healthStatus: petData.healthStatus || '건강함',
            medicalHistory: petData.medicalHistory || '의료 기록이 없습니다.'
          },
          personality: petData.personality || ['친화적'],
          specialNeeds: petData.specialNeeds,
          adoptionRequirements: petData.adoptionRequirements,
          views: petData.views,
          likesCount: petData.likesCount || petData.likes?.length || 0,
          isLiked: petData.isLiked || false,
          createdAt: petData.createdAt,
          updatedAt: petData.updatedAt,
          status: petData.status
        };
        
        setPet(petDetail);
      } else {
        console.error('Failed to load pet from API');
        setPet(null);
      }
    } catch (error) {
      console.error('Failed to load pet details:', error);
      setPet(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle starting a chat
  const handleStartChat = async () => {
    if (!pet || !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      // Create or find existing chat room
      const response = await chatAPI.createChatRoom({
        participants: [], // Backend will handle adding the pet owner
        type: 'private',
        relatedPet: pet._id
      });
      
      if (apiUtils.isSuccess(response)) {
        const chatRoom = apiUtils.getData(response);
        // Redirect to chat page with the created/found room
        window.location.href = `/chat?room=${chatRoom._id}`;
      } else {
        console.error('Failed to create chat room');
        // Fallback: redirect to general chat page
        window.location.href = `/chat`;
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      // Fallback: redirect to general chat page
      window.location.href = `/chat`;
    }
  };

  // Handle pet like toggle
  const handleToggleLike = async () => {
    if (!pet || !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await petAPI.toggleLike(pet._id);
      
      if (apiUtils.isSuccess(response)) {
        const result = apiUtils.getData(response);
        
        setPet(prev => prev ? {
          ...prev,
          isLiked: result.liked,
          likesCount: result.count
        } : null);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  // Get age text in Korean
  const getAgeText = (age: string) => {
    switch (age) {
      case 'baby': return '아기 (0-1세)';
      case 'young': return '어린이 (1-3세)';
      case 'adult': return '성인 (3-7세)';
      case 'senior': return '시니어 (7세+)';
      default: return age;
    }
  };

  // Get gender text in Korean
  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return '수컷';
      case 'female': return '암컷';
      default: return '모름';
    }
  };

  // Get size text in Korean
  const getSizeText = (size: string) => {
    switch (size) {
      case 'small': return '소형';
      case 'medium': return '중형';
      case 'large': return '대형';
      default: return size;
    }
  };

  // Get vaccination status text
  const getVaccinationText = (status: string) => {
    switch (status) {
      case 'complete': return '완료';
      case 'partial': return '일부 완료';
      case 'none': return '미완료';
      default: return '모름';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">동물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">동물을 찾을 수 없습니다</h3>
          <p className="text-gray-600 mb-6">요청하신 동물이 존재하지 않거나 삭제되었습니다.</p>
          <Link
            href="/pets"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Back button and title */}
            <div className="flex items-center min-w-0">
              <Link href="/pets" className="mr-2 sm:mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </Link>
              <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
                <span className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  <span className="hidden xs:inline">Companion Animals</span>
                  <span className="xs:hidden">반려동물</span>
                </span>
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleToggleLike}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  pet.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center">
                <Flag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column - Images and basic info */}
          <div>
            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
              <div className="aspect-square bg-gray-200 relative">
                {/* Main image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Heart className="h-16 w-16" />
                </div>
                
                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pet.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : pet.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pet.status === 'available' ? '분양 가능' : 
                     pet.status === 'pending' ? '분양 진행중' : '분양 완료'}
                  </span>
                </div>

              </div>
            </div>

            {/* Basic information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">기본 정보</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">품종</span>
                  <p className="font-semibold text-gray-900 text-base">{pet.breed}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">나이</span>
                  <p className="font-semibold text-gray-900 text-base">{getAgeText(pet.age)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">성별</span>
                  <p className="font-semibold text-gray-900 text-base">{getGenderText(pet.gender)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">크기</span>
                  <p className="font-semibold text-gray-900 text-base">{getSizeText(pet.size)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">색상</span>
                  <p className="font-semibold text-gray-900 text-base">{pet.color}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">등록일</span>
                  <p className="font-semibold text-gray-900 text-base">{formatTimeAgo(pet.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Details and owner info */}
          <div className="space-y-6">
            {/* Title and location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">
                    {pet.adoptionFee === 0 ? '무료분양' : `₩${pet.adoptionFee.toLocaleString()}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{pet.location.district}, {pet.location.city}</span>
                {pet.location.detailAddress && (
                  <span className="text-gray-400 ml-1">• {pet.location.detailAddress}</span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>조회 {pet.views}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>관심 {pet.likesCount}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatTimeAgo(pet.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">상세 설명</h2>
              <p className="text-gray-700 leading-relaxed">{pet.description}</p>
            </div>

            {/* Health information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">건강 정보</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">중성화 수술</span>
                  <span className={`flex items-center font-semibold ${pet.healthInfo.neutered ? 'text-green-600' : 'text-orange-600'}`}>
                    {pet.healthInfo.neutered ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertTriangle className="h-4 w-4 mr-1" />}
                    {pet.healthInfo.neutered ? '완료' : '미완료'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">예방접종</span>
                  <span className="text-gray-900 font-semibold">{getVaccinationText(pet.healthInfo.vaccinated)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">건강 상태</span>
                  <span className="text-green-600 font-semibold">{pet.healthInfo.healthStatus}</span>
                </div>
                {pet.healthInfo.medicalHistory && (
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-gray-700 font-medium text-sm">의료 기록</span>
                    <p className="text-gray-800 text-sm mt-2 leading-relaxed">{pet.healthInfo.medicalHistory}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Personality */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">성격</h2>
              <div className="flex flex-wrap gap-2">
                {pet.personality.map((trait, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Adoption requirements */}
            {pet.adoptionRequirements && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-blue-900 mb-3">입양 조건</h2>
                <p className="text-blue-800 text-sm">{pet.adoptionRequirements}</p>
              </div>
            )}

            {/* Owner information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">분양자 정보</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{pet.owner.name}</h3>
                    {pet.owner.verifiedStatus && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">
                      {pet.owner.rating} ({pet.owner.reviewCount}개 리뷰)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">응답률</span>
                  <p className="font-semibold text-gray-900 text-base">{pet.owner.responseRate}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-700 font-medium text-sm">응답시간</span>
                  <p className="font-semibold text-gray-900 text-base">{pet.owner.responseTime}</p>
                </div>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowContactInfo(!showContactInfo)}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  연락처 보기
                </button>
                <button
                  onClick={handleStartChat}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  채팅하기
                </button>
              </div>
              
              {showContactInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">연락처 정보</p>
                  <p className="text-gray-900 font-medium">010-1234-5678</p>
                  <p className="text-sm text-gray-500 mt-2">
                    직접 연락하기 전에 채팅으로 먼저 대화해보세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
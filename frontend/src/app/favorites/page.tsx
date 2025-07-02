'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, MapPin, Calendar, Phone } from 'lucide-react';
import { petAPI, apiUtils, type Pet } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      loadFavorites();
    }
  }, [isAuthenticated, user, authLoading]);

  const loadFavorites = async (page = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load pets with pagination and filter by liked ones
      const response = await petAPI.getPets({ 
        page,
        limit: 50
      });
      
      if (apiUtils.isSuccess(response)) {
        const petsData = apiUtils.getData(response) || [];
        const pagination = apiUtils.getPagination(response);
        
        // Filter by liked pets on frontend for now
        const likedPets = petsData.filter((pet: Pet) => pet.isLiked);
        
        if (append) {
          setFavorites(prev => [...prev, ...likedPets]);
        } else {
          setFavorites(likedPets);
        }
        
        setHasNextPage(pagination?.hasNextPage || false);
        setCurrentPage(page);
      } else {
        setError('찜 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setError('찜 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (petId: string) => {
    try {
      await petAPI.toggleLike(petId);
      
      // Remove from favorites list since we're unliking
      setFavorites(prev => prev.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const loadMore = () => {
    if (hasNextPage && !loading) {
      loadFavorites(currentPage + 1, true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">찜 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">찜 목록을 보려면 먼저 로그인해주세요.</p>
          <Link 
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/pets"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                반려동물 목록으로
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">내 찜 목록</h1>
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">찜한 반려동물이 없습니다</h2>
            <p className="text-gray-600 mb-8">관심 있는 반려동물을 찜해보세요!</p>
            <Link 
              href="/pets"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              반려동물 둘러보기
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                찜한 반려동물 ({favorites.length}마리)
              </h2>
              <p className="text-gray-600 mt-1">
                관심 있는 반려동물들을 모아보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((pet) => (
                <div key={pet._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Link href={`/pets/${pet._id}`}>
                      <img
                        src={pet.images?.[0] ? apiUtils.getImageUrl(pet.images[0]) : '/default-pet.jpg'}
                        alt={pet.name}
                        className="w-full h-48 object-cover cursor-pointer"
                      />
                    </Link>
                    <button
                      onClick={() => handleToggleLike(pet._id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </button>
                    {pet.urgency === 'high' && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        긴급
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <Link href={`/pets/${pet._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                        {pet.name}
                      </h3>
                    </Link>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {pet.type === 'dog' ? '강아지' : pet.type === 'cat' ? '고양이' : '기타'}
                        </span>
                        <span className="ml-2 text-gray-500">
                          {pet.age === 'baby' ? '아기' : pet.age === 'young' ? '어린' : pet.age === 'adult' ? '성인' : '노령'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{pet.location.city} {pet.location.district}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>등록일: {formatDate(pet.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          {pet.adoptionFee === 0 ? '무료 분양' : `${pet.adoptionFee.toLocaleString()}원`}
                        </span>
                        <Link
                          href={`/pets/${pet._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          자세히 보기
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <div className="text-center mt-8">
                <button 
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '로딩 중...' : '더 많은 찜 목록 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
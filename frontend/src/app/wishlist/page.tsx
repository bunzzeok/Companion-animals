'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Search, Filter } from 'lucide-react';
import { petAPI, apiUtils } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

// Wishlist page component
export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const [wishlistPets, setWishlistPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      // API call to get user's wishlist
      // const response = await petAPI.getWishlist();
      
      // For now, use empty array since API might not be implemented yet
      setWishlistPets([]);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      setWishlistPets([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-600 mb-6">관심 동물 목록을 보려면 로그인해주세요.</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">관심 동물</h1>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">관심 동물 목록을 불러오는 중...</p>
          </div>
        ) : wishlistPets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">관심 동물이 없습니다</h3>
            <p className="text-gray-600 mb-6">마음에 드는 동물에 하트를 눌러 관심 목록에 추가해보세요.</p>
            <Link
              href="/pets"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              동물 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Wishlist pets will be displayed here when implemented */}
          </div>
        )}
      </div>
    </div>
  );
}
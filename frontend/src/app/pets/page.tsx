'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Eye,
  ChevronDown,
  Grid,
  List,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

// Pet interface for type safety
interface Pet {
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
  };
  description: string;
  adoptionFee: number;
  urgency: 'low' | 'medium' | 'high';
  owner: {
    name: string;
    profileImage?: string;
  };
  views: number;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  status: string;
}

// Search filters interface
interface SearchFilters {
  type?: string;
  age?: string;
  size?: string;
  gender?: string;
  city?: string;
  urgency?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Pet listing page component - Karrot Market style
export default function PetsPage() {
  // State management for pets and UI
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Load pets data from API
  const loadPets = async (page = 1, resetData = false) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...filters
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      // Make API request (placeholder for now)
      console.log('🔍 Loading pets with params:', params.toString());
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/pets?${params}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockPets: Pet[] = Array.from({ length: 12 }, (_, index) => ({
        _id: `pet-${page}-${index}`,
        name: ['귀여운 고양이', '착한 강아지', '온순한 토끼', '예쁜 새'][index % 4],
        type: ['cat', 'dog', 'other'][index % 3] as any,
        breed: ['코리안 숏헤어', '믹스견', '홀랜드 롭', '카나리아'][index % 4],
        age: ['baby', 'young', 'adult', 'senior'][index % 4] as any,
        gender: ['male', 'female', 'unknown'][index % 3] as any,
        size: ['small', 'medium', 'large'][index % 3] as any,
        color: ['검은색', '갈색', '흰색', '회색'][index % 4],
        images: ['/placeholder-pet.jpg'],
        location: {
          city: '서울특별시',
          district: ['강남구', '서초구', '마포구', '성동구'][index % 4]
        },
        description: '건강하고 사람을 좋아하는 아이예요. 좋은 가정을 찾고 있습니다.',
        adoptionFee: index % 3 === 0 ? 0 : 50000,
        urgency: ['low', 'medium', 'high'][index % 3] as any,
        owner: {
          name: '분양자님',
          profileImage: '/placeholder-user.jpg'
        },
        views: Math.floor(Math.random() * 100),
        likesCount: Math.floor(Math.random() * 20),
        isLiked: Math.random() > 0.5,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'available'
      }));

      if (resetData || page === 1) {
        setPets(mockPets);
      } else {
        setPets(prev => [...prev, ...mockPets]);
      }
      
      setCurrentPage(page);
      setTotalPages(5); // Mock total pages
      setHasNextPage(page < 5);
      
    } catch (error) {
      console.error('Failed to load pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load pets on component mount and filter changes
  useEffect(() => {
    loadPets(1, true);
  }, [filters, searchQuery]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPets(1, true);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  // Handle load more (infinite scroll simulation)
  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      loadPets(currentPage + 1, false);
    }
  };

  // Handle starting a chat with pet owner
  const handleStartChat = (petId: string, petName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // TODO: Create or find existing chat room with pet owner
    // For now, redirect to a new chat with the pet ID
    window.location.href = `/chat/pet-${petId}`;
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

  // Get urgency badge color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  // Get urgency text
  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return '긴급';
      case 'medium': return '일반';
      default: return '여유';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Back button and title */}
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Pet Adoption</h1>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Search and filters */}
        <div className="mb-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Search for pets by name, breed, or location..."
              />
            </div>
          </form>

          {/* Filter toggle button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Results count */}
            <span className="text-sm text-gray-500">
              {pets.length} pets found
            </span>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Pet type filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Animal Type
                  </label>
                  <select
                    value={filters.type || 'all'}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="cat">Cats</option>
                    <option value="dog">Dogs</option>
                    <option value="other">Others</option>
                  </select>
                </div>

                {/* Age filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <select
                    value={filters.age || 'all'}
                    onChange={(e) => handleFilterChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="all">All Ages</option>
                    <option value="baby">Baby</option>
                    <option value="young">Young</option>
                    <option value="adult">Adult</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                {/* Size filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={filters.size || 'all'}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="all">All Sizes</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {/* Sort by filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="createdAt-desc">Latest</option>
                    <option value="createdAt-asc">Oldest</option>
                    <option value="views-desc">Most Viewed</option>
                    <option value="likes-desc">Most Liked</option>
                    <option value="urgency-desc">Most Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pet listings */}
        {loading && pets.length === 0 ? (
          // Loading skeleton
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters or search terms</p>
            <Link 
              href="/post-pet"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Post a Pet for Adoption
            </Link>
          </div>
        ) : (
          // Pet grid/list
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {pets.map((pet) => (
              <div
                key={pet._id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Pet image */}
                <div className={`relative ${
                  viewMode === 'grid' ? 'aspect-square' : 'w-48 h-48 flex-shrink-0'
                } bg-gray-200`}>
                  {/* Placeholder for pet image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Heart className="h-12 w-12" />
                  </div>
                  
                  {/* Urgency badge */}
                  {pet.urgency === 'high' && (
                    <div className="absolute top-3 left-3">
                      <span className={`${getUrgencyColor(pet.urgency)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                        {getUrgencyText(pet.urgency)}
                      </span>
                    </div>
                  )}

                  {/* Like button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className={`h-4 w-4 ${pet.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                {/* Pet info */}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                    <span className="text-xs text-gray-500">{formatTimeAgo(pet.createdAt)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{pet.breed} • {pet.age} • {pet.size}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{pet.location.district}, {pet.location.city}</span>
                  </div>
                  
                  <p className={`text-sm text-gray-600 mb-3 ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                    {pet.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-orange-500 font-semibold">
                      {pet.adoptionFee === 0 ? 'Free' : `₩${pet.adoptionFee.toLocaleString()}`}
                    </span>
                    
                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">{pet.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span className="text-xs">{pet.likesCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/pets/${pet._id}`}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                    >
                      상세보기
                    </Link>
                    <button
                      onClick={(e) => handleStartChat(pet._id, pet.name, e)}
                      className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      채팅하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more button */}
        {hasNextPage && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading more indicator */}
        {loading && pets.length > 0 && (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
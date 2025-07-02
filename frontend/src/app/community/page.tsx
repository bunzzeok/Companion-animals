'use client'

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Heart, ArrowLeft, Plus, MessageCircle, ThumbsUp, Eye, Clock, Pin, Star, Users, Menu, Search, X } from 'lucide-react';
import { communityAPI, apiUtils, type CommunityPost, type ApiResponse } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../../components/NotificationBell';
import { NotificationProvider } from '../../contexts/NotificationContext';

// 커뮤니티 페이지 내용 컴포넌트
function CommunityContent() {
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<CommunityPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<CommunityPost[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [communityStats, setCommunityStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Event handlers for mobile menu
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleShowMobileMenu = useCallback(() => {
    setShowMobileMenu(true);
  }, []);

  const handleHideMobileMenu = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

  const handleMobileLogout = useCallback(() => {
    logout();
    setShowMobileMenu(false);
  }, [logout]);

  // 커뮤니티 데이터 로드
  const loadCommunityData = async (category = 'all', page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: 10,
        ...(category !== 'all' && { category })
      };
      
      // 병렬로 데이터 로드
      const [postsResponse, featuredResponse, popularResponse, categoryResponse] = await Promise.all([
        communityAPI.getPosts(params),
        communityAPI.getFeaturedPosts(5),
        communityAPI.getPopularPosts({ limit: 5, period: 'week' }),
        communityAPI.getCategoryStats()
      ]);
      
      if (apiUtils.isSuccess(postsResponse)) {
        const postsData = apiUtils.getData(postsResponse) || [];
        const pagination = apiUtils.getPagination(postsResponse);
        
        if (page === 1) {
          setPosts(postsData);
        } else {
          setPosts(prev => [...prev, ...postsData]);
        }
        
        if (pagination) {
          setCurrentPage(pagination.currentPage);
          setTotalPages(pagination.totalPages);
        }
      }
      
      if (apiUtils.isSuccess(featuredResponse)) {
        setFeaturedPosts(apiUtils.getData(featuredResponse) || []);
      }
      
      if (apiUtils.isSuccess(popularResponse)) {
        setPopularPosts(apiUtils.getData(popularResponse) || []);
      }
      
      if (apiUtils.isSuccess(categoryResponse)) {
        setCategoryStats(apiUtils.getData(categoryResponse) || []);
      }
      
    } catch (error) {
      console.error('Failed to load community data:', error);
      
      // Mock 데이터로 폴백
      if (process.env.NODE_ENV === 'development') {
        const mockPosts: CommunityPost[] = [
          {
            _id: '1',
            title: '3개월 전 입양한 삼색이가 이렇게 변했어요! 🐱',
            content: '길고양이였던 삼색이를 데려온지 벌써 3개월이 되었어요. 처음엔 경계심이 많았는데 이제는 완전히 가족이 되었답니다.',
            category: '입양후기',
            tags: ['입양후기', '고양이', '삼색이'],
            author: {
              _id: 'user1',
              name: '고양이집사',
              profileImage: '/placeholder-user.jpg'
            },
            views: 1234,
            likes: [],
            dislikes: [],
            bookmarks: [],
            likesCount: 89,
            commentsCount: 45,
            isPinned: true,
            status: 'active',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        if (page === 1) {
          setPosts(mockPosts);
        }
        setFeaturedPosts(mockPosts);
        setPopularPosts(mockPosts.slice(0, 3));
        setCategoryStats([
          { _id: '입양후기', count: 256 },
          { _id: '돌봄팁', count: 189 },
          { _id: '질문답변', count: 345 }
        ]);
        setCommunityStats({
          overview: {
            totalPosts: 1234,
            activePosts: 1150,
            totalViews: 45678,
            totalComments: 2345
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 커뮤니티 통계 로드
  const loadCommunityStats = async () => {
    try {
      const response = await communityAPI.getStatistics();
      if (apiUtils.isSuccess(response)) {
        setCommunityStats(apiUtils.getData(response));
      }
    } catch (error) {
      console.error('Failed to load community stats:', error);
    }
  };

  useEffect(() => {
    loadCommunityData(selectedCategory, 1);
    loadCommunityStats();
  }, [selectedCategory]);

  // 카테고리 변경 처리
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 더 많이 로드
  const loadMore = () => {
    if (currentPage < totalPages) {
      loadCommunityData(selectedCategory, currentPage + 1);
    }
  };

  // 시간 포맷팅
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 네비게이션 - 홈페이지와 동일한 스타일 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* 로고 */}
            <div className="flex items-center min-w-0">
              <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
                <span className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  <span className="hidden xs:inline">Companion Animals</span>
                  <span className="xs:hidden">반려동물</span>
                </span>
              </Link>
            </div>
            
            {/* 중앙 네비게이션 - 데스크탑만 */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              <Link href="/pets" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                분양보기
              </Link>
              {!authLoading && isAuthenticated && user && (
                <Link href="/favorites" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                  찜목록
                </Link>
              )}
              <Link href="/adoption" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                입양신청
              </Link>
              <Link href="/community" className="text-orange-500 font-medium">
                커뮤니티
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                채팅
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                소개
              </Link>
            </nav>

            {/* 우측 버튼들 - 모바일 최적화 */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {!authLoading && (
                isAuthenticated && user ? (
                  // 로그인된 상태
                  <>
                    {/* 알림 벨 */}
                    <NotificationBell />
                    
                    <span className="hidden sm:block text-gray-700 font-medium">
                      {user?.name || '사용자'}님
                    </span>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm sm:text-base"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  // 로그인되지 않은 상태
                  <>
                    <Link 
                      href="/login" 
                      className="hidden sm:block text-gray-700 hover:text-orange-500 transition-colors font-medium"
                    >
                      로그인
                    </Link>
                    <Link 
                      href="/register" 
                      className="bg-gray-100 text-gray-700 px-3 py-2 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
                    >
                      <span className="hidden sm:inline">회원가입</span>
                      <span className="sm:hidden">가입</span>
                    </Link>
                  </>
                )
              )}
              
              {/* 모바일 메뉴 버튼 */}
              <button 
                onClick={handleShowMobileMenu}
                className="lg:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors flex items-center justify-center"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {/* 모바일 슬라이드 메뉴 오버레이 */}
        <div className="lg:hidden">
          {/* 배경 오버레이 */}
          <div 
            className={`fixed inset-0 z-[60] transition-all duration-300 ease-in-out ${
              showMobileMenu 
                ? 'bg-black/50 pointer-events-auto opacity-100' 
                : 'bg-black/0 pointer-events-none opacity-0'
            }`}
            onClick={handleHideMobileMenu}
          />
          
          {/* 슬라이드 메뉴 */}
          <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
            showMobileMenu ? 'translate-x-0' : 'translate-x-full'
          }`}>
              {/* 메뉴 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-orange-500" />
                  <span className="text-lg font-bold text-gray-900">메뉴</span>
                </div>
                <button 
                  onClick={handleHideMobileMenu}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* 사용자 정보 (로그인된 경우) */}
              {!authLoading && isAuthenticated && user && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0) || '사'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name || '사용자'}님</p>
                      <p className="text-sm text-gray-500">환영합니다!</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 메뉴 항목들 */}
              <div className="py-2">
                <Link 
                  href="/pets" 
                  onClick={handleHideMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Search className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">분양동물 보기</span>
                </Link>
                
                {/* 찜 목록 - 로그인된 사용자만 보이도록 */}
                {!authLoading && isAuthenticated && user && (
                  <Link 
                    href="/favorites" 
                    onClick={handleHideMobileMenu}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <Heart className="h-5 w-5 mr-3 text-gray-400 fill-current text-red-500" />
                    <span className="font-medium">내 찜 목록</span>
                  </Link>
                )}
                
                <Link 
                  href="/adoption" 
                  onClick={handleHideMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Heart className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">입양신청</span>
                </Link>
                
                <div className="flex items-center px-4 py-3 text-orange-600 bg-orange-50">
                  <Users className="h-5 w-5 mr-3 text-orange-500" />
                  <span className="font-medium">커뮤니티</span>
                </div>
                
                <Link 
                  href="/chat" 
                  onClick={handleHideMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">채팅</span>
                </Link>
                
                <Link 
                  href="/about" 
                  onClick={handleHideMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">소개</span>
                </Link>
              </div>
              
              {/* 하단 버튼들 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                {!authLoading && (
                  isAuthenticated && user ? (
                    <button 
                      onClick={handleMobileLogout}
                      className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      로그아웃
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link 
                        href="/login" 
                        onClick={handleHideMobileMenu}
                        className="block w-full py-3 px-4 text-center border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                      >
                        로그인
                      </Link>
                      <Link 
                        href="/register" 
                        onClick={handleHideMobileMenu}
                        className="block w-full py-3 px-4 text-center bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        회원가입
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 페이지 제목 */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
                  <p className="text-gray-600">
                    반려동물과 함께하는 일상을 나누고, 서로 도움을 주고받아요
                  </p>
                </div>
                <Link
                  href="/community/write"
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  글쓰기
                </Link>
              </div>
            </div>

            {/* 카테고리 탭 */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', name: '전체' },
                  { key: '입양후기', name: '입양후기' },
                  { key: '돌봄팁', name: '돌봄팁' },
                  { key: '질문답변', name: '질문답변' },
                  { key: '나눔', name: '나눔' },
                  { key: '실종신고', name: '실종신고' },
                  { key: '자유게시', name: '자유게시' }
                ].map((category, index) => {
                  const stat = categoryStats.find(s => s._id === category.key);
                  const count = stat?.count || 0;
                  const isActive = selectedCategory === category.key;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleCategoryChange(category.key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                      <span className="ml-1 text-xs opacity-75">
                        ({category.key === 'all' ? posts.length : count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 공지사항 */}
            <Link href="/community/notice" className="block mb-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 hover:bg-orange-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Pin className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">공지사항</span>
                  <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                    클릭하여 자세히 보기
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                  커뮤니티 이용 규칙 및 가이드라인
                </h3>
                <p className="text-sm text-gray-600">
                  건전한 커뮤니티 문화를 위해 꼭 읽어주세요
                </p>
              </div>
            </Link>

            {/* 추천 게시글 */}
            {featuredPosts.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-200 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                    추천글
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {featuredPosts[0].category}
                  </span>
                </div>
                <Link href={`/community/${featuredPosts[0]._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-500 cursor-pointer">
                    {featuredPosts[0].title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {featuredPosts[0].content.substring(0, 200)}...
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700">{featuredPosts[0].author.name}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(featuredPosts[0].createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{featuredPosts[0].views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{featuredPosts[0].likesCount || featuredPosts[0].likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{featuredPosts[0].commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {loading && posts.length === 0 ? (
                // 로딩 스켈레톤
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                // 빈 상태
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">게시글이 없습니다</h3>
                  <p className="text-gray-600 mb-6">첫 번째 게시글을 작성해보세요!</p>
                  <Link 
                    href="/community/write"
                    className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    글쓰기
                  </Link>
                </div>
              ) : (
                posts.map((post, index) => (
                  <div key={post._id} className={index > 0 ? 'mt-6' : ''}>
                    <Link href={`/community/${post._id}`}>
                      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            post.category === '실종신고' ? 'bg-red-100 text-red-700' :
                            post.category === '나눔' ? 'bg-green-100 text-green-700' :
                            post.category === '질문답변' ? 'bg-blue-100 text-blue-700' :
                            post.category === '돌봄팁' ? 'bg-purple-100 text-purple-700' :
                            post.category === '입양후기' ? 'bg-pink-100 text-pink-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium">
                              공지
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-500">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content.substring(0, 200)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-gray-700">{post.author.name}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{post.likesCount || post.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{post.commentsCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* 더보기 버튼 */}
            {currentPage < totalPages && (
              <div className="text-center mt-8">
                <button 
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? '로딩 중...' : '더 많은 게시글 보기'}
                </button>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 인기 게시글 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  인기 게시글
                </h3>
                <div className="space-y-3">
                  {popularPosts.length > 0 ? (
                    popularPosts.map((post, index) => (
                      <Link key={post._id} href={`/community/${post._id}`}>
                        <div className="flex items-start gap-2">
                          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700 hover:text-orange-500 cursor-pointer leading-tight">
                            {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">인기 게시글이 없습니다.</p>
                  )}
                </div>
              </div>

              {/* 커뮤니티 통계 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  커뮤니티 현황
                </h3>
                <div className="space-y-3">
                  {communityStats ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">전체 게시글</span>
                        <span className="font-semibold text-gray-900">{communityStats.overview?.totalPosts || 0}개</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">활성 게시글</span>
                        <span className="font-semibold text-gray-900">{communityStats.overview?.activePosts || 0}개</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">전체 조회수</span>
                        <span className="font-semibold text-gray-900">{communityStats.overview?.totalViews || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">전체 댓글수</span>
                        <span className="font-semibold text-gray-900">{communityStats.overview?.totalComments || 0}개</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">통계를 불러오는 중...</p>
                  )}
                </div>
              </div>

              {/* 빠른 링크 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">빠른 링크</h3>
                <div className="space-y-2">
                  <Link href="/pets" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    분양동물 보기
                  </Link>
                  <Link href="/adoption" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    입양 신청하기
                  </Link>
                  <Link href="/help" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    도움말
                  </Link>
                  <Link href="/contact" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    문의하기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 래퍼 컴포넌트
export default function CommunityPage() {
  return (
    <NotificationProvider>
      <CommunityContent />
    </NotificationProvider>
  );
}
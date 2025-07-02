'use client'

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Heart, Search, Plus, Users, ArrowRight, MapPin, Star, X, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import { petAPI, aboutAPI, communityAPI, apiUtils, socketUtils, type Pet } from "../lib/api";
import { NotificationProvider, useNotifications } from "../contexts/NotificationContext";
import NotificationBell from "../components/NotificationBell";

// 메인 홈페이지 컴포넌트 - 당근마켓 스타일
function HomeContent() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { addNotification } = useNotifications();
  
  // 디버깅을 위한 로그
  console.log('🏠 Home - Auth state:', { 
    isAuthenticated, 
    user, 
    userName: user?.name, 
    userType: user?.userType,
    userId: user?._id,
    isLoading 
  });
  
  // 사용자 데이터 상세 정보
  if (user) {
    console.log('🏠 Home - User detail:', JSON.stringify(user, null, 2));
  }
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [statistics, setStatistics] = useState({
    adoptions: 500,
    families: 1200,
    shelters: 50,
    support: '24/7'
  });
  const [communityStats, setCommunityStats] = useState({
    posts: 145,
    members: 1200,
    categories: 8,
    recentActivity: 23
  });
  const [categoryStats, setCategoryStats] = useState([
    { name: '고양이', icon: '🐱', count: '152마리' },
    { name: '강아지', icon: '🐶', count: '89마리' },
    { name: '토끼', icon: '🐰', count: '23마리' },
    { name: '새', icon: '🐦', count: '15마리' }
  ]);
  const [loading, setLoading] = useState(true);

  // Socket state for real-time notifications
  const [socket, setSocket] = useState<any>(null);

  // Wrap event handlers to avoid Client Component props issue
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

  const handleShowLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  // Socket.IO connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('🏠 Homepage: Not authenticated, skipping socket connection');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('🏠 Homepage: No auth token found for socket connection');
      return;
    }

    console.log('🏠 Homepage: Initializing socket connection for notifications');

    try {
      const newSocket = socketUtils.connect(token);
      
      if (newSocket) {
        setSocket(newSocket);
        
        newSocket.on('connect', () => {
          console.log('✅ Homepage: Socket connected for notifications');
          console.log('✅ Homepage: Socket ID:', newSocket.id);
          console.log('✅ Homepage: User ID:', user._id);
          console.log('✅ Homepage: User name:', user.name);
        });

        newSocket.on('connect_error', (error: any) => {
          console.error('❌ Homepage: Socket connection error:', error);
        });

        newSocket.on('disconnect', (reason: string) => {
          console.log('🔌 Homepage: Socket disconnected:', reason);
        });

        // Listen for new messages from other users
        newSocket.on('message:new', (message: any) => {
          console.log('📨 Homepage: New message received:', {
            messageId: message._id,
            sender: message.sender.name,
            senderId: message.sender._id,
            content: message.content,
            chatRoom: message.chatRoom,
            currentUserId: user._id,
            isCurrentUser: message.sender._id === user._id
          });

          // Show notifications for messages from other users only
          if (message.sender._id !== user._id) {
            console.log('📢 Homepage: Adding notification for message from other user');
            
            addNotification({
              type: 'chat',
              title: '새로운 메시지',
              message: `${message.sender.name}: ${message.content}`,
              chatRoomId: message.chatRoom,
              senderId: message.sender._id,
              senderName: message.sender.name
            });

            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('새로운 메시지', {
                body: `${message.sender.name}: ${message.content}`,
                icon: '/favicon.ico',
                tag: message.chatRoom
              });
            }
          } else {
            console.log('📢 Homepage: Ignoring notification - message from current user');
          }
        });

        return () => {
          console.log('🏠 Homepage: Cleaning up socket connection');
          if (newSocket) {
            newSocket.disconnect();
          }
        };
      }
    } catch (error) {
      console.error('❌ Homepage: Failed to initialize socket:', error);
    }
  }, [isAuthenticated, user, addNotification]);

  // Request notification permission on page load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🏠 Homepage: Notification permission:', permission);
      });
    }
  }, []);

  // Load homepage data
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        
        // Try to load featured pets
        try {
          const petsResponse = await petAPI.getPets({ limit: 4, featured: true });
          if (apiUtils.isSuccess(petsResponse)) {
            const petsData = apiUtils.getData(petsResponse) || [];
            setFeaturedPets(petsData);
            console.log('✅ Featured pets loaded:', petsData.length);
          } else {
            console.log('ℹ️ No featured pets found, using defaults');
          }
        } catch (petsError) {
          console.log('ℹ️ Featured pets API unavailable, using fallback');
        }

        // Try to load statistics
        try {
          const statsResponse = await aboutAPI.getStatistics();
          if (apiUtils.isSuccess(statsResponse)) {
            const statsData = apiUtils.getData(statsResponse);
            if (statsData) {
              setStatistics({
                adoptions: statsData.adoptions || 500,
                families: statsData.families || 1200,
                shelters: statsData.shelters || 50,
                support: statsData.support || '24/7'
              });
              console.log('✅ Statistics loaded:', statsData);
            }
          }
        } catch (statsError) {
          console.log('ℹ️ Statistics API unavailable, using defaults');
        }

        // Try to get pet category counts
        try {
          const typeCounts = await Promise.all([
            petAPI.getPets({ type: 'cat', limit: 1 }).catch(() => ({ data: { pagination: { totalItems: 152 } } })),
            petAPI.getPets({ type: 'dog', limit: 1 }).catch(() => ({ data: { pagination: { totalItems: 89 } } })),
            petAPI.getPets({ type: 'rabbit', limit: 1 }).catch(() => ({ data: { pagination: { totalItems: 23 } } })),
            petAPI.getPets({ type: 'bird', limit: 1 }).catch(() => ({ data: { pagination: { totalItems: 15 } } }))
          ]);

          const updatedCategories = [
            { name: '고양이', icon: '🐱', count: `${apiUtils.getPagination(typeCounts[0])?.totalItems || 152}마리` },
            { name: '강아지', icon: '🐶', count: `${apiUtils.getPagination(typeCounts[1])?.totalItems || 89}마리` },
            { name: '토끼', icon: '🐰', count: `${apiUtils.getPagination(typeCounts[2])?.totalItems || 23}마리` },
            { name: '새', icon: '🐦', count: `${apiUtils.getPagination(typeCounts[3])?.totalItems || 15}마리` }
          ];
          setCategoryStats(updatedCategories);
          console.log('✅ Category counts loaded');
        } catch (categoryError) {
          console.log('ℹ️ Category counts unavailable, using defaults');
        }

        // Try to load community statistics
        try {
          const communityResponse = await communityAPI.getPublicStatistics();
          if (apiUtils.isSuccess(communityResponse)) {
            const communityData = apiUtils.getData(communityResponse);
            if (communityData) {
              setCommunityStats({
                posts: communityData.posts || 145,
                members: communityData.members || 1200,
                categories: communityData.categories || 8,
                recentActivity: communityData.recentActivity || 23
              });
              console.log('✅ Community statistics loaded:', communityData);
            }
          }
        } catch (communityError) {
          console.log('ℹ️ Community statistics API unavailable, using defaults');
        }

      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

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
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 네비게이션 - 당근마켓 스타일 (모바일 최적화) */}
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
              {!isLoading && isAuthenticated && user && (
                <Link href="/favorites" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                  찜목록
                </Link>
              )}
              <Link href="/adoption" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                입양신청
              </Link>
              <Link href="/community" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
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
              {!isLoading && (
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
                      className="bg-orange-500 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
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
              {!isLoading && isAuthenticated && user && (
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
                {!isLoading && isAuthenticated && user && (
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
                
                <Link 
                  href="/community" 
                  onClick={handleHideMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Users className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">커뮤니티</span>
                </Link>
                
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
                {!isLoading && (
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

      {/* 메인 컨텐츠 */}
      <main>
        {/* 히어로 섹션 - 당근마켓 스타일 그라데이션 (모바일 최적화) */}
        <section className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #FFE2D2 0%, #FFF1AA 50%, #E3EFF9 100%)'
        }}>
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* 좌측 텍스트 */}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  <span className="block sm:inline">우리 동네에서 찾는</span>
                  <br className="hidden sm:block lg:hidden" />
                  <span className="text-orange-500 block sm:inline">소중한 가족</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                  <span className="block sm:inline">길고양이, 유기견들이 따뜻한 가정을</span>
                  <br className="hidden sm:block" />
                  <span className="block sm:inline">찾을 수 있도록 가까운 이웃과 함께해요</span>
                </p>
                
                {/* 주요 액션 버튼들 - 모바일 최적화 */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0">
                  <Link 
                    href="/pets" 
                    className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    분양동물 보기
                  </Link>
                  {isAuthenticated ? (
                    <Link 
                      href="/post-pet" 
                      className="bg-white text-orange-500 border-2 border-orange-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      분양등록하기
                    </Link>
                  ) : (
                    <button 
                      onClick={handleShowLoginModal}
                      className="bg-white text-orange-500 border-2 border-orange-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      분양등록하기
                    </button>
                  )}
                </div>
              </div>

              {/* 우측 이미지/일러스트 영역 - 모바일 최적화 */}
              <div className="relative order-first lg:order-last">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl mx-4 sm:mx-0">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                    <div className="bg-orange-100 rounded-xl sm:rounded-2xl h-20 sm:h-24 lg:h-32 flex items-center justify-center">
                      <Heart className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-orange-500" />
                    </div>
                    <div className="bg-blue-100 rounded-xl sm:rounded-2xl h-20 sm:h-24 lg:h-32 flex items-center justify-center">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-blue-500" />
                    </div>
                    <div className="bg-green-100 rounded-xl sm:rounded-2xl h-20 sm:h-24 lg:h-32 flex items-center justify-center">
                      <MapPin className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-green-500" />
                    </div>
                    <div className="bg-purple-100 rounded-xl sm:rounded-2xl h-20 sm:h-24 lg:h-32 flex items-center justify-center">
                      <Star className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 빠른 카테고리 섹션 - 모바일 최적화 */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8 lg:mb-12">
              어떤 동물을 찾고 계신가요?
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-2xl lg:max-w-none mx-auto">
              {categoryStats.map((category, index) => (
                <Link 
                  key={index}
                  href={`/pets?type=${category.name}`}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all transform hover:scale-105 border border-gray-100 min-h-[100px] sm:min-h-[120px] flex flex-col justify-center"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{category.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 최근 등록된 동물들 - 모바일 최적화 */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                <span className="hidden sm:inline">우리 동네 새로운 친구들</span>
                <span className="sm:hidden">새로운 친구들</span>
              </h2>
              <Link 
                href="/pets" 
                className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 text-sm sm:text-base"
              >
                더보기 <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {/* 실제 데이터베이스에서 가져온 펫 카드들 */}
              {loading ? (
                // Loading skeleton
                [1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="aspect-square bg-gray-200 animate-pulse"></div>
                    <div className="p-3 sm:p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : featuredPets.length > 0 ? (
                featuredPets.map((pet) => (
                  <Link key={pet._id} href={`/pets/${pet._id}`} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <div className="aspect-square bg-gray-200 relative">
                      {/* Pet image */}
                      {pet.images && pet.images.length > 0 ? (
                        <img 
                          src={apiUtils.getImageUrl(pet.images[0])} 
                          alt={pet.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 hidden">
                        <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                      </div>
                      
                      {/* Urgency badge */}
                      {pet.urgency === 'high' && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                            긴급
                          </span>
                        </div>
                      )}
                      
                      {/* Status badge */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium ${
                          pet.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : pet.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pet.status === 'available' ? '분양가능' : 
                           pet.status === 'pending' ? '분양중' : '분양완료'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-1">
                        {pet.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        {pet.location.district} · {formatTimeAgo(pet.createdAt)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {pet.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <span className="text-orange-500 font-semibold text-xs sm:text-sm">
                          <span className="hidden sm:inline">
                            {pet.adoptionFee === 0 ? '무료분양' : `₩${pet.adoptionFee.toLocaleString()}`}
                          </span>
                          <span className="sm:hidden">
                            {pet.adoptionFee === 0 ? '무료' : `₩${pet.adoptionFee.toLocaleString()}`}
                          </span>
                        </span>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${pet.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-xs">{pet.likesCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // No data fallback
                [1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="aspect-square bg-gray-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-1">
                        귀여운 반려동물
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">등록 예정</p>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        곧 만나볼 수 있어요!
                      </p>
                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <span className="text-orange-500 font-semibold text-xs sm:text-sm">
                          <span className="hidden sm:inline">등록 예정</span>
                          <span className="sm:hidden">예정</span>
                        </span>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 통계 섹션 - 모바일 최적화 */}
        <section className="py-8 sm:py-12 lg:py-16" style={{ backgroundColor: '#FFF1AA' }}>
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                <span className="hidden sm:inline">함께 만들어가는 따뜻한 세상</span>
                <span className="sm:hidden">따뜻한 세상을 함께</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                더 많은 동물들이 행복한 가정을 찾을 수 있도록
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center max-w-2xl lg:max-w-none mx-auto">
              <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">{statistics.adoptions}+</div>
                <div className="text-gray-600 text-sm sm:text-base">성공한 분양</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">{statistics.families.toLocaleString()}+</div>
                <div className="text-gray-600 text-sm sm:text-base">행복한 가족</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">{statistics.shelters}+</div>
                <div className="text-gray-600 text-sm sm:text-base">협력 보호소</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">{statistics.support}</div>
                <div className="text-gray-600 text-sm sm:text-base">상담 지원</div>
              </div>
            </div>
          </div>
        </section>

        {/* 커뮤니티 섹션 */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                활발한 커뮤니티
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                반려동물 관련 정보 공유, 질문답변, 입양 후기 등 따뜻한 소통이 이루어지는 공간입니다
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-100">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {communityStats.posts}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">게시글</div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-100">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
                  {communityStats.members}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">활동 회원</div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-100">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {communityStats.categories}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">카테고리</div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-100">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">
                  {communityStats.recentActivity}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">최근 활동</div>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/community" 
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors touch-manipulation"
              >
                커뮤니티 둘러보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 사용 방법 섹션 - 모바일 최적화 */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-10 lg:mb-12">
              이렇게 사용해보세요
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: <Search className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-orange-500" />,
                  title: "동물 찾기",
                  description: "우리 동네 분양 가능한 동물들을 찾아보세요. 필터를 통해 원하는 조건의 동물을 쉽게 찾을 수 있어요."
                },
                {
                  icon: <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-orange-500" />,
                  title: "분양자와 소통",
                  description: "마음에 드는 동물을 발견했다면 분양자와 직접 대화해보세요. 안전한 채팅 시스템을 제공해요."
                },
                {
                  icon: <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-orange-500" />,
                  title: "입양 완료",
                  description: "만남과 상담을 통해 입양을 결정하세요. 입양 후에도 지속적인 케어를 도와드려요."
                }
              ].map((step, index) => (
                <div key={index} className="text-center sm:col-span-2 lg:col-span-1 last:sm:col-start-1 last:sm:col-end-3 last:lg:col-start-auto last:lg:col-end-auto last:sm:max-w-sm last:sm:mx-auto last:lg:max-w-none">
                  <div className="bg-orange-50 rounded-full w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 - 당근마켓 스타일 (모바일 최적화) */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                <span className="text-base sm:text-lg font-semibold">
                  <span className="hidden xs:inline">Companion Animals</span>
                  <span className="xs:hidden">반려동물</span>
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                길잃은 동물들이 따뜻한 가정을 
                찾을 수 있도록 돕는 플랫폼
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">서비스</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link href="/pets" className="hover:text-white transition-colors">분양보기</Link></li>
                <li><Link href="/adoption" className="hover:text-white transition-colors">입양신청</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">지원</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">도움말</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
                <li><Link href="/report" className="hover:text-white transition-colors">신고하기</Link></li>
              </ul>
            </div>
            
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">정보</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">회사소개</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              &copy; 2024 Companion Animals. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* 로그인 모달 */}
      {showLoginModal && (
        <ProtectedRoute 
          requireLogin={true} 
          showModal={true} 
          redirectTo="/login"
        >
          <div></div>
        </ProtectedRoute>
      )}
    </div>
  );
}

// 래퍼 컴포넌트
export default function Home() {
  return (
    <NotificationProvider>
      <HomeContent />
    </NotificationProvider>
  );
}
'use client'

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { Heart, ArrowLeft, Pin, Users, Menu, Search, X } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import NotificationBell from '../../../components/NotificationBell';
import { NotificationProvider } from '../../../contexts/NotificationContext';

// 커뮤니티 공지사항 페이지 내용 컴포넌트
function CommunityNoticeContent() {
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link 
            href="/community" 
            className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            커뮤니티로 돌아가기
          </Link>
        </div>

        {/* 공지사항 헤더 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Pin className="h-6 w-6 text-orange-500" />
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              공지사항
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            커뮤니티 이용 규칙 및 가이드라인
          </h1>
          <p className="text-gray-600 text-lg">
            건전한 커뮤니티 문화를 만들어가기 위한 이용 규칙입니다
          </p>
          <div className="mt-4 text-sm text-gray-500">
            게시일: 2024년 7월 1일 | 최종 수정: 2024년 7월 2일
          </div>
        </div>

        {/* 공지사항 내용 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 기본 원칙</h2>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• 모든 반려동물을 사랑하고 존중하는 마음으로 소통해주세요</li>
              <li>• 서로 다른 의견을 인정하고 존중하는 문화를 만들어가요</li>
              <li>• 욕설, 비방, 차별적 발언은 삼가주세요</li>
              <li>• 개인정보 보호를 위해 연락처나 주소 등 민감한 정보 공유는 주의해주세요</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 게시글 작성 규칙</h2>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• 적절한 카테고리를 선택하여 게시글을 작성해주세요</li>
              <li>• 제목은 내용을 잘 나타낼 수 있도록 구체적으로 작성해주세요</li>
              <li>• 반려동물 관련 정보를 공유할 때는 정확한 정보를 제공해주세요</li>
              <li>• 상업적 광고나 홍보성 게시글은 금지됩니다</li>
              <li>• 동일한 내용의 중복 게시는 삼가주세요</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 입양 및 분양 관련</h2>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• 입양은 반드시 책임감을 가지고 신중하게 결정해주세요</li>
              <li>• 동물의 건강 상태와 성격 등을 정확히 공유해주세요</li>
              <li>• 무료 분양을 가장한 판매 행위는 금지됩니다</li>
              <li>• 입양 후 적응 과정에서 어려움이 있을 때는 커뮤니티에서 도움을 요청하세요</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 실종신고 및 제보</h2>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• 실종신고 시 동물의 특징, 실종 장소, 연락처를 정확히 기재해주세요</li>
              <li>• 발견 시에는 즉시 연락하고 안전한 장소에 보호해주세요</li>
              <li>• 허위 신고나 장난성 게시글은 엄격히 금지됩니다</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 제재 및 신고</h2>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• 규칙 위반 시 경고, 게시글 삭제, 계정 정지 등의 조치가 취해집니다</li>
              <li>• 부적절한 게시글이나 댓글을 발견하면 신고 기능을 이용해주세요</li>
              <li>• 반복적인 규칙 위반 시 영구 이용 정지될 수 있습니다</li>
            </ul>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                🐾 함께 만들어가는 따뜻한 커뮤니티
              </h3>
              <p className="text-orange-700">
                이 규칙은 모든 회원이 안전하고 즐겁게 소통할 수 있는 환경을 만들기 위함입니다. 
                여러분의 협조로 더욱 따뜻하고 건전한 반려동물 커뮤니티를 만들어가요!
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                문의사항이나 신고할 내용이 있으시면 <Link href="/contact" className="text-orange-500 hover:underline">문의하기</Link>를 이용해주세요.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 래퍼 컴포넌트
export default function CommunityNoticePage() {
  return (
    <NotificationProvider>
      <CommunityNoticeContent />
    </NotificationProvider>
  );
}
'use client'

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { Heart, ArrowLeft, CheckCircle2, FileText, Phone, MapPin, Calendar, Users, Shield, Menu, Search, X, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../../components/NotificationBell';
import { NotificationProvider } from '../../contexts/NotificationContext';

// 입양신청 페이지 내용 컴포넌트
function AdoptionContent() {
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
    <div className="min-h-screen bg-white">
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
              <Link href="/adoption" className="text-orange-500 font-medium">
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
                
                <div className="flex items-center px-4 py-3 text-orange-600 bg-orange-50">
                  <Heart className="h-5 w-5 mr-3 text-orange-500" />
                  <span className="font-medium">입양신청</span>
                </div>
                
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
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">입양 신청</h1>
          <p className="text-gray-600">
            소중한 생명을 책임지고 보살펴주실 분을 찾습니다. 신중하게 작성해주세요.
          </p>
        </div>

        {/* 입양 절차 안내 */}
        <div className="bg-orange-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-orange-500" />
            입양 절차 안내
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-xs font-bold">1</div>
              <div className="font-medium text-gray-900">신청서 작성</div>
              <div className="text-gray-600">기본 정보 입력</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-xs font-bold">2</div>
              <div className="font-medium text-gray-900">서류 검토</div>
              <div className="text-gray-600">1-2일 소요</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-xs font-bold">3</div>
              <div className="font-medium text-gray-900">상담 진행</div>
              <div className="text-gray-600">전화/방문 상담</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-xs font-bold">4</div>
              <div className="font-medium text-gray-900">입양 완료</div>
              <div className="text-gray-600">동물과 만남</div>
            </div>
          </div>
        </div>

        {/* 입양 신청 양식 */}
        <form className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              기본 정보
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="홍길동"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="010-1234-5678"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="hong@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나이
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors">
                  <option value="">선택해주세요</option>
                  <option value="20-29">20-29세</option>
                  <option value="30-39">30-39세</option>
                  <option value="40-49">40-49세</option>
                  <option value="50-59">50-59세</option>
                  <option value="60+">60세 이상</option>
                </select>
              </div>
            </div>
          </div>

          {/* 거주 정보 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              거주 정보
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거주지 주소 *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="서울시 강남구 역삼동"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주거 형태 *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" required>
                    <option value="">선택해주세요</option>
                    <option value="아파트">아파트</option>
                    <option value="단독주택">단독주택</option>
                    <option value="빌라/연립">빌라/연립</option>
                    <option value="원룸/오피스텔">원룸/오피스텔</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    동물 허용 여부 *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" required>
                    <option value="">선택해주세요</option>
                    <option value="허용">허용</option>
                    <option value="조건부허용">조건부 허용</option>
                    <option value="미확인">미확인</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 입양 경험 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-orange-500" />
              입양 경험 및 동기
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  반려동물 경험
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors">
                  <option value="">선택해주세요</option>
                  <option value="처음">처음 키워요</option>
                  <option value="경험있음">경험이 있어요</option>
                  <option value="현재키움">현재 키우고 있어요</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  입양 동기 *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder="입양을 결심하게 된 이유를 간단히 설명해주세요..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  케어 계획
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder="동물을 어떻게 돌볼 계획인지 알려주세요..."
                />
              </div>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              약관 동의
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">[필수]</span> 입양 약관에 동의합니다.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">[선택]</span> 입양 관련 정보 수신에 동의합니다.
                </span>
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
              입양 신청서 제출
            </button>
          </div>
        </form>

        {/* 문의 안내 */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">궁금한 점이 있으신가요?</h3>
          <p className="text-gray-600 mb-4">
            입양 절차나 준비사항에 대해 궁금하신 점이 있으시면 언제든 문의해주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-white text-orange-500 border border-orange-500 px-6 py-2 rounded-lg hover:bg-orange-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              문의하기
            </Link>
            <Link
              href="/help"
              className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg font-medium"
            >
              도움말 보기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// 래퍼 컴포넌트
export default function AdoptionPage() {
  return (
    <NotificationProvider>
      <AdoptionContent />
    </NotificationProvider>
  );
}
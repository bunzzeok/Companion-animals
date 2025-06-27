import Link from "next/link";
import { Heart, Search, Plus, Users, ArrowRight, MapPin, Star } from "lucide-react";

// 메인 홈페이지 컴포넌트 - 당근마켓 스타일
export default function Home() {
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
              
              {/* 모바일 메뉴 버튼 */}
              <button className="lg:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* 모바일 네비게이션 메뉴 */}
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex justify-around py-2">
              <Link href="/pets" className="flex-1 text-center py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                분양보기
              </Link>
              <Link href="/adoption" className="flex-1 text-center py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                입양신청
              </Link>
              <Link href="/community" className="flex-1 text-center py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                커뮤니티
              </Link>
              <Link href="/chat" className="flex-1 text-center py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                채팅
              </Link>
              <Link href="/about" className="flex-1 text-center py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                소개
              </Link>
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
                  <Link 
                    href="/post-pet" 
                    className="bg-white text-orange-500 border-2 border-orange-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    분양등록하기
                  </Link>
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
              {[
                { name: '고양이', icon: '🐱', count: '152마리' },
                { name: '강아지', icon: '🐶', count: '89마리' },
                { name: '토끼', icon: '🐰', count: '23마리' },
                { name: '새', icon: '🐦', count: '15마리' }
              ].map((category, index) => (
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
              {/* 샘플 펫 카드들 - 모바일 최적화 */}
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                  <div className="aspect-square bg-gray-200 relative">
                    {/* 이미지 placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                    </div>
                    {/* 긴급도 뱃지 - 모바일 최적화 */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                        긴급
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-1">
                      귀여운 고양이
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">성동구 · 어제</p>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      건강한 아이고 사람을 좋아해요. 좋은 가정 찾습니다.
                    </p>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <span className="text-orange-500 font-semibold text-xs sm:text-sm">
                        <span className="hidden sm:inline">무료분양</span>
                        <span className="sm:hidden">무료</span>
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">23</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">500+</div>
                <div className="text-gray-600 text-sm sm:text-base">성공한 분양</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">1,200+</div>
                <div className="text-gray-600 text-sm sm:text-base">행복한 가족</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">50+</div>
                <div className="text-gray-600 text-sm sm:text-base">협력 보호소</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">24/7</div>
                <div className="text-gray-600 text-sm sm:text-base">상담 지원</div>
              </div>
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
    </div>
  );
}
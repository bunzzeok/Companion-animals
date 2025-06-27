import Link from 'next/link';
import { Heart, ArrowLeft, Send, Phone, Mail, MapPin, Clock, MessageCircle, HelpCircle, Shield, AlertTriangle } from 'lucide-react';

// 문의하기 페이지 컴포넌트
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            {/* 뒤로가기 버튼 */}
            <Link 
              href="/" 
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">Companion Animals</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 메인 폼 */}
          <div className="lg:col-span-2">
            {/* 페이지 제목 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">문의하기</h1>
              <p className="text-gray-600">
                궁금한 점이나 문제가 있으시면 언제든 연락해주세요. 빠르게 도움을 드리겠습니다.
              </p>
            </div>

            {/* 문의 유형 선택 */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">문의 유형을 선택해주세요</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
                    title: "일반 문의",
                    description: "서비스 이용법, 기능 관련 질문"
                  },
                  {
                    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
                    title: "기술 지원",
                    description: "로그인 문제, 오류 신고"
                  },
                  {
                    icon: <Heart className="h-5 w-5 text-pink-500" />,
                    title: "입양/분양 관련",
                    description: "입양 절차, 분양 등록 문의"
                  },
                  {
                    icon: <Shield className="h-5 w-5 text-green-500" />,
                    title: "신고/신뢰성",
                    description: "사기, 부적절한 게시글 신고"
                  }
                ].map((type, index) => (
                  <label key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
                    <input
                      type="radio"
                      name="inquiryType"
                      value={type.title}
                      className="mt-1 w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex items-center gap-2 mb-1">
                      {type.icon}
                      <span className="font-medium text-gray-900">{type.title}</span>
                    </div>
                    <div></div>
                    <p className="text-sm text-gray-600 -mt-6 ml-6">{type.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* 문의 양식 */}
            <form className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">문의 내용을 작성해주세요</h2>
              
              <div className="space-y-6">
                {/* 기본 정보 */}
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
                      이메일 *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="hong@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="010-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      회원 유형
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors">
                      <option value="">선택해주세요</option>
                      <option value="adopter">입양희망자</option>
                      <option value="provider">분양자</option>
                      <option value="general">일반회원</option>
                      <option value="non-member">비회원</option>
                    </select>
                  </div>
                </div>

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="문의 제목을 입력해주세요"
                    required
                  />
                </div>

                {/* 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용 *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="문의하실 내용을 자세히 적어주세요...

예시:
- 언제 문제가 발생했나요?
- 어떤 오류 메시지가 나타났나요?
- 사용 중인 기기와 브라우저는 무엇인가요?
- 스크린샷이 있다면 첨부해주세요."
                    required
                  />
                </div>

                {/* 파일 첨부 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일 첨부 (선택사항)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                    <div className="text-gray-500 mb-2">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-orange-500 hover:text-orange-600 cursor-pointer">
                        파일을 선택하거나
                      </span> 여기로 드래그하세요
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      PNG, JPG, PDF 최대 10MB
                    </div>
                    <input type="file" className="hidden" multiple accept=".png,.jpg,.jpeg,.pdf" />
                  </div>
                </div>

                {/* 개인정보 동의 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">[필수]</span> 문의 처리를 위한 개인정보 수집 및 이용에 동의합니다.
                      <Link href="/privacy" className="text-orange-500 hover:text-orange-600 ml-1">
                        자세히 보기
                      </Link>
                    </span>
                  </label>
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
                    <Send className="h-5 w-5" />
                    문의 보내기
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 연락처 정보 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">연락처 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                      <Phone className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">전화 문의</div>
                      <div className="text-gray-600">02-1234-5678</div>
                      <div className="text-xs text-gray-500">평일 9시~18시</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <Mail className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">이메일 문의</div>
                      <div className="text-gray-600">support@companionanimals.com</div>
                      <div className="text-xs text-gray-500">24시간 접수 가능</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                      <MapPin className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">방문 상담</div>
                      <div className="text-gray-600">서울시 강남구 테헤란로 123</div>
                      <div className="text-xs text-gray-500">사전 예약 필수</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 운영 시간 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  운영 시간
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">평일</span>
                    <span className="font-medium text-gray-900">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">토요일</span>
                    <span className="font-medium text-gray-900">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">일요일/공휴일</span>
                    <span className="text-red-500">휴무</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      이메일 문의는 24시간 접수 가능하며,
                      <br />
                      영업일 기준 24시간 내 답변드립니다.
                    </div>
                  </div>
                </div>
              </div>

              {/* 빠른 도움말 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">빠른 도움말</h3>
                <div className="space-y-3">
                  <Link
                    href="/help"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm">자주 묻는 질문</div>
                    <div className="text-xs text-gray-600">일반적인 질문의 답변을 확인하세요</div>
                  </Link>
                  
                  <Link
                    href="/help"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm">이용 가이드</div>
                    <div className="text-xs text-gray-600">서비스 이용법을 단계별로 안내</div>
                  </Link>
                  
                  <Link
                    href="/community"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm">커뮤니티</div>
                    <div className="text-xs text-gray-600">다른 사용자들과 정보를 공유하세요</div>
                  </Link>
                </div>
              </div>

              {/* 응급 상황 */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  응급 상황
                </h3>
                <p className="text-red-700 text-sm mb-3">
                  동물의 생명과 관련된 응급 상황이거나 즉시 조치가 필요한 경우
                </p>
                <div className="space-y-2">
                  <div className="text-red-800 font-medium text-sm">
                    📞 응급 핫라인: 02-1234-9999
                  </div>
                  <div className="text-red-600 text-xs">
                    24시간 운영 (상황에 따라 관련 기관 연결)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
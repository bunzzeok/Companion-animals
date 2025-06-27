import Link from 'next/link';
import { Heart, ArrowLeft, CheckCircle2, FileText, Phone, MapPin, Calendar, Users, Shield } from 'lucide-react';

// 입양신청 페이지 컴포넌트
export default function AdoptionPage() {
  return (
    <div className="min-h-screen bg-white">
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
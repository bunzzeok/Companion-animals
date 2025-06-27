import Link from 'next/link';
import { Heart, ArrowLeft, Upload, Plus, X, MapPin, Phone, Mail } from 'lucide-react';

// 분양등록 페이지 컴포넌트
export default function PostPetPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center h-14 sm:h-16">
            {/* 뒤로가기 버튼 */}
            <Link 
              href="/" 
              className="mr-3 sm:mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </Link>
            
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
              <span className="text-base sm:text-xl font-bold text-gray-900 truncate">
                <span className="hidden xs:inline">Companion Animals</span>
                <span className="xs:hidden">반려동물</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* 페이지 제목 */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">분양 등록</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            소중한 동물이 좋은 가정을 찾을 수 있도록 정확한 정보를 입력해주세요
          </p>
        </div>

        {/* 등록 안내 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="font-semibold text-orange-800 mb-3 text-sm sm:text-base">분양 등록 안내</h2>
          <ul className="text-orange-700 text-xs sm:text-sm space-y-1">
            <li>• 정확하고 상세한 정보를 입력해주세요</li>
            <li>• 동물의 건강상태와 성격을 솔직하게 기재해주세요</li>
            <li>• 좋은 품질의 사진을 여러 장 등록하면 더 많은 관심을 받을 수 있어요</li>
            <li>• 허위 정보나 상업적 목적의 등록은 제재 대상입니다</li>
          </ul>
        </div>

        {/* 등록 폼 */}
        <form className="space-y-6 sm:space-y-8">
          {/* 사진 등록 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">사진 등록 *</h3>
            
            {/* 사진 업로드 영역 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* 메인 사진 */}
              <div className="col-span-2 row-span-2">
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-300 transition-colors cursor-pointer relative group">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
                      메인 사진을 선택하세요
                      <br />
                      <span className="text-xs text-gray-400">(최대 10MB)</span>
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              {/* 추가 사진들 */}
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-300 transition-colors cursor-pointer relative group">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">추가</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              첫 번째 사진이 대표 사진으로 사용됩니다. 최대 7장까지 등록 가능합니다.
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">기본 정보</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  동물 이름 *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                  placeholder="예: 루시, 맥스"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  동물 종류 *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base" required>
                  <option value="">선택해주세요</option>
                  <option value="cat">고양이</option>
                  <option value="dog">강아지</option>
                  <option value="rabbit">토끼</option>
                  <option value="bird">새</option>
                  <option value="hamster">햄스터</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  품종
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                  placeholder="예: 코리안숏헤어, 믹스견"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나이 *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base" required>
                  <option value="">선택해주세요</option>
                  <option value="baby">아기 (0-1세)</option>
                  <option value="young">어린이 (1-3세)</option>
                  <option value="adult">성인 (3-7세)</option>
                  <option value="senior">시니어 (7세+)</option>
                  <option value="unknown">모름</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성별
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="gender" value="male" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">수컷</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="gender" value="female" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">암컷</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="gender" value="unknown" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">모름</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  크기
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base">
                  <option value="">선택해주세요</option>
                  <option value="small">소형 (5kg 미만)</option>
                  <option value="medium">중형 (5-20kg)</option>
                  <option value="large">대형 (20kg 이상)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 건강 정보 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">건강 정보</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  중성화 수술
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="neutered" value="yes" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">완료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="neutered" value="no" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">미완료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="neutered" value="unknown" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">모름</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예방접종
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="vaccinated" value="complete" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">완료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="vaccinated" value="partial" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">일부 완료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="vaccinated" value="none" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">미완료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="vaccinated" value="unknown" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">모름</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건강 상태 및 특이사항
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-sm sm:text-base"
                  placeholder="현재 건강 상태, 치료 이력, 알레르기, 복용 중인 약물 등을 상세히 기록해주세요"
                />
              </div>
            </div>
          </div>

          {/* 성격 및 특징 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">성격 및 특징</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  성격 (중복 선택 가능)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    '친화적', '활발함', '조용함', '장난기 많음', 
                    '독립적', '애교 많음', '경계심 많음', '순함', 
                    '호기심 많음', '차분함', '사교적', '보호본능 강함'
                  ].map((trait) => (
                    <label key={trait} className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                      <span className="ml-2 text-sm">{trait}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 설명 *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-sm sm:text-base"
                  placeholder="동물의 성격, 좋아하는 것, 싫어하는 것, 특별한 습관 등을 자세히 설명해주세요. 입양자가 미리 알아야 할 중요한 정보들을 포함해주세요."
                  required
                />
              </div>
            </div>
          </div>

          {/* 분양 조건 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">분양 조건</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  분양비
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="feeType" value="free" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">무료분양</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="feeType" value="paid" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                    <span className="ml-2 text-sm">유료분양</span>
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                    placeholder="금액 (원)"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  긴급도
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base">
                  <option value="low">여유 있음</option>
                  <option value="medium">일반</option>
                  <option value="high">긴급</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  긴급한 경우 목록에서 우선 노출됩니다
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  특별 조건 및 요청사항
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-sm sm:text-base"
                  placeholder="입양자에게 바라는 점, 특별한 조건, 방문 가능 시간 등을 적어주세요"
                />
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">연락처 정보</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                  placeholder="010-1234-5678"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                만남 가능 지역 *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
                placeholder="예: 서울시 강남구, 서초구 (구체적인 지역을 입력해주세요)"
                required
              />
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">약관 동의</h3>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">[필수]</span> 분양 등록 약관에 동의합니다.
                  <Link href="/terms" className="text-orange-500 hover:text-orange-600 ml-1">
                    약관 보기
                  </Link>
                </span>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-600 ml-1">
                    자세히 보기
                  </Link>
                </span>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">[선택]</span> 입양 관련 알림 수신에 동의합니다.
                </span>
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center text-sm sm:text-base"
            >
              취소
            </Link>
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
              분양 등록하기
            </button>
          </div>
        </form>

        {/* 도움말 */}
        <div className="mt-8 sm:mt-12 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">분양 등록 도움말</h3>
          <p className="text-blue-700 text-xs sm:text-sm mb-4">
            성공적인 분양을 위한 팁을 확인해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/help"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-center text-sm"
            >
              도움말 보기
            </Link>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg font-medium text-center text-sm"
            >
              문의하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
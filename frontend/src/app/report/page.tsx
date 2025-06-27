import Link from 'next/link';
import { Heart, ArrowLeft, Shield, AlertTriangle, Send, Eye, MessageCircle, User, Camera, Clock } from 'lucide-react';

// 신고하기 페이지 컴포넌트
export default function ReportPage() {
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-500" />
            신고하기
          </h1>
          <p className="text-gray-600">
            부적절한 내용이나 의심스러운 활동을 발견하셨나요? 안전한 커뮤니티를 위해 신고해주세요.
          </p>
        </div>

        {/* 신고 안내 */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-800 mb-2">신고 전 확인사항</h2>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• 허위 신고는 제재 대상이 될 수 있습니다</li>
                <li>• 신고 내용은 검토 후 적절한 조치가 취해집니다</li>
                <li>• 개인적인 분쟁은 당사자 간 해결을 권장합니다</li>
                <li>• 응급상황의 경우 관련 기관에 직접 신고해주세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 신고 유형 선택 */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">신고 유형을 선택해주세요</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <User className="h-5 w-5 text-red-500" />,
                title: "사기/허위정보",
                description: "가짜 분양글, 사기 시도, 허위 정보",
                examples: "존재하지 않는 동물, 가격 사기, 허위 연락처"
              },
              {
                icon: <MessageCircle className="h-5 w-5 text-orange-500" />,
                title: "부적절한 게시글",
                description: "욕설, 혐오 표현, 스팸성 게시물",
                examples: "욕설, 광고 도배, 혐오 발언, 무관한 내용"
              },
              {
                icon: <Camera className="h-5 w-5 text-purple-500" />,
                title: "부적절한 사진/영상",
                description: "폭력적이거나 부적절한 이미지",
                examples: "동물 학대, 성적 콘텐츠, 폭력적 이미지"
              },
              {
                icon: <Shield className="h-5 w-5 text-blue-500" />,
                title: "개인정보 노출",
                description: "타인의 개인정보 무단 공개",
                examples: "주소, 전화번호, 신상정보 노출"
              },
              {
                icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
                title: "동물 학대 의심",
                description: "동물 학대나 방치 의심 사례",
                examples: "학대 흔적, 방치 상태, 위험한 환경"
              },
              {
                icon: <Eye className="h-5 w-5 text-gray-500" />,
                title: "기타",
                description: "위에 해당하지 않는 기타 신고사항",
                examples: "저작권 침해, 기타 규정 위반"
              }
            ].map((type, index) => (
              <label key={index} className="block p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="reportType"
                    value={type.title}
                    className="mt-1 w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {type.icon}
                      <span className="font-medium text-gray-900">{type.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <p className="text-xs text-gray-500">예시: {type.examples}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 신고 대상 정보 */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">신고 대상 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                신고 대상 유형 *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" required>
                <option value="">선택해주세요</option>
                <option value="user">사용자 (프로필/계정)</option>
                <option value="post">게시글</option>
                <option value="comment">댓글</option>
                <option value="chat">채팅 메시지</option>
                <option value="listing">분양글</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신고 대상 ID/링크
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="사용자 ID 또는 게시글 링크"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발생 일시
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 신고 내용 */}
        <form className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">상세 신고 내용</h2>
          
          <div className="space-y-6">
            {/* 신고자 정보 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신고자 이름 *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="실명 또는 닉네임"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="이메일 주소"
                  required
                />
              </div>
            </div>

            {/* 신고 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                신고 제목 *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="신고 내용을 간단히 요약해주세요"
                required
              />
            </div>

            {/* 상세 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 내용 *
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                placeholder="신고 사유를 구체적으로 설명해주세요.

다음 정보를 포함해주시면 더 정확한 처리가 가능합니다:
- 구체적인 위반 내용
- 발생 경위나 상황
- 관련 증거나 스크린샷 설명
- 피해 정도나 영향"
                required
              />
            </div>

            {/* 증거 파일 첨부 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                증거 자료 첨부
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                <div className="text-gray-500 mb-2">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-red-500 hover:text-red-600 cursor-pointer">
                    스크린샷이나 증거 파일을 선택하거나
                  </span> 여기로 드래그하세요
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF, 동영상 파일 최대 50MB
                </div>
                <input type="file" className="hidden" multiple accept=".png,.jpg,.jpeg,.pdf,.mp4,.mov" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                스크린샷, 대화 내용 캡처, 관련 문서 등을 첨부하면 신속한 처리에 도움이 됩니다.
              </p>
            </div>

            {/* 처리 희망사항 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                처리 희망사항
              </label>
              <div className="space-y-2">
                {[
                  "해당 내용/계정 삭제",
                  "사용자 경고 조치",
                  "사용자 정지 조치",
                  "관련 기관 신고",
                  "기타 (상세 내용에 명시)"
                ].map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 동의사항 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">[필수]</span> 신고 내용이 사실임을 확인하며, 허위신고 시 제재를 받을 수 있음에 동의합니다.
                  </span>
                </label>
                
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">[필수]</span> 신고 처리를 위한 개인정보 수집 및 이용에 동의합니다.
                  </span>
                </label>
                
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">[선택]</span> 처리 결과 알림 수신에 동의합니다.
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
                className="flex-1 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                신고 접수
              </button>
            </div>
          </div>
        </form>

        {/* 신고 처리 안내 */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            신고 처리 안내
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">처리 절차</h4>
              <ol className="text-blue-700 space-y-1">
                <li>1. 신고 접수 확인 (즉시)</li>
                <li>2. 내용 검토 및 조사 (1-3일)</li>
                <li>3. 조치 결정 및 실행 (1-2일)</li>
                <li>4. 결과 통보 (선택 시)</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">가능한 조치</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• 내용 삭제 또는 수정 요구</li>
                <li>• 사용자 경고 또는 정지</li>
                <li>• 계정 영구 차단</li>
                <li>• 관련 기관 신고</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-blue-700 text-xs">
              긴급하거나 심각한 사안의 경우 24시간 내 우선 처리됩니다. 
              문의사항이 있으시면 <Link href="/contact" className="underline hover:text-blue-800">고객센터</Link>로 연락해주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
import Link from 'next/link';
import { Heart, ArrowLeft, Shield, FileText, Clock, Mail } from 'lucide-react';

// 개인정보처리방침 페이지 컴포넌트
export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            개인정보처리방침
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium">시행일: 2024년 1월 1일</p>
                <p className="text-blue-700 text-sm">최종 수정일: 2024년 12월 1일</p>
              </div>
            </div>
          </div>
        </div>

        {/* 목차 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">목차</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <Link href="#section1" className="text-blue-600 hover:text-blue-800 py-1">1. 개인정보의 처리목적</Link>
            <Link href="#section2" className="text-blue-600 hover:text-blue-800 py-1">2. 처리하는 개인정보의 항목</Link>
            <Link href="#section3" className="text-blue-600 hover:text-blue-800 py-1">3. 개인정보의 처리 및 보유기간</Link>
            <Link href="#section4" className="text-blue-600 hover:text-blue-800 py-1">4. 개인정보의 제3자 제공</Link>
            <Link href="#section5" className="text-blue-600 hover:text-blue-800 py-1">5. 개인정보 처리의 위탁</Link>
            <Link href="#section6" className="text-blue-600 hover:text-blue-800 py-1">6. 정보주체의 권리·의무</Link>
            <Link href="#section7" className="text-blue-600 hover:text-blue-800 py-1">7. 개인정보의 파기</Link>
            <Link href="#section8" className="text-blue-600 hover:text-blue-800 py-1">8. 개인정보 보호책임자</Link>
          </div>
        </div>

        {/* 머리말 */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            Companion Animals(이하 "회사")는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관련 법령이 정한 바를 준수하여, 
            적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 
            절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
        </div>

        {/* 본문 */}
        <div className="space-y-8">
          {/* 1. 개인정보의 처리목적 */}
          <section id="section1" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 개인정보의 처리목적</h2>
            <p className="text-gray-700 mb-4">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">가. 회원가입 및 관리</h3>
                <p className="text-gray-700 text-sm">
                  회원가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 
                  서비스 부정 이용 방지, 각종 고지·통지, 고충 처리 등
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">나. 분양/입양 서비스 제공</h3>
                <p className="text-gray-700 text-sm">
                  분양동물 등록 및 관리, 입양신청 처리, 분양자-입양자 매칭, 계약 체결 및 이행, 
                  요금 정산, 서비스 제공에 관한 계약 이행 및 요금 정산 등
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">다. 커뮤니티 서비스 제공</h3>
                <p className="text-gray-700 text-sm">
                  게시글 작성 및 관리, 댓글 서비스, 신고 및 제재 처리, 커뮤니티 운영 등
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">라. 마케팅 및 광고에의 활용</h3>
                <p className="text-gray-700 text-sm">
                  신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 
                  인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 접속빈도 파악 등
                </p>
              </div>
            </div>
          </section>

          {/* 2. 처리하는 개인정보의 항목 */}
          <section id="section2" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 처리하는 개인정보의 항목</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">가. 회원가입</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">필수항목</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 이메일 주소</li>
                      <li>• 비밀번호</li>
                      <li>• 이름(닉네임)</li>
                      <li>• 휴대전화번호</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">선택항목</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 프로필 사진</li>
                      <li>• 주소</li>
                      <li>• 생년월일</li>
                      <li>• 성별</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">나. 입양/분양 서비스 이용</h3>
                <div className="text-sm">
                  <h4 className="font-medium text-gray-800 mb-2">수집항목</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• 거주지 정보 (주소, 주거형태)</li>
                    <li>• 반려동물 경험</li>
                    <li>• 입양 동기 및 계획</li>
                    <li>• 분양동물 정보 (사진, 품종, 나이, 건강상태 등)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">다. 자동 수집 정보</h3>
                <div className="text-sm">
                  <ul className="text-gray-700 space-y-1">
                    <li>• IP 주소, 접속 로그, 서비스 이용 기록</li>
                    <li>• 쿠키, 접속 환경 정보</li>
                    <li>• 기기 정보 (OS, 브라우저 종류 등)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 3. 개인정보의 처리 및 보유기간 */}
          <section id="section3" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 개인정보의 처리 및 보유기간</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left">처리목적</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">보유기간</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">법적 근거</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">회원가입 및 관리</td>
                    <td className="border border-gray-300 px-4 py-3">회원 탈퇴 시까지</td>
                    <td className="border border-gray-300 px-4 py-3">이용자 동의</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">입양/분양 서비스</td>
                    <td className="border border-gray-300 px-4 py-3">서비스 완료 후 3년</td>
                    <td className="border border-gray-300 px-4 py-3">계약 이행</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">부정 이용 방지</td>
                    <td className="border border-gray-300 px-4 py-3">1년</td>
                    <td className="border border-gray-300 px-4 py-3">정당한 이익</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">소비자 불만 처리</td>
                    <td className="border border-gray-300 px-4 py-3">3년</td>
                    <td className="border border-gray-300 px-4 py-3">소비자보호법</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. 개인정보의 제3자 제공 */}
          <section id="section4" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700 mb-4">
              회사는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="text-gray-700 space-y-2">
                <li>• 정보주체가 사전에 동의한 경우</li>
                <li>• 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                <li>• 입양/분양 서비스 제공을 위해 분양자와 입양자 간 연락처 공유가 필요한 경우 (사전 동의)</li>
              </ul>
            </div>
          </section>

          {/* 5. 개인정보 처리의 위탁 */}
          <section id="section5" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 개인정보 처리의 위탁</h2>
            <p className="text-gray-700 mb-4">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left">위탁받는 자</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">위탁하는 업무의 내용</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Amazon Web Services</td>
                    <td className="border border-gray-300 px-4 py-3">클라우드 서버 운영 및 데이터 보관</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">네이버클라우드플랫폼</td>
                    <td className="border border-gray-300 px-4 py-3">SMS/이메일 발송 서비스</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. 정보주체의 권리·의무 */}
          <section id="section6" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 정보주체의 권리·의무</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">정보주체의 권리</h3>
                <ul className="text-green-700 space-y-2">
                  <li>• 개인정보 처리현황 통지 요구</li>
                  <li>• 개인정보 열람 요구</li>
                  <li>• 개인정보 정정·삭제 요구</li>
                  <li>• 개인정보 처리정지 요구</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">권리 행사 방법</h3>
                <div className="text-blue-700 space-y-2">
                  <p>• 개인정보보호법 시행규칙 별지 제8호에 따라 서면, 전화, 전자우편 등을 통하여 하실 수 있습니다.</p>
                  <p>• 회사는 정보주체의 요구에 대해 지체 없이 조치하겠습니다.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. 개인정보의 파기 */}
          <section id="section7" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 개인정보의 파기</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">파기절차</h3>
                <p className="text-gray-700 text-sm mb-3">
                  개인정보는 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 
                  일정기간 저장된 후 파기됩니다.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">파기방법</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 전자적 파일: 기술적 방법을 사용하여 복구 및 재생이 불가능하도록 안전하게 삭제</li>
                  <li>• 종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각을 통하여 파기</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. 개인정보 보호책임자 */}
          <section id="section8" className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 개인정보 보호책임자</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">개인정보 보호책임자</h3>
                  <div className="text-gray-700 space-y-1 text-sm">
                    <p><span className="font-medium">성명:</span> 김개인정보</p>
                    <p><span className="font-medium">직책:</span> 개인정보보호팀장</p>
                    <p><span className="font-medium">연락처:</span> 02-1234-5678</p>
                    <p><span className="font-medium">이메일:</span> privacy@companionanimals.com</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">개인정보 보호담당자</h3>
                  <div className="text-gray-700 space-y-1 text-sm">
                    <p><span className="font-medium">성명:</span> 이담당자</p>
                    <p><span className="font-medium">직책:</span> 개인정보보호팀 대리</p>
                    <p><span className="font-medium">연락처:</span> 02-1234-5679</p>
                    <p><span className="font-medium">이메일:</span> privacy.manager@companionanimals.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 마무리 및 문의 */}
        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            개인정보처리방침 변경
          </h3>
          <div className="text-orange-700 text-sm space-y-2">
            <p>• 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
            <p>• 개인정보 처리와 관련하여 궁금한 사항이 있으시면 아래 연락처로 문의해주시기 바랍니다.</p>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              개인정보 관련 문의
            </Link>
            <Link
              href="/help"
              className="text-orange-700 hover:text-orange-800 px-6 py-3 rounded-lg font-medium text-center"
            >
              도움말 보기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
import Link from 'next/link';
import { Heart, ArrowLeft, FileText, Clock, Mail, AlertTriangle } from 'lucide-react';

// 이용약관 페이지 컴포넌트
export default function TermsPage() {
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
            <FileText className="h-8 w-8 text-green-500" />
            이용약관
          </h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">시행일: 2024년 1월 1일</p>
                <p className="text-green-700 text-sm">최종 수정일: 2024년 12월 1일</p>
              </div>
            </div>
          </div>
        </div>

        {/* 목차 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">목차</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <Link href="#article1" className="text-blue-600 hover:text-blue-800 py-1">제1조 (목적)</Link>
            <Link href="#article2" className="text-blue-600 hover:text-blue-800 py-1">제2조 (정의)</Link>
            <Link href="#article3" className="text-blue-600 hover:text-blue-800 py-1">제3조 (약관의 효력 및 변경)</Link>
            <Link href="#article4" className="text-blue-600 hover:text-blue-800 py-1">제4조 (서비스의 제공 및 변경)</Link>
            <Link href="#article5" className="text-blue-600 hover:text-blue-800 py-1">제5조 (회원가입)</Link>
            <Link href="#article6" className="text-blue-600 hover:text-blue-800 py-1">제6조 (회원의 의무)</Link>
            <Link href="#article7" className="text-blue-600 hover:text-blue-800 py-1">제7조 (서비스 이용)</Link>
            <Link href="#article8" className="text-blue-600 hover:text-blue-800 py-1">제8조 (입양/분양 서비스)</Link>
            <Link href="#article9" className="text-blue-600 hover:text-blue-800 py-1">제9조 (금지행위)</Link>
            <Link href="#article10" className="text-blue-600 hover:text-blue-800 py-1">제10조 (서비스 이용 제한)</Link>
            <Link href="#article11" className="text-blue-600 hover:text-blue-800 py-1">제11조 (손해배상)</Link>
            <Link href="#article12" className="text-blue-600 hover:text-blue-800 py-1">제12조 (면책조항)</Link>
          </div>
        </div>

        {/* 본문 */}
        <div className="space-y-8">
          {/* 제1조 목적 */}
          <article id="article1" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              이 약관은 Companion Animals(이하 "회사")가 제공하는 반려동물 분양 및 입양 중개 서비스(이하 "서비스")의 
              이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </article>

          {/* 제2조 정의 */}
          <article id="article2" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (정의)</h2>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <ol className="text-gray-700 space-y-2">
                  <li><span className="font-semibold">① "서비스"</span>란 회사가 제공하는 반려동물 분양 및 입양 중개 플랫폼 서비스를 의미합니다.</li>
                  <li><span className="font-semibold">② "회원"</span>이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 의미합니다.</li>
                  <li><span className="font-semibold">③ "분양자"</span>란 반려동물을 분양하고자 하는 회원을 의미합니다.</li>
                  <li><span className="font-semibold">④ "입양자"</span>란 반려동물을 입양하고자 하는 회원을 의미합니다.</li>
                  <li><span className="font-semibold">⑤ "이용자"</span>란 회원과 비회원을 포함하여 서비스에 접속하여 이용하는 모든 자를 의미합니다.</li>
                </ol>
              </div>
            </div>
          </article>

          {/* 제3조 약관의 효력 및 변경 */}
          <article id="article3" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">① 효력 발생</span></p>
                <p className="text-gray-600 text-sm">
                  이 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">② 약관의 변경</span></p>
                <p className="text-gray-600 text-sm">
                  회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 시행일자 7일 전부터 공지합니다. 
                  중요한 변경사항의 경우 30일 전에 공지하며, 회원에게 불리한 변경의 경우 개별 통지합니다.
                </p>
              </div>
            </div>
          </article>

          {/* 제4조 서비스의 제공 및 변경 */}
          <article id="article4" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">회사가 제공하는 서비스</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• 반려동물 분양 정보 등록 및 조회 서비스</li>
                  <li>• 입양 신청 및 매칭 서비스</li>
                  <li>• 회원 간 커뮤니케이션 및 커뮤니티 서비스</li>
                  <li>• 반려동물 관련 정보 제공 서비스</li>
                  <li>• 기타 회사가 추가 개발하거나 다른 회사와의 제휴를 통해 제공하는 서비스</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm">
                  회사는 서비스의 품질 향상을 위해 서비스 내용을 변경할 수 있으며, 
                  중요한 변경사항은 사전에 공지합니다.
                </p>
              </div>
            </div>
          </article>

          {/* 제5조 회원가입 */}
          <article id="article5" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (회원가입)</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">① 가입 신청</span></p>
                <p className="text-gray-600 text-sm">
                  회원가입은 이용자가 약관에 동의하고 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 
                  가입 신청을 하면 회사가 이를 승낙함으로써 체결됩니다.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">② 가입 승낙의 제한</span></p>
                <p className="text-gray-600 text-sm">
                  회사는 다음 각 호에 해당하는 경우 가입 신청을 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다:
                </p>
                <ul className="text-gray-600 text-sm mt-2 space-y-1">
                  <li>• 타인의 명의를 이용하여 신청한 경우</li>
                  <li>• 허위 정보를 기재하거나 회사가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>• 만 14세 미만인자가 법정대리인의 동의를 얻지 않은 경우</li>
                  <li>• 이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반한 경우</li>
                </ul>
              </div>
            </div>
          </article>

          {/* 제6조 회원의 의무 */}
          <article id="article6" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (회원의 의무)</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-3">회원은 다음 사항을 준수해야 합니다</h3>
              <ul className="text-orange-700 text-sm space-y-2">
                <li>• 회원정보 변경 시 즉시 수정</li>
                <li>• 아이디와 비밀번호 관리 책임</li>
                <li>• 타인에게 아이디를 양도하거나 대여하지 않을 것</li>
                <li>• 회사와 다른 회원, 제3자의 권리를 침해하지 않을 것</li>
                <li>• 관련 법령과 약관을 준수할 것</li>
                <li>• 반려동물의 복지와 생명을 최우선으로 고려할 것</li>
              </ul>
            </div>
          </article>

          {/* 제7조 서비스 이용 */}
          <article id="article7" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (서비스 이용)</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">① 이용시간</span></p>
                <p className="text-gray-600 text-sm">
                  서비스 이용은 연중무휴, 1일 24시간을 원칙으로 합니다. 
                  단, 시스템 정기점검, 증설 및 교체 등 부득이한 경우는 예외로 합니다.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">② 서비스 중단</span></p>
                <p className="text-gray-600 text-sm">
                  회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 
                  서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
              </div>
            </div>
          </article>

          {/* 제8조 입양/분양 서비스 */}
          <article id="article8" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 (입양/분양 서비스)</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">분양자의 의무</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• 분양동물에 대한 정확하고 상세한 정보 제공</li>
                  <li>• 동물의 건강상태 및 예방접종 기록 제공</li>
                  <li>• 입양자와의 약속 준수</li>
                  <li>• 분양 후 일정 기간 동안의 상담 지원</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">입양자의 의무</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 입양 신청 시 정확한 정보 제공</li>
                  <li>• 동물에 대한 평생 책임과 사랑으로 돌봄</li>
                  <li>• 동물 학대 금지 및 적절한 사육환경 제공</li>
                  <li>• 필요시 수의학적 치료 제공</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">중개 서비스 한계</h3>
                <p className="text-yellow-700 text-sm">
                  회사는 분양자와 입양자를 연결하는 중개 역할만을 수행하며, 
                  실제 분양계약의 당사자는 분양자와 입양자입니다.
                </p>
              </div>
            </div>
          </article>

          {/* 제9조 금지행위 */}
          <article id="article9" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제9조 (금지행위)</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                회원은 다음 행위를 하여서는 안 됩니다
              </h3>
              <ul className="text-red-700 text-sm space-y-2">
                <li>• 타인의 정보 도용 또는 허위 정보 등록</li>
                <li>• 동물 학대, 불법 판매, 번식업 등 비윤리적 행위</li>
                <li>• 욕설, 비방, 차별적 언어 사용</li>
                <li>• 음란물, 폭력적 콘텐츠 게시</li>
                <li>• 영리 목적의 광고나 스팸 활동</li>
                <li>• 서비스의 안정적 운영을 방해하는 행위</li>
                <li>• 타인의 개인정보 수집, 저장, 공개</li>
                <li>• 법령을 위반하는 행위</li>
              </ul>
            </div>
          </article>

          {/* 제10조 서비스 이용 제한 */}
          <article id="article10" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제10조 (서비스 이용 제한)</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">① 이용 제한 사유</span></p>
                <p className="text-gray-600 text-sm mb-2">
                  회사는 회원이 제9조의 금지행위를 하거나 다음 각 호에 해당하는 경우 
                  사전 통지 없이 서비스 이용을 제한하거나 회원자격을 정지 또는 상실시킬 수 있습니다:
                </p>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• 공공질서 및 미풍양속에 위반되는 내용을 유포한 경우</li>
                  <li>• 범죄적 행위에 관련되는 경우</li>
                  <li>• 회사, 다른 회원 또는 제3자의 저작권 등 지적재산권을 침해한 경우</li>
                  <li>• 기타 관계 법령에 위배되는 경우</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><span className="font-semibold">② 이용 제한의 해제</span></p>
                <p className="text-gray-600 text-sm">
                  회사는 이용 제한의 사유가 해소된 것을 확인한 경우에 한하여 이용 제한을 해제할 수 있습니다.
                </p>
              </div>
            </div>
          </article>

          {/* 제11조 손해배상 */}
          <article id="article11" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제11조 (손해배상)</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                회사 또는 회원은 서비스 이용과 관련하여 고의 또는 중대한 과실로 상대방에게 손해를 끼친 경우, 
                그 손해를 배상할 책임이 있습니다. 단, 회사는 천재지변 등 불가항력적 사유로 인한 서비스 중단에 대해서는 
                책임을 지지 않습니다.
              </p>
            </div>
          </article>

          {/* 제12조 면책조항 */}
          <article id="article12" className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제12조 (면책조항)</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">회사의 면책사항</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• 분양자와 입양자 간의 직접적인 거래에서 발생하는 분쟁</li>
                  <li>• 회원이 게시한 정보, 자료, 사실의 신뢰도나 정확성</li>
                  <li>• 회원 상호간 또는 회원과 제3자 간에 발생한 분쟁</li>
                  <li>• 무료로 제공하는 서비스 이용과 관련하여 발생한 손해</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  회사는 중개 플랫폼 서비스만을 제공하며, 실제 분양계약의 이행에 대한 책임은 
                  분양자와 입양자에게 있습니다.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* 부칙 및 문의 */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            부칙
          </h3>
          <div className="text-green-700 text-sm space-y-2 mb-4">
            <p>• 이 약관은 2024년 1월 1일부터 시행됩니다.</p>
            <p>• 본 약관에 관하여 궁금한 사항이 있으시면 아래 연락처로 문의해주시기 바랍니다.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              약관 관련 문의
            </Link>
            <Link
              href="/help"
              className="text-green-700 hover:text-green-800 px-6 py-3 rounded-lg font-medium text-center"
            >
              도움말 보기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
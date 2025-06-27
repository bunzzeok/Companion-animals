import Link from 'next/link';
import { Heart, ArrowLeft, Search, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, HelpCircle, Book, Users, Shield } from 'lucide-react';

// 도움말 페이지 컴포넌트
export default function HelpPage() {
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 페이지 제목 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">도움말</h1>
              <p className="text-gray-600">
                Companion Animals 사용법과 자주 묻는 질문들을 확인해보세요
              </p>
            </div>

            {/* 검색바 */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="궁금한 내용을 검색해보세요..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* 주요 카테고리 */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: <Users className="h-8 w-8 text-blue-500" />,
                  title: "입양하기",
                  description: "입양 신청부터 완료까지의 전체 과정",
                  items: ["입양 신청 방법", "필요 서류", "심사 과정", "입양 후 관리"]
                },
                {
                  icon: <Heart className="h-8 w-8 text-pink-500" />,
                  title: "분양하기",
                  description: "분양 등록과 관리 방법",
                  items: ["분양 등록", "사진 촬영 팁", "분양자 매칭", "안전한 만남"]
                },
                {
                  icon: <MessageCircle className="h-8 w-8 text-green-500" />,
                  title: "커뮤니티",
                  description: "커뮤니티 이용 가이드",
                  items: ["게시글 작성", "댓글 규칙", "신고 기능", "등급 시스템"]
                },
                {
                  icon: <Shield className="h-8 w-8 text-purple-500" />,
                  title: "안전 가이드",
                  description: "안전한 거래를 위한 가이드",
                  items: ["사기 예방", "안전한 만남", "신고하기", "개인정보 보호"]
                }
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-50 rounded-full p-3">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 cursor-pointer">
                        <ChevronRight className="h-3 w-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* 자주 묻는 질문 */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-orange-500" />
                자주 묻는 질문
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    category: "입양",
                    question: "입양 신청 후 얼마나 기다려야 하나요?",
                    answer: "입양 신청서 검토는 보통 1-2일 정도 소요됩니다. 서류 검토 후 분양자와의 상담이 진행되며, 전체 과정은 평균 1주일 정도 걸립니다."
                  },
                  {
                    category: "분양",
                    question: "분양 등록은 무료인가요?",
                    answer: "네, 분양 등록은 완전 무료입니다. 다만 성공적인 분양을 위해 정확한 정보 입력과 좋은 품질의 사진 업로드를 권장합니다."
                  },
                  {
                    category: "안전",
                    question: "만남 시 주의사항이 있나요?",
                    answer: "첫 만남은 공공장소에서 하시길 권장하며, 가능하면 동반자와 함께 방문하세요. 동물의 건강상태를 직접 확인하고, 필요한 서류들을 준비해가세요."
                  },
                  {
                    category: "기술",
                    question: "앱에서 로그인이 안 됩니다.",
                    answer: "비밀번호를 재설정하거나 앱을 재시작해보세요. 문제가 지속되면 고객센터로 연락주시면 도움을 드리겠습니다."
                  },
                  {
                    category: "커뮤니티",
                    question: "게시글이 삭제된 이유를 알고 싶어요.",
                    answer: "커뮤니티 가이드라인 위반 시 게시글이 삭제될 수 있습니다. 구체적인 사유는 등록하신 이메일로 안내드립니다."
                  },
                  {
                    category: "정책",
                    question: "개인정보는 어떻게 보호되나요?",
                    answer: "저희는 개인정보보호법에 따라 개인정보를 안전하게 관리합니다. 입양 목적 외의 용도로는 절대 사용하지 않습니다."
                  }
                ].map((faq, index) => (
                  <details key={index} className="group border border-gray-200 rounded-lg">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          faq.category === '입양' ? 'bg-blue-100 text-blue-700' :
                          faq.category === '분양' ? 'bg-green-100 text-green-700' :
                          faq.category === '안전' ? 'bg-red-100 text-red-700' :
                          faq.category === '기술' ? 'bg-purple-100 text-purple-700' :
                          faq.category === '커뮤니티' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {faq.category}
                        </span>
                        <span className="font-medium text-gray-900">{faq.question}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* 가이드 문서 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Book className="h-6 w-6 text-orange-500" />
                가이드 문서
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "입양 가이드",
                    description: "처음 입양하시는 분들을 위한 상세 가이드",
                    link: "/guide/adoption"
                  },
                  {
                    title: "분양자 매뉴얼",
                    description: "효과적인 분양을 위한 팁과 노하우",
                    link: "/guide/rehoming"
                  },
                  {
                    title: "커뮤니티 규칙",
                    description: "건전한 커뮤니티를 위한 이용 규칙",
                    link: "/guide/community"
                  },
                  {
                    title: "안전 수칙",
                    description: "안전한 거래를 위한 필수 확인사항",
                    link: "/guide/safety"
                  }
                ].map((guide, index) => (
                  <Link
                    key={index}
                    href={guide.link}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{guide.title}</h3>
                    <p className="text-gray-600 text-sm">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 연락처 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">문제 해결이 안 되시나요?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  원하는 답을 찾지 못하셨다면 직접 문의해주세요
                </p>
                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    1:1 문의하기
                  </Link>
                  <div className="text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Phone className="h-3 w-3" />
                      02-1234-5678
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Mail className="h-3 w-3" />
                      help@companionanimals.com
                    </div>
                  </div>
                </div>
              </div>

              {/* 인기 검색어 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">인기 검색어</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    '입양 절차',
                    '분양 등록',
                    '로그인 문제',
                    '계정 탈퇴',
                    '사진 업로드',
                    '커뮤니티 규칙',
                    '신고하기',
                    '환불 정책'
                  ].map((keyword, index) => (
                    <button
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* 최근 업데이트 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">최근 업데이트</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">v2.1.0 업데이트</div>
                    <div className="text-gray-500 text-xs">2024.12.15</div>
                    <div className="text-gray-600 mt-1">채팅 기능 개선</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">커뮤니티 가이드라인 개정</div>
                    <div className="text-gray-500 text-xs">2024.12.10</div>
                    <div className="text-gray-600 mt-1">더 명확한 규칙 적용</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">보안 강화</div>
                    <div className="text-gray-500 text-xs">2024.12.05</div>
                    <div className="text-gray-600 mt-1">개인정보 보호 강화</div>
                  </div>
                </div>
              </div>

              {/* 유용한 링크 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">유용한 링크</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/terms" className="block text-gray-600 hover:text-orange-500 py-1">
                    이용약관
                  </Link>
                  <Link href="/privacy" className="block text-gray-600 hover:text-orange-500 py-1">
                    개인정보처리방침
                  </Link>
                  <Link href="/about" className="block text-gray-600 hover:text-orange-500 py-1">
                    회사소개
                  </Link>
                  <Link href="/community" className="block text-gray-600 hover:text-orange-500 py-1">
                    커뮤니티
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import Link from 'next/link';
import { Heart, ArrowLeft, Plus, MessageCircle, ThumbsUp, Eye, Clock, Pin, Star, Users } from 'lucide-react';

// 커뮤니티 페이지 컴포넌트
export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
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

            {/* 글쓰기 버튼 */}
            <Link
              href="/community/write"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              글쓰기
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
              <p className="text-gray-600">
                반려동물과 함께하는 일상을 나누고, 서로 도움을 주고받아요
              </p>
            </div>

            {/* 카테고리 탭 */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: '전체', active: true, count: 1234 },
                  { name: '입양후기', active: false, count: 256 },
                  { name: '돌봄팁', active: false, count: 189 },
                  { name: '질문답변', active: false, count: 345 },
                  { name: '나눔', active: false, count: 67 },
                  { name: '실종신고', active: false, count: 23 },
                  { name: '자유게시', active: false, count: 354 }
                ].map((category, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      category.active
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                    <span className="ml-1 text-xs opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 공지사항 */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Pin className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">공지사항</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                커뮤니티 이용 규칙 및 가이드라인
              </h3>
              <p className="text-sm text-gray-600">
                건전한 커뮤니티 문화를 위해 꼭 읽어주세요
              </p>
            </div>

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {/* 추천 게시글 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                    추천글
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    입양후기
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-500 cursor-pointer">
                  3개월 전 입양한 삼색이가 이렇게 변했어요! 🐱
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  길고양이였던 삼색이를 데려온지 벌써 3개월이 되었어요. 처음엔 경계심이 많았는데 이제는 완전히 가족이 되었답니다. 사진으로 변화과정을 공유할게요...
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700">고양이집사</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>2시간 전</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>1,234</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>89</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>45</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 일반 게시글들 */}
              {[
                {
                  category: '질문답변',
                  title: '고양이가 밥을 안 먹어요 ㅠㅠ 어떻게 해야 할까요?',
                  content: '2살 고양이를 키우고 있는데 갑자기 밥을 안 먹기 시작했어요. 평소 잘 먹던 사료도 거부하고... 혹시 경험 있으신 분 계신가요?',
                  author: '초보집사',
                  time: '1시간 전',
                  views: 456,
                  likes: 12,
                  comments: 23,
                  isUrgent: true
                },
                {
                  category: '돌봄팁',
                  title: '강아지 털 빠짐 관리하는 꿀팁 공유해요',
                  content: '우리 집 골든리트리버 털 빠짐이 너무 심해서 여러 방법을 시도해봤는데, 이 방법이 가장 효과적이었어요. 같은 고민 있으신 분들께 도움이 되길...',
                  author: '골든맘',
                  time: '3시간 전',
                  views: 789,
                  likes: 34,
                  comments: 18,
                  isUrgent: false
                },
                {
                  category: '나눔',
                  title: '[나눔] 고양이 사료 나눔해요 (유통기한 충분)',
                  content: '고양이가 특정 사료를 안 먹어서 나눔해요. 유통기한 충분하고 개봉 안 한 상태입니다. 서울 강남구 픽업 가능하신 분만...',
                  author: '나눔천사',
                  time: '5시간 전',
                  views: 234,
                  likes: 8,
                  comments: 15,
                  isUrgent: false
                },
                {
                  category: '실종신고',
                  title: '🚨 [실종] 서울 마포구 신촌동 고양이 실종신고',
                  content: '오늘 오전 산책 중 목줄이 풀려서 도망갔어요. 턱시도 고양이이고 목에 파란색 목걸이를 하고 있습니다. 보신 분은 연락 부탁드려요.',
                  author: '걱정하는집사',
                  time: '8시간 전',
                  views: 1567,
                  likes: 45,
                  comments: 67,
                  isUrgent: true
                },
                {
                  category: '자유게시',
                  title: '우리 강아지 생일파티 했어요 🎉',
                  content: '3살 생일을 맞은 우리 포메라니안 뽀미를 위해 조촐한 생일파티를 열었어요. 강아지용 케이크도 만들어주고 선물도 준비했답니다.',
                  author: '뽀미아빠',
                  time: '12시간 전',
                  views: 567,
                  likes: 78,
                  comments: 32,
                  isUrgent: false
                },
                {
                  category: '입양후기',
                  title: '시골 할머니 집에서 구조한 강아지 근황',
                  content: '작년에 할머니 집에서 구조한 믹스견이 이제 완전히 건강해졌어요. 처음엔 사람을 무서워했는데 지금은 애교쟁이가 되었답니다.',
                  author: '구조천사',
                  time: '1일 전',
                  views: 892,
                  likes: 156,
                  comments: 89,
                  isUrgent: false
                }
              ].map((post, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      post.category === '실종신고' ? 'bg-red-100 text-red-700' :
                      post.category === '나눔' ? 'bg-green-100 text-green-700' :
                      post.category === '질문답변' ? 'bg-blue-100 text-blue-700' :
                      post.category === '돌봄팁' ? 'bg-purple-100 text-purple-700' :
                      post.category === '입양후기' ? 'bg-pink-100 text-pink-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.category}
                    </span>
                    {post.isUrgent && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium">
                        긴급
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-500">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-700">{post.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center mt-8">
              <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                더 많은 게시글 보기
              </button>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 인기 게시글 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  인기 게시글
                </h3>
                <div className="space-y-3">
                  {[
                    '강아지 훈련 꿀팁 10가지',
                    '고양이 건강 체크 방법',
                    '입양 전 준비물 리스트',
                    '응급상황 대처법',
                    '반려동물 보험 비교'
                  ].map((title, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 hover:text-orange-500 cursor-pointer leading-tight">
                        {title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 커뮤니티 통계 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  커뮤니티 현황
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">전체 회원</span>
                    <span className="font-semibold text-gray-900">12,345명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">오늘 방문</span>
                    <span className="font-semibold text-gray-900">1,234명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">전체 게시글</span>
                    <span className="font-semibold text-gray-900">5,678개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">오늘 게시글</span>
                    <span className="font-semibold text-gray-900">89개</span>
                  </div>
                </div>
              </div>

              {/* 빠른 링크 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">빠른 링크</h3>
                <div className="space-y-2">
                  <Link href="/pets" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    분양동물 보기
                  </Link>
                  <Link href="/adoption" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    입양 신청하기
                  </Link>
                  <Link href="/help" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    도움말
                  </Link>
                  <Link href="/contact" className="block text-sm text-gray-600 hover:text-orange-500 py-1">
                    문의하기
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
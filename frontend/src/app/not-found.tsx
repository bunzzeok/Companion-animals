'use client'

import Link from 'next/link';
import { useCallback } from 'react';
import { Home, ArrowLeft, Heart, Search } from 'lucide-react';

// 404 페이지 컴포넌트 - 당근마켓 스타일
export default function NotFound() {
  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold text-gray-900">Companion Animals</span>
              </Link>
            </div>
            
            {/* 홈으로 버튼 */}
            <Link 
              href="/" 
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 404 컨텐츠 */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full text-center">
          {/* 404 일러스트 */}
          <div className="mb-8">
            <div className="bg-orange-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <div className="text-6xl">🐾</div>
            </div>
            <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              페이지를 찾을 수 없어요
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              요청하신 페이지가 존재하지 않거나 
              <br />
              이동되었을 수 있습니다.
            </p>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="w-full bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <Home className="h-5 w-5" />
              홈으로 돌아가기
            </Link>
            
            <Link 
              href="/pets" 
              className="w-full bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              분양동물 보기
            </Link>
            
            <button 
              onClick={handleGoBack}
              className="w-full text-gray-500 hover:text-gray-700 px-8 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              이전 페이지로
            </button>
          </div>

          {/* 도움말 링크 */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">
              문제가 계속 발생한다면
            </p>
            <Link 
              href="/contact" 
              className="text-orange-500 hover:text-orange-600 font-medium text-sm"
            >
              고객센터에 문의해주세요
            </Link>
          </div>
        </div>
      </main>

      {/* 푸터 - 간단 버전 */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Heart className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-gray-700">Companion Animals</span>
          </div>
          <p className="text-gray-500 text-sm">
            길잃은 동물들이 따뜻한 가정을 찾을 수 있도록 돕는 플랫폼
          </p>
        </div>
      </footer>
    </div>
  );
}
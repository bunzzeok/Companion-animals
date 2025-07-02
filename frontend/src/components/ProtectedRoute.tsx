'use client'

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Heart } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireLogin?: boolean;
  showModal?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireLogin = true, 
  showModal = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  useEffect(() => {
    if (!isLoading && requireLogin) {
      if (!isAuthenticated) {
        if (showModal) {
          setShowLoginModal(true);
        } else {
          router.push(redirectTo);
        }
      }
    }
  }, [isAuthenticated, isLoading, requireLogin, showModal, redirectTo, router]);

  // 로딩 중일 때 표시할 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인이 필요하지만 인증되지 않은 경우
  if (requireLogin && !isAuthenticated) {
    if (showModal && showLoginModal) {
      return (
        <>
          {children}
          <LoginModal onClose={handleCloseModal} />
        </>
      );
    }
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return <>{children}</>;
}

// 로그인 모달 컴포넌트
function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleLoginClick = useCallback(() => {
    onClose();
    router.push('/login');
  }, [onClose, router]);

  const handleRegisterClick = useCallback(() => {
    onClose();
    router.push('/register');
  }, [onClose, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 m-4 max-w-md w-full">
        <div className="text-center">
          <Heart className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 mb-6">
            이 기능을 사용하려면 먼저 로그인해주세요.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full py-4 px-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              로그인하기
            </button>
            <button
              onClick={handleRegisterClick}
              className="w-full py-4 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              회원가입하기
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
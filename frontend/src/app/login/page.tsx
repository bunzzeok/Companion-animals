'use client'

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// 로그인 페이지 컴포넌트 - 당근마켓 스타일
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔄 로그인 시도:', { email: formData.email });
      
      // useAuth 훅의 login 함수 사용
      const result = await login(formData.email, formData.password);

      if (result.success) {
        console.log('✅ 로그인 성공:', result.data);
        // 로그인 성공 후 메인 페이지로 리다이렉트
        router.push('/');
      } else {
        console.error('❌ 로그인 실패:', result.error);
        setErrors({ general: result.error || '로그인에 실패했습니다.' });
      }
      
    } catch (error: any) {
      console.error('❌ 로그인 에러:', error);
      setErrors({ general: '로그인 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Heart className="h-10 w-10 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Companion Animals</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            로그인
          </h2>
          <p className="text-gray-600">
            반려동물과의 만남이 기다리고 있어요
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 일반 에러 메시지 */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-4 text-base text-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors touch-manipulation placeholder-gray-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="이메일을 입력하세요"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-12 py-4 text-base text-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors touch-manipulation placeholder-gray-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center min-h-[44px] min-w-[44px] justify-center touch-manipulation"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 기억하기 & 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-500 focus:ring-orange-500 focus:ring-1 border-gray-300 rounded touch-manipulation"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer select-none">
                  로그인 상태 유지
                </label>
              </div>
              <Link 
                href="/forgot-password" 
                className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-medium whitespace-nowrap"
              >
                비밀번호 찾기
              </Link>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-4 rounded-xl font-semibold text-base text-white transition-all touch-manipulation min-h-[48px] ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                '로그인'
              )}
            </button>
          </form>

        </div>

        {/* 회원가입 링크 */}
        <div className="text-center">
          <p className="text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link 
              href="/register" 
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              회원가입하기
            </Link>
          </p>
        </div>

        {/* 고객센터 링크 */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            로그인에 문제가 있으신가요?{' '}
            <Link 
              href="/help" 
              className="text-orange-500 hover:text-orange-600"
            >
              고객센터
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
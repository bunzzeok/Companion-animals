'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, apiUtils } from '../lib/api';

interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  userType: 'adopter' | 'provider';
  profileImage?: string;
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  token: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    token: null,
  });

  // 로컬스토리지에서 인증 정보 로드 및 토큰 검증
  useEffect(() => {
    const validateAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('user');
        
        console.log('🔍 Auth validation - Token:', !!token);
        console.log('🔍 Auth validation - UserJson:', userJson);
        
        if (token && userJson) {
          try {
            const user = JSON.parse(userJson);
            console.log('🔍 Auth validation - Parsed user:', user);
            console.log('🔍 Auth validation - User name:', user?.name);
            
            // 서버에서 토큰 유효성 검증
            try {
              const response = await authAPI.getMe();
              
              if (apiUtils.isSuccess(response)) {
                const responseData = apiUtils.getData(response);
                console.log('🔍 Auth validation - Server response data:', responseData);
                
                // 사용자 데이터가 data.user에 중첩되어 있는지 확인
                const currentUser = responseData?.user || responseData;
                console.log('🔍 Auth validation - Extracted user:', currentUser);
                console.log('🔍 Auth validation - User name:', currentUser?.name);
                
                // 최신 사용자 정보로 업데이트
                if (typeof window !== 'undefined') {
                  localStorage.setItem('user', JSON.stringify(currentUser));
                }
                
                setAuthState({
                  isAuthenticated: true,
                  user: currentUser,
                  isLoading: false,
                  token,
                });
              } else {
                // 토큰이 유효하지 않음
                logout();
              }
            } catch (error) {
              console.error('Token validation failed:', error);
              console.log('🔍 Using local user data:', user);
              // 토큰 검증 실패 시 로컬 데이터로 일단 설정 (오프라인 상황 고려)
              setAuthState({
                isAuthenticated: true,
                user,
                isLoading: false,
                token,
              });
            }
          } catch (error) {
            console.error('Failed to parse user data:', error);
            logout();
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };
    
    validateAuth();
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      console.log('🔐 Raw API response:', response);
      
      // 직접 response.data에서 추출 (apiUtils 없이)
      if (response.data?.success) {
        const { token, user } = response.data.data;
        
        console.log('🔐 Login success - Raw data:', response.data.data);
        console.log('🔐 Login success - User data:', user);
        console.log('🔐 Login success - User name:', user?.name);

        // 로컬스토리지에 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
        }

        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          token,
        });

        return { success: true, data: user };
      } else {
        return { 
          success: false, 
          error: response.data?.message || '로그인에 실패했습니다.' 
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: apiUtils.getErrorMessage(error)
      };
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 로컬 데이터 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        token: null,
      });

      router.push('/login');
    }
  };

  // 회원가입 함수
  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    userType: 'adopter' | 'provider';
  }) => {
    try {
      const response = await authAPI.register(userData);
      
      if (apiUtils.isSuccess(response)) {
        return { success: true, data: apiUtils.getData(response) };
      } else {
        return { 
          success: false, 
          error: response.data?.message || '회원가입에 실패했습니다.' 
        };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: apiUtils.getErrorMessage(error)
      };
    }
  };

  // 사용자 정보 업데이트
  const updateUser = (updatedUser: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  // 로그인 요구 함수 (페이지 보호용)
  const requireAuth = () => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  // 프로필 업데이트 함수
  const updateProfile = async (profileData: FormData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (apiUtils.isSuccess(response)) {
        const updatedUser = apiUtils.getData(response);
        updateUser(updatedUser);
        return { success: true, data: updatedUser };
      } else {
        return { 
          success: false, 
          error: response.data?.message || '프로필 업데이트에 실패했습니다.' 
        };
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: apiUtils.getErrorMessage(error)
      };
    }
  };

  // 현재 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      
      if (apiUtils.isSuccess(response)) {
        const currentUser = apiUtils.getData(response);
        updateUser(currentUser);
        return { success: true, data: currentUser };
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
    return { success: false };
  };

  return {
    ...authState,
    login,
    logout,
    register,
    updateUser,
    updateProfile,
    refreshUser,
    requireAuth,
  };
};
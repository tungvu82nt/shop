/**
 * YAPEE VIETNAM CLONE - USE AUTH HOOK
 * 
 * Custom hook để quản lý authentication state và actions
 * Tích hợp với AuthService và Supabase
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, type SignInData, type SignUpData } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  register: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Khởi tạo auth state từ Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setState({
          user: session?.user || null,
          isLoading: false,
          isAuthenticated: !!session?.user
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    };

    initializeAuth();

    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState({
          user: session?.user || null,
          isLoading: false,
          isAuthenticated: !!session?.user
        });

        if (event === 'SIGNED_IN') {
          toast.success('Đăng nhập thành công!');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Đăng xuất thành công!');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Đăng nhập
  const login = useCallback(async (data: SignInData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await authService.signIn(data);
      
      if (result.success) {
        // Navigation sẽ được xử lý bởi onAuthStateChange
        return { success: true };
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Đăng ký
  const register = useCallback(async (data: SignUpData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await authService.signUp(data);
      
      if (result.success) {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        return { success: true };
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Đăng xuất
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Có lỗi xảy ra khi đăng xuất');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [navigate]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser
  };
};

export default useAuth;
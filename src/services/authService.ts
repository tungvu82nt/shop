/**
 * YAPEE VIETNAM CLONE - AUTHENTICATION SERVICE
 * 
 * Service này quản lý tất cả các chức năng authentication
 * sử dụng Supabase Auth với các tính năng mở rộng
 */

import { supabase } from '@/lib/supabase';
import { User, AuthError } from '@supabase/supabase-js';
import { securityService } from './securityService';
import { emailService } from './emailService';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'customer' | 'seller' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface SignInData {
  email: string;
  password: string;
  remember_me?: boolean;
}

class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 phút

  /**
   * Đăng ký tài khoản mới
   */
  async signUp(userData: SignUpData): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // Validate input
      const validation = this.validateSignUpData(userData);
      if (!validation.isValid) {
        return { user: null, error: validation.error };
      }

      // Kiểm tra email đã tồn tại chưa
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return { user: null, error: 'Email đã được sử dụng' };
      }

      // Hash password
      const passwordHash = await securityService.hashPassword(userData.password);

      // Tạo user trong Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      // Tạo user profile trong database
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: userData.email,
          password_hash: passwordHash,
          full_name: userData.full_name,
          phone: userData.phone,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          role: 'customer',
          status: 'pending_verification'
        })
        .select()
        .single();

      if (profileError) {
        // Rollback auth user nếu tạo profile thất bại
        await supabase.auth.admin.deleteUser(authData.user?.id || '');
        return { user: null, error: 'Lỗi tạo profile người dùng' };
      }

      // Gửi email xác thực
      await this.sendVerificationEmail(userData.email);

      return { user: userProfile as AuthUser, error: null };

    } catch (error) {
      console.error('SignUp error:', error);
      return { user: null, error: 'Lỗi hệ thống, vui lòng thử lại' };
    }
  }

  /**
   * Đăng nhập
   */
  async signIn(credentials: SignInData): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // Kiểm tra rate limiting
      const rateLimitCheck = await this.checkRateLimit(credentials.email);
      if (!rateLimitCheck.allowed) {
        return { user: null, error: rateLimitCheck.error };
      }

      // Đăng nhập với Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) {
        // Tăng số lần đăng nhập thất bại
        await this.incrementLoginAttempts(credentials.email);
        return { user: null, error: 'Email hoặc mật khẩu không đúng' };
      }

      // Lấy user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user?.id)
        .single();

      if (profileError || !userProfile) {
        return { user: null, error: 'Không tìm thấy thông tin người dùng' };
      }

      // Kiểm tra trạng thái tài khoản
      if (userProfile.status === 'suspended') {
        await supabase.auth.signOut();
        return { user: null, error: 'Tài khoản đã bị tạm khóa' };
      }

      if (userProfile.status === 'inactive') {
        await supabase.auth.signOut();
        return { user: null, error: 'Tài khoản chưa được kích hoạt' };
      }

      // Reset login attempts và cập nhật last_login
      await this.resetLoginAttempts(credentials.email);
      await this.updateLastLogin(userProfile.id);

      return { user: userProfile as AuthUser, error: null };

    } catch (error) {
      console.error('SignIn error:', error);
      return { user: null, error: 'Lỗi hệ thống, vui lòng thử lại' };
    }
  }

  /**
   * Đăng xuất
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error: 'Lỗi đăng xuất' };
    }
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      return userProfile as AuthUser;
    } catch (error) {
      console.error('GetCurrentUser error:', error);
      return null;
    }
  }

  /**
   * Gửi email reset password
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('ResetPassword error:', error);
      return { error: 'Lỗi gửi email reset password' };
    }
  }

  /**
   * Cập nhật mật khẩu mới
   */
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { error: error.message };
      }

      // Cập nhật password hash trong database
      const user = await this.getCurrentUser();
      if (user) {
        const passwordHash = await securityService.hashPassword(newPassword);
        await supabase
          .from('users')
          .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }

      return { error: null };
    } catch (error) {
      console.error('UpdatePassword error:', error);
      return { error: 'Lỗi cập nhật mật khẩu' };
    }
  }

  /**
   * Gửi email xác thực
   */
  async sendVerificationEmail(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('SendVerificationEmail error:', error);
      return { error: 'Lỗi gửi email xác thực' };
    }
  }

  /**
   * Xác thực email
   */
  async verifyEmail(token: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        return { error: error.message };
      }

      // Cập nhật trạng thái email_verified
      const user = await this.getCurrentUser();
      if (user) {
        await supabase
          .from('users')
          .update({ 
            email_verified: true, 
            status: 'active',
            updated_at: new Date().toISOString() 
          })
          .eq('id', user.id);
      }

      return { error: null };
    } catch (error) {
      console.error('VerifyEmail error:', error);
      return { error: 'Lỗi xác thực email' };
    }
  }

  /**
   * Gửi email khôi phục mật khẩu
   */
  async forgotPassword(email: string): Promise<{ error: string | null }> {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        return { error: 'Email không hợp lệ' };
      }

      // Check if user exists
      const { data: user } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single();

      if (!user) {
        // Don't reveal if email exists or not for security
        return { error: null };
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Forgot password error:', error);
        return { error: 'Không thể gửi email khôi phục. Vui lòng thử lại sau.' };
      }

      return { error: null };
    } catch (error) {
      console.error('ForgotPassword error:', error);
      return { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' };
    }
  }

  // Private helper methods

  private validateSignUpData(data: SignUpData): { isValid: boolean; error: string } {
    if (!data.email || !data.password || !data.full_name) {
      return { isValid: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' };
    }

    if (!this.isValidEmail(data.email)) {
      return { isValid: false, error: 'Email không hợp lệ' };
    }

    if (data.password.length < 8) {
      return { isValid: false, error: 'Mật khẩu phải có ít nhất 8 ký tự' };
    }

    if (!this.isStrongPassword(data.password)) {
      return { isValid: false, error: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số' };
    }

    return { isValid: true, error: '' };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers;
  }

  private async checkRateLimit(email: string): Promise<{ allowed: boolean; error: string }> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('login_attempts, locked_until')
        .eq('email', email)
        .single();

      if (!user) {
        return { allowed: true, error: '' };
      }

      // Kiểm tra xem tài khoản có bị khóa không
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const unlockTime = new Date(user.locked_until).toLocaleTimeString('vi-VN');
        return { 
          allowed: false, 
          error: `Tài khoản bị khóa đến ${unlockTime} do đăng nhập sai quá nhiều lần` 
        };
      }

      // Kiểm tra số lần đăng nhập thất bại
      if (user.login_attempts >= this.MAX_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
        await supabase
          .from('users')
          .update({ locked_until: lockUntil.toISOString() })
          .eq('email', email);

        return { 
          allowed: false, 
          error: 'Tài khoản bị khóa 15 phút do đăng nhập sai quá nhiều lần' 
        };
      }

      return { allowed: true, error: '' };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true, error: '' };
    }
  }

  private async incrementLoginAttempts(email: string): Promise<void> {
    try {
      await supabase.rpc('increment_login_attempts', { user_email: email });
    } catch (error) {
      console.error('Increment login attempts error:', error);
    }
  }

  private async resetLoginAttempts(email: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({ 
          login_attempts: 0, 
          locked_until: null,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);
    } catch (error) {
      console.error('Reset login attempts error:', error);
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({ 
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }
}

export const authService = new AuthService();
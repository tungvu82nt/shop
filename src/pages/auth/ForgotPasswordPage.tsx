/**
 * YAPEE VIETNAM CLONE - FORGOT PASSWORD PAGE
 * 
 * Trang quên mật khẩu với gửi email reset
 * Tích hợp với AuthService và SecurityService
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/components/layout/AuthLayout';

import { authService } from '@/services/authService';
import { securityService } from '@/services/securityService';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormErrors {
  email?: string;
  general?: string;
}

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });
  
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Clear errors khi user thay đổi input
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formData]);

  // Countdown timer cho resend email
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordFormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Security check
      if (!securityService.checkRateLimit(formData.email, 'forgot-password')) {
        setErrors({ general: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' });
        return;
      }

      // Send reset email
      const result = await authService.forgotPassword(formData.email);
      
      if (!result.error) {
        setIsEmailSent(true);
        setCountdown(60); // 60 seconds countdown
        toast.success('Email khôi phục đã được gửi!');
      } else {
        setErrors({ general: result.error || 'Có lỗi xảy ra, vui lòng thử lại' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại sau' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle resend email
   */
  const handleResendEmail = async () => {
    if (countdown > 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await authService.forgotPassword(formData.email);
      if (!result.error) {
        setCountdown(60);
        toast.success('Email đã được gửi lại!');
      } else {
        toast.error('Không thể gửi lại email, vui lòng thử lại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle back to form
   */
  const handleBackToForm = () => {
    setIsEmailSent(false);
    setCountdown(0);
    setFormData({ email: '' });
    setErrors({});
  };

  return (
    <AuthLayout 
      title="Khôi phục tài khoản"
      subtitle="Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập"
    >
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            {isEmailSent ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Mail className="w-8 h-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isEmailSent ? 'Email đã được gửi!' : 'Quên mật khẩu?'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isEmailSent 
              ? 'Vui lòng kiểm tra email để đặt lại mật khẩu'
              : 'Nhập email để nhận liên kết đặt lại mật khẩu'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isEmailSent ? (
            <>
              {/* General error */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email đăng ký
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email của bạn"
                    className={`h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi email khôi phục'}
                </Button>
              </form>

              {/* Back to login */}
              <div className="text-center pt-4 border-t">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← Quay lại trang đăng nhập
                </Link>
              </div>
            </>
          ) : (
            <>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Email khôi phục đã được gửi đến <strong>{formData.email}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Hướng dẫn tiếp theo:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>1. Kiểm tra hộp thư đến của bạn</li>
                    <li>2. Tìm email từ Yapee (kiểm tra cả thư mục spam)</li>
                    <li>3. Nhấp vào liên kết trong email</li>
                    <li>4. Tạo mật khẩu mới</li>
                  </ul>
                </div>

                {/* Resend email */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-3">
                    Không nhận được email?
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={countdown > 0 || isSubmitting}
                    className="w-full"
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Gửi lại sau {countdown}s
                      </>
                    ) : (
                      'Gửi lại email'
                    )}
                  </Button>
                </div>

                {/* Change email */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={handleBackToForm}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Sử dụng email khác
                  </Button>
                </div>

                {/* Back to login */}
                <div className="text-center pt-4 border-t">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    ← Quay lại trang đăng nhập
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
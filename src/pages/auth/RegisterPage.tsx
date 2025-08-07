/**
 * YAPEE VIETNAM CLONE - REGISTER PAGE
 * 
 * Trang đăng ký tài khoản mới với validation đầy đủ
 * Tích hợp với AuthService và SecurityService
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import AuthLayout from '@/components/layout/AuthLayout';

import { authService, type SignUpData } from '@/services/authService';
import { securityService } from '@/services/securityService';
import { analytics } from '@/lib/analytics';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  agree_terms: boolean;
  agree_marketing: boolean;
}

interface RegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  agree_terms?: string;
  general?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    agree_terms: false,
    agree_marketing: false
  });
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [], isStrong: false });
  
  // Clear errors khi user thay đổi input
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formData]);
  
  // Check password strength khi password thay đổi
  useEffect(() => {
    if (formData.password) {
      const strength = securityService.checkPasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: [], isStrong: false });
    }
  }, [formData.password]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};
    
    // Validate full name
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ và tên';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Họ và tên phải có ít nhất 2 ký tự';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailValidation = securityService.validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.errors[0];
      }
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(\+84|0)[3-9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else {
      const passwordValidation = securityService.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    // Validate date of birth
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Vui lòng chọn ngày sinh';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.date_of_birth = 'Bạn phải từ 13 tuổi trở lên';
      }
    }
    
    // Validate terms agreement
    if (!formData.agree_terms) {
      newErrors.agree_terms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const signUpData: SignUpData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        phone: formData.phone.replace(/\s/g, ''),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender || undefined
      };
      
      const result = await authService.signUp(signUpData);
      
      if (result.error) {
        setErrors({ general: result.error });
        toast.error(result.error);
        
        // Theo dõi đăng ký thất bại
        analytics.trackAuth('sign_up_failed', {
          method: 'email',
          error: result.error
        });
        
        return;
      }
      
      if (result.user) {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        
        // Theo dõi đăng ký thành công
        analytics.trackAuth('sign_up', {
          method: 'email',
          user_id: result.user.id
        });
        
        // Redirect to login with success message
        navigate('/login', {
          state: {
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
            email: formData.email
          }
        });
      }
      
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
      
      // Theo dõi lỗi đăng ký
      analytics.trackAuth('sign_up_failed', {
        method: 'email',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setErrors({ general: 'Đã xảy ra lỗi hệ thống' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = ['agree_terms', 'agree_marketing'].includes(field) 
      ? e.target.checked 
      : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handle select changes
   */
  const handleSelectChange = (field: keyof RegisterFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Get password strength color
   */
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  /**
   * Get password strength text
   */
  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Yếu';
    if (passwordStrength.score <= 4) return 'Trung bình';
    return 'Mạnh';
  };

  return (
    <AuthLayout 
      title="Tham gia Yapee ngay hôm nay!"
      subtitle="Tạo tài khoản để khám phá hàng triệu sản phẩm với giá tốt nhất"
    >
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Đăng ký
        </CardTitle>
        <CardDescription className="text-gray-600">
          Tạo tài khoản Yapee để bắt đầu mua sắm!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
            {/* General error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name field */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-700 font-medium">
                  Họ và tên *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Nhập họ và tên đầy đủ"
                    value={formData.full_name}
                    onChange={handleInputChange('full_name')}
                    className={`pl-10 h-12 ${errors.full_name ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-red-500 text-sm">{errors.full_name}</p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className={`pl-10 h-12 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Số điện thoại *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    className={`pl-10 h-12 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              {/* Date of birth and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-gray-700 font-medium">
                    Ngày sinh *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange('date_of_birth')}
                      className={`pl-10 h-12 ${errors.date_of_birth ? 'border-red-300 focus:border-red-500' : ''}`}
                      disabled={isSubmitting}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Giới tính
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={handleSelectChange('gender')}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Mật khẩu *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Độ mạnh mật khẩu:</span>
                      <span className={`text-sm font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-500' :
                        passwordStrength.score <= 4 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <Progress 
                      value={(passwordStrength.score / 6) * 100} 
                      className="h-2"
                    />
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="text-xs text-gray-600 space-y-1">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <li key={index}>• {feedback}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Xác nhận mật khẩu *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree_terms"
                    checked={formData.agree_terms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agree_terms: checked as boolean }))
                    }
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <Label htmlFor="agree_terms" className="text-sm text-gray-600 leading-relaxed">
                    Tôi đồng ý với{' '}
                    <Link to="/terms" className="text-orange-600 hover:underline">
                      Điều khoản dịch vụ
                    </Link>{' '}
                    và{' '}
                    <Link to="/privacy" className="text-orange-600 hover:underline">
                      Chính sách bảo mật
                    </Link>{' '}
                    của Yapee *
                  </Label>
                </div>
                {errors.agree_terms && (
                  <p className="text-red-500 text-sm">{errors.agree_terms}</p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree_marketing"
                    checked={formData.agree_marketing}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agree_marketing: checked as boolean }))
                    }
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <Label htmlFor="agree_marketing" className="text-sm text-gray-600 leading-relaxed">
                    Tôi muốn nhận thông tin khuyến mãi và ưu đãi từ Yapee
                  </Label>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                disabled={isSubmitting || !passwordStrength.isStrong}
              >
                {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              </Button>
            </form>

            {/* Sign in link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
    </AuthLayout>
  );
};

export default RegisterPage;
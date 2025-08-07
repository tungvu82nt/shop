import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';

interface PasswordResetProps {
  mode?: 'request' | 'reset';
}

const PasswordReset: React.FC<PasswordResetProps> = ({ mode = 'request' }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('Ít nhất 8 ký tự');
    if (!/[A-Z]/.test(pwd)) errors.push('Ít nhất 1 chữ hoa');
    if (!/[a-z]/.test(pwd)) errors.push('Ít nhất 1 chữ thường');
    if (!/\d/.test(pwd)) errors.push('Ít nhất 1 số');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('Ít nhất 1 ký tự đặc biệt');
    return errors;
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError('Vui lòng nhập địa chỉ email');
      setIsLoading(false);
      return;
    }

    try {
      // Sử dụng Supabase Auth để gửi email đặt lại mật khẩu
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message || 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu');
      } else {
        setIsSuccess(true);
        toast({
          title: 'Email đặt lại mật khẩu đã được gửi!',
          description: 'Vui lòng kiểm tra hộp thư của bạn.',
        });
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate inputs
    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Mật khẩu không hợp lệ: ${passwordErrors.join(', ')}`);
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Token đặt lại mật khẩu không hợp lệ');
      setIsLoading(false);
      return;
    }

    try {
      // Sử dụng Supabase Auth để đặt lại mật khẩu
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
      } else {
        setIsSuccess(true);
        toast({
          title: 'Mật khẩu đã được đặt lại!',
          description: 'Bạn có thể đăng nhập với mật khẩu mới.',
        });
        
        // Redirect sau 3 giây
        setTimeout(() => {
          navigate('/login?reset=true');
        }, 3000);
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess && mode === 'request') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Email đã được gửi!
            </CardTitle>
            <CardDescription>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và làm theo hướng dẫn để đặt lại mật khẩu.
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-2">
              <Button 
                variant="outline"
                onClick={() => setIsSuccess(false)}
                className="w-full"
              >
                Gửi lại email
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess && mode === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Mật khẩu đã được đặt lại!
            </CardTitle>
            <CardDescription>
              Bạn có thể đăng nhập với mật khẩu mới.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/login?reset=true')} 
              className="w-full"
            >
              Đăng nhập ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {mode === 'request' ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
          </CardTitle>
          <CardDescription>
            {mode === 'request' 
              ? 'Nhập email để nhận hướng dẫn đặt lại mật khẩu' 
              : 'Nhập mật khẩu mới cho tài khoản của bạn'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mode === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Địa chỉ email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="text-xs text-gray-600">
                    <div className="font-medium mb-1">Yêu cầu mật khẩu:</div>
                    <ul className="space-y-1">
                      {[
                        { check: password.length >= 8, text: 'Ít nhất 8 ký tự' },
                        { check: /[A-Z]/.test(password), text: 'Ít nhất 1 chữ hoa' },
                        { check: /[a-z]/.test(password), text: 'Ít nhất 1 chữ thường' },
                        { check: /\d/.test(password), text: 'Ít nhất 1 số' },
                        { check: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'Ít nhất 1 ký tự đặc biệt' },
                      ].map((req, index) => (
                        <li key={index} className={`flex items-center space-x-1 ${
                          req.check ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <span className="text-xs">{req.check ? '✓' : '○'}</span>
                          <span>{req.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <div className={`text-xs ${
                    password === confirmPassword ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {password === confirmPassword ? '✓ Mật khẩu khớp' : '✗ Mật khẩu không khớp'}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                className="w-full"
              >
                {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;
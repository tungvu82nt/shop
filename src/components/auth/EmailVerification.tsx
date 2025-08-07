import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';

interface EmailVerificationProps {
  mode?: 'verify' | 'resend';
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ mode = 'verify' }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }

    // Tự động verify nếu có token
    if (token && mode === 'verify') {
      handleVerifyEmail(token);
    }
  }, [token, emailParam, mode]);

  useEffect(() => {
    // Countdown cho resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Sử dụng Supabase Auth để xác minh email
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: verificationToken,
        type: 'email'
      });

      if (error) {
        setError(error.message || 'Có lỗi xảy ra khi xác minh email');
      } else {
        setIsVerified(true);
        toast({
          title: 'Email đã được xác minh!',
          description: 'Tài khoản của bạn đã được kích hoạt thành công.',
        });
        
        // Redirect sau 3 giây
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Vui lòng nhập email để gửi lại mã xác minh');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sử dụng Supabase Auth để gửi lại email xác minh
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      });

      if (error) {
        setError(error.message || 'Có lỗi xảy ra khi gửi email xác minh');
      } else {
        toast({
          title: 'Email xác minh đã được gửi!',
          description: 'Vui lòng kiểm tra hộp thư của bạn.',
        });
        setResendCooldown(60); // 60 giây cooldown
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Email đã được xác minh!
            </CardTitle>
            <CardDescription>
              Tài khoản của bạn đã được kích hoạt thành công.
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
              onClick={() => navigate('/login?verified=true')} 
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
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {mode === 'verify' ? 'Xác minh Email' : 'Gửi lại Email xác minh'}
          </CardTitle>
          <CardDescription>
            {mode === 'verify' 
              ? 'Đang xác minh địa chỉ email của bạn...' 
              : 'Nhập email để nhận lại mã xác minh'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mode === 'resend' && (
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Địa chỉ email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Nhập địa chỉ email của bạn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {mode === 'verify' && token && (
            <div className="text-center">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Đang xác minh...</span>
                </div>
              ) : (
                <Button 
                  onClick={() => handleVerifyEmail(token)}
                  disabled={isLoading}
                  className="w-full"
                >
                  Thử lại xác minh
                </Button>
              )}
            </div>
          )}

          {mode === 'resend' && (
            <Button 
              onClick={handleResendVerification}
              disabled={isLoading || resendCooldown > 0 || !email}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : resendCooldown > 0 ? (
                `Gửi lại sau ${resendCooldown}s`
              ) : (
                'Gửi lại email xác minh'
              )}
            </Button>
          )}

          <div className="text-center space-y-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại đăng nhập
            </Button>
            
            {mode === 'verify' && (
              <div className="text-sm text-gray-600">
                Không nhận được email?{' '}
                <button 
                  onClick={() => navigate('/verify-email?mode=resend')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Gửi lại
                </button>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">
            Kiểm tra cả thư mục spam nếu bạn không thấy email xác minh.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmailService } from '@/services/emailService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Trang xác thực email
 */
const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email') || user?.email;

  useEffect(() => {
    const verifyEmail = async () => {
      if (token && email) {
        // Có token từ email link - thực hiện xác thực
        const success = await EmailService.verifyEmail(token, email);
        if (success) {
          setVerificationStatus('success');
          // Refresh user data để cập nhật trạng thái email_verified
          await refreshUser();
          // Redirect về trang chủ sau 3 giây
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        } else {
          setVerificationStatus('error');
        }
      } else if (user) {
        // Kiểm tra trạng thái email verification hiện tại
        const isVerified = await EmailService.checkEmailVerificationStatus();
        if (isVerified) {
          setVerificationStatus('success');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          setVerificationStatus('pending');
        }
      } else {
        // Chưa đăng nhập
        navigate('/auth/login', { replace: true });
      }
    };

    verifyEmail();
  }, [token, email, user, navigate, refreshUser]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Không tìm thấy email để gửi lại.');
      return;
    }

    setIsResending(true);
    const success = await EmailService.sendVerificationEmail(email);
    setIsResending(false);

    if (success) {
      toast.success('Email xác thực đã được gửi lại!');
    }
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle>Đang xác thực email...</CardTitle>
              <CardDescription>
                Vui lòng chờ trong giây lát
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-green-600">Xác thực thành công!</CardTitle>
              <CardDescription>
                Email của bạn đã được xác thực thành công. Bạn sẽ được chuyển về trang chủ trong giây lát.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleBackToHome} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Xác thực thất bại</CardTitle>
              <CardDescription>
                Link xác thực không hợp lệ hoặc đã hết hạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại email xác thực.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button 
                  onClick={handleResendEmail} 
                  disabled={isResending}
                  className="w-full"
                  variant="outline"
                >
                  {isResending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Gửi lại email xác thực
                </Button>
                <Button onClick={handleBackToHome} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'pending':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-yellow-600">Chờ xác thực email</CardTitle>
              <CardDescription>
                Chúng tôi đã gửi email xác thực đến <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và nhấp vào link xác thực.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button 
                  onClick={handleResendEmail} 
                  disabled={isResending}
                  className="w-full"
                  variant="outline"
                >
                  {isResending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Gửi lại email xác thực
                </Button>
                <Button onClick={handleBackToHome} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;
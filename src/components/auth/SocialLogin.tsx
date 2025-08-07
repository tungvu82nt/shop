import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Mail, Github, Chrome } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';

interface SocialLoginProps {
  mode?: 'login' | 'register';
  onSuccess?: (user: any) => void;
  className?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ 
  mode = 'login', 
  onSuccess,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setIsLoading(provider);
    setError(null);

    try {
      // Sử dụng Supabase Auth cho social login
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // OAuth redirect sẽ tự động xảy ra
        toast({
          title: 'Đang chuyển hướng...',
          description: `Đang chuyển đến ${provider} để xác thực.`,
        });
      }
    } catch (err) {
      setError('Không thể khởi tạo đăng nhập social');
    } finally {
      setIsLoading(null);
    }
  };

  // Alternative implementation using Supabase directly
  const handleSupabaseSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setIsLoading(provider);
    setError(null);

    try {
      // Example with Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // OAuth redirect will happen automatically
        toast({
          title: 'Đang chuyển hướng...',
          description: `Đang chuyển đến ${provider} để xác thực.`,
        });
      }
    } catch (err) {
      setError('Không thể khởi tạo đăng nhập social');
    } finally {
      setIsLoading(null);
    }
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: Chrome,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'facebook',
      name: 'Facebook', 
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900',
      textColor: 'text-white'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {socialProviders.map((provider) => {
          const Icon = provider.icon;
          const isCurrentLoading = isLoading === provider.id;
          
          return (
            <Button
              key={provider.id}
              variant="outline"
              onClick={() => handleSocialLogin(provider.id as any)}
              disabled={!!isLoading}
              className={`w-full h-11 ${provider.color} ${provider.textColor} border-0 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50`}
            >
              {isCurrentLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang kết nối...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">
                    {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} với {provider.name}
                  </span>
                </div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc {mode === 'login' ? 'đăng nhập' : 'đăng ký'} với email
          </span>
        </div>
      </div>

      {/* Additional social providers (if needed) */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Bằng cách {mode === 'login' ? 'đăng nhập' : 'đăng ký'}, bạn đồng ý với{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Điều khoản sử dụng
          </a>{' '}
          và{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </a>{' '}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
};

export default SocialLogin;

// Hook để xử lý callback từ social login
export const useSocialAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCallback = async () => {
    try {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(error);
      }

      if (code) {
        // Exchange code for tokens
        const response = await fetch('/api/auth/social/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store tokens
          localStorage.setItem('token', data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }

          // Store user info
          localStorage.setItem('user', JSON.stringify(data.user));

          toast({
            title: 'Đăng nhập thành công!',
            description: `Chào mừng ${data.user.name || data.user.email}!`,
          });

          // Redirect to dashboard or intended page
          const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard';
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectTo);
        } else {
          throw new Error(data.message || 'Đăng nhập thất bại');
        }
      }
    } catch (err: any) {
      toast({
        title: 'Đăng nhập thất bại',
        description: err.message || 'Có lỗi xảy ra trong quá trình đăng nhập.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  };

  return { handleCallback };
};

// Component để xử lý callback page
export const SocialAuthCallback: React.FC = () => {
  const { handleCallback } = useSocialAuthCallback();
  const [isProcessing, setIsProcessing] = useState(true);

  React.useEffect(() => {
    const processCallback = async () => {
      await handleCallback();
      setIsProcessing(false);
    };

    processCallback();
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-semibold">Đang xử lý đăng nhập...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
        </div>
      </div>
    );
  }

  return null;
};
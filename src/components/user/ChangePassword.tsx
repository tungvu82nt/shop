import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { Progress } from '../ui/progress';

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

interface ChangePasswordProps {
  onSuccess?: () => void;
  requireCurrentPassword?: boolean;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  onSuccess,
  requireCurrentPassword = true
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, feedback: [], color: 'bg-gray-200', label: '' };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Ít nhất 8 ký tự');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Ít nhất 1 chữ hoa');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Ít nhất 1 chữ thường');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Ít nhất 1 số');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Ít nhất 1 ký tự đặc biệt');
    }

    // Common patterns check
    const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      score -= 1;
      feedback.push('Tránh sử dụng mật khẩu phổ biến');
    }

    // Determine strength level
    let color = 'bg-red-500';
    let label = 'Yếu';
    
    if (score >= 4) {
      color = 'bg-green-500';
      label = 'Mạnh';
    } else if (score >= 3) {
      color = 'bg-yellow-500';
      label = 'Trung bình';
    } else if (score >= 2) {
      color = 'bg-orange-500';
      label = 'Khá yếu';
    }

    return { score: Math.max(0, score), feedback, color, label };
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);
  const strengthPercentage = (passwordStrength.score / 5) * 100;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): string | null => {
    if (requireCurrentPassword && !formData.currentPassword) {
      return 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!formData.newPassword) {
      return 'Vui lòng nhập mật khẩu mới';
    }

    if (formData.newPassword.length < 8) {
      return 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }

    if (passwordStrength.score < 3) {
      return 'Mật khẩu mới không đủ mạnh';
    }

    if (!formData.confirmPassword) {
      return 'Vui lòng xác nhận mật khẩu mới';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }

    if (requireCurrentPassword && formData.currentPassword === formData.newPassword) {
      return 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestBody: any = {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };

      if (requireCurrentPassword) {
        requestBody.currentPassword = formData.currentPassword;
      }

      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Thành công!',
          description: 'Mật khẩu đã được thay đổi thành công.',
        });

        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        onSuccess?.();
      } else {
        setError(data.message || 'Không thể thay đổi mật khẩu');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <Lock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <CardDescription>
              Cập nhật mật khẩu để bảo mật tài khoản
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <X className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {requireCurrentPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Độ mạnh mật khẩu:</span>
                  <span className={`font-medium ${
                    passwordStrength.score >= 4 ? 'text-green-600' :
                    passwordStrength.score >= 3 ? 'text-yellow-600' :
                    passwordStrength.score >= 2 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <Progress 
                  value={strengthPercentage} 
                  className="h-2"
                />
                
                {passwordStrength.feedback.length > 0 && (
                  <div className="space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                        <X className="h-3 w-3 text-red-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="flex items-center space-x-2 text-xs">
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">Mật khẩu khớp</span>
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 text-red-500" />
                    <span className="text-red-600">Mật khẩu không khớp</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Security Tips */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Mẹo bảo mật:</strong>
              <ul className="mt-1 text-xs space-y-1">
                <li>• Sử dụng ít nhất 8 ký tự</li>
                <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>• Tránh sử dụng thông tin cá nhân</li>
                <li>• Không sử dụng mật khẩu đã dùng ở nơi khác</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || passwordStrength.score < 3 || formData.newPassword !== formData.confirmPassword}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang cập nhật...</span>
              </div>
            ) : (
              'Đổi mật khẩu'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;

// Hook để sử dụng change password
export const useChangePassword = () => {
  const { toast } = useToast();
  
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await fetch('/api/user/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Change password failed');
    }
    
    return data;
  };
  
  return {
    changePassword,
  };
};
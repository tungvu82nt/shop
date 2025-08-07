import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Key, QrCode, Copy, CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface TwoFactorAuthProps {
  mode?: 'setup' | 'verify' | 'disable';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ 
  mode = 'setup', 
  onSuccess,
  onCancel 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  // Setup states
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  // Verification states
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  
  // Refs for auto-focus
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (mode === 'setup') {
      generateQRCode();
    }
  }, [mode]);

  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      // Gọi API backend để tạo QR code cho 2FA
      // Lưu ý: Supabase không hỗ trợ 2FA tích hợp, cần implement riêng
      const response = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setQrCodeUrl(data.qrCodeUrl);
        setSecretKey(data.secret);
      } else {
        setError(data.message || 'Không thể tạo mã QR');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    toast({
      title: 'Đã sao chép!',
      description: 'Secret key đã được sao chép vào clipboard.',
    });
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = verificationCode.split('');
    newCode[index] = value;
    setVerificationCode(newCode.join(''));
    
    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const verifySetupCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Gọi API backend để xác minh mã setup 2FA
      // Lưu ý: Cần implement backend API riêng cho 2FA
      const response = await fetch('/api/auth/2fa/verify-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBackupCodes(data.backupCodes);
        setStep(3);
        toast({
          title: 'Xác thực 2 bước đã được kích hoạt!',
          description: 'Tài khoản của bạn giờ đây an toàn hơn.',
        });
      } else {
        setError(data.message || 'Mã xác thực không đúng');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLoginCode = async () => {
    const code = useBackupCode ? backupCode : verificationCode;
    
    if (!code || (useBackupCode ? code.length !== 8 : code.length !== 6)) {
      setError(`Vui lòng nhập đầy đủ ${useBackupCode ? '8' : '6'} ký tự`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Gọi API backend để xác minh mã 2FA khi đăng nhập
      // Lưu ý: Cần implement backend API riêng cho 2FA
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          isBackupCode: useBackupCode,
          sessionToken: localStorage.getItem('2fa_session_token')
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.removeItem('2fa_session_token');
        
        toast({
          title: 'Đăng nhập thành công!',
          description: 'Chào mừng bạn quay trở lại.',
        });
        
        onSuccess?.();
      } else {
        setError(data.message || 'Mã xác thực không đúng');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    if (verificationCode.length !== 6) {
      setError('Vui lòng nhập mã xác thực để tắt 2FA');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Gọi API backend để tắt 2FA
      // Lưu ý: Cần implement backend API riêng cho 2FA
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Xác thực 2 bước đã được tắt',
          description: 'Tính năng bảo mật đã được vô hiệu hóa.',
        });
        onSuccess?.();
      } else {
        setError(data.message || 'Không thể tắt xác thực 2 bước');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = `Mã dự phòng xác thực 2 bước\n\n${backupCodes.join('\n')}\n\nLưu ý: Mỗi mã chỉ sử dụng được một lần. Hãy giữ chúng ở nơi an toàn.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (mode === 'setup') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Thiết lập xác thực 2 bước</CardTitle>
          <CardDescription>
            Tăng cường bảo mật cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Bước 1: Quét mã QR</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sử dụng ứng dụng xác thực như Google Authenticator hoặc Authy để quét mã QR bên dưới:
                </p>
                
                {isLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                  </div>
                ) : qrCodeUrl ? (
                  <div className="bg-white p-4 rounded-lg border">
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
                  </div>
                ) : (
                  <Button onClick={generateQRCode} variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Tạo mã QR
                  </Button>
                )}
              </div>

              {secretKey && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Hoặc nhập thủ công:</p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                      {secretKey}
                    </code>
                    <Button size="sm" variant="outline" onClick={copySecretKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!qrCodeUrl}
              >
                Tiếp tục
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Bước 2: Xác thực</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Nhập mã 6 chữ số từ ứng dụng xác thực:
                </p>
              </div>

              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (codeInputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={verificationCode[index] || ''}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                <Button 
                  onClick={verifySetupCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Thiết lập thành công!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xác thực 2 bước đã được kích hoạt. Hãy lưu các mã dự phòng bên dưới:
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Mã dự phòng:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-2 rounded border">
                      {code}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadBackupCodes}
                  className="mt-2 w-full"
                >
                  Tải xuống mã dự phòng
                </Button>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Hãy lưu các mã dự phòng ở nơi an toàn. Bạn có thể sử dụng chúng để đăng nhập khi không có ứng dụng xác thực.
                </AlertDescription>
              </Alert>

              <Button onClick={onSuccess} className="w-full">
                Hoàn tất
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (mode === 'verify') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Key className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Xác thực 2 bước</CardTitle>
          <CardDescription>
            Nhập mã từ ứng dụng xác thực của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={useBackupCode ? 'backup' : 'app'} onValueChange={(value) => setUseBackupCode(value === 'backup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app">
                <Smartphone className="h-4 w-4 mr-2" />
                Ứng dụng
              </TabsTrigger>
              <TabsTrigger value="backup">
                <Key className="h-4 w-4 mr-2" />
                Mã dự phòng
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="app" className="space-y-4">
              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (codeInputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={verificationCode[index] || ''}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="backup" className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mã dự phòng (8 ký tự)
                </label>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã dự phòng"
                  className="w-full px-3 py-2 text-center font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={8}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={verifyLoginCode}
            disabled={isLoading || (!useBackupCode && verificationCode.length !== 6) || (useBackupCode && backupCode.length !== 8)}
            className="w-full mt-4"
          >
            {isLoading ? 'Đang xác thực...' : 'Xác thực'}
          </Button>

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={onCancel || (() => navigate('/login'))}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'disable') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Tắt xác thực 2 bước</CardTitle>
          <CardDescription>
            Nhập mã xác thực để tắt tính năng bảo mật này
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Cảnh báo: Tắt xác thực 2 bước sẽ làm giảm bảo mật cho tài khoản của bạn.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (codeInputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={verificationCode[index] || ''}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              ))}
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button 
                variant="destructive"
                onClick={disable2FA}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1"
              >
                {isLoading ? 'Đang tắt...' : 'Tắt 2FA'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TwoFactorAuth;
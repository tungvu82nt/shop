import React, { useState } from 'react';
import { AlertTriangle, Bug, Zap, Network, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { captureError, captureMessage, addBreadcrumb, setUserContext } from '@/lib/sentry';
import { errorLogger } from '@/services/errorLogger';
import { useErrorHandler } from '@/components/ErrorBoundary';

const SentryTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const handleError = useErrorHandler();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test 1: Lỗi JavaScript thông thường
  const testJavaScriptError = () => {
    try {
      addResult('Đang test lỗi JavaScript...');
      throw new Error('Test JavaScript Error - Đây là lỗi test từ Sentry');
    } catch (error) {
      handleError(error as Error, { testType: 'javascript', source: 'SentryTestPage' });
      addResult('✅ Lỗi JavaScript đã được gửi lên Sentry');
    }
  };

  // Test 2: Lỗi React Component
  const testReactError = () => {
    addResult('Đang test lỗi React Component...');
    const error = new Error('Test React Component Error - Lỗi trong quá trình render');
    errorLogger.logReactError(error, {
      componentStack: 'SentryTestPage > TestButton',
      props: { testType: 'react' }
    }, 'SentryTestPage');
    addResult('✅ Lỗi React Component đã được gửi lên Sentry');
  };

  // Test 3: Lỗi Network
  const testNetworkError = () => {
    addResult('Đang test lỗi Network...');
    const error = new Error('Test Network Error - Không thể kết nối đến API');
    errorLogger.logNetworkError(error, {
      url: 'https://api.example.com/test',
      method: 'POST',
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    addResult('✅ Lỗi Network đã được gửi lên Sentry');
  };

  // Test 4: Lỗi Authentication
  const testAuthError = () => {
    addResult('Đang test lỗi Authentication...');
    const error = new Error('Test Auth Error - Token không hợp lệ');
    errorLogger.logAuthError(error, {
      userId: 'test-user-123',
      action: 'login',
      provider: 'email'
    });
    addResult('✅ Lỗi Authentication đã được gửi lên Sentry');
  };

  // Test 5: Lỗi Payment
  const testPaymentError = () => {
    addResult('Đang test lỗi Payment...');
    const error = new Error('Test Payment Error - Thanh toán thất bại');
    errorLogger.logPaymentError(error, {
      orderId: 'ORDER-123',
      amount: 500000,
      paymentMethod: 'vnpay',
      currency: 'VND'
    });
    addResult('✅ Lỗi Payment đã được gửi lên Sentry');
  };

  // Test 6: Capture Message
  const testCaptureMessage = () => {
    addResult('Đang test Capture Message...');
    captureMessage('Test Info Message - Thông tin debug từ Sentry Test', 'info', {
      feature: 'sentry-test',
      user: 'test-user'
    });
    addResult('✅ Message đã được gửi lên Sentry');
  };

  // Test 7: Breadcrumbs
  const testBreadcrumbs = () => {
    addResult('Đang test Breadcrumbs...');
    addBreadcrumb('User clicked test button', 'user', 'info');
    addBreadcrumb('Starting breadcrumb test', 'navigation', 'info');
    addBreadcrumb('Test breadcrumb added', 'debug', 'debug');
    
    // Sau đó tạo một lỗi để xem breadcrumbs
    const error = new Error('Test Error with Breadcrumbs');
    captureError(error, { testType: 'breadcrumbs' });
    addResult('✅ Breadcrumbs và Error đã được gửi lên Sentry');
  };

  // Test 8: User Context
  const testUserContext = () => {
    addResult('Đang test User Context...');
    setUserContext({
      id: 'test-user-123',
      email: 'test@example.com',
      username: 'testuser'
    });
    
    const error = new Error('Test Error with User Context');
    captureError(error, { testType: 'user-context' });
    addResult('✅ User Context và Error đã được gửi lên Sentry');
  };

  // Clear test results
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Sentry Error Monitoring Test
          </CardTitle>
          <CardDescription>
            Test các tính năng error monitoring và logging với Sentry integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              onClick={testJavaScriptError}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              JS Error
            </Button>
            
            <Button 
              onClick={testReactError}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              React Error
            </Button>
            
            <Button 
              onClick={testNetworkError}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Network className="h-4 w-4" />
              Network Error
            </Button>
            
            <Button 
              onClick={testAuthError}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Auth Error
            </Button>
            
            <Button 
              onClick={testPaymentError}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Payment Error
            </Button>
            
            <Button 
              onClick={testCaptureMessage}
              variant="secondary"
              size="sm"
            >
              Message
            </Button>
            
            <Button 
              onClick={testBreadcrumbs}
              variant="secondary"
              size="sm"
            >
              Breadcrumbs
            </Button>
            
            <Button 
              onClick={testUserContext}
              variant="secondary"
              size="sm"
            >
              User Context
            </Button>
          </div>

          {/* Clear Button */}
          <div className="flex justify-end">
            <Button 
              onClick={clearResults}
              variant="outline"
              size="sm"
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Results</CardTitle>
            <CardDescription>
              Kết quả test Sentry integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <span className="font-mono">{result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>1. Cấu hình Sentry:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Tạo tài khoản tại <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sentry.io</a></li>
              <li>Tạo project mới cho React</li>
              <li>Copy DSN và thêm vào file .env: <code className="bg-gray-100 px-1 rounded">VITE_SENTRY_DSN=your_dsn_here</code></li>
            </ul>
            
            <p><strong>2. Test các tính năng:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Click các button để test các loại lỗi khác nhau</li>
              <li>Kiểm tra Sentry dashboard để xem lỗi đã được ghi nhận</li>
              <li>Xem chi tiết context, breadcrumbs, và user information</li>
            </ul>
            
            <p><strong>3. Monitoring trong Production:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Sentry sẽ tự động capture các lỗi JavaScript và React</li>
              <li>Network errors sẽ được log qua errorLogger service</li>
              <li>User context sẽ được set tự động khi user login</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentryTestPage;
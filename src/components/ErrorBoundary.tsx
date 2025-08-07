import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { errorLogger } from '@/services/errorLogger';
import { captureError, addBreadcrumb } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để hiển thị UI fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Gọi callback onError nếu được cung cấp
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Lưu thông tin lỗi vào state
    this.setState({
      error,
      errorInfo
    });

    // Sử dụng errorLogger service để ghi log
    errorLogger.logReactError(error, errorInfo, 'ErrorBoundary');

    // Gửi lỗi lên Sentry với context đầy đủ
    captureError(error, {
      errorBoundary: this.constructor.name,
      componentStack: errorInfo.componentStack,
      props: this.props
    });

    // Thêm breadcrumb cho debugging
    addBreadcrumb(
      `Error caught by ${this.constructor.name}`,
      'error',
      'error'
    );
  }



  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Nếu có custom fallback UI, sử dụng nó
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI mặc định cho error
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Oops! Có lỗi xảy ra
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ứng dụng gặp phải một lỗi không mong muốn. Chúng tôi đã ghi nhận và sẽ khắc phục sớm nhất.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {import.meta.env.DEV && this.state.error && (
                <div className="rounded-md bg-red-50 p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Chi tiết lỗi (Development):</h4>
                  <p className="text-xs text-red-700 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Nếu lỗi vẫn tiếp tục, vui lòng liên hệ hỗ trợ khách hàng.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Higher-order component để wrap components dễ dàng hơn
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook để báo cáo lỗi thủ công
export const useErrorHandler = () => {
  const reportError = (error: Error, context?: string) => {
    errorLogger.logError(error, context || 'Manual report');
    
    // Gửi lỗi lên Sentry
    captureError(error, {
      source: 'useErrorHandler',
      context: context || 'Manual report'
    });
  };

  return { reportError };
};
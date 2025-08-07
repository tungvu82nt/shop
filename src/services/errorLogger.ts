// Error Logger Service - Quản lý việc ghi log và theo dõi lỗi
// Tích hợp với Sentry để theo dõi lỗi toàn diện

import { captureError, captureMessage, addBreadcrumb } from '@/lib/sentry';

export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  componentStack?: string;
  context?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'ui' | 'auth' | 'payment' | 'other';
  metadata?: Record<string, any>;
}

export interface ErrorStats {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  recentErrors: ErrorLog[];
  topErrors: Array<{ message: string; count: number }>;
}

class ErrorLoggerService {
  private readonly STORAGE_KEY = 'errorLogs';
  private readonly MAX_LOGS = 100;
  private readonly MAX_RETRIES = 3;

  /**
   * Ghi log lỗi vào hệ thống
   */
  public logError(
    error: Error,
    context?: string,
    severity: ErrorLog['severity'] = 'medium',
    category: ErrorLog['category'] = 'javascript',
    metadata?: Record<string, any>
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      severity,
      category,
      metadata
    };

    this.saveErrorLog(errorLog);
    this.notifyIfCritical(errorLog);
    
    // Gửi lên Sentry
    captureError(error, {
      severity,
      category,
      context: context || '',
      metadata: metadata || {},
      url: window.location.href
    });
    
    // Log ra console trong development
    if (import.meta.env.DEV) {
      this.logToConsole(errorLog);
    }
  }

  /**
   * Ghi log lỗi React Error Boundary
   */
  public logReactError(
    error: Error,
    errorInfo: { componentStack?: string },
    context?: string
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: context || 'React Error Boundary',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      severity: 'high',
      category: 'ui',
      metadata: {
        errorBoundary: true,
        componentStack: errorInfo.componentStack
      }
    };

    this.saveErrorLog(errorLog);
    this.notifyIfCritical(errorLog);
    
    // Gửi lên Sentry với tag React
    captureError(error, {
      severity: 'high',
      category: 'ui',
      context: context || 'React Error Boundary',
      componentStack: errorInfo.componentStack,
      url: window.location.href
    });
    
    addBreadcrumb(
      `React error in component`,
      'error',
      'error'
    );
    
    if (import.meta.env.DEV) {
      this.logToConsole(errorLog);
    }
  }

  /**
   * Ghi log lỗi network
   */
  public logNetworkError(
    error: Error,
    networkInfo: {
      url: string;
      method: string;
      status: number;
      headers?: Record<string, string>;
    },
    context?: string
  ): void {
    this.logError(
      error,
      context || 'Network Request',
      networkInfo.status >= 500 ? 'high' : 'medium',
      'network',
      {
        url: networkInfo.url,
        method: networkInfo.method,
        status: networkInfo.status,
        headers: networkInfo.headers,
        requestTime: new Date().toISOString()
      }
    );
    
    // Thêm breadcrumb cho network error
    addBreadcrumb(
      `Network error: ${networkInfo.method} ${networkInfo.url}`,
      'http',
      'error'
    );
  }

  /**
   * Ghi log lỗi authentication
   */
  public logAuthError(
    error: Error,
    authInfo: {
      userId?: string;
      action: string;
      provider?: string;
    },
    context?: string
  ): void {
    this.logError(
      error,
      context || 'Authentication',
      'high',
      'auth',
      {
        userId: authInfo.userId,
        action: authInfo.action,
        provider: authInfo.provider,
        timestamp: new Date().toISOString()
      }
    );
    
    // Thêm breadcrumb cho auth error
    addBreadcrumb(
      `Auth error: ${authInfo.action}`,
      'auth',
      'error'
    );
  }

  /**
   * Ghi log lỗi payment
   */
  public logPaymentError(
    error: Error,
    paymentInfo: {
      orderId: string;
      amount: number;
      paymentMethod: string;
      currency: string;
    },
    context?: string
  ): void {
    this.logError(
      error,
      context || 'Payment Processing',
      'critical',
      'payment',
      {
        orderId: paymentInfo.orderId,
        amount: paymentInfo.amount,
        paymentMethod: paymentInfo.paymentMethod,
        currency: paymentInfo.currency,
        timestamp: new Date().toISOString()
      }
    );
    
    // Thêm breadcrumb cho payment error
     addBreadcrumb(
       `Payment error: ${paymentInfo.paymentMethod} - ${paymentInfo.orderId}`,
       'transaction',
      'error'
    );
  }





  /**
   * Lấy tất cả error logs
   */
  public getErrorLogs(): ErrorLog[] {
    try {
      const logs = localStorage.getItem(this.STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to retrieve error logs:', error);
      return [];
    }
  }

  /**
   * Lấy thống kê lỗi
   */
  public getErrorStats(): ErrorStats {
    const logs = this.getErrorLogs();
    
    const errorsByCategory = logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = logs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Lấy 10 lỗi gần nhất
    const recentErrors = logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    // Thống kê lỗi phổ biến nhất
    const errorCounts = logs.reduce((acc, log) => {
      acc[log.message] = (acc[log.message] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topErrors = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));

    return {
      totalErrors: logs.length,
      errorsByCategory,
      errorsBySeverity,
      recentErrors,
      topErrors
    };
  }

  /**
   * Xóa tất cả error logs
   */
  public clearErrorLogs(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear error logs:', error);
    }
  }

  /**
   * Xuất error logs dưới dạng JSON
   */
  public exportErrorLogs(): string {
    const logs = this.getErrorLogs();
    const stats = this.getErrorStats();
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      stats,
      logs
    }, null, 2);
  }

  /**
   * Gửi error logs đến server (để tích hợp sau)
   */
  public async sendErrorLogsToServer(): Promise<boolean> {
    const logs = this.getErrorLogs();
    
    if (logs.length === 0) {
      return true;
    }

    let retryCount = 0;
    
    while (retryCount < this.MAX_RETRIES) {
      try {
        // Gửi logs lên server với retry logic
        const response = await fetch('/api/error-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.getAuthToken() || ''
          },
          body: JSON.stringify({ 
            logs,
            timestamp: new Date().toISOString(),
            source: 'web-client',
            version: import.meta.env.VITE_APP_VERSION || '1.0.0'
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Error logs sent successfully:', result);
          
          // Xóa logs đã gửi thành công
          this.clearErrorLogs();
          return true;
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (error) {
        retryCount++;
        console.error(`Failed to send error logs (attempt ${retryCount}/${this.MAX_RETRIES}):`, error);
        
        if (retryCount < this.MAX_RETRIES) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, retryCount - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Nếu không gửi được sau MAX_RETRIES lần thử
    console.error('Failed to send error logs after all retries');
    
    // Lưu logs vào IndexedDB hoặc queue để gửi lại sau
    await this.saveLogsForLaterRetry(logs);
    
    return false;
  }

  // Private methods

  private saveErrorLog(errorLog: ErrorLog): void {
    try {
      const existingLogs = this.getErrorLogs();
      existingLogs.push(errorLog);
      
      // Giữ lại chỉ MAX_LOGS logs gần nhất
      if (existingLogs.length > this.MAX_LOGS) {
        existingLogs.splice(0, existingLogs.length - this.MAX_LOGS);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to save error log:', error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | null {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.user?.id || null;
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  }

  private logToConsole(errorLog: ErrorLog): void {
    const style = this.getConsoleStyle(errorLog.severity);
    
    console.group(`%c🚨 Error Log [${errorLog.severity.toUpperCase()}]`, style);
    console.error('Message:', errorLog.message);
    console.error('Context:', errorLog.context);
    console.error('Category:', errorLog.category);
    console.error('Timestamp:', errorLog.timestamp);
    if (errorLog.stack) {
      console.error('Stack:', errorLog.stack);
    }
    if (errorLog.componentStack) {
      console.error('Component Stack:', errorLog.componentStack);
    }
    if (errorLog.metadata) {
      console.error('Metadata:', errorLog.metadata);
    }
    console.groupEnd();
  }

  private getConsoleStyle(severity: ErrorLog['severity']): string {
    const styles = {
      low: 'color: #f59e0b; font-weight: bold;',
      medium: 'color: #f97316; font-weight: bold;',
      high: 'color: #dc2626; font-weight: bold;',
      critical: 'color: #991b1b; font-weight: bold; background: #fef2f2; padding: 2px 4px;'
    };
    return styles[severity];
  }

  private notifyIfCritical(errorLog: ErrorLog): void {
    if (errorLog.severity === 'critical') {
      console.error('🚨 CRITICAL ERROR DETECTED:', errorLog.message);
      
      // Gửi notification ngay lập tức
      this.sendImmediateNotification(errorLog);
      
      // Hiển thị toast notification cho user
      this.showUserNotification(errorLog);
      
      // Gửi email alert cho admin (nếu có)
      this.sendAdminAlert(errorLog);
    }
  }

  /**
   * Gửi notification ngay lập tức cho critical errors
   */
  private async sendImmediateNotification(errorLog: ErrorLog): Promise<void> {
    try {
      // Gửi lên server để xử lý notification
      await fetch('/api/notifications/critical-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthToken() || ''
        },
        body: JSON.stringify({
          errorLog,
          urgency: 'critical',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send immediate notification:', error);
    }
  }

  /**
   * Hiển thị notification cho user
   */
  private showUserNotification(errorLog: ErrorLog): void {
    // Sử dụng browser notification API nếu được phép
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Lỗi hệ thống', {
        body: 'Đã xảy ra lỗi nghiêm trọng. Vui lòng tải lại trang hoặc liên hệ hỗ trợ.',
        icon: '/favicon.ico',
        tag: 'critical-error'
      });
    }
    
    // Dispatch custom event để UI components có thể lắng nghe
    window.dispatchEvent(new CustomEvent('criticalError', {
      detail: {
        message: 'Đã xảy ra lỗi nghiêm trọng. Vui lòng tải lại trang.',
        errorId: errorLog.id,
        timestamp: errorLog.timestamp
      }
    }));
  }

  /**
   * Gửi alert cho admin
   */
  private async sendAdminAlert(errorLog: ErrorLog): Promise<void> {
    try {
      // Gửi email/SMS alert cho admin
      await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthToken() || ''
        },
        body: JSON.stringify({
          type: 'critical_error',
          errorLog,
          environment: import.meta.env.MODE,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send admin alert:', error);
    }
  }

  /**
   * Lấy auth token từ localStorage
   */
  private getAuthToken(): string | null {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.token || null;
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  }

  /**
   * Lưu logs để retry sau
   */
  private async saveLogsForLaterRetry(logs: ErrorLog[]): Promise<void> {
    try {
      const retryLogs = {
        logs,
        timestamp: new Date().toISOString(),
        retryCount: 0
      };
      
      localStorage.setItem('pendingErrorLogs', JSON.stringify(retryLogs));
      
      // Schedule retry sau 5 phút
      setTimeout(() => {
        this.retryPendingLogs();
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error('Failed to save logs for retry:', error);
    }
  }

  /**
   * Retry gửi logs đã pending
   */
  private async retryPendingLogs(): Promise<void> {
    try {
      const pendingData = localStorage.getItem('pendingErrorLogs');
      if (!pendingData) return;
      
      const { logs, retryCount } = JSON.parse(pendingData);
      
      if (retryCount >= this.MAX_RETRIES) {
        localStorage.removeItem('pendingErrorLogs');
        return;
      }
      
      const success = await this.sendErrorLogsToServer();
      
      if (!success) {
        // Tăng retry count và lưu lại
        const updatedData = {
          logs,
          timestamp: new Date().toISOString(),
          retryCount: retryCount + 1
        };
        localStorage.setItem('pendingErrorLogs', JSON.stringify(updatedData));
        
        // Schedule retry tiếp theo
        setTimeout(() => {
          this.retryPendingLogs();
        }, 10 * 60 * 1000); // 10 phút
      } else {
        localStorage.removeItem('pendingErrorLogs');
      }
    } catch (error) {
      console.error('Failed to retry pending logs:', error);
    }
  }
}

// Singleton instance
export const errorLogger = new ErrorLoggerService();

// Global error handler
window.addEventListener('error', (event) => {
  errorLogger.logError(
    new Error(event.message),
    'Global Error Handler',
    'high',
    'javascript',
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
  );
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  errorLogger.logError(
    new Error(event.reason?.message || 'Unhandled Promise Rejection'),
    'Unhandled Promise Rejection',
    'high',
    'javascript',
    {
      reason: event.reason,
      promise: event.promise
    }
  );
});

export default errorLogger;
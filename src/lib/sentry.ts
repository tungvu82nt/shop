import * as Sentry from '@sentry/react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import React from 'react';

// Cấu hình Sentry cho error monitoring và performance tracking
export const initSentry = () => {
  // Chỉ khởi tạo Sentry khi có DSN hợp lệ
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn || dsn === 'your_sentry_dsn_here') {
    console.log('Sentry không được khởi tạo - DSN không hợp lệ hoặc chưa được cấu hình');
    return;
  }

  Sentry.init({
    dsn: dsn,
    environment: import.meta.env.MODE,
    
    // Tích hợp performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% trong production, 100% trong development
    
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% của sessions
    replaysOnErrorSampleRate: 1.0, // 100% khi có lỗi

    // Cấu hình release tracking
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // Lọc lỗi không cần thiết
    beforeSend(event, hint) {
      // Bỏ qua các lỗi từ extensions hoặc scripts bên thứ ba
      if (event.exception) {
        const error = hint.originalException;
        if (error && error.stack) {
          // Bỏ qua lỗi từ browser extensions
          if (error.stack.includes('extension://') || 
              error.stack.includes('chrome-extension://') ||
              error.stack.includes('moz-extension://')) {
            return null;
          }
          
          // Bỏ qua lỗi network thông thường
          if (error.message && (
            error.message.includes('Network Error') ||
            error.message.includes('Failed to fetch') ||
            error.message.includes('Load failed')
          )) {
            return null;
          }
        }
      }
      
      return event;
    },

    // Cấu hình user context
    initialScope: {
      tags: {
        component: 'yapee-vietnam-clone',
        platform: 'web'
      }
    }
  });

  // Log khởi tạo thành công
  console.log('Sentry đã được khởi tạo thành công');
};

// Helper functions để sử dụng Sentry
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureMessage(message, level);
  });
};

export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

export const addBreadcrumb = (message: string, category: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000
  });
};

// React Error Boundary với Sentry
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// HOC để wrap components với Sentry profiling
export const withSentryProfiling = Sentry.withProfiler;

export { Sentry };
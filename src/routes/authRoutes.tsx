import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy import các trang authentication
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('@/pages/auth/ResetPasswordPage'));

/**
 * AuthRoutes - Định nghĩa các route cho hệ thống xác thực
 * Bao gồm: đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu
 */
const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Trang đăng ký */}
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Trang quên mật khẩu */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Trang đặt lại mật khẩu */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default AuthRoutes;
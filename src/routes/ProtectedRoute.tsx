import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Nếu cần authentication nhưng user chưa đăng nhập
  if (requireAuth && !user) {
    // Lưu trang hiện tại để redirect sau khi đăng nhập
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Nếu không cần authentication hoặc user đã đăng nhập
  return <>{children}</>;
};

export default ProtectedRoute;
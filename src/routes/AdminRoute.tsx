import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Kiểm tra user có tồn tại và có role admin không
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Kiểm tra role admin (giả sử role được lưu trong user.role)
  if (user.role !== 'admin' && user.role !== 'moderator') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { securityService } from '../../services/securityService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Interfaces
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string[];
  requireVerification?: boolean;
  redirectTo?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerification?: boolean;
}

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

// Loading Component
const AuthLoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
      <p className="mt-2 text-sm text-gray-600">Đang xác thực...</p>
    </div>
  </div>
);

// Unauthorized Component
const UnauthorizedAccess: React.FC<{ message?: string }> = ({ 
  message = "Bạn không có quyền truy cập trang này" 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Truy cập bị từ chối</h1>
      <p className="text-gray-600 mb-4">{message}</p>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Quay lại
      </button>
    </div>
  </div>
);

// Main Auth Guard Component
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireRole = [],
  requireVerification = false,
  redirectTo = '/auth/login'
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        // Check if authentication is required
        if (!requireAuth) {
          setHasAccess(true);
          setIsValidating(false);
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          setHasAccess(false);
          setIsValidating(false);
          return;
        }

        // Validate session security
        const sessionValid = securityService.validateSession();
        if (!sessionValid) {
          toast.error('Phiên đăng nhập đã hết hạn');
          setHasAccess(false);
          setIsValidating(false);
          return;
        }

        // Check for suspicious activity
        if (securityService.detectSuspiciousActivity()) {
          toast.error('Phát hiện hoạt động bất thường');
          securityService.logSecurityEvent('SUSPICIOUS_ACCESS_ATTEMPT', {
            userId: user.id,
            path: location.pathname
          });
          setHasAccess(false);
          setIsValidating(false);
          return;
        }

        // Check role requirements
        if (requireRole.length > 0) {
          const userRole = user.role || 'user';
          if (!requireRole.includes(userRole)) {
            toast.error('Bạn không có quyền truy cập trang này');
            securityService.logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
              userId: user.id,
              userRole,
              requiredRoles: requireRole,
              path: location.pathname
            });
            setHasAccess(false);
            setIsValidating(false);
            return;
          }
        }

        // Check email verification requirement
        if (requireVerification && !user.emailVerified) {
          toast.warning('Vui lòng xác thực email để tiếp tục');
          setHasAccess(false);
          setIsValidating(false);
          return;
        }

        // All checks passed
        setHasAccess(true);
        setIsValidating(false);

      } catch (error) {
        console.error('Auth validation error:', error);
        securityService.logSecurityEvent('AUTH_VALIDATION_ERROR', {
          error: error instanceof Error ? error.message : 'Unknown error',
          path: location.pathname
        });
        setHasAccess(false);
        setIsValidating(false);
      }
    };

    if (!isLoading) {
      validateAccess();
    }
  }, [isLoading, isAuthenticated, user, requireAuth, requireRole, requireVerification, location.pathname]);

  // Show loading while validating
  if (isLoading || isValidating) {
    return <AuthLoadingSpinner />;
  }

  // Redirect if no access
  if (!hasAccess) {
    if (requireAuth && !isAuthenticated) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    
    if (requireVerification && user && !user.emailVerified) {
      return <Navigate to="/auth/verify-email" state={{ from: location }} replace />;
    }
    
    return <UnauthorizedAccess />;
  }

  return <>{children}</>;
};

// Protected Route Component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireVerification = false
}) => {
  return (
    <AuthGuard
      requireAuth={true}
      requireRole={allowedRoles}
      requireVerification={requireVerification}
    >
      {children}
    </AuthGuard>
  );
};

// Admin Guard Component
export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  fallback
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return fallback ? <>{fallback}</> : <UnauthorizedAccess message="Chỉ quản trị viên mới có thể truy cập" />;
  }
  
  return <>{children}</>;
};

// Guest Guard Component (for login/register pages)
export const GuestGuard: React.FC<GuestGuardProps> = ({
  children,
  redirectTo = '/'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }
  
  if (isAuthenticated) {
    // Redirect to intended destination or home
    const from = (location.state as any)?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }
  
  return <>{children}</>;
};

// Role-based Component Wrapper
export const RoleBasedAccess: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}> = ({ children, allowedRoles, fallback = null }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }
  
  const userRole = user.role || 'user';
  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Permission-based Component Wrapper
export const PermissionBasedAccess: React.FC<{
  children: React.ReactNode;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
}> = ({ children, requiredPermissions, fallback = null }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }
  
  // Check if user has all required permissions
  const userPermissions = user.permissions || [];
  const hasAllPermissions = requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
  
  if (!hasAllPermissions) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Security Alert Component
export const SecurityAlert: React.FC<{
  show: boolean;
  message: string;
  onClose: () => void;
}> = ({ show, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Cảnh báo bảo mật</h3>
        </div>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for checking permissions
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    const userPermissions = user.permissions || [];
    return userPermissions.includes(permission);
  };
  
  const hasRole = (role: string): boolean => {
    if (!isAuthenticated || !user) return false;
    return user.role === role;
  };
  
  const hasAnyRole = (roles: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return roles.includes(user.role || 'user');
  };
  
  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('admin'),
    isModerator: hasRole('moderator'),
    isUser: hasRole('user')
  };
};

// Export all components
export default AuthGuard;
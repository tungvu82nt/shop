import React, { createContext, useContext, useEffect, useState } from 'react';
import { Shield, Lock, AlertTriangle, User, Crown, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// Types for roles and permissions
export type UserRole = 'guest' | 'customer' | 'vendor' | 'admin' | 'super_admin';

export type Permission = 
  | 'view_products'
  | 'purchase_products'
  | 'manage_profile'
  | 'view_orders'
  | 'manage_orders'
  | 'manage_products'
  | 'manage_inventory'
  | 'view_analytics'
  | 'manage_users'
  | 'manage_categories'
  | 'manage_coupons'
  | 'manage_system_settings'
  | 'view_admin_dashboard'
  | 'manage_vendors'
  | 'manage_payments'
  | 'manage_shipping'
  | 'view_reports'
  | 'manage_reviews'
  | 'manage_notifications';

interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  emailVerified: boolean;
}

interface RoleContextType {
  user: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [
    'view_products'
  ],
  customer: [
    'view_products',
    'purchase_products',
    'manage_profile',
    'view_orders',
    'manage_reviews'
  ],
  vendor: [
    'view_products',
    'purchase_products',
    'manage_profile',
    'view_orders',
    'manage_orders',
    'manage_products',
    'manage_inventory',
    'view_analytics',
    'manage_reviews'
  ],
  admin: [
    'view_products',
    'purchase_products',
    'manage_profile',
    'view_orders',
    'manage_orders',
    'manage_products',
    'manage_inventory',
    'view_analytics',
    'manage_users',
    'manage_categories',
    'manage_coupons',
    'view_admin_dashboard',
    'manage_vendors',
    'manage_payments',
    'manage_shipping',
    'view_reports',
    'manage_reviews',
    'manage_notifications'
  ],
  super_admin: [
    'view_products',
    'purchase_products',
    'manage_profile',
    'view_orders',
    'manage_orders',
    'manage_products',
    'manage_inventory',
    'view_analytics',
    'manage_users',
    'manage_categories',
    'manage_coupons',
    'manage_system_settings',
    'view_admin_dashboard',
    'manage_vendors',
    'manage_payments',
    'manage_shipping',
    'view_reports',
    'manage_reviews',
    'manage_notifications'
  ]
};

// Create Role Context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Role Provider Component
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const userWithPermissions = {
          ...userData,
          permissions: ROLE_PERMISSIONS[userData.role] || ROLE_PERMISSIONS.guest
        };
        setUser(userWithPermissions);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await loadUser();
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <RoleContext.Provider value={{
      user,
      hasPermission,
      hasRole,
      isLoading,
      refreshUser
    }}>
      {children}
    </RoleContext.Provider>
  );
};

// Hook to use role context
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Permission Guard Component
interface PermissionGuardProps {
  permission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback,
  showError = false
}) => {
  const { hasPermission, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasRequiredPermission = Array.isArray(permission)
    ? permission.some(p => hasPermission(p))
    : hasPermission(permission);

  if (!hasRequiredPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showError) {
      return (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Bạn không có quyền truy cập vào tính năng này.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
};

// Role Guard Component
interface RoleGuardProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  role,
  children,
  fallback,
  showError = false
}) => {
  const { hasRole, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasRole(role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showError) {
      return (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Bạn không có vai trò phù hợp để truy cập tính năng này.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
};

// Authentication Guard Component
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireEmailVerification?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requireEmailVerification = false
}) => {
  const { user, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle>Yêu cầu đăng nhập</CardTitle>
          </div>
          <CardDescription>
            Bạn cần đăng nhập để truy cập tính năng này.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => window.location.href = '/login'}>
            Đăng nhập ngay
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (requireEmailVerification && !user.emailVerified) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle>Yêu cầu xác minh email</CardTitle>
          </div>
          <CardDescription>
            Bạn cần xác minh email để sử dụng tính năng này.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => window.location.href = '/verify-email'}>
            Xác minh email
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!user.isActive) {
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

// Role Badge Component
interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return {
          label: 'Super Admin',
          icon: <Crown className="h-3 w-3" />,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'admin':
        return {
          label: 'Admin',
          icon: <Settings className="h-3 w-3" />,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'vendor':
        return {
          label: 'Vendor',
          icon: <Shield className="h-3 w-3" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'customer':
        return {
          label: 'Customer',
          icon: <User className="h-3 w-3" />,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'guest':
      default:
        return {
          label: 'Guest',
          icon: <User className="h-3 w-3" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getRoleConfig(role);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : size === 'lg' ? 'text-sm px-3 py-2' : 'text-xs px-2.5 py-1.5';

  return (
    <Badge className={`${config.className} ${sizeClass} flex items-center space-x-1`}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};

// Permission List Component
interface PermissionListProps {
  role: UserRole;
  showTitle?: boolean;
}

export const PermissionList: React.FC<PermissionListProps> = ({ role, showTitle = true }) => {
  const permissions = ROLE_PERMISSIONS[role] || [];

  const getPermissionLabel = (permission: Permission): string => {
    const labels: Record<Permission, string> = {
      'view_products': 'Xem sản phẩm',
      'purchase_products': 'Mua sản phẩm',
      'manage_profile': 'Quản lý hồ sơ',
      'view_orders': 'Xem đơn hàng',
      'manage_orders': 'Quản lý đơn hàng',
      'manage_products': 'Quản lý sản phẩm',
      'manage_inventory': 'Quản lý kho',
      'view_analytics': 'Xem thống kê',
      'manage_users': 'Quản lý người dùng',
      'manage_categories': 'Quản lý danh mục',
      'manage_coupons': 'Quản lý mã giảm giá',
      'manage_system_settings': 'Quản lý hệ thống',
      'view_admin_dashboard': 'Xem bảng điều khiển',
      'manage_vendors': 'Quản lý nhà cung cấp',
      'manage_payments': 'Quản lý thanh toán',
      'manage_shipping': 'Quản lý vận chuyển',
      'view_reports': 'Xem báo cáo',
      'manage_reviews': 'Quản lý đánh giá',
      'manage_notifications': 'Quản lý thông báo'
    };
    return labels[permission] || permission;
  };

  return (
    <div className="space-y-2">
      {showTitle && (
        <h4 className="font-medium text-sm flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Quyền của vai trò {role}:</span>
        </h4>
      )}
      <div className="grid grid-cols-2 gap-2">
        {permissions.map((permission) => (
          <div key={permission} className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{getPermissionLabel(permission)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Higher-Order Component for role-based access
export const withRoleAccess = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: UserRole | UserRole[],
  fallback?: React.ComponentType
) => {
  return (props: P) => (
    <RoleGuard role={requiredRole} fallback={fallback ? <fallback /> : undefined}>
      <Component {...props} />
    </RoleGuard>
  );
};

// Higher-Order Component for permission-based access
export const withPermissionAccess = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission | Permission[],
  fallback?: React.ComponentType
) => {
  return (props: P) => (
    <PermissionGuard permission={requiredPermission} fallback={fallback ? <fallback /> : undefined}>
      <Component {...props} />
    </PermissionGuard>
  );
};

export default RoleBasedAccess;

// Utility functions
export const getRoleHierarchy = (): UserRole[] => {
  return ['guest', 'customer', 'vendor', 'admin', 'super_admin'];
};

export const isRoleHigherThan = (role1: UserRole, role2: UserRole): boolean => {
  const hierarchy = getRoleHierarchy();
  return hierarchy.indexOf(role1) > hierarchy.indexOf(role2);
};

export const canManageUser = (currentUserRole: UserRole, targetUserRole: UserRole): boolean => {
  // Super admin can manage everyone
  if (currentUserRole === 'super_admin') return true;
  
  // Admin can manage everyone except super admin
  if (currentUserRole === 'admin' && targetUserRole !== 'super_admin') return true;
  
  // Vendor can only manage their own profile
  if (currentUserRole === 'vendor' && targetUserRole === 'vendor') return false;
  
  return false;
};
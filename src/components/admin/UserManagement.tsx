import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  MoreHorizontal,
  Download,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  UserCheck,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { supabase } from '../../lib/supabase';

interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  postalCode?: string;
  isDefault: boolean;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  favoriteCategories: string[];
  loyaltyPoints: number;
  reviewsCount: number;
  averageRating: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  role: 'customer' | 'vendor' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  addresses: UserAddress[];
  stats: UserStats;
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    marketing: boolean;
  };
  lastLoginAt?: string;
  lastActiveAt?: string;
  registrationSource: 'web' | 'mobile' | 'social' | 'admin';
  referralCode?: string;
  referredBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserManagementProps {
  onUserSelect?: (user: User) => void;
}

// Mock data cho users
const mockUsers: User[] = [
  {
    id: '1',
    email: 'nguyen.van.an@email.com',
    firstName: 'An',
    lastName: 'Nguyễn Văn',
    fullName: 'Nguyễn Văn An',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    role: 'customer',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    addresses: [],
    stats: {
      totalOrders: 12,
      totalSpent: 2450000,
      averageOrderValue: 204167,
      lastOrderDate: '2024-03-10',
      favoriteCategories: ['Điện thoại', 'Laptop'],
      loyaltyPoints: 245,
      reviewsCount: 8,
      averageRating: 4.5
    },
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      marketing: true
    },
    lastLoginAt: '2024-03-15T14:30:00Z',
    lastActiveAt: '2024-03-15T15:45:00Z',
    registrationSource: 'web',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-15T15:45:00Z'
  },
  {
    id: '2',
    email: 'tran.thi.binh@email.com',
    firstName: 'Bình',
    lastName: 'Trần Thị',
    fullName: 'Trần Thị Bình',
    phone: '0912345678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    dateOfBirth: '1985-08-22',
    gender: 'female',
    role: 'vendor',
    status: 'active',
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: true,
    addresses: [],
    stats: {
      totalOrders: 8,
      totalSpent: 1200000,
      averageOrderValue: 150000,
      lastOrderDate: '2024-03-12',
      favoriteCategories: ['Thời trang', 'Mỹ phẩm'],
      loyaltyPoints: 120,
      reviewsCount: 5,
      averageRating: 4.2
    },
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      marketing: false
    },
    lastLoginAt: '2024-03-15T09:15:00Z',
    lastActiveAt: '2024-03-15T10:30:00Z',
    registrationSource: 'mobile',
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '3',
    email: 'le.minh.cuong@email.com',
    firstName: 'Cường',
    lastName: 'Lê Minh',
    fullName: 'Lê Minh Cường',
    phone: '0923456789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    dateOfBirth: '1992-12-03',
    gender: 'male',
    role: 'customer',
    status: 'suspended',
    emailVerified: false,
    phoneVerified: true,
    twoFactorEnabled: false,
    addresses: [],
    stats: {
      totalOrders: 3,
      totalSpent: 450000,
      averageOrderValue: 150000,
      lastOrderDate: '2024-02-15',
      favoriteCategories: ['Điện tử'],
      loyaltyPoints: 45,
      reviewsCount: 1,
      averageRating: 3.0
    },
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: false,
        sms: true,
        push: false
      },
      marketing: false
    },
    lastLoginAt: '2024-03-10T16:45:00Z',
    lastActiveAt: '2024-03-10T17:00:00Z',
    registrationSource: 'social',
    notes: 'Tài khoản bị tạm khóa do vi phạm chính sách',
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-03-10T17:00:00Z'
  },
  {
    id: '4',
    email: 'pham.thi.dung@email.com',
    firstName: 'Dung',
    lastName: 'Phạm Thị',
    fullName: 'Phạm Thị Dung',
    phone: '0934567890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    dateOfBirth: '1995-06-18',
    gender: 'female',
    role: 'customer',
    status: 'inactive',
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    addresses: [],
    stats: {
      totalOrders: 1,
      totalSpent: 150000,
      averageOrderValue: 150000,
      lastOrderDate: '2024-03-02',
      favoriteCategories: ['Sách'],
      loyaltyPoints: 15,
      reviewsCount: 0,
      averageRating: 0
    },
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: true,
        push: false
      },
      marketing: true
    },
    lastLoginAt: '2024-03-05T11:20:00Z',
    lastActiveAt: '2024-03-05T11:45:00Z',
    registrationSource: 'web',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-05T11:45:00Z'
  },
  {
    id: '5',
    email: 'hoang.van.em@email.com',
    firstName: 'Em',
    lastName: 'Hoàng Văn',
    fullName: 'Hoàng Văn Em',
    phone: '0945678901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    dateOfBirth: '1988-03-25',
    gender: 'male',
    role: 'admin',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true,
    addresses: [],
    stats: {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      favoriteCategories: [],
      loyaltyPoints: 0,
      reviewsCount: 0,
      averageRating: 0
    },
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      marketing: false
    },
    lastLoginAt: '2024-03-15T15:00:00Z',
    lastActiveAt: '2024-03-15T16:30:00Z',
    registrationSource: 'admin',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-03-15T16:30:00Z'
  }
];

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getStatusBadgeVariant = (status: User['status']) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'suspended':
      return 'destructive';
    case 'banned':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getRoleBadgeVariant = (role: User['role']) => {
  switch (role) {
    case 'super_admin':
      return 'destructive';
    case 'admin':
      return 'destructive';
    case 'vendor':
      return 'default';
    case 'customer':
      return 'secondary';
    default:
      return 'secondary';
  }
};

// Custom hook for user management
const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // NOTE: Cần tích hợp với API backend để lấy danh sách người dùng thực tế
      // Ví dụ: const response = await fetch('/api/users');
      // const users = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: User['status']) => {
    try {
      // NOTE: Cần tích hợp với API backend để cập nhật trạng thái người dùng
      // Ví dụ: await fetch(`/api/users/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status, updatedAt: new Date().toISOString() } : user
      ));
    } catch (err) {
      throw new Error('Không thể cập nhật trạng thái người dùng');
    }
  };

  const updateUserRole = async (userId: string, role: User['role']) => {
    try {
      // NOTE: Cần tích hợp với API backend để cập nhật vai trò người dùng
      // Ví dụ: await fetch(`/api/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role, updatedAt: new Date().toISOString() } : user
      ));
    } catch (err) {
      throw new Error('Không thể cập nhật vai trò người dùng');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // NOTE: Cần tích hợp với API backend để xóa người dùng
      // Ví dụ: await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      throw new Error('Không thể xóa người dùng');
    }
  };

  const exportUsers = async (format: 'csv' | 'excel') => {
    try {
      // NOTE: Cần tích hợp với API backend để xuất dữ liệu người dùng
      // Ví dụ: const response = await fetch(`/api/users/export?format=${format}`);
      // const blob = await response.blob();
      // Tạo link download và trigger download
      console.log(`Exporting users as ${format}`);
    } catch (err) {
      throw new Error('Không thể xuất dữ liệu người dùng');
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    exportUsers
  };
};

const UserManagement: React.FC<UserManagementProps> = ({ onUserSelect }) => {
  const { toast } = useToast();
  const {
    users,
    loading,
    error,
    fetchUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    exportUsers
  } = useUserManagement();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<User['status'] | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt' | 'lastLoginAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'suspend' | 'delete'>('activate');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [exportRange, setExportRange] = useState<'all' | 'filtered' | 'selected'>('all');
  const [bulkRole, setBulkRole] = useState<User['role']>('customer');

  // Filter and sort users
  const filteredAndSortedUsers = React.useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm));
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'lastLoginAt':
          aValue = a.lastLoginAt ? new Date(a.lastLoginAt) : new Date(0);
          bValue = b.lastLoginAt ? new Date(b.lastLoginAt) : new Date(0);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, statusFilter, roleFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Effects
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter]);

  // Event handlers
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
    onUserSelect?.(user);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await updateUserStatus(userId, newStatus);
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật trạng thái người dùng'
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive'
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật vai trò người dùng'
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive'
      });
    }
  };

  const handleBulkAction = async () => {
    try {
      for (const userId of selectedUsers) {
        switch (bulkAction) {
          case 'activate':
            await updateUserStatus(userId, 'active');
            break;
          case 'deactivate':
            await updateUserStatus(userId, 'inactive');
            break;
          case 'suspend':
            await updateUserStatus(userId, 'suspended');
            break;
          case 'delete':
            await deleteUser(userId);
            break;
        }
      }
      setSelectedUsers([]);
      setIsBulkActionDialogOpen(false);
      toast({
        title: 'Thành công',
        description: `Đã thực hiện hành động cho ${selectedUsers.length} người dùng`
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive'
      });
    }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    setIsExporting(true);
    try {
      await exportUsers(format);
      toast({
        title: 'Thành công',
        description: `Đã xuất dữ liệu người dùng dạng ${format.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: 'Thành công',
        description: 'Đã xóa người dùng'
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive'
      });
    }
  };

  // Thống kê users
  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    banned: users.filter(u => u.status === 'banned').length,
    customers: users.filter(u => u.role === 'customer').length,
    vendors: users.filter(u => u.role === 'vendor').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản và quyền hạn của người dùng
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Button onClick={() => fetchUsers()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats.active} đang hoạt động
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.customers}</div>
            <p className="text-xs text-muted-foreground">
              {((userStats.customers / userStats.total) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhà bán hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.vendors}</div>
            <p className="text-xs text-muted-foreground">
              {((userStats.vendors / userStats.total) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản trị viên</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.admins}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.suspended} bị tạm khóa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
            {selectedUsers.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setIsBulkActionDialogOpen(true)}
              >
                Thao tác hàng loạt ({selectedUsers.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="suspended">Bị tạm khóa</SelectItem>
                  <SelectItem value="banned">Bị cấm</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="customer">Khách hàng</SelectItem>
                  <SelectItem value="vendor">Nhà bán hàng</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="super_admin">Quản trị cấp cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Hiển thị {paginatedUsers.length} trong tổng số {filteredAndSortedUsers.length} người dùng
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="createdAt">Ngày tạo</SelectItem>
                    <SelectItem value="lastLoginAt">Lần cuối đăng nhập</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredAndSortedUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAllUsers}
                    className="rounded border border-input"
                  />
                </TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thống kê</TableHead>
                <TableHead>Lần cuối đăng nhập</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border border-input"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.phone && (
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === 'customer' && 'Khách hàng'}
                      {user.role === 'vendor' && 'Nhà bán hàng'}
                      {user.role === 'admin' && 'Quản trị viên'}
                      {user.role === 'super_admin' && 'Quản trị cấp cao'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status === 'active' && (
                        <><CheckCircle className="w-3 h-3 mr-1" />Hoạt động</>
                      )}
                      {user.status === 'inactive' && (
                        <><XCircle className="w-3 h-3 mr-1" />Không hoạt động</>
                      )}
                      {user.status === 'suspended' && (
                        <><Ban className="w-3 h-3 mr-1" />Bị tạm khóa</>
                      )}
                      {user.status === 'banned' && (
                        <><AlertTriangle className="w-3 h-3 mr-1" />Bị cấm</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.stats.totalOrders} đơn hàng</div>
                      <div className="text-muted-foreground">{formatCurrency(user.stats.totalSpent)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : (
                      <span className="text-muted-foreground">Chưa đăng nhập</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
                          handleStatusChange(user.id, newStatus);
                        }}>
                          {user.status === 'suspended' ? (
                            <><UserCheck className="mr-2 h-4 w-4" />Kích hoạt</>
                          ) : (
                            <><Ban className="mr-2 h-4 w-4" />Tạm khóa</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} trong tổng số {filteredAndSortedUsers.length} người dùng
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const distance = Math.abs(page - currentPage);
                    return distance === 0 || distance === 1 || page === 1 || page === totalPages;
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                      {selectedUser.role === 'customer' && 'Khách hàng'}
                      {selectedUser.role === 'vendor' && 'Nhà bán hàng'}
                      {selectedUser.role === 'admin' && 'Quản trị viên'}
                      {selectedUser.role === 'super_admin' && 'Quản trị cấp cao'}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(selectedUser.status)}>
                      {selectedUser.status === 'active' && 'Hoạt động'}
                      {selectedUser.status === 'inactive' && 'Không hoạt động'}
                      {selectedUser.status === 'suspended' && 'Bị tạm khóa'}
                      {selectedUser.status === 'banned' && 'Bị cấm'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="info" className="w-full">
                <TabsList>
                  <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="stats">Thống kê</TabsTrigger>
                  <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
                  <TabsTrigger value="activity">Hoạt động</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Họ tên</Label>
                      <p className="text-sm text-muted-foreground">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Số điện thoại</Label>
                      <p className="text-sm text-muted-foreground">{selectedUser.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ngày sinh</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.dateOfBirth ? formatDate(selectedUser.dateOfBirth) : 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Giới tính</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.gender === 'male' && 'Nam'}
                        {selectedUser.gender === 'female' && 'Nữ'}
                        {selectedUser.gender === 'other' && 'Khác'}
                        {!selectedUser.gender && 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ngày tham gia</Label>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Lần cuối đăng nhập</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Chưa đăng nhập'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email đã xác thực</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.emailVerified ? (
                          <span className="text-green-600">✓ Đã xác thực</span>
                        ) : (
                          <span className="text-red-600">✗ Chưa xác thực</span>
                        )}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng đơn hàng</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedUser.stats.totalOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng chi tiêu</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(selectedUser.stats.totalSpent)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Điểm tích lũy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedUser.stats.loyaltyPoints}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đánh giá trung bình</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedUser.stats.averageRating}/5</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="addresses" className="space-y-4">
                  {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUser.addresses.map((address, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">{address.fullName}</div>
                                <div className="text-sm text-muted-foreground">{address.phone}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {address.address}, {address.ward}, {address.district}, {address.province}
                                </div>
                              </div>
                              {address.isDefault && (
                                <Badge variant="secondary">Mặc định</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có địa chỉ nào
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    Lịch sử hoạt động sẽ được hiển thị ở đây
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Họ tên</Label>
                  <Input
                    id="edit-name"
                    defaultValue={selectedUser.fullName}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={selectedUser.email}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Số điện thoại</Label>
                  <Input
                    id="edit-phone"
                    defaultValue={selectedUser.phone}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Vai trò</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Khách hàng</SelectItem>
                      <SelectItem value="vendor">Nhà bán hàng</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="super_admin">Quản trị cấp cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Trạng thái</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="suspended">Bị tạm khóa</SelectItem>
                      <SelectItem value="banned">Bị cấm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-gender">Giới tính</Label>
                  <Select defaultValue={selectedUser.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-notes">Ghi chú</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Thêm ghi chú về người dùng..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email-verified" defaultChecked={selectedUser.emailVerified} />
                <Label htmlFor="email-verified">Email đã xác thực</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={async () => {
              if (!selectedUser) return;
              
              try {
                setIsLoading(true);
                
                // Tích hợp với Supabase để cập nhật thông tin người dùng
                const { data, error } = await supabase
                  .from('users')
                  .update({
                    first_name: selectedUser.firstName,
                    last_name: selectedUser.lastName,
                    phone: selectedUser.phone,
                    role: selectedUser.role,
                    status: selectedUser.status,
                    email_verified: selectedUser.emailVerified,
                    phone_verified: selectedUser.phoneVerified,
                    two_factor_enabled: selectedUser.twoFactorEnabled,
                    notes: selectedUser.notes,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', selectedUser.id);
                
                if (error) {
                  throw error;
                }
                
                // Cập nhật state local
                setUsers(prev => prev.map(user => 
                  user.id === selectedUser.id ? selectedUser : user
                ));
                
                toast({
                  title: "Thành công",
                  description: "Đã cập nhật thông tin người dùng"
                });
                
                setIsEditDialogOpen(false);
              } catch (error: any) {
                toast({
                  title: "Lỗi",
                  description: error.message || "Không thể cập nhật thông tin người dùng",
                  variant: "destructive"
                });
              } finally {
                setIsLoading(false);
              }
            }}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{getInitials(selectedUser.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.fullName}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={() => {
               if (selectedUser) {
                 handleDeleteUser(selectedUser.id);
               }
               setIsDeleteDialogOpen(false);
             }}>
               Xóa
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thao tác hàng loạt</DialogTitle>
            <DialogDescription>
              Áp dụng thao tác cho {selectedUsers.length} người dùng đã chọn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Chọn thao tác</Label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thao tác" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">Kích hoạt</SelectItem>
                  <SelectItem value="deactivate">Vô hiệu hóa</SelectItem>
                  <SelectItem value="suspend">Tạm khóa</SelectItem>
                  <SelectItem value="delete">Xóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleBulkAction}
              variant={bulkAction === 'delete' ? 'destructive' : 'default'}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xuất dữ liệu người dùng</DialogTitle>
            <DialogDescription>
              Chọn định dạng và các trường dữ liệu muốn xuất
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Định dạng</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Phạm vi dữ liệu</Label>
              <Select value={exportRange} onValueChange={setExportRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả người dùng</SelectItem>
                  <SelectItem value="filtered">Người dùng đã lọc</SelectItem>
                  <SelectItem value="selected">Người dùng đã chọn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => {
              handleExport(exportFormat);
              setIsExportDialogOpen(false);
            }}>
              Xuất dữ liệu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
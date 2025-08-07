#!/usr/bin/env node

/**
 * SHOPY VIETNAM - Auto Component Generator
 * Tự động tạo các component còn thiếu theo kế hoạch
 */

const fs = require('fs');
const path = require('path');

// Component templates
const templates = {
  'src/components/auth/ForgotPasswordForm.tsx': `import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: \`\${window.location.origin}/auth/reset-password\`,
      });

      if (error) throw error;

      setMessage('Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Quên mật khẩu
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        {message && (
          <Alert variant="success">
            {message}
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading || !email}
            className="flex-1"
          >
            {loading ? 'Đang gửi...' : 'Gửi email đặt lại'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </Button>
          )}
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Nhớ mật khẩu?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;`,

  'src/pages/auth/VerifyEmail.tsx': `import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Loader } from '../../components/ui/Loader';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || type !== 'signup') {
          setStatus('error');
          setMessage('Link xác thực không hợp lệ.');
          return;
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Xác thực email thất bại.');
        } else {
          setStatus('success');
          setMessage('Email đã được xác thực thành công!');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage('Có lỗi xảy ra trong quá trình xác thực.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: '' // User needs to provide email
      });

      if (error) throw error;
      
      setMessage('Đã gửi lại email xác thực.');
    } catch (error: any) {
      setMessage('Không thể gửi lại email. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Xác thực Email
          </h2>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          {status === 'loading' && (
            <div className="text-center">
              <Loader className="mx-auto mb-4" />
              <p className="text-gray-600">Đang xác thực email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Alert variant="success">
                {message}
              </Alert>
              <p className="mt-4 text-sm text-gray-600">
                Bạn sẽ được chuyển hướng trong giây lát...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <Alert variant="error">
                {message}
              </Alert>
              
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleResendEmail}
                  className="w-full"
                >
                  Gửi lại email xác thực
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth/login')}
                  className="w-full"
                >
                  Quay lại đăng nhập
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;`,

  'src/components/user/AvatarUpload.tsx': `import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useAuth } from '../../hooks/useAuth';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md'
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      setError('');

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Vui lòng chọn file hình ảnh.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File không được vượt quá 5MB.');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${user?.id}-\${Date.now()}.\${fileExt}\`;
      const filePath = \`avatars/\${fileName}\`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      onAvatarChange?.(avatarUrl);
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className={\`\${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300\`}>
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        onClick={handleClick}
        disabled={uploading}
        variant="outline"
        size="sm"
      >
        {uploading ? 'Đang tải...' : 'Thay đổi ảnh'}
      </Button>

      {error && (
        <Alert variant="error" className="text-sm">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default AvatarUpload;`,

  'src/pages/SearchPage.tsx': `import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/product/ProductCard';
import { SearchFilters } from '../components/search/SearchFilters';
import { SearchInput } from '../components/search/SearchInput';
import { Pagination } from '../components/ui/Pagination';
import { Loader } from '../components/ui/Loader';
import { Alert } from '../components/ui/Alert';
import { Product } from '../types';

const ITEMS_PER_PAGE = 20;

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // Get search parameters
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = Number(searchParams.get('min_price')) || 0;
  const maxPrice = Number(searchParams.get('max_price')) || 0;
  const rating = Number(searchParams.get('rating')) || 0;
  const sortBy = searchParams.get('sort') || 'relevance';
  const page = Number(searchParams.get('page')) || 1;

  // Search function
  const searchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      let queryBuilder = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Text search
      if (query) {
        queryBuilder = queryBuilder.or(
          \`name.ilike.%\${query}%,description.ilike.%\${query}%\`
        );
      }

      // Category filter
      if (category) {
        queryBuilder = queryBuilder.eq('category_id', category);
      }

      // Price range filter
      if (minPrice > 0) {
        queryBuilder = queryBuilder.gte('price', minPrice);
      }
      if (maxPrice > 0) {
        queryBuilder = queryBuilder.lte('price', maxPrice);
      }

      // Rating filter
      if (rating > 0) {
        queryBuilder = queryBuilder.gte('average_rating', rating);
      }

      // Sorting
      switch (sortBy) {
        case 'price_asc':
          queryBuilder = queryBuilder.order('price', { ascending: true });
          break;
        case 'price_desc':
          queryBuilder = queryBuilder.order('price', { ascending: false });
          break;
        case 'rating':
          queryBuilder = queryBuilder.order('average_rating', { ascending: false });
          break;
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
          break;
        default:
          queryBuilder = queryBuilder.order('average_rating', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      queryBuilder = queryBuilder.range(from, to);

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra khi tìm kiếm.');
    } finally {
      setLoading(false);
    }
  };

  // Search when parameters change
  useEffect(() => {
    searchProducts();
  }, [query, category, minPrice, maxPrice, rating, sortBy, page]);

  // Update search parameters
  const updateSearchParams = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset page when filters change
    if (!updates.page) {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {query ? \`Kết quả tìm kiếm cho "\${query}"\` : 'Tìm kiếm sản phẩm'}
        </h1>
        
        <SearchInput
          value={query}
          onChange={(value) => updateSearchParams({ q: value })}
          placeholder="Tìm kiếm sản phẩm..."
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <SearchFilters
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            rating={rating}
            sortBy={sortBy}
            onFiltersChange={updateSearchParams}
          />
        </div>

        {/* Results */}
        <div className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {loading ? 'Đang tìm kiếm...' : \`Tìm thấy \${totalCount} sản phẩm\`}
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          )}

          {/* No Results */}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
              <p className="text-gray-400 mt-2">Thử thay đổi từ khóa hoặc bộ lọc.</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => updateSearchParams({ page: newPage })}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;`,

  'src/pages/admin/Dashboard.tsx': `import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { SalesChart } from '../../components/admin/SalesChart';
import { RecentOrders } from '../../components/admin/RecentOrders';
import { TopProducts } from '../../components/admin/TopProducts';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all stats in parallel
      const [usersResult, productsResult, ordersResult, revenueResult, todayOrdersResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').eq('status', 'completed'),
        supabase.from('orders')
          .select('id, total_amount')
          .gte('created_at', new Date().toISOString().split('T')[0])
      ]);

      // Calculate stats
      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const todayRevenue = todayOrdersResult.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalRevenue,
        todayOrders: todayOrdersResult.data?.length || 0,
        todayRevenue
      });
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert variant="error">
          {error}
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Tổng quan về hoạt động của cửa hàng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Tổng người dùng"
            value={stats?.totalUsers || 0}
            icon="users"
            color="blue"
          />
          <StatsCard
            title="Tổng sản phẩm"
            value={stats?.totalProducts || 0}
            icon="package"
            color="green"
          />
          <StatsCard
            title="Tổng đơn hàng"
            value={stats?.totalOrders || 0}
            icon="shopping-cart"
            color="yellow"
          />
          <StatsCard
            title="Doanh thu"
            value={\`\${(stats?.totalRevenue || 0).toLocaleString('vi-VN')} ₫\`}
            icon="dollar-sign"
            color="purple"
          />
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Đơn hàng hôm nay"
            value={stats?.todayOrders || 0}
            icon="calendar"
            color="indigo"
          />
          <StatsCard
            title="Doanh thu hôm nay"
            value={\`\${(stats?.todayRevenue || 0).toLocaleString('vi-VN')} ₫\`}
            icon="trending-up"
            color="pink"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Doanh thu 7 ngày qua</h2>
            <SalesChart />
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h2>
            <TopProducts />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h2>
          <RecentOrders />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;`
};

// Function to create directory if it doesn't exist
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Đã tạo thư mục: ${dir}`);
  }
}

// Function to create a single file
function createFile(filePath, content) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`⚠️ File đã tồn tại: ${filePath}`);
      return false;
    }

    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Đã tạo: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi tạo file ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('\n🚀 TẠO CÁC COMPONENT CẦN THIẾT\n');

  let createdCount = 0;
  let skippedCount = 0;

  // Create all templates
  Object.entries(templates).forEach(([filePath, content]) => {
    const created = createFile(filePath, content);
    if (created) {
      createdCount++;
    } else {
      skippedCount++;
    }
  });

  console.log('\n🚀 TỔNG KẾT');
  console.log(`✅ Đã tạo: ${createdCount} file`);
  console.log(`⚠️ Đã bỏ qua: ${skippedCount} file (đã tồn tại)`);
  
  if (createdCount > 0) {
    console.log('\nℹ️ ');
    console.log('📝 Các bước tiếp theo:');
    console.log('1. Kiểm tra và chỉnh sửa các component vừa tạo');
    console.log('2. Thêm routing cho các page mới');
    console.log('3. Test các component: npm run test');
    console.log('4. Commit changes: git add . && git commit -m "Add missing components"');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createFile, ensureDirectoryExists, templates };
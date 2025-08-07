import React, { useState, useEffect } from 'react';
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
            value={`${(stats?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`}
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
            value={`${(stats?.todayRevenue || 0).toLocaleString('vi-VN')} ₫`}
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

export default AdminDashboard;
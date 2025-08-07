import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Eye,
  MousePointer,
  Calendar,
  Download,
  RefreshCw,
  Activity,
  Target,
  Clock,
  MapPin,
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Zap,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

// NOTE: Dữ liệu mẫu cho analytics - cần thay thế bằng dữ liệu từ API backend thực tế
const salesData = [
  { month: 'T1', revenue: 45000000, orders: 120, customers: 89 },
  { month: 'T2', revenue: 52000000, orders: 145, customers: 102 },
  { month: 'T3', revenue: 48000000, orders: 132, customers: 95 },
  { month: 'T4', revenue: 61000000, orders: 168, customers: 118 },
  { month: 'T5', revenue: 55000000, orders: 155, customers: 108 },
  { month: 'T6', revenue: 67000000, orders: 189, customers: 134 },
  { month: 'T7', revenue: 72000000, orders: 201, customers: 145 },
  { month: 'T8', revenue: 69000000, orders: 195, customers: 139 },
  { month: 'T9', revenue: 78000000, orders: 218, customers: 156 },
  { month: 'T10', revenue: 82000000, orders: 235, customers: 167 },
  { month: 'T11', revenue: 89000000, orders: 251, customers: 178 },
  { month: 'T12', revenue: 95000000, orders: 267, customers: 189 }
];

const categoryData = [
  { name: 'Điện tử', value: 35, color: '#0088FE' },
  { name: 'Thời trang', value: 28, color: '#00C49F' },
  { name: 'Gia dụng', value: 18, color: '#FFBB28' },
  { name: 'Sách', value: 12, color: '#FF8042' },
  { name: 'Khác', value: 7, color: '#8884D8' }
];

const trafficData = [
  { date: '01/03', pageViews: 1200, uniqueVisitors: 890, bounceRate: 45 },
  { date: '02/03', pageViews: 1350, uniqueVisitors: 920, bounceRate: 42 },
  { date: '03/03', pageViews: 1180, uniqueVisitors: 850, bounceRate: 48 },
  { date: '04/03', pageViews: 1420, uniqueVisitors: 980, bounceRate: 38 },
  { date: '05/03', pageViews: 1580, uniqueVisitors: 1100, bounceRate: 35 },
  { date: '06/03', pageViews: 1650, uniqueVisitors: 1150, bounceRate: 33 },
  { date: '07/03', pageViews: 1720, uniqueVisitors: 1200, bounceRate: 31 }
];

const topProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', sales: 156, revenue: 390000000, growth: 12.5 },
  { id: 2, name: 'Samsung Galaxy S24', sales: 134, revenue: 268000000, growth: 8.3 },
  { id: 3, name: 'MacBook Air M3', sales: 89, revenue: 267000000, growth: -2.1 },
  { id: 4, name: 'AirPods Pro', sales: 245, revenue: 147000000, growth: 15.7 },
  { id: 5, name: 'iPad Air', sales: 78, revenue: 156000000, growth: 5.2 }
];

const userBehaviorData = [
  { page: 'Trang chủ', views: 15420, avgTime: '2:34', exitRate: 25 },
  { page: 'Tìm kiếm sản phẩm', views: 12350, avgTime: '3:45', exitRate: 18 },
  { page: 'Chi tiết sản phẩm', views: 8960, avgTime: '4:12', exitRate: 35 },
  { page: 'Giỏ hàng', views: 5670, avgTime: '1:58', exitRate: 45 },
  { page: 'Thanh toán', views: 3240, avgTime: '2:15', exitRate: 12 }
];

// Dữ liệu thống kê tổng quan
const overviewStats = {
  totalRevenue: 2450000000,
  totalOrders: 12340,
  totalUsers: 56780,
  totalProducts: 8900,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  usersGrowth: 15.2,
  productsGrowth: 5.7
};

// Dữ liệu hoạt động gần đây
const recentActivity = [
  {
    id: '1',
    type: 'order',
    description: 'Đơn hàng mới từ Nguyễn Văn A',
    timestamp: '2024-01-07T10:30:00Z',
    value: 2500000
  },
  {
    id: '2',
    type: 'user',
    description: 'Người dùng mới đăng ký: user@example.com',
    timestamp: '2024-01-07T10:25:00Z'
  },
  {
    id: '3',
    type: 'product',
    description: 'Sản phẩm mới được thêm: iPhone 15 Pro',
    timestamp: '2024-01-07T10:20:00Z'
  },
  {
    id: '4',
    type: 'review',
    description: 'Đánh giá 5 sao cho MacBook Pro M3',
    timestamp: '2024-01-07T10:15:00Z'
  },
  {
    id: '5',
    type: 'order',
    description: 'Đơn hàng được giao thành công #12345',
    timestamp: '2024-01-07T10:10:00Z',
    value: 1800000
  }
];

// Dữ liệu địa lý
const geographicData = [
  { region: 'Hồ Chí Minh', users: 23450, orders: 12340, revenue: 12000000000 },
  { region: 'Hà Nội', users: 18760, orders: 9870, revenue: 9800000000 },
  { region: 'Đà Nẵng', users: 6540, orders: 4320, revenue: 4300000000 },
  { region: 'Cần Thơ', users: 4320, orders: 2340, revenue: 2300000000 },
  { region: 'Hải Phòng', users: 3210, orders: 1780, revenue: 1800000000 }
];

// Dữ liệu người dùng
const userMetrics = {
  newUsers: 2340,
  activeUsers: 15670,
  retentionRate: 68.5,
  averageSessionTime: 8.5
};

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

const formatPercentage = (num: number): string => {
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingCart className="h-4 w-4" />;
    case 'user':
      return <Users className="h-4 w-4" />;
    case 'product':
      return <Package className="h-4 w-4" />;
    case 'review':
      return <Star className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'order':
      return 'text-blue-600';
    case 'user':
      return 'text-green-600';
    case 'product':
      return 'text-purple-600';
    case 'review':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

// Custom hook for analytics
const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7d');
  const { toast } = useToast();

  const fetchAnalytics = async (range: string) => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: Cần tích hợp với API backend để lấy dữ liệu analytics thực tế
      // Ví dụ: const response = await fetch(`/api/analytics?range=${range}`);
      // const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Dữ liệu đã được cập nhật",
        description: "Analytics dashboard đã được làm mới.",
      });
    } catch (err) {
      setError('Không thể tải dữ liệu analytics');
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu analytics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      // NOTE: Cần tích hợp với API backend để xuất dữ liệu analytics
      // Ví dụ: const response = await fetch(`/api/analytics/export?format=${format}`);
      // const blob = await response.blob();
      // Tạo link download và trigger download
      toast({
        title: "Đang xuất dữ liệu",
        description: `Đang chuẩn bị file ${format.toUpperCase()}...`,
      });
      console.log(`Exporting analytics data as ${format}`);
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất dữ liệu.",
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    error,
    dateRange,
    setDateRange,
    fetchAnalytics,
    exportData
  };
};

const Analytics: React.FC = () => {
  const {
    loading,
    error,
    dateRange,
    setDateRange,
    fetchAnalytics,
    exportData
  } = useAnalytics();
  
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Tính toán metrics tổng quan
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  // Tính toán growth rates
  const currentMonth = salesData[salesData.length - 1];
  const previousMonth = salesData[salesData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
  const orderGrowth = ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100;
  const customerGrowth = ((currentMonth.customers - previousMonth.customers) / previousMonth.customers) * 100;

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-500' : 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Đang tải dữ liệu analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchAnalytics(dateRange)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất kinh doanh và phân tích dữ liệu
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 giờ qua</SelectItem>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">3 tháng qua</SelectItem>
              <SelectItem value="1y">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportData('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" onClick={() => fetchAnalytics(dateRange)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon === 'DollarSign' ? DollarSign :
                      stat.icon === 'ShoppingCart' ? ShoppingCart :
                      stat.icon === 'Users' ? Users :
                      stat.icon === 'Package' ? Package :
                      stat.icon === 'TrendingUp' ? TrendingUp : Activity;
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.icon === 'DollarSign' ? formatCurrency(stat.value) : formatNumber(stat.value)}
                </div>
                <div className="flex items-center space-x-1 text-xs mt-1">
                  {getGrowthIcon(stat.growth)}
                  <span className={getGrowthColor(stat.growth)}>
                    {formatPercentage(Math.abs(stat.growth))} so với kỳ trước
                  </span>
                </div>
                {/* Progress bar for visual appeal */}
                <div className="mt-2">
                  <Progress 
                    value={Math.min(Math.abs(stat.growth) * 10, 100)} 
                    className="h-1" 
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="sales">Doanh số</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="traffic">Lưu lượng</TabsTrigger>
          <TabsTrigger value="geography">Địa lý</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
                        </div>
                        <Badge variant="outline">{activity.value}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* User Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Chỉ số người dùng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.label}</span>
                        <span className="font-medium">{formatNumber(metric.value)}</span>
                      </div>
                      <Progress value={metric.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(metric.growth)} so với tháng trước
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Phân bố địa lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {geographicData.map((region, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{region.region}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Người dùng:</span>
                        <span className="font-medium">{formatNumber(region.users)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đơn hàng:</span>
                        <span className="font-medium">{formatNumber(region.orders)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Doanh thu:</span>
                        <span className="font-medium">{formatCurrency(region.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>
                Biểu đồ doanh thu và số đơn hàng trong 12 tháng qua
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(value as number), 'Doanh thu'];
                      }
                      return [value, name === 'orders' ? 'Đơn hàng' : 'Khách hàng'];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Doanh thu"
                  />
                  <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Đơn hàng" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <CardDescription>
                Top 5 sản phẩm có doanh số cao nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} đã bán
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                      <div className="flex items-center space-x-1 text-xs">
                        {getGrowthIcon(product.growth)}
                        <span className={getGrowthColor(product.growth)}>
                          {Math.abs(product.growth).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo danh mục</CardTitle>
              <CardDescription>
                Tỷ lệ doanh số theo từng danh mục sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          {/* Traffic Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Lưu lượng truy cập</CardTitle>
              <CardDescription>
                Số lượt xem trang và khách truy cập duy nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Lượt xem trang"
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueVisitors"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Khách duy nhất"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Người dùng mới vs Cũ</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Người dùng mới', value: 65, color: '#8884d8' },
                        { name: 'Người dùng cũ', value: 35, color: '#82ca9d' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thiết bị truy cập</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { device: 'Desktop', percentage: 45, users: 12500 },
                    { device: 'Mobile', percentage: 40, users: 11200 },
                    { device: 'Tablet', percentage: 15, users: 4200 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.device}</span>
                        <span className="font-medium">{formatNumber(item.users)} người dùng</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Behavior Table */}
          <Card>
            <CardHeader>
              <CardTitle>Hành vi người dùng</CardTitle>
              <CardDescription>
                Phân tích cách người dùng tương tác với website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBehaviorData.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{page.page}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(page.views)} lượt xem
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{page.avgTime}</div>
                        <div className="text-muted-foreground">Thời gian TB</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{page.exitRate}%</div>
                        <div className="text-muted-foreground">Tỷ lệ thoát</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          {/* Geographic Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Doanh thu theo khu vực
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geographicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top thành phố</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { city: 'Hồ Chí Minh', users: 8500, orders: 1200, revenue: 2400000 },
                    { city: 'Hà Nội', users: 7200, orders: 980, revenue: 1950000 },
                    { city: 'Đà Nẵng', users: 3400, orders: 450, revenue: 890000 },
                    { city: 'Cần Thơ', users: 2100, orders: 280, revenue: 560000 },
                    { city: 'Hải Phòng', users: 1800, orders: 220, revenue: 440000 }
                  ].map((city, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{city.city}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(city.users)} người dùng • {formatNumber(city.orders)} đơn hàng
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(city.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất theo khu vực</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khu vực</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead>Doanh thu</TableHead>
                    <TableHead>Tỷ lệ chuyển đổi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geographicData.map((region, index) => {
                    const conversionRate = ((region.orders / region.users) * 100).toFixed(1);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{region.region}</TableCell>
                        <TableCell>{formatNumber(region.users)}</TableCell>
                        <TableCell>{formatNumber(region.orders)}</TableCell>
                        <TableCell>{formatCurrency(region.revenue)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{conversionRate}%</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
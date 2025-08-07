import type { NextApiRequest, NextApiResponse } from 'next';
import { mockOrders, getOrderStats, type MockOrder } from '../../../data/mockAdminData';

type OrdersResponse = {
  orders: MockOrder[];
  total: number;
  stats: ReturnType<typeof getOrderStats>;
};

type ErrorResponse = {
  error: string;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrdersResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: 'Chỉ hỗ trợ phương thức GET' 
    });
  }

  try {
    // Lấy các query parameters
    const {
      page = '1',
      limit = '10',
      search = '',
      status = '',
      paymentStatus = '',
      paymentMethod = '',
      startDate = '',
      endDate = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filteredOrders = [...mockOrders];

    // Lọc theo tìm kiếm (tên khách hàng, số đơn hàng, email)
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower) ||
        order.customer.phone.includes(search)
      );
    }

    // Lọc theo trạng thái đơn hàng
    if (status && typeof status === 'string' && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Lọc theo trạng thái thanh toán
    if (paymentStatus && typeof paymentStatus === 'string' && paymentStatus !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
    }

    // Lọc theo phương thức thanh toán
    if (paymentMethod && typeof paymentMethod === 'string' && paymentMethod !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.paymentMethod === paymentMethod);
    }

    // Lọc theo khoảng thời gian
    if (startDate && typeof startDate === 'string') {
      const start = new Date(startDate);
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) >= start
      );
    }

    if (endDate && typeof endDate === 'string') {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Cuối ngày
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) <= end
      );
    }

    // Sắp xếp
    if (typeof sortBy === 'string' && typeof sortOrder === 'string') {
      filteredOrders.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'createdAt':
          case 'updatedAt':
            aValue = new Date(a[sortBy]);
            bValue = new Date(b[sortBy]);
            break;
          case 'total':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'customer':
            aValue = a.customer.name;
            bValue = b.customer.name;
            break;
          case 'orderNumber':
            aValue = a.orderNumber;
            bValue = b.orderNumber;
            break;
          default:
            aValue = a.createdAt;
            bValue = b.createdAt;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Phân trang
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Lấy thống kê
    const stats = getOrderStats();

    res.status(200).json({
      orders: paginatedOrders,
      total: filteredOrders.length,
      stats
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi lấy danh sách đơn hàng' 
    });
  }
}
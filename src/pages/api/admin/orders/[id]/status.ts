import type { NextApiRequest, NextApiResponse } from 'next';
import { mockOrders, type MockOrder } from '../../../../../data/mockAdminData';

type UpdateStatusRequest = {
  status: MockOrder['status'];
  note?: string;
};

type UpdateStatusResponse = {
  success: boolean;
  order: MockOrder;
  message: string;
};

type ErrorResponse = {
  error: string;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateStatusResponse | ErrorResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: 'Chỉ hỗ trợ phương thức PUT' 
    });
  }

  try {
    const { id } = req.query;
    const { status, note }: UpdateStatusRequest = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    if (!status) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Trạng thái không được để trống'
      });
    }

    // Tìm đơn hàng
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Không tìm thấy đơn hàng'
      });
    }

    const order = mockOrders[orderIndex];
    
    // Kiểm tra trạng thái hợp lệ
    const validStatuses: MockOrder['status'][] = [
      'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Trạng thái không hợp lệ'
      });
    }

    // Kiểm tra logic chuyển trạng thái
    const statusFlow = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'cancelled'],
      'delivered': [], // Không thể chuyển từ delivered
      'cancelled': [] // Không thể chuyển từ cancelled
    };

    if (order.status !== status && !statusFlow[order.status].includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Không thể chuyển từ trạng thái "${order.status}" sang "${status}"`
      });
    }

    // Cập nhật trạng thái
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString()
    };

    // Thêm vào timeline nếu trạng thái thay đổi
    if (order.status !== status) {
      const statusLabels = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao vận',
        'delivered': 'Đã giao hàng',
        'cancelled': 'Đã hủy'
      };

      updatedOrder.timeline = [
        ...order.timeline,
        {
          status: statusLabels[status],
          timestamp: new Date().toISOString(),
          note: note || `Đơn hàng đã được cập nhật sang trạng thái "${statusLabels[status]}"`
        }
      ];

      // Cập nhật trạng thái thanh toán nếu cần
      if (status === 'cancelled' && order.paymentStatus === 'paid') {
        updatedOrder.paymentStatus = 'refunded';
      }
    }

    // Cập nhật trong mock data (trong thực tế sẽ cập nhật database)
    mockOrders[orderIndex] = updatedOrder;

    res.status(200).json({
      success: true,
      order: updatedOrder,
      message: 'Cập nhật trạng thái đơn hàng thành công'
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng' 
    });
  }
}
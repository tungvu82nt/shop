import React from 'react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, User, MapPin, CreditCard, Clock, FileText } from 'lucide-react';
import type { MockOrder } from '../../data/mockAdminData';

interface OrderDetailViewProps {
  order: MockOrder;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: MockOrder['status']) => {
    const statusConfig = {
      pending: { label: 'Chờ xác nhận', variant: 'secondary' as const },
      confirmed: { label: 'Đã xác nhận', variant: 'default' as const },
      processing: { label: 'Đang xử lý', variant: 'default' as const },
      shipped: { label: 'Đã giao vận', variant: 'default' as const },
      delivered: { label: 'Đã giao hàng', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: MockOrder['paymentStatus']) => {
    const statusConfig = {
      pending: { label: 'Chờ thanh toán', variant: 'secondary' as const },
      paid: { label: 'Đã thanh toán', variant: 'default' as const },
      failed: { label: 'Thanh toán thất bại', variant: 'destructive' as const },
      refunded: { label: 'Đã hoàn tiền', variant: 'outline' as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: MockOrder['paymentMethod']) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng',
      vnpay: 'VNPay',
      momo: 'MoMo',
      bank_transfer: 'Chuyển khoản ngân hàng'
    };
    return methods[method];
  };

  return (
    <div className="space-y-6">
      {/* Thông tin đơn hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Mã đơn hàng</p>
              <p className="font-semibold">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Trạng thái</p>
              <div className="mt-1">{getStatusBadge(order.status)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
              <p>{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cập nhật lần cuối</p>
              <p>{formatDate(order.updatedAt)}</p>
            </div>
          </div>
          {order.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Ghi chú</p>
              <p className="text-sm bg-gray-50 p-2 rounded">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thông tin khách hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin khách hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Họ tên</p>
            <p className="font-semibold">{order.customer.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{order.customer.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
            <p>{order.customer.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Địa chỉ giao hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Địa chỉ giao hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Người nhận</p>
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
            <p>
              {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sản phẩm */}
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm đã đặt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  {item.variant && (
                    <p className="text-sm text-gray-500">{item.variant}</p>
                  )}
                  <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price)}</p>
                  <p className="text-sm text-gray-500">
                    Tổng: {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Thanh toán */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Thông tin thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Phương thức thanh toán</p>
              <p className="font-semibold">{getPaymentMethodLabel(order.paymentMethod)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Trạng thái thanh toán</p>
              <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span>Thuế:</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch sử đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-semibold">{event.status}</p>
                  <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
                  {event.note && (
                    <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailView;
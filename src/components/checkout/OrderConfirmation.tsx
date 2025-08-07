import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Package, MapPin, Truck, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderConfirmationProps {
  orderData: {
    orderId: string;
    orderDate: string;
    status: string;
    items: any[];
    shippingAddress: any;
    shippingMethod: any;
    paymentMethod: any;
    subtotal: number;
    shippingFee: number;
    discount: number;
    paymentDiscount: number;
    total: number;
  };
}

/**
 * Component hiển thị thông tin xác nhận đơn hàng sau khi đặt hàng thành công
 * @param orderData - Dữ liệu đơn hàng
 */
const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderData }) => {
  const navigate = useNavigate();

  /**
   * Xử lý quay về trang chủ
   */
  const handleBackToHome = () => {
    navigate('/');
  };

  /**
   * Xử lý xem chi tiết đơn hàng
   */
  const handleViewOrder = () => {
    // Điều hướng đến trang chi tiết đơn hàng
    navigate(`/orders/${orderData.orderId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header thành công */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600">
          Cảm ơn bạn đã mua sắm tại Yapee Vietnam. Đơn hàng của bạn đang được xử lý.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin đơn hàng */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
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
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-medium">{orderData.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                  <p className="font-medium">{orderData.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {orderData.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số lượng sản phẩm</p>
                  <p className="font-medium">{orderData.items.length} sản phẩm</p>
                </div>
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
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {orderData.shippingAddress.name} | {orderData.shippingAddress.phone}
                </p>
                <p className="text-gray-600">
                  {orderData.shippingAddress.address}, {orderData.shippingAddress.ward}, 
                  {orderData.shippingAddress.district}, {orderData.shippingAddress.province}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Phương thức vận chuyển và thanh toán */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{orderData.shippingMethod.name}</p>
                  <p className="text-sm text-gray-600">{orderData.shippingMethod.estimatedTime}</p>
                  <p className="text-sm font-medium">{formatPrice(orderData.shippingFee)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{orderData.paymentMethod.name}</p>
                  <p className="text-sm text-gray-600">{orderData.paymentMethod.description}</p>
                  {orderData.paymentMethod.discount && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Giảm {orderData.paymentMethod.discount}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danh sách sản phẩm */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.price)}/sản phẩm</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tóm tắt thanh toán */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Tóm tắt thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(orderData.shippingFee)}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Mã giảm giá</span>
                    <span>-{formatPrice(orderData.discount)}</span>
                  </div>
                )}
                {orderData.paymentDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá thanh toán</span>
                    <span>-{formatPrice(orderData.paymentDiscount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(orderData.total)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleViewOrder} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Xem chi tiết đơn hàng
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBackToHome} 
                  className="w-full"
                >
                  Tiếp tục mua sắm
                </Button>
              </div>

              {/* Thông tin hỗ trợ */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Cần hỗ trợ?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Liên hệ: 1900-1234<br />
                  Email: support@yapee.vn
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Package, MapPin, Truck, CreditCard, Clock, Phone, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  payment_method: string;
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
  items: OrderItem[];
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Không tìm thấy mã đơn hàng');
        setIsLoading(false);
        return;
      }

      try {
        // Lấy thông tin đơn hàng từ Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_id,
              quantity,
              price,
              variant,
              products (
                name,
                images
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (orderError) {
          throw orderError;
        }

        if (!order) {
          setError('Không tìm thấy đơn hàng');
          setIsLoading(false);
          return;
        }

        // Chuyển đổi dữ liệu để phù hợp với interface
        const formattedOrder: OrderData = {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          created_at: order.created_at,
          total_amount: order.total_amount,
          shipping_fee: order.shipping_fee || 0,
          discount_amount: order.discount_amount || 0,
          payment_method: order.payment_method,
          shipping_address: order.shipping_address,
          items: order.order_items.map((item: any) => ({
            id: item.id,
            name: item.products.name,
            image: item.products.images[0] || '/placeholder-product.jpg',
            price: item.price,
            quantity: item.quantity,
            variant: item.variant
          }))
        };

        setOrderData(formattedOrder);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Có lỗi xảy ra khi tải thông tin đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const },
      confirmed: { label: 'Đã xác nhận', variant: 'default' as const },
      processing: { label: 'Đang xử lý', variant: 'default' as const },
      shipping: { label: 'Đang giao hàng', variant: 'default' as const },
      delivered: { label: 'Đã giao hàng', variant: 'default' as const },
      completed: { label: 'Hoàn thành', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, variant: 'secondary' as const };
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng',
      vnpay: 'VNPay',
      momo: 'MoMo',
      bank_transfer: 'Chuyển khoản ngân hàng'
    };
    return methods[method as keyof typeof methods] || method;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Không tìm thấy đơn hàng'}
          </h2>
          <Button onClick={() => navigate('/orders')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Đơn hàng #{orderData.order_number}
            </h1>
            <p className="text-sm text-gray-500">
              Đặt hàng vào {new Date(orderData.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        {getStatusBadge(orderData.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin sản phẩm */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Sản phẩm đã đặt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-500">Phân loại: {item.variant}</p>
                      )}
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Địa chỉ giao hàng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">{orderData.shipping_address.name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{orderData.shipping_address.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <p>{orderData.shipping_address.address}</p>
                    <p className="text-sm text-gray-500">
                      {orderData.shipping_address.ward}, {orderData.shipping_address.district}, {orderData.shipping_address.province}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin thanh toán */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatPrice(orderData.total_amount - orderData.shipping_fee + orderData.discount_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{formatPrice(orderData.shipping_fee)}</span>
                </div>
                {orderData.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(orderData.discount_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{formatPrice(orderData.total_amount)}</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-1">Phương thức thanh toán:</p>
                  <p className="font-medium">{getPaymentMethodLabel(orderData.payment_method)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trạng thái đơn hàng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Trạng thái hiện tại:</span>
                  {getStatusBadge(orderData.status)}
                </div>
                <div className="text-sm text-gray-600">
                  <p>Cập nhật lần cuối: {new Date(orderData.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
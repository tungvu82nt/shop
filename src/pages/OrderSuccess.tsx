import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';
import { Loader2 } from 'lucide-react';

/**
 * Trang hiển thị thông tin đơn hàng sau khi đặt hàng thành công
 */
const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ URL params hoặc localStorage
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      // Nếu không có orderId, chuyển về trang chủ
      navigate('/');
      return;
    }

    // Simulate API call để lấy thông tin đơn hàng
    const fetchOrderData = async () => {
      try {
        // Trong thực tế, sẽ gọi API để lấy thông tin đơn hàng
        // Hiện tại sử dụng dữ liệu mẫu
        const mockOrderData = {
          orderId: orderId,
          orderDate: new Date().toLocaleDateString('vi-VN'),
          status: 'Đang xử lý',
          items: [
            {
              id: '1',
              name: 'iPhone 15 Pro Max 256GB',
              image: 'https://picsum.photos/300/300?random=1',
              price: 29990000,
              quantity: 1
            },
            {
              id: '2', 
              name: 'AirPods Pro (2nd generation)',
              image: 'https://picsum.photos/300/300?random=1',
              price: 6490000,
              quantity: 1
            }
          ],
          shippingAddress: {
            name: 'Nguyễn Văn A',
            phone: '0123456789',
            address: '123 Đường ABC',
            ward: 'Phường XYZ',
            district: 'Quận 1',
            province: 'TP. Hồ Chí Minh'
          },
          shippingMethod: {
            name: 'Giao hàng nhanh',
            estimatedTime: '1-2 ngày làm việc',
            fee: 30000
          },
          paymentMethod: {
            name: 'VNPay',
            description: 'Thanh toán qua ví điện tử VNPay',
            discount: 2
          },
          subtotal: 36480000,
          shippingFee: 30000,
          discount: 0,
          paymentDiscount: 729600, // 2% của subtotal
          total: 35780400
        };

        setOrderData(mockOrderData);
        
        // Xóa giỏ hàng sau khi đặt hàng thành công
        clearCart();
        
      } catch (error) {
        console.error('Error fetching order data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [searchParams, navigate, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin đơn hàng</p>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrderConfirmation orderData={orderData} />
    </div>
  );
};

export default OrderSuccess;
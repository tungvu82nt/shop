import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ArrowLeft, Home } from 'lucide-react';
import { paymentService, PaymentStatus } from '@/services/paymentService';
import { supabase } from '@/lib/supabase';

/**
 * Trang hiển thị kết quả thanh toán
 * Xử lý callback từ các payment gateway như VNPay, MoMo
 */
const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Xử lý kết quả thanh toán khi component mount
     */
    const processPaymentResult = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy thông tin từ URL parameters
        const paymentMethod = searchParams.get('method') || 'vnpay';
        const orderId = searchParams.get('vnp_TxnRef') || searchParams.get('orderId');

        if (!orderId) {
          throw new Error('Không tìm thấy thông tin đơn hàng');
        }

        // Xác thực kết quả thanh toán
        const result = await paymentService.verifyPayment(paymentMethod, searchParams);
        setPaymentStatus(result);

        // Cập nhật trạng thái đơn hàng trong database
        if (result.status === 'success' && orderId) {
          try {
            const { error: updateError } = await supabase
              .from('orders')
              .update({
                status: 'paid',
                payment_status: 'completed',
                payment_method: paymentMethod,
                payment_transaction_id: result.transactionId,
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', orderId);

            if (updateError) {
              console.error('Lỗi cập nhật trạng thái đơn hàng:', updateError);
            } else {
              console.log('Cập nhật trạng thái đơn hàng thành công:', orderId);
            }
          } catch (updateErr) {
            console.error('Lỗi khi cập nhật đơn hàng:', updateErr);
          }
        }

      } catch (err) {
        console.error('Payment result processing error:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xử lý kết quả thanh toán');
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [searchParams]);

  /**
   * Render icon trạng thái thanh toán
   */
  const renderStatusIcon = () => {
    if (!paymentStatus) return null;

    switch (paymentStatus.status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />;
      case 'cancelled':
        return <XCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />;
      default:
        return null;
    }
  };

  /**
   * Render tiêu đề trạng thái
   */
  const renderStatusTitle = () => {
    if (!paymentStatus) return 'Đang xử lý...';

    switch (paymentStatus.status) {
      case 'success':
        return 'Thanh toán thành công!';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'pending':
        return 'Thanh toán đang xử lý';
      case 'cancelled':
        return 'Thanh toán đã bị hủy';
      default:
        return 'Trạng thái không xác định';
    }
  };

  /**
   * Render mô tả trạng thái
   */
  const renderStatusDescription = () => {
    if (!paymentStatus) return 'Vui lòng đợi trong giây lát...';

    switch (paymentStatus.status) {
      case 'success':
        return 'Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.';
      case 'failed':
        return 'Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.';
      case 'pending':
        return 'Thanh toán đang được xử lý. Chúng tôi sẽ thông báo kết quả qua email khi hoàn tất.';
      case 'cancelled':
        return 'Bạn đã hủy thanh toán. Đơn hàng vẫn được lưu và bạn có thể thanh toán lại bất cứ lúc nào.';
      default:
        return 'Không thể xác định trạng thái thanh toán.';
    }
  };

  /**
   * Render nút hành động
   */
  const renderActionButtons = () => {
    if (!paymentStatus) return null;

    const buttons = [];

    // Nút xem chi tiết đơn hàng (cho trạng thái thành công)
    if (paymentStatus.status === 'success') {
      buttons.push(
        <Button
          key="view-order"
          onClick={() => navigate(`/order-success?orderId=${paymentStatus.orderId}`)}
          className="w-full sm:w-auto"
        >
          Xem chi tiết đơn hàng
        </Button>
      );
    }

    // Nút thử lại thanh toán (cho trạng thái thất bại hoặc hủy)
    if (paymentStatus.status === 'failed' || paymentStatus.status === 'cancelled') {
      buttons.push(
        <Button
          key="retry-payment"
          onClick={() => navigate('/checkout')}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Thử lại thanh toán
        </Button>
      );
    }

    // Nút về trang chủ
    buttons.push(
      <Button
        key="home"
        onClick={() => navigate('/')}
        variant={paymentStatus.status === 'success' ? 'outline' : 'default'}
        className="w-full sm:w-auto"
      >
        <Home className="w-4 h-4 mr-2" />
        Về trang chủ
      </Button>
    );

    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        {buttons}
      </div>
    );
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Đang xử lý kết quả thanh toán</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate('/checkout')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại thanh toán
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto"
              >
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hiển thị kết quả thanh toán
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {renderStatusIcon()}
            <h1 className="text-2xl font-bold">{renderStatusTitle()}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600 text-center mb-6">
            {renderStatusDescription()}
          </p>

          {/* Thông tin chi tiết thanh toán */}
          {paymentStatus && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium">{paymentStatus.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium">
                  {paymentStatus.amount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium capitalize">
                  {paymentStatus.paymentMethod === 'vnpay' && 'VNPay'}
                  {paymentStatus.paymentMethod === 'momo' && 'MoMo'}
                  {paymentStatus.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng'}
                  {paymentStatus.paymentMethod === 'bank_transfer' && 'Chuyển khoản ngân hàng'}
                </span>
              </div>
              {paymentStatus.transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium">{paymentStatus.transactionId}</span>
                </div>
              )}
              {paymentStatus.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {new Date(paymentStatus.paidAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          )}

          {renderActionButtons()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResult;
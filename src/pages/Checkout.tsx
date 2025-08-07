import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, MapPin, Truck, CreditCard, Gift } from 'lucide-react';
import { paymentService, PaymentRequest } from '@/services/paymentService';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import AddressSelection from '@/components/checkout/AddressSelection';
import ShippingMethodSelection from '@/components/checkout/ShippingMethod';
import PaymentMethodSelection from '@/components/checkout/PaymentMethod';
import CouponInput from '@/components/checkout/CouponInput';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [shippingMethod, setShippingMethod] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string; discount: number} | null>(null);

  // Theo dõi sự kiện bắt đầu thanh toán
  useEffect(() => {
    analytics.trackEcommerce('begin_checkout', {
      currency: 'VND',
      value: cartState.totalPrice,
      items: cartState.items.map(item => ({
        item_id: item.id.toString(),
        item_name: item.name,
        item_category: item.category,
        item_brand: item.brand,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }, [cartState]);

  const subtotal = cartState.totalPrice;
  const shippingFee = shippingMethod?.fee || 0;
  const paymentDiscount = paymentMethod?.discount ? (subtotal * paymentMethod.discount) / 100 : 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const total = subtotal + shippingFee - couponDiscount - paymentDiscount;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCouponApply = (discount: number, code: string) => {
    if (discount > 0 && code) {
      setAppliedCoupon({ discount, code });
    } else {
      setAppliedCoupon(null);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!shippingAddress || !shippingMethod || !paymentMethod) {
        toast.error('Vui lòng điền đầy đủ thông tin đặt hàng!');
        return;
      }

      const orderId = 'ORD' + Date.now();
      
      if (paymentMethod.id === 'cod' || paymentMethod.id === 'bank_transfer') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Đặt hàng thành công:', {
          orderId,
          address: shippingAddress,
          shipping: shippingMethod,
          payment: paymentMethod,
          items: cartState.items,
          total
        });
        
        // Theo dõi sự kiện mua hàng thành công
        analytics.trackEcommerce('purchase', {
          transaction_id: orderId,
          currency: 'VND',
          value: total,
          shipping: shippingFee,
          payment_type: paymentMethod.id,
          items: cartState.items.map(item => ({
            item_id: item.id.toString(),
            item_name: item.name,
            item_category: item.category,
            item_brand: item.brand,
            price: item.price,
            quantity: item.quantity
          }))
        });
        
        toast.success('Đặt hàng thành công!');
        navigate(`/order-success?orderId=${orderId}`);
        
      } else {
        const paymentRequest: PaymentRequest = {
          orderId,
          amount: total,
          orderInfo: `Thanh toán đơn hàng ${orderId}`,
          returnUrl: `${window.location.origin}/payment-result?method=${paymentMethod.id}`,
          cancelUrl: `${window.location.origin}/checkout`,
          paymentMethod: paymentMethod.id as 'vnpay' | 'momo'
        };
        
        const paymentResponse = await paymentService.processPayment(paymentRequest);
        
        if (paymentResponse.success && paymentResponse.paymentUrl) {
          localStorage.setItem('pendingOrder', JSON.stringify({
            orderId,
            address: shippingAddress,
            shipping: shippingMethod,
            payment: paymentMethod,
            items: cartState.items,
            total
          }));
          
          toast.success('Đang chuyển hướng đến trang thanh toán...');
          window.location.href = paymentResponse.paymentUrl;
        } else {
          throw new Error(paymentResponse.message || 'Không thể tạo liên kết thanh toán');
        }
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold">Thanh toán</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {[
                    { step: 1, title: 'Địa chỉ', icon: MapPin },
                    { step: 2, title: 'Vận chuyển', icon: Truck },
                    { step: 3, title: 'Thanh toán', icon: CreditCard },
                    { step: 4, title: 'Xác nhận', icon: Gift }
                  ].map(({ step, title, icon: Icon }) => (
                    <div key={step} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep >= step 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        currentStep >= step ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {title}
                      </span>
                      {step < 4 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {currentStep === 1 && (
              <AddressSelection
                selectedAddress={shippingAddress}
                onAddressSelect={setShippingAddress}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <ShippingMethodSelection
                selectedMethod={shippingMethod}
                onMethodSelect={setShippingMethod}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}

            {currentStep === 3 && (
              <PaymentMethodSelection
                selectedMethod={paymentMethod}
                onMethodSelect={setPaymentMethod}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                orderTotal={subtotal}
              />
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Xác nhận đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {shippingAddress && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-2">Địa chỉ giao hàng:</h5>
                          <p className="text-sm">
                            <strong>{shippingAddress.name}</strong> | {shippingAddress.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.address}, {shippingAddress.ward}, {shippingAddress.district}, {shippingAddress.province}
                          </p>
                        </div>
                      )}
                      
                      {shippingMethod && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-2">Phương thức vận chuyển:</h5>
                          <p className="text-sm">
                            <strong>{shippingMethod.name}</strong> - {formatPrice(shippingMethod.fee)}
                          </p>
                          <p className="text-sm text-gray-600">{shippingMethod.estimatedTime}</p>
                        </div>
                      )}
                      
                      {paymentMethod && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-2">Phương thức thanh toán:</h5>
                          <p className="text-sm">
                            <strong>{paymentMethod.name}</strong>
                            {paymentMethod.discount && (
                              <span className="text-green-600 ml-2">(Giảm {paymentMethod.discount}%)</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">{paymentMethod.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Vui lòng kiểm tra lại thông tin đơn hàng trước khi đặt hàng.</p>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Quay lại
                      </Button>
                      <Button onClick={handlePlaceOrder} className="bg-green-600 hover:bg-green-700 flex-1">
                        Đặt hàng
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        {item.selectedColor && (
                          <p>Màu: {item.selectedColor}</p>
                        )}
                        {item.selectedSize && (
                          <p>Kích thước: {item.selectedSize}</p>
                        )}
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <CouponInput
              onCouponApply={handleCouponApply}
              appliedCoupon={appliedCoupon}
              orderTotal={subtotal}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính ({cartState.totalItems} sản phẩm)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí'}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Mã giảm giá ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {paymentDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá thanh toán</span>
                    <span>-{formatPrice(paymentDiscount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
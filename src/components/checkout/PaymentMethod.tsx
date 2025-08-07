import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Banknote, Shield, Zap } from 'lucide-react';

// Interface cho phương thức thanh toán
interface PaymentMethod {
  id: string;
  name: string; // Tên phương thức
  description: string; // Mô tả
  icon: React.ComponentType<{ className?: string }>; // Icon
  processingTime: string; // Thời gian xử lý
  features: string[]; // Tính năng
  isPopular?: boolean; // Phương thức phổ biến
  discount?: number; // Giảm giá (nếu có)
}

interface PaymentMethodProps {
  selectedMethod: PaymentMethod | null;
  onMethodSelect: (method: PaymentMethod) => void;
  onNext: () => void;
  onPrev: () => void;
  orderTotal: number;
}

/**
 * Component chọn phương thức thanh toán
 * Hiển thị các tùy chọn thanh toán như VNPay, MoMo, COD, etc.
 */
const PaymentMethodSelection: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onMethodSelect,
  onNext,
  onPrev,
  orderTotal
}) => {
  // Mock data - trong thực tế sẽ lấy từ API
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Thanh toán qua VNPay (ATM, Visa, MasterCard)',
      icon: CreditCard,
      processingTime: 'Tức thì',
      features: ['Bảo mật cao', 'Hỗ trợ nhiều ngân hàng', 'Hoàn tiền nhanh'],
      isPopular: true
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Thanh toán qua ví điện tử MoMo',
      icon: Smartphone,
      processingTime: 'Tức thì',
      features: ['Thanh toán nhanh', 'Tích điểm', 'Ưu đãi độc quyền'],
      discount: 5 // Giảm 5%
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Thanh toán qua ví điện tử ZaloPay',
      icon: Zap,
      processingTime: 'Tức thì',
      features: ['Bảo mật 2 lớp', 'Cashback', 'Liên kết ngân hàng']
    },
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản trực tiếp qua Internet Banking',
      icon: Shield,
      processingTime: '1-2 giờ',
      features: ['An toàn tuyệt đối', 'Không phí giao dịch', 'Xác nhận tự động']
    },
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: Banknote,
      processingTime: 'Khi giao hàng',
      features: ['Kiểm tra hàng trước khi trả tiền', 'Không cần thẻ ngân hàng', 'Phù hợp mọi đối tượng']
    }
  ]);

  /**
   * Xử lý chọn phương thức thanh toán
   */
  const handleSelectMethod = (method: PaymentMethod) => {
    onMethodSelect(method);
  };

  /**
   * Xử lý tiếp tục với phương thức đã chọn
   */
  const handleContinue = () => {
    if (selectedMethod) {
      onNext();
    }
  };

  /**
   * Tính toán số tiền sau khi giảm giá
   */
  const calculateDiscountAmount = (method: PaymentMethod) => {
    if (method.discount) {
      return (orderTotal * method.discount) / 100;
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Danh sách phương thức thanh toán */}
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const discountAmount = calculateDiscountAmount(method);
            
            return (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors relative ${
                  selectedMethod?.id === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectMethod(method)}
              >
                {/* Popular badge */}
                {method.isPopular && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">
                    Phổ biến
                  </Badge>
                )}
                
                {/* Discount badge */}
                {method.discount && (
                  <Badge className="absolute -top-2 -left-2 bg-red-500 hover:bg-red-600">
                    Giảm {method.discount}%
                  </Badge>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${
                    selectedMethod?.id === method.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{method.name}</h4>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Xử lý: {method.processingTime}
                        </div>
                        {discountAmount > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            Tiết kiệm: {discountAmount.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {method.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Radio button */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedMethod?.id === method.id
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod?.id === method.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thông tin bảo mật */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
            <h5 className="font-medium text-green-800">Thanh toán an toàn</h5>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Thông tin thanh toán được mã hóa SSL 256-bit</li>
            <li>• Không lưu trữ thông tin thẻ tín dụng</li>
            <li>• Tuân thủ tiêu chuẩn bảo mật PCI DSS</li>
            <li>• Hỗ trợ hoàn tiền 100% nếu có sự cố</li>
          </ul>
        </div>

        {/* Hiển thị thông tin giảm giá nếu có */}
        {selectedMethod?.discount && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-blue-800">Ưu đãi thanh toán</h5>
                <p className="text-sm text-blue-600">
                  Giảm {selectedMethod.discount}% khi thanh toán qua {selectedMethod.name}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  -{calculateDiscountAmount(selectedMethod).toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Quay lại
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
          >
            Tiếp tục
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelection;
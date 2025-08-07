import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, Shield } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Interface cho phương thức vận chuyển
interface ShippingMethod {
  id: string;
  name: string; // Tên phương thức
  description: string; // Mô tả
  estimatedTime: string; // Thời gian dự kiến
  fee: number; // Phí vận chuyển
  icon: React.ComponentType<{ className?: string }>; // Icon
  features: string[]; // Tính năng đặc biệt
  isRecommended?: boolean; // Phương thức được khuyến nghị
}

interface ShippingMethodProps {
  selectedMethod: ShippingMethod | null;
  onMethodSelect: (method: ShippingMethod) => void;
  onNext: () => void;
  onPrev: () => void;
}

/**
 * Component chọn phương thức vận chuyển
 * Hiển thị các tùy chọn vận chuyển với phí và thời gian dự kiến
 */
const ShippingMethodSelection: React.FC<ShippingMethodProps> = ({
  selectedMethod,
  onMethodSelect,
  onNext,
  onPrev
}) => {
  // Mock data - trong thực tế sẽ lấy từ API dựa trên địa chỉ giao hàng
  const [shippingMethods] = useState<ShippingMethod[]>([
    {
      id: 'standard',
      name: 'Giao hàng tiêu chuẩn',
      description: 'Giao hàng trong giờ hành chính',
      estimatedTime: '3-5 ngày làm việc',
      fee: 30000,
      icon: Truck,
      features: ['Miễn phí với đơn hàng trên 500k', 'Giao trong giờ hành chính']
    },
    {
      id: 'express',
      name: 'Giao hàng nhanh',
      description: 'Giao hàng ưu tiên trong ngày',
      estimatedTime: '1-2 ngày làm việc',
      fee: 50000,
      icon: Clock,
      features: ['Giao hàng ưu tiên', 'Theo dõi real-time'],
      isRecommended: true
    },
    {
      id: 'premium',
      name: 'Giao hàng cao cấp',
      description: 'Giao hàng trong 24h với bảo hiểm',
      estimatedTime: 'Trong 24 giờ',
      fee: 80000,
      icon: Shield,
      features: ['Giao trong 24h', 'Bảo hiểm 100%', 'Hỗ trợ 24/7']
    }
  ]);

  /**
   * Xử lý chọn phương thức vận chuyển
   */
  const handleSelectMethod = (method: ShippingMethod) => {
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
   * Kiểm tra xem có miễn phí vận chuyển không
   */
  const isFreeShipping = (method: ShippingMethod, orderTotal: number = 0) => {
    return method.id === 'standard' && orderTotal >= 500000;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Phương thức vận chuyển
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Danh sách phương thức vận chuyển */}
        <div className="space-y-3">
          {shippingMethods.map((method) => {
            const IconComponent = method.icon;
            const isFree = isFreeShipping(method);
            
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
                {/* Recommended badge */}
                {method.isRecommended && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600">
                    Khuyến nghị
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
                        {isFree ? (
                          <div>
                            <span className="text-green-600 font-medium">Miễn phí</span>
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(method.fee)}
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium">{formatPrice(method.fee)}</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{method.estimatedTime}</span>
                      </div>
                    </div>
                    
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

        {/* Ghi chú vận chuyển */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-medium text-yellow-800 mb-2">Lưu ý vận chuyển:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Miễn phí vận chuyển cho đơn hàng từ 500.000đ (áp dụng giao hàng tiêu chuẩn)</li>
            <li>• Thời gian giao hàng có thể thay đổi tùy theo khu vực</li>
            <li>• Đơn hàng sẽ được xác nhận qua SMS/Email</li>
          </ul>
        </div>

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

export default ShippingMethodSelection;
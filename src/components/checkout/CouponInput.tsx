import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, X, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CouponInputProps {
  onCouponApply: (discount: number, couponCode: string) => void;
  appliedCoupon?: {
    code: string;
    discount: number;
  } | null;
  orderTotal: number;
}

// Dữ liệu mẫu các mã giảm giá
const SAMPLE_COUPONS = [
  {
    code: 'WELCOME10',
    discount: 50000,
    type: 'fixed', // fixed amount
    description: 'Giảm 50.000đ cho đơn hàng đầu tiên',
    minOrder: 200000
  },
  {
    code: 'SAVE15',
    discount: 15,
    type: 'percent', // percentage
    description: 'Giảm 15% cho đơn hàng từ 500.000đ',
    minOrder: 500000
  },
  {
    code: 'FREESHIP',
    discount: 30000,
    type: 'shipping', // free shipping
    description: 'Miễn phí vận chuyển',
    minOrder: 100000
  }
];

/**
 * Component nhập và áp dụng mã giảm giá
 * @param onCouponApply - Callback khi áp dụng mã giảm giá
 * @param appliedCoupon - Mã giảm giá đã áp dụng
 */
const CouponInput: React.FC<CouponInputProps> = ({ onCouponApply, appliedCoupon, orderTotal }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  /**
   * Xử lý áp dụng mã giảm giá
   */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsApplying(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Tìm mã giảm giá trong danh sách mẫu
      const coupon = SAMPLE_COUPONS.find(
        c => c.code.toLowerCase() === couponCode.toLowerCase()
      );

      if (!coupon) {
        setError('Mã giảm giá không hợp lệ');
        return;
      }

      // Validate minimum order amount
      if (orderTotal < coupon.minOrder) {
        setError(`Đơn hàng tối thiểu ${formatPrice(coupon.minOrder)} để sử dụng mã này`);
        return;
      }

      // Áp dụng mã giảm giá
      onCouponApply(coupon.discount, coupon.code);
      setCouponCode('');
      setShowSuggestions(false);
      
    } catch (error) {
      setError('Có lỗi xảy ra khi áp dụng mã giảm giá');
    } finally {
      setIsApplying(false);
    }
  };

  /**
   * Xử lý xóa mã giảm giá đã áp dụng
   */
  const handleRemoveCoupon = () => {
    onCouponApply(0, '');
  };

  /**
   * Xử lý áp dụng mã giảm giá từ gợi ý
   */
  const handleSuggestionClick = (code: string) => {
    setCouponCode(code);
    setShowSuggestions(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Mã giảm giá
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mã giảm giá đã áp dụng */}
        {appliedCoupon && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                <p className="text-sm text-green-600">
                  Giảm {formatPrice(appliedCoupon.discount)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Form nhập mã giảm giá */}
        {!appliedCoupon && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã giảm giá"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setError('');
                }}
                onFocus={() => setShowSuggestions(true)}
                className={error ? 'border-red-500' : ''}
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponCode.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isApplying ? 'Đang áp dụng...' : 'Áp dụng'}
              </Button>
            </div>

            {/* Hiển thị lỗi */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Gợi ý mã giảm giá */}
            {showSuggestions && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Mã giảm giá có sẵn:</p>
                <div className="space-y-2">
                  {SAMPLE_COUPONS.map((coupon) => (
                    <div
                      key={coupon.code}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSuggestionClick(coupon.code)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{coupon.code}</Badge>
                          {coupon.type === 'percent' && (
                            <span className="text-sm text-green-600">-{coupon.discount}%</span>
                          )}
                          {coupon.type === 'fixed' && (
                            <span className="text-sm text-green-600">-{formatPrice(coupon.discount)}</span>
                          )}
                          {coupon.type === 'shipping' && (
                            <span className="text-sm text-green-600">Miễn phí ship</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{coupon.description}</p>
                        <p className="text-xs text-gray-500">
                          Đơn tối thiểu: {formatPrice(coupon.minOrder)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponInput;
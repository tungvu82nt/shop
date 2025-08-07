import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { WishlistButton } from '../wishlist/WishlistButton';
import { Product } from '../../types/product';
import { cartService } from '../../services/cartService';
import { notificationService } from '../../services/notificationService';

interface ProductListItemProps {
  product: Product;
  onClick?: (product: Product) => void;
  showDescription?: boolean;
  showAddToCart?: boolean;
  className?: string;
}

// Hàm định dạng giá tiền
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Hàm định dạng số lượng đã bán
const formatSoldCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onClick,
  showDescription = true,
  showAddToCart = true,
  className = '',
}) => {
  const handleClick = () => {
    onClick?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      cartService.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });
      
      notificationService.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      notificationService.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Hình ảnh sản phẩm */}
          <div className="relative flex-shrink-0">
            <Link to={`/product/${product.id}`} onClick={handleClick}>
              <OptimizedImage
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg"
                loading="lazy"
              />
            </Link>
            
            {/* Huy hiệu giảm giá */}
            {discountPercentage > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 left-2 text-xs font-bold"
              >
                -{discountPercentage}%
              </Badge>
            )}
            
            {/* Huy hiệu nổi bật */}
            {product.isFeatured && (
              <Badge 
                variant="secondary" 
                className="absolute top-2 right-2 text-xs bg-yellow-500 text-white"
              >
                Nổi bật
              </Badge>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <Link 
                to={`/product/${product.id}`} 
                onClick={handleClick}
                className="flex-1 min-w-0"
              >
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              
              {/* Nút yêu thích */}
              <WishlistButton 
                product={product}
                size="sm"
                variant="ghost"
                iconOnly
                className="ml-2 flex-shrink-0"
              />
            </div>

            {/* Mô tả sản phẩm */}
            {showDescription && product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Đánh giá và số lượng đã bán */}
            <div className="flex items-center gap-4 mb-3">
              {/* Đánh giá sao */}
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating.toFixed(1)})
                </span>
              </div>

              {/* Số lượng đã bán */}
              {product.soldCount && (
                <span className="text-sm text-gray-500">
                  Đã bán {formatSoldCount(product.soldCount)}
                </span>
              )}
            </div>

            {/* Giá và địa điểm */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Nút thêm vào giỏ hàng */}
              {showAddToCart && (
                <Button
                  onClick={handleAddToCart}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Thêm vào giỏ
                </Button>
              )}
            </div>

            {/* Địa điểm và miễn phí vận chuyển */}
            <div className="flex items-center justify-between mt-2">
              {product.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>
              )}
              
              {product.isFreeShipping && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  Miễn phí vận chuyển
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
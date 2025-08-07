import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { wishlistService, WishlistData } from '../../services/wishlistService';
import { Product } from '../../types';
import { cn } from '../../lib/utils';
import { analytics } from '../../lib/analytics';

// Interface cho props
export interface WishlistButtonProps {
  product: Product;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
  iconOnly?: boolean;
  notes?: string;
  onToggle?: (isInWishlist: boolean) => void;
}

/**
 * Component nút thêm/xóa sản phẩm khỏi danh sách yêu thích
 */
export function WishlistButton({
  product,
  variant = 'ghost',
  size = 'md',
  showTooltip = true,
  className,
  iconOnly = false,
  notes,
  onToggle
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cập nhật trạng thái khi wishlist thay đổi
  useEffect(() => {
    const unsubscribe = wishlistService.subscribe((data: WishlistData) => {
      setIsInWishlist(wishlistService.isInWishlist(product.id));
    });

    return unsubscribe;
  }, [product.id]);

  // Xử lý click
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const wasInWishlist = isInWishlist;
      const success = wishlistService.toggleItem(product, notes);
      const newIsInWishlist = wishlistService.isInWishlist(product.id);
      
      if (success) {
        // Track wishlist analytics
        if (newIsInWishlist && !wasInWishlist) {
          // Added to wishlist
          analytics.trackEcommerce('add_to_wishlist', {
            currency: 'VND',
            value: product.price,
            items: [{
              item_id: product.id.toString(),
              item_name: product.name,
              item_category: product.category,
              item_brand: product.brand,
              price: product.price,
              quantity: 1
            }]
          });
          
          analytics.track('wishlist_add', {
            product_id: product.id,
            product_name: product.name,
            product_category: product.category,
            product_price: product.price,
            notes: notes || ''
          });
        } else if (!newIsInWishlist && wasInWishlist) {
          // Removed from wishlist
          analytics.trackEcommerce('remove_from_wishlist', {
            currency: 'VND',
            value: product.price,
            items: [{
              item_id: product.id.toString(),
              item_name: product.name,
              item_category: product.category,
              item_brand: product.brand,
              price: product.price,
              quantity: 1
            }]
          });
          
          analytics.track('wishlist_remove', {
            product_id: product.id,
            product_name: product.name,
            product_category: product.category,
            product_price: product.price
          });
        }
        
        if (onToggle) {
          onToggle(newIsInWishlist);
        }
      }
    } catch (error) {
      console.error('Lỗi khi toggle wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán kích thước icon
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  // Tính toán kích thước button
  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      default:
        return 'default';
    }
  };

  // Render button content
  const renderButtonContent = () => (
    <>
      <Heart
        className={cn(
          getIconSize(),
          'transition-all duration-200',
          isInWishlist
            ? 'fill-red-500 text-red-500 scale-110'
            : 'text-gray-400 hover:text-red-500',
          isLoading && 'animate-pulse'
        )}
      />
      {!iconOnly && (
        <span className={cn(
          'ml-2 transition-colors duration-200',
          isInWishlist ? 'text-red-500' : 'text-gray-600'
        )}>
          {isInWishlist ? 'Đã thích' : 'Yêu thích'}
        </span>
      )}
    </>
  );

  // Render với tooltip
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={getButtonSize()}
              onClick={handleClick}
              disabled={isLoading}
              className={cn(
                'transition-all duration-200',
                isInWishlist && variant === 'ghost' && 'bg-red-50 hover:bg-red-100',
                iconOnly && 'p-2',
                className
              )}
              aria-label={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
            >
              {renderButtonContent()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isInWishlist
                ? 'Xóa khỏi danh sách yêu thích'
                : 'Thêm vào danh sách yêu thích'
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Render không có tooltip
  return (
    <Button
      variant={variant}
      size={getButtonSize()}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isInWishlist && variant === 'ghost' && 'bg-red-50 hover:bg-red-100',
        iconOnly && 'p-2',
        className
      )}
      aria-label={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      {renderButtonContent()}
    </Button>
  );
}

export default WishlistButton;
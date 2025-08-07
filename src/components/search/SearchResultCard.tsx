import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Star, ShoppingCart, Zap } from 'lucide-react';
import { SearchResult } from '@/services/searchService';
import { cn, formatPrice } from '@/lib/utils';

interface SearchResultCardProps {
  result: SearchResult;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
  isWishlisted?: boolean;
  showOptimizationInfo?: boolean;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  isWishlisted = false,
  showOptimizationInfo = false,
  viewMode = 'grid',
  className
}) => {
  const handleCardClick = () => {
    onProductClick?.(result.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(result.id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist?.(result.id);
  };

  const renderOptimizationBadge = () => {
    if (!showOptimizationInfo || !result.optimizationMetadata) return null;

    const { optimizationMetadata } = result;
    const totalScore = optimizationMetadata.baseScore + 
                      optimizationMetadata.personalizedScore + 
                      optimizationMetadata.trendingScore + 
                      optimizationMetadata.locationScore + 
                      optimizationMetadata.seasonalScore + 
                      optimizationMetadata.popularityScore;

    if (totalScore > 4.5) {
      return (
        <Badge variant="secondary" className="absolute top-2 left-2 bg-green-100 text-green-800">
          <Zap className="w-3 h-3 mr-1" />
          Được đề xuất
        </Badge>
      );
    }

    return null;
  };

  const renderPriceSection = () => {
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-bold text-red-600">
          {formatPrice(result.price)}
        </span>
        {result.originalPrice && result.originalPrice > result.price && (
          <>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(result.originalPrice)}
            </span>
            <Badge variant="destructive" className="text-xs">
              -{Math.round((1 - result.price / result.originalPrice) * 100)}%
            </Badge>
          </>
        )}
      </div>
    );
  };

  const renderRatingSection = () => {
    if (!result.rating) return null;

    return (
      <div className="flex items-center gap-1 mb-2">
        <div className="flex items-center">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium ml-1">{result.rating}</span>
        </div>
        {result.reviewCount && (
          <span className="text-xs text-gray-500">({result.reviewCount} đánh giá)</span>
        )}
      </div>
    );
  };

  const renderLocationSection = () => {
    if (!result.location) return null;

    return (
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <MapPin className="w-3 h-3" />
        <span>{result.location}</span>
      </div>
    );
  };

  const renderStockStatus = () => {
    return (
      <div className="mb-3">
        {result.inStock ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Còn hàng
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Hết hàng
          </Badge>
        )}
      </div>
    );
  };

  const renderOptimizationDetails = () => {
    if (!showOptimizationInfo || !result.optimizationMetadata) return null;

    const { optimizationMetadata } = result;
    
    return (
      <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
        <div className="font-medium mb-1">Điểm tối ưu hóa:</div>
        <div className="grid grid-cols-2 gap-1">
          <div>Liên quan: {optimizationMetadata.baseScore.toFixed(1)}</div>
          <div>Cá nhân: {optimizationMetadata.personalizedScore.toFixed(1)}</div>
          <div>Xu hướng: {optimizationMetadata.trendingScore.toFixed(1)}</div>
          <div>Vị trí: {optimizationMetadata.locationScore.toFixed(1)}</div>
          <div>Mùa vụ: {optimizationMetadata.seasonalScore.toFixed(1)}</div>
          <div>Phổ biến: {optimizationMetadata.popularityScore.toFixed(1)}</div>
        </div>
        {result.relevanceScore && (
          <div className="mt-1 font-medium">
            Điểm tổng: {result.relevanceScore.toFixed(2)}
          </div>
        )}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className={cn(
          "group cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden",
          !result.inStock && "opacity-75",
          className
        )}
        onClick={handleCardClick}
      >
        {renderOptimizationBadge()}
        
        <div className="flex gap-4 p-4">
          {/* Hình ảnh sản phẩm */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={result.imageUrl}
              alt={result.title}
              className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {result.title}
            </h3>
            
            {result.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {result.description}
              </p>
            )}

            <div className="flex gap-1 mb-2">
              {result.category && (
                <Badge variant="outline" className="text-xs">
                  {result.category}
                </Badge>
              )}
              {result.brand && (
                <Badge variant="outline" className="text-xs">
                  {result.brand}
                </Badge>
              )}
            </div>

            {renderRatingSection()}
            {renderLocationSection()}
            {renderPriceSection()}
            {renderStockStatus()}
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col gap-2 justify-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 rounded-full",
                isWishlisted && "text-red-500"
              )}
              onClick={handleToggleWishlist}
            >
              <Heart 
                className={cn(
                  "w-4 h-4",
                  isWishlisted && "fill-current"
                )} 
              />
            </Button>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!result.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Optimization Details (Debug Mode) */}
        {showOptimizationInfo && (
          <div className="px-4 pb-4">
            {renderOptimizationDetails()}
          </div>
        )}
      </Card>
    );
  }

  // Grid view
  return (
    <Card 
      className={cn(
        "group cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden",
        !result.inStock && "opacity-75",
        className
      )}
      onClick={handleCardClick}
    >
      {renderOptimizationBadge()}
      
      <div className="relative">
        <img
          src={result.imageUrl}
          alt={result.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        
        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white",
            isWishlisted && "text-red-500"
          )}
          onClick={handleToggleWishlist}
        >
          <Heart 
            className={cn(
              "w-4 h-4",
              isWishlisted && "fill-current"
            )} 
          />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {result.title}
        </h3>

        {/* Description */}
        {result.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {result.description}
          </p>
        )}

        {/* Category and Brand */}
        <div className="flex gap-1 mb-2">
          {result.category && (
            <Badge variant="outline" className="text-xs">
              {result.category}
            </Badge>
          )}
          {result.brand && (
            <Badge variant="outline" className="text-xs">
              {result.brand}
            </Badge>
          )}
        </div>

        {/* Rating */}
        {renderRatingSection()}

        {/* Location */}
        {renderLocationSection()}

        {/* Price */}
        {renderPriceSection()}

        {/* Stock Status */}
        {renderStockStatus()}

        {/* Add to Cart Button */}
        <Button
          className="w-full mt-2"
          size="sm"
          onClick={handleAddToCart}
          disabled={!result.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {result.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </Button>

        {/* Optimization Details (Debug Mode) */}
        {renderOptimizationDetails()}
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
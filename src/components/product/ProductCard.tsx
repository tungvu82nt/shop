import { Link } from 'react-router-dom'
import { Star, MapPin, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { WishlistButton } from '@/components/wishlist/WishlistButton'
import { Product } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import { analytics } from '@/lib/analytics'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'featured'
  showWishlist?: boolean
  showAddToCart?: boolean
  className?: string
  onClick?: (product: Product) => void
}

const ProductCard = ({
  product,
  variant = 'default',
  showWishlist = true,
  showAddToCart = false,
  className,
  onClick
}: ProductCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Track add to cart analytics
    analytics.trackEcommerce('add_to_cart', {
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
    
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id)
  }

  // Tính toán rating stars
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
      )
    }

    return stars
  }

  return (
    <Card 
      className={cn(
        'group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden',
        className
      )}
      onClick={handleClick}
    >
      <Link 
        to={`/product/${product.id}`} 
        className="block"
        onClick={() => {
          // Track product view analytics
          analytics.trackEcommerce('view_item', {
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
        }}
      >
        <div className="relative aspect-square">
          <OptimizedImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            category={product.category}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discount && (
              <Badge className="bg-red-500 text-white text-xs">
                -{product.discount}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-yellow-500 text-white text-xs">
                Hot
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          {showWishlist && (
            <div className="absolute top-2 right-2">
              <WishlistButton
                product={product}
                iconOnly
                size="sm"
              />
            </div>
          )}
          
          {/* Quick Add to Cart */}
          {showAddToCart && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{product.location}</span>
            </div>
            <span>Đã bán {product.soldCount}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default ProductCard
export { ProductCard }
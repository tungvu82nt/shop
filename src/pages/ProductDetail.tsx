import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, Share2, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/CartContext'
import { sampleProducts } from '@/components/home/ProductSection'
import ProductCard from '@/components/product/ProductCard'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductReviews from '@/components/product/ProductReviews'
import { SEOHead, ProductStructuredData, BreadcrumbStructuredData } from '@/components/SEO'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { analytics } from '@/lib/analytics'

// Interface cho Product Detail
interface ProductDetail {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviewCount: number
  images: string[]
  description: string
  specifications: { [key: string]: string }
  variants: {
    colors: string[]
    sizes: string[]
  }
  stock: number
  soldCount: number
  brand: string
  category: string
  isFreeShipping: boolean
  location: string
}

// Mock data cho product detail
const mockProductDetail: ProductDetail = {
  id: '1',
  name: 'iPhone 15 Pro Max 256GB - Chính hãng VN/A',
  price: 29990000,
  originalPrice: 34990000,
  discount: 14,
  rating: 4.8,
  reviewCount: 2847,
  images: [
    'https://picsum.photos/500/500?random=2',
    'https://picsum.photos/500/500?random=2+Back',
    'https://picsum.photos/500/500?random=2+Side',
    'https://picsum.photos/500/500?random=2+Camera'
  ],
  description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp và thiết kế titan cao cấp. Sản phẩm chính hãng Apple Việt Nam với đầy đủ phụ kiện và bảo hành 12 tháng.',
  specifications: {
    'Màn hình': '6.7 inch Super Retina XDR OLED',
    'Chip xử lý': 'Apple A17 Pro 6-core',
    'RAM': '8GB',
    'Bộ nhớ trong': '256GB',
    'Camera sau': '48MP + 12MP + 12MP',
    'Camera trước': '12MP TrueDepth',
    'Pin': '4441mAh, sạc nhanh 27W',
    'Hệ điều hành': 'iOS 17',
    'Chất liệu': 'Khung Titan, mặt lưng kính',
    'Kháng nước': 'IP68'
  },
  variants: {
    colors: ['Titan Tự Nhiên', 'Titan Xanh', 'Titan Trắng', 'Titan Đen'],
    sizes: ['128GB', '256GB', '512GB', '1TB']
  },
  stock: 50,
  soldCount: 1247,
  brand: 'Apple',
  category: 'Điện thoại',
  isFreeShipping: true,
  location: 'TP. Hồ Chí Minh'
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { addItem, openCart } = useCart()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  // Simulate API call để lấy product detail
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, fetch from API based on id
      setProduct(mockProductDetail)
      setSelectedColor(mockProductDetail.variants.colors[0])
      setSelectedSize(mockProductDetail.variants.sizes[1]) // Default to 256GB
      setLoading(false)
      
      // Track product view event (Theo dõi sự kiện xem sản phẩm)
      analytics.trackEcommerce('view_item', {
        currency: 'VND',
        value: mockProductDetail.price,
        items: [{
          item_id: mockProductDetail.id,
          item_name: mockProductDetail.name,
          item_category: mockProductDetail.category,
          item_brand: mockProductDetail.brand,
          price: mockProductDetail.price,
          quantity: 1
        }]
      })
    }

    fetchProduct()
  }, [id])

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  // Handle add to cart (Xử lý thêm vào giỏ hàng)
  const handleAddToCart = () => {
    if (!product) return
    
    // Validate selections (Kiểm tra lựa chọn)
    if (product.variants.colors.length > 0 && !selectedColor) {
      toast({
        title: "Vui lòng chọn màu sắc",
        description: "Bạn cần chọn màu sắc trước khi thêm vào giỏ hàng.",
        variant: "destructive"
      })
      return
    }
    
    if (product.variants.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Vui lòng chọn dung lượng",
        description: "Bạn cần chọn dung lượng trước khi thêm vào giỏ hàng.",
        variant: "destructive"
      })
      return
    }
    
    // Add to cart (Thêm vào giỏ hàng)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      variant: {
        color: selectedColor,
        size: selectedSize
      }
    })
    
    // Track add to cart event (Theo dõi sự kiện thêm vào giỏ hàng)
    analytics.trackEcommerce('add_to_cart', {
      currency: 'VND',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        price: product.price,
        quantity: quantity,
        item_variant: `${selectedColor} - ${selectedSize}`
      }]
    })
    
    // Show success message (Hiển thị thông báo thành công)
    toast({
      title: "Đã thêm vào giỏ hàng!",
      description: `${product.name} (${quantity} sản phẩm) đã được thêm vào giỏ hàng.`,
      action: (
        <Button variant="outline" size="sm" onClick={openCart}>
          Xem giỏ hàng
        </Button>
      )
    })
  }

  // Handle buy now (Xử lý mua ngay)
  const handleBuyNow = () => {
    if (!product) return
    
    // Validate selections (Kiểm tra lựa chọn)
    if (product.variants.colors.length > 0 && !selectedColor) {
      toast({
        title: "Vui lòng chọn màu sắc",
        description: "Bạn cần chọn màu sắc trước khi mua.",
        variant: "destructive"
      })
      return
    }
    
    if (product.variants.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Vui lòng chọn dung lượng",
        description: "Bạn cần chọn dung lượng trước khi mua.",
        variant: "destructive"
      })
      return
    }
    
    // Add to cart first (Thêm vào giỏ hàng trước)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      variant: {
        color: selectedColor,
        size: selectedSize
      }
    })
    
    // Track begin checkout event (Theo dõi sự kiện bắt đầu thanh toán)
    analytics.trackEcommerce('begin_checkout', {
      currency: 'VND',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        price: product.price,
        quantity: quantity,
        item_variant: `${selectedColor} - ${selectedSize}`
      }]
    })
    
    // Navigate to checkout (Chuyển đến trang thanh toán)
    navigate('/checkout')
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              Về trang chủ
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  // Get related products (exclude current product)
  const relatedProducts = sampleProducts.filter(p => p.id !== product.id).slice(0, 4)

  // SEO breadcrumb items
  const breadcrumbItems = [
    { name: 'Trang chủ', url: '/' },
    { name: product.category, url: `/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: product.name, url: `/product/${id}` }
  ];

  return (
    <Layout>
      {/* SEO Components */}
      <SEOHead
        title={`${product.name} | Yapee Vietnam`}
        description={product.description.substring(0, 160)}
        keywords={`${product.name}, ${product.brand}, ${product.category}, mua sắm trực tuyến, yapee`}
        ogTitle={product.name}
        ogDescription={product.description.substring(0, 160)}
        ogImage={product.images[0]}
        ogType="product"
      />
      <ProductStructuredData
        name={product.name}
        description={product.description}
        price={product.price}
        image={product.images[0]}
        sku={product.id}
        brand={product.brand}
        availability={product.stock > 0 ? 'InStock' : 'OutOfStock'}
        ratingValue={product.rating}
        reviewCount={product.reviewCount}
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-blue-600"
              >
                Trang chủ
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-700">{product.category}</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500 truncate max-w-xs">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <ProductImageGallery 
            images={product.images} 
            productName={product.name}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-gray-600">
                  Đã bán {product.soldCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.isFreeShipping && (
                  <Badge className="bg-green-100 text-green-800">
                    Miễn phí vận chuyển
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Giá đã bao gồm VAT</p>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Màu sắc: <span className="font-normal">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Dung lượng: <span className="font-normal">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Số lượng:</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700"
                >
                  Mua ngay
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-2 ${
                    isLiked ? 'fill-red-500 text-red-500' : ''
                  }`} />
                  {isLiked ? 'Đã thích' : 'Yêu thích'}
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>

            {/* Shipping & Services */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Miễn phí vận chuyển</p>
                  <p className="text-gray-600">Giao hàng từ {product.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Bảo hành chính hãng</p>
                  <p className="text-gray-600">12 tháng bảo hành toàn quốc</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Đổi trả miễn phí</p>
                  <p className="text-gray-600">Trong vòng 7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá ({product.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Additional description content */}
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Tính năng nổi bật:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Chip A17 Pro với hiệu suất vượt trội</li>
                        <li>Camera 48MP với chế độ chụp đêm cải tiến</li>
                        <li>Thiết kế titan cao cấp, bền bỉ</li>
                        <li>Màn hình Super Retina XDR 6.7 inch</li>
                        <li>Hỗ trợ sạc nhanh và sạc không dây</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews 
                productId={product.id}
                ratingSummary={{
                  averageRating: product.rating,
                  totalReviews: product.reviewCount,
                  ratingDistribution: {
                    5: Math.floor(product.reviewCount * 0.75),
                    4: Math.floor(product.reviewCount * 0.20),
                    3: Math.floor(product.reviewCount * 0.03),
                    2: Math.floor(product.reviewCount * 0.01),
                    1: Math.floor(product.reviewCount * 0.01)
                  }
                }}
                reviews={[]}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ProductDetail
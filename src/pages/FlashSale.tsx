import { useState, useEffect } from 'react'
import { Clock, ChevronLeft, ChevronRight, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types/product'

interface FlashSaleProduct extends Product {
  originalPrice: number
  salePrice: number
  discount: number
  sold: number
  stock: number
}

const FlashSalePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 45
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('discount')

  // Mock flash sale products - chuyển đổi sang Product interface
  const flashSaleProducts: FlashSaleProduct[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      price: 29990000,
      originalPrice: 34990000,
      salePrice: 29990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 14,
      sold: 89,
      stock: 100,
      rating: 4.8,
      reviewCount: 245,
      category: 'Điện thoại',
      brand: 'Apple',
      description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ',
      images: ['https://picsum.photos/300/300?random=1'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      price: 27990000,
      originalPrice: 32990000,
      salePrice: 27990000,
      imageUrl: 'https://picsum.photos/300/300?random=2',
      discount: 15,
      sold: 156,
      stock: 200,
      rating: 4.7,
      reviewCount: 189,
      category: 'Điện thoại',
      brand: 'Samsung',
      description: 'Samsung Galaxy S24 Ultra với S Pen tích hợp',
      images: ['https://picsum.photos/300/300?random=2'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'MacBook Air M3 13 inch',
      price: 25990000,
      originalPrice: 28990000,
      salePrice: 25990000,
      imageUrl: 'https://picsum.photos/300/300?random=3',
      discount: 10,
      sold: 67,
      stock: 150,
      rating: 4.9,
      reviewCount: 312,
      category: 'Laptop',
      brand: 'Apple',
      description: 'MacBook Air M3 siêu mỏng nhẹ',
      images: ['https://picsum.photos/300/300?random=3'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      price: 6990000,
      originalPrice: 8990000,
      salePrice: 6990000,
      imageUrl: 'https://picsum.photos/300/300?random=4',
      discount: 22,
      sold: 234,
      stock: 300,
      rating: 4.6,
      reviewCount: 567,
      category: 'Tai nghe',
      brand: 'Sony',
      description: 'Tai nghe chống ồn hàng đầu',
      images: ['https://picsum.photos/300/300?random=4'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'iPad Pro 12.9 inch M2',
      price: 23990000,
      originalPrice: 26990000,
      salePrice: 23990000,
      imageUrl: 'https://picsum.photos/300/300?random=5',
      discount: 11,
      sold: 45,
      stock: 80,
      rating: 4.8,
      reviewCount: 123,
      category: 'Máy tính bảng',
      brand: 'Apple',
      description: 'iPad Pro với chip M2 mạnh mẽ',
      images: ['https://picsum.photos/300/300?random=5'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Apple Watch Series 9',
      price: 7990000,
      originalPrice: 9990000,
      salePrice: 7990000,
      imageUrl: 'https://picsum.photos/300/300?random=6',
      discount: 20,
      sold: 178,
      stock: 250,
      rating: 4.7,
      reviewCount: 289,
      category: 'Đồng hồ thông minh',
      brand: 'Apple',
      description: 'Apple Watch Series 9 với nhiều tính năng sức khỏe',
      images: ['https://picsum.photos/300/300?random=6'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '7',
      name: 'Dell XPS 13 Plus',
      price: 28990000,
      originalPrice: 32990000,
      salePrice: 28990000,
      imageUrl: 'https://picsum.photos/300/300?random=7',
      discount: 12,
      sold: 23,
      stock: 60,
      rating: 4.5,
      reviewCount: 78,
      category: 'Laptop',
      brand: 'Dell',
      description: 'Dell XPS 13 Plus thiết kế cao cấp',
      images: ['https://picsum.photos/300/300?random=7'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '8',
      name: 'AirPods Pro 2nd Generation',
      price: 5490000,
      originalPrice: 6490000,
      salePrice: 5490000,
      imageUrl: 'https://picsum.photos/300/300?random=8',
      discount: 15,
      sold: 345,
      stock: 500,
      rating: 4.8,
      reviewCount: 456,
      category: 'Tai nghe',
      brand: 'Apple',
      description: 'AirPods Pro thế hệ 2 với chống ồn chủ động',
      images: ['https://picsum.photos/300/300?random=8'],
      specifications: {},
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const sortedProducts = [...flashSaleProducts].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return b.discount - a.discount
      case 'price-low':
        return a.salePrice - b.salePrice
      case 'price-high':
        return b.salePrice - a.salePrice
      case 'sold':
        return b.sold - a.sold
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với countdown */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">FLASH SALE</h1>
              <p className="text-orange-100">Giảm giá sốc - Số lượng có hạn</p>
            </div>
            <div className="text-center">
              <div className="text-sm mb-2">Kết thúc trong</div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                <Clock className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters và Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Sắp xếp theo:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="discount">Giảm giá cao nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="sold">Bán chạy nhất</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product) => {
            const progressPercentage = (product.sold / (product.sold + product.stock)) * 100
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {viewMode === 'grid' ? (
                  <div>
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10">
                        {product.name}
                      </h3>
                      
                      {/* Prices */}
                      <div className="mb-3">
                        <div className="text-orange-500 font-bold text-lg">
                          {formatPrice(product.salePrice)}
                        </div>
                        <div className="text-gray-400 text-sm line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Đã bán {product.sold}</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{product.rating}</span>
                        </div>
                        <span className="ml-2">({product.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List view
                  <div className="flex p-4">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                        -{product.discount}%
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="text-orange-500 font-bold text-xl">
                          {formatPrice(product.salePrice)}
                        </div>
                        <div className="text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{product.rating}</span>
                          <span className="ml-1">({product.reviewCount})</span>
                        </div>
                        <span>Đã bán {product.sold}</span>
                      </div>
                      
                      <div className="w-48">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Tiến độ bán</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
            Xem thêm sản phẩm
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FlashSalePage
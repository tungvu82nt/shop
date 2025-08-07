import { useState, useEffect } from 'react'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/product/ProductCard'

interface FlashSaleProduct {
  id: string
  name: string
  originalPrice: number
  salePrice: number
  imageUrl: string
  discount: number
  sold: number
  stock: number
  rating: number
  reviewCount: number
}

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 45
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 6

  // Mock flash sale products
  const flashSaleProducts: FlashSaleProduct[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      originalPrice: 34990000,
      salePrice: 29990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 14,
      sold: 89,
      stock: 100,
      rating: 4.8,
      reviewCount: 245
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      originalPrice: 32990000,
      salePrice: 27990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 15,
      sold: 156,
      stock: 200,
      rating: 4.7,
      reviewCount: 189
    },
    {
      id: '3',
      name: 'MacBook Air M3 13 inch',
      originalPrice: 28990000,
      salePrice: 25990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 10,
      sold: 67,
      stock: 150,
      rating: 4.9,
      reviewCount: 312
    },
    {
      id: '4',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      originalPrice: 8990000,
      salePrice: 6990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 22,
      sold: 234,
      stock: 300,
      rating: 4.6,
      reviewCount: 567
    },
    {
      id: '5',
      name: 'iPad Pro 12.9 inch M2',
      originalPrice: 26990000,
      salePrice: 23990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 11,
      sold: 45,
      stock: 80,
      rating: 4.8,
      reviewCount: 123
    },
    {
      id: '6',
      name: 'Apple Watch Series 9',
      originalPrice: 9990000,
      salePrice: 7990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 20,
      sold: 178,
      stock: 250,
      rating: 4.7,
      reviewCount: 289
    },
    {
      id: '7',
      name: 'Dell XPS 13 Plus',
      originalPrice: 32990000,
      salePrice: 28990000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 12,
      sold: 23,
      stock: 60,
      rating: 4.5,
      reviewCount: 78
    },
    {
      id: '8',
      name: 'AirPods Pro 2nd Generation',
      originalPrice: 6490000,
      salePrice: 5490000,
      imageUrl: 'https://picsum.photos/300/300?random=1',
      discount: 15,
      sold: 345,
      stock: 500,
      rating: 4.8,
      reviewCount: 456
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

  const maxIndex = Math.max(0, flashSaleProducts.length - itemsPerPage)

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">FLASH SALE</h2>
          <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >
          {flashSaleProducts.map((product) => {
            const progressPercentage = (product.sold / (product.sold + product.stock)) * 100
            
            return (
              <div key={product.id} className="w-1/6 flex-shrink-0 px-2">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 text-gray-900">
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
              </div>
            )
          })}
        </div>
      </div>
      
      {/* View All Button */}
      <div className="text-center mt-6">
        <Button 
          variant="outline" 
          className="bg-white text-orange-500 border-white hover:bg-orange-50"
        >
          Xem Tất Cả
        </Button>
      </div>
    </div>
  )
}

export default FlashSale
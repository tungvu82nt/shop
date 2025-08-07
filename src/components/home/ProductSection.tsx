import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/product/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  discount?: number
  rating: number
  reviewCount: number
  sold: number
  location: string
  freeShipping?: boolean
  isLiked?: boolean
}

interface ProductSectionProps {
  title: string
  products: Product[]
  showViewAll?: boolean
}

const ProductSection = ({ title, products, showViewAll = true }: ProductSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 6
  const maxIndex = Math.max(0, products.length - itemsPerPage)

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 uppercase">
          {title}
        </h2>
        
        <div className="flex items-center space-x-2">
          {showViewAll && (
            <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 hover:bg-orange-50">
              Xem Tất Cả
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 p-2"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 p-2"
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
          {products.map((product) => (
            <div key={product.id} className="w-1/6 flex-shrink-0 px-2">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sample data for different sections
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Áo thun nam cotton 100% cao cấp',
    price: 299000,
    originalPrice: 399000,
    imageUrl: 'https://picsum.photos/300/300?random=1',
    discount: 25,
    rating: 4.8,
    reviewCount: 1234,
    sold: 2500,
    location: 'TP. Hồ Chí Minh',
    freeShipping: true
  },
  {
    id: '2',
    name: 'Giày sneaker nam thể thao',
    price: 899000,
    originalPrice: 1299000,
    imageUrl: 'https://picsum.photos/200/200?random=9',
    discount: 31,
    rating: 4.6,
    reviewCount: 856,
    sold: 1200,
    location: 'Hà Nội',
    freeShipping: true
  },
  {
    id: '3',
    name: 'Túi xách nữ da thật cao cấp',
    price: 1599000,
    imageUrl: 'https://picsum.photos/200/200?random=11',
    rating: 4.9,
    reviewCount: 567,
    sold: 890,
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: '4',
    name: 'Đồng hồ nam chính hãng',
    price: 2999000,
    originalPrice: 3999000,
    imageUrl: 'https://picsum.photos/300/300?random=1',
    discount: 25,
    rating: 4.7,
    reviewCount: 234,
    sold: 456,
    location: 'Đà Nẵng',
    freeShipping: true
  },
  {
    id: '5',
    name: 'Váy đầm nữ công sở',
    price: 599000,
    originalPrice: 799000,
    imageUrl: 'https://picsum.photos/300/300?random=1',
    discount: 25,
    rating: 4.5,
    reviewCount: 789,
    sold: 1567,
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: '6',
    name: 'Laptop gaming cao cấp',
    price: 25999000,
    originalPrice: 29999000,
    imageUrl: 'https://picsum.photos/300/300?random=1',
    discount: 13,
    rating: 4.8,
    reviewCount: 123,
    sold: 89,
    location: 'Hà Nội',
    freeShipping: true
  },
  {
    id: '7',
    name: 'Tai nghe bluetooth cao cấp',
    price: 1299000,
    originalPrice: 1799000,
    imageUrl: 'https://picsum.photos/300/300?random=1',
    discount: 28,
    rating: 4.6,
    reviewCount: 445,
    sold: 678,
    location: 'TP. Hồ Chí Minh',
    freeShipping: true
  },
  {
    id: '8',
    name: 'Kem dưỡng da mặt vitamin C',
    price: 399000,
    imageUrl: 'https://picsum.photos/300/300?random=1',
    rating: 4.9,
    reviewCount: 1567,
    sold: 3456,
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: '9',
    name: 'Quần jeans nam slim fit',
    price: 699000,
    originalPrice: 999000,
    imageUrl: 'https://picsum.photos/300/300?random=6',
    discount: 30,
    rating: 4.4,
    reviewCount: 234,
    sold: 567,
    location: 'Hà Nội'
  },
  {
    id: '10',
    name: 'Máy pha cà phê espresso',
    price: 4999000,
    originalPrice: 6999000,
    imageUrl: 'https://picsum.photos/300/300?random=7',
    discount: 29,
    rating: 4.7,
    reviewCount: 89,
    sold: 123,
    location: 'TP. Hồ Chí Minh',
    freeShipping: true
  }
]

export default ProductSection
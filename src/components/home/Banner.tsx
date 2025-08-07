import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BannerItem {
  id: string
  title: string
  imageUrl: string
  link: string
}

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Mock banner data - in real app, this would come from API
  const banners: BannerItem[] = [
    {
      id: '1',
      title: 'Flash Sale 12.12 - Giảm đến 50%',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      link: '/flash-sale'
    },
    {
      id: '2', 
      title: 'Thời trang mùa đông - Ưu đãi khủng',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      link: '/winter-fashion'
    },
    {
      id: '3',
      title: 'Điện thoại mới - Trả góp 0%',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      link: '/phones'
    },
    {
      id: '4',
      title: 'Laptop Gaming - Giá sốc cuối năm',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      link: '/laptops'
    }
  ]

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg bg-gray-200">
      {/* Banner Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            <a href={banner.link} className="block w-full h-full">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <h2 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
                  {banner.title}
                </h2>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner
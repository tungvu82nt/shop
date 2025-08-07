import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Zap, Clock, Flame, Star, ShoppingCart, Eye, TrendingUp, Gift, Timer, Percent } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect } from 'react'

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  })

  // Countdown timer effect
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

  const flashSaleProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      image: '/api/placeholder/200/200',
      originalPrice: 34990000,
      salePrice: 29990000,
      discount: 14,
      sold: 156,
      total: 200,
      rating: 4.8,
      reviews: 2341,
      timeLeft: '02:45:30',
      isHot: true,
      category: 'Điện tử'
    },
    {
      id: 2,
      name: 'MacBook Air M2 13" 256GB',
      image: '/api/placeholder/200/200',
      originalPrice: 28990000,
      salePrice: 24990000,
      discount: 14,
      sold: 89,
      total: 150,
      rating: 4.9,
      reviews: 1876,
      timeLeft: '02:45:30',
      isHot: false,
      category: 'Laptop'
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      image: '/api/placeholder/200/200',
      originalPrice: 31990000,
      salePrice: 26990000,
      discount: 16,
      sold: 234,
      total: 300,
      rating: 4.7,
      reviews: 3421,
      timeLeft: '02:45:30',
      isHot: true,
      category: 'Điện thoại'
    },
    {
      id: 4,
      name: 'AirPods Pro 2nd Gen',
      image: '/api/placeholder/200/200',
      originalPrice: 6490000,
      salePrice: 4990000,
      discount: 23,
      sold: 445,
      total: 500,
      rating: 4.8,
      reviews: 5632,
      timeLeft: '02:45:30',
      isHot: false,
      category: 'Phụ kiện'
    },
    {
      id: 5,
      name: 'Nike Air Force 1 \'07',
      image: '/api/placeholder/200/200',
      originalPrice: 2890000,
      salePrice: 1990000,
      discount: 31,
      sold: 678,
      total: 800,
      rating: 4.6,
      reviews: 4521,
      timeLeft: '02:45:30',
      isHot: true,
      category: 'Giày dép'
    },
    {
      id: 6,
      name: 'Sony WH-1000XM5',
      image: '/api/placeholder/200/200',
      originalPrice: 8990000,
      salePrice: 6990000,
      discount: 22,
      sold: 123,
      total: 200,
      rating: 4.9,
      reviews: 2876,
      timeLeft: '02:45:30',
      isHot: false,
      category: 'Âm thanh'
    }
  ]

  const upcomingFlashSales = [
    {
      time: '12:00',
      title: 'Flash Sale Trưa',
      description: 'Giảm đến 70% các sản phẩm thời trang',
      products: 150,
      startsIn: '4h 15m'
    },
    {
      time: '18:00',
      title: 'Flash Sale Chiều',
      description: 'Điện tử - Gia dụng siêu rẻ',
      products: 200,
      startsIn: '10h 15m'
    },
    {
      time: '21:00',
      title: 'Flash Sale Tối',
      description: 'Làm đẹp - Chăm sóc sức khỏe',
      products: 120,
      startsIn: '13h 15m'
    },
    {
      time: '00:00',
      title: 'Flash Sale Đêm',
      description: 'Đồ ăn - Thức uống - Nhu yếu phẩm',
      products: 180,
      startsIn: '16h 15m'
    }
  ]

  const categories = [
    { name: 'Tất cả', count: 1250, active: true },
    { name: 'Điện tử', count: 234, active: false },
    { name: 'Thời trang', count: 456, active: false },
    { name: 'Gia dụng', count: 189, active: false },
    { name: 'Làm đẹp', count: 167, active: false },
    { name: 'Thể thao', count: 98, active: false },
    { name: 'Sách', count: 76, active: false },
    { name: 'Khác', count: 30, active: false }
  ]

  const flashSaleStats = [
    { label: 'Sản phẩm đang sale', value: '1,250+', icon: Gift },
    { label: 'Người đang xem', value: '45,678', icon: Eye },
    { label: 'Đã bán hôm nay', value: '12,345', icon: ShoppingCart },
    { label: 'Tiết kiệm trung bình', value: '45%', icon: Percent }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  return (
    <Layout>
      <Helmet>
        <title>Flash Sale - Giảm giá sốc mỗi ngày | Yapee</title>
        <meta name="description" content="Flash Sale hàng ngày với giảm giá lên đến 90%. Săn deal hot, mua sắm thông minh tại Yapee." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-12 h-12 mr-4 animate-pulse" />
              <h1 className="text-4xl font-bold">FLASH SALE</h1>
              <Flame className="w-12 h-12 ml-4 animate-bounce" />
            </div>
            <p className="text-xl mb-6 opacity-90">
              ⚡ Giảm giá sốc - Số lượng có hạn - Thời gian có hạn ⚡
            </p>
            
            {/* Countdown Timer */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-center">
                <div className="bg-white text-red-500 text-2xl font-bold px-4 py-2 rounded-lg min-w-[60px]">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm mt-1">Giờ</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="bg-white text-red-500 text-2xl font-bold px-4 py-2 rounded-lg min-w-[60px]">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm mt-1">Phút</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="bg-white text-red-500 text-2xl font-bold px-4 py-2 rounded-lg min-w-[60px]">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm mt-1">Giây</div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flashSaleStats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <IconComponent className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-sm opacity-75">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "default" : "outline"}
                  size="sm"
                  className={category.active ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flash Sale Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Fire className="w-6 h-6 mr-2 text-red-500" />
              Đang Flash Sale
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Timer className="w-4 h-4" />
              <span>Kết thúc sau: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashSaleProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                {product.isHot && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Fire className="w-3 h-3 mr-1" />
                      HOT
                    </Badge>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-red-500 text-white font-bold">
                    -{product.discount}%
                  </Badge>
                </div>

                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                      <Badge variant="outline" className="text-white border-white">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({formatNumber(product.reviews)})</span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl font-bold text-red-500">
                          {formatPrice(product.salePrice)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Đã bán {product.sold}/{product.total}</span>
                        <span>{Math.round((product.sold / product.total) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(product.sold / product.total) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <Button className="w-full bg-red-500 hover:bg-red-600">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Mua ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Xem thêm sản phẩm
              <TrendingUp className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Upcoming Flash Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Flash Sale sắp diễn ra
            </CardTitle>
            <CardDescription>
              Đặt nhắc nhở để không bỏ lỡ các deal hot sắp tới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingFlashSales.map((sale, index) => (
                <Card key={index} className="border-dashed border-2 hover:border-solid hover:shadow-md transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{sale.time}</div>
                    <h4 className="font-bold mb-2">{sale.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{sale.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline">{sale.products} sản phẩm</Badge>
                      <span className="text-sm text-red-500 font-medium">{sale.startsIn}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Đặt nhắc nhở
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default FlashSales
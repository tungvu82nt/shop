import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Search, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const Brands = () => {
  // Mock data cho thương hiệu
  const featuredBrands = [
    {
      id: 1,
      name: 'Samsung',
      logo: '/api/placeholder/120/80',
      followers: '2.5M',
      products: '15K+',
      rating: 4.8,
      category: 'Điện tử'
    },
    {
      id: 2,
      name: 'Nike',
      logo: '/api/placeholder/120/80',
      followers: '1.8M',
      products: '8K+',
      rating: 4.7,
      category: 'Thể thao'
    },
    {
      id: 3,
      name: 'Uniqlo',
      logo: '/api/placeholder/120/80',
      followers: '1.2M',
      products: '5K+',
      rating: 4.6,
      category: 'Thời trang'
    },
    {
      id: 4,
      name: 'Apple',
      logo: '/api/placeholder/120/80',
      followers: '3.1M',
      products: '2K+',
      rating: 4.9,
      category: 'Điện tử'
    }
  ]

  const trendingBrands = [
    { name: 'Xiaomi', growth: '+25%' },
    { name: 'Adidas', growth: '+18%' },
    { name: 'Zara', growth: '+15%' },
    { name: 'Canon', growth: '+12%' },
    { name: 'Sony', growth: '+10%' }
  ]

  const categories = [
    { name: 'Điện tử', count: 245, icon: '📱' },
    { name: 'Thời trang', count: 189, icon: '👕' },
    { name: 'Thể thao', count: 156, icon: '⚽' },
    { name: 'Làm đẹp', count: 134, icon: '💄' },
    { name: 'Gia dụng', count: 98, icon: '🏠' },
    { name: 'Sách', count: 76, icon: '📚' }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Thương hiệu - Yapee</title>
        <meta name="description" content="Khám phá các thương hiệu nổi tiếng và uy tín trên Yapee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Thương hiệu nổi tiếng</h1>
          <p className="text-gray-600 mb-6">Khám phá các thương hiệu uy tín và chất lượng</p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Tìm kiếm thương hiệu..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Trending Brands */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Thương hiệu đang hot
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingBrands.map((brand, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                {brand.name} <span className="text-green-500 ml-1">{brand.growth}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Danh mục thương hiệu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={index} to={`/brands/category/${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count} thương hiệu</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Brands */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Thương hiệu nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBrands.map((brand) => (
              <Link key={brand.id} to={`/brand/${brand.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-24 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <img 
                          src={brand.logo} 
                          alt={brand.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-lg">{brand.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {brand.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Người theo dõi:</span>
                        <span className="font-medium">{brand.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sản phẩm:</span>
                        <span className="font-medium">{brand.products}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Đánh giá:</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{brand.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" variant="outline">
                      Xem cửa hàng
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Xem thêm thương hiệu
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default Brands
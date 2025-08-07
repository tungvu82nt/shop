import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { useParams } from 'react-router-dom'
import { Filter, Grid, List, SortAsc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { useState, useEffect } from 'react'
import ProductCard from '@/components/product/ProductCard'
import { analytics } from '@/lib/analytics'

const Category = () => {
  const { categoryName } = useParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [sortBy, setSortBy] = useState('popular')

  // Theo dõi sự kiện xem danh mục sản phẩm
  useEffect(() => {
    if (categoryName) {
      analytics.trackEcommerce('view_item_list', {
        currency: 'VND',
        value: products.reduce((total, product) => total + product.price, 0),
        item_list_id: categoryName,
        item_list_name: categoryName,
        items: products.map((product, index) => ({
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: categoryName,
          price: product.price,
          quantity: 1,
          index: index
        }))
      })
    }
  }, [categoryName])

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (value: string) => {
    setSortBy(value)
    analytics.track('filter_applied', {
      filter_type: 'sort',
      filter_value: value,
      category: categoryName,
      product_count: products.length
    })
  }

  // Xử lý thay đổi chế độ xem
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    analytics.track('view_mode_changed', {
      view_mode: mode,
      category: categoryName,
      product_count: products.length
    })
  }

  // Xử lý thay đổi khoảng giá
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    analytics.track('filter_applied', {
      filter_type: 'price_range',
      filter_value: `${value[0]}-${value[1]}`,
      category: categoryName,
      product_count: products.length
    })
  }
  
  // Mock data cho sản phẩm trong danh mục
  const products = [
    {
      id: 1,
      name: 'Áo thun nam basic cotton',
      price: 149000,
      originalPrice: 199000,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      sold: 1200,
      discount: 25,
      location: 'TP. Hồ Chí Minh'
    },
    {
      id: 2,
      name: 'Quần jeans nữ skinny',
      price: 299000,
      originalPrice: 399000,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      sold: 856,
      discount: 25,
      location: 'Hà Nội'
    },
    {
      id: 3,
      name: 'Giày sneaker unisex',
      price: 450000,
      originalPrice: 550000,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      sold: 2341,
      discount: 18,
      location: 'Đà Nẵng'
    },
    {
      id: 4,
      name: 'Túi xách nữ da PU',
      price: 189000,
      originalPrice: 250000,
      image: '/api/placeholder/300/300',
      rating: 4.2,
      sold: 567,
      discount: 24,
      location: 'TP. Hồ Chí Minh'
    }
  ]

  const filters = {
    brands: ['Nike', 'Adidas', 'Uniqlo', 'Zara', 'H&M'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Đen', 'Trắng', 'Xám', 'Xanh', 'Đỏ'],
    ratings: [5, 4, 3, 2, 1]
  }

  return (
    <Layout>
      <Helmet>
        <title>{categoryName ? `${categoryName} - Yapee` : 'Danh mục - Yapee'}</title>
        <meta name="description" content={`Khám phá sản phẩm ${categoryName} chất lượng với giá tốt nhất`} />
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <span>Trang chủ</span> / <span>Danh mục</span> / <span className="text-gray-900 font-medium">{categoryName}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold capitalize">{categoryName}</h1>
            <p className="text-gray-600">{products.length} sản phẩm</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao</SelectItem>
                <SelectItem value="sold">Bán chạy</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Khoảng giá</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={1000000}
                    step={10000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                
                {/* Brands */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Thương hiệu</h4>
                  <div className="space-y-2">
                    {filters.brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={brand} />
                        <label htmlFor={brand} className="text-sm">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sizes */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Kích thước</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.sizes.map((size) => (
                      <Badge key={size} variant="outline" className="cursor-pointer hover:bg-gray-100">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Colors */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Màu sắc</h4>
                  <div className="space-y-2">
                    {filters.colors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox id={color} />
                        <label htmlFor={color} className="text-sm">{color}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rating */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Đánh giá</h4>
                  <div className="space-y-2">
                    {filters.ratings.map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                          {rating} sao trở lên
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl font-bold text-orange-500">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-gray-500 line-through">
                              {product.originalPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <Badge variant="destructive">{product.discount}%</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              ⭐ {product.rating} | Đã bán {product.sold}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>Trước</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Sau</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Category
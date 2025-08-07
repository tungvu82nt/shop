import Layout from '@/components/layout/Layout'
import Banner from '@/components/home/Banner'
import CategoryGrid from '@/components/home/CategoryGrid'
import FlashSale from '@/components/home/FlashSale'
import ProductSection, { sampleProducts } from '@/components/home/ProductSection'
import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

const Home = () => {
  // Split sample products into different sections
  const suggestedProducts = sampleProducts.slice(0, 8)
  const bestSellingProducts = sampleProducts.slice(2, 10)
  const newProducts = sampleProducts.slice(1, 9)

  // Theo dõi sự kiện xem trang chủ
  useEffect(() => {
    analytics.trackPageView('/', 'Trang chủ')
    
    // Theo dõi sự kiện xem danh sách sản phẩm gợi ý
    analytics.trackEcommerce('view_item_list', {
      currency: 'VND',
      value: suggestedProducts.reduce((total, product) => total + product.price, 0),
      item_list_id: 'suggested_products',
      item_list_name: 'Gợi Ý Hôm Nay',
      items: suggestedProducts.map((product, index) => ({
        item_id: product.id.toString(),
        item_name: product.name,
        item_category: product.category || 'Trang chủ',
        price: product.price,
        quantity: 1,
        index: index
      }))
    })
  }, [])

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Banner Section */}
          <div className="mb-8">
            <Banner />
          </div>

          {/* Category Grid */}
          <div className="mb-8">
            <CategoryGrid />
          </div>

          {/* Flash Sale Section */}
          <div className="mb-8">
            <FlashSale />
          </div>

          {/* Suggested Products */}
          <div className="mb-8">
            <ProductSection 
              title="Gợi Ý Hôm Nay" 
              products={suggestedProducts}
            />
          </div>

          {/* Best Selling Products */}
          <div className="mb-8">
            <ProductSection 
              title="Bán Chạy Nhất" 
              products={bestSellingProducts}
            />
          </div>

          {/* New Products */}
          <div className="mb-8">
            <ProductSection 
              title="Sản Phẩm Mới" 
              products={newProducts}
            />
          </div>

          {/* Mall Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900 uppercase">
                    YAPEE MALL
                  </h2>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Chính hãng 100%
                  </span>
                </div>
                <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                  Xem Tất Cả &gt;
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Apple', logo: 'https://picsum.photos/300/300?random=1' },
                  { name: 'Samsung', logo: 'https://picsum.photos/300/300?random=1' },
                  { name: 'Xiaomi', logo: 'https://picsum.photos/300/300?random=1' },
                  { name: 'Nike', logo: 'https://picsum.photos/200/200?random=9' },
                  { name: 'Adidas', logo: 'https://picsum.photos/100/100?random=14' },
                  { name: 'Uniqlo', logo: 'https://picsum.photos/300/300?random=1' }
                ].map((brand, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden border border-gray-200 group-hover:border-orange-300 transition-colors">
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-orange-500 transition-colors">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Search Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 uppercase">
                TÌM KIẾM HÀNG ĐẦU
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { keyword: 'iPhone 15', image: 'https://picsum.photos/300/300?random=1' },
                  { keyword: 'Áo thun nam', image: 'https://picsum.photos/300/300?random=1' },
                  { keyword: 'Giày sneaker', image: 'https://picsum.photos/200/200?random=9' },
                  { keyword: 'Túi xách nữ', image: 'https://picsum.photos/200/200?random=11' },
                  { keyword: 'Laptop gaming', image: 'https://picsum.photos/300/300?random=1' },
                  { keyword: 'Tai nghe', image: 'https://picsum.photos/300/300?random=1' }
                ].map((item, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 border border-gray-200 group-hover:border-orange-300 transition-colors">
                      <img 
                        src={item.image} 
                        alt={item.keyword}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-sm text-center text-gray-700 group-hover:text-orange-500 transition-colors">
                      {item.keyword}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
import React, { useState, useEffect } from 'react'
import { Grid, List, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Layout from '@/components/layout/Layout'
import ProductFilter, { FilterOptions } from '@/components/product/ProductFilter'
import ProductSort, { SortOption } from '@/components/product/ProductSort'
import ProductCard from '@/components/product/ProductCard'
import { ProductListItem } from '@/components/product/ProductListItem'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { sampleProducts } from '@/components/home/ProductSection'
import { Product } from '@/types/product'
import { SEOHead } from '@/components/SEO'

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000000],
    categories: [],
    brands: [],
    rating: 0,
    freeShipping: false,
    inStock: false,
    location: []
  })
  const [sortOption, setSortOption] = useState<SortOption>('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

  // Simulate loading products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Duplicate sample products to have more items
      const allProducts = [...sampleProducts, ...sampleProducts.map(p => ({
        ...p,
        id: p.id + '_dup',
        name: p.name + ' (Phiên bản 2)'
      }))]
      
      setProducts(allProducts)
      setFilteredProducts(allProducts)
      setLoading(false)
    }

    loadProducts()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products]

    // Apply price filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category || '')
      )
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating)
    }

    // Apply free shipping filter
    if (filters.freeShipping) {
      filtered = filtered.filter(product => product.freeShipping)
    }

    // Apply discount filter
    if (filters.discount) {
      filtered = filtered.filter(product => product.discount && product.discount > 0)
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // Assume newer products have higher IDs
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'best-selling':
        filtered.sort((a, b) => b.sold - a.sold)
        break
      default:
        // Keep original order for relevance
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, filters, sortOption])

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000000],
      categories: [],
      brands: [],
      rating: 0,
      freeShipping: false,
      inStock: false,
      discount: false
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.brands.length > 0) count++
    if (filters.rating > 0) count++
    if (filters.freeShipping) count++
    if (filters.inStock) count++
    if (filters.discount) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) count++
    return count
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Layout>
      <SEOHead 
        title="Tất cả sản phẩm - Yapee"
        description="Khám phá hàng triệu sản phẩm chất lượng với giá tốt nhất tại Yapee. Mua sắm trực tuyến an toàn, giao hàng nhanh chóng."
        keywords="sản phẩm, mua sắm, thương mại điện tử, Yapee"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tất cả sản phẩm</h1>
            <p className="text-gray-600">Khám phá hàng triệu sản phẩm chất lượng</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </div>
                <ProductFilter 
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                />
                {getActiveFiltersCount() > 0 && (
                  <Button 
                    onClick={clearFilters}
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button & Controls */}
              <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                        {getActiveFiltersCount() > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {getActiveFiltersCount()}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <div className="py-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
                          {getActiveFiltersCount() > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {getActiveFiltersCount()}
                            </Badge>
                          )}
                        </div>
                        <ProductFilter 
                          filters={filters}
                          onFiltersChange={handleFilterChange}
                        />
                        {getActiveFiltersCount() > 0 && (
                          <Button 
                            onClick={clearFilters}
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-4"
                          >
                            Xóa bộ lọc
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Results Count */}
                  <span className="text-sm text-gray-600">
                    {loading ? 'Đang tải...' : `${filteredProducts.length} sản phẩm`}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <ProductSort 
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                  />

                  {/* View Mode Toggle */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-gray-600">Đang tải sản phẩm...</span>
                  </div>
                ) : (
                  <>
                    {currentProducts.length > 0 ? (
                      <>
                        {viewMode === 'grid' ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentProducts.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {currentProducts.map((product) => (
                              <ProductListItem
                                key={product.id}
                                product={product}
                              />
                            ))}
                          </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center mt-8 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Trước
                            </Button>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const page = i + 1
                              return (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </Button>
                              )
                            })}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Sau
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Không tìm thấy sản phẩm nào
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Hãy thử thay đổi bộ lọc để xem thêm sản phẩm.
                        </p>
                        {getActiveFiltersCount() > 0 && (
                          <Button onClick={clearFilters} variant="outline">
                            Xóa bộ lọc
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProductList
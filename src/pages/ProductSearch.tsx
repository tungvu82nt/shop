import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid, List, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SearchBar from '@/components/product/SearchBar'
import ProductFilter, { FilterOptions } from '@/components/product/ProductFilter'
import ProductSort, { SortOption } from '@/components/product/ProductSort'
import ProductCard from '@/components/product/ProductCard'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { searchService, SearchFilters } from '@/services/searchService'
import { Product } from '@/types/product'

// Search result interface
interface SearchResult {
  products: Product[]
  totalCount: number
  hasMore: boolean
  page: number
}

const ProductSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000000],
    categories: [],
    brands: [],
    rating: 0,
    freeShipping: false,
    inStock: false,
    location: []
  })
  const [searchResult, setSearchResult] = useState<SearchResult>({
    products: [],
    totalCount: 0,
    hasMore: false,
    page: 1
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Update search query from URL params
  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
  }, [searchParams])

  // Search products when query or filters change
  useEffect(() => {
    performSearch(1, true)
  }, [searchQuery, filters, sortBy])

  const performSearch = async (page: number = 1, reset: boolean = false) => {
    if (reset) {
      setIsLoading(true)
      setError(null)
      setCurrentPage(1)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const searchFilters: SearchFilters = {
        query: searchQuery,
        categories: filters.categories,
        brands: filters.brands,
        priceRange: filters.priceRange,
        rating: filters.rating,
        freeShipping: filters.freeShipping,
        inStock: filters.inStock,
        location: filters.location
      }

      const result = await searchService.searchProducts(
        searchFilters,
        sortBy,
        page,
        20 // items per page
      )

      if (reset) {
        setSearchResult(result)
      } else {
        setSearchResult(prev => ({
          ...result,
          products: [...prev.products, ...result.products]
        }))
      }
      
      setCurrentPage(page)
    } catch (err: any) {
      console.error('Search failed:', err)
      if (err.name !== 'AbortError') {
        setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.')
      }
      if (reset) {
        setSearchResult({ products: [], totalCount: 0, hasMore: false, page: 1 })
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (searchResult.hasMore && !isLoadingMore) {
      performSearch(currentPage + 1, false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSearchParams(query ? { q: query } : {})
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000000],
      categories: [],
      brands: [],
      rating: 0,
      freeShipping: false,
      inStock: false,
      location: []
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.brands.length > 0) count += filters.brands.length
    if (filters.rating > 0) count++
    if (filters.freeShipping) count++
    if (filters.inStock) count++
    if (filters.location.length > 0) count += filters.location.length
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) count++
    return count
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <SearchBar onSearch={handleSearch} className="mx-auto" autoNavigate={false} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilter
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Results Header */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                        {getActiveFiltersCount() > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {getActiveFiltersCount()}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-4">
                        <ProductFilter
                          filters={filters}
                          onFiltersChange={setFilters}
                          onClearFilters={clearFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex border rounded-lg">
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

                {/* Sort Options */}
                <ProductSort
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  totalResults={searchResult.totalCount}
                />
              </div>

              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                    {filters.categories.map(category => (
                      <Badge key={category} variant="secondary" className="cursor-pointer"
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          categories: prev.categories.filter(c => c !== category)
                        }))}
                      >
                        {category} ×
                      </Badge>
                    ))}
                    {filters.brands.map(brand => (
                      <Badge key={brand} variant="secondary" className="cursor-pointer"
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          brands: prev.brands.filter(b => b !== brand)
                        }))}
                      >
                        {brand} ×
                      </Badge>
                    ))}
                    {filters.rating > 0 && (
                      <Badge variant="secondary" className="cursor-pointer"
                        onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                      >
                        {filters.rating}+ sao ×
                      </Badge>
                    )}
                    {filters.freeShipping && (
                      <Badge variant="secondary" className="cursor-pointer"
                        onClick={() => setFilters(prev => ({ ...prev, freeShipping: false }))}
                      >
                        Miễn phí ship ×
                      </Badge>
                    )}
                    {filters.inStock && (
                      <Badge variant="secondary" className="cursor-pointer"
                        onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
                      >
                        Còn hàng ×
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-lg p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
                <p className="text-gray-600">Đang tìm kiếm sản phẩm...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Có lỗi xảy ra
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => performSearch(1, true)} variant="outline">
                  Thử lại
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && (
              <>
                {searchResult.products.length > 0 ? (
                  <>
                    <div className={`grid gap-4 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                        : 'grid-cols-1'
                    }`}>
                      {searchResult.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>

                    {/* Load More Button */}
                    {searchResult.hasMore && (
                      <div className="text-center mt-8">
                        <Button 
                          onClick={loadMore}
                          disabled={isLoadingMore}
                          variant="outline"
                          size="lg"
                        >
                          {isLoadingMore ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Đang tải...
                            </>
                          ) : (
                            'Xem thêm sản phẩm'
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Results Summary */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                      Hiển thị {searchResult.products.length} / {searchResult.totalCount} sản phẩm
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Không tìm thấy sản phẩm nào
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery 
                        ? `Không có kết quả cho "${searchQuery}". Hãy thử từ khóa khác hoặc thay đổi bộ lọc.`
                        : 'Hãy nhập từ khóa để tìm kiếm sản phẩm.'
                      }
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
  )
}

export default ProductSearch
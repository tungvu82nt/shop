import { Product } from '@/types/product'
import { SortOption } from '@/components/product/ProductSort'
import { supabase } from '@/lib/supabase'
import { searchAnalytics } from './searchAnalytics'
import { searchOptimization } from './searchOptimization'

// Interface cho query tìm kiếm
export interface SearchQuery {
  query: string
  category?: string | string[]
  brand?: string | string[]
  priceRange?: [number, number]
  rating?: number
  inStock?: boolean
  location?: string
  shipping?: string[]
  tags?: string[]
  sortBy?: string
  page?: number
  limit?: number
}

// Interface cho bộ lọc tìm kiếm (legacy - để tương thích)
export interface SearchFilters {
  query: string
  categories?: string[]
  brands?: string[]
  priceRange?: [number, number]
  rating?: number
  freeShipping?: boolean
  inStock?: boolean
  location?: string[]
}

// Interface cho kết quả tìm kiếm
export interface SearchResult {
  id: string
  title: string
  description?: string
  price: number
  originalPrice?: number
  imageUrl: string
  category?: string
  brand?: string
  location?: string
  rating?: number
  reviewCount?: number
  inStock?: boolean
  relevanceScore?: number
  optimizationMetadata?: {
    baseScore: number
    personalizedScore: number
    trendingScore: number
    locationScore: number
    seasonalScore: number
    popularityScore: number
  }
}

// Interface cho kết quả tìm kiếm tổng hợp
export interface SearchResponse {
  products: SearchResult[]
  totalCount: number
  hasMore: boolean
  page: number
  suggestions?: SearchSuggestion[]
  filters?: {
    categories: Array<{ name: string; count: number }>
    brands: Array<{ name: string; count: number }>
    priceRange: [number, number]
    locations: Array<{ name: string; count: number }>
  }
}

// Interface cho gợi ý tìm kiếm
export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand'
  text: string
  imageUrl?: string
  price?: number
  count?: number
}

// Interface cho tùy chọn tìm kiếm
interface SearchOptions {
  query: string
  categories?: string[]
  brands?: string[]
  priceRange?: [number, number]
  rating?: number
  freeShipping?: boolean
  inStock?: boolean
  location?: string[]
  sortBy?: string
  page?: number
  limit?: number
}

// NOTE: Mock data cho testing - Trong production cần thay thế bằng dữ liệu từ database
// Các hình ảnh placeholder cần được thay thế bằng URL thực tế từ CDN/storage service
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB - Chính hãng VN/A',
    price: 29990000,
    originalPrice: 32990000,
    discount: 9,
    rating: 4.8,
    reviewCount: 1234,
    imageUrl: 'https://picsum.photos/300/300?random=1',
    location: 'TP. Hồ Chí Minh',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 2500,
    category: 'electronics',
    brand: 'apple',
    inStock: true,
    description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB - Hàng chính hãng',
    price: 26990000,
    originalPrice: 29990000,
    discount: 10,
    rating: 4.7,
    reviewCount: 987,
    imageUrl: 'https://picsum.photos/300/300?random=2',
    location: 'Hà Nội',
    isLiked: true,
    isFreeShipping: true,
    soldCount: 1800,
    category: 'electronics',
    brand: 'samsung',
    inStock: true,
    description: 'Samsung Galaxy S24 Ultra với S Pen tích hợp'
  },
  {
    id: '3',
    name: 'Laptop Gaming ASUS ROG Strix G15 RTX 4060',
    price: 23990000,
    rating: 4.6,
    reviewCount: 456,
    imageUrl: 'https://picsum.photos/300/300?random=3',
    location: 'Đà Nẵng',
    isLiked: false,
    isFreeShipping: false,
    soldCount: 320,
    category: 'electronics',
    brand: 'asus',
    inStock: true,
    description: 'Laptop gaming ASUS ROG với RTX 4060'
  },
  {
    id: '4',
    name: 'Áo thun Nike Dri-FIT - Chính hãng',
    price: 890000,
    originalPrice: 1200000,
    discount: 26,
    rating: 4.5,
    reviewCount: 234,
    imageUrl: 'https://picsum.photos/300/300?random=4',
    location: 'TP. Hồ Chí Minh',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 1200,
    category: 'fashion',
    brand: 'nike',
    inStock: true,
    description: 'Áo thun Nike Dri-FIT thấm hút mồ hôi'
  },
  {
    id: '5',
    name: 'Tai nghe Sony WH-1000XM5 - Chống ồn chủ động',
    price: 7990000,
    rating: 4.9,
    reviewCount: 567,
    imageUrl: 'https://picsum.photos/300/300?random=5',
    location: 'Hà Nội',
    isLiked: true,
    isFreeShipping: true,
    soldCount: 890,
    category: 'electronics',
    brand: 'sony',
    inStock: false,
    description: 'Tai nghe Sony với công nghệ chống ồn hàng đầu'
  },
  {
    id: '6',
    name: 'Giày thể thao Adidas Ultraboost 22',
    price: 4590000,
    originalPrice: 5500000,
    discount: 17,
    rating: 4.4,
    reviewCount: 345,
    imageUrl: 'https://picsum.photos/300/300?random=6',
    location: 'Cần Thơ',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 670,
    category: 'fashion',
    brand: 'adidas',
    inStock: true,
    description: 'Giày chạy bộ Adidas Ultraboost 22'
  },
  {
    id: '7',
    name: 'MacBook Pro M3 14 inch 512GB',
    price: 52990000,
    rating: 4.9,
    reviewCount: 789,
    imageUrl: 'https://picsum.photos/300/300?random=7',
    location: 'TP. Hồ Chí Minh',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 450,
    category: 'electronics',
    brand: 'apple',
    inStock: true,
    description: 'MacBook Pro với chip M3 mạnh mẽ'
  },
  {
    id: '8',
    name: 'Xiaomi 14 Ultra 512GB - Chính hãng',
    price: 24990000,
    originalPrice: 27990000,
    discount: 11,
    rating: 4.6,
    reviewCount: 432,
    imageUrl: 'https://picsum.photos/300/300?random=8',
    location: 'Hà Nội',
    isLiked: true,
    isFreeShipping: true,
    soldCount: 680,
    category: 'electronics',
    brand: 'xiaomi',
    inStock: true,
    description: 'Xiaomi 14 Ultra với camera Leica'
  }
]

class SearchService {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 phút
  private searchAbortController: AbortController | null = null

  /**
   * Chuyển đổi Product thành SearchResult
   */
  private convertProductToSearchResult(product: Product): SearchResult {
    return {
      id: product.id,
      title: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      category: product.category,
      brand: product.brand,
      location: product.location,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock
    }
  }

  /**
   * Tìm kiếm sản phẩm với mock data và analytics
   */
  async searchProducts(options: SearchOptions, signal?: AbortSignal): Promise<SearchResponse> {
    const {
      query,
      categories = [],
      brands = [],
      priceRange,
      rating,
      freeShipping,
      inStock,
      location = [],
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = options

    try {
      // Check if request was cancelled
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Track search analytics
      await searchAnalytics.trackSearchWithResults(
        query,
        0, // Will be updated after search
        { categories, brands, priceRange, rating, freeShipping, inStock, location },
        'page'
      )

      // Fallback to mock data for now
      console.warn('Using mock data for search')
      const result = await this.searchProductsMock(options, signal)

      // Update analytics with actual results count
      await searchAnalytics.trackSearchWithResults(
        query,
        result.totalCount,
        { categories, brands, priceRange, rating, freeShipping, inStock, location },
        'page'
      )

      return result

    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error
      }
      console.error('Search error:', error)
      
      // Fallback to mock data nếu có lỗi với database
      console.warn('Falling back to mock data due to database error')
      return this.searchProductsMock(options, signal)
    }
  }

  /**
   * Tìm kiếm sản phẩm với mock data (fallback)
   */
  private async searchProductsMock(options: SearchOptions, signal?: AbortSignal): Promise<SearchResponse> {
    const {
      query,
      categories = [],
      brands = [],
      priceRange,
      rating,
      freeShipping,
      inStock,
      location = [],
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = options

    try {
      // Check if request was cancelled
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))

      let filteredProducts = [...mockProducts]

      // Text search
      if (query.trim()) {
        const searchQuery = query.toLowerCase().trim()
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery) ||
          product.brand.toLowerCase().includes(searchQuery)
        )
      }

      // Filter by categories
      if (categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          categories.includes(product.category)
        )
      }

      // Filter by brands
      if (brands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          brands.includes(product.brand)
        )
      }

      // Filter by price range
      if (priceRange) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= priceRange[0] && product.price <= priceRange[1]
        )
      }

      // Filter by rating
      if (rating && rating > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.rating >= rating
        )
      }

      // Filter by free shipping
      if (freeShipping) {
        filteredProducts = filteredProducts.filter(product => 
          product.isFreeShipping
        )
      }

      // Filter by stock
      if (inStock) {
        filteredProducts = filteredProducts.filter(product => 
          product.inStock
        )
      }

      // Filter by location
      if (location.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          location.includes(product.location)
        )
      }

      // Sorting
      switch (sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          // Mock newest sort by soldCount
          filteredProducts.sort((a, b) => b.soldCount - a.soldCount)
          break
        default: // relevance
          if (query.trim()) {
            filteredProducts.sort((a, b) => b.rating - a.rating)
          } else {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
          }
      }

      // Check cancellation
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Convert Product to SearchResult and apply optimization
      const searchResults: SearchResult[] = filteredProducts.map(product => 
        this.convertProductToSearchResult(product)
      )

      // Apply search optimization
      const optimizedResults = await searchOptimization.optimizeSearchResults(query, searchResults, {
        userLocation: location[0] || 'TP. Hồ Chí Minh',
        userPreferences: {
          categories: categories,
          brands: brands,
          priceRange: priceRange
        }
      })

      // Pagination
      const totalCount = optimizedResults.length
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = optimizedResults.slice(startIndex, endIndex)

      // Get suggestions
      const suggestions = await this.getSuggestions(query, signal)

      // Generate filters
      const filters = this.generateFilters(mockProducts)

      // Track search analytics
      searchAnalytics.trackSearch({
        query,
        resultsCount: totalCount,
        filters: {
          categories,
          brands,
          priceRange,
          rating,
          freeShipping,
          inStock,
          location
        },
        searchType: 'product_search'
      })

      const result: SearchResponse = {
        products: paginatedProducts,
        totalCount,
        hasMore: totalCount > page * limit,
        page,
        suggestions,
        filters
      }

      return result

    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error
      }
      console.error('Mock search error:', error)
      
      const result: SearchResponse = {
        products: [],
        totalCount: 0,
        hasMore: false,
        page,
        suggestions: [],
        filters: {
          categories: [],
          brands: [],
          priceRange: [0, 100000000],
          locations: []
        }
      }
      return result
    }
  }

  /**
   * Lấy gợi ý tìm kiếm (autocomplete) từ database
   */
  async getSuggestions(query: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
    if (!query.trim() || query.length < 2) return []

    const cacheKey = `suggestions_${query}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // Check if request was cancelled
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Track autocomplete analytics
      await searchAnalytics.trackAutocomplete(query)

      const suggestions: SearchSuggestion[] = []
      const searchQuery = query.toLowerCase().trim()

      // Gợi ý sản phẩm từ database
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, image_url, price')
        .ilike('name', `%${searchQuery}%`)
        .order('rating', { ascending: false })
        .limit(5)

      if (!productsError && products) {
        products.forEach(product => {
          suggestions.push({
            type: 'product',
            text: product.name,
            imageUrl: product.image_url,
            price: product.price
          })
        })
      }

      // Check cancellation
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Gợi ý categories từ database
      const { data: categories, error: categoriesError } = await supabase
        .from('products')
        .select('category')
        .ilike('category', `%${searchQuery}%`)
        .limit(3)

      if (!categoriesError && categories) {
        const uniqueCategories = [...new Set(categories.map(c => c.category))]
        
        for (const category of uniqueCategories) {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category', category)

          suggestions.push({
            type: 'category',
            text: category,
            count: count || 0
          })
        }
      }

      // Gợi ý brands từ database
      const { data: brands, error: brandsError } = await supabase
        .from('products')
        .select('brand')
        .ilike('brand', `%${searchQuery}%`)
        .limit(3)

      if (!brandsError && brands) {
        const uniqueBrands = [...new Set(brands.map(b => b.brand))]
        
        for (const brand of uniqueBrands) {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('brand', brand)

          suggestions.push({
            type: 'brand',
            text: brand,
            count: count || 0
          })
        }
      }

      this.setCache(cacheKey, suggestions)
      return suggestions

    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error
      }
      console.error('Suggestions error:', error)
      
      // Fallback to mock suggestions
      return this.getSuggestionsMock(query, signal)
    }
  }

  /**
   * Lấy từ khóa tìm kiếm phổ biến từ database
   */
  async getTrendingSearches(signal?: AbortSignal): Promise<string[]> {
    const cacheKey = 'trending_searches'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // Check if request was cancelled
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Lấy trending searches từ bảng search_analytics (nếu có)
      // Hoặc lấy sản phẩm có sold_count cao nhất
      const { data: trendingProducts, error } = await supabase
        .from('products')
        .select('name')
        .order('sold_count', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Trending searches database error:', error)
        throw error
      }

      // Check again after API call
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      const trending = trendingProducts?.map(product => product.name) || []
      
      // Nếu không có dữ liệu từ database, sử dụng fallback
      if (trending.length === 0) {
        const fallbackTrending = [
          'iPhone 15 Pro Max',
          'Samsung Galaxy S24 Ultra',
          'Laptop gaming',
          'Tai nghe bluetooth',
          'Đồng hồ thông minh',
          'Máy ảnh Canon',
          'Giày thể thao Nike',
          'Túi xách nữ',
          'MacBook Pro M3',
          'AirPods Pro 2'
        ]
        this.setCache(cacheKey, fallbackTrending)
        return fallbackTrending
      }

      this.setCache(cacheKey, trending)
      return trending

    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error
      }
      console.error('Trending searches error:', error)
      
      // Fallback trending searches
      const fallbackTrending = [
        'iPhone 15 Pro Max',
        'Samsung Galaxy S24 Ultra',
        'Laptop gaming',
        'Tai nghe bluetooth',
        'Đồng hồ thông minh',
        'Máy ảnh Canon',
        'Giày thể thao Nike',
        'Túi xách nữ',
        'MacBook Pro M3',
        'AirPods Pro 2'
      ]
      return fallbackTrending
    }
  }

  /**
   * Lấy gợi ý tìm kiếm với mock data (fallback)
   */
  private async getSuggestionsMock(query: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
    if (!query.trim() || query.length < 2) return []

    try {
      // Check if request was cancelled
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50))

      const suggestions: SearchSuggestion[] = []
      const searchQuery = query.toLowerCase().trim()

      // Gợi ý sản phẩm
      const matchingProducts = mockProducts
        .filter(product => product.name.toLowerCase().includes(searchQuery))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)

      matchingProducts.forEach(product => {
        suggestions.push({
          type: 'product',
          text: product.name,
          imageUrl: product.imageUrl,
          price: product.price
        })
      })

      // Check cancellation
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

      // Gợi ý categories
      const categories = ['electronics', 'fashion']
      const matchingCategories = categories
        .filter(category => category.toLowerCase().includes(searchQuery))
        .slice(0, 3)

      matchingCategories.forEach(category => {
        const count = mockProducts.filter(p => p.category === category).length
        suggestions.push({
          type: 'category',
          text: category,
          count
        })
      })

      // Gợi ý brands
      const brands = ['apple', 'samsung', 'asus', 'nike', 'sony', 'adidas', 'xiaomi']
      const matchingBrands = brands
        .filter(brand => brand.toLowerCase().includes(searchQuery))
        .slice(0, 3)

      matchingBrands.forEach(brand => {
        const count = mockProducts.filter(p => p.brand === brand).length
        suggestions.push({
          type: 'brand',
          text: brand,
          count
        })
      })

      return suggestions

    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error
      }
      console.error('Mock suggestions error:', error)
      return []
    }
  }

  /**
   * Tạo filters từ dữ liệu sản phẩm
   */
  private generateFilters(products: Product[]) {
    const categories = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const brands = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const locations = products.reduce((acc, product) => {
      acc[product.location] = (acc[product.location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const prices = products.map(p => p.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return {
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
      brands: Object.entries(brands).map(([name, count]) => ({ name, count })),
      priceRange: [minPrice, maxPrice] as [number, number],
      locations: Object.entries(locations).map(([name, count]) => ({ name, count }))
    }
  }

  /**
   * Lưu lịch sử tìm kiếm
   */
  saveSearchHistory(query: string): void {
    if (!query.trim()) return

    try {
      const history = this.getRecentSearches()
      const updatedHistory = [query, ...history.filter(item => item !== query)].slice(0, 10)
      
      localStorage.setItem('search_history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Save search history failed:', error)
    }
  }

  /**
   * Lấy lịch sử tìm kiếm gần đây
   */
  getRecentSearches(): string[] {
    try {
      const history = localStorage.getItem('search_history')
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Get recent searches failed:', error)
      return []
    }
  }

  /**
   * Xóa lịch sử tìm kiếm
   */
  clearSearchHistory(): void {
    try {
      localStorage.removeItem('search_history')
    } catch (error) {
      console.error('Clear search history failed:', error)
    }
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Xóa cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Hủy request tìm kiếm hiện tại
   */
  cancelSearch(): void {
    if (this.searchAbortController) {
      this.searchAbortController.abort()
      this.searchAbortController = null
    }
  }

  /**
   * Tạo AbortController mới cho request
   */
  createAbortController(): AbortController {
    this.cancelSearch() // Hủy request cũ
    this.searchAbortController = new AbortController()
    return this.searchAbortController
  }
}

export const searchService = new SearchService()

// Export type for SortOption to match interface
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
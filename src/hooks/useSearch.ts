import { useState, useEffect, useCallback, useRef } from 'react'
import { searchService, SearchFilters } from '@/services/searchService'
import { Product } from '@/types/product'
import { SortOption } from '@/components/product/ProductSort'

interface SearchResult {
  products: Product[]
  totalCount: number
  hasMore: boolean
  page: number
}

interface UseSearchOptions {
  initialQuery?: string
  initialFilters?: SearchFilters
  initialSort?: SortOption
  itemsPerPage?: number
  debounceMs?: number
}

interface UseSearchReturn {
  // State
  searchResult: SearchResult
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  currentPage: number
  
  // Actions
  search: (query: string, filters?: SearchFilters, sort?: SortOption) => void
  loadMore: () => void
  reset: () => void
  retry: () => void
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const {
    initialQuery = '',
    initialFilters = {
      query: '',
      categories: [],
      brands: [],
      priceRange: [0, 10000000],
      rating: 0,
      freeShipping: false,
      inStock: false,
      location: []
    },
    initialSort = 'relevance',
    itemsPerPage = 20,
    debounceMs = 300
  } = options

  // State
  const [searchResult, setSearchResult] = useState<SearchResult>({
    products: [],
    totalCount: 0,
    hasMore: false,
    page: 1
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Current search parameters
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters)
  const [currentSort, setCurrentSort] = useState<SortOption>(initialSort)
  
  // Refs for debouncing and cancellation
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastSearchParamsRef = useRef<string>('')

  // Generate cache key for current search parameters
  const generateCacheKey = useCallback((query: string, filters: SearchFilters, sort: SortOption, page: number) => {
    return JSON.stringify({ query, filters, sort, page })
  }, [])

  // Perform search with debouncing and caching
  const performSearch = useCallback(async (
    query: string,
    filters: SearchFilters,
    sort: SortOption,
    page: number = 1,
    reset: boolean = false
  ) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    // Generate cache key
    const cacheKey = generateCacheKey(query, filters, sort, page)
    
    // Skip if same search parameters
    if (cacheKey === lastSearchParamsRef.current && !reset) {
      return
    }
    
    lastSearchParamsRef.current = cacheKey

    // Set loading state
    if (reset) {
      setIsLoading(true)
      setError(null)
      setCurrentPage(1)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const result = await searchService.searchProducts({
        query,
        categories: filters.categories,
        brands: filters.brands,
        priceRange: filters.priceRange,
        rating: filters.rating,
        freeShipping: filters.freeShipping,
        inStock: filters.inStock,
        location: filters.location,
        sortBy: sort,
        page,
        limit: itemsPerPage
      }, signal)

      // Check if request was cancelled
      if (signal.aborted) {
        return
      }

      if (reset) {
        setSearchResult(result)
      } else {
        setSearchResult(prev => ({
          ...result,
          products: [...prev.products, ...result.products]
        }))
      }
      
      setCurrentPage(page)
      setError(null)
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        return
      }

      console.error('Search failed:', err)
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.')
      
      if (reset) {
        setSearchResult({ products: [], totalCount: 0, hasMore: false, page: 1 })
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [generateCacheKey, itemsPerPage])

  // Debounced search function
  const debouncedSearch = useCallback((
    query: string,
    filters: SearchFilters,
    sort: SortOption,
    reset: boolean = true
  ) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(query, filters, sort, 1, reset)
    }, debounceMs)
  }, [performSearch, debounceMs])

  // Public search function
  const search = useCallback((query: string, filters?: SearchFilters, sort?: SortOption) => {
    const newFilters = filters || currentFilters
    const newSort = sort || currentSort
    
    // Update current parameters
    setCurrentQuery(query)
    setCurrentFilters({ ...newFilters, query })
    setCurrentSort(newSort)
    
    // Perform debounced search
    debouncedSearch(query, { ...newFilters, query }, newSort, true)
  }, [currentFilters, currentSort, debouncedSearch])

  // Load more results
  const loadMore = useCallback(() => {
    if (searchResult.hasMore && !isLoadingMore && !isLoading) {
      performSearch(currentQuery, currentFilters, currentSort, currentPage + 1, false)
    }
  }, [searchResult.hasMore, isLoadingMore, isLoading, currentQuery, currentFilters, currentSort, currentPage, performSearch])

  // Reset search
  const reset = useCallback(() => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Clear timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    // Reset state
    setSearchResult({ products: [], totalCount: 0, hasMore: false, page: 1 })
    setIsLoading(false)
    setIsLoadingMore(false)
    setError(null)
    setCurrentPage(1)
    setCurrentQuery('')
    setCurrentFilters(initialFilters)
    setCurrentSort(initialSort)
    lastSearchParamsRef.current = ''
  }, [initialFilters, initialSort])

  // Retry last search
  const retry = useCallback(() => {
    if (currentQuery || Object.values(currentFilters).some(v => 
      Array.isArray(v) ? v.length > 0 : v !== '' && v !== 0 && v !== false
    )) {
      performSearch(currentQuery, currentFilters, currentSort, 1, true)
    }
  }, [currentQuery, currentFilters, currentSort, performSearch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Initial search if query provided
  useEffect(() => {
    if (initialQuery) {
      search(initialQuery, initialFilters, initialSort)
    }
  }, []) // Only run on mount

  return {
    // State
    searchResult,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    
    // Actions
    search,
    loadMore,
    reset,
    retry
  }
}

export default useSearch
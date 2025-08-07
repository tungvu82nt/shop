import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { searchService, SearchQuery, SearchResponse } from '../services/searchService';
import { Product } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { cn } from '../lib/utils';
import { analytics } from '../lib/analytics';
import { SearchBar } from '../components/search/SearchBar';
import { SearchFilters } from '../components/search/SearchFilters';
import SearchResultsList from '../components/search/SearchResultsList';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Filter, X } from 'lucide-react';

// Mock products data for initialization
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Điện thoại iPhone 15 Pro Max với chip A17 Pro mạnh mẽ',
    price: 29990000,
    originalPrice: 32990000,
    discount: 9,
    rating: 4.8,
    reviewCount: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    location: 'TP. Hồ Chí Minh',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 2500,
    category: 'Điện thoại',
    brand: 'Apple',
    inStock: true,
    tags: ['flagship', 'camera', 'gaming'],
    sku: 'IP15PM256',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Samsung với S Pen và camera 200MP',
    price: 26990000,
    originalPrice: 29990000,
    discount: 10,
    rating: 4.7,
    reviewCount: 980,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    location: 'Hà Nội',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 1800,
    category: 'Điện thoại',
    brand: 'Samsung',
    inStock: true,
    tags: ['flagship', 's-pen', 'camera'],
    sku: 'SGS24U',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3',
    description: 'Laptop MacBook Pro với chip M3 cho hiệu suất vượt trội',
    price: 52990000,
    originalPrice: 54990000,
    discount: 4,
    rating: 4.9,
    reviewCount: 650,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    location: 'TP. Hồ Chí Minh',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 450,
    category: 'Laptop',
    brand: 'Apple',
    inStock: true,
    tags: ['professional', 'creative', 'performance'],
    sku: 'MBP14M3',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '4',
    name: 'Dell XPS 13 Plus',
    description: 'Laptop Dell XPS 13 Plus với thiết kế premium',
    price: 35990000,
    originalPrice: 38990000,
    discount: 8,
    rating: 4.6,
    reviewCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    location: 'Đà Nẵng',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 320,
    category: 'Laptop',
    brand: 'Dell',
    inStock: true,
    tags: ['ultrabook', 'business', 'portable'],
    sku: 'DXPS13P',
    createdAt: '2024-01-12T00:00:00Z'
  },
  {
    id: '5',
    name: 'AirPods Pro 2',
    description: 'Tai nghe không dây AirPods Pro thế hệ 2',
    price: 6490000,
    originalPrice: 6990000,
    discount: 7,
    rating: 4.8,
    reviewCount: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
    location: 'TP. Hồ Chí Minh',
    isLiked: false,
    isFreeShipping: true,
    soldCount: 5200,
    category: 'Tai nghe',
    brand: 'Apple',
    inStock: true,
    tags: ['wireless', 'noise-cancelling', 'premium'],
    sku: 'APP2',
    createdAt: '2024-01-08T00:00:00Z'
  }
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State
  const [query, setQuery] = useState<SearchQuery>({});
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOptimizationInfo, setShowOptimizationInfo] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);
  
  // Initialize search service
  useEffect(() => {
    if (!isInitialized) {
      searchService.init(mockProducts);
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  // Parse URL parameters
  useEffect(() => {
    const urlQuery: SearchQuery = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      sortBy: searchParams.get('sortBy') || 'relevance',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20
    };
    
    setQuery(urlQuery);
  }, [searchParams]);
  
  // Update URL when query changes
  const updateURL = useCallback((newQuery: SearchQuery) => {
    const params = new URLSearchParams();
    
    Object.entries(newQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          }
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);
  
  // Perform search
  const performSearch = useCallback(async (searchQuery: SearchQuery) => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const searchResult = await searchService.search(searchQuery);
      setSearchResponse(searchResult);
      
      // Track search analytics
      if (searchQuery.q) {
        analytics.track('search', {
          search_term: searchQuery.q,
          search_filters: {
            category: searchQuery.category,
            brand: searchQuery.brand,
            price_range: searchQuery.minPrice || searchQuery.maxPrice ? {
              min: searchQuery.minPrice,
              max: searchQuery.maxPrice
            } : undefined,
            rating: searchQuery.rating,
            in_stock: searchQuery.inStock,
            tags: searchQuery.tags,
            sort_by: searchQuery.sortBy
          },
          results_count: searchResult.products.length,
          total_results: searchResult.total,
          page: searchQuery.page || 1,
          source: 'search_page'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Track search error
      if (searchQuery.q) {
        analytics.track('search_error', {
          search_term: searchQuery.q,
          error_message: errorMessage,
          source: 'search_page'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);
  
  // Search when debounced query changes
  useEffect(() => {
    if (isInitialized && Object.keys(debouncedQuery).length > 0) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch, isInitialized]);
  
  // Handle query change
  const handleQueryChange = useCallback((newQuery: SearchQuery) => {
    setQuery(newQuery);
    updateURL(newQuery);
  }, [updateURL]);
  
  // Handle search from search bar
  const handleSearch = useCallback((searchText: string) => {
    const newQuery = {
      ...query,
      q: searchText,
      page: 1
    };
    handleQueryChange(newQuery);
  }, [query, handleQueryChange]);
  
  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    const newQuery: SearchQuery = {
      q: query.q,
      sortBy: 'relevance',
      page: 1,
      limit: 20
    };
    handleQueryChange(newQuery);
  }, [query.q, handleQueryChange]);
  
  // Handle product click
  const handleProductClick = useCallback((productId: string) => {
    // Track product click from search results
    if (searchResponse && query.q) {
      const product = searchResponse.products.find(p => p.id === productId);
      const position = searchResponse.products.findIndex(p => p.id === productId) + 1;
      
      if (product) {
        analytics.trackEcommerce('select_item', {
          currency: 'VND',
          value: product.price,
          items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_brand: product.brand,
            price: product.price,
            quantity: 1,
            index: position
          }]
        });
        
        analytics.track('search_result_click', {
          search_term: query.q,
          product_id: productId,
          product_name: product.name,
          position: position,
          source: 'search_page'
        });
      }
    }
    
    navigate(`/product/${productId}`);
  }, [navigate, searchResponse, query.q]);

  // Handle add to cart
  const handleAddToCart = useCallback((productId: string) => {
    // TODO: Implement add to cart logic
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  }, []);

  // Handle toggle wishlist
  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        newSet.add(productId);
        toast.success('Đã thêm vào danh sách yêu thích');
      }
      return newSet;
    });
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    const newQuery = {
      ...query,
      page
    };
    handleQueryChange(newQuery);
  }, [query, handleQueryChange]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // Handle toggle optimization info
  const handleToggleOptimizationInfo = useCallback(() => {
    setShowOptimizationInfo(prev => !prev);
  }, []);
  
  // Generate page title
  const getPageTitle = () => {
    if (query.q) {
      return `Tìm kiếm "${query.q}" - Yapee Vietnam`;
    }
    return 'Tìm kiếm sản phẩm - Yapee Vietnam';
  };
  
  // Generate meta description
  const getMetaDescription = () => {
    if (query.q) {
      return `Tìm kiếm sản phẩm "${query.q}" trên Yapee Vietnam. Hàng ngàn sản phẩm chính hãng với giá tốt nhất.`;
    }
    return 'Tìm kiếm và mua sắm hàng ngàn sản phẩm chính hãng trên Yapee Vietnam với giá tốt nhất.';
  };
  
  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="website" />
        {query.q && (
          <meta name="keywords" content={`${query.q}, mua sắm online, yapee vietnam`} />
        )}
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
              >
                Yapee
              </button>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  onSearch={handleSearch}
                  onFilterClick={() => setIsFiltersOpen(true)}
                  placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                  showFilters={false} // Hide on mobile, show in sheet
                  autoFocus={!query.q}
                />
              </div>
              
              {/* Mobile Filter Button */}
              <div className="lg:hidden">
                <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Bộ lọc tìm kiếm</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFiltersOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {searchResponse && (
                      <SearchFilters
                        filters={searchResponse.filters}
                        currentQuery={query}
                        onFiltersChange={handleQueryChange}
                        onClearFilters={handleClearFilters}
                        isMobile
                      />
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              {searchResponse && (
                <SearchFilters
                  filters={searchResponse.filters}
                  currentQuery={query}
                  onFiltersChange={handleQueryChange}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>
            
            {/* Results */}
            <div className="flex-1 min-w-0">
              <SearchResultsList
                searchResponse={searchResponse}
                isLoading={isLoading}
                error={error}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onProductClick={handleProductClick}
                onPageChange={handlePageChange}
                wishlistedItems={wishlistedItems}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                showOptimizationInfo={showOptimizationInfo}
                onToggleOptimizationInfo={handleToggleOptimizationInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
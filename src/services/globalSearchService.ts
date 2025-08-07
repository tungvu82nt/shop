import { supabase } from '../lib/supabase';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'product' | 'category' | 'brand' | 'user';
  url: string;
  image?: string;
  price?: number;
  rating?: number;
  category?: string;
  brand?: string;
}

export interface SearchFilters {
  type?: 'product' | 'category' | 'brand' | 'user';
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  filters?: SearchFilters;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  suggestions: string[];
  facets: {
    categories: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    priceRanges: Array<{ range: string; count: number }>;
  };
}

class GlobalSearchService {
  private searchHistory: string[] = [];
  private popularSearches: string[] = [
    'iPhone 15',
    'Samsung Galaxy',
    'Laptop Dell',
    'Tai nghe Sony',
    'Máy ảnh Canon',
    'Điện thoại Xiaomi',
    'Laptop Gaming',
    'Đồng hồ thông minh'
  ];

  /**
   * Tìm kiếm toàn cục với autocomplete và suggestions
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    const {
      limit = 20,
      offset = 0,
      sortBy = 'relevance',
      filters = {}
    } = options;

    try {
      // Lưu lịch sử tìm kiếm
      this.addToSearchHistory(query);

      // Tìm kiếm sản phẩm
      const productResults = await this.searchProducts(query, { limit, offset, sortBy, filters });
      
      // Tìm kiếm danh mục
      const categoryResults = await this.searchCategories(query);
      
      // Tìm kiếm thương hiệu
      const brandResults = await this.searchBrands(query);

      // Kết hợp kết quả
      const allResults = [
        ...productResults.results,
        ...categoryResults,
        ...brandResults
      ];

      // Tạo suggestions
      const suggestions = await this.generateSuggestions(query);

      // Tạo facets cho filtering
      const facets = await this.generateFacets(query, filters);

      return {
        results: allResults.slice(0, limit),
        total: productResults.total + categoryResults.length + brandResults.length,
        suggestions,
        facets
      };
    } catch (error) {
      console.error('Global search error:', error);
      return {
        results: [],
        total: 0,
        suggestions: [],
        facets: {
          categories: [],
          brands: [],
          priceRanges: []
        }
      };
    }
  }

  /**
   * Tìm kiếm sản phẩm
   */
  private async searchProducts(query: string, options: SearchOptions): Promise<{ results: SearchResult[]; total: number }> {
    let queryBuilder = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        sale_price,
        image_url,
        rating,
        category:categories(name),
        brand:brands(name),
        stock_quantity
      `, { count: 'exact' })
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .eq('status', 'active');

    // Áp dụng filters
    if (options.filters?.category) {
      queryBuilder = queryBuilder.eq('category_id', options.filters.category);
    }

    if (options.filters?.brand) {
      queryBuilder = queryBuilder.eq('brand_id', options.filters.brand);
    }

    if (options.filters?.priceRange) {
      queryBuilder = queryBuilder
        .gte('price', options.filters.priceRange.min)
        .lte('price', options.filters.priceRange.max);
    }

    if (options.filters?.rating) {
      queryBuilder = queryBuilder.gte('rating', options.filters.rating);
    }

    if (options.filters?.inStock) {
      queryBuilder = queryBuilder.gt('stock_quantity', 0);
    }

    // Áp dụng sorting
    switch (options.sortBy) {
      case 'price_asc':
        queryBuilder = queryBuilder.order('price', { ascending: true });
        break;
      case 'price_desc':
        queryBuilder = queryBuilder.order('price', { ascending: false });
        break;
      case 'rating':
        queryBuilder = queryBuilder.order('rating', { ascending: false });
        break;
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
        break;
      default:
        // Relevance sorting - có thể implement full-text search sau
        queryBuilder = queryBuilder.order('name');
    }

    // Pagination
    queryBuilder = queryBuilder
      .range(options.offset || 0, (options.offset || 0) + (options.limit || 20) - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw error;
    }

    const results: SearchResult[] = (data || []).map(product => ({
      id: product.id,
      title: product.name,
      description: product.description,
      type: 'product' as const,
      url: `/product/${product.id}`,
      image: product.image_url,
      price: product.sale_price || product.price,
      rating: product.rating,
      category: product.category?.name,
      brand: product.brand?.name
    }));

    return {
      results,
      total: count || 0
    };
  }

  /**
   * Tìm kiếm danh mục
   */
  private async searchCategories(query: string): Promise<SearchResult[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description, image_url')
      .ilike('name', `%${query}%`)
      .eq('status', 'active')
      .limit(5);

    if (error) {
      console.error('Category search error:', error);
      return [];
    }

    return (data || []).map(category => ({
      id: category.id,
      title: category.name,
      description: category.description,
      type: 'category' as const,
      url: `/category/${category.id}`,
      image: category.image_url
    }));
  }

  /**
   * Tìm kiếm thương hiệu
   */
  private async searchBrands(query: string): Promise<SearchResult[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, description, logo_url')
      .ilike('name', `%${query}%`)
      .eq('status', 'active')
      .limit(5);

    if (error) {
      console.error('Brand search error:', error);
      return [];
    }

    return (data || []).map(brand => ({
      id: brand.id,
      title: brand.name,
      description: brand.description,
      type: 'brand' as const,
      url: `/brand/${brand.id}`,
      image: brand.logo_url
    }));
  }

  /**
   * Tạo suggestions cho autocomplete
   */
  private async generateSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) {
      return this.popularSearches.slice(0, 5);
    }

    try {
      // Lấy suggestions từ tên sản phẩm
      const { data: productSuggestions } = await supabase
        .from('products')
        .select('name')
        .ilike('name', `%${query}%`)
        .eq('status', 'active')
        .limit(5);

      // Lấy suggestions từ danh mục
      const { data: categorySuggestions } = await supabase
        .from('categories')
        .select('name')
        .ilike('name', `%${query}%`)
        .eq('status', 'active')
        .limit(3);

      const suggestions = [
        ...(productSuggestions || []).map(p => p.name),
        ...(categorySuggestions || []).map(c => c.name),
        ...this.searchHistory.filter(h => h.toLowerCase().includes(query.toLowerCase()))
      ];

      // Loại bỏ duplicate và giới hạn số lượng
      return [...new Set(suggestions)].slice(0, 8);
    } catch (error) {
      console.error('Suggestion generation error:', error);
      return this.popularSearches.slice(0, 5);
    }
  }

  /**
   * Tạo facets cho filtering
   */
  private async generateFacets(query: string, filters: SearchFilters): Promise<SearchResponse['facets']> {
    try {
      // Lấy categories có sản phẩm matching
      const { data: categoryFacets } = await supabase
        .from('products')
        .select(`
          category:categories(name),
          count:id.count()
        `)
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .eq('status', 'active')
        .not('category', 'is', null);

      // Lấy brands có sản phẩm matching
      const { data: brandFacets } = await supabase
        .from('products')
        .select(`
          brand:brands(name),
          count:id.count()
        `)
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .eq('status', 'active')
        .not('brand', 'is', null);

      return {
        categories: (categoryFacets || []).map(item => ({
          name: item.category?.name || '',
          count: item.count || 0
        })).filter(item => item.name),
        brands: (brandFacets || []).map(item => ({
          name: item.brand?.name || '',
          count: item.count || 0
        })).filter(item => item.name),
        priceRanges: [
          { range: 'Dưới 500K', count: 0 },
          { range: '500K - 1M', count: 0 },
          { range: '1M - 5M', count: 0 },
          { range: '5M - 10M', count: 0 },
          { range: 'Trên 10M', count: 0 }
        ]
      };
    } catch (error) {
      console.error('Facet generation error:', error);
      return {
        categories: [],
        brands: [],
        priceRanges: []
      };
    }
  }

  /**
   * Thêm vào lịch sử tìm kiếm
   */
  private addToSearchHistory(query: string): void {
    if (query.trim().length < 2) return;
    
    const trimmedQuery = query.trim();
    this.searchHistory = [
      trimmedQuery,
      ...this.searchHistory.filter(h => h !== trimmedQuery)
    ].slice(0, 10); // Giữ tối đa 10 lịch sử

    // Lưu vào localStorage
    try {
      localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  /**
   * Lấy lịch sử tìm kiếm
   */
  getSearchHistory(): string[] {
    try {
      const saved = localStorage.getItem('search_history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
    return this.searchHistory;
  }

  /**
   * Xóa lịch sử tìm kiếm
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
    try {
      localStorage.removeItem('search_history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }

  /**
   * Lấy trending searches
   */
  getTrendingSearches(): string[] {
    return this.popularSearches;
  }

  /**
   * Tìm kiếm instant (cho autocomplete)
   */
  async instantSearch(query: string): Promise<SearchResult[]> {
    if (query.length < 2) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          sale_price,
          image_url,
          category:categories(name)
        `)
        .ilike('name', `%${query}%`)
        .eq('status', 'active')
        .limit(5);

      if (error) {
        throw error;
      }

      return (data || []).map(product => ({
        id: product.id,
        title: product.name,
        type: 'product' as const,
        url: `/product/${product.id}`,
        image: product.image_url,
        price: product.sale_price || product.price,
        category: product.category?.name
      }));
    } catch (error) {
      console.error('Instant search error:', error);
      return [];
    }
  }
}

export const globalSearchService = new GlobalSearchService();
export default globalSearchService;
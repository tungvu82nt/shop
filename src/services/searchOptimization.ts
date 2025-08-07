import { SearchQuery, SearchResult, Product } from './searchService';
import { searchAnalytics } from './searchAnalytics';

// Interface cho search optimization
interface SearchOptimizationConfig {
  enablePersonalization: boolean;
  enableTrendingBoost: boolean;
  enableLocationBoost: boolean;
  enableSeasonalBoost: boolean;
  enablePopularityBoost: boolean;
  maxResults: number;
  minRelevanceScore: number;
}

interface ProductScore {
  productId: string;
  baseScore: number;
  personalizedScore: number;
  trendingScore: number;
  locationScore: number;
  seasonalScore: number;
  popularityScore: number;
  finalScore: number;
}

interface SearchContext {
  userId?: string;
  sessionId: string;
  userLocation?: string;
  userPreferences?: Record<string, any>;
  searchHistory: string[];
  clickHistory: Array<{ productId: string; timestamp: number }>;
  currentSeason: 'spring' | 'summer' | 'autumn' | 'winter';
}

class SearchOptimizationService {
  private config: SearchOptimizationConfig = {
    enablePersonalization: true,
    enableTrendingBoost: true,
    enableLocationBoost: true,
    enableSeasonalBoost: true,
    enablePopularityBoost: true,
    maxResults: 50,
    minRelevanceScore: 0.1
  };

  private trendingQueries: Map<string, number> = new Map();
  private popularProducts: Map<string, number> = new Map();
  private seasonalKeywords: Record<string, string[]> = {
    spring: ['xuân', 'hoa', 'tươi mát', 'nhẹ nhàng', 'pastel'],
    summer: ['hè', 'mát mẻ', 'bãi biển', 'du lịch', 'shorts', 'áo thun'],
    autumn: ['thu', 'ấm áp', 'len', 'jacket', 'boots'],
    winter: ['đông', 'ấm', 'coat', 'sweater', 'boots', 'khăn']
  };

  constructor() {
    this.loadTrendingData();
    this.loadPopularityData();
  }

  /**
   * Tối ưu hóa kết quả tìm kiếm
   */
  async optimizeSearchResults(
    query: string,
    results: SearchResult[],
    context: Partial<SearchContext> = {}
  ): Promise<SearchResult[]> {
    if (!results.length) return results;

    // Tạo search context đầy đủ
    const fullContext = await this.buildSearchContext(context);
    
    // Tính điểm cho từng sản phẩm
    const scoredProducts = await this.scoreProducts(query, results, fullContext);
    
    // Sắp xếp theo điểm số
    const sortedProducts = scoredProducts.sort((a, b) => b.finalScore - a.finalScore);
    
    // Lọc theo điểm tối thiểu
    const filteredProducts = sortedProducts.filter(
      product => product.finalScore >= this.config.minRelevanceScore
    );
    
    // Giới hạn số lượng kết quả
    const limitedProducts = filteredProducts.slice(0, this.config.maxResults);
    
    // Chuyển đổi về SearchResult
    const optimizedResults = limitedProducts.map(scored => {
      const originalResult = results.find(r => r.id === scored.productId);
      return {
        ...originalResult!,
        relevanceScore: scored.finalScore,
        optimizationMetadata: {
          baseScore: scored.baseScore,
          personalizedScore: scored.personalizedScore,
          trendingScore: scored.trendingScore,
          locationScore: scored.locationScore,
          seasonalScore: scored.seasonalScore,
          popularityScore: scored.popularityScore
        }
      };
    });

    // Ghi lại analytics
    await this.trackOptimization(query, results.length, optimizedResults.length, fullContext);
    
    return optimizedResults;
  }

  /**
   * Xây dựng search context đầy đủ
   */
  private async buildSearchContext(context: Partial<SearchContext>): Promise<SearchContext> {
    const defaultContext: SearchContext = {
      sessionId: context.sessionId || this.generateSessionId(),
      searchHistory: [],
      clickHistory: [],
      currentSeason: this.getCurrentSeason()
    };

    // Lấy lịch sử tìm kiếm từ analytics
    if (context.userId) {
      try {
        const recentQueries = await searchAnalytics.getSearchSuggestions('', 20);
        defaultContext.searchHistory = recentQueries;
      } catch (error) {
        console.warn('Không thể lấy lịch sử tìm kiếm:', error);
      }
    }

    return { ...defaultContext, ...context };
  }

  /**
   * Tính điểm cho các sản phẩm
   */
  private async scoreProducts(
    query: string,
    results: SearchResult[],
    context: SearchContext
  ): Promise<ProductScore[]> {
    const scores: ProductScore[] = [];

    for (const result of results) {
      const baseScore = this.calculateBaseScore(query, result);
      const personalizedScore = this.config.enablePersonalization 
        ? this.calculatePersonalizedScore(result, context)
        : 0;
      const trendingScore = this.config.enableTrendingBoost 
        ? this.calculateTrendingScore(query, result)
        : 0;
      const locationScore = this.config.enableLocationBoost 
        ? this.calculateLocationScore(result, context)
        : 0;
      const seasonalScore = this.config.enableSeasonalBoost 
        ? this.calculateSeasonalScore(result, context)
        : 0;
      const popularityScore = this.config.enablePopularityBoost 
        ? this.calculatePopularityScore(result)
        : 0;

      const finalScore = this.calculateFinalScore({
        baseScore,
        personalizedScore,
        trendingScore,
        locationScore,
        seasonalScore,
        popularityScore
      });

      scores.push({
        productId: result.id,
        baseScore,
        personalizedScore,
        trendingScore,
        locationScore,
        seasonalScore,
        popularityScore,
        finalScore
      });
    }

    return scores;
  }

  /**
   * Tính điểm cơ bản dựa trên độ liên quan
   */
  private calculateBaseScore(query: string, result: SearchResult): number {
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const title = result.title.toLowerCase();
    const description = result.description?.toLowerCase() || '';
    const category = result.category?.toLowerCase() || '';
    const brand = result.brand?.toLowerCase() || '';
    
    let score = 0;
    
    queryTerms.forEach(term => {
      // Điểm cho title (trọng số cao nhất)
      if (title.includes(term)) {
        score += title.startsWith(term) ? 1.0 : 0.8;
      }
      
      // Điểm cho brand
      if (brand.includes(term)) {
        score += 0.7;
      }
      
      // Điểm cho category
      if (category.includes(term)) {
        score += 0.6;
      }
      
      // Điểm cho description
      if (description.includes(term)) {
        score += 0.4;
      }
    });
    
    // Chuẩn hóa điểm số
    return Math.min(score / queryTerms.length, 1.0);
  }

  /**
   * Tính điểm cá nhân hóa
   */
  private calculatePersonalizedScore(result: SearchResult, context: SearchContext): number {
    let score = 0;
    
    // Dựa trên lịch sử tìm kiếm
    if (context.searchHistory.length > 0) {
      const relatedSearches = context.searchHistory.filter(query => 
        query.includes(result.category?.toLowerCase() || '') ||
        query.includes(result.brand?.toLowerCase() || '')
      );
      score += relatedSearches.length * 0.1;
    }
    
    // Dựa trên lịch sử click
    if (context.clickHistory.length > 0) {
      const recentClicks = context.clickHistory.filter(
        click => Date.now() - click.timestamp < 7 * 24 * 60 * 60 * 1000 // 7 ngày
      );
      
      const categoryClicks = recentClicks.filter(click => {
        // Giả sử chúng ta có thể lấy thông tin category từ productId
        return true; // Placeholder logic
      });
      
      score += categoryClicks.length * 0.05;
    }
    
    return Math.min(score, 0.3); // Giới hạn tối đa 0.3
  }

  /**
   * Tính điểm trending
   */
  private calculateTrendingScore(query: string, result: SearchResult): number {
    const queryScore = this.trendingQueries.get(query.toLowerCase()) || 0;
    const categoryScore = this.trendingQueries.get(result.category?.toLowerCase() || '') || 0;
    const brandScore = this.trendingQueries.get(result.brand?.toLowerCase() || '') || 0;
    
    const maxTrendingScore = Math.max(...Array.from(this.trendingQueries.values()), 1);
    
    return Math.max(queryScore, categoryScore, brandScore) / maxTrendingScore * 0.2;
  }

  /**
   * Tính điểm vị trí
   */
  private calculateLocationScore(result: SearchResult, context: SearchContext): number {
    if (!context.userLocation || !result.location) return 0;
    
    // Logic đơn giản: nếu cùng thành phố thì được điểm cao
    if (result.location.toLowerCase().includes(context.userLocation.toLowerCase())) {
      return 0.15;
    }
    
    return 0;
  }

  /**
   * Tính điểm theo mùa
   */
  private calculateSeasonalScore(result: SearchResult, context: SearchContext): number {
    const seasonalKeywords = this.seasonalKeywords[context.currentSeason];
    const title = result.title.toLowerCase();
    const description = result.description?.toLowerCase() || '';
    const category = result.category?.toLowerCase() || '';
    
    let score = 0;
    
    seasonalKeywords.forEach(keyword => {
      if (title.includes(keyword) || description.includes(keyword) || category.includes(keyword)) {
        score += 0.05;
      }
    });
    
    return Math.min(score, 0.2);
  }

  /**
   * Tính điểm độ phổ biến
   */
  private calculatePopularityScore(result: SearchResult): number {
    const popularity = this.popularProducts.get(result.id) || 0;
    const maxPopularity = Math.max(...Array.from(this.popularProducts.values()), 1);
    
    return (popularity / maxPopularity) * 0.25;
  }

  /**
   * Tính điểm cuối cùng
   */
  private calculateFinalScore(scores: Omit<ProductScore, 'productId' | 'finalScore'>): number {
    const weights = {
      baseScore: 0.4,
      personalizedScore: 0.2,
      trendingScore: 0.15,
      locationScore: 0.1,
      seasonalScore: 0.1,
      popularityScore: 0.05
    };
    
    return (
      scores.baseScore * weights.baseScore +
      scores.personalizedScore * weights.personalizedScore +
      scores.trendingScore * weights.trendingScore +
      scores.locationScore * weights.locationScore +
      scores.seasonalScore * weights.seasonalScore +
      scores.popularityScore * weights.popularityScore
    );
  }

  /**
   * Lấy mùa hiện tại
   */
  private getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
    const month = new Date().getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  /**
   * Tạo session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Tải dữ liệu trending
   */
  private async loadTrendingData(): void {
    try {
      // Lấy trending queries từ analytics
      const trendingSearches = await searchAnalytics.getTrendingSearches(50);
      
      trendingSearches.forEach((query, index) => {
        this.trendingQueries.set(query.toLowerCase(), 50 - index);
      });
    } catch (error) {
      console.warn('Không thể tải dữ liệu trending:', error);
    }
  }

  /**
   * Tải dữ liệu độ phổ biến
   */
  private async loadPopularityData(): void {
    try {
      // Placeholder - trong thực tế sẽ lấy từ database
      // Dữ liệu về số lượt xem, mua hàng, đánh giá của sản phẩm
      const popularityData = new Map<string, number>();
      
      // Giả lập dữ liệu
      for (let i = 1; i <= 100; i++) {
        popularityData.set(`product_${i}`, Math.random() * 1000);
      }
      
      this.popularProducts = popularityData;
    } catch (error) {
      console.warn('Không thể tải dữ liệu độ phổ biến:', error);
    }
  }

  /**
   * Ghi lại analytics cho optimization
   */
  private async trackOptimization(
    query: string,
    originalCount: number,
    optimizedCount: number,
    context: SearchContext
  ): Promise<void> {
    try {
      // Ghi lại thông tin optimization
      console.log('Search Optimization:', {
        query,
        originalCount,
        optimizedCount,
        reductionRate: ((originalCount - optimizedCount) / originalCount * 100).toFixed(2) + '%',
        context: {
          sessionId: context.sessionId,
          userId: context.userId,
          season: context.currentSeason
        }
      });
    } catch (error) {
      console.warn('Không thể ghi analytics optimization:', error);
    }
  }

  /**
   * Cập nhật cấu hình
   */
  updateConfig(newConfig: Partial<SearchOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Lấy cấu hình hiện tại
   */
  getConfig(): SearchOptimizationConfig {
    return { ...this.config };
  }

  /**
   * Làm mới dữ liệu trending và popularity
   */
  async refreshData(): Promise<void> {
    await Promise.all([
      this.loadTrendingData(),
      this.loadPopularityData()
    ]);
  }
}

// Tạo instance singleton
export const searchOptimization = new SearchOptimizationService();

// Export types
export type { SearchOptimizationConfig, ProductScore, SearchContext };

// Export class
export { SearchOptimizationService };

export default searchOptimization;
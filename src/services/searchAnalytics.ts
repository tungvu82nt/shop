import { supabase } from '@/lib/supabase';
import { captureMessage } from '@/lib/sentry';

// Interface cho search analytics
export interface SearchAnalytics {
  query: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  resultsCount: number;
  filters?: Record<string, any>;
  searchType: 'global' | 'page' | 'autocomplete';
  clickPosition?: number;
  clickedResult?: string;
  timeSpent?: number;
  userAgent: string;
  referrer?: string;
}

// Interface cho search metrics
export interface SearchMetrics {
  totalSearches: number;
  uniqueSearches: number;
  averageResultsCount: number;
  clickThroughRate: number;
  averageTimeSpent: number;
  topQueries: Array<{ query: string; count: number }>;
  topFilters: Array<{ filter: string; count: number }>;
  searchTrends: Array<{ date: string; count: number }>;
}

class SearchAnalyticsService {
  private sessionId: string;
  private searchStartTime: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Tạo session ID duy nhất
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Ghi lại sự kiện tìm kiếm
   */
  async trackSearch(analytics: Omit<SearchAnalytics, 'timestamp' | 'sessionId'>): Promise<void> {
    try {
      const searchEvent: SearchAnalytics = {
        ...analytics,
        timestamp: new Date(),
        sessionId: this.sessionId
      };

      // Gửi lên Supabase
      const { error } = await supabase
        .from('search_analytics')
        .insert([searchEvent]);

      if (error) {
        console.error('Failed to track search:', error);
        // Fallback: gửi lên Sentry
        captureMessage('Search tracking failed', 'warning', { error: error.message });
      }

      // Gửi lên Google Analytics (nếu có)
      this.trackToGoogleAnalytics(searchEvent);

    } catch (error) {
      console.error('Search analytics error:', error);
    }
  }

  /**
   * Bắt đầu theo dõi thời gian tìm kiếm
   */
  startSearchTimer(): void {
    this.searchStartTime = Date.now();
  }

  /**
   * Kết thúc theo dõi thời gian tìm kiếm
   */
  endSearchTimer(): number {
    if (this.searchStartTime === 0) return 0;
    
    const timeSpent = Date.now() - this.searchStartTime;
    this.searchStartTime = 0;
    return timeSpent;
  }

  /**
   * Ghi lại click vào kết quả tìm kiếm
   */
  async trackSearchClick(
    query: string,
    resultId: string,
    position: number,
    searchType: 'global' | 'page' | 'autocomplete' = 'page'
  ): Promise<void> {
    try {
      const timeSpent = this.endSearchTimer();

      await this.trackSearch({
        query,
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        resultsCount: 0, // Sẽ được cập nhật sau
        searchType,
        clickPosition: position,
        clickedResult: resultId,
        timeSpent,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });

    } catch (error) {
      console.error('Failed to track search click:', error);
    }
  }

  /**
   * Ghi lại sự kiện tìm kiếm với kết quả
   */
  async trackSearchWithResults(
    query: string,
    resultsCount: number,
    filters?: Record<string, any>,
    searchType: 'global' | 'page' | 'autocomplete' = 'page'
  ): Promise<void> {
    try {
      this.startSearchTimer();

      await this.trackSearch({
        query,
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        resultsCount,
        filters,
        searchType,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });

    } catch (error) {
      console.error('Failed to track search with results:', error);
    }
  }

  /**
   * Ghi lại sự kiện autocomplete
   */
  async trackAutocomplete(query: string, selectedSuggestion?: string): Promise<void> {
    try {
      await this.trackSearch({
        query,
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        resultsCount: 0,
        searchType: 'autocomplete',
        clickedResult: selectedSuggestion,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });

    } catch (error) {
      console.error('Failed to track autocomplete:', error);
    }
  }

  /**
   * Lấy metrics tìm kiếm
   */
  async getSearchMetrics(timeRange: 'day' | 'week' | 'month' = 'week'): Promise<SearchMetrics> {
    try {
      const startDate = this.getStartDate(timeRange);

      // Tổng số tìm kiếm
      const { count: totalSearches } = await supabase
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', startDate.toISOString());

      // Số tìm kiếm duy nhất
      const { count: uniqueSearches } = await supabase
        .from('search_analytics')
        .select('query', { count: 'exact', head: true })
        .gte('timestamp', startDate.toISOString());

      // Top queries
      const { data: topQueries } = await supabase
        .from('search_analytics')
        .select('query')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      // Tính toán metrics
      const queryCounts = topQueries?.reduce((acc, item) => {
        acc[item.query] = (acc[item.query] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topQueriesArray = Object.entries(queryCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Tính click-through rate (giả định)
      const clickThroughRate = 0.15; // 15% - sẽ được tính toán thực tế

      return {
        totalSearches: totalSearches || 0,
        uniqueSearches: uniqueSearches || 0,
        averageResultsCount: 25, // Sẽ được tính toán thực tế
        clickThroughRate,
        averageTimeSpent: 30000, // 30 giây - sẽ được tính toán thực tế
        topQueries: topQueriesArray,
        topFilters: [], // Sẽ được tính toán thực tế
        searchTrends: [] // Sẽ được tính toán thực tế
      };

    } catch (error) {
      console.error('Failed to get search metrics:', error);
      return {
        totalSearches: 0,
        uniqueSearches: 0,
        averageResultsCount: 0,
        clickThroughRate: 0,
        averageTimeSpent: 0,
        topQueries: [],
        topFilters: [],
        searchTrends: []
      };
    }
  }

  /**
   * Lấy trending searches
   */
  async getTrendingSearches(limit: number = 10): Promise<string[]> {
    try {
      const startDate = this.getStartDate('week');

      const { data: searches } = await supabase
        .from('search_analytics')
        .select('query')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (!searches) return [];

      // Đếm tần suất xuất hiện
      const queryCounts = searches.reduce((acc, item) => {
        acc[item.query] = (acc[item.query] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Sắp xếp theo tần suất và trả về top queries
      return Object.entries(queryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([query]) => query);

    } catch (error) {
      console.error('Failed to get trending searches:', error);
      return [];
    }
  }

  /**
   * Lấy search suggestions dựa trên lịch sử
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const { data: searches } = await supabase
        .from('search_analytics')
        .select('query')
        .ilike('query', `%${query}%`)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (!searches) return [];

      // Loại bỏ trùng lặp và trả về
      return [...new Set(searches.map(item => item.query))];

    } catch (error) {
      console.error('Failed to get search suggestions:', error);
      return [];
    }
  }

  /**
   * Gửi dữ liệu lên Google Analytics
   */
  private trackToGoogleAnalytics(analytics: SearchAnalytics): void {
    // Kiểm tra xem có Google Analytics không
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: analytics.query,
        search_type: analytics.searchType,
        results_count: analytics.resultsCount,
        user_id: analytics.userId
      });
    }
  }

  /**
   * Lấy user ID hiện tại
   */
  private getCurrentUserId(): string | undefined {
    // Lấy từ localStorage hoặc context
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Lấy start date cho time range
   */
  private getStartDate(timeRange: 'day' | 'week' | 'month'): Date {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Xóa dữ liệu analytics cũ
   */
  async cleanupOldData(daysToKeep: number = 90): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { error } = await supabase
        .from('search_analytics')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        console.error('Failed to cleanup old analytics data:', error);
      }

    } catch (error) {
      console.error('Analytics cleanup error:', error);
    }
  }
}

export const searchAnalytics = new SearchAnalyticsService(); 
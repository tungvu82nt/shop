import { toast } from 'sonner';

// Performance Configuration
const PERFORMANCE_CONFIG = {
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 50, // Maximum number of cached items
  
  // Image optimization
  IMAGE_QUALITY: 85,
  IMAGE_FORMATS: ['webp', 'jpg', 'png'],
  LAZY_LOAD_THRESHOLD: 100, // pixels
  
  // Code splitting
  CHUNK_SIZE_LIMIT: 244 * 1024, // 244KB
  
  // Performance monitoring
  PERFORMANCE_BUDGET: {
    FCP: 1800, // First Contentful Paint (ms)
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 600  // Time to First Byte (ms)
  },
  
  // Resource hints
  PRELOAD_CRITICAL_RESOURCES: true,
  PREFETCH_NEXT_PAGES: true,
  
  // Bundle analysis
  ANALYZE_BUNDLE: import.meta.env.DEV
};

// Interfaces
export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiry: number;
  key: string;
}

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  loadTime: number;
  domContentLoaded: number;
  resourceCount: number;
  bundleSize?: number;
}

export interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
  lazy?: boolean;
  placeholder?: string;
}

// Memory Cache Class
class MemoryCache {
  private cache = new Map<string, CacheItem>();
  private accessOrder: string[] = [];
  
  set<T>(key: string, data: T, duration: number = PERFORMANCE_CONFIG.CACHE_DURATION): void {
    const now = Date.now();
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiry: now + duration,
      key
    };
    
    // Remove existing key from access order
    const existingIndex = this.accessOrder.indexOf(key);
    if (existingIndex > -1) {
      this.accessOrder.splice(existingIndex, 1);
    }
    
    // Add to cache and access order
    this.cache.set(key, item);
    this.accessOrder.push(key);
    
    // Cleanup if cache is too large
    this.cleanup();
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.delete(key);
      return null;
    }
    
    // Update access order
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
    }
    
    return item.data as T;
  }
  
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    return deleted;
  }
  
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }
  
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  size(): number {
    return this.cache.size;
  }
  
  private cleanup(): void {
    // Remove expired items
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.delete(key);
      }
    }
    
    // Remove oldest items if cache is too large
    while (this.cache.size > PERFORMANCE_CONFIG.MAX_CACHE_SIZE) {
      const oldestKey = this.accessOrder[0];
      if (oldestKey) {
        this.delete(oldestKey);
      }
    }
  }
  
  getStats(): { size: number; hitRate: number; memoryUsage: number } {
    return {
      size: this.cache.size,
      hitRate: 0, // Would need to track hits/misses
      memoryUsage: JSON.stringify([...this.cache.values()]).length
    };
  }
}

// Lazy Loading Observer
class LazyLoadObserver {
  private observer: IntersectionObserver | null = null;
  private elements = new Map<Element, () => void>();
  
  constructor(options: LazyLoadOptions = {}) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: 0,
          rootMargin: options.rootMargin || '50px',
          ...options
        }
      );
    }
  }
  
  observe(element: Element, callback: () => void): void {
    if (!this.observer) {
      // Fallback for browsers without IntersectionObserver
      callback();
      return;
    }
    
    this.elements.set(element, callback);
    this.observer.observe(element);
  }
  
  unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
    this.elements.delete(element);
  }
  
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const callback = this.elements.get(entry.target);
        if (callback) {
          callback();
          this.unobserve(entry.target);
        }
      }
    });
  }
  
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.elements.clear();
  }
}

// Performance Service Class
class PerformanceService {
  private cache = new MemoryCache();
  private lazyLoader = new LazyLoadObserver();
  private metrics: PerformanceMetrics | null = null;
  private resourceHints = new Set<string>();
  
  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (typeof window === 'undefined') return;
    
    // Monitor performance metrics
    this.monitorPerformance();
    
    // Setup resource hints
    this.setupResourceHints();
    
    // Monitor bundle size in development
    if (PERFORMANCE_CONFIG.ANALYZE_BUNDLE) {
      this.analyzeBundleSize();
    }
    
    // Setup error monitoring
    this.setupErrorMonitoring();
  }
  
  /**
   * Cache management
   */
  setCache<T>(key: string, data: T, duration?: number): void {
    this.cache.set(key, data, duration);
  }
  
  getCache<T>(key: string): T | null {
    return this.cache.get<T>(key);
  }
  
  clearCache(): void {
    this.cache.clear();
  }
  
  getCacheStats() {
    return this.cache.getStats();
  }
  
  /**
   * Lazy loading
   */
  lazyLoad(element: Element, callback: () => void, options?: LazyLoadOptions): void {
    if (options) {
      // Create new observer with custom options
      const customObserver = new LazyLoadObserver(options);
      customObserver.observe(element, callback);
    } else {
      this.lazyLoader.observe(element, callback);
    }
  }
  
  /**
   * Image optimization
   */
  optimizeImageUrl(src: string, options: ImageOptimizationOptions = {}): string {
    const {
      width,
      height,
      quality = PERFORMANCE_CONFIG.IMAGE_QUALITY,
      format = 'auto'
    } = options;
    
    // If it's already an optimized URL, return as is
    if (src.includes('picsum.photos') || src.includes('via.placeholder.com')) {
      return src;
    }
    
    // Build optimization parameters
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== PERFORMANCE_CONFIG.IMAGE_QUALITY) {
      params.append('q', quality.toString());
    }
    if (format !== 'auto') params.append('f', format);
    
    // Return optimized URL
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${params.toString()}`;
  }
  
  /**
   * Generate responsive image srcSet
   */
  generateSrcSet(src: string, sizes: number[] = [320, 640, 768, 1024, 1280]): string {
    return sizes
      .map(size => `${this.optimizeImageUrl(src, { width: size })} ${size}w`)
      .join(', ');
  }
  
  /**
   * Preload critical resources
   */
  preloadResource(href: string, as: string, type?: string): void {
    if (typeof document === 'undefined' || this.resourceHints.has(href)) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    
    document.head.appendChild(link);
    this.resourceHints.add(href);
  }
  
  /**
   * Prefetch next page resources
   */
  prefetchResource(href: string): void {
    if (typeof document === 'undefined' || this.resourceHints.has(href)) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
    this.resourceHints.add(href);
  }
  
  /**
   * DNS prefetch for external domains
   */
  dnsPrefetch(domain: string): void {
    if (typeof document === 'undefined' || this.resourceHints.has(domain)) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    
    document.head.appendChild(link);
    this.resourceHints.add(domain);
  }
  
  /**
   * Monitor performance metrics
   */
  private monitorPerformance(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }
    
    // Wait for page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectMetrics();
      }, 1000);
    });
    
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
  }
  
  /**
   * Collect performance metrics
   */
  private collectMetrics(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource');
    
    this.metrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      resourceCount: resources.length
    };
    
    // Check performance budget
    this.checkPerformanceBudget();
    
    // Log metrics in development
    if (import.meta.env.DEV) {
      console.log('Performance Metrics:', this.metrics);
    }
  }
  
  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // This would typically use web-vitals library
    // For now, we'll use basic performance API
    
    if (typeof window === 'undefined') return;
    
    // Monitor FCP (First Contentful Paint)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          if (this.metrics) {
            this.metrics.fcp = entry.startTime;
          }
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Fallback for browsers that don't support this
    }
  }
  
  /**
   * Check performance budget
   */
  private checkPerformanceBudget(): void {
    if (!this.metrics) return;
    
    const budget = PERFORMANCE_CONFIG.PERFORMANCE_BUDGET;
    const warnings: string[] = [];
    
    if (this.metrics.fcp && this.metrics.fcp > budget.FCP) {
      warnings.push(`FCP (${this.metrics.fcp}ms) vượt quá ngân sách (${budget.FCP}ms)`);
    }
    
    if (this.metrics.lcp && this.metrics.lcp > budget.LCP) {
      warnings.push(`LCP (${this.metrics.lcp}ms) vượt quá ngân sách (${budget.LCP}ms)`);
    }
    
    if (this.metrics.ttfb && this.metrics.ttfb > budget.TTFB) {
      warnings.push(`TTFB (${this.metrics.ttfb}ms) vượt quá ngân sách (${budget.TTFB}ms)`);
    }
    
    if (warnings.length > 0 && import.meta.env.DEV) {
      console.warn('Performance Budget Exceeded:', warnings);
    }
  }
  
  /**
   * Setup resource hints
   */
  private setupResourceHints(): void {
    if (!PERFORMANCE_CONFIG.PRELOAD_CRITICAL_RESOURCES) return;
    
    // Preload critical fonts
    this.preloadResource('/fonts/inter.woff2', 'font', 'font/woff2');
    
    // DNS prefetch for external domains
    this.dnsPrefetch('//picsum.photos');
    this.dnsPrefetch('//fonts.googleapis.com');
    this.dnsPrefetch('//fonts.gstatic.com');
  }
  
  /**
   * Analyze bundle size
   */
  private analyzeBundleSize(): void {
    if (typeof window === 'undefined') return;
    
    // This would typically integrate with webpack-bundle-analyzer
    // For now, we'll estimate based on script tags
    
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      // This is a rough estimation
      totalSize += 50000; // Assume 50KB per script
    });
    
    if (this.metrics) {
      this.metrics.bundleSize = totalSize;
    }
    
    if (totalSize > PERFORMANCE_CONFIG.CHUNK_SIZE_LIMIT * 5) {
      console.warn(`Bundle size (${totalSize} bytes) có thể quá lớn`);
    }
  }
  
  /**
   * Setup error monitoring
   */
  private setupErrorMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    // Monitor JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('Performance Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    });
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }
  
  /**
   * Optimize component rendering
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  /**
   * Throttle function calls
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.cache.clear();
    this.lazyLoader.disconnect();
    this.resourceHints.clear();
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();

// Export configuration
export { PERFORMANCE_CONFIG };

// Export types
export type { PerformanceMetrics, LazyLoadOptions, ImageOptimizationOptions };
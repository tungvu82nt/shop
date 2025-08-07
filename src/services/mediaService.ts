import { toast } from 'sonner';

// Cấu hình cho Media Service
const MEDIA_CONFIG = {
  // CDN endpoints
  CDN_BASE_URL: 'https://picsum.photos',
  FALLBACK_CDN: 'https://via.placeholder.com',
  
  // Image sizes
  SIZES: {
    THUMBNAIL: { width: 150, height: 150 },
    SMALL: { width: 300, height: 300 },
    MEDIUM: { width: 500, height: 500 },
    LARGE: { width: 800, height: 800 },
    BANNER: { width: 1200, height: 400 },
    HERO: { width: 1920, height: 600 }
  },
  
  // Supported formats
  FORMATS: ['webp', 'jpg', 'png'],
  
  // Cache settings
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
};

// Interface cho Media Item
export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  format?: string;
  category?: string;
  fallbackUrl?: string;
}

// Interface cho Image Options
export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  blur?: boolean;
  grayscale?: boolean;
  random?: number;
}

// Cache cho images
class ImageCache {
  private cache = new Map<string, { url: string; timestamp: number }>();
  
  set(key: string, url: string): void {
    this.cache.set(key, {
      url,
      timestamp: Date.now()
    });
  }
  
  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Kiểm tra expiry
    if (Date.now() - item.timestamp > MEDIA_CONFIG.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.url;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const imageCache = new ImageCache();

// Media Service Class
class MediaService {
  /**
   * Tạo URL hình ảnh với các tùy chọn
   */
  generateImageUrl(options: ImageOptions = {}): string {
    const {
      width = 300,
      height = 300,
      quality = 80,
      format = 'jpg',
      blur = false,
      grayscale = false,
      random = Math.floor(Math.random() * 1000)
    } = options;
    
    const cacheKey = `${width}x${height}_${quality}_${format}_${blur}_${grayscale}_${random}`;
    const cached = imageCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const url = `${MEDIA_CONFIG.CDN_BASE_URL}/${width}/${height}`;
    
    // Thêm parameters
    const params = new URLSearchParams();
    params.append('random', random.toString());
    
    if (blur) params.append('blur', '2');
    if (grayscale) params.append('grayscale', '1');
    
    const finalUrl = `${url}?${params.toString()}`;
    imageCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  }
  
  /**
   * Tạo hình ảnh sản phẩm với mapping thông minh
   */
  getProductImage(productName: string, size: keyof typeof MEDIA_CONFIG.SIZES = 'MEDIUM'): MediaItem {
    const { width, height } = MEDIA_CONFIG.SIZES[size];
    const random = this.getProductSeed(productName);
    
    const url = this.generateImageUrl({ width, height, random });
    const fallbackUrl = `${MEDIA_CONFIG.FALLBACK_CDN}/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(productName)}`;
    
    return {
      id: `product_${productName}_${size}`,
      url,
      alt: `Hình ảnh sản phẩm ${productName}`,
      width,
      height,
      category: 'product',
      fallbackUrl
    };
  }
  
  /**
   * Tạo hình ảnh danh mục
   */
  getCategoryImage(categoryName: string, size: keyof typeof MEDIA_CONFIG.SIZES = 'SMALL'): MediaItem {
    const { width, height } = MEDIA_CONFIG.SIZES[size];
    const random = this.getCategorySeed(categoryName);
    
    const url = this.generateImageUrl({ width, height, random });
    const fallbackUrl = `${MEDIA_CONFIG.FALLBACK_CDN}/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(categoryName)}`;
    
    return {
      id: `category_${categoryName}_${size}`,
      url,
      alt: `Danh mục ${categoryName}`,
      width,
      height,
      category: 'category',
      fallbackUrl
    };
  }
  
  /**
   * Tạo hình ảnh banner
   */
  getBannerImage(title: string, size: keyof typeof MEDIA_CONFIG.SIZES = 'BANNER'): MediaItem {
    const { width, height } = MEDIA_CONFIG.SIZES[size];
    const random = this.getBannerSeed(title);
    
    const url = this.generateImageUrl({ width, height, random });
    const fallbackUrl = `${MEDIA_CONFIG.FALLBACK_CDN}/${width}x${height}/3b82f6/ffffff?text=${encodeURIComponent(title)}`;
    
    return {
      id: `banner_${title}_${size}`,
      url,
      alt: `Banner ${title}`,
      width,
      height,
      category: 'banner',
      fallbackUrl
    };
  }
  
  /**
   * Tạo avatar người dùng
   */
  getUserAvatar(userId: string, size: keyof typeof MEDIA_CONFIG.SIZES = 'THUMBNAIL'): MediaItem {
    const { width, height } = MEDIA_CONFIG.SIZES[size];
    const random = this.getUserSeed(userId);
    
    const url = this.generateImageUrl({ width, height, random });
    const fallbackUrl = `${MEDIA_CONFIG.FALLBACK_CDN}/${width}x${height}/6b7280/ffffff?text=User`;
    
    return {
      id: `avatar_${userId}_${size}`,
      url,
      alt: `Avatar người dùng`,
      width,
      height,
      category: 'avatar',
      fallbackUrl
    };
  }
  
  /**
   * Tạo responsive image srcSet
   */
  generateResponsiveImageSet(baseOptions: ImageOptions): {
    src: string;
    srcSet: string;
    sizes: string;
  } {
    const { width = 300, height = 300 } = baseOptions;
    
    const sizes = [
      { w: Math.floor(width * 0.5), descriptor: '1x' },
      { w: width, descriptor: '2x' },
      { w: Math.floor(width * 1.5), descriptor: '3x' }
    ];
    
    const srcSet = sizes
      .map(size => {
        const url = this.generateImageUrl({
          ...baseOptions,
          width: size.w,
          height: Math.floor(height * (size.w / width))
        });
        return `${url} ${size.descriptor}`;
      })
      .join(', ');
    
    return {
      src: this.generateImageUrl(baseOptions),
      srcSet,
      sizes: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
    };
  }
  
  /**
   * Preload hình ảnh quan trọng
   */
  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      img.src = url;
    });
  }
  
  /**
   * Preload nhiều hình ảnh
   */
  async preloadImages(urls: string[]): Promise<void> {
    try {
      await Promise.all(urls.map(url => this.preloadImage(url)));
      console.log(`Successfully preloaded ${urls.length} images`);
    } catch (error) {
      console.error('Error preloading images:', error);
      toast.error('Có lỗi khi tải trước hình ảnh');
    }
  }
  
  /**
   * Tối ưu hóa hình ảnh cho WebP
   */
  supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  /**
   * Lấy định dạng hình ảnh tối ưu
   */
  getOptimalFormat(): 'webp' | 'jpg' {
    return this.supportsWebP() ? 'webp' : 'jpg';
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    imageCache.clear();
    toast.success('Cache hình ảnh đã được xóa');
  }
  
  // Private helper methods
  private getProductSeed(productName: string): number {
    return this.stringToSeed(productName) + 1000;
  }
  
  private getCategorySeed(categoryName: string): number {
    return this.stringToSeed(categoryName) + 2000;
  }
  
  private getBannerSeed(title: string): number {
    return this.stringToSeed(title) + 3000;
  }
  
  private getUserSeed(userId: string): number {
    return this.stringToSeed(userId) + 4000;
  }
  
  private stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 1000;
  }
}

// Export singleton instance
export const mediaService = new MediaService();

// Export constants
export { MEDIA_CONFIG };

// Export types
export type { ImageOptions };
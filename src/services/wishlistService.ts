import { Product } from '../types';
import { notificationService } from './notificationService';

// Cấu hình wishlist
const WISHLIST_CONFIG = {
  storageKey: 'yapee_wishlist',
  maxItems: 100,
  syncInterval: 5000 // 5 giây
};

// Interface cho wishlist item
export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
  notes?: string;
}

// Interface cho wishlist data
export interface WishlistData {
  items: WishlistItem[];
  lastUpdated: string;
  totalItems: number;
}

// Interface cho wishlist statistics
export interface WishlistStats {
  totalItems: number;
  totalValue: number;
  averagePrice: number;
  categoriesCount: Record<string, number>;
  brandsCount: Record<string, number>;
  priceRanges: {
    under1M: number;
    from1Mto5M: number;
    from5Mto10M: number;
    over10M: number;
  };
}

// Interface cho wishlist filters
export interface WishlistFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'addedAt' | 'price' | 'name' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Service quản lý danh sách yêu thích
 */
class WishlistService {
  private wishlistData: WishlistData;
  private listeners: Set<(data: WishlistData) => void> = new Set();
  private syncTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.wishlistData = this.loadFromStorage();
    this.startSync();
  }

  /**
   * Tải dữ liệu từ localStorage
   */
  private loadFromStorage(): WishlistData {
    try {
      const stored = localStorage.getItem(WISHLIST_CONFIG.storageKey);
      if (stored) {
        const data = JSON.parse(stored) as WishlistData;
        return {
          ...data,
          items: data.items || [],
          totalItems: data.items?.length || 0
        };
      }
    } catch (error) {
      console.error('Lỗi khi tải wishlist từ localStorage:', error);
    }

    return {
      items: [],
      lastUpdated: new Date().toISOString(),
      totalItems: 0
    };
  }

  /**
   * Lưu dữ liệu vào localStorage
   */
  private saveToStorage(): void {
    try {
      this.wishlistData.lastUpdated = new Date().toISOString();
      this.wishlistData.totalItems = this.wishlistData.items.length;
      localStorage.setItem(
        WISHLIST_CONFIG.storageKey,
        JSON.stringify(this.wishlistData)
      );
    } catch (error) {
      console.error('Lỗi khi lưu wishlist vào localStorage:', error);
    }
  }

  /**
   * Thông báo cho các listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.wishlistData);
      } catch (error) {
        console.error('Lỗi khi thông báo wishlist listener:', error);
      }
    });
  }

  /**
   * Bắt đầu đồng bộ định kỳ
   */
  private startSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      this.saveToStorage();
    }, WISHLIST_CONFIG.syncInterval);
  }

  /**
   * Dừng đồng bộ
   */
  private stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Đăng ký listener
   */
  subscribe(listener: (data: WishlistData) => void): () => void {
    this.listeners.add(listener);
    
    // Gọi listener ngay lập tức với dữ liệu hiện tại
    listener(this.wishlistData);
    
    // Trả về function để hủy đăng ký
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Lấy toàn bộ dữ liệu wishlist
   */
  getWishlist(): WishlistData {
    return { ...this.wishlistData };
  }

  /**
   * Lấy danh sách sản phẩm trong wishlist
   */
  getItems(filters?: WishlistFilters): WishlistItem[] {
    let items = [...this.wishlistData.items];

    // Áp dụng filters
    if (filters) {
      if (filters.category) {
        items = items.filter(item => 
          item.product.category?.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }

      if (filters.brand) {
        items = items.filter(item => 
          item.product.brand?.toLowerCase().includes(filters.brand!.toLowerCase())
        );
      }

      if (filters.minPrice !== undefined) {
        items = items.filter(item => item.product.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        items = items.filter(item => item.product.price <= filters.maxPrice!);
      }

      if (filters.inStock !== undefined) {
        items = items.filter(item => item.product.inStock === filters.inStock);
      }

      // Sắp xếp
      if (filters.sortBy) {
        items.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (filters.sortBy) {
            case 'addedAt':
              aValue = new Date(a.addedAt).getTime();
              bValue = new Date(b.addedAt).getTime();
              break;
            case 'price':
              aValue = a.product.price;
              bValue = b.product.price;
              break;
            case 'name':
              aValue = a.product.name.toLowerCase();
              bValue = b.product.name.toLowerCase();
              break;
            case 'rating':
              aValue = a.product.rating || 0;
              bValue = b.product.rating || 0;
              break;
            default:
              return 0;
          }

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          }
        });
      }
    }

    return items;
  }

  /**
   * Kiểm tra sản phẩm có trong wishlist không
   */
  isInWishlist(productId: string): boolean {
    return this.wishlistData.items.some(item => item.productId === productId);
  }

  /**
   * Lấy item trong wishlist theo productId
   */
  getItem(productId: string): WishlistItem | null {
    return this.wishlistData.items.find(item => item.productId === productId) || null;
  }

  /**
   * Thêm sản phẩm vào wishlist
   */
  addItem(product: Product, notes?: string): boolean {
    try {
      // Kiểm tra đã tồn tại
      if (this.isInWishlist(product.id)) {
        notificationService.warning(`${product.name} đã có trong danh sách yêu thích`);
        return false;
      }

      // Kiểm tra giới hạn
      if (this.wishlistData.items.length >= WISHLIST_CONFIG.maxItems) {
        notificationService.error(
          'Danh sách yêu thích đã đầy',
          { description: `Tối đa ${WISHLIST_CONFIG.maxItems} sản phẩm` }
        );
        return false;
      }

      // Thêm item mới
      const newItem: WishlistItem = {
        productId: product.id,
        product,
        addedAt: new Date().toISOString(),
        notes
      };

      this.wishlistData.items.unshift(newItem);
      this.saveToStorage();
      this.notifyListeners();

      notificationService.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
      return true;
    } catch (error) {
      console.error('Lỗi khi thêm vào wishlist:', error);
      notificationService.error('Không thể thêm vào danh sách yêu thích');
      return false;
    }
  }

  /**
   * Xóa sản phẩm khỏi wishlist
   */
  removeItem(productId: string): boolean {
    try {
      const index = this.wishlistData.items.findIndex(item => item.productId === productId);
      
      if (index === -1) {
        notificationService.warning('Sản phẩm không có trong danh sách yêu thích');
        return false;
      }

      const removedItem = this.wishlistData.items[index];
      this.wishlistData.items.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();

      notificationService.info(`Đã xóa ${removedItem.product.name} khỏi danh sách yêu thích`);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa khỏi wishlist:', error);
      notificationService.error('Không thể xóa khỏi danh sách yêu thích');
      return false;
    }
  }

  /**
   * Toggle sản phẩm trong wishlist
   */
  toggleItem(product: Product, notes?: string): boolean {
    if (this.isInWishlist(product.id)) {
      return this.removeItem(product.id);
    } else {
      return this.addItem(product, notes);
    }
  }

  /**
   * Cập nhật ghi chú cho item
   */
  updateNotes(productId: string, notes: string): boolean {
    try {
      const item = this.wishlistData.items.find(item => item.productId === productId);
      
      if (!item) {
        notificationService.warning('Sản phẩm không có trong danh sách yêu thích');
        return false;
      }

      item.notes = notes;
      this.saveToStorage();
      this.notifyListeners();

      notificationService.success('Đã cập nhật ghi chú');
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật ghi chú:', error);
      notificationService.error('Không thể cập nhật ghi chú');
      return false;
    }
  }

  /**
   * Xóa toàn bộ wishlist
   */
  clearAll(): boolean {
    try {
      this.wishlistData.items = [];
      this.saveToStorage();
      this.notifyListeners();

      notificationService.info('Đã xóa toàn bộ danh sách yêu thích');
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa toàn bộ wishlist:', error);
      notificationService.error('Không thể xóa danh sách yêu thích');
      return false;
    }
  }

  /**
   * Lấy thống kê wishlist
   */
  getStats(): WishlistStats {
    const items = this.wishlistData.items;
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.product.price, 0);
    const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

    // Thống kê theo danh mục
    const categoriesCount: Record<string, number> = {};
    items.forEach(item => {
      const category = item.product.category || 'Khác';
      categoriesCount[category] = (categoriesCount[category] || 0) + 1;
    });

    // Thống kê theo thương hiệu
    const brandsCount: Record<string, number> = {};
    items.forEach(item => {
      const brand = item.product.brand || 'Khác';
      brandsCount[brand] = (brandsCount[brand] || 0) + 1;
    });

    // Thống kê theo khoảng giá
    const priceRanges = {
      under1M: 0,
      from1Mto5M: 0,
      from5Mto10M: 0,
      over10M: 0
    };

    items.forEach(item => {
      const price = item.product.price;
      if (price < 1000000) {
        priceRanges.under1M++;
      } else if (price < 5000000) {
        priceRanges.from1Mto5M++;
      } else if (price < 10000000) {
        priceRanges.from5Mto10M++;
      } else {
        priceRanges.over10M++;
      }
    });

    return {
      totalItems,
      totalValue,
      averagePrice,
      categoriesCount,
      brandsCount,
      priceRanges
    };
  }

  /**
   * Export wishlist data
   */
  exportData(): string {
    return JSON.stringify(this.wishlistData, null, 2);
  }

  /**
   * Import wishlist data
   */
  importData(data: string): boolean {
    try {
      const importedData = JSON.parse(data) as WishlistData;
      
      // Validate data structure
      if (!importedData.items || !Array.isArray(importedData.items)) {
        throw new Error('Dữ liệu không hợp lệ');
      }

      this.wishlistData = {
        ...importedData,
        totalItems: importedData.items.length,
        lastUpdated: new Date().toISOString()
      };

      this.saveToStorage();
      this.notifyListeners();

      notificationService.success('Đã import danh sách yêu thích thành công');
      return true;
    } catch (error) {
      console.error('Lỗi khi import wishlist:', error);
      notificationService.error('Không thể import danh sách yêu thích');
      return false;
    }
  }

  /**
   * Cleanup khi component unmount
   */
  destroy(): void {
    this.stopSync();
    this.saveToStorage();
    this.listeners.clear();
  }
}

// Export singleton instance
export const wishlistService = new WishlistService();
export default wishlistService;

// Cleanup khi trang được đóng
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    wishlistService.destroy();
  });
}
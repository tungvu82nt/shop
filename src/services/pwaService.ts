/**
 * Service quản lý Progressive Web App (PWA)
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstallable = false;
  private isInstalled = false;
  private installCallbacks: Array<(canInstall: boolean) => void> = [];

  constructor() {
    this.init();
  }

  /**
   * Khởi tạo PWA service
   */
  private init(): void {
    // Kiểm tra xem app đã được cài đặt chưa
    this.checkIfInstalled();

    // Lắng nghe sự kiện beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable = true;
      this.notifyInstallCallbacks(true);
    });

    // Lắng nghe sự kiện appinstalled
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.isInstallable = false;
      this.deferredPrompt = null;
      this.notifyInstallCallbacks(false);
      console.log('PWA đã được cài đặt thành công');
    });

    // Kiểm tra nếu đang chạy trong standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
  }

  /**
   * Kiểm tra xem app có thể cài đặt không
   */
  public canInstall(): boolean {
    return this.isInstallable && !this.isInstalled;
  }

  /**
   * Kiểm tra xem app đã được cài đặt chưa
   */
  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Hiển thị prompt cài đặt PWA
   */
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('Install prompt không khả dụng');
      return false;
    }

    try {
      // Hiển thị install prompt
      await this.deferredPrompt.prompt();
      
      // Chờ người dùng phản hồi
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Người dùng đã chấp nhận cài đặt PWA');
        return true;
      } else {
        console.log('Người dùng đã từ chối cài đặt PWA');
        return false;
      }
    } catch (error) {
      console.error('Lỗi khi hiển thị install prompt:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
      this.isInstallable = false;
      this.notifyInstallCallbacks(false);
    }
  }

  /**
   * Đăng ký callback khi trạng thái install thay đổi
   */
  public onInstallStateChange(callback: (canInstall: boolean) => void): () => void {
    this.installCallbacks.push(callback);
    
    // Gọi callback ngay lập tức với trạng thái hiện tại
    callback(this.canInstall());
    
    // Trả về function để hủy đăng ký
    return () => {
      const index = this.installCallbacks.indexOf(callback);
      if (index > -1) {
        this.installCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Thông báo cho tất cả callbacks về thay đổi trạng thái
   */
  private notifyInstallCallbacks(canInstall: boolean): void {
    this.installCallbacks.forEach(callback => callback(canInstall));
  }

  /**
   * Kiểm tra xem app đã được cài đặt chưa
   */
  private checkIfInstalled(): void {
    // Kiểm tra standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      return;
    }

    // Kiểm tra iOS Safari
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
      return;
    }

    // Kiểm tra Android Chrome
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      this.isInstalled = true;
      return;
    }
  }

  /**
   * Lấy thông tin về khả năng PWA của trình duyệt
   */
  public getBrowserSupport(): {
    serviceWorker: boolean;
    manifest: boolean;
    installPrompt: boolean;
  } {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      manifest: 'manifest' in document.createElement('link'),
      installPrompt: 'BeforeInstallPromptEvent' in window
    };
  }

  /**
   * Đăng ký Service Worker
   */
  public async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker không được hỗ trợ');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker đã được đăng ký:', registration);
      
      // Lắng nghe cập nhật
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Có bản cập nhật mới
              this.notifyUpdate();
            }
          });
        }
      });
      
      return true;
    } catch (error) {
      console.error('Lỗi khi đăng ký Service Worker:', error);
      return false;
    }
  }

  /**
   * Thông báo có bản cập nhật mới
   */
  private notifyUpdate(): void {
    // Có thể hiển thị notification hoặc banner
    console.log('Có bản cập nhật mới cho ứng dụng');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  /**
   * Reload để áp dụng bản cập nhật mới
   */
  public async applyUpdate(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  /**
   * Lấy thông tin về kết nối mạng
   */
  public getNetworkInfo(): {
    online: boolean;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  } {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt
    };
  }

  /**
   * Lắng nghe thay đổi trạng thái mạng
   */
  public onNetworkChange(callback: (networkInfo: { online: boolean; effectiveType?: string; downlink?: number; rtt?: number; }) => void): () => void {
    const handleOnline = () => callback(this.getNetworkInfo());
    const handleOffline = () => callback(this.getNetworkInfo());
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Gọi callback với trạng thái hiện tại
    callback(this.getNetworkInfo());
    
    // Trả về function để hủy đăng ký
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

// Export singleton instance
export const pwaService = new PWAService();
export default pwaService;
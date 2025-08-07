import { toast } from 'sonner';

// Cấu hình thông báo
const NOTIFICATION_CONFIG = {
  duration: {
    success: 3000,
    error: 5000,
    warning: 4000,
    info: 3000,
    loading: 0 // Không tự động đóng
  },
  position: 'top-right' as const,
  richColors: true,
  closeButton: true
};

// Các loại thông báo
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

// Interface cho thông báo
export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

// Interface cho thông báo loading
export interface LoadingNotificationOptions {
  title: string;
  description?: string;
}

// Interface cho thông báo promise
export interface PromiseNotificationOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: Error) => string);
  description?: string;
  duration?: {
    success?: number;
    error?: number;
  };
}

/**
 * Service quản lý thông báo toàn cục
 */
class NotificationService {
  /**
   * Hiển thị thông báo thành công
   */
  success(message: string, options?: NotificationOptions): string {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration ?? NOTIFICATION_CONFIG.duration.success,
      action: options?.action,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose
    });
  }

  /**
   * Hiển thị thông báo lỗi
   */
  error(message: string, options?: NotificationOptions): string {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration ?? NOTIFICATION_CONFIG.duration.error,
      action: options?.action,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose
    });
  }

  /**
   * Hiển thị thông báo cảnh báo
   */
  warning(message: string, options?: NotificationOptions): string {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? NOTIFICATION_CONFIG.duration.warning,
      action: options?.action,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose
    });
  }

  /**
   * Hiển thị thông báo thông tin
   */
  info(message: string, options?: NotificationOptions): string {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration ?? NOTIFICATION_CONFIG.duration.info,
      action: options?.action,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose
    });
  }

  /**
   * Hiển thị thông báo loading
   */
  loading(message: string, options?: LoadingNotificationOptions): string {
    return toast.loading(message, {
      description: options?.description
    });
  }

  /**
   * Hiển thị thông báo cho Promise
   */
  promise<T>(
    promise: Promise<T>,
    options: PromiseNotificationOptions<T>
  ): Promise<T> {
    return toast.promise(promise, {
      loading: options.loading,
      success: (data: T) => {
        if (typeof options.success === 'function') {
          return options.success(data);
        }
        return options.success;
      },
      error: (error: Error) => {
        if (typeof options.error === 'function') {
          return options.error(error);
        }
        return options.error;
      },
      description: options.description,
      duration: {
        success: options.duration?.success ?? NOTIFICATION_CONFIG.duration.success,
        error: options.duration?.error ?? NOTIFICATION_CONFIG.duration.error
      }
    });
  }

  /**
   * Cập nhật thông báo đã tồn tại
   */
  update(
    id: string,
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ): void {
    const config = {
      description: options?.description,
      duration: options?.duration ?? NOTIFICATION_CONFIG.duration[type],
      action: options?.action,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose
    };

    switch (type) {
      case 'success':
        toast.success(message, { ...config, id });
        break;
      case 'error':
        toast.error(message, { ...config, id });
        break;
      case 'warning':
        toast.warning(message, { ...config, id });
        break;
      case 'info':
        toast.info(message, { ...config, id });
        break;
      case 'loading':
        toast.loading(message, { description: config.description, id });
        break;
    }
  }

  /**
   * Đóng thông báo theo ID
   */
  dismiss(id: string): void {
    toast.dismiss(id);
  }

  /**
   * Đóng tất cả thông báo
   */
  dismissAll(): void {
    toast.dismiss();
  }

  /**
   * Thông báo cho các thao tác CRUD
   */
  crud = {
    /**
     * Thông báo tạo mới thành công
     */
    created: (itemName: string) => {
      return this.success(`${itemName} đã được tạo thành công`);
    },

    /**
     * Thông báo cập nhật thành công
     */
    updated: (itemName: string) => {
      return this.success(`${itemName} đã được cập nhật thành công`);
    },

    /**
     * Thông báo xóa thành công
     */
    deleted: (itemName: string) => {
      return this.success(`${itemName} đã được xóa thành công`);
    },

    /**
     * Thông báo lỗi khi tạo mới
     */
    createError: (itemName: string, error?: string) => {
      return this.error(`Không thể tạo ${itemName}`, {
        description: error || 'Vui lòng thử lại sau'
      });
    },

    /**
     * Thông báo lỗi khi cập nhật
     */
    updateError: (itemName: string, error?: string) => {
      return this.error(`Không thể cập nhật ${itemName}`, {
        description: error || 'Vui lòng thử lại sau'
      });
    },

    /**
     * Thông báo lỗi khi xóa
     */
    deleteError: (itemName: string, error?: string) => {
      return this.error(`Không thể xóa ${itemName}`, {
        description: error || 'Vui lòng thử lại sau'
      });
    }
  };

  /**
   * Thông báo cho các thao tác xác thực
   */
  auth = {
    /**
     * Thông báo đăng nhập thành công
     */
    loginSuccess: (username?: string) => {
      return this.success(
        username ? `Chào mừng ${username}!` : 'Đăng nhập thành công'
      );
    },

    /**
     * Thông báo đăng xuất thành công
     */
    logoutSuccess: () => {
      return this.info('Đã đăng xuất thành công');
    },

    /**
     * Thông báo đăng ký thành công
     */
    registerSuccess: () => {
      return this.success('Đăng ký tài khoản thành công');
    },

    /**
     * Thông báo lỗi đăng nhập
     */
    loginError: (error?: string) => {
      return this.error('Đăng nhập thất bại', {
        description: error || 'Vui lòng kiểm tra thông tin đăng nhập'
      });
    },

    /**
     * Thông báo lỗi đăng ký
     */
    registerError: (error?: string) => {
      return this.error('Đăng ký thất bại', {
        description: error || 'Vui lòng thử lại sau'
      });
    },

    /**
     * Thông báo yêu cầu đăng nhập
     */
    loginRequired: () => {
      return this.warning('Vui lòng đăng nhập để tiếp tục');
    },

    /**
     * Thông báo không có quyền truy cập
     */
    accessDenied: () => {
      return this.error('Bạn không có quyền truy cập tính năng này');
    }
  };

  /**
   * Thông báo cho giỏ hàng
   */
  cart = {
    /**
     * Thông báo thêm sản phẩm vào giỏ hàng
     */
    added: (productName: string) => {
      return this.success(`Đã thêm ${productName} vào giỏ hàng`);
    },

    /**
     * Thông báo xóa sản phẩm khỏi giỏ hàng
     */
    removed: (productName: string) => {
      return this.info(`Đã xóa ${productName} khỏi giỏ hàng`);
    },

    /**
     * Thông báo cập nhật số lượng
     */
    updated: (productName: string) => {
      return this.info(`Đã cập nhật số lượng ${productName}`);
    },

    /**
     * Thông báo giỏ hàng trống
     */
    empty: () => {
      return this.warning('Giỏ hàng của bạn đang trống');
    },

    /**
     * Thông báo sản phẩm hết hàng
     */
    outOfStock: (productName: string) => {
      return this.warning(`${productName} hiện đã hết hàng`);
    }
  };

  /**
   * Thông báo cho đơn hàng
   */
  order = {
    /**
     * Thông báo đặt hàng thành công
     */
    placed: (orderId: string) => {
      return this.success('Đặt hàng thành công', {
        description: `Mã đơn hàng: ${orderId}`
      });
    },

    /**
     * Thông báo hủy đơn hàng
     */
    cancelled: (orderId: string) => {
      return this.info('Đơn hàng đã được hủy', {
        description: `Mã đơn hàng: ${orderId}`
      });
    },

    /**
     * Thông báo thanh toán thành công
     */
    paymentSuccess: () => {
      return this.success('Thanh toán thành công');
    },

    /**
     * Thông báo thanh toán thất bại
     */
    paymentFailed: (error?: string) => {
      return this.error('Thanh toán thất bại', {
        description: error || 'Vui lòng thử lại sau'
      });
    }
  };
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;

// Export các helper functions
export const showSuccess = (message: string, options?: NotificationOptions) => 
  notificationService.success(message, options);

export const showError = (message: string, options?: NotificationOptions) => 
  notificationService.error(message, options);

export const showWarning = (message: string, options?: NotificationOptions) => 
  notificationService.warning(message, options);

export const showInfo = (message: string, options?: NotificationOptions) => 
  notificationService.info(message, options);

export const showLoading = (message: string, options?: LoadingNotificationOptions) => 
  notificationService.loading(message, options);

export const showPromise = <T>(
  promise: Promise<T>,
  options: PromiseNotificationOptions<T>
) => notificationService.promise(promise, options);
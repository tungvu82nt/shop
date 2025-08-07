/**
 * Google Analytics 4 Integration
 * Cung cấp tracking cho user behavior, conversions và performance
 */

// Declare gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Analytics Configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const DEBUG_MODE = import.meta.env.DEV;

// Event Types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface EcommerceEvent {
  currency: string;
  value: number;
  items: EcommerceItem[];
  transaction_id?: string;
  coupon?: string;
  shipping?: number;
  tax?: number;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  item_brand?: string;
  item_variant?: string;
  index?: number;
}

export interface UserProperties {
  user_id?: string;
  customer_lifetime_value?: number;
  preferred_language?: string;
  user_type?: 'new' | 'returning';
  membership_level?: string;
}

class AnalyticsService {
  private isInitialized = false;
  private queue: Array<() => void> = [];

  /**
   * Khởi tạo Google Analytics
   */
  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Load gtag script
      await this.loadGtagScript();
      
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Configure GA4
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        debug_mode: DEBUG_MODE,
        send_page_view: false, // Chúng ta sẽ gửi manually
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        cookie_flags: 'SameSite=None;Secure',
        anonymize_ip: true // Tuân thủ GDPR
      });

      this.isInitialized = true;
      
      // Process queued events
      this.queue.forEach(fn => fn());
      this.queue = [];

      if (DEBUG_MODE) {
        console.log('Google Analytics initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Load Google Analytics script
   */
  private loadGtagScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Analytics script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Execute function when analytics is ready
   */
  private whenReady(fn: () => void): void {
    if (this.isInitialized) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  /**
   * Track page view
   */
  trackPageView(page_title: string, page_location?: string): void {
    this.whenReady(() => {
      window.gtag('event', 'page_view', {
        page_title,
        page_location: page_location || window.location.href,
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Page view tracked:', { page_title, page_location });
      }
    });
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    this.whenReady(() => {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        send_to: GA_MEASUREMENT_ID,
        ...event.custom_parameters
      });

      if (DEBUG_MODE) {
        console.log('Event tracked:', event);
      }
    });
  }

  /**
   * Track search event
   */
  trackSearch(search_term: string, results_count?: number): void {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: search_term,
      custom_parameters: {
        search_term,
        results_count
      }
    });
  }

  /**
   * Track product view
   */
  trackProductView(item: EcommerceItem): void {
    this.whenReady(() => {
      window.gtag('event', 'view_item', {
        currency: 'VND',
        value: item.price,
        items: [item],
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Product view tracked:', item);
      }
    });
  }

  /**
   * Track add to cart
   */
  trackAddToCart(item: EcommerceItem): void {
    this.whenReady(() => {
      window.gtag('event', 'add_to_cart', {
        currency: 'VND',
        value: item.price * item.quantity,
        items: [item],
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Add to cart tracked:', item);
      }
    });
  }

  /**
   * Track remove from cart
   */
  trackRemoveFromCart(item: EcommerceItem): void {
    this.whenReady(() => {
      window.gtag('event', 'remove_from_cart', {
        currency: 'VND',
        value: item.price * item.quantity,
        items: [item],
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Remove from cart tracked:', item);
      }
    });
  }

  /**
   * Track begin checkout
   */
  trackBeginCheckout(ecommerce: EcommerceEvent): void {
    this.whenReady(() => {
      window.gtag('event', 'begin_checkout', {
        currency: ecommerce.currency,
        value: ecommerce.value,
        items: ecommerce.items,
        coupon: ecommerce.coupon,
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Begin checkout tracked:', ecommerce);
      }
    });
  }

  /**
   * Track purchase
   */
  trackPurchase(ecommerce: EcommerceEvent): void {
    this.whenReady(() => {
      window.gtag('event', 'purchase', {
        transaction_id: ecommerce.transaction_id,
        currency: ecommerce.currency,
        value: ecommerce.value,
        items: ecommerce.items,
        coupon: ecommerce.coupon,
        shipping: ecommerce.shipping,
        tax: ecommerce.tax,
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Purchase tracked:', ecommerce);
      }
    });
  }

  /**
   * Track user login
   */
  trackLogin(method: string): void {
    this.trackEvent({
      action: 'login',
      category: 'engagement',
      custom_parameters: {
        method
      }
    });
  }

  /**
   * Track user signup
   */
  trackSignUp(method: string): void {
    this.trackEvent({
      action: 'sign_up',
      category: 'engagement',
      custom_parameters: {
        method
      }
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    this.whenReady(() => {
      // Set user ID
      if (properties.user_id) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          user_id: properties.user_id
        });
      }

      // Set custom user properties
      Object.entries(properties).forEach(([key, value]) => {
        if (key !== 'user_id' && value !== undefined) {
          window.gtag('set', { [key]: value });
        }
      });

      if (DEBUG_MODE) {
        console.log('User properties set:', properties);
      }
    });
  }

  /**
   * Track custom conversion
   */
  trackConversion(conversion_label: string, value?: number): void {
    this.trackEvent({
      action: 'conversion',
      category: 'engagement',
      label: conversion_label,
      value,
      custom_parameters: {
        conversion_label
      }
    });
  }

  /**
   * Track timing event (for performance monitoring)
   */
  trackTiming(name: string, value: number, category = 'performance'): void {
    this.whenReady(() => {
      window.gtag('event', 'timing_complete', {
        name,
        value: Math.round(value),
        event_category: category,
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Timing tracked:', { name, value, category });
      }
    });
  }

  /**
   * Track exception/error
   */
  trackException(description: string, fatal = false): void {
    this.whenReady(() => {
      window.gtag('event', 'exception', {
        description,
        fatal,
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Exception tracked:', { description, fatal });
      }
    });
  }

  /**
   * Track ecommerce events (generic)
   */
  trackEcommerce(event_name: string, parameters: any): void {
    this.whenReady(() => {
      window.gtag('event', event_name, {
        ...parameters,
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_MODE) {
        console.log('Ecommerce event tracked:', { event_name, parameters });
      }
    });
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  analytics.initialize();
}

// Export helper functions
export const {
  trackPageView,
  trackEvent,
  trackSearch,
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackLogin,
  trackSignUp,
  setUserProperties,
  trackConversion,
  trackTiming,
  trackException,
  trackEcommerce
} = analytics;

export default analytics;
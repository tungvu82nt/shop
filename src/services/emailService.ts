import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Email Service - Quản lý gửi email và xác thực email
 */
export class EmailService {
  /**
   * Gửi email xác thực đến người dùng
   */
  static async sendVerificationEmail(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      });

      if (error) {
        console.error('Lỗi gửi email xác thực:', error);
        toast.error('Không thể gửi email xác thực. Vui lòng thử lại.');
        return false;
      }

      toast.success('Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư.');
      return true;
    } catch (error) {
      console.error('Lỗi gửi email xác thực:', error);
      toast.error('Có lỗi xảy ra khi gửi email xác thực.');
      return false;
    }
  }

  /**
   * Xác thực email với token
   */
  static async verifyEmail(token: string, email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
        email: email
      });

      if (error) {
        console.error('Lỗi xác thực email:', error);
        toast.error('Token xác thực không hợp lệ hoặc đã hết hạn.');
        return false;
      }

      toast.success('Email đã được xác thực thành công!');
      return true;
    } catch (error) {
      console.error('Lỗi xác thực email:', error);
      toast.error('Có lỗi xảy ra khi xác thực email.');
      return false;
    }
  }

  /**
   * Gửi email reset password
   */
  static async sendPasswordResetEmail(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        console.error('Lỗi gửi email reset password:', error);
        toast.error('Không thể gửi email reset password. Vui lòng thử lại.');
        return false;
      }

      toast.success('Email reset password đã được gửi. Vui lòng kiểm tra hộp thư.');
      return true;
    } catch (error) {
      console.error('Lỗi gửi email reset password:', error);
      toast.error('Có lỗi xảy ra khi gửi email reset password.');
      return false;
    }
  }

  /**
   * Gửi email thông báo đơn hàng
   */
  static async sendOrderConfirmationEmail(
    email: string, 
    orderData: {
      orderId: string;
      customerName: string;
      totalAmount: number;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
    }
  ): Promise<boolean> {
    try {
      // Trong production, sẽ tích hợp với email service như SendGrid, Mailgun
      // Hiện tại chỉ log để demo
      console.log('Gửi email xác nhận đơn hàng:', {
        to: email,
        subject: `Xác nhận đơn hàng #${orderData.orderId}`,
        orderData
      });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Email xác nhận đơn hàng đã được gửi.');
      return true;
    } catch (error) {
      console.error('Lỗi gửi email xác nhận đơn hàng:', error);
      toast.error('Có lỗi xảy ra khi gửi email xác nhận đơn hàng.');
      return false;
    }
  }

  /**
   * Gửi email thông báo trạng thái đơn hàng
   */
  static async sendOrderStatusEmail(
    email: string,
    orderData: {
      orderId: string;
      customerName: string;
      status: string;
      trackingNumber?: string;
    }
  ): Promise<boolean> {
    try {
      // Trong production, sẽ tích hợp với email service
      console.log('Gửi email cập nhật trạng thái đơn hàng:', {
        to: email,
        subject: `Cập nhật đơn hàng #${orderData.orderId}`,
        orderData
      });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Email cập nhật trạng thái đã được gửi.');
      return true;
    } catch (error) {
      console.error('Lỗi gửi email cập nhật trạng thái:', error);
      toast.error('Có lỗi xảy ra khi gửi email cập nhật trạng thái.');
      return false;
    }
  }

  /**
   * Kiểm tra trạng thái email verification của user
   */
  static async checkEmailVerificationStatus(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      return user.email_confirmed_at !== null;
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái email verification:', error);
      return false;
    }
  }
}

/**
 * Email Templates - Các template email chuẩn
 */
export const EmailTemplates = {
  orderConfirmation: (orderData: any) => `
    <h2>Xác nhận đơn hàng #${orderData.orderId}</h2>
    <p>Xin chào ${orderData.customerName},</p>
    <p>Cảm ơn bạn đã đặt hàng tại Yapee Vietnam!</p>
    <h3>Chi tiết đơn hàng:</h3>
    <ul>
      ${orderData.items.map((item: any) => `
        <li>${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price.toLocaleString('vi-VN')}đ</li>
      `).join('')}
    </ul>
    <p><strong>Tổng tiền: ${orderData.totalAmount.toLocaleString('vi-VN')}đ</strong></p>
    <p>Chúng tôi sẽ xử lý đơn hàng và giao hàng trong thời gian sớm nhất.</p>
  `,
  
  orderStatusUpdate: (orderData: any) => `
    <h2>Cập nhật đơn hàng #${orderData.orderId}</h2>
    <p>Xin chào ${orderData.customerName},</p>
    <p>Đơn hàng của bạn đã được cập nhật trạng thái: <strong>${orderData.status}</strong></p>
    ${orderData.trackingNumber ? `<p>Mã vận đơn: <strong>${orderData.trackingNumber}</strong></p>` : ''}
    <p>Cảm ơn bạn đã mua sắm tại Yapee Vietnam!</p>
  `,
  
  welcomeEmail: (userData: any) => `
    <h2>Chào mừng đến với Yapee Vietnam!</h2>
    <p>Xin chào ${userData.fullName},</p>
    <p>Cảm ơn bạn đã đăng ký tài khoản tại Yapee Vietnam.</p>
    <p>Hãy khám phá hàng triệu sản phẩm chất lượng với giá tốt nhất!</p>
    <p>Chúc bạn có những trải nghiệm mua sắm tuyệt vời!</p>
  `
};
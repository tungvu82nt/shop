/**
 * Service xử lý các phương thức thanh toán
 */

export interface PaymentRequest {
  orderId: string;
  amount: number;
  orderInfo: string;
  returnUrl: string;
  cancelUrl: string;
  paymentMethod: 'vnpay' | 'momo' | 'cod' | 'bank_transfer';
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  message: string;
}

export interface PaymentStatus {
  orderId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionId?: string;
  amount: number;
  paymentMethod: string;
  paidAt?: string;
}

/**
 * Service xử lý thanh toán VNPay
 */
class VNPayService {
  private readonly vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private readonly vnpTmnCode = import.meta.env.VITE_VNPAY_TMN_CODE || 'DEMO';
  private readonly vnpHashSecret = import.meta.env.VITE_VNPAY_HASH_SECRET || 'DEMO';

  /**
   * Tạo URL thanh toán VNPay
   */
  async createPaymentUrl(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // LƯU Ý: Trong thực tế, việc tạo URL thanh toán VNPay PHẢI được thực hiện ở backend
      // để bảo mật thông tin nhạy cảm như vnp_HashSecret và tạo chữ ký an toàn
      // Frontend chỉ nên gọi API backend để nhận URL thanh toán đã được tạo sẵn
      
      const vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.vnpTmnCode,
        vnp_Amount: (request.amount * 100).toString(), // VNPay yêu cầu amount * 100
        vnp_CurrCode: 'VND',
        vnp_TxnRef: request.orderId,
        vnp_OrderInfo: request.orderInfo,
        vnp_OrderType: 'other',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: request.returnUrl,
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
      };

      // CẢNH BÁO: Đây chỉ là demo - KHÔNG BAO GIỠ tạo chữ ký ở frontend trong production
      // const signature = this.createSignature(vnpParams); // Phải thực hiện ở backend
      
      // Tạm thời trả về URL demo cho mục đích phát triển
      const paymentUrl = `${this.vnpUrl}?${new URLSearchParams(vnpParams).toString()}`;

      return {
        success: true,
        paymentUrl,
        transactionId: request.orderId,
        message: 'Tạo URL thanh toán thành công'
      };
    } catch (error) {
      console.error('VNPay payment error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tạo URL thanh toán VNPay'
      };
    }
  }

  /**
   * Xác thực kết quả thanh toán từ VNPay
   */
  async verifyPayment(params: URLSearchParams): Promise<PaymentStatus> {
    try {
      // LƯU Ý: Trong thực tế, việc xác thực chữ ký VNPay PHẢI được thực hiện ở backend
      // để bảo mật vnp_HashSecret và đảm bảo tính toàn vẹn của dữ liệu
      // Frontend chỉ nên gọi API backend để xác thực kết quả thanh toán
      
      const vnpResponseCode = params.get('vnp_ResponseCode');
      const vnpTxnRef = params.get('vnp_TxnRef');
      const vnpAmount = params.get('vnp_Amount');
      const vnpTransactionNo = params.get('vnp_TransactionNo');
      const vnpPayDate = params.get('vnp_PayDate');

      // CẢNH BÁO: Đây chỉ là demo - KHÔNG BAO GIỜ xác thực chữ ký ở frontend trong production
      // const isValidSignature = this.verifySignature(params); // Phải thực hiện ở backend
      const isValidSignature = true; // NOTE: Cần triển khai xác thực chữ ký thực tế từ VNPay

      if (!isValidSignature) {
        return {
          orderId: vnpTxnRef || '',
          status: 'failed',
          amount: parseInt(vnpAmount || '0') / 100,
          paymentMethod: 'vnpay'
        };
      }

      const status = vnpResponseCode === '00' ? 'success' : 'failed';

      return {
        orderId: vnpTxnRef || '',
        status,
        transactionId: vnpTransactionNo || undefined,
        amount: parseInt(vnpAmount || '0') / 100,
        paymentMethod: 'vnpay',
        paidAt: vnpPayDate || undefined
      };
    } catch (error) {
      console.error('VNPay verification error:', error);
      throw new Error('Lỗi xác thực thanh toán VNPay');
    }
  }
}

/**
 * Service xử lý thanh toán MoMo
 */
class MoMoService {
  private readonly momoEndpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
  private readonly partnerCode = import.meta.env.VITE_MOMO_PARTNER_CODE || 'DEMO';
  private readonly accessKey = import.meta.env.VITE_MOMO_ACCESS_KEY || 'DEMO';
  private readonly secretKey = import.meta.env.VITE_MOMO_SECRET_KEY || 'DEMO';

  /**
   * Tạo thanh toán MoMo
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // LƯU Ý: Trong thực tế, việc tạo thanh toán MoMo PHẢI được thực hiện ở backend
      // để bảo mật thông tin nhạy cảm như secretKey và tạo chữ ký HMAC SHA256 an toàn
      // Frontend chỉ nên gọi API backend để nhận URL thanh toán đã được tạo sẵn
      
      const requestId = `${request.orderId}_${Date.now()}`;
      const orderId = request.orderId;
      const orderInfo = request.orderInfo;
      const redirectUrl = request.returnUrl;
      const ipnUrl = request.returnUrl; // Trong thực tế sẽ là URL webhook
      const amount = request.amount;
      const extraData = '';
      const requestType = 'payWithATM';
      const autoCapture = true;
      const lang = 'vi';

      // CẢNH BÁO: Đây chỉ là demo - KHÔNG BAO GIỜ tạo chữ ký HMAC ở frontend trong production
      // const signature = crypto.createHmac('sha256', this.secretKey).update(rawSignature).digest('hex'); // Phải thực hiện ở backend
      
      // Tạm thời mô phỏng kết quả cho mục đích phát triển
      const payUrl = `https://test-payment.momo.vn/v2/gateway/pay?t=${requestId}`;

      return {
        success: true,
        paymentUrl: payUrl,
        transactionId: requestId,
        message: 'Tạo thanh toán MoMo thành công'
      };
    } catch (error) {
      console.error('MoMo payment error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tạo thanh toán MoMo'
      };
    }
  }
}

/**
 * Service chính xử lý thanh toán
 */
class PaymentService {
  private vnpayService = new VNPayService();
  private momoService = new MoMoService();

  /**
   * Xử lý thanh toán theo phương thức được chọn
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      switch (request.paymentMethod) {
        case 'vnpay':
          return await this.vnpayService.createPaymentUrl(request);
        
        case 'momo':
          return await this.momoService.createPayment(request);
        
        case 'cod':
          // Cash on Delivery - không cần xử lý thanh toán online
          return {
            success: true,
            message: 'Đơn hàng sẽ được thanh toán khi nhận hàng'
          };
        
        case 'bank_transfer':
          // Chuyển khoản ngân hàng - hiển thị thông tin tài khoản
          return {
            success: true,
            message: 'Vui lòng chuyển khoản theo thông tin được cung cấp'
          };
        
        default:
          throw new Error('Phương thức thanh toán không được hỗ trợ');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý thanh toán'
      };
    }
  }

  /**
   * Xác thực kết quả thanh toán
   */
  async verifyPayment(paymentMethod: string, params: URLSearchParams): Promise<PaymentStatus> {
    switch (paymentMethod) {
      case 'vnpay':
        return await this.vnpayService.verifyPayment(params);
      
      default:
        throw new Error('Phương thức thanh toán không hỗ trợ xác thực');
    }
  }

  /**
   * Lấy trạng thái thanh toán
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      // LƯU Ý: Trong thực tế, cần gọi API backend để lấy trạng thái thanh toán từ database
      // API backend sẽ truy vấn database và trả về thông tin chính xác về trạng thái đơn hàng
      // Ví dụ: GET /api/payments/status/${orderId}
      
      // Tạm thời trả về dữ liệu mẫu cho mục đích phát triển
      return {
        orderId,
        status: 'pending',
        amount: 0,
        paymentMethod: 'unknown'
      };
    } catch (error) {
      console.error('Get payment status error:', error);
      throw new Error('Không thể lấy trạng thái thanh toán');
    }
  }

  /**
   * Xử lý hoàn tiền
   */
  async processRefund(orderId: string, amount: number, reason: string): Promise<PaymentResponse> {
    try {
      // Lấy thông tin đơn hàng để xác định phương thức thanh toán
      const paymentStatus = await this.getPaymentStatus(orderId);
      
      if (paymentStatus.status !== 'success') {
        return {
          success: false,
          message: 'Chỉ có thể hoàn tiền cho đơn hàng đã thanh toán thành công'
        };
      }

      if (amount > paymentStatus.amount) {
        return {
          success: false,
          message: 'Số tiền hoàn không được vượt quá số tiền đã thanh toán'
        };
      }

      switch (paymentStatus.paymentMethod) {
        case 'vnpay':
          return await this.processVNPayRefund(orderId, amount, reason, paymentStatus.transactionId);
        
        case 'momo':
          return await this.processMoMoRefund(orderId, amount, reason, paymentStatus.transactionId);
        
        case 'cod':
          // COD - hoàn tiền bằng tiền mặt
          return {
            success: true,
            message: 'Yêu cầu hoàn tiền COD đã được ghi nhận. Nhân viên sẽ liên hệ để hoàn tiền trong 1-2 ngày làm việc.'
          };
        
        case 'bank_transfer':
          // Chuyển khoản ngân hàng - hoàn tiền qua chuyển khoản
          return {
            success: true,
            message: 'Yêu cầu hoàn tiền đã được ghi nhận. Tiền sẽ được chuyển về tài khoản của bạn trong 3-5 ngày làm việc.'
          };
        
        default:
          return {
            success: false,
            message: 'Phương thức thanh toán không hỗ trợ hoàn tiền tự động'
          };
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xử lý hoàn tiền'
      };
    }
  }

  /**
   * Xử lý hoàn tiền VNPay
   */
  private async processVNPayRefund(orderId: string, amount: number, reason: string, transactionId?: string): Promise<PaymentResponse> {
    try {
      // LƯU Ý: Trong thực tế, việc xử lý hoàn tiền VNPay PHẢI được thực hiện ở backend
      // để bảo mật thông tin nhạy cảm và tạo chữ ký an toàn cho API VNPay
      // VNPay hỗ trợ hoàn tiền một phần hoặc toàn bộ thông qua API refund
      
      const refundData = {
        vnp_RequestId: `${orderId}_refund_${Date.now()}`,
        vnp_Version: '2.1.0',
        vnp_Command: 'refund',
        vnp_TmnCode: import.meta.env.VITE_VNPAY_TMN_CODE || 'DEMO',
        vnp_TransactionType: '02', // Hoàn tiền một phần
        vnp_TxnRef: orderId,
        vnp_Amount: (amount * 100).toString(),
        vnp_OrderInfo: `Hoàn tiền đơn hàng ${orderId}: ${reason}`,
        vnp_TransactionNo: transactionId,
        vnp_TransactionDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        vnp_CreateBy: 'system'
      };

      // CẢNH BÁO: Đây chỉ là demo - Trong production cần gọi API backend
      // Backend sẽ tạo chữ ký và gọi API VNPay refund
      console.log('VNPay refund request (demo):', refundData);
      
      return {
        success: true,
        transactionId: refundData.vnp_RequestId,
        message: 'Yêu cầu hoàn tiền VNPay đã được gửi thành công. Tiền sẽ được hoàn về tài khoản trong 1-3 ngày làm việc.'
      };
    } catch (error) {
      console.error('VNPay refund error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xử lý hoàn tiền VNPay'
      };
    }
  }

  /**
   * Xử lý hoàn tiền MoMo
   */
  private async processMoMoRefund(orderId: string, amount: number, reason: string, transactionId?: string): Promise<PaymentResponse> {
    try {
      // LƯU Ý: Trong thực tế, việc xử lý hoàn tiền MoMo PHẢI được thực hiện ở backend
      // để bảo mật thông tin nhạy cảm và tạo chữ ký HMAC SHA256 an toàn cho API MoMo
      
      const refundData = {
        partnerCode: import.meta.env.VITE_MOMO_PARTNER_CODE || 'DEMO',
        orderId: orderId,
        requestId: `${orderId}_refund_${Date.now()}`,
        amount: amount,
        transId: transactionId,
        lang: 'vi',
        description: `Hoàn tiền đơn hàng ${orderId}: ${reason}`
      };

      // CẢNH BÁO: Đây chỉ là demo - Trong production cần gọi API backend
      // Backend sẽ tạo chữ ký HMAC và gọi API MoMo refund
      console.log('MoMo refund request (demo):', refundData);
      
      return {
        success: true,
        transactionId: refundData.requestId,
        message: 'Yêu cầu hoàn tiền MoMo đã được gửi thành công. Tiền sẽ được hoàn về ví MoMo trong 1-3 ngày làm việc.'
      };
    } catch (error) {
      console.error('MoMo refund error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xử lý hoàn tiền MoMo'
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
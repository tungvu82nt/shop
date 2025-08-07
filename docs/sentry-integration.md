# Tích hợp Sentry Error Monitoring

Tài liệu này hướng dẫn cách cấu hình và sử dụng Sentry để theo dõi lỗi và hiệu suất trong ứng dụng Yapee Vietnam Clone.

## 📋 Tổng quan

Sentry đã được tích hợp vào ứng dụng để:
- **Theo dõi lỗi tự động**: Capture tất cả JavaScript errors, React component errors
- **Performance monitoring**: Theo dõi hiệu suất ứng dụng và API calls
- **Session replay**: Ghi lại phiên làm việc của user khi có lỗi
- **Error context**: Thu thập thông tin chi tiết về lỗi (user info, breadcrumbs, metadata)
- **Real-time alerts**: Thông báo ngay khi có lỗi nghiêm trọng

## 🚀 Cài đặt và Cấu hình

### 1. Tạo tài khoản Sentry

1. Truy cập [sentry.io](https://sentry.io) và tạo tài khoản
2. Tạo project mới:
   - Chọn platform: **React**
   - Đặt tên project: `yapee-vietnam-clone`
   - Chọn team và organization

### 2. Cấu hình biến môi trường

1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Thêm các biến môi trường Sentry vào file `.env`:
   ```env
   # Sentry Configuration
   VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   VITE_APP_VERSION=1.0.0
   
   # Sentry Build Configuration (cho production)
   SENTRY_ORG=your-org-name
   SENTRY_PROJECT=yapee-vietnam-clone
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

### 3. Lấy thông tin cấu hình từ Sentry

#### DSN (Data Source Name)
- Vào **Settings** → **Projects** → **[Your Project]** → **Client Keys (DSN)**
- Copy DSN và paste vào `VITE_SENTRY_DSN`

#### Auth Token (cho production builds)
- Vào **Settings** → **Account** → **API** → **Auth Tokens**
- Tạo token mới với scopes: `project:read`, `project:releases`, `org:read`
- Copy token và paste vào `SENTRY_AUTH_TOKEN`

## 🔧 Cấu trúc tích hợp

### Files đã được tích hợp Sentry:

```
src/
├── lib/
│   └── sentry.ts              # Cấu hình chính Sentry
├── services/
│   └── errorLogger.ts         # Service logging với Sentry
├── components/
│   ├── ErrorBoundary.tsx      # React Error Boundary + Sentry
│   └── SentryTestPage.tsx     # Trang test Sentry (Admin)
├── main.tsx                   # Khởi tạo Sentry
vite.config.ts                 # Sentry Vite plugin
```

### Các tính năng đã tích hợp:

1. **Automatic Error Capture**:
   - JavaScript errors
   - React component errors
   - Unhandled promise rejections
   - Network errors

2. **Custom Error Logging**:
   - Authentication errors
   - Payment processing errors
   - Business logic errors

3. **Performance Monitoring**:
   - Page load times
   - API response times
   - User interactions

4. **Session Replay**:
   - Ghi lại 10% sessions ngẫu nhiên
   - Ghi lại 100% sessions có lỗi

## 🧪 Test tích hợp Sentry

### Sử dụng Sentry Test Page

1. Truy cập trang Admin: `http://localhost:8080/admin`
2. Chuyển sang tab **"Sentry Test"**
3. Test các loại lỗi khác nhau:

#### Các test cases có sẵn:

- **JS Error**: Test lỗi JavaScript thông thường
- **React Error**: Test lỗi trong React component
- **Network Error**: Test lỗi API/Network
- **Auth Error**: Test lỗi authentication
- **Payment Error**: Test lỗi thanh toán
- **Message**: Test capture message
- **Breadcrumbs**: Test breadcrumb tracking
- **User Context**: Test user context tracking

### Kiểm tra kết quả

1. Sau khi click test, kiểm tra:
   - Console browser (development mode)
   - Sentry dashboard: [sentry.io](https://sentry.io)

2. Trong Sentry dashboard, bạn sẽ thấy:
   - **Issues**: Danh sách lỗi được capture
   - **Performance**: Thông tin hiệu suất
   - **Replays**: Video replay của user sessions
   - **Releases**: Thông tin về các version deploy

## 📊 Sử dụng trong Production

### 1. Error Monitoring

```typescript
// Tự động capture lỗi
try {
  // Code có thể gây lỗi
  await riskyOperation();
} catch (error) {
  // Lỗi sẽ được tự động gửi lên Sentry
  throw error;
}

// Hoặc capture thủ công
import { captureError } from '@/lib/sentry';

try {
  await someOperation();
} catch (error) {
  captureError(error, {
    context: 'User checkout process',
    userId: user.id,
    orderId: order.id
  });
}
```

### 2. Custom Error Logging

```typescript
import { errorLogger } from '@/services/errorLogger';

// Log lỗi authentication
errorLogger.logAuthError(error, {
  userId: 'user123',
  action: 'login',
  provider: 'google'
});

// Log lỗi payment
errorLogger.logPaymentError(error, {
  orderId: 'ORDER-123',
  amount: 500000,
  paymentMethod: 'vnpay',
  currency: 'VND'
});

// Log lỗi network
errorLogger.logNetworkError(error, {
  url: '/api/products',
  method: 'GET',
  status: 500,
  headers: { 'Content-Type': 'application/json' }
});
```

### 3. User Context Tracking

```typescript
import { setUserContext } from '@/lib/sentry';

// Set user context khi user login
setUserContext({
  id: user.id,
  email: user.email,
  username: user.username
});
```

### 4. Breadcrumbs

```typescript
import { addBreadcrumb } from '@/lib/sentry';

// Thêm breadcrumb cho user actions
addBreadcrumb('User clicked checkout button', 'user', 'info');
addBreadcrumb('Payment method selected: VNPay', 'user', 'info');
addBreadcrumb('Order submitted successfully', 'user', 'info');
```

## 🔍 Monitoring và Alerts

### 1. Cấu hình Alerts

Trong Sentry dashboard:
1. Vào **Alerts** → **Create Alert Rule**
2. Thiết lập điều kiện:
   - **Error rate** > 5% trong 5 phút
   - **New issue** được tạo
   - **Performance degradation** > 2s response time

### 2. Integration với Slack/Email

1. Vào **Settings** → **Integrations**
2. Cấu hình Slack hoặc Email notifications
3. Thiết lập routing rules cho từng loại lỗi

### 3. Dashboard và Reports

- **Issues Dashboard**: Theo dõi lỗi theo thời gian
- **Performance Dashboard**: Theo dõi hiệu suất ứng dụng
- **Release Dashboard**: So sánh lỗi giữa các version
- **User Feedback**: Thu thập feedback từ user khi có lỗi

## 🛠️ Troubleshooting

### Lỗi thường gặp:

1. **"DSN not configured"**:
   - Kiểm tra biến `VITE_SENTRY_DSN` trong file `.env`
   - Đảm bảo DSN đúng format

2. **"Sentry not initialized"**:
   - Kiểm tra `initSentry()` được gọi trong `main.tsx`
   - Kiểm tra import đúng từ `@/lib/sentry`

3. **"Source maps not uploaded"**:
   - Kiểm tra `SENTRY_AUTH_TOKEN` trong production build
   - Đảm bảo `sentryVitePlugin` được cấu hình trong `vite.config.ts`

4. **"Too many events"**:
   - Sentry có giới hạn events/tháng
   - Cấu hình `sampleRate` để giảm số lượng events
   - Sử dụng `beforeSend` để filter events không cần thiết

### Debug mode:

```typescript
// Trong development, enable debug mode
if (import.meta.env.DEV) {
  Sentry.init({
    debug: true,
    // ... other options
  });
}
```

## 📈 Best Practices

### 1. Error Categorization
- Sử dụng tags để phân loại lỗi: `category`, `severity`, `component`
- Thiết lập custom fingerprints cho lỗi tương tự

### 2. Performance Monitoring
- Monitor các API calls quan trọng
- Thiết lập performance budgets
- Theo dõi Core Web Vitals

### 3. Privacy và Security
- Không log sensitive data (passwords, tokens)
- Sử dụng `beforeSend` để scrub sensitive information
- Cấu hình data retention policies

### 4. Release Management
- Tag mỗi deployment với version number
- Sử dụng Sentry releases để track regressions
- Setup automated deployment notifications

## 🔗 Tài liệu tham khảo

- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Error Monitoring](https://docs.sentry.io/product/issues/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)

---

**Lưu ý**: Tài liệu này sẽ được cập nhật khi có thêm tính năng mới hoặc thay đổi trong cấu hình Sentry.
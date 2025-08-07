# Playwright E2E Testing Guide

## 📋 Tổng quan

Dự án này sử dụng [Playwright](https://playwright.dev/) để thực hiện End-to-End (E2E) testing. Playwright cho phép test trên nhiều trình duyệt khác nhau (Chromium, Firefox, Safari) và hỗ trợ testing trên cả desktop và mobile.

## 🚀 Cài đặt và Thiết lập

### Cài đặt Dependencies
```bash
npm install -D @playwright/test
npx playwright install
```

### Cấu trình
File cấu hình chính: `playwright.config.ts`

## 📁 Cấu trúc Test

```
tests/
├── e2e/
│   ├── homepage.spec.ts     # Test trang chủ
│   ├── auth.spec.ts         # Test authentication
│   ├── cart.spec.ts         # Test shopping cart
│   └── ...
└── README.md
```

## 🧪 Chạy Tests

### Chạy tất cả tests
```bash
npm run test:e2e
```

### Chạy với UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Chạy với headed mode (hiển thị trình duyệt)
```bash
npm run test:e2e:headed
```

### Debug mode
```bash
npm run test:e2e:debug
```

### Xem báo cáo test
```bash
npm run test:e2e:report
```

### Chạy test cụ thể
```bash
# Chạy một file test
npx playwright test homepage.spec.ts

# Chạy một test case cụ thể
npx playwright test --grep "should load homepage successfully"

# Chạy trên trình duyệt cụ thể
npx playwright test --project=chromium
```

## 🎯 Test Cases Hiện tại

### 1. Homepage Tests (`homepage.spec.ts`)
- ✅ Load trang chủ thành công
- ✅ Hiển thị hero section
- ✅ Hiển thị product grid
- ✅ Chức năng tìm kiếm
- ✅ Responsive trên mobile
- ✅ Footer links hoạt động

### 2. Authentication Tests (`auth.spec.ts`)
- ✅ Điều hướng đến trang login
- ✅ Validation errors cho form trống
- ✅ Điều hướng đến trang register
- ✅ Password strength indicator
- ✅ Xử lý thông tin đăng nhập sai
- ✅ Toggle hiển thị password

### 3. Shopping Cart Tests (`cart.spec.ts`)
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Xem trang giỏ hàng
- ✅ Cập nhật số lượng sản phẩm
- ✅ Xóa sản phẩm khỏi giỏ
- ✅ Tính tổng tiền chính xác
- ✅ Chuyển đến checkout
- ✅ Lưu trữ giỏ hàng sau refresh

## 🔧 Cấu hình Test

### Browsers được test
- ✅ Desktop Chrome
- ✅ Desktop Firefox
- ✅ Desktop Safari
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Test Settings
- **Base URL**: `http://localhost:8080`
- **Timeout**: 30 seconds
- **Retries**: 2 lần trên CI, 0 lần local
- **Screenshots**: Chỉ khi test fail
- **Videos**: Chỉ khi test fail
- **Traces**: Khi retry test

## 📝 Viết Test Mới

### Template cơ bản
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Điều hướng đến trang
    await page.goto('/path');
    
    // Tương tác với elements
    await page.click('button');
    await page.fill('input', 'value');
    
    // Assertions
    await expect(page.locator('selector')).toBeVisible();
    await expect(page).toHaveURL(/expected-url/);
  });
});
```

### Best Practices

1. **Sử dụng data-testid**: Thêm `data-testid` vào các elements quan trọng
```html
<button data-testid="add-to-cart">Thêm vào giỏ</button>
```

2. **Wait strategies**: Sử dụng `waitFor` thay vì `waitForTimeout`
```typescript
// ❌ Tránh
await page.waitForTimeout(1000);

// ✅ Tốt hơn
await page.waitForSelector('[data-testid="product-list"]');
await expect(page.locator('[data-testid="product-list"]')).toBeVisible();
```

3. **Locator strategies**: Ưu tiên theo thứ tự
```typescript
// 1. data-testid (tốt nhất)
page.locator('[data-testid="login-button"]')

// 2. Semantic selectors
page.locator('button:has-text("Đăng nhập")')

// 3. CSS selectors (cuối cùng)
page.locator('.login-btn')
```

4. **Page Object Model**: Cho các trang phức tạp
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }
}
```

## 🐛 Debug Tests

### 1. Sử dụng Playwright Inspector
```bash
npm run test:e2e:debug
```

### 2. Xem traces
```bash
npm run test:e2e:report
```

### 3. Screenshots và videos
Tự động được tạo khi test fail trong thư mục `test-results/`

### 4. Console logs
```typescript
test('debug test', async ({ page }) => {
  page.on('console', msg => console.log(msg.text()));
  await page.goto('/');
});
```

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps
  
- name: Run Playwright tests
  run: npm run test:e2e
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 📊 Test Reports

Playwright tự động tạo HTML report với:
- ✅ Test results summary
- 📸 Screenshots khi fail
- 🎥 Video recordings
- 📊 Trace viewer
- 📈 Performance metrics

## 🔗 Tài liệu tham khảo

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Selectors Guide](https://playwright.dev/docs/selectors)
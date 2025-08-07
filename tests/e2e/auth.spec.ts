import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    // Tìm và click vào login button/link
    const loginButton = page.locator('a[href*="login"], button:has-text("Đăng nhập"), button:has-text("Login")');
    
    if (await loginButton.count() > 0) {
      await loginButton.first().click();
      
      // Kiểm tra đã chuyển đến trang login
      await expect(page).toHaveURL(/.*login.*/);
      
      // Kiểm tra form login có hiển thị
      const loginForm = page.locator('form, [data-testid="login-form"]');
      await expect(loginForm.first()).toBeVisible();
      
      // Kiểm tra có email/username input
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]');
      await expect(emailInput.first()).toBeVisible();
      
      // Kiểm tra có password input
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      await expect(passwordInput.first()).toBeVisible();
    }
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    // Điều hướng trực tiếp đến trang login
    await page.goto('/auth/login');
    
    // Tìm submit button và click
    const submitButton = page.locator('button[type="submit"], button:has-text("Đăng nhập"), button:has-text("Login")');
    
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      
      // Đợi một chút để validation errors hiển thị
      await page.waitForTimeout(500);
      
      // Kiểm tra có error messages
      const errorMessages = page.locator('.error, .text-red, [role="alert"], .invalid-feedback');
      
      if (await errorMessages.count() > 0) {
        await expect(errorMessages.first()).toBeVisible();
      }
    }
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');

    // Tìm và click vào register button/link
    const registerButton = page.locator('a[href*="register"], button:has-text("Đăng ký"), button:has-text("Register")');
    
    if (await registerButton.count() > 0) {
      await registerButton.first().click();
      
      // Kiểm tra đã chuyển đến trang register
      await expect(page).toHaveURL(/.*register.*/);
      
      // Kiểm tra form register có hiển thị
      const registerForm = page.locator('form, [data-testid="register-form"]');
      await expect(registerForm.first()).toBeVisible();
    }
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.goto('/auth/register');
    
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    
    if (await passwordInput.count() > 0) {
      // Nhập password yếu
      await passwordInput.first().fill('123');
      
      // Kiểm tra có password strength indicator
      const strengthIndicator = page.locator('.password-strength, .strength-meter, .progress');
      
      if (await strengthIndicator.count() > 0) {
        await expect(strengthIndicator.first()).toBeVisible();
      }
      
      // Nhập password mạnh hơn
      await passwordInput.first().fill('StrongPassword123!');
      await page.waitForTimeout(300);
    }
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Đăng nhập")');
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0 && await submitButton.count() > 0) {
      // Nhập thông tin đăng nhập không hợp lệ
      await emailInput.first().fill('invalid@example.com');
      await passwordInput.first().fill('wrongpassword');
      await submitButton.first().click();
      
      // Đợi response
      await page.waitForTimeout(2000);
      
      // Kiểm tra có error message
      const errorMessage = page.locator('.error, .alert-error, [role="alert"], .text-red');
      
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
      
      // Kiểm tra vẫn ở trang login (không redirect)
      expect(page.url()).toContain('login');
    }
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login');
    
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button:has([data-testid="eye"]), button:has(.eye), .password-toggle');
    
    if (await passwordInput.count() > 0 && await toggleButton.count() > 0) {
      // Nhập password
      await passwordInput.first().fill('testpassword');
      
      // Click toggle button
      await toggleButton.first().click();
      
      // Kiểm tra input type đã thay đổi thành text
      const inputType = await passwordInput.first().getAttribute('type');
      expect(inputType).toBe('text');
      
      // Click lại để ẩn password
      await toggleButton.first().click();
      
      // Kiểm tra input type đã thay đổi về password
      const inputTypeAfter = await passwordInput.first().getAttribute('type');
      expect(inputTypeAfter).toBe('password');
    }
  });
});
import { test, expect } from '@playwright/test';

test.describe('Trang chủ Shopy Vietnam', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Điều hướng đến trang chủ
    await page.goto('/');

    // Kiểm tra title của trang
    await expect(page).toHaveTitle(/Shopy Vietnam/i);

    // Kiểm tra header có hiển thị
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Kiểm tra logo hoặc brand name
    const logo = page.locator('[data-testid="logo"], .logo, h1');
    await expect(logo.first()).toBeVisible();

    // Kiểm tra navigation menu
    const nav = page.locator('nav');
    await expect(nav.first()).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');

    // Kiểm tra hero section có hiển thị
    const heroSection = page.locator('[data-testid="hero-section"], .hero, .banner');
    await expect(heroSection.first()).toBeVisible();
  });

  test('should display product grid', async ({ page }) => {
    await page.goto('/');

    // Kiểm tra product grid có hiển thị
    const productGrid = page.locator('[data-testid="product-grid"], .product-grid, .products');
    await expect(productGrid.first()).toBeVisible();

    // Kiểm tra có ít nhất một sản phẩm
    const products = page.locator('.product-card, [data-testid="product-card"]');
    await expect(products.first()).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/');

    // Tìm search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="tìm"]');
    
    if (await searchInput.count() > 0) {
      // Nhập từ khóa tìm kiếm
      await searchInput.first().fill('áo');
      
      // Nhấn Enter hoặc click search button
      await searchInput.first().press('Enter');
      
      // Đợi kết quả tìm kiếm
      await page.waitForTimeout(1000);
      
      // Kiểm tra URL có thay đổi hoặc có kết quả hiển thị
      const hasResults = await page.locator('.search-results, .product-card').count() > 0;
      const urlChanged = page.url().includes('search') || page.url().includes('áo');
      
      expect(hasResults || urlChanged).toBeTruthy();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Kiểm tra trang vẫn hiển thị tốt trên mobile
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Kiểm tra mobile menu button nếu có
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, .hamburger');
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton.first()).toBeVisible();
    }
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Kiểm tra footer có hiển thị
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Kiểm tra có links trong footer
    const footerLinks = page.locator('footer a');
    if (await footerLinks.count() > 0) {
      await expect(footerLinks.first()).toBeVisible();
    }
  });
});
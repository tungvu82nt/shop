import { test, expect } from '@playwright/test';

test.describe('Playwright Demo', () => {
  test('should visit Google and search', async ({ page }) => {
    // Truy cập Google
    await page.goto('https://www.google.com');
    
    // Kiểm tra title
    await expect(page).toHaveTitle(/Google/);
    
    // Tìm ô search và nhập từ khóa
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await searchBox.fill('Playwright testing');
    
    // Nhấn Enter để tìm kiếm
    await searchBox.press('Enter');
    
    // Đợi kết quả tìm kiếm xuất hiện
    await page.waitForSelector('#search');
    
    // Kiểm tra có kết quả tìm kiếm
    const results = page.locator('#search');
    await expect(results).toBeVisible();
    
    console.log('✅ Playwright demo test passed!');
  });
  
  test('should check Playwright official website', async ({ page }) => {
    // Truy cập trang chủ Playwright
    await page.goto('https://playwright.dev');
    
    // Kiểm tra title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Kiểm tra heading chính
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Kiểm tra có nút "Get started"
    const getStartedBtn = page.locator('text=Get started');
    await expect(getStartedBtn).toBeVisible();
    
    console.log('✅ Playwright website test passed!');
  });
});
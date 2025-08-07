import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('should add product to cart from product list', async ({ page }) => {
    await page.goto('/');

    // Tìm sản phẩm đầu tiên và click "Add to Cart"
    const addToCartButton = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("Add to Cart"), [data-testid="add-to-cart"]');
    
    if (await addToCartButton.count() > 0) {
      // Lấy tên sản phẩm trước khi thêm vào giỏ
      const productCard = addToCartButton.first().locator('..');
      const productName = await productCard.locator('h3, .product-name, .title').first().textContent();
      
      await addToCartButton.first().click();
      
      // Đợi animation hoặc notification
      await page.waitForTimeout(1000);
      
      // Kiểm tra có notification thành công
      const successNotification = page.locator('.toast, .notification, .alert-success, [role="alert"]');
      if (await successNotification.count() > 0) {
        await expect(successNotification.first()).toBeVisible();
      }
      
      // Kiểm tra cart icon có update số lượng
      const cartBadge = page.locator('.cart-badge, .badge, [data-testid="cart-count"]');
      if (await cartBadge.count() > 0) {
        await expect(cartBadge.first()).toBeVisible();
        const badgeText = await cartBadge.first().textContent();
        expect(parseInt(badgeText || '0')).toBeGreaterThan(0);
      }
    }
  });

  test('should view cart page', async ({ page }) => {
    await page.goto('/');
    
    // Click vào cart icon hoặc cart link
    const cartLink = page.locator('a[href*="cart"], [data-testid="cart-link"], .cart-icon');
    
    if (await cartLink.count() > 0) {
      await cartLink.first().click();
      
      // Kiểm tra đã chuyển đến trang cart
      await expect(page).toHaveURL(/.*cart.*/);
      
      // Kiểm tra có cart container
      const cartContainer = page.locator('.cart, [data-testid="cart"], .shopping-cart');
      await expect(cartContainer.first()).toBeVisible();
    }
  });

  test('should update product quantity in cart', async ({ page }) => {
    // Giả sử đã có sản phẩm trong cart
    await page.goto('/cart');
    
    const quantityInput = page.locator('input[type="number"], .quantity-input');
    const increaseButton = page.locator('button:has-text("+"), .quantity-increase, [data-testid="increase-qty"]');
    const decreaseButton = page.locator('button:has-text("-"), .quantity-decrease, [data-testid="decrease-qty"]');
    
    if (await quantityInput.count() > 0) {
      // Lấy giá trị hiện tại
      const currentQty = await quantityInput.first().inputValue();
      const currentQtyNum = parseInt(currentQty);
      
      // Tăng số lượng
      if (await increaseButton.count() > 0) {
        await increaseButton.first().click();
        await page.waitForTimeout(500);
        
        // Kiểm tra số lượng đã tăng
        const newQty = await quantityInput.first().inputValue();
        expect(parseInt(newQty)).toBe(currentQtyNum + 1);
      }
      
      // Giảm số lượng
      if (await decreaseButton.count() > 0 && currentQtyNum > 1) {
        await decreaseButton.first().click();
        await page.waitForTimeout(500);
        
        // Kiểm tra số lượng đã giảm
        const finalQty = await quantityInput.first().inputValue();
        expect(parseInt(finalQty)).toBe(currentQtyNum);
      }
    }
  });

  test('should remove product from cart', async ({ page }) => {
    await page.goto('/cart');
    
    const removeButton = page.locator('button:has-text("Xóa"), button:has-text("Remove"), .remove-item, [data-testid="remove-item"]');
    
    if (await removeButton.count() > 0) {
      // Đếm số sản phẩm trước khi xóa
      const cartItems = page.locator('.cart-item, .product-item');
      const initialCount = await cartItems.count();
      
      // Click remove
      await removeButton.first().click();
      
      // Xác nhận xóa nếu có dialog
      const confirmButton = page.locator('button:has-text("Xác nhận"), button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.count() > 0) {
        await confirmButton.first().click();
      }
      
      await page.waitForTimeout(1000);
      
      // Kiểm tra số lượng sản phẩm đã giảm
      const finalCount = await cartItems.count();
      expect(finalCount).toBeLessThan(initialCount);
    }
  });

  test('should calculate total price correctly', async ({ page }) => {
    await page.goto('/cart');
    
    const cartItems = page.locator('.cart-item, .product-item');
    const totalElement = page.locator('.total, .cart-total, [data-testid="cart-total"]');
    
    if (await cartItems.count() > 0 && await totalElement.count() > 0) {
      // Lấy giá và số lượng của từng sản phẩm
      let calculatedTotal = 0;
      
      for (let i = 0; i < await cartItems.count(); i++) {
        const item = cartItems.nth(i);
        const priceElement = item.locator('.price, .product-price');
        const quantityElement = item.locator('input[type="number"], .quantity');
        
        if (await priceElement.count() > 0 && await quantityElement.count() > 0) {
          const priceText = await priceElement.first().textContent();
          const quantityText = await quantityElement.first().inputValue();
          
          // Extract số từ text (loại bỏ ký tự tiền tệ)
          const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');
          const quantity = parseInt(quantityText || '1');
          
          calculatedTotal += price * quantity;
        }
      }
      
      // So sánh với total hiển thị
      const displayedTotalText = await totalElement.first().textContent();
      const displayedTotal = parseFloat(displayedTotalText?.replace(/[^0-9.]/g, '') || '0');
      
      // Cho phép sai số nhỏ do làm tròn
      expect(Math.abs(calculatedTotal - displayedTotal)).toBeLessThan(1);
    }
  });

  test('should proceed to checkout', async ({ page }) => {
    await page.goto('/cart');
    
    const checkoutButton = page.locator('button:has-text("Thanh toán"), button:has-text("Checkout"), a[href*="checkout"]');
    
    if (await checkoutButton.count() > 0) {
      await checkoutButton.first().click();
      
      // Kiểm tra đã chuyển đến trang checkout hoặc login
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      
      expect(currentUrl.includes('checkout') || currentUrl.includes('login')).toBeTruthy();
    }
  });

  test('should persist cart items after page refresh', async ({ page }) => {
    await page.goto('/');
    
    // Thêm sản phẩm vào cart
    const addToCartButton = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("Add to Cart")');
    
    if (await addToCartButton.count() > 0) {
      await addToCartButton.first().click();
      await page.waitForTimeout(1000);
      
      // Refresh trang
      await page.reload();
      await page.waitForTimeout(1000);
      
      // Kiểm tra cart badge vẫn hiển thị số lượng
      const cartBadge = page.locator('.cart-badge, .badge, [data-testid="cart-count"]');
      if (await cartBadge.count() > 0) {
        const badgeText = await cartBadge.first().textContent();
        expect(parseInt(badgeText || '0')).toBeGreaterThan(0);
      }
    }
  });
});
-- =============================================
-- YAPEE VIETNAM CLONE - ROW LEVEL SECURITY POLICIES
-- Bảo mật dữ liệu theo từng người dùng và vai trò
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users có thể xem profile của chính họ
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users có thể cập nhật profile của chính họ
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admin có thể xem tất cả users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Admin có thể cập nhật tất cả users
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- CATEGORIES TABLE POLICIES
-- =============================================

-- Tất cả có thể xem categories
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Chỉ admin có thể thêm/sửa/xóa categories
CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- PRODUCTS TABLE POLICIES
-- =============================================

-- Tất cả có thể xem products đã được approve
CREATE POLICY "Anyone can view approved products" ON products
  FOR SELECT USING (is_approved = true);

-- Seller có thể xem products của chính họ
CREATE POLICY "Sellers can view own products" ON products
  FOR SELECT USING (seller_id = auth.uid());

-- Seller có thể thêm products
CREATE POLICY "Sellers can insert products" ON products
  FOR INSERT WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

-- Seller có thể cập nhật products của chính họ
CREATE POLICY "Sellers can update own products" ON products
  FOR UPDATE USING (seller_id = auth.uid());

-- Admin có thể xem và quản lý tất cả products
CREATE POLICY "Admins can manage all products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- PRODUCT_VARIANTS TABLE POLICIES
-- =============================================

-- Tất cả có thể xem variants của products đã approve
CREATE POLICY "Anyone can view variants of approved products" ON product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = product_variants.product_id AND is_approved = true
    )
  );

-- Seller có thể quản lý variants của products họ sở hữu
CREATE POLICY "Sellers can manage own product variants" ON product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = product_variants.product_id AND seller_id = auth.uid()
    )
  );

-- Admin có thể quản lý tất cả variants
CREATE POLICY "Admins can manage all variants" ON product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- CART TABLE POLICIES
-- =============================================

-- Users chỉ có thể xem và quản lý cart của chính họ
CREATE POLICY "Users can manage own cart" ON cart
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- ORDERS TABLE POLICIES
-- =============================================

-- Users có thể xem orders của chính họ
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- Users có thể tạo orders cho chính họ
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users có thể cập nhật một số thông tin orders của họ
CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (
    user_id = auth.uid() AND 
    status IN ('pending', 'confirmed')
  );

-- Seller có thể xem orders chứa products của họ
CREATE POLICY "Sellers can view orders with their products" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = orders.id AND p.seller_id = auth.uid()
    )
  );

-- Admin có thể xem và quản lý tất cả orders
CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- ORDER_ITEMS TABLE POLICIES
-- =============================================

-- Users có thể xem order items của orders họ sở hữu
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

-- Seller có thể xem order items của products họ sở hữu
CREATE POLICY "Sellers can view order items of their products" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = order_items.product_id AND seller_id = auth.uid()
    )
  );

-- Admin có thể xem tất cả order items
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- REVIEWS TABLE POLICIES
-- =============================================

-- Tất cả có thể xem reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Users có thể thêm reviews cho products họ đã mua
CREATE POLICY "Users can add reviews for purchased products" ON reviews
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = auth.uid() 
        AND oi.product_id = reviews.product_id
        AND o.status = 'delivered'
    )
  );

-- Users có thể cập nhật reviews của chính họ
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (user_id = auth.uid());

-- Users có thể xóa reviews của chính họ
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (user_id = auth.uid());

-- Admin có thể quản lý tất cả reviews
CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- ADDRESSES TABLE POLICIES
-- =============================================

-- Users chỉ có thể quản lý addresses của chính họ
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- COUPONS TABLE POLICIES
-- =============================================

-- Tất cả có thể xem coupons đang active
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (
    is_active = true AND 
    valid_from <= NOW() AND 
    valid_until >= NOW()
  );

-- Admin có thể quản lý tất cả coupons
CREATE POLICY "Admins can manage all coupons" ON coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- USER_COUPONS TABLE POLICIES
-- =============================================

-- Users chỉ có thể xem và sử dụng coupons của chính họ
CREATE POLICY "Users can manage own coupons" ON user_coupons
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- NOTIFICATIONS TABLE POLICIES
-- =============================================

-- Users chỉ có thể xem notifications của chính họ
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Users có thể cập nhật trạng thái đã đọc notifications của họ
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Admin có thể tạo notifications cho tất cả users
CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- WISHLISTS TABLE POLICIES
-- =============================================

-- Users chỉ có thể quản lý wishlist của chính họ
CREATE POLICY "Users can manage own wishlist" ON wishlists
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- PRODUCT_VIEWS TABLE POLICIES
-- =============================================

-- Users có thể thêm product views
CREATE POLICY "Users can add product views" ON product_views
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users có thể xem lịch sử xem của chính họ
CREATE POLICY "Users can view own product views" ON product_views
  FOR SELECT USING (user_id = auth.uid());

-- Admin có thể xem tất cả product views cho analytics
CREATE POLICY "Admins can view all product views" ON product_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- SEARCH_HISTORY TABLE POLICIES
-- =============================================

-- Users chỉ có thể quản lý search history của chính họ
CREATE POLICY "Users can manage own search history" ON search_history
  FOR ALL USING (user_id = auth.uid());

-- Admin có thể xem search history cho analytics
CREATE POLICY "Admins can view search history" ON search_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- FUNCTIONS FOR RLS HELPER
-- =============================================

-- Function để check user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Function để check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function để check if user is seller
CREATE OR REPLACE FUNCTION auth.is_seller()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role IN ('seller', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;
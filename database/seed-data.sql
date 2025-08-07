-- =============================================
-- YAPEE VIETNAM CLONE - SEED DATA
-- Dữ liệu mẫu cho development và testing
-- =============================================

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active) VALUES
('cat_1', 'Thời trang', 'thoi-trang', 'Quần áo, giày dép, phụ kiện thời trang', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8', NULL, true),
('cat_2', 'Điện tử', 'dien-tu', 'Điện thoại, laptop, thiết bị điện tử', 'https://images.unsplash.com/photo-1498049794561-7780e7231661', NULL, true),
('cat_3', 'Gia dụng', 'gia-dung', 'Đồ gia dụng, nội thất, trang trí', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', NULL, true),
('cat_4', 'Sách', 'sach', 'Sách văn học, giáo khoa, truyện tranh', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', NULL, true),
('cat_5', 'Thể thao', 'the-thao', 'Dụng cụ thể thao, quần áo thể thao', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', NULL, true);

-- Insert subcategories
INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active) VALUES
('cat_1_1', 'Quần áo nam', 'quan-ao-nam', 'Thời trang dành cho nam giới', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e', 'cat_1', true),
('cat_1_2', 'Quần áo nữ', 'quan-ao-nu', 'Thời trang dành cho nữ giới', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', 'cat_1', true),
('cat_1_3', 'Giày dép', 'giay-dep', 'Giày thể thao, giày cao gót, dép', 'https://images.unsplash.com/photo-1549298916-b41d501d3772', 'cat_1', true),
('cat_2_1', 'Điện thoại', 'dien-thoai', 'Smartphone, điện thoại di động', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 'cat_2', true),
('cat_2_2', 'Laptop', 'laptop', 'Máy tính xách tay, ultrabook', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 'cat_2', true);

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (id, email, password_hash, full_name, phone, role, status, avatar_url, email_verified, created_at) VALUES
('user_admin', 'admin@yapee.vn', '$2b$10$rOzJqZxQZ9V8W8qGqGqGqOqGqGqGqGqGqGqGqGqGqGqGqGqGqGqGq', 'Quản trị viên', '0901234567', 'admin', 'active', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', true, NOW()),
('user_seller1', 'seller1@yapee.vn', '$2b$10$rOzJqZxQZ9V8W8qGqGqGqOqGqGqGqGqGqGqGqGqGqGqGqGqGqGqGq', 'Nguyễn Văn Seller', '0901234568', 'seller', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', true, NOW()),
('user_seller2', 'seller2@yapee.vn', '$2b$10$rOzJqZxQZ9V8W8qGqGqGqOqGqGqGqGqGqGqGqGqGqGqGqGqGqGqGq', 'Trần Thị Shop', '0901234569', 'seller', 'active', 'https://images.unsplash.com/photo-1494790108755-2616b612b786', true, NOW()),
('user_customer1', 'customer1@gmail.com', '$2b$10$rOzJqZxQZ9V8W8qGqGqGqOqGqGqGqGqGqGqGqGqGqGqGqGqGqGqGq', 'Lê Văn Khách', '0901234570', 'customer', 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', true, NOW()),
('user_customer2', 'customer2@gmail.com', '$2b$10$rOzJqZxQZ9V8W8qGqGqGqOqGqGqGqGqGqGqGqGqGqGqGqGqGqGqGq', 'Phạm Thị Mua', '0901234571', 'customer', 'active', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', true, NOW());

-- Insert sample products
INSERT INTO products (id, name, slug, description, price, compare_price, cost_price, sku, stock_quantity, category_id, seller_id, images, is_active, is_approved, weight, dimensions, tags, seo_title, seo_description, created_at) VALUES
('prod_1', 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch', 29990000, 32990000, 25000000, 'IP15PM256', 50, 'cat_2_1', 'user_seller1', 
 ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'], 
 true, true, 221, '{"length": 159.9, "width": 76.7, "height": 8.25}', ARRAY['iphone', 'apple', 'smartphone'], 
 'iPhone 15 Pro Max 256GB - Giá tốt nhất', 'Mua iPhone 15 Pro Max 256GB chính hãng, giá tốt, bảo hành 12 tháng', NOW()),

('prod_2', 'MacBook Air M2 13 inch', 'macbook-air-m2-13-inch', 'MacBook Air với chip M2, màn hình Liquid Retina 13.6 inch, pin 18 giờ', 27990000, 29990000, 24000000, 'MBAM213', 30, 'cat_2_2', 'user_seller1',
 ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'],
 true, true, 1240, '{"length": 304, "width": 215, "height": 11.3}', ARRAY['macbook', 'apple', 'laptop'],
 'MacBook Air M2 13 inch - Siêu mỏng nhẹ', 'MacBook Air M2 13 inch chính hãng, thiết kế siêu mỏng nhẹ, hiệu năng mạnh mẽ', NOW()),

('prod_3', 'Áo thun nam basic', 'ao-thun-nam-basic', 'Áo thun nam chất liệu cotton 100%, form regular fit, nhiều màu sắc', 199000, 299000, 120000, 'ATNB001', 100, 'cat_1_1', 'user_seller2',
 ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e'],
 true, true, 200, '{"length": 70, "width": 50, "height": 1}', ARRAY['áo thun', 'nam', 'basic'],
 'Áo thun nam basic cotton 100%', 'Áo thun nam chất lượng cao, cotton 100%, form đẹp, giá tốt', NOW()),

('prod_4', 'Giày sneaker nam', 'giay-sneaker-nam', 'Giày sneaker nam phong cách thể thao, đế cao su chống trượt, thoáng khí', 899000, 1200000, 600000, 'GSN001', 75, 'cat_1_3', 'user_seller2',
 ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a'],
 true, true, 800, '{"length": 30, "width": 12, "height": 10}', ARRAY['giày', 'sneaker', 'nam'],
 'Giày sneaker nam thể thao', 'Giày sneaker nam chất lượng cao, thiết kế thể thao, thoải mái khi di chuyển', NOW()),

('prod_5', 'Sách "Đắc Nhân Tâm"', 'sach-dac-nhan-tam', 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie', 89000, 120000, 60000, 'SDNT001', 200, 'cat_4', 'user_seller1',
 ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
 true, true, 300, '{"length": 20, "width": 14, "height": 2}', ARRAY['sách', 'kỹ năng', 'giao tiếp'],
 'Sách Đắc Nhân Tâm - Dale Carnegie', 'Đắc Nhân Tâm - Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử', NOW());

-- Insert product variants
INSERT INTO product_variants (id, product_id, name, sku, price, compare_price, stock_quantity, attributes, is_active) VALUES
('var_1_1', 'prod_1', 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên', 'IP15PM256TN', 29990000, 32990000, 20, '{"color": "Titan Tự Nhiên", "storage": "256GB"}', true),
('var_1_2', 'prod_1', 'iPhone 15 Pro Max 256GB - Titan Xanh', 'IP15PM256TX', 29990000, 32990000, 15, '{"color": "Titan Xanh", "storage": "256GB"}', true),
('var_1_3', 'prod_1', 'iPhone 15 Pro Max 256GB - Titan Trắng', 'IP15PM256TT', 29990000, 32990000, 15, '{"color": "Titan Trắng", "storage": "256GB"}', true),

('var_2_1', 'prod_2', 'MacBook Air M2 13" - Bạc', 'MBAM213S', 27990000, 29990000, 15, '{"color": "Bạc", "ram": "8GB", "storage": "256GB"}', true),
('var_2_2', 'prod_2', 'MacBook Air M2 13" - Xám', 'MBAM213G', 27990000, 29990000, 15, '{"color": "Xám", "ram": "8GB", "storage": "256GB"}', true),

('var_3_1', 'prod_3', 'Áo thun nam basic - Trắng - Size M', 'ATNB001WM', 199000, 299000, 25, '{"color": "Trắng", "size": "M"}', true),
('var_3_2', 'prod_3', 'Áo thun nam basic - Đen - Size M', 'ATNB001BM', 199000, 299000, 25, '{"color": "Đen", "size": "M"}', true),
('var_3_3', 'prod_3', 'Áo thun nam basic - Trắng - Size L', 'ATNB001WL', 199000, 299000, 25, '{"color": "Trắng", "size": "L"}', true),
('var_3_4', 'prod_3', 'Áo thun nam basic - Đen - Size L', 'ATNB001BL', 199000, 299000, 25, '{"color": "Đen", "size": "L"}', true),

('var_4_1', 'prod_4', 'Giày sneaker nam - Trắng - Size 42', 'GSN001W42', 899000, 1200000, 20, '{"color": "Trắng", "size": "42"}', true),
('var_4_2', 'prod_4', 'Giày sneaker nam - Đen - Size 42', 'GSN001B42', 899000, 1200000, 15, '{"color": "Đen", "size": "42"}', true),
('var_4_3', 'prod_4', 'Giày sneaker nam - Trắng - Size 43', 'GSN001W43', 899000, 1200000, 20, '{"color": "Trắng", "size": "43"}', true),
('var_4_4', 'prod_4', 'Giày sneaker nam - Đen - Size 43', 'GSN001B43', 899000, 1200000, 20, '{"color": "Đen", "size": "43"}', true);

-- Insert sample addresses
INSERT INTO addresses (id, user_id, full_name, phone, address_line_1, address_line_2, city, district, ward, postal_code, is_default, created_at) VALUES
('addr_1', 'user_customer1', 'Lê Văn Khách', '0901234570', '123 Nguyễn Huệ', 'Phường Bến Nghé', 'Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', '700000', true, NOW()),
('addr_2', 'user_customer1', 'Lê Văn Khách', '0901234570', '456 Lê Lợi', 'Phường Bến Thành', 'Hồ Chí Minh', 'Quận 1', 'Phường Bến Thành', '700000', false, NOW()),
('addr_3', 'user_customer2', 'Phạm Thị Mua', '0901234571', '789 Trần Hưng Đạo', 'Phường Cầu Kho', 'Hồ Chí Minh', 'Quận 1', 'Phường Cầu Kho', '700000', true, NOW());

-- Insert sample coupons
INSERT INTO coupons (id, code, name, description, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, used_count, valid_from, valid_until, is_active, created_at) VALUES
('coup_1', 'WELCOME10', 'Chào mừng thành viên mới', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10, 200000, 100000, 1000, 0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', true, NOW()),
('coup_2', 'FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí ship cho đơn từ 500k', 'fixed', 30000, 500000, 30000, 500, 0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '15 days', true, NOW()),
('coup_3', 'SALE20', 'Giảm giá 20%', 'Giảm 20% tối đa 200k', 'percentage', 20, 1000000, 200000, 100, 0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days', true, NOW());

-- Insert sample orders
INSERT INTO orders (id, user_id, order_number, status, payment_status, payment_method, subtotal, shipping_fee, tax_amount, discount_amount, total_amount, shipping_address, billing_address, notes, created_at) VALUES
('order_1', 'user_customer1', 'ORD-2024-001', 'delivered', 'paid', 'credit_card', 30189000, 30000, 0, 300000, 29919000, 
 '{"full_name": "Lê Văn Khách", "phone": "0901234570", "address_line_1": "123 Nguyễn Huệ", "city": "Hồ Chí Minh", "district": "Quận 1", "ward": "Phường Bến Nghé"}',
 '{"full_name": "Lê Văn Khách", "phone": "0901234570", "address_line_1": "123 Nguyễn Huệ", "city": "Hồ Chí Minh", "district": "Quận 1", "ward": "Phường Bến Nghé"}',
 'Giao hàng giờ hành chính', NOW() - INTERVAL '7 days'),

('order_2', 'user_customer2', 'ORD-2024-002', 'shipped', 'paid', 'bank_transfer', 1098000, 30000, 0, 0, 1128000,
 '{"full_name": "Phạm Thị Mua", "phone": "0901234571", "address_line_1": "789 Trần Hưng Đạo", "city": "Hồ Chí Minh", "district": "Quận 1", "ward": "Phường Cầu Kho"}',
 '{"full_name": "Phạm Thị Mua", "phone": "0901234571", "address_line_1": "789 Trần Hưng Đạo", "city": "Hồ Chí Minh", "district": "Quận 1", "ward": "Phường Cầu Kho"}',
 NULL, NOW() - INTERVAL '2 days'),

('order_3', 'user_customer1', 'ORD-2024-003', 'confirmed', 'pending', 'cod', 398000, 30000, 0, 30000, 398000,
 '{"full_name": "Lê Văn Khách", "phone": "0901234570", "address_line_1": "456 Lê Lợi", "city": "Hồ Chí Minh", "district": "Quận 1", "ward": "Phường Bến Thành"}',
 '{"full_name": "Lê Văn Khách", "phone": "0901234570", "address_line_1": "456 Lê Lợi", "city": "Hồ Chí Minh", "district": "Quận 1", "ward": "Phường Bến Thành"}',
 'Thanh toán khi nhận hàng', NOW() - INTERVAL '1 day');

-- Insert order items
INSERT INTO order_items (id, order_id, product_id, variant_id, quantity, unit_price, total_price, created_at) VALUES
('oi_1', 'order_1', 'prod_1', 'var_1_1', 1, 29990000, 29990000, NOW() - INTERVAL '7 days'),
('oi_2', 'order_1', 'prod_3', 'var_3_1', 1, 199000, 199000, NOW() - INTERVAL '7 days'),

('oi_3', 'order_2', 'prod_4', 'var_4_1', 1, 899000, 899000, NOW() - INTERVAL '2 days'),
('oi_4', 'order_2', 'prod_3', 'var_3_2', 1, 199000, 199000, NOW() - INTERVAL '2 days'),

('oi_5', 'order_3', 'prod_3', 'var_3_3', 2, 199000, 398000, NOW() - INTERVAL '1 day');

-- Insert sample reviews
INSERT INTO reviews (id, product_id, user_id, rating, title, content, images, is_verified_purchase, created_at) VALUES
('rev_1', 'prod_1', 'user_customer1', 5, 'iPhone tuyệt vời!', 'Máy chạy mượt, camera đẹp, pin trâu. Rất hài lòng với sản phẩm này.', 
 ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab'], true, NOW() - INTERVAL '5 days'),

('rev_2', 'prod_3', 'user_customer1', 4, 'Áo đẹp, chất lượng tốt', 'Áo mặc thoải mái, chất cotton mềm mại. Giá cả hợp lý.', 
 ARRAY[], true, NOW() - INTERVAL '5 days'),

('rev_3', 'prod_4', 'user_customer2', 5, 'Giày đẹp, đi êm chân', 'Giày thiết kế đẹp, đi rất thoải mái. Sẽ mua thêm màu khác.', 
 ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772'], true, NOW() - INTERVAL '1 day'),

('rev_4', 'prod_3', 'user_customer2', 4, 'Chất lượng ổn', 'Áo đẹp, form vừa vặn. Giao hàng nhanh.', 
 ARRAY[], true, NOW() - INTERVAL '1 day');

-- Insert sample cart items
INSERT INTO cart (id, user_id, product_id, variant_id, quantity, created_at) VALUES
('cart_1', 'user_customer1', 'prod_2', 'var_2_1', 1, NOW()),
('cart_2', 'user_customer1', 'prod_5', NULL, 2, NOW()),
('cart_3', 'user_customer2', 'prod_3', 'var_3_4', 1, NOW()),
('cart_4', 'user_customer2', 'prod_4', 'var_4_3', 1, NOW());

-- Insert sample wishlists
INSERT INTO wishlists (id, user_id, product_id, created_at) VALUES
('wish_1', 'user_customer1', 'prod_4', NOW() - INTERVAL '3 days'),
('wish_2', 'user_customer1', 'prod_5', NOW() - INTERVAL '2 days'),
('wish_3', 'user_customer2', 'prod_1', NOW() - INTERVAL '1 day'),
('wish_4', 'user_customer2', 'prod_2', NOW());

-- Insert sample user coupons
INSERT INTO user_coupons (id, user_id, coupon_id, is_used, used_at, created_at) VALUES
('uc_1', 'user_customer1', 'coup_1', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '10 days'),
('uc_2', 'user_customer1', 'coup_2', false, NULL, NOW() - INTERVAL '5 days'),
('uc_3', 'user_customer2', 'coup_1', false, NULL, NOW() - INTERVAL '3 days'),
('uc_4', 'user_customer2', 'coup_2', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 days');

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_url, created_at) VALUES
('notif_1', 'user_customer1', 'Đơn hàng đã được giao', 'Đơn hàng ORD-2024-001 đã được giao thành công', 'order', true, '/orders/order_1', NOW() - INTERVAL '5 days'),
('notif_2', 'user_customer1', 'Mã giảm giá mới', 'Bạn có mã giảm giá FREESHIP mới', 'promotion', false, '/coupons', NOW() - INTERVAL '3 days'),
('notif_3', 'user_customer2', 'Đơn hàng đang vận chuyển', 'Đơn hàng ORD-2024-002 đang được vận chuyển', 'order', false, '/orders/order_2', NOW() - INTERVAL '1 day'),
('notif_4', 'user_customer2', 'Sản phẩm yêu thích giảm giá', 'iPhone 15 Pro Max trong wishlist của bạn đang giảm giá', 'product', false, '/products/prod_1', NOW());

-- Insert sample product views for analytics
INSERT INTO product_views (id, user_id, product_id, session_id, ip_address, user_agent, created_at) VALUES
('pv_1', 'user_customer1', 'prod_1', 'sess_1', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NOW() - INTERVAL '10 days'),
('pv_2', 'user_customer1', 'prod_2', 'sess_1', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NOW() - INTERVAL '9 days'),
('pv_3', 'user_customer2', 'prod_1', 'sess_2', '192.168.1.2', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '8 days'),
('pv_4', 'user_customer2', 'prod_3', 'sess_2', '192.168.1.2', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '7 days'),
('pv_5', NULL, 'prod_1', 'sess_3', '192.168.1.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', NOW() - INTERVAL '6 days'),
('pv_6', NULL, 'prod_4', 'sess_4', '192.168.1.4', 'Mozilla/5.0 (Android 13; Mobile)', NOW() - INTERVAL '5 days');

-- Insert sample search history
INSERT INTO search_history (id, user_id, query, results_count, session_id, created_at) VALUES
('sh_1', 'user_customer1', 'iphone 15', 1, 'sess_1', NOW() - INTERVAL '10 days'),
('sh_2', 'user_customer1', 'macbook air', 1, 'sess_1', NOW() - INTERVAL '9 days'),
('sh_3', 'user_customer2', 'áo thun nam', 1, 'sess_2', NOW() - INTERVAL '8 days'),
('sh_4', 'user_customer2', 'giày sneaker', 1, 'sess_2', NOW() - INTERVAL '7 days'),
('sh_5', NULL, 'điện thoại samsung', 0, 'sess_3', NOW() - INTERVAL '6 days'),
('sh_6', NULL, 'laptop gaming', 0, 'sess_4', NOW() - INTERVAL '5 days');

-- Update sequences to avoid conflicts
SELECT setval('categories_id_seq', 100);
SELECT setval('products_id_seq', 100);
SELECT setval('product_variants_id_seq', 100);
SELECT setval('orders_id_seq', 100);
SELECT setval('order_items_id_seq', 100);
SELECT setval('reviews_id_seq', 100);
SELECT setval('addresses_id_seq', 100);
SELECT setval('coupons_id_seq', 100);
SELECT setval('user_coupons_id_seq', 100);
SELECT setval('notifications_id_seq', 100);
SELECT setval('cart_id_seq', 100);
SELECT setval('wishlists_id_seq', 100);
SELECT setval('product_views_id_seq', 100);
SELECT setval('search_history_id_seq', 100);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_approved ON products(is_approved);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views(created_at);

CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);
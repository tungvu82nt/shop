-- =============================================
-- YAPEE VIETNAM CLONE - DATABASE SCHEMA
-- Giai đoạn 1: Core Database Design
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- ENUMS (Các loại dữ liệu enum)
-- =============================================

-- User roles (Vai trò người dùng)
CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin', 'moderator');

-- User status (Trạng thái người dùng)
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- Order status (Trạng thái đơn hàng)
CREATE TYPE order_status AS ENUM (
  'pending',           -- Chờ xử lý
  'confirmed',         -- Đã xác nhận
  'processing',        -- Đang xử lý
  'shipped',           -- Đã giao vận
  'delivered',         -- Đã giao hàng
  'cancelled',         -- Đã hủy
  'returned',          -- Đã trả hàng
  'refunded'           -- Đã hoàn tiền
);

-- Payment status (Trạng thái thanh toán)
CREATE TYPE payment_status AS ENUM (
  'pending',           -- Chờ thanh toán
  'processing',        -- Đang xử lý
  'completed',         -- Hoàn thành
  'failed',            -- Thất bại
  'cancelled',         -- Đã hủy
  'refunded'           -- Đã hoàn tiền
);

-- Payment methods (Phương thức thanh toán)
CREATE TYPE payment_method AS ENUM (
  'vnpay',             -- VNPay
  'momo',              -- MoMo
  'banking',           -- Chuyển khoản ngân hàng
  'cod',               -- Thanh toán khi nhận hàng
  'credit_card',       -- Thẻ tín dụng
  'wallet'             -- Ví điện tử
);

-- Product status (Trạng thái sản phẩm)
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'out_of_stock', 'discontinued');

-- Shipping status (Trạng thái vận chuyển)
CREATE TYPE shipping_status AS ENUM (
  'pending',           -- Chờ xử lý
  'picked_up',         -- Đã lấy hàng
  'in_transit',        -- Đang vận chuyển
  'out_for_delivery',  -- Đang giao hàng
  'delivered',         -- Đã giao
  'failed_delivery',   -- Giao hàng thất bại
  'returned_to_sender' -- Trả về người gửi
);

-- =============================================
-- CORE TABLES (Bảng chính)
-- =============================================

-- Users table (Bảng người dùng)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(10),
  role user_role DEFAULT 'customer',
  status user_status DEFAULT 'pending_verification',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User addresses (Địa chỉ người dùng)
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  ward VARCHAR(100) NOT NULL,        -- Phường/Xã
  district VARCHAR(100) NOT NULL,    -- Quận/Huyện
  province VARCHAR(100) NOT NULL,    -- Tỉnh/Thành phố
  postal_code VARCHAR(10),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories (Danh mục sản phẩm)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands (Thương hiệu)
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sellers (Người bán)
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100), -- 'individual', 'company', 'enterprise'
  tax_code VARCHAR(50),
  business_license VARCHAR(255),
  business_address TEXT,
  business_phone VARCHAR(20),
  business_email VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_name VARCHAR(255),
  bank_branch VARCHAR(255),
  commission_rate DECIMAL(5,2) DEFAULT 5.00, -- Tỷ lệ hoa hồng (%)
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB, -- Lưu trữ thông tin tài liệu xác minh
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_sales DECIMAL(15,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products (Sản phẩm)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  compare_price DECIMAL(15,2), -- Giá so sánh (giá gốc)
  cost_price DECIMAL(15,2),    -- Giá vốn
  weight DECIMAL(8,2),         -- Trọng lượng (kg)
  dimensions JSONB,            -- Kích thước {length, width, height}
  status product_status DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  is_digital BOOLEAN DEFAULT FALSE,
  requires_shipping BOOLEAN DEFAULT TRUE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  search_keywords TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants (Biến thể sản phẩm)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  compare_price DECIMAL(15,2),
  cost_price DECIMAL(15,2),
  weight DECIMAL(8,2),
  inventory_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  attributes JSONB, -- Thuộc tính như màu sắc, kích thước, etc.
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images (Hình ảnh sản phẩm)
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory (Tồn kho)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0, -- Số lượng đã đặt hàng nhưng chưa thanh toán
  low_stock_threshold INTEGER DEFAULT 10,
  warehouse_location VARCHAR(255),
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT inventory_product_variant_check CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL) OR
    (product_id IS NULL AND variant_id IS NOT NULL)
  )
);

-- Shopping carts (Giỏ hàng)
CREATE TABLE shopping_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- Cho guest users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT cart_user_session_check CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Cart items (Sản phẩm trong giỏ hàng)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES shopping_carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(15,2) NOT NULL, -- Giá tại thời điểm thêm vào giỏ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT cart_item_product_variant_check CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL) OR
    (product_id IS NULL AND variant_id IS NOT NULL)
  )
);

-- =============================================
-- INDEXES (Chỉ mục)
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User addresses indexes
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_default ON user_addresses(user_id, is_default);

-- Categories indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Brands indexes
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_active ON brands(is_active);

-- Sellers indexes
CREATE INDEX idx_sellers_user_id ON sellers(user_id);
CREATE INDEX idx_sellers_verified ON sellers(is_verified);
CREATE INDEX idx_sellers_rating ON sellers(rating);

-- Products indexes
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Product variants indexes
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_active ON product_variants(is_active);

-- Product images indexes
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_variant_id ON product_images(variant_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary);

-- Inventory indexes
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_variant_id ON inventory(variant_id);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);

-- Shopping carts indexes
CREATE INDEX idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX idx_shopping_carts_session_id ON shopping_carts(session_id);

-- Cart items indexes
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_cart_items_variant_id ON cart_items(variant_id);

-- =============================================
-- TRIGGERS (Triggers tự động)
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_carts_updated_at BEFORE UPDATE ON shopping_carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (sẽ được mở rộng trong các giai đoạn tiếp theo)
-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- User addresses policies
CREATE POLICY "Users can manage own addresses" ON user_addresses FOR ALL USING (auth.uid() = user_id);

-- Shopping carts policies
CREATE POLICY "Users can manage own cart" ON shopping_carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM shopping_carts WHERE id = cart_id AND user_id = auth.uid())
);

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Product variants are publicly readable" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Product images are publicly readable" ON product_images FOR SELECT USING (true);

-- Categories and brands are publicly readable
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Brands are publicly readable" ON brands FOR SELECT USING (is_active = true);

-- =============================================
-- SAMPLE DATA (Dữ liệu mẫu)
-- =============================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Điện thoại & Phụ kiện', 'dien-thoai-phu-kien', 'Điện thoại thông minh và phụ kiện', true),
('Laptop & Máy tính', 'laptop-may-tinh', 'Laptop, PC và linh kiện máy tính', true),
('Thời trang Nam', 'thoi-trang-nam', 'Quần áo, giày dép thời trang nam', true),
('Thời trang Nữ', 'thoi-trang-nu', 'Quần áo, giày dép thời trang nữ', true),
('Gia dụng & Đời sống', 'gia-dung-doi-song', 'Đồ gia dụng và nhu yếu phẩm hàng ngày', true),
('Sách & Văn phòng phẩm', 'sach-van-phong-pham', 'Sách, truyện và đồ dùng văn phòng', true);

-- Insert sample brands
INSERT INTO brands (name, slug, description, is_active) VALUES
('Apple', 'apple', 'Thương hiệu công nghệ hàng đầu thế giới', true),
('Samsung', 'samsung', 'Tập đoàn điện tử đa quốc gia Hàn Quốc', true),
('Nike', 'nike', 'Thương hiệu thể thao nổi tiếng', true),
('Adidas', 'adidas', 'Thương hiệu thể thao Đức', true),
('Uniqlo', 'uniqlo', 'Thương hiệu thời trang Nhật Bản', true);

COMMIT;
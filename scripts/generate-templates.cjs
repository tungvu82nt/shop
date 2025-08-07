#!/usr/bin/env node

/**
 * SHOPY VIETNAM - Template Generator Script
 * Tự động tạo các file template cần thiết cho dự án
 */

const fs = require('fs');
const path = require('path');

// Màu sắc cho console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}${colors.bright}\n🚀 ${msg}${colors.reset}`)
};

// Template cho Database RLS Policies
const rlsPoliciesTemplate = `-- SHOPY VIETNAM - Row Level Security Policies
-- Tạo các chính sách bảo mật cấp hàng cho database

-- Enable RLS cho tất cả tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
-- Người dùng chỉ có thể xem và cập nhật thông tin của chính họ
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin có thể xem tất cả users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PRODUCTS TABLE POLICIES
-- Tất cả có thể xem products (public read)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Chỉ admin có thể thêm/sửa/xóa products
CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ORDERS TABLE POLICIES
-- Người dùng chỉ có thể xem orders của chính họ
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (user_id = auth.uid());

-- Admin có thể xem tất cả orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ORDER_ITEMS TABLE POLICIES
-- Người dùng chỉ có thể xem order_items của orders thuộc về họ
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin có thể xem tất cả order_items
CREATE POLICY "Admins can manage all order items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CART_ITEMS TABLE POLICIES
-- Người dùng chỉ có thể quản lý cart của chính họ
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (user_id = auth.uid());

-- REVIEWS TABLE POLICIES
-- Tất cả có thể xem reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Người dùng chỉ có thể tạo/sửa/xóa reviews của chính họ
CREATE POLICY "Users can manage own reviews" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (user_id = auth.uid());

-- Admin có thể quản lý tất cả reviews
CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ADDRESSES TABLE POLICIES
-- Người dùng chỉ có thể quản lý addresses của chính họ
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (user_id = auth.uid());

-- Admin có thể xem tất cả addresses
CREATE POLICY "Admins can view all addresses" ON addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
`;

// Template cho Database Functions
const functionsTemplate = `-- SHOPY VIETNAM - Database Functions
-- Các hàm và trigger cần thiết cho database

-- Function để tự động cập nhật updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo triggers cho tất cả tables có updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function để quản lý inventory khi có order mới
CREATE OR REPLACE FUNCTION handle_order_inventory()
RETURNS TRIGGER AS $$
BEGIN
    -- Giảm stock khi order được confirmed
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE products 
        SET stock = stock - (
            SELECT SUM(quantity) 
            FROM order_items 
            WHERE order_id = NEW.id AND product_id = products.id
        )
        WHERE id IN (
            SELECT product_id 
            FROM order_items 
            WHERE order_id = NEW.id
        );
    END IF;
    
    -- Hoàn lại stock khi order bị cancelled
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE products 
        SET stock = stock + (
            SELECT SUM(quantity) 
            FROM order_items 
            WHERE order_id = NEW.id AND product_id = products.id
        )
        WHERE id IN (
            SELECT product_id 
            FROM order_items 
            WHERE order_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger cho inventory management
CREATE TRIGGER handle_order_inventory_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION handle_order_inventory();

-- Function để validate order status transitions
CREATE OR REPLACE FUNCTION validate_order_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Kiểm tra các transition hợp lệ
    IF OLD.status = 'cancelled' OR OLD.status = 'delivered' THEN
        RAISE EXCEPTION 'Cannot change status from % to %', OLD.status, NEW.status;
    END IF;
    
    -- Kiểm tra stock trước khi confirm order
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        IF EXISTS (
            SELECT 1 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = NEW.id AND p.stock < oi.quantity
        ) THEN
            RAISE EXCEPTION 'Insufficient stock for some products in order';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger cho order status validation
CREATE TRIGGER validate_order_status_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION validate_order_status();

-- Function để tính tổng giá trị order
CREATE OR REPLACE FUNCTION calculate_order_total(order_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_amount DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(oi.quantity * oi.price), 0)
    INTO total_amount
    FROM order_items oi
    WHERE oi.order_id = order_id_param;
    
    RETURN total_amount;
END;
$$ language 'plpgsql';

-- Function để cập nhật order total khi order_items thay đổi
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders 
    SET total_amount = calculate_order_total(
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.order_id
            ELSE NEW.order_id
        END
    )
    WHERE id = (
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.order_id
            ELSE NEW.order_id
        END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers cho order total calculation
CREATE TRIGGER update_order_total_on_insert
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_update
    AFTER UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_delete
    AFTER DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

-- Function để tạo order number tự động
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'SV' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || 
                       LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo sequence cho order number
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger cho order number generation
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();
`;

// Template cho Database Indexes
const indexesTemplate = `-- SHOPY VIETNAM - Database Indexes
-- Tối ưu hóa performance cho các query thường dùng

-- USERS TABLE INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- PRODUCTS TABLE INDEXES
-- Index cho search functionality
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_name_trigram ON products USING gin(name gin_trgm_ops);

-- Index cho filtering và sorting
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(average_rating);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Composite indexes cho common queries
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products(category_id, price);
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(is_active, category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_stock ON products(is_active, stock) WHERE stock > 0;

-- ORDERS TABLE INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Composite indexes cho admin dashboard
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at);

-- ORDER_ITEMS TABLE INDEXES
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_product ON order_items(order_id, product_id);

-- CART_ITEMS TABLE INDEXES
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON cart_items(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at);

-- REVIEWS TABLE INDEXES
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_product_rating ON reviews(product_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_product_created ON reviews(product_id, created_at);

-- ADDRESSES TABLE INDEXES
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON addresses(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_addresses_user_default ON addresses(user_id, is_default);

-- CATEGORIES TABLE INDEXES (nếu có)
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Enable pg_trgm extension cho fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable unaccent extension cho Vietnamese search
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Function để search products với Vietnamese support
CREATE OR REPLACE FUNCTION search_products_vietnamese(search_term TEXT)
RETURNS TABLE(
    id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    image_url TEXT,
    average_rating DECIMAL,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.average_rating,
        ts_rank(
            to_tsvector('english', unaccent(p.name || ' ' || COALESCE(p.description, ''))),
            plainto_tsquery('english', unaccent(search_term))
        ) as rank
    FROM products p
    WHERE 
        p.is_active = true
        AND (
            to_tsvector('english', unaccent(p.name || ' ' || COALESCE(p.description, ''))) 
            @@ plainto_tsquery('english', unaccent(search_term))
            OR
            similarity(unaccent(p.name), unaccent(search_term)) > 0.3
        )
    ORDER BY rank DESC, p.average_rating DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Index cho Vietnamese search function
CREATE INDEX IF NOT EXISTS idx_products_vietnamese_search 
ON products USING gin(to_tsvector('english', unaccent(name || ' ' || COALESCE(description, ''))));
`;

// Template cho Email Verification Component
const emailVerificationTemplate = `import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';

interface EmailVerificationProps {
  email?: string;
  onVerificationComplete?: () => void;
}

export function EmailVerification({ email, onVerificationComplete }: EmailVerificationProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  // Tự động verify nếu có token trong URL
  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'email') {
      handleTokenVerification(token);
    }
  }, [searchParams]);

  // Xử lý verification với token
  const handleTokenVerification = async (token: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });
      
      if (error) throw error;
      
      setVerificationStatus('success');
      setMessage('Email đã được xác thực thành công!');
      
      // Gọi callback nếu có
      if (onVerificationComplete) {
        onVerificationComplete();
      }
      
      // Redirect sau 2 giây
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error: any) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      setError(error.message || 'Có lỗi xảy ra khi xác thực email');
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi lại email xác thực
  const handleResendVerification = async () => {
    if (!email) {
      setError('Không tìm thấy địa chỉ email');
      return;
    }
    
    setIsResending(true);
    setError('');
    setMessage('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      setMessage('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
      
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setError(error.message || 'Có lỗi xảy ra khi gửi lại email xác thực');
    } finally {
      setIsResending(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Đang xác thực email...</p>
      </div>
    );
  }

  // Render success state
  if (verificationStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <CheckCircle className="h-16 w-16 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Xác thực thành công!</h2>
        <p className="text-gray-600 text-center max-w-md">
          Email của bạn đã được xác thực thành công. Bạn sẽ được chuyển hướng trong giây lát...
        </p>
      </div>
    );
  }

  // Render error state
  if (verificationStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <XCircle className="h-16 w-16 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">Xác thực thất bại</h2>
        <p className="text-gray-600 text-center max-w-md">
          Không thể xác thực email của bạn. Link có thể đã hết hạn hoặc không hợp lệ.
        </p>
        {email && (
          <Button 
            onClick={handleResendVerification}
            disabled={isResending}
            className="mt-4"
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang gửi...
              </>
            ) : (
              'Gửi lại email xác thực'
            )}
          </Button>
        )}
      </div>
    );
  }

  // Render pending state (chờ user check email)
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Kiểm tra email của bạn
          </h2>
          <p className="text-gray-600">
            Chúng tôi đã gửi link xác thực đến email:
          </p>
          {email && (
            <p className="font-medium text-gray-900">{email}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và nhấp vào link xác thực.
          </p>
          
          {email && (
            <Button 
              variant="outline" 
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                'Gửi lại email xác thực'
              )}
            </Button>
          )}
        </div>
        
        {/* Hiển thị thông báo */}
        {message && (
          <Alert variant="success">
            {message}
          </Alert>
        )}
        
        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}
        
        <div className="text-sm text-gray-500">
          <p>
            Đã xác thực email?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
`;

// Danh sách tất cả templates
const templates = {
  'database/rls-policies.sql': rlsPoliciesTemplate,
  'database/functions.sql': functionsTemplate,
  'database/indexes.sql': indexesTemplate,
  'src/components/auth/EmailVerification.tsx': emailVerificationTemplate
};

// Function để tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.info(`Đã tạo thư mục: ${dir}`);
  }
}

// Function để tạo một file template
function createTemplate(relativePath, content) {
  const fullPath = path.join(process.cwd(), relativePath);
  
  // Kiểm tra file đã tồn tại chưa
  if (fs.existsSync(fullPath)) {
    log.warning(`File đã tồn tại: ${relativePath}`);
    return false;
  }
  
  try {
    // Tạo thư mục nếu cần
    ensureDirectoryExists(fullPath);
    
    // Tạo file
    fs.writeFileSync(fullPath, content, 'utf8');
    log.success(`Đã tạo: ${relativePath}`);
    return true;
  } catch (error) {
    log.error(`Lỗi khi tạo ${relativePath}: ${error.message}`);
    return false;
  }
}

// Function để tạo tất cả templates
function generateAllTemplates() {
  log.header('TẠO CÁC FILE TEMPLATE CẦN THIẾT');
  
  let created = 0;
  let skipped = 0;
  
  for (const [filePath, content] of Object.entries(templates)) {
    if (createTemplate(filePath, content)) {
      created++;
    } else {
      skipped++;
    }
  }
  
  log.header('TỔNG KẾT');
  log.success(`Đã tạo: ${created} file`);
  if (skipped > 0) {
    log.warning(`Đã bỏ qua: ${skipped} file (đã tồn tại)`);
  }
  
  if (created > 0) {
    log.info('\n📝 Các bước tiếp theo:');
    console.log('1. Kiểm tra và chỉnh sửa các file template vừa tạo');
    console.log('2. Chạy database migrations: npm run db:migrate');
    console.log('3. Test các component mới: npm run test');
    console.log('4. Commit changes: git add . && git commit -m "Add templates"');
  }
}

// Function để tạo template cụ thể
function generateSpecificTemplate(templateName) {
  if (!templates[templateName]) {
    log.error(`Template không tồn tại: ${templateName}`);
    log.info('Các template có sẵn:');
    Object.keys(templates).forEach(name => {
      console.log(`  - ${name}`);
    });
    return;
  }
  
  createTemplate(templateName, templates[templateName]);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Tạo tất cả templates
    generateAllTemplates();
  } else {
    // Tạo template cụ thể
    const templateName = args[0];
    generateSpecificTemplate(templateName);
  }
}

// Export cho testing
module.exports = {
  createTemplate,
  generateAllTemplates,
  generateSpecificTemplate,
  templates
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  main();
}
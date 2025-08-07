-- =============================================
-- YAPEE VIETNAM CLONE - ROW LEVEL SECURITY POLICIES UPDATE
-- Cập nhật bảo mật dữ liệu theo từng người dùng và vai trò
-- =============================================

-- =============================================
-- SEARCH_ANALYTICS TABLE POLICIES
-- =============================================

-- Enable RLS on search_analytics table
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Anonymous users có thể thêm search analytics
CREATE POLICY "Anonymous users can insert search analytics" ON search_analytics
  FOR INSERT WITH CHECK (auth.uid() IS NULL);

-- Users có thể thêm search analytics
CREATE POLICY "Users can insert search analytics" ON search_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users chỉ có thể xem search analytics của chính họ
CREATE POLICY "Users can view own search analytics" ON search_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Admin có thể xem tất cả search analytics
CREATE POLICY "Admins can view all search analytics" ON search_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- =============================================
-- PRODUCT_VIEWS TABLE POLICIES - ENHANCED
-- =============================================

-- Anonymous users có thể thêm product views
CREATE POLICY "Anonymous users can insert product views" ON product_views
  FOR INSERT WITH CHECK (auth.uid() IS NULL);

-- Giới hạn số lượng product views có thể được thêm trong một khoảng thời gian
-- (Ngăn chặn spam và tấn công DoS)
CREATE OR REPLACE FUNCTION check_product_view_rate_limit()
RETURNS BOOLEAN AS $$
DECLARE
  recent_views INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_views FROM product_views
  WHERE (user_id = auth.uid() OR (session_id = current_setting('request.headers')::json->>'x-session-id' AND user_id IS NULL))
  AND created_at > NOW() - INTERVAL '1 minute';
  
  RETURN recent_views < 30; -- Giới hạn 30 lượt xem/phút
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Rate limit product views" ON product_views
  FOR INSERT WITH CHECK (check_product_view_rate_limit());

-- =============================================
-- INPUT VALIDATION FUNCTIONS
-- =============================================

-- Validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Validate phone number format (Vietnam)
CREATE OR REPLACE FUNCTION is_valid_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone ~* '^(0|\+84)([0-9]{9,10})$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Sanitize text input (remove script tags)
CREATE OR REPLACE FUNCTION sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Remove script tags
  input_text := regexp_replace(input_text, '<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', 'gi');
  -- Remove iframe tags
  input_text := regexp_replace(input_text, '<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>', '', 'gi');
  -- Remove event handlers
  input_text := regexp_replace(input_text, 'on\w+\s*=\s*"[^"]*"', '', 'gi');
  input_text := regexp_replace(input_text, 'on\w+\s*=\s*''[^'']*''', '', 'gi');
  
  RETURN input_text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- TRIGGER FUNCTIONS FOR INPUT VALIDATION
-- =============================================

-- Validate user profile data
CREATE OR REPLACE FUNCTION validate_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email
  IF NEW.email IS NOT NULL AND NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate phone
  IF NEW.phone IS NOT NULL AND NOT is_valid_phone(NEW.phone) THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;
  
  -- Sanitize text fields
  IF NEW.full_name IS NOT NULL THEN
    NEW.full_name := sanitize_text(NEW.full_name);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Validate product data
CREATE OR REPLACE FUNCTION validate_product()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize text fields
  IF NEW.name IS NOT NULL THEN
    NEW.name := sanitize_text(NEW.name);
  END IF;
  
  IF NEW.description IS NOT NULL THEN
    NEW.description := sanitize_text(NEW.description);
  END IF;
  
  IF NEW.short_description IS NOT NULL THEN
    NEW.short_description := sanitize_text(NEW.short_description);
  END IF;
  
  -- Validate price
  IF NEW.price < 0 THEN
    RAISE EXCEPTION 'Price cannot be negative';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Validate review data
CREATE OR REPLACE FUNCTION validate_review()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize text fields
  IF NEW.comment IS NOT NULL THEN
    NEW.comment := sanitize_text(NEW.comment);
  END IF;
  
  -- Validate rating
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- APPLY VALIDATION TRIGGERS
-- =============================================

DROP TRIGGER IF EXISTS validate_user_profile_trigger ON user_profiles;
CREATE TRIGGER validate_user_profile_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION validate_user_profile();

DROP TRIGGER IF EXISTS validate_product_trigger ON products;
CREATE TRIGGER validate_product_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION validate_product();

DROP TRIGGER IF EXISTS validate_review_trigger ON reviews;
CREATE TRIGGER validate_review_trigger
  BEFORE INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION validate_review();

-- =============================================
-- ADDITIONAL SECURITY FUNCTIONS
-- =============================================

-- Function to check if a user has exceeded login attempts
CREATE OR REPLACE FUNCTION check_login_attempts(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  attempts INTEGER;
  locked_until TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT login_attempts, user_profiles.locked_until 
  INTO attempts, locked_until 
  FROM user_profiles 
  WHERE id = user_id;
  
  -- If account is locked and lock hasn't expired
  IF locked_until IS NOT NULL AND locked_until > NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- If too many attempts
  IF attempts >= 5 THEN
    -- Lock account for 30 minutes
    UPDATE user_profiles 
    SET locked_until = NOW() + INTERVAL '30 minutes'
    WHERE id = user_id;
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record login attempt
CREATE OR REPLACE FUNCTION record_login_attempt(user_id UUID, success BOOLEAN)
RETURNS VOID AS $$
BEGIN
  IF success THEN
    -- Reset attempts on successful login
    UPDATE user_profiles 
    SET login_attempts = 0, 
        locked_until = NULL,
        last_login_at = NOW()
    WHERE id = user_id;
  ELSE
    -- Increment attempts on failed login
    UPDATE user_profiles 
    SET login_attempts = login_attempts + 1
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SECURITY INDEXES
-- =============================================

-- Index for faster security checks
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Index for login attempt checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_login_attempts ON user_profiles(login_attempts);
CREATE INDEX IF NOT EXISTS idx_user_profiles_locked_until ON user_profiles(locked_until);

-- Index for search analytics
CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_timestamp ON search_analytics(timestamp);

-- =============================================
-- AUDIT LOGGING
-- =============================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to log data changes
CREATE OR REPLACE FUNCTION log_data_change()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB := NULL;
  new_data JSONB := NULL;
  action_type VARCHAR(50);
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_type := 'INSERT';
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'UPDATE';
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'DELETE';
    old_data := to_jsonb(OLD);
  END IF;

  INSERT INTO audit_logs (
    user_id, 
    action, 
    table_name, 
    record_id, 
    old_data, 
    new_data, 
    ip_address, 
    user_agent
  ) VALUES (
    auth.uid(), 
    action_type, 
    TG_TABLE_NAME, 
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id 
      ELSE NEW.id 
    END,
    old_data, 
    new_data, 
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent'
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit logging to sensitive tables
CREATE TRIGGER log_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION log_data_change();

CREATE TRIGGER log_orders_changes
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_data_change();

CREATE TRIGGER log_payments_changes
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION log_data_change();

-- =============================================
-- DATA ENCRYPTION
-- =============================================

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_encrypt(
    data,
    current_setting('app.encryption_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    encrypted_data,
    current_setting('app.encryption_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SECURITY POLICIES UPDATE COMPLETED
-- =============================================

SELECT 'Security policies update completed successfully' as status;
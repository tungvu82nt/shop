# 🚀 IMMEDIATE TASKS - TUẦN NÀY

## 📋 DANH SÁCH CÔNG VIỆC CẦN LÀM NGAY

### 🔥 PRIORITY 1: DATABASE SECURITY (3-4 ngày)

#### Task 1.1: Setup Row Level Security Policies
**File cần tạo/sửa:** `database/rls-policies.sql`

```sql
-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Products table policies  
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Orders table policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cart table policies
CREATE POLICY "Users can manage own cart" ON cart
  FOR ALL USING (auth.uid() = user_id);

-- Reviews table policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);
```

**Checklist:**
- [ ] Tạo RLS policies cho tất cả tables
- [ ] Test policies với different user roles
- [ ] Enable RLS trên tất cả sensitive tables
- [ ] Document security model

#### Task 1.2: Database Functions & Triggers
**File cần tạo:** `database/functions.sql`

```sql
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inventory management
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE products SET stock = stock + OLD.quantity - NEW.quantity WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';
```

**Checklist:**
- [ ] Tạo timestamp update functions
- [ ] Tạo inventory management triggers
- [ ] Tạo order status validation functions
- [ ] Test all functions thoroughly

#### Task 1.3: Database Indexes
**File cần tạo:** `database/indexes.sql`

```sql
-- Products table indexes
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Orders table indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Reviews table indexes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Cart table indexes
CREATE INDEX idx_cart_user_id ON cart(user_id);
```

**Checklist:**
- [ ] Tạo search indexes cho products
- [ ] Tạo performance indexes cho queries
- [ ] Test query performance
- [ ] Monitor index usage

---

### 🔐 PRIORITY 2: AUTHENTICATION COMPLETION (2-3 ngày)

#### Task 2.1: Email Verification System
**Files cần tạo/sửa:**
- `src/components/auth/EmailVerification.tsx`
- `src/pages/auth/VerifyEmail.tsx`
- `src/services/emailService.ts`

```typescript
// src/components/auth/EmailVerification.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function EmailVerification({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resendVerification = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email đã được gửi",
        description: "Vui lòng kiểm tra hộp thư của bạn",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi email xác thực",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">Xác thực email</h2>
      <p className="text-muted-foreground">
        Chúng tôi đã gửi link xác thực đến {email}
      </p>
      <Button 
        onClick={resendVerification} 
        loading={loading}
        variant="outline"
      >
        Gửi lại email xác thực
      </Button>
    </div>
  );
}
```

**Checklist:**
- [ ] Tạo EmailVerification component
- [ ] Tạo VerifyEmail page
- [ ] Setup email templates trong Supabase
- [ ] Test email verification flow
- [ ] Handle verification success/error states

#### Task 2.2: Password Reset Functionality
**Files cần tạo:**
- `src/components/auth/ForgotPasswordForm.tsx`
- `src/components/auth/ResetPasswordForm.tsx`
- `src/pages/auth/ResetPassword.tsx`

```typescript
// src/components/auth/ForgotPasswordForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email đã được gửi",
        description: "Vui lòng kiểm tra hộp thư để đặt lại mật khẩu",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi email đặt lại mật khẩu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Nhập email của bạn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Gửi email đặt lại mật khẩu
        </Button>
      </form>
    </Form>
  );
}
```

**Checklist:**
- [ ] Tạo ForgotPasswordForm component
- [ ] Tạo ResetPasswordForm component
- [ ] Setup password reset flow
- [ ] Test password reset functionality
- [ ] Add validation và error handling

#### Task 2.3: User Profile Enhancement
**Files cần sửa:**
- `src/pages/Profile.tsx`
- `src/components/user/ProfileForm.tsx`
- `src/components/user/AvatarUpload.tsx`
- `src/components/user/AddressManagement.tsx`

**Checklist:**
- [ ] Tạo AvatarUpload component
- [ ] Implement file upload to Supabase Storage
- [ ] Tạo AddressManagement component
- [ ] Add change password functionality
- [ ] Add notification settings

---

### 🔍 PRIORITY 3: SEARCH SYSTEM COMPLETION (2-3 ngày)

#### Task 3.1: Global Search Integration
**Files cần sửa:**
- `src/components/layout/Header.tsx`
- `src/components/search/SearchBar.tsx`
- `src/hooks/useSearch.ts`
- `src/services/searchService.ts`

```typescript
// Enhanced SearchBar component
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { searchService } from '@/services/searchService';
import { useNavigate } from 'react-router-dom';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchService.getSuggestions(debouncedQuery).then(setSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      // Save to search history
      searchService.saveSearchHistory(searchQuery.trim());
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => handleSearch(suggestion.name)}
            >
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <span>{suggestion.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Checklist:**
- [ ] Enhance SearchBar với autocomplete
- [ ] Implement search suggestions
- [ ] Add search history functionality
- [ ] Integrate với global header
- [ ] Add popular searches

#### Task 3.2: Advanced Search Service
**File cần sửa:** `src/services/searchService.ts`

```typescript
// Enhanced searchService
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database';

class SearchService {
  async searchProducts(query: string, filters: SearchFilters = {}) {
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        reviews(rating)
      `)
      .ilike('name', `%${query}%`);

    // Apply filters
    if (filters.categoryId) {
      queryBuilder = queryBuilder.eq('category_id', filters.categoryId);
    }
    
    if (filters.minPrice) {
      queryBuilder = queryBuilder.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      queryBuilder = queryBuilder.lte('price', filters.maxPrice);
    }
    
    if (filters.minRating) {
      queryBuilder = queryBuilder.gte('average_rating', filters.minRating);
    }
    
    if (filters.inStock) {
      queryBuilder = queryBuilder.gt('stock', 0);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_asc':
        queryBuilder = queryBuilder.order('price', { ascending: true });
        break;
      case 'price_desc':
        queryBuilder = queryBuilder.order('price', { ascending: false });
        break;
      case 'rating':
        queryBuilder = queryBuilder.order('average_rating', { ascending: false });
        break;
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
        break;
      default:
        queryBuilder = queryBuilder.order('name', { ascending: true });
    }

    const { data, error } = await queryBuilder;
    
    if (error) throw error;
    return data;
  }

  async getSuggestions(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select('name')
      .ilike('name', `%${query}%`)
      .limit(5);
    
    if (error) throw error;
    return data;
  }

  saveSearchHistory(query: string) {
    const history = this.getSearchHistory();
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  }

  getSearchHistory(): string[] {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  }

  async getPopularSearches() {
    // This would typically come from analytics data
    return [
      'iPhone', 'Samsung', 'Laptop', 'Áo thun', 'Giày sneaker',
      'Túi xách', 'Đồng hồ', 'Tai nghe', 'Máy tính', 'Điện thoại'
    ];
  }
}

export const searchService = new SearchService();

export interface SearchFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'relevance';
}
```

**Checklist:**
- [ ] Enhance search với full-text search
- [ ] Add advanced filtering options
- [ ] Implement search analytics
- [ ] Add search history management
- [ ] Optimize search performance

---

### 📊 PRIORITY 4: ADMIN DASHBOARD COMPLETION (3-4 ngày)

#### Task 4.1: User Management
**Files cần tạo/sửa:**
- `src/components/admin/UserManagement.tsx`
- `src/components/admin/UserList.tsx`
- `src/components/admin/UserDetails.tsx`

#### Task 4.2: Product Management
**Files cần tạo:**
- `src/components/admin/ProductManagement.tsx`
- `src/components/admin/ProductForm.tsx`
- `src/components/admin/BulkProductImport.tsx`

#### Task 4.3: Order Management
**Files cần tạo:**
- `src/components/admin/OrderManagement.tsx`
- `src/components/admin/OrderList.tsx`
- `src/components/admin/OrderDetails.tsx`

---

## 📅 WEEKLY SCHEDULE

### Thứ 2-3: Database Security
- Setup RLS policies
- Create database functions
- Add performance indexes

### Thứ 4-5: Authentication Enhancement
- Email verification system
- Password reset functionality
- User profile enhancements

### Thứ 6-7: Search System
- Global search integration
- Advanced search features
- Search analytics

### Tuần sau: Admin Dashboard
- User management
- Product management
- Order management
- Analytics dashboard

---

## 🎯 SUCCESS CRITERIA

### Database Security
- [ ] All tables có RLS policies
- [ ] Database functions hoạt động correctly
- [ ] Query performance improved với indexes

### Authentication
- [ ] Email verification working
- [ ] Password reset functional
- [ ] User profile fully featured

### Search System
- [ ] Global search integrated
- [ ] Autocomplete working
- [ ] Advanced filters functional

### Admin Dashboard
- [ ] User management complete
- [ ] Product CRUD operations
- [ ] Order management system
- [ ] Analytics dashboard

---

*Kế hoạch này sẽ đưa dự án từ 95% lên 100% MVP completion trong tuần này và tuần tới.*
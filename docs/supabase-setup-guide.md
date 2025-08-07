# 🚀 HƯỚNG DẪN SETUP SUPABASE CHO YAPEE VIETNAM CLONE

## 📋 BƯỚC 1: TẠO SUPABASE PROJECT

1. **Truy cập Supabase Dashboard**
   - Vào https://supabase.com/dashboard
   - Đăng nhập hoặc tạo tài khoản mới

2. **Tạo Project Mới**
   - Nhấn "New Project"
   - Chọn Organization (hoặc tạo mới)
   - Nhập thông tin project:
     ```
     Name: yapee-vietnam-clone
     Database Password: [tạo password mạnh - lưu lại]
     Region: Southeast Asia (Singapore)
     ```
   - Nhấn "Create new project"
   - Chờ 2-3 phút để project được khởi tạo

## 📋 BƯỚC 2: LẤY PROJECT CREDENTIALS

1. **Vào Settings > API**
   - Trong Supabase Dashboard, click vào Settings (⚙️)
   - Chọn tab "API"

2. **Copy thông tin sau:**
   ```
   Project URL: https://[your-project-ref].supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Cập nhật file .env**
   ```bash
   # Mở file .env trong project root
   # Thay thế các giá trị placeholder:
   
   VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📋 BƯỚC 3: SETUP DATABASE SCHEMA

1. **Vào SQL Editor**
   - Trong Supabase Dashboard, click "SQL Editor"
   - Nhấn "New query"

2. **Chạy Schema chính**
   - Copy toàn bộ nội dung từ file `database/schema.sql`
   - Paste vào SQL Editor
   - Nhấn "Run" (Ctrl+Enter)
   - Chờ query hoàn thành (có thể mất 1-2 phút)

3. **Áp dụng RLS Policies**
   - Tạo query mới
   - Copy nội dung từ file `database/rls-policies.sql`
   - Paste và chạy

## 📋 BƯỚC 4: SEED DATA (TÙY CHỌN)

Nếu muốn có dữ liệu mẫu để test:

1. **Chạy Seed Data**
   - Tạo query mới trong SQL Editor
   - Copy nội dung từ file `database/seed-data.sql`
   - Paste và chạy

## 📋 BƯỚC 5: KIỂM TRA SETUP

1. **Validate kết nối**
   ```bash
   npm run validate:supabase
   ```

2. **Chạy development server**
   ```bash
   npm run dev
   ```

3. **Test các chức năng:**
   - Đăng ký tài khoản mới
   - Đăng nhập
   - Browse sản phẩm
   - Thêm vào giỏ hàng

## 🔧 TROUBLESHOOTING

### ❌ Lỗi "Invalid API key"
**Nguyên nhân:** Sai URL hoặc API key
**Giải pháp:**
- Kiểm tra lại URL và key trong Supabase Dashboard
- Đảm bảo không có khoảng trắng thừa
- Restart development server sau khi cập nhật .env

### ❌ Lỗi "relation does not exist"
**Nguyên nhân:** Database schema chưa được tạo
**Giải pháp:**
- Chạy lại file `database/schema.sql` trong SQL Editor
- Kiểm tra có lỗi nào trong quá trình chạy SQL không

### ❌ Lỗi "RLS policy violation"
**Nguyên nhân:** RLS policies chưa được áp dụng đúng
**Giải pháp:**
- Chạy file `database/rls-policies.sql`
- Kiểm tra user authentication

### ❌ Lỗi kết nối timeout
**Nguyên nhân:** Network hoặc region issue
**Giải pháp:**
- Thử đổi region khác khi tạo project
- Kiểm tra firewall/proxy settings

## 📚 TÀI LIỆU THAM KHẢO

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🎯 NEXT STEPS

Sau khi setup thành công:

1. ✅ **Authentication System** - Test đăng ký/đăng nhập
2. ✅ **Product Catalog** - Browse và search sản phẩm
3. ✅ **Shopping Cart** - Thêm/xóa sản phẩm
4. ✅ **Checkout Flow** - Test thanh toán
5. ✅ **Admin Dashboard** - Quản lý sản phẩm/đơn hàng

---

**🚀 Chúc mừng! Bạn đã setup thành công Supabase cho Yapee Vietnam Clone!**

Nếu gặp vấn đề, hãy kiểm tra:
1. File `.env` có đúng credentials không
2. Database schema đã được tạo chưa
3. RLS policies đã được áp dụng chưa
4. Development server đã restart sau khi cập nhật .env chưa
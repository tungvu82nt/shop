# Yapee Vietnam Clone

Một ứng dụng thương mại điện tử (e-commerce) được xây dựng với React, TypeScript, Tailwind CSS và Supabase, lấy cảm hứng từ Shopee Vietnam.

## Tính năng chính

- 🔐 **Hệ thống xác thực**: Đăng ký, đăng nhập, quản lý profile
- 🛍️ **Catalog sản phẩm**: Hiển thị danh sách sản phẩm với phân trang
- 🔍 **Tìm kiếm & lọc**: Tìm kiếm sản phẩm theo từ khóa và danh mục
- 🛒 **Giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm
- 📱 **Responsive Design**: Tối ưu cho mobile và desktop
- ⚡ **Flash Sale**: Hiển thị sản phẩm khuyến mãi
- 💳 **Thanh toán**: Tích hợp hệ thống thanh toán
- 🐛 **Error Monitoring**: Theo dõi lỗi real-time với Sentry
- 📊 **Admin Dashboard**: Quản lý hệ thống và theo dõi lỗi
- 🔧 **Error Testing**: Công cụ test các loại lỗi khác nhau

## Công nghệ sử dụng

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (Database + Authentication)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod
- **Notifications**: Sonner
- **Error Monitoring**: Sentry (Error tracking, Performance monitoring, Session replay)
- **Logging**: Custom Error Logger Service

## Project info

**URL**: https://lovable.dev/projects/7d7eda3f-d21d-4b17-bd08-53c0195eb12a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7d7eda3f-d21d-4b17-bd08-53c0195eb12a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Setup environment variables
cp .env.example .env
# Edit .env file with your Supabase credentials

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Cấu hình Supabase

1. **Tạo dự án Supabase**:
   - Truy cập [supabase.com](https://supabase.com)
   - Tạo tài khoản và dự án mới
   - Lấy `Project URL` và `anon public key` từ Settings > API

2. **Cấu hình biến môi trường**:
   ```bash
   # Copy file .env.example thành .env
   cp .env.example .env
   ```
   
   Cập nhật file `.env` với thông tin Supabase của bạn:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Chạy database migrations**:
   - Trong Supabase Dashboard, vào SQL Editor
   - Copy nội dung từ `database/schema.sql`
   - Chạy script để tạo tables và functions

4. **Cấu hình Authentication**:
   - Trong Supabase Dashboard, vào Authentication > Settings
   - Bật Email authentication
   - Cấu hình redirect URLs nếu cần

## Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── home/           # Home page components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── product/        # Product-related components
│   └── ui/             # Reusable UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── integrations/       # Third-party integrations
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7d7eda3f-d21d-4b17-bd08-53c0195eb12a) and click on Share -> Publish.

## Error Monitoring với Sentry

Ứng dụng đã được tích hợp Sentry để theo dõi lỗi và hiệu suất real-time.

### Tính năng Error Monitoring:

- **Automatic Error Capture**: Tự động capture JavaScript và React errors
- **Performance Monitoring**: Theo dõi hiệu suất API calls và page loads
- **Session Replay**: Ghi lại user sessions khi có lỗi
- **Custom Error Logging**: Log các loại lỗi business logic
- **Real-time Alerts**: Thông báo ngay khi có lỗi nghiêm trọng

### Cấu hình Sentry:

1. Tạo tài khoản tại [sentry.io](https://sentry.io)
2. Tạo project React mới
3. Copy DSN và thêm vào file `.env`:
   ```env
   VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

### Test Error Monitoring:

1. Truy cập Admin Dashboard: `http://localhost:8080/admin`
2. Chuyển sang tab **"Sentry Test"**
3. Test các loại lỗi: JavaScript, React, Network, Auth, Payment
4. Kiểm tra kết quả trong Sentry dashboard

### Tài liệu chi tiết:

Xem [docs/sentry-integration.md](./docs/sentry-integration.md) để biết thêm chi tiết về cấu hình và sử dụng Sentry.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

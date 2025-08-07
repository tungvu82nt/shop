# 🛠️ SHOPY VIETNAM - SCRIPTS DIRECTORY

Thư mục này chứa các script tự động hóa để hỗ trợ quá trình phát triển dự án Shopy Vietnam.

## 📋 DANH SÁCH SCRIPTS

### 1. `check-progress.cjs` - Kiểm tra tiến độ dự án

**Mục đích:** Tự động kiểm tra tiến độ phát triển và đưa ra khuyến nghị tiếp theo.

**Cách sử dụng:**
```bash
# Kiểm tra tiến độ tổng thể
node scripts/check-progress.cjs
```

**Chức năng:**
- ✅ Kiểm tra cấu trúc file dự án
- ✅ Kiểm tra dependencies trong package.json
- ✅ Kiểm tra Git status
- ✅ Kiểm tra TypeScript compilation
- ✅ Tạo daily report tự động
- ✅ Đưa ra khuyến nghị task tiếp theo

**Output:**
- Báo cáo tiến độ chi tiết với màu sắc
- Tạo file `docs/daily-report-[date].md`
- Hiển thị % hoàn thành tổng thể
- Danh sách 5 task ưu tiên tiếp theo

---

### 2. `generate-templates.cjs` - Tạo file template

**Mục đích:** Tự động tạo các file template cần thiết cho dự án.

**Cách sử dụng:**
```bash
# Tạo tất cả templates
node scripts/generate-templates.cjs

# Tạo template cụ thể
node scripts/generate-templates.cjs "database/rls-policies.sql"
node scripts/generate-templates.cjs "src/components/auth/EmailVerification.tsx"
```

**Templates có sẵn:**
- `database/rls-policies.sql` - Row Level Security policies
- `database/functions.sql` - Database functions và triggers
- `database/indexes.sql` - Database indexes cho performance
- `src/components/auth/EmailVerification.tsx` - Email verification component

**Chức năng:**
- ✅ Tạo thư mục tự động nếu chưa tồn tại
- ✅ Kiểm tra file đã tồn tại để tránh ghi đè
- ✅ Tạo code template với best practices
- ✅ Hỗ trợ TypeScript và SQL

---

## 🚀 WORKFLOW KHUYẾN NGHỊ

### Hàng ngày:
```bash
# 1. Kiểm tra tiến độ
node scripts/check-progress.cjs

# 2. Tạo templates cần thiết (nếu có)
node scripts/generate-templates.cjs

# 3. Làm việc theo checklist
# Xem file: docs/daily-checklist.md

# 4. Commit cuối ngày
git add .
git commit -m "Daily progress: [mô tả công việc đã làm]"
```

### Đầu tuần:
```bash
# Kiểm tra tổng thể và lập kế hoạch
node scripts/check-progress.cjs

# Xem kế hoạch chi tiết
cat docs/completion-plan.md
cat docs/immediate-tasks.md
```

---

## 📊 HIỂU KẾT QUẢ OUTPUT

### Progress Checker Output:

```
🚀 KIỂM TRA CẤU TRÚC FILE
✅ Email Verification Component: src/components/auth/EmailVerification.tsx
⚠️ THIẾU: Database RLS Policies: database/rls-policies.sql

ℹ Tiến độ cấu trúc file: 15/20 (75%)

🚀 KHUYẾN NGHỊ TIẾP THEO
📋 5 TASK TIẾP THEO (theo thứ tự ưu tiên):
   1. Database RLS Policies: database/rls-policies.sql
   2. Database Functions: database/functions.sql
   3. Email Verification Component: src/components/auth/EmailVerification.tsx

📊 Tiến độ tổng thể: 78%
💪 Tiến độ tốt! Tiếp tục theo kế hoạch.
```

### Ý nghĩa màu sắc:
- 🟢 **Xanh lá (✅):** Hoàn thành
- 🟡 **Vàng (⚠️):** Cảnh báo/Thiếu
- 🔴 **Đỏ (❌):** Lỗi
- 🔵 **Xanh dương (ℹ):** Thông tin
- 🟣 **Tím (📋):** Task/Khuyến nghị

---

## 🔧 CUSTOMIZATION

### Thêm template mới:

1. Mở file `scripts/generate-templates.cjs`
2. Thêm template vào object `templates`:

```javascript
const templates = {
  // ... existing templates
  'src/components/new/MyComponent.tsx': `
    // Template content here
    import React from 'react';
    
    export function MyComponent() {
      return <div>Hello World</div>;
    }
  `
};
```

### Thêm file check mới:

1. Mở file `scripts/check-progress.cjs`
2. Thêm vào object `requiredStructure`:

```javascript
const requiredStructure = {
  // ... existing files
  'src/new-feature/index.ts': 'New Feature Index'
};
```

---

## 🐛 TROUBLESHOOTING

### Lỗi thường gặp:

**1. "Cannot find module"**
```bash
# Cài đặt Node.js dependencies
npm install
```

**2. "Permission denied"**
```bash
# Trên Windows, chạy PowerShell as Administrator
# Hoặc sử dụng:
node scripts/check-progress.cjs
```

**3. "Git command not found"**
```bash
# Cài đặt Git và thêm vào PATH
# Hoặc script sẽ bỏ qua phần Git check
```

**4. "TypeScript errors"**
```bash
# Cài đặt TypeScript
npm install -g typescript
# Hoặc sử dụng npx
npx tsc --noEmit
```

---

## 📝 NOTES

### Quy tắc đặt tên file:
- **Components:** `PascalCase.tsx` (VD: `EmailVerification.tsx`)
- **Services:** `camelCase.ts` (VD: `searchService.ts`)
- **Database:** `kebab-case.sql` (VD: `rls-policies.sql`)
- **Pages:** `PascalCase.tsx` (VD: `ResetPassword.tsx`)

### Best practices:
- Chạy `check-progress.cjs` mỗi ngày
- Commit code ít nhất 1 lần/ngày
- Tạo templates trước khi code
- Kiểm tra TypeScript errors trước khi commit
- Cập nhật daily checklist thường xuyên

### Performance tips:
- Scripts được tối ưu để chạy nhanh
- Sử dụng cache cho Git operations
- Parallel checking cho multiple files
- Minimal dependencies để tránh conflicts

---

## 🔗 LIÊN KẾT LIÊN QUAN

- [Daily Checklist](../docs/daily-checklist.md)
- [Completion Plan](../docs/completion-plan.md)
- [Immediate Tasks](../docs/immediate-tasks.md)
- [Task List](../docs/tasklist.md)

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề với scripts:

1. Kiểm tra Node.js version: `node --version` (cần >= 14)
2. Kiểm tra npm version: `npm --version`
3. Xem log chi tiết bằng cách thêm `--verbose`
4. Tạo issue trong repository với log lỗi

---

*Scripts được thiết kế để hỗ trợ workflow phát triển hiệu quả và đảm bảo chất lượng code.*

**Last Updated:** $(date)  
**Version:** 1.0  
**Maintainer:** Shopy Vietnam Development Team
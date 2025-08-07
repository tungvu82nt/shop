#!/usr/bin/env node

/**
 * SHOPY VIETNAM - Progress Checker Script
 * Tự động kiểm tra tiến độ dự án và đưa ra khuyến nghị
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Helper function để log với màu
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}${colors.bright}\n🚀 ${msg}${colors.reset}`),
  task: (msg) => console.log(`${colors.magenta}📋 ${msg}${colors.reset}`)
};

// Danh sách các file và thư mục cần kiểm tra
const requiredStructure = {
  // Database files
  'database/rls-policies.sql': 'Database RLS Policies',
  'database/functions.sql': 'Database Functions',
  'database/indexes.sql': 'Database Indexes',
  
  // Authentication components
  'src/components/auth/EmailVerification.tsx': 'Email Verification Component',
  'src/components/auth/ForgotPasswordForm.tsx': 'Forgot Password Form',
  'src/components/auth/ResetPasswordForm.tsx': 'Reset Password Form',
  'src/pages/auth/VerifyEmail.tsx': 'Email Verification Page',
  'src/pages/auth/ResetPassword.tsx': 'Reset Password Page',
  
  // User profile components
  'src/components/user/AvatarUpload.tsx': 'Avatar Upload Component',
  'src/components/user/AddressManagement.tsx': 'Address Management Component',
  
  // Search system
  'src/services/searchService.ts': 'Search Service',
  'src/components/search/SearchBar.tsx': 'Search Bar Component',
  'src/components/search/ProductFilter.tsx': 'Product Filter Component',
  'src/components/search/ProductSort.tsx': 'Product Sort Component',
  
  // Admin dashboard
  'src/components/admin/UserManagement.tsx': 'User Management Component',
  'src/components/admin/ProductManagement.tsx': 'Product Management Component',
  'src/components/admin/OrderManagement.tsx': 'Order Management Component',
  'src/components/admin/UserList.tsx': 'User List Component',
  'src/components/admin/ProductForm.tsx': 'Product Form Component',
  'src/components/admin/OrderList.tsx': 'Order List Component'
};

// Kiểm tra các dependencies cần thiết
const requiredDependencies = {
  '@supabase/supabase-js': 'Supabase Client',
  '@tanstack/react-query': 'React Query',
  'react-router-dom': 'React Router',
  'tailwindcss': 'Tailwind CSS',
  'typescript': 'TypeScript',
  '@types/react': 'React Types',
  'vite': 'Vite Build Tool'
};

// Kiểm tra cấu trúc file
function checkFileStructure() {
  log.header('KIỂM TRA CẤU TRÚC FILE');
  
  const results = {
    existing: [],
    missing: [],
    total: Object.keys(requiredStructure).length
  };
  
  for (const [filePath, description] of Object.entries(requiredStructure)) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath)) {
      log.success(`${description}: ${filePath}`);
      results.existing.push(filePath);
    } else {
      log.warning(`THIẾU: ${description}: ${filePath}`);
      results.missing.push(filePath);
    }
  }
  
  const completionRate = Math.round((results.existing.length / results.total) * 100);
  
  log.info(`\nTiến độ cấu trúc file: ${results.existing.length}/${results.total} (${completionRate}%)`);
  
  return results;
}

// Kiểm tra dependencies
function checkDependencies() {
  log.header('KIỂM TRA DEPENDENCIES');
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      log.error('Không tìm thấy package.json');
      return { existing: [], missing: Object.keys(requiredDependencies) };
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    const results = {
      existing: [],
      missing: []
    };
    
    for (const [dep, description] of Object.entries(requiredDependencies)) {
      if (allDeps[dep]) {
        log.success(`${description}: ${dep}@${allDeps[dep]}`);
        results.existing.push(dep);
      } else {
        log.warning(`THIẾU: ${description}: ${dep}`);
        results.missing.push(dep);
      }
    }
    
    return results;
  } catch (error) {
    log.error(`Lỗi khi đọc package.json: ${error.message}`);
    return { existing: [], missing: Object.keys(requiredDependencies) };
  }
}

// Kiểm tra Git status
function checkGitStatus() {
  log.header('KIỂM TRA GIT STATUS');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim() === '') {
      log.success('Working directory sạch sẽ - tất cả thay đổi đã được commit');
    } else {
      log.warning('Có file chưa được commit:');
      console.log(status);
      log.task('Chạy: git add . && git commit -m "Work in progress"');
    }
    
    // Kiểm tra branch hiện tại
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    log.info(`Branch hiện tại: ${branch}`);
    
  } catch (error) {
    log.warning('Không thể kiểm tra Git status (có thể chưa init git)');
  }
}

// Kiểm tra TypeScript compilation
function checkTypeScript() {
  log.header('KIỂM TRA TYPESCRIPT');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log.success('TypeScript compilation thành công');
  } catch (error) {
    log.error('TypeScript compilation có lỗi:');
    console.log(error.stdout?.toString() || error.message);
    log.task('Sửa các lỗi TypeScript trước khi tiếp tục');
  }
}

// Đưa ra khuyến nghị tiếp theo
function generateRecommendations(fileResults, depResults) {
  log.header('KHUYẾN NGHỊ TIẾP THEO');
  
  // Ưu tiên theo thứ tự logic
  const priorities = [
    // Database setup (cao nhất)
    'database/rls-policies.sql',
    'database/functions.sql', 
    'database/indexes.sql',
    
    // Authentication
    'src/components/auth/EmailVerification.tsx',
    'src/components/auth/ForgotPasswordForm.tsx',
    'src/pages/auth/VerifyEmail.tsx',
    
    // User management
    'src/components/user/AvatarUpload.tsx',
    'src/components/user/AddressManagement.tsx',
    
    // Search system
    'src/services/searchService.ts',
    'src/components/search/SearchBar.tsx',
    
    // Admin dashboard
    'src/components/admin/UserManagement.tsx',
    'src/components/admin/ProductManagement.tsx'
  ];
  
  const nextTasks = priorities.filter(file => fileResults.missing.includes(file)).slice(0, 5);
  
  if (nextTasks.length > 0) {
    log.task('5 TASK TIẾP THEO (theo thứ tự ưu tiên):');
    nextTasks.forEach((task, index) => {
      console.log(`   ${index + 1}. ${requiredStructure[task]}: ${task}`);
    });
  } else {
    log.success('🎉 Tất cả file cần thiết đã được tạo!');
    log.task('Tiếp theo: Kiểm tra chức năng và tối ưu hóa performance');
  }
  
  // Dependencies thiếu
  if (depResults.missing.length > 0) {
    log.task('\nCài đặt dependencies thiếu:');
    console.log(`   npm install ${depResults.missing.join(' ')}`);
  }
}

// Tạo daily report
function generateDailyReport() {
  const today = new Date().toLocaleDateString('vi-VN');
  const reportPath = path.join(process.cwd(), 'docs', `daily-report-${today.replace(/\//g, '-')}.md`);
  
  const report = `# Daily Progress Report - ${today}

## Completed Today
- [ ] 
- [ ] 
- [ ] 

## Blockers
- 

## Tomorrow's Priority
- 

## Notes
- 

---
*Generated by check-progress.js at ${new Date().toLocaleString('vi-VN')}*
`;
  
  if (!fs.existsSync(reportPath)) {
    fs.writeFileSync(reportPath, report);
    log.success(`Đã tạo daily report: ${reportPath}`);
  }
}

// Main function
function main() {
  console.clear();
  
  log.header('SHOPY VIETNAM - PROGRESS CHECKER');
  console.log(`${colors.cyan}Thời gian: ${new Date().toLocaleString('vi-VN')}${colors.reset}\n`);
  
  // Kiểm tra các thành phần
  const fileResults = checkFileStructure();
  const depResults = checkDependencies();
  
  checkGitStatus();
  checkTypeScript();
  
  // Tổng kết và khuyến nghị
  generateRecommendations(fileResults, depResults);
  
  // Tạo daily report
  generateDailyReport();
  
  // Tổng kết cuối
  log.header('TỔNG KẾT');
  
  const totalCompletion = Math.round(
    ((fileResults.existing.length + depResults.existing.length) / 
     (fileResults.total + Object.keys(requiredDependencies).length)) * 100
  );
  
  console.log(`${colors.bright}📊 Tiến độ tổng thể: ${totalCompletion}%${colors.reset}`);
  
  if (totalCompletion >= 90) {
    log.success('🎉 Dự án gần hoàn thành! Tập trung vào testing và optimization.');
  } else if (totalCompletion >= 70) {
    log.info('💪 Tiến độ tốt! Tiếp tục theo kế hoạch.');
  } else if (totalCompletion >= 50) {
    log.warning('⚡ Cần tăng tốc! Tập trung vào các task ưu tiên cao.');
  } else {
    log.error('🚨 Cần nỗ lực nhiều hơn! Xem lại kế hoạch và timeline.');
  }
  
  console.log(`\n${colors.cyan}💡 Tip: Chạy script này mỗi ngày để theo dõi tiến độ!${colors.reset}`);
  console.log(`${colors.cyan}📝 Command: node scripts/check-progress.js${colors.reset}\n`);
}

// Chạy script
if (require.main === module) {
  main();
}

module.exports = {
  checkFileStructure,
  checkDependencies,
  checkGitStatus,
  generateRecommendations
};
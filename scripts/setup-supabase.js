#!/usr/bin/env node

/**
 * YAPEE VIETNAM CLONE - SUPABASE SETUP SCRIPT
 * 
 * Script này sẽ hướng dẫn setup Supabase project và cấu hình database
 * 
 * Chạy: npm run setup:supabase
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupSupabase() {
  console.log('🚀 YAPEE VIETNAM CLONE - SUPABASE SETUP');
  console.log('=====================================\n');
  
  console.log('📋 Bước 1: Tạo Supabase Project');
  console.log('1. Truy cập https://supabase.com/dashboard');
  console.log('2. Đăng nhập hoặc tạo tài khoản');
  console.log('3. Nhấn "New Project"');
  console.log('4. Chọn Organization và nhập thông tin:');
  console.log('   - Name: yapee-vietnam-clone');
  console.log('   - Database Password: [tạo password mạnh]');
  console.log('   - Region: Southeast Asia (Singapore)');
  console.log('5. Nhấn "Create new project"\n');
  
  await question('Nhấn Enter khi đã tạo xong project...');
  
  console.log('\n📋 Bước 2: Lấy Project Credentials');
  console.log('1. Trong Supabase Dashboard, vào Settings > API');
  console.log('2. Copy các thông tin sau:\n');
  
  const projectUrl = await question('Nhập Project URL (https://xxx.supabase.co): ');
  const anonKey = await question('Nhập anon/public key: ');
  
  // Validate inputs
  if (!projectUrl.includes('supabase.co') || !anonKey.startsWith('eyJ')) {
    console.log('❌ Thông tin không hợp lệ. Vui lòng kiểm tra lại.');
    process.exit(1);
  }
  
  // Update .env file
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Replace or add Supabase config
  envContent = envContent.replace(
    /VITE_SUPABASE_URL=.*/,
    `VITE_SUPABASE_URL=${projectUrl}`
  );
  
  envContent = envContent.replace(
    /VITE_SUPABASE_ANON_KEY=.*/,
    `VITE_SUPABASE_ANON_KEY=${anonKey}`
  );
  
  // If not found, add them
  if (!envContent.includes('VITE_SUPABASE_URL')) {
    envContent += `\nVITE_SUPABASE_URL=${projectUrl}`;
  }
  if (!envContent.includes('VITE_SUPABASE_ANON_KEY')) {
    envContent += `\nVITE_SUPABASE_ANON_KEY=${anonKey}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Đã cập nhật file .env');
  
  console.log('\n📋 Bước 3: Setup Database Schema');
  console.log('1. Trong Supabase Dashboard, vào SQL Editor');
  console.log('2. Tạo new query và copy nội dung từ file:');
  console.log('   - database/schema.sql');
  console.log('   - database/rls-policies.sql');
  console.log('3. Chạy từng file theo thứ tự\n');
  
  await question('Nhấn Enter khi đã setup xong database schema...');
  
  console.log('\n📋 Bước 4: Seed Data (Optional)');
  console.log('Nếu muốn có dữ liệu mẫu:');
  console.log('1. Copy nội dung từ database/seed-data.sql');
  console.log('2. Chạy trong SQL Editor\n');
  
  const seedData = await question('Có muốn seed data không? (y/n): ');
  
  if (seedData.toLowerCase() === 'y') {
    console.log('✅ Hãy chạy file database/seed-data.sql trong SQL Editor');
  }
  
  console.log('\n🎉 SETUP HOÀN THÀNH!');
  console.log('=====================================');
  console.log('✅ Supabase project đã được cấu hình');
  console.log('✅ Database schema đã được tạo');
  console.log('✅ RLS policies đã được áp dụng');
  console.log('\n🚀 Bây giờ bạn có thể chạy: npm run dev');
  console.log('\n📚 Tài liệu:');
  console.log('- Supabase Docs: https://supabase.com/docs');
  console.log('- Project README: ./README.md');
  
  rl.close();
}

setupSupabase().catch(console.error);
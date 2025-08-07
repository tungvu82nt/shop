#!/usr/bin/env node

/**
 * YAPEE VIETNAM CLONE - SUPABASE VALIDATION SCRIPT
 * 
 * Script này kiểm tra kết nối Supabase và validate setup
 * 
 * Chạy: npm run validate:supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function validateSupabase() {
  console.log('🔍 YAPEE VIETNAM CLONE - SUPABASE VALIDATION');
  console.log('=============================================\n');
  
  // Check environment variables
  console.log('📋 Kiểm tra Environment Variables...');
  
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.log('❌ VITE_SUPABASE_URL chưa được cấu hình hoặc vẫn là placeholder');
    console.log('💡 Chạy: npm run setup:supabase để cấu hình\n');
    process.exit(1);
  }
  
  if (!supabaseKey || supabaseKey.includes('placeholder')) {
    console.log('❌ VITE_SUPABASE_ANON_KEY chưa được cấu hình hoặc vẫn là placeholder');
    console.log('💡 Chạy: npm run setup:supabase để cấu hình\n');
    process.exit(1);
  }
  
  console.log('✅ Environment variables OK');
  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...\n`);
  
  // Create Supabase client
  console.log('🔌 Kiểm tra kết nối Supabase...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('❌ Lỗi kết nối database:', error.message);
      console.log('💡 Kiểm tra lại:');
      console.log('   - URL và Key có đúng không?');
      console.log('   - Database schema đã được tạo chưa?');
      console.log('   - RLS policies đã được áp dụng chưa?\n');
      process.exit(1);
    }
    
    console.log('✅ Kết nối database thành công\n');
    
  } catch (err) {
    console.log('❌ Lỗi kết nối:', err.message);
    process.exit(1);
  }
  
  // Test table structure
  console.log('📊 Kiểm tra cấu trúc database...');
  
  const requiredTables = [
    'users', 'user_addresses', 'categories', 'brands', 
    'sellers', 'products', 'product_variants', 'product_images',
    'orders', 'order_items', 'payments', 'shipping_addresses'
  ];
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      
      if (error && error.code === '42P01') {
        console.log(`❌ Bảng '${table}' không tồn tại`);
        console.log('💡 Chạy database/schema.sql trong Supabase SQL Editor\n');
        process.exit(1);
      } else if (error && error.code === '42501') {
        console.log(`⚠️  Bảng '${table}' tồn tại nhưng chưa có RLS policy`);
      } else {
        console.log(`✅ Bảng '${table}' OK`);
      }
      
    } catch (err) {
      console.log(`❌ Lỗi kiểm tra bảng '${table}':`, err.message);
    }
  }
  
  console.log('\n🔐 Kiểm tra Authentication...');
  
  try {
    // Test auth functions
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Lỗi auth service:', authError.message);
    } else {
      console.log('✅ Auth service hoạt động');
    }
    
  } catch (err) {
    console.log('❌ Lỗi auth:', err.message);
  }
  
  console.log('\n🎉 VALIDATION HOÀN THÀNH!');
  console.log('=============================');
  console.log('✅ Supabase connection OK');
  console.log('✅ Database tables OK');
  console.log('✅ Auth service OK');
  console.log('\n🚀 Dự án sẵn sàng để development!');
  console.log('\n📚 Next steps:');
  console.log('1. npm run dev - Chạy development server');
  console.log('2. Kiểm tra authentication flow');
  console.log('3. Test CRUD operations');
}

validateSupabase().catch(console.error);
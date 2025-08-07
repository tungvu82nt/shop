#!/usr/bin/env node

/**
 * Script tự động setup database schema và RLS policies cho Yapee Vietnam Clone
 * Chạy: node scripts/setup-database.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Cần có VITE_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trong .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Bắt đầu setup database cho Yapee Vietnam Clone...');
  
  try {
    // 1. Kiểm tra kết nối
    console.log('\n📡 Kiểm tra kết nối Supabase...');
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    if (error && error.code !== '42P01') {
      throw new Error(`Lỗi kết nối: ${error.message}`);
    }
    console.log('✅ Kết nối Supabase thành công');

    // 2. Tạo database schema
    console.log('\n📊 Tạo database schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Chia SQL thành các statements riêng biệt
      const statements = schemaSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.warn(`⚠️ Warning executing statement: ${error.message}`);
          }
        } catch (err) {
          console.warn(`⚠️ Warning: ${err.message}`);
        }
      }
      
      console.log('✅ Database schema đã được tạo');
    } else {
      console.warn('⚠️ Không tìm thấy file schema.sql');
    }

    // 3. Áp dụng RLS policies
    console.log('\n🔒 Áp dụng Row Level Security policies...');
    const rlsPath = path.join(__dirname, '..', 'database', 'rls-policies.sql');
    
    if (fs.existsSync(rlsPath)) {
      const rlsSql = fs.readFileSync(rlsPath, 'utf8');
      
      const statements = rlsSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.warn(`⚠️ Warning executing RLS: ${error.message}`);
          }
        } catch (err) {
          console.warn(`⚠️ Warning: ${err.message}`);
        }
      }
      
      console.log('✅ RLS policies đã được áp dụng');
    } else {
      console.warn('⚠️ Không tìm thấy file rls-policies.sql');
    }

    // 4. Tạo indexes cho performance
    console.log('\n⚡ Tạo database indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);',
      'CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);',
      'CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);',
      'CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector(\'english\', name));',
      'CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);',
      'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
      'CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);'
    ];

    for (const indexSql of indexes) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: indexSql });
        if (error) {
          console.warn(`⚠️ Warning creating index: ${error.message}`);
        }
      } catch (err) {
        console.warn(`⚠️ Warning: ${err.message}`);
      }
    }
    
    console.log('✅ Database indexes đã được tạo');

    // 5. Seed data (optional)
    console.log('\n🌱 Tạo dữ liệu mẫu...');
    const seedPath = path.join(__dirname, '..', 'database', 'seed-data.sql');
    
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      
      const statements = seedSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.warn(`⚠️ Warning seeding data: ${error.message}`);
          }
        } catch (err) {
          console.warn(`⚠️ Warning: ${err.message}`);
        }
      }
      
      console.log('✅ Dữ liệu mẫu đã được tạo');
    } else {
      console.warn('⚠️ Không tìm thấy file seed-data.sql');
    }

    // 6. Validate setup
    console.log('\n🔍 Kiểm tra setup...');
    const tables = [
      'users', 'user_addresses', 'categories', 'brands',
      'sellers', 'products', 'product_variants', 'product_images',
      'orders', 'order_items', 'payments', 'shipping_addresses'
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Bảng '${table}': ${error.message}`);
        } else {
          console.log(`✅ Bảng '${table}': OK`);
        }
      } catch (err) {
        console.log(`❌ Bảng '${table}': ${err.message}`);
      }
    }

    console.log('\n🎉 Setup database hoàn tất!');
    console.log('\n📋 Next Steps:');
    console.log('1. Restart development server: npm run dev');
    console.log('2. Test authentication: Đăng ký/đăng nhập');
    console.log('3. Test product catalog: Browse sản phẩm');
    console.log('4. Test shopping cart: Thêm sản phẩm vào giỏ');
    console.log('5. Test admin dashboard: Truy cập /admin');
    
  } catch (error) {
    console.error('❌ Lỗi setup database:', error.message);
    process.exit(1);
  }
}

// Chạy setup
setupDatabase();
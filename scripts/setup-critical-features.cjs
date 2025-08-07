#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 THIẾT LẬP CÁC TÍNH NĂNG QUAN TRỌNG\n');

// Màu sắc cho console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✅ Đã tạo thư mục: ${dirPath}`, 'green');
  }
}

function writeFile(filePath, content) {
  if (fs.existsSync(filePath)) {
    log(`⚠️ File đã tồn tại: ${filePath}`, 'yellow');
    return false;
  }
  
  createDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  log(`✅ Đã tạo: ${filePath}`, 'green');
  return true;
}

// 1. Tạo AppRouter.tsx
const appRouterContent = `import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load các pages để tối ưu performance
const Home = React.lazy(() => import('../pages/Home'));
const ProductList = React.lazy(() => import('../pages/ProductList'));
const ProductDetail = React.lazy(() => import('../pages/ProductDetail'));
const SearchPage = React.lazy(() => import('../pages/SearchPage'));
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Orders = React.lazy(() => import('../pages/Orders'));
const WishlistPage = React.lazy(() => import('../pages/WishlistPage'));

// Auth pages
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'));
const VerifyEmail = React.lazy(() => import('../pages/auth/VerifyEmail'));

// Admin pages
const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard'));

// Error pages
const NotFound = React.lazy(() => import('../pages/NotFound'));

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/search" element={<SearchPage />} />
                
                {/* Auth routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />
                
                {/* Protected routes */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                
                {/* Redirects */}
                <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;`;

// 2. Tạo ProtectedRoute.tsx
const protectedRouteContent = `import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Nếu cần authentication nhưng user chưa đăng nhập
  if (requireAuth && !user) {
    // Lưu trang hiện tại để redirect sau khi đăng nhập
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Nếu không cần authentication hoặc user đã đăng nhập
  return <>{children}</>;
};

export default ProtectedRoute;`;

// 3. Tạo AdminRoute.tsx
const adminRouteContent = `import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Kiểm tra user có tồn tại và có role admin không
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Kiểm tra role admin (giả sử role được lưu trong user.role)
  if (user.role !== 'admin' && user.role !== 'moderator') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;`;

// 4. Tạo AuthContext.tsx
const authContextContent = `import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy session hiện tại
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};`;

// 5. Tạo CartContext.tsx
const cartContextContent = `import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      }
      
      return calculateTotals({
        ...state,
        items: [...state.items, action.payload]
      });
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'CLEAR_CART': {
      return { items: [], total: 0, itemCount: 0 };
    }
    
    case 'LOAD_CART': {
      return calculateTotals({ ...state, items: action.payload });
    }
    
    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { ...state, total, itemCount };
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  // Load cart từ localStorage khi component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};`;

// 6. Tạo LoadingSpinner.tsx
const loadingSpinnerContent = `import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={\`flex justify-center items-center \${className}\`}>
      <div 
        className={\`\${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin\`}
        role="status"
        aria-label="Đang tải..."
      >
        <span className="sr-only">Đang tải...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;`;

// 7. Tạo NotFound.tsx
const notFoundContent = `import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Trang không tìm thấy
          </h2>
          <p className="text-gray-500 mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </Link>
          
          <div className="text-sm text-gray-500">
            Hoặc{' '}
            <button 
              onClick={() => window.history.back()}
              className="text-blue-600 hover:underline"
            >
              quay lại trang trước
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;`;

// 8. Tạo package.json scripts update
const packageJsonUpdates = {
  "scripts": {
    "db:migrate": "psql -d shopy_vietnam -f database/rls-policies.sql && psql -d shopy_vietnam -f database/functions.sql && psql -d shopy_vietnam -f database/indexes.sql",
    "db:seed": "psql -d shopy_vietnam -f database/seed.sql",
    "db:reset": "psql -d shopy_vietnam -f database/reset.sql",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "lighthouse": "lighthouse http://localhost:5173 --output=html --output-path=./lighthouse-report.html",
    "analyze": "npx vite-bundle-analyzer"
  },
  "dependencies": {
    "react-router-dom": "^6.8.0",
    "react-helmet-async": "^2.0.0"
  },
  "devDependencies": {
    "@types/react-router-dom": "^5.3.3",
    "@types/react-helmet-async": "^1.0.0",
    "vite-bundle-analyzer": "^0.7.0",
    "@playwright/test": "^1.40.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
};

// Main execution
async function main() {
  try {
    log('🔧 BƯỚC 1: TẠO ROUTING SYSTEM', 'blue');
    
    // Tạo routing files
    writeFile('src/routes/AppRouter.tsx', appRouterContent);
    writeFile('src/routes/ProtectedRoute.tsx', protectedRouteContent);
    writeFile('src/routes/AdminRoute.tsx', adminRouteContent);
    
    log('\n🔧 BƯỚC 2: TẠO CONTEXT PROVIDERS', 'blue');
    
    // Tạo context files
    writeFile('src/contexts/AuthContext.tsx', authContextContent);
    writeFile('src/contexts/CartContext.tsx', cartContextContent);
    
    log('\n🔧 BƯỚC 3: TẠO UI COMPONENTS', 'blue');
    
    // Tạo UI components
    writeFile('src/components/ui/LoadingSpinner.tsx', loadingSpinnerContent);
    writeFile('src/pages/NotFound.tsx', notFoundContent);
    
    log('\n🔧 BƯỚC 4: CẬP NHẬT PACKAGE.JSON', 'blue');
    
    // Đọc và cập nhật package.json
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Merge scripts
      packageJson.scripts = { ...packageJson.scripts, ...packageJsonUpdates.scripts };
      
      // Merge dependencies (chỉ thêm nếu chưa có)
      packageJson.dependencies = packageJson.dependencies || {};
      Object.entries(packageJsonUpdates.dependencies).forEach(([key, value]) => {
        if (!packageJson.dependencies[key]) {
          packageJson.dependencies[key] = value;
        }
      });
      
      // Merge devDependencies
      packageJson.devDependencies = packageJson.devDependencies || {};
      Object.entries(packageJsonUpdates.devDependencies).forEach(([key, value]) => {
        if (!packageJson.devDependencies[key]) {
          packageJson.devDependencies[key] = value;
        }
      });
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      log('✅ Đã cập nhật package.json', 'green');
    }
    
    log('\n🔧 BƯỚC 5: CÀI ĐẶT DEPENDENCIES', 'blue');
    
    try {
      log('📦 Đang cài đặt dependencies...', 'yellow');
      execSync('npm install', { stdio: 'inherit' });
      log('✅ Đã cài đặt dependencies thành công', 'green');
    } catch (error) {
      log('⚠️ Lỗi khi cài đặt dependencies. Vui lòng chạy "npm install" thủ công.', 'yellow');
    }
    
    log('\n🎉 HOÀN THÀNH!', 'bold');
    log('\n📋 CÁC BƯỚC TIẾP THEO:', 'blue');
    log('1. Cập nhật src/App.tsx để sử dụng AppRouter', 'yellow');
    log('2. Tạo file src/lib/supabase.ts cho Supabase client', 'yellow');
    log('3. Chạy database migrations: npm run db:migrate', 'yellow');
    log('4. Test routing: npm run dev', 'yellow');
    log('5. Kiểm tra tiến độ: node scripts/check-progress.cjs', 'yellow');
    
  } catch (error) {
    log(`❌ Lỗi: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
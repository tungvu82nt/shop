import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { SearchProvider, useSearch } from '../contexts/SearchContext';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import GlobalSearchModal from '../components/search/GlobalSearchModal';
import CartDrawer from '../components/cart/CartDrawer';
import { lazyRoute } from '../utils/lazyImport';

// Lazy load các trang để tối ưu hiệu suất
const Home = lazyRoute(() => import('../pages/Home'));
const Profile = lazyRoute(() => import('../pages/Profile'));
const ProductDetail = lazyRoute(() => import('../pages/ProductDetail'));
const ProductSearch = lazyRoute(() => import('../pages/ProductSearch'));
const ProductList = lazyRoute(() => import('../pages/ProductList'));
const SearchPage = lazyRoute(() => import('../pages/SearchPage'));
const WishlistPage = lazyRoute(() => import('../pages/WishlistPage'));
const Cart = lazyRoute(() => import('../pages/Cart'));
const FlashSalePage = lazyRoute(() => import('../pages/FlashSale'));
const Checkout = lazyRoute(() => import('../pages/Checkout'));
const OrderSuccess = lazyRoute(() => import('../pages/OrderSuccess'));
const PaymentResult = lazyRoute(() => import('../pages/PaymentResult'));
const OrderDetailPage = lazyRoute(() => import('../pages/OrderDetailPage'));
const Admin = lazyRoute(() => import('../pages/Admin'));
const EmailVerification = lazyRoute(() => import('../pages/EmailVerification'));
const TermsOfService = lazyRoute(() => import('../pages/TermsOfService'));
const PrivacyPolicy = lazyRoute(() => import('../pages/PrivacyPolicy'));
const ReturnPolicy = lazyRoute(() => import('../pages/ReturnPolicy'));
const FreeShipping = lazyRoute(() => import('../pages/FreeShipping'));

// Các trang bị thiếu route
const Brands = lazyRoute(() => import('../pages/Brands'));
const Category = lazyRoute(() => import('../pages/Category'));
const Orders = lazyRoute(() => import('../pages/Orders'));
const Settings = lazyRoute(() => import('../pages/Settings'));
const Voucher = lazyRoute(() => import('../pages/Voucher'));

// Authentication pages
const LoginPage = lazyRoute(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazyRoute(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazyRoute(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazyRoute(() => import('../pages/auth/ResetPasswordPage'));
const EmailVerificationPage = lazyRoute(() => import('../pages/auth/EmailVerificationPage'));

// Các trang thông tin và dịch vụ
const About = lazyRoute(() => import('../pages/About'));
const Contact = lazyRoute(() => import('../pages/Contact'));
const Careers = lazyRoute(() => import('../pages/Careers'));
const Authentic = lazyRoute(() => import('../pages/Authentic'));
const SellerCenter = lazyRoute(() => import('../pages/SellerCenter'));
const FlashSales = lazyRoute(() => import('../pages/FlashSales'));
const Affiliate = lazyRoute(() => import('../pages/Affiliate'));
const ShippingInfo = lazyRoute(() => import('../pages/ShippingInfo'));
const Warranty = lazyRoute(() => import('../pages/Warranty'));
const Privacy = lazyRoute(() => import('../pages/Privacy'));
const Terms = lazyRoute(() => import('../pages/Terms'));
const Returns = lazyRoute(() => import('../pages/Returns'));
const Refund = lazyRoute(() => import('../pages/Refund'));
const Notifications = lazyRoute(() => import('../pages/Notifications'));
const Payment = lazyRoute(() => import('../pages/Payment'));
const Help = lazyRoute(() => import('../pages/Help'));
const Guide = lazyRoute(() => import('../pages/Guide'));
const Shipping = lazyRoute(() => import('../pages/Shipping'));

const NotFound = lazyRoute(() => import('../pages/NotFound'));

// Component chứa routes và search functionality
function AppRoutes() {
  const { state, openSearch, closeSearch } = useSearch();

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/flash-sale" element={<FlashSalePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Các trang bị thiếu route */}
        <Route path="/brands" element={<Brands />} />
        <Route path="/brands/category/:categoryName" element={<Category />} />
        <Route path="/brand/:brandName" element={<Brands />} />
        <Route path="/category/:categoryName?" element={<Category />} />
        <Route path="/voucher" element={<Voucher />} />
        
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
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/order-success" element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        } />
        <Route path="/payment-result" element={
          <ProtectedRoute>
            <PaymentResult />
          </ProtectedRoute>
        } />
        <Route path="/orders/:orderId" element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />
        
        {/* Authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/free-shipping" element={<FreeShipping />} />
        
        {/* Các trang thông tin và dịch vụ */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/authentic" element={<Authentic />} />
        <Route path="/seller-center" element={<SellerCenter />} />
        <Route path="/flash-sales" element={<FlashSales />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/help" element={<Help />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <CartDrawer />
      <GlobalSearchModal isOpen={state.isSearchOpen} onClose={closeSearch} />
    </div>
  );
}

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <AppRoutes />
              </Suspense>
            </Layout>
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
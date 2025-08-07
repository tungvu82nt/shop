import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { SearchProvider, useSearch } from './contexts/SearchContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import { errorLogger } from '@/services/errorLogger'
import { InstallPWA, PWAUpdateNotification, NetworkStatus } from '@/components/pwa'
import { pwaService } from '@/services/pwaService'
import GlobalSearchModal from './components/search/GlobalSearchModal'
import CartDrawer from '@/components/cart/CartDrawer'
import { lazyRoute } from './utils/lazyImport'

// Lazy load các trang để tối ưu hiệu suất
const Home = lazyRoute(() => import('./pages/Home'))
const Profile = lazyRoute(() => import('./pages/Profile'))
const ProductDetail = lazyRoute(() => import('./pages/ProductDetail'))
const ProductSearch = lazyRoute(() => import('./pages/ProductSearch'))
const ProductList = lazyRoute(() => import('./pages/ProductList'))
const SearchPage = lazyRoute(() => import('./pages/SearchPage'))
const WishlistPage = lazyRoute(() => import('./pages/WishlistPage'))
const Cart = lazyRoute(() => import('./pages/Cart'))
const FlashSalePage = lazyRoute(() => import('./pages/FlashSale'))
const Checkout = lazyRoute(() => import('./pages/Checkout'))
const OrderSuccess = lazyRoute(() => import('./pages/OrderSuccess'))
const PaymentResult = lazyRoute(() => import('./pages/PaymentResult'))
const OrderDetailPage = lazyRoute(() => import('./pages/OrderDetailPage'))
const Admin = lazyRoute(() => import('./pages/Admin'))
const EmailVerification = lazyRoute(() => import('./pages/EmailVerification'))
const TermsOfService = lazyRoute(() => import('./pages/TermsOfService'))
const PrivacyPolicy = lazyRoute(() => import('./pages/PrivacyPolicy'))
const ReturnPolicy = lazyRoute(() => import('./pages/ReturnPolicy'))
const FreeShipping = lazyRoute(() => import('./pages/FreeShipping'))

// Các trang bị thiếu route
const Brands = lazyRoute(() => import('./pages/Brands'))
const Category = lazyRoute(() => import('./pages/Category'))
const Orders = lazyRoute(() => import('./pages/Orders'))
const Settings = lazyRoute(() => import('./pages/Settings'))
const Voucher = lazyRoute(() => import('./pages/Voucher'))

// Authentication pages
const LoginPage = lazyRoute(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazyRoute(() => import('./pages/auth/RegisterPage'))
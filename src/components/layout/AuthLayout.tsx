/**
 * YAPEE VIETNAM CLONE - AUTH LAYOUT
 * 
 * Layout component cho các trang authentication
 * Cung cấp UI chung và responsive design
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Star } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonLink?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  backButtonText = 'Về trang chủ',
  backButtonLink = '/'
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding & Features (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-orange-500 to-red-600 p-12 flex-col justify-between">
          {/* Logo */}
          <div>
            <Link to="/" className="inline-flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-orange-500 font-bold text-xl">Y</span>
              </div>
              <span className="text-2xl font-bold">Yapee</span>
            </Link>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                {title || 'Chào mừng đến với Yapee'}
              </h1>
              <p className="text-xl text-orange-100 mt-4 leading-relaxed">
                {subtitle || 'Nền tảng mua sắm trực tuyến hàng đầu Việt Nam'}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Bảo mật tuyệt đối</h3>
                  <p className="text-orange-100">Thông tin cá nhân được bảo vệ với công nghệ mã hóa tiên tiến</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Cộng đồng tin cậy</h3>
                  <p className="text-orange-100">Hơn 10 triệu người dùng tin tưởng và lựa chọn Yapee</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Trải nghiệm tuyệt vời</h3>
                  <p className="text-orange-100">Giao diện thân thiện, mua sắm dễ dàng, giao hàng nhanh chóng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10M+</div>
              <div className="text-orange-100 text-sm">Người dùng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1M+</div>
              <div className="text-orange-100 text-sm">Sản phẩm</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-orange-100 text-sm">Nhà bán</div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md lg:max-w-lg">
            {/* Back button */}
            {showBackButton && (
              <Link
                to={backButtonLink}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6 lg:mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{backButtonText}</span>
              </Link>
            )}

            {/* Mobile logo (visible on mobile only) */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Y</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">Yapee</span>
              </Link>
            </div>

            {/* Auth form content */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {children}
            </div>

            {/* Mobile features (visible on mobile only) */}
            <div className="lg:hidden mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Shield className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="text-sm">10M+ người dùng tin tưởng</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Star className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Trải nghiệm mua sắm tuyệt vời</span>
              </div>
            </div>

            {/* Footer links */}
            <div className="text-center mt-8 text-sm text-gray-500 space-x-4">
              <Link to="/terms" className="hover:text-orange-600 transition-colors">
                Điều khoản
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-orange-600 transition-colors">
                Bảo mật
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-orange-600 transition-colors">
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, Heart, LogOut, Settings, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import AuthModal from '@/components/auth/AuthModal'
import SearchBar from '@/components/product/SearchBar'
import { analytics } from '@/lib/analytics'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
  const { user, userProfile, signOut } = useAuth()
  const { state: cartState, toggleCart } = useCart()

  const handleSignOut = async () => {
    await signOut()
  }

  const openLoginModal = () => {
    setAuthModalTab('login')
    setIsAuthModalOpen(true)
  }

  const openRegisterModal = () => {
    setAuthModalTab('register')
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  // Xử lý click vào danh mục
  const handleCategoryClick = (category: string) => {
    analytics.track('navigation_click', {
      link_type: 'category',
      link_text: category,
      link_url: `/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
      source: 'header_menu'
    })
  }

  // Xử lý click vào navigation links
  const handleNavClick = (linkText: string, linkUrl: string) => {
    analytics.track('navigation_click', {
      link_type: 'navigation',
      link_text: linkText,
      link_url: linkUrl,
      source: 'header_nav'
    })
  }

  // Xử lý click vào giỏ hàng
  const handleCartClick = () => {
    analytics.track('cart_viewed', {
      cart_items: cartState.items.length,
      cart_value: cartState.total
    })
    toggleCart()
  }

  const categories = [
    'Điện thoại & Phụ kiện',
    'Máy tính & Laptop',
    'Thời trang nam',
    'Thời trang nữ',
    'Mẹ & Bé',
    'Nhà cửa & Đời sống',
    'Sách',
    'Thể thao & Du lịch',
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top bar */}
      <div className="bg-orange-500 text-white text-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>Kênh Người Bán</span>
              <span>Trở thành Người bán Yapee</span>
              <span>Tải ứng dụng</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Kết nối</span>
              <div className="flex space-x-2">
                <span>Facebook</span>
                <span>Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
              Yapee
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar placeholder="Tìm kiếm sản phẩm, thương hiệu và tên shop" />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="flex flex-col items-center">
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Yêu thích</span>
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs mt-1">Giỏ hàng</span>
              {cartState.totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {cartState.totalItems}
                </Badge>
              )}
            </Button>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url || ''} />
                      <AvatarFallback>
                        {userProfile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {userProfile?.full_name || 'Người dùng'}
                      </span>
                      <span className="text-xs text-gray-500">Tài khoản</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link to="/profile" className="w-full">Tài khoản của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="mr-2 h-4 w-4" />
                    <Link to="/orders" className="w-full">Đơn mua</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    <Link to="/wishlist" className="w-full">Sản phẩm yêu thích</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link to="/settings" className="w-full">Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-6 w-6" />
                    <span className="text-sm">Tài khoản</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={openLoginModal}>
                    Đăng nhập
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openRegisterModal}>
                    Đăng ký
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Categories navigation */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Menu className="h-4 w-4" />
                  <span>Danh mục</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {categories.map((category) => (
                  <DropdownMenuItem key={category}>
                    <Link 
                      to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="w-full"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/flash-sale" 
                className="text-sm hover:text-orange-500 transition-colors"
                onClick={() => handleNavClick('Flash Sale', '/flash-sale')}
              >
                Flash Sale
              </Link>
              <Link 
                to="/voucher" 
                className="text-sm hover:text-orange-500 transition-colors"
                onClick={() => handleNavClick('Voucher', '/voucher')}
              >
                Voucher
              </Link>
              <Link 
                to="/free-shipping" 
                className="text-sm hover:text-orange-500 transition-colors"
                onClick={() => handleNavClick('Miễn phí vận chuyển', '/free-shipping')}
              >
                Miễn phí vận chuyển
              </Link>
              <Link 
                to="/brands" 
                className="text-sm hover:text-orange-500 transition-colors"
                onClick={() => handleNavClick('Thương hiệu', '/brands')}
              >
                Thương hiệu
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        defaultTab={authModalTab}
      />
    </header>
  )
}

export default Header
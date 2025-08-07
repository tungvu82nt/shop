import { Search, ShoppingCart, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstallPWA } from "@/components/pwa";

const Header = () => {
  return (
    <header className="bg-background border-b shadow-sm">
      {/* Top notification bar */}
      <div className="bg-gradient-primary text-primary-foreground text-center py-2 text-sm">
        🚚 Freeship đơn từ 149K, giảm nhiều hơn cùng FREESHIP XTRA
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-primary">
              Yapee
              <span className="text-sm font-normal block text-muted-foreground leading-none">
                Tốt & Nhanh
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="search"
                placeholder="Freeship đơn từ 149K..."
                className="w-full pl-4 pr-12 py-3 border-2 border-primary/20 rounded-lg focus:border-primary"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md shadow-button"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <InstallPWA />
            
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <MapPin className="h-4 w-4 mr-1" />
              Giao đến
            </Button>
            
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <User className="h-4 w-4 mr-1" />
              Tài khoản
            </Button>
            
            <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-primary">
              <ShoppingCart className="h-4 w-4 mr-1" />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>

        {/* Service guarantees */}
        <div className="flex items-center justify-center space-x-8 py-3 border-t text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>100% hàng thật</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Freeship mọi đơn</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Hoàn 200% nếu hàng giả</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>30 ngày đổi trả</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Giao nhanh 2h</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Giá siêu rẻ</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
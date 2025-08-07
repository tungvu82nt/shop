import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { pwaService } from '@/services/pwaService';
import { useToast } from '@/hooks/use-toast';

/**
 * Component hiển thị banner/button cài đặt PWA
 */
const InstallPWA: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Đăng ký lắng nghe thay đổi trạng thái install
    const unsubscribe = pwaService.onInstallStateChange((installable) => {
      setCanInstall(installable);
      
      // Hiển thị banner sau 3 giây nếu có thể cài đặt
      if (installable) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Xử lý cài đặt PWA
   */
  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const success = await pwaService.showInstallPrompt();
      
      if (success) {
        toast({
          title: "Cài đặt thành công!",
          description: "Ứng dụng Yapee đã được cài đặt trên thiết bị của bạn.",
        });
        setShowBanner(false);
      } else {
        toast({
          title: "Cài đặt bị hủy",
          description: "Bạn có thể cài đặt ứng dụng bất cứ lúc nào từ menu trình duyệt.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Lỗi khi cài đặt PWA:', error);
      toast({
        title: "Lỗi cài đặt",
        description: "Không thể cài đặt ứng dụng. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsInstalling(false);
    }
  };

  /**
   * Đóng banner
   */
  const handleCloseBanner = () => {
    setShowBanner(false);
    // Lưu vào localStorage để không hiển thị lại trong session này
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // Kiểm tra xem banner đã bị dismiss chưa
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      // Hiển thị lại banner sau 24 giờ
      if (now - dismissedTime < 24 * 60 * 60 * 1000) {
        setShowBanner(false);
        return;
      }
    }
  }, []);

  // Không hiển thị gì nếu không thể cài đặt
  if (!canInstall) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
          <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    Cài đặt ứng dụng Yapee
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseBanner}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription className="text-xs text-gray-600">
                Trải nghiệm mua sắm nhanh hơn với ứng dụng di động
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {isInstalling ? 'Đang cài đặt...' : 'Cài đặt'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseBanner}
                  className="text-gray-600"
                >
                  Để sau
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Install Button in Header/Menu */}
      {!showBanner && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleInstall}
          disabled={isInstalling}
          className="hidden md:flex items-center space-x-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Cài đặt App</span>
        </Button>
      )}
    </>
  );
};

export default InstallPWA;
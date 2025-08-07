import React, { useState, useEffect } from 'react';
import { RefreshCw, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { pwaService } from '@/services/pwaService';
import { useToast } from '@/hooks/use-toast';

/**
 * Component thông báo cập nhật PWA
 */
const PWAUpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Lắng nghe sự kiện có cập nhật mới
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
      setShowNotification(true);
      
      toast({
        title: "Cập nhật mới có sẵn!",
        description: "Phiên bản mới của Yapee đã sẵn sàng để cài đặt.",
      });
    };

    // Đăng ký event listener cho service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          handleUpdateAvailable();
        }
      });
    }

    // Kiểm tra cập nhật khi component mount
    checkForUpdates();

    return () => {
      // Cleanup event listeners nếu cần
    };
  }, [toast]);

  /**
   * Kiểm tra cập nhật
   */
  const checkForUpdates = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra cập nhật:', error);
    }
  };

  /**
   * Áp dụng cập nhật
   */
  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      await pwaService.applyUpdate();
      
      toast({
        title: "Cập nhật thành công!",
        description: "Ứng dụng sẽ được tải lại để áp dụng phiên bản mới.",
      });
      
      // Reload trang sau 1 giây
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật ứng dụng. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      setIsUpdating(false);
    }
  };

  /**
   * Đóng thông báo
   */
  const handleClose = () => {
    setShowNotification(false);
  };

  /**
   * Hoãn cập nhật
   */
  const handlePostpone = () => {
    setShowNotification(false);
    // Hiển thị lại thông báo sau 30 phút
    setTimeout(() => {
      if (updateAvailable) {
        setShowNotification(true);
      }
    }, 30 * 60 * 1000);
  };

  // Không hiển thị gì nếu không có cập nhật
  if (!updateAvailable || !showNotification) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-lg border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">
                Cập nhật mới có sẵn
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-xs text-gray-600">
            Phiên bản mới của Yapee với nhiều tính năng và cải tiến
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription className="text-xs text-orange-800">
                Cập nhật ngay để trải nghiệm các tính năng mới nhất!
              </AlertDescription>
            </Alert>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                size="sm"
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật ngay'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePostpone}
                className="text-gray-600"
                disabled={isUpdating}
              >
                Để sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAUpdateNotification;
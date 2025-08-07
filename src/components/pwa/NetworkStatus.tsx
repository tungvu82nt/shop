import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { pwaService } from '@/services/pwaService';

interface NetworkInfo {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

/**
 * Component hiển thị trạng thái kết nối mạng
 */
const NetworkStatus: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({ online: navigator.onLine });
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Lấy thông tin mạng ban đầu
    const initialNetworkInfo = pwaService.getNetworkInfo();
    setNetworkInfo(initialNetworkInfo);

    // Đăng ký lắng nghe thay đổi trạng thái mạng
    const unsubscribe = pwaService.onNetworkChange((info) => {
      setNetworkInfo(info);
      
      // Hiển thị alert khi mất kết nối
      if (!info.online) {
        setShowOfflineAlert(true);
        setWasOffline(true);
      } else {
        // Ẩn alert khi có kết nối trở lại
        if (wasOffline) {
          setShowOfflineAlert(false);
          // Hiển thị thông báo kết nối lại trong 3 giây
          setTimeout(() => {
            setWasOffline(false);
          }, 3000);
        }
      }
    });

    return unsubscribe;
  }, [wasOffline]);

  /**
   * Lấy màu sắc dựa trên chất lượng kết nối
   */
  const getConnectionQuality = () => {
    if (!networkInfo.online) return { color: 'destructive', text: 'Offline' };
    
    const { effectiveType, downlink } = networkInfo;
    
    if (effectiveType === '4g' || (downlink && downlink > 1.5)) {
      return { color: 'default', text: 'Tốt' };
    } else if (effectiveType === '3g' || (downlink && downlink > 0.5)) {
      return { color: 'secondary', text: 'Trung bình' };
    } else {
      return { color: 'destructive', text: 'Chậm' };
    }
  };

  /**
   * Lấy icon phù hợp
   */
  const getNetworkIcon = () => {
    if (!networkInfo.online) {
      return <WifiOff className="w-4 h-4" />;
    }
    
    const quality = getConnectionQuality();
    if (quality.color === 'destructive') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    
    return <Wifi className="w-4 h-4" />;
  };

  const quality = getConnectionQuality();

  return (
    <>
      {/* Offline Alert */}
      {showOfflineAlert && !networkInfo.online && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Alert className="rounded-none border-red-200 bg-red-50 border-b">
            <WifiOff className="w-4 h-4" />
            <AlertDescription className="text-red-800">
              <strong>Không có kết nối internet.</strong> Một số tính năng có thể không hoạt động.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Reconnected Alert */}
      {wasOffline && networkInfo.online && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Alert className="rounded-none border-green-200 bg-green-50 border-b">
            <Wifi className="w-4 h-4" />
            <AlertDescription className="text-green-800">
              <strong>Đã kết nối lại internet.</strong> Tất cả tính năng đã hoạt động bình thường.
            </AlertDescription>
          </Alert>
        </div>
      )}




    </>
  );
};

export default NetworkStatus;
import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, ShoppingCart, Heart, Star, Settings, Save, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  email: boolean;
  push: boolean;
  sms: boolean;
  category: 'order' | 'marketing' | 'account' | 'social';
}

interface NotificationSettingsProps {
  onSave?: (preferences: NotificationPreference[]) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    // Order & Shopping notifications
    {
      id: 'order_confirmation',
      name: 'Xác nhận đơn hàng',
      description: 'Thông báo khi đơn hàng được xác nhận',
      icon: <ShoppingCart className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'order'
    },
    {
      id: 'order_shipped',
      name: 'Đơn hàng đã giao',
      description: 'Thông báo khi đơn hàng được giao cho đơn vị vận chuyển',
      icon: <ShoppingCart className="h-4 w-4" />,
      email: true,
      push: true,
      sms: true,
      category: 'order'
    },
    {
      id: 'order_delivered',
      name: 'Giao hàng thành công',
      description: 'Thông báo khi đơn hàng được giao thành công',
      icon: <Check className="h-4 w-4" />,
      email: true,
      push: true,
      sms: true,
      category: 'order'
    },
    {
      id: 'order_cancelled',
      name: 'Đơn hàng bị hủy',
      description: 'Thông báo khi đơn hàng bị hủy',
      icon: <X className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'order'
    },
    {
      id: 'payment_success',
      name: 'Thanh toán thành công',
      description: 'Thông báo khi thanh toán được xử lý thành công',
      icon: <Check className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'order'
    },
    {
      id: 'payment_failed',
      name: 'Thanh toán thất bại',
      description: 'Thông báo khi thanh toán không thành công',
      icon: <X className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'order'
    },
    
    // Marketing notifications
    {
      id: 'promotions',
      name: 'Khuyến mãi & Ưu đãi',
      description: 'Thông báo về các chương trình khuyến mãi mới',
      icon: <Star className="h-4 w-4" />,
      email: true,
      push: false,
      sms: false,
      category: 'marketing'
    },
    {
      id: 'new_products',
      name: 'Sản phẩm mới',
      description: 'Thông báo về sản phẩm mới được thêm vào',
      icon: <ShoppingCart className="h-4 w-4" />,
      email: false,
      push: false,
      sms: false,
      category: 'marketing'
    },
    {
      id: 'price_drops',
      name: 'Giảm giá sản phẩm',
      description: 'Thông báo khi sản phẩm trong wishlist giảm giá',
      icon: <Heart className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'marketing'
    },
    {
      id: 'back_in_stock',
      name: 'Hàng về kho',
      description: 'Thông báo khi sản phẩm hết hàng được nhập lại',
      icon: <ShoppingCart className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'marketing'
    },
    
    // Account notifications
    {
      id: 'security_alerts',
      name: 'Cảnh báo bảo mật',
      description: 'Thông báo về hoạt động đăng nhập bất thường',
      icon: <Settings className="h-4 w-4" />,
      email: true,
      push: true,
      sms: true,
      category: 'account'
    },
    {
      id: 'password_changed',
      name: 'Thay đổi mật khẩu',
      description: 'Thông báo khi mật khẩu được thay đổi',
      icon: <Settings className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'account'
    },
    {
      id: 'profile_updated',
      name: 'Cập nhật hồ sơ',
      description: 'Thông báo khi thông tin hồ sơ được cập nhật',
      icon: <Settings className="h-4 w-4" />,
      email: false,
      push: false,
      sms: false,
      category: 'account'
    },
    
    // Social notifications
    {
      id: 'review_responses',
      name: 'Phản hồi đánh giá',
      description: 'Thông báo khi có phản hồi cho đánh giá của bạn',
      icon: <MessageSquare className="h-4 w-4" />,
      email: true,
      push: true,
      sms: false,
      category: 'social'
    },
    {
      id: 'review_reminders',
      name: 'Nhắc nhở đánh giá',
      description: 'Nhắc nhở đánh giá sản phẩm đã mua',
      icon: <Star className="h-4 w-4" />,
      email: true,
      push: false,
      sms: false,
      category: 'social'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user preferences on component mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/notification-preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }
    } catch (err) {
      console.error('Failed to load notification preferences:', err);
    }
  };

  const updatePreference = (id: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id 
          ? { ...pref, [channel]: value }
          : pref
      )
    );
    setHasChanges(true);
    setError(null);
  };

  const toggleAllForCategory = (category: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.category === category 
          ? { ...pref, [channel]: value }
          : pref
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/notification-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Thành công!',
          description: 'Cài đặt thông báo đã được lưu.',
        });
        setHasChanges(false);
        onSave?.(preferences);
      } else {
        setError(data.message || 'Không thể lưu cài đặt');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'order': return 'Đơn hàng & Thanh toán';
      case 'marketing': return 'Marketing & Khuyến mãi';
      case 'account': return 'Tài khoản & Bảo mật';
      case 'social': return 'Tương tác xã hội';
      default: return category;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'order': return 'Thông báo về trạng thái đơn hàng và thanh toán';
      case 'marketing': return 'Thông báo về khuyến mãi và sản phẩm mới';
      case 'account': return 'Thông báo về bảo mật và cập nhật tài khoản';
      case 'social': return 'Thông báo về đánh giá và tương tác';
      default: return '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'order': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'account': return 'bg-red-100 text-red-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = [];
    }
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, NotificationPreference[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Cài đặt thông báo</CardTitle>
                <CardDescription>
                  Quản lý cách bạn nhận thông báo từ hệ thống
                </CardDescription>
              </div>
            </div>
            
            {hasChanges && (
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu...</span>
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <X className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Channel Headers */}
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-sm text-gray-700">Loại thông báo</div>
            <div className="flex items-center justify-center space-x-1">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Email</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Push</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">SMS</span>
            </div>
          </div>

          {/* Notification Categories */}
          <div className="space-y-6">
            {Object.entries(groupedPreferences).map(([category, categoryPrefs]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getCategoryColor(category)}>
                      {getCategoryTitle(category)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {getCategoryDescription(category)}
                    </span>
                  </div>
                  
                  {/* Category Toggle All */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span>Tất cả:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllForCategory(category, 'email', true)}
                    >
                      Bật Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllForCategory(category, 'push', true)}
                    >
                      Bật Push
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {categoryPrefs.map((pref) => (
                    <div key={pref.id} className="grid grid-cols-4 gap-4 items-center p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="p-1 bg-gray-100 rounded">
                          {pref.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{pref.name}</div>
                          <div className="text-xs text-gray-600">{pref.description}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Switch
                          checked={pref.email}
                          onCheckedChange={(checked) => updatePreference(pref.id, 'email', checked)}
                        />
                      </div>
                      
                      <div className="flex justify-center">
                        <Switch
                          checked={pref.push}
                          onCheckedChange={(checked) => updatePreference(pref.id, 'push', checked)}
                        />
                      </div>
                      
                      <div className="flex justify-center">
                        <Switch
                          checked={pref.sms}
                          onCheckedChange={(checked) => updatePreference(pref.id, 'sms', checked)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {category !== 'social' && <Separator />}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Tóm tắt cài đặt:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2">
                  {preferences.filter(p => p.email).length}/{preferences.length} loại
                </span>
              </div>
              <div>
                <span className="font-medium">Push:</span>
                <span className="ml-2">
                  {preferences.filter(p => p.push).length}/{preferences.length} loại
                </span>
              </div>
              <div>
                <span className="font-medium">SMS:</span>
                <span className="ml-2">
                  {preferences.filter(p => p.sms).length}/{preferences.length} loại
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;

// Hook để sử dụng notification settings
export const useNotificationSettings = () => {
  const { toast } = useToast();
  
  const updateNotificationPreferences = async (preferences: NotificationPreference[]): Promise<void> => {
    const response = await fetch('/api/user/notification-preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ preferences }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Update notification preferences failed');
    }
    
    return data;
  };
  
  const getNotificationPreferences = async (): Promise<NotificationPreference[]> => {
    const response = await fetch('/api/user/notification-preferences', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Get notification preferences failed');
    }
    
    return data.preferences || [];
  };
  
  return {
    updateNotificationPreferences,
    getNotificationPreferences,
  };
};
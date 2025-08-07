import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Bell, ShoppingCart, CreditCard, Truck, Gift, Star, AlertTriangle, Settings, Check, X, Filter, Search, Calendar, Clock, Mail, Smartphone, Volume2, VolumeX } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

const Notifications = () => {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const notificationTypes = [
    {
      type: 'order',
      label: 'Đơn hàng',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      count: 12
    },
    {
      type: 'payment',
      label: 'Thanh toán',
      icon: CreditCard,
      color: 'bg-green-500',
      count: 5
    },
    {
      type: 'shipping',
      label: 'Vận chuyển',
      icon: Truck,
      color: 'bg-orange-500',
      count: 8
    },
    {
      type: 'promotion',
      label: 'Khuyến mãi',
      icon: Gift,
      color: 'bg-purple-500',
      count: 15
    },
    {
      type: 'review',
      label: 'Đánh giá',
      icon: Star,
      color: 'bg-yellow-500',
      count: 3
    },
    {
      type: 'system',
      label: 'Hệ thống',
      icon: AlertTriangle,
      color: 'bg-red-500',
      count: 2
    }
  ]

  const notifications = [
    {
      id: '1',
      type: 'order',
      title: 'Đơn hàng #YP123456 đã được xác nhận',
      message: 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị. Dự kiến giao hàng trong 2-3 ngày.',
      time: '2 phút trước',
      isRead: false,
      priority: 'high',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/orders/YP123456'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Thanh toán thành công',
      message: 'Bạn đã thanh toán thành công 299.000đ cho đơn hàng #YP123455. Cảm ơn bạn đã mua sắm tại Yapee!',
      time: '15 phút trước',
      isRead: false,
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/orders/YP123455'
    },
    {
      id: '3',
      type: 'shipping',
      title: 'Đơn hàng đang được giao',
      message: 'Đơn hàng #YP123454 đang trên đường giao đến bạn. Shipper sẽ liên hệ trong 30 phút tới.',
      time: '1 giờ trước',
      isRead: true,
      priority: 'high',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/tracking/YP123454'
    },
    {
      id: '4',
      type: 'promotion',
      title: 'Flash Sale 12.12 - Giảm đến 70%',
      message: 'Siêu sale cuối năm đã bắt đầu! Hàng ngàn sản phẩm giảm giá sốc. Mua ngay kẻo lỡ!',
      time: '2 giờ trước',
      isRead: false,
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/flash-sales'
    },
    {
      id: '5',
      type: 'review',
      title: 'Đánh giá sản phẩm đã mua',
      message: 'Hãy chia sẻ trải nghiệm về sản phẩm "iPhone 15 Pro Max" để giúp người mua khác.',
      time: '3 giờ trước',
      isRead: true,
      priority: 'low',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/reviews/create'
    },
    {
      id: '6',
      type: 'system',
      title: 'Bảo trì hệ thống',
      message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai. Một số tính năng có thể bị gián đoạn.',
      time: '1 ngày trước',
      isRead: true,
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/system-status'
    },
    {
      id: '7',
      type: 'order',
      title: 'Đơn hàng đã được giao thành công',
      message: 'Đơn hàng #YP123453 đã được giao thành công. Cảm ơn bạn đã tin tưởng Yapee!',
      time: '2 ngày trước',
      isRead: true,
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/orders/YP123453'
    },
    {
      id: '8',
      type: 'promotion',
      title: 'Voucher 100K cho lần mua tiếp theo',
      message: 'Chúc mừng! Bạn nhận được voucher giảm 100.000đ cho đơn hàng từ 500.000đ. Có hiệu lực đến 31/12.',
      time: '3 ngày trước',
      isRead: false,
      priority: 'high',
      avatar: '/api/placeholder/40/40',
      actionUrl: '/vouchers'
    }
  ]

  const notificationSettings = [
    {
      category: 'Đơn hàng',
      icon: ShoppingCart,
      settings: [
        { id: 'order_confirmed', label: 'Xác nhận đơn hàng', email: true, push: true, sms: false },
        { id: 'order_shipped', label: 'Đơn hàng được giao', email: true, push: true, sms: true },
        { id: 'order_delivered', label: 'Giao hàng thành công', email: true, push: true, sms: false },
        { id: 'order_cancelled', label: 'Hủy đơn hàng', email: true, push: true, sms: false }
      ]
    },
    {
      category: 'Thanh toán',
      icon: CreditCard,
      settings: [
        { id: 'payment_success', label: 'Thanh toán thành công', email: true, push: true, sms: true },
        { id: 'payment_failed', label: 'Thanh toán thất bại', email: true, push: true, sms: false },
        { id: 'refund_processed', label: 'Hoàn tiền thành công', email: true, push: true, sms: false }
      ]
    },
    {
      category: 'Khuyến mãi',
      icon: Gift,
      settings: [
        { id: 'flash_sale', label: 'Flash Sale', email: true, push: true, sms: false },
        { id: 'voucher_received', label: 'Nhận voucher mới', email: true, push: true, sms: false },
        { id: 'price_drop', label: 'Giảm giá sản phẩm yêu thích', email: true, push: false, sms: false },
        { id: 'birthday_offer', label: 'Ưu đãi sinh nhật', email: true, push: true, sms: false }
      ]
    },
    {
      category: 'Tài khoản',
      icon: Settings,
      settings: [
        { id: 'login_new_device', label: 'Đăng nhập thiết bị mới', email: true, push: true, sms: true },
        { id: 'password_changed', label: 'Thay đổi mật khẩu', email: true, push: true, sms: false },
        { id: 'profile_updated', label: 'Cập nhật thông tin', email: false, push: true, sms: false }
      ]
    }
  ]

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.type === type)
    return typeConfig ? typeConfig.icon : Bell
  }

  const getTypeColor = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.type === type)
    return typeConfig ? typeConfig.color : 'bg-gray-500'
  }

  return (
    <Layout>
      <Helmet>
        <title>Thông báo - Yapee</title>
        <meta name="description" content="Quản lý thông báo và cài đặt thông báo tại Yapee. Theo dõi đơn hàng, khuyến mãi và cập nhật hệ thống." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Bell className="w-8 h-8 mr-3" />
              Thông báo
              {unreadCount > 0 && (
                <Badge className="ml-3 bg-red-500">
                  {unreadCount} chưa đọc
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý thông báo và cài đặt nhận thông báo
            </p>
          </div>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Button>
        </div>

        {/* Notification Types Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {notificationTypes.map((type) => {
            const IconComponent = type.icon
            return (
              <Card 
                key={type.type} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  filterType === type.type ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setFilterType(filterType === type.type ? 'all' : type.type)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-semibold text-sm">{type.label}</div>
                  <Badge variant="secondary" className="mt-1">
                    {type.count}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt thông báo</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Tìm kiếm thông báo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {notificationTypes.map(type => (
                          <SelectItem key={type.type} value={type.type}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {filteredNotifications.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedNotifications.length === filteredNotifications.length}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm text-gray-600">
                        {selectedNotifications.length > 0 
                          ? `Đã chọn ${selectedNotifications.length} thông báo`
                          : 'Chọn tất cả'
                        }
                      </span>
                    </div>
                    {selectedNotifications.length > 0 && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Check className="w-4 h-4 mr-1" />
                          Đánh dấu đã đọc
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      Không có thông báo nào
                    </h3>
                    <p className="text-gray-400">
                      {searchQuery || filterType !== 'all' 
                        ? 'Không tìm thấy thông báo phù hợp với bộ lọc'
                        : 'Bạn chưa có thông báo nào'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => {
                  const IconComponent = getTypeIcon(notification.type)
                  return (
                    <Card 
                      key={notification.id} 
                      className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                        getPriorityColor(notification.priority)
                      } ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            checked={selectedNotifications.includes(notification.id)}
                            onCheckedChange={() => handleSelectNotification(notification.id)}
                          />
                          
                          <div className={`w-10 h-10 ${getTypeColor(notification.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`font-semibold text-lg mb-2 ${
                                  !notification.isRead ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                  {!notification.isRead && (
                                    <Badge className="ml-2 bg-blue-500 text-xs">
                                      Mới
                                    </Badge>
                                  )}
                                </h4>
                                <p className="text-gray-600 mb-3 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {notification.time}
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      notification.priority === 'high' ? 'border-red-300 text-red-600' :
                                      notification.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                                      'border-green-300 text-green-600'
                                    }`}
                                  >
                                    {notification.priority === 'high' ? 'Quan trọng' :
                                     notification.priority === 'medium' ? 'Bình thường' : 'Thấp'}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 ml-4">
                                {!notification.isRead && (
                                  <Button size="sm" variant="ghost">
                                    <Check className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>

            {/* Load More */}
            {filteredNotifications.length > 0 && (
              <div className="text-center">
                <Button variant="outline">
                  Xem thêm thông báo
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thông báo</CardTitle>
                <CardDescription>
                  Tùy chỉnh cách bạn nhận thông báo từ Yapee
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Global Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cài đặt chung</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Nhận tất cả thông báo</div>
                          <div className="text-sm text-gray-500">Bật/tắt tất cả thông báo từ Yapee</div>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Âm thanh thông báo</div>
                          <div className="text-sm text-gray-500">Phát âm thanh khi có thông báo mới</div>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Thông báo trên màn hình khóa</div>
                          <div className="text-sm text-gray-500">Hiển thị thông báo khi điện thoại bị khóa</div>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Detailed Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cài đặt chi tiết</h3>
                  <div className="space-y-6">
                    {notificationSettings.map((category, index) => {
                      const IconComponent = category.icon
                      return (
                        <div key={index}>
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <h4 className="font-semibold">{category.category}</h4>
                          </div>
                          
                          <div className="ml-11 space-y-4">
                            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 mb-2">
                              <div>Loại thông báo</div>
                              <div className="text-center">Email</div>
                              <div className="text-center">Push</div>
                              <div className="text-center">SMS</div>
                            </div>
                            
                            {category.settings.map((setting, settingIndex) => (
                              <div key={settingIndex} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0">
                                <div className="text-sm">{setting.label}</div>
                                <div className="flex justify-center">
                                  <Switch defaultChecked={setting.email} />
                                </div>
                                <div className="flex justify-center">
                                  <Switch defaultChecked={setting.push} />
                                </div>
                                <div className="flex justify-center">
                                  <Switch defaultChecked={setting.sms} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Quiet Hours */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Giờ im lặng</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Bật giờ im lặng</div>
                        <div className="text-sm text-gray-500">Không nhận thông báo trong khoảng thời gian này</div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quiet-start">Bắt đầu</Label>
                        <Input id="quiet-start" type="time" defaultValue="22:00" />
                      </div>
                      <div>
                        <Label htmlFor="quiet-end">Kết thúc</Label>
                        <Input id="quiet-end" type="time" defaultValue="07:00" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button variant="outline">Hủy</Button>
                  <Button>Lưu cài đặt</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default Notifications
import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Settings as SettingsIcon, User, Bell, Shield, Globe, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const Settings = () => {
  return (
    <Layout>
      <Helmet>
        <title>Cài đặt - Yapee</title>
        <meta name="description" content="Cài đặt tài khoản và ứng dụng Yapee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <SettingsIcon className="w-6 h-6 mr-2" />
          Cài đặt
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin tài khoản */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin tài khoản
              </CardTitle>
              <CardDescription>
                Quản lý thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Chỉnh sửa hồ sơ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Xác thực hai bước
              </Button>
            </CardContent>
          </Card>

          {/* Thông báo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Thông báo
              </CardTitle>
              <CardDescription>
                Tùy chỉnh thông báo bạn muốn nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Thông báo email</Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Thông báo đẩy</Label>
                <Switch id="push-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">Thông báo SMS</Label>
                <Switch id="sms-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing-notifications">Thông báo khuyến mãi</Label>
                <Switch id="marketing-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Bảo mật */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Bảo mật
              </CardTitle>
              <CardDescription>
                Cài đặt bảo mật cho tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Quản lý thiết bị đăng nhập
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Lịch sử hoạt động
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Cài đặt quyền riêng tư
              </Button>
            </CardContent>
          </Card>

          {/* Thanh toán */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Thanh toán
              </CardTitle>
              <CardDescription>
                Quản lý phương thức thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Thẻ tín dụng/ghi nợ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Ví điện tử
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Tài khoản ngân hàng
              </Button>
            </CardContent>
          </Card>

          {/* Ngôn ngữ và khu vực */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Ngôn ngữ và khu vực
              </CardTitle>
              <CardDescription>
                Tùy chỉnh ngôn ngữ và khu vực hiển thị
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <select id="language" className="w-full mt-1 p-2 border rounded-md">
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="currency">Tiền tệ</Label>
                  <select id="currency" className="w-full mt-1 p-2 border rounded-md">
                    <option value="vnd">VND (₫)</option>
                    <option value="usd">USD ($)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <Button className="mr-4">Lưu thay đổi</Button>
          <Button variant="outline">Hủy</Button>
        </div>
      </div>
    </Layout>
  )
}

export default Settings
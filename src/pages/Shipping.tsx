import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Truck, Clock, MapPin, Package, Shield, Calculator } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Shipping = () => {
  const shippingOptions = [
    {
      name: 'Giao hàng tiêu chuẩn',
      time: '3-5 ngày làm việc',
      price: 'Miễn phí',
      description: 'Cho đơn hàng từ 150.000đ',
      icon: Package,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      name: 'Giao hàng nhanh',
      time: '1-2 ngày làm việc',
      price: '25.000đ',
      description: 'Giao hàng trong ngày tại TP.HCM và Hà Nội',
      icon: Truck,
      color: 'bg-green-50 border-green-200'
    },
    {
      name: 'Giao hàng hỏa tốc',
      time: '2-4 giờ',
      price: '45.000đ',
      description: 'Chỉ áp dụng trong nội thành',
      icon: Clock,
      color: 'bg-orange-50 border-orange-200'
    }
  ]

  const shippingPartners = [
    { name: 'Giao Hàng Nhanh', logo: '/api/placeholder/100/40', coverage: 'Toàn quốc' },
    { name: 'Giao Hàng Tiết Kiệm', logo: '/api/placeholder/100/40', coverage: 'Toàn quốc' },
    { name: 'Viettel Post', logo: '/api/placeholder/100/40', coverage: 'Toàn quốc' },
    { name: 'J&T Express', logo: '/api/placeholder/100/40', coverage: 'Toàn quốc' },
    { name: 'Ninja Van', logo: '/api/placeholder/100/40', coverage: '63 tỉnh thành' },
    { name: 'Best Express', logo: '/api/placeholder/100/40', coverage: 'Khu vực phía Nam' }
  ]

  const deliveryZones = [
    {
      zone: 'Nội thành TP.HCM',
      areas: ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Phú Nhuận'],
      standardTime: '1-2 ngày',
      fastTime: '4-6 giờ',
      expressTime: '2-4 giờ'
    },
    {
      zone: 'Nội thành Hà Nội',
      areas: ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Cầu Giấy', 'Thanh Xuân'],
      standardTime: '1-2 ngày',
      fastTime: '4-6 giờ',
      expressTime: '2-4 giờ'
    },
    {
      zone: 'Các tỉnh thành khác',
      areas: ['Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Đà Lạt', 'Vũng Tàu'],
      standardTime: '2-3 ngày',
      fastTime: '1-2 ngày',
      expressTime: 'Không hỗ trợ'
    },
    {
      zone: 'Vùng sâu vùng xa',
      areas: ['Các huyện miền núi', 'Đảo xa', 'Vùng biên giới'],
      standardTime: '4-7 ngày',
      fastTime: '3-5 ngày',
      expressTime: 'Không hỗ trợ'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Thông tin vận chuyển - Yapee</title>
        <meta name="description" content="Thông tin chi tiết về các phương thức vận chuyển và giao hàng của Yapee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Truck className="w-8 h-8 mr-3 text-blue-500" />
            Thông tin vận chuyển
          </h1>
          <p className="text-gray-600">Giao hàng nhanh chóng, an toàn đến tận tay bạn</p>
        </div>

        {/* Shipping Calculator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Tính phí vận chuyển
            </CardTitle>
            <CardDescription>
              Nhập thông tin để tính phí vận chuyển chính xác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tỉnh/Thành phố</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh thành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="hn">Hà Nội</SelectItem>
                    <SelectItem value="dn">Đà Nẵng</SelectItem>
                    <SelectItem value="ct">Cần Thơ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quận/Huyện</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1">Quận 1</SelectItem>
                    <SelectItem value="q3">Quận 3</SelectItem>
                    <SelectItem value="q7">Quận 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Khối lượng (kg)</label>
                <Input type="number" placeholder="0.5" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Tính phí</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Các phương thức vận chuyển</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <Card key={index} className={`${option.color} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{option.name}</h3>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Badge variant="outline">{option.time}</Badge>
                        <Badge className="bg-green-100 text-green-800">{option.price}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Delivery Zones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Thời gian giao hàng theo khu vực
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Khu vực</th>
                    <th className="text-left p-3 font-medium">Giao hàng tiêu chuẩn</th>
                    <th className="text-left p-3 font-medium">Giao hàng nhanh</th>
                    <th className="text-left p-3 font-medium">Giao hàng hỏa tốc</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryZones.map((zone, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{zone.zone}</div>
                          <div className="text-sm text-gray-500">
                            {zone.areas.slice(0, 3).join(', ')}
                            {zone.areas.length > 3 && '...'}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{zone.standardTime}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{zone.fastTime}</Badge>
                      </td>
                      <td className="p-3">
                        {zone.expressTime === 'Không hỗ trợ' ? (
                          <Badge variant="secondary">{zone.expressTime}</Badge>
                        ) : (
                          <Badge variant="outline">{zone.expressTime}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Partners */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Đối tác vận chuyển</CardTitle>
            <CardDescription>
              Yapee hợp tác với các đơn vị vận chuyển uy tín hàng đầu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {shippingPartners.map((partner, index) => (
                <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="h-10 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <img src={partner.logo} alt={partner.name} className="max-h-8" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{partner.name}</h4>
                  <p className="text-xs text-gray-500">{partner.coverage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Chính sách vận chuyển
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Cam kết của Yapee</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Miễn phí vận chuyển cho đơn hàng từ 150.000đ</li>
                  <li>• Bảo hiểm hàng hóa trong quá trình vận chuyển</li>
                  <li>• Hỗ trợ theo dõi đơn hàng 24/7</li>
                  <li>• Đền bù 100% nếu hàng bị thất lạc</li>
                  <li>• Giao hàng đúng hẹn hoặc hoàn phí ship</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Lưu ý quan trọng</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Kiểm tra hàng trước khi thanh toán (COD)</li>
                  <li>• Từ chối nhận hàng nếu bao bì bị hư hỏng</li>
                  <li>• Thời gian giao hàng có thể chậm hơn vào dịp lễ</li>
                  <li>• Một số khu vực có thể phát sinh phí vận chuyển</li>
                  <li>• Liên hệ hotline nếu cần hỗ trợ gấp</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Shipping
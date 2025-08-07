import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Truck, Clock, MapPin, Package, Shield, Phone, Calculator, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ShippingInfo = () => {
  const shippingMethods = [
    {
      id: 'standard',
      name: 'Giao hàng tiêu chuẩn',
      icon: Truck,
      time: '3-5 ngày làm việc',
      fee: 'Miễn phí',
      description: 'Áp dụng cho đơn hàng từ 150.000đ',
      features: ['Theo dõi đơn hàng', 'Bảo hiểm hàng hóa', 'Giao tận nơi']
    },
    {
      id: 'fast',
      name: 'Giao hàng nhanh',
      icon: Package,
      time: '1-2 ngày làm việc',
      fee: '25.000đ',
      description: 'Giao hàng trong ngày tại TP.HCM và Hà Nội',
      features: ['Ưu tiên xử lý', 'Giao trong ngày', 'SMS thông báo']
    },
    {
      id: 'express',
      name: 'Giao hàng hỏa tốc',
      icon: Clock,
      time: '2-4 giờ',
      fee: '50.000đ',
      description: 'Chỉ áp dụng tại nội thành TP.HCM và Hà Nội',
      features: ['Giao trong 4h', 'Gọi trước khi giao', 'Ưu tiên cao nhất']
    }
  ]

  const deliveryAreas = [
    {
      area: 'Nội thành TP.HCM',
      standard: '1-2 ngày',
      fast: 'Trong ngày',
      express: '2-4 giờ',
      fee: 'Miễn phí'
    },
    {
      area: 'Nội thành Hà Nội',
      standard: '1-2 ngày',
      fast: 'Trong ngày',
      express: '2-4 giờ',
      fee: 'Miễn phí'
    },
    {
      area: 'Các tỉnh thành khác',
      standard: '3-5 ngày',
      fast: '2-3 ngày',
      express: 'Không hỗ trợ',
      fee: '15.000-30.000đ'
    },
    {
      area: 'Vùng sâu, vùng xa',
      standard: '5-7 ngày',
      fast: '3-5 ngày',
      express: 'Không hỗ trợ',
      fee: '30.000-50.000đ'
    }
  ]

  const shippingPartners = [
    {
      name: 'Giao Hàng Nhanh (GHN)',
      logo: '/api/placeholder/80/40',
      coverage: 'Toàn quốc',
      specialty: 'Giao hàng nhanh, COD'
    },
    {
      name: 'Giao Hàng Tiết Kiệm (GHTK)',
      logo: '/api/placeholder/80/40',
      coverage: 'Toàn quốc',
      specialty: 'Giá cả hợp lý'
    },
    {
      name: 'Viettel Post',
      logo: '/api/placeholder/80/40',
      coverage: 'Toàn quốc',
      specialty: 'Mạng lưới rộng khắp'
    },
    {
      name: 'Vietnam Post',
      logo: '/api/placeholder/80/40',
      coverage: 'Toàn quốc',
      specialty: 'Vùng sâu, vùng xa'
    },
    {
      name: 'J&T Express',
      logo: '/api/placeholder/80/40',
      coverage: 'Thành phố lớn',
      specialty: 'Giao hàng nhanh'
    },
    {
      name: 'Best Express',
      logo: '/api/placeholder/80/40',
      coverage: 'Miền Nam',
      specialty: 'Dịch vụ chuyên nghiệp'
    }
  ]

  const shippingPolicies = [
    {
      title: 'Miễn phí vận chuyển',
      description: 'Đơn hàng từ 150.000đ được miễn phí giao hàng tiêu chuẩn toàn quốc',
      icon: Shield
    },
    {
      title: 'Bảo hiểm hàng hóa',
      description: 'Tất cả đơn hàng được bảo hiểm 100% giá trị trong quá trình vận chuyển',
      icon: Shield
    },
    {
      title: 'Theo dõi đơn hàng',
      description: 'Cập nhật trạng thái đơn hàng real-time qua SMS và email',
      icon: MapPin
    },
    {
      title: 'Giao hàng tận nơi',
      description: 'Giao hàng tận tay khách hàng, hỗ trợ kiểm tra hàng trước khi nhận',
      icon: CheckCircle
    }
  ]

  const faqs = [
    {
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer: 'Bạn có thể theo dõi đơn hàng qua mã vận đơn được gửi trong email xác nhận hoặc truy cập mục "Đơn hàng của tôi" trong tài khoản.'
    },
    {
      question: 'Tôi có thể thay đổi địa chỉ giao hàng không?',
      answer: 'Bạn có thể thay đổi địa chỉ giao hàng trong vòng 2 giờ sau khi đặt hàng bằng cách liên hệ hotline hoặc chat với CSKH.'
    },
    {
      question: 'Điều gì xảy ra nếu tôi không có mặt khi giao hàng?',
      answer: 'Shipper sẽ gọi điện trước khi giao. Nếu không liên lạc được, đơn hàng sẽ được giao lại lần 2. Sau 3 lần giao không thành công, đơn hàng sẽ được hoàn về kho.'
    },
    {
      question: 'Phí COD (thu hộ) là bao nhiêu?',
      answer: 'Phí COD là 15.000đ cho đơn hàng dưới 500.000đ và miễn phí cho đơn hàng từ 500.000đ trở lên.'
    },
    {
      question: 'Tôi có thể hẹn giờ giao hàng không?',
      answer: 'Hiện tại chúng tôi chưa hỗ trợ hẹn giờ cụ thể. Tuy nhiên, bạn có thể để lại ghi chú về khung giờ thuận tiện và shipper sẽ cố gắng sắp xếp.'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Thông tin vận chuyển - Yapee</title>
        <meta name="description" content="Thông tin chi tiết về chính sách vận chuyển, phí ship, thời gian giao hàng và các đối tác vận chuyển của Yapee." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Thông tin vận chuyển</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến dịch vụ vận chuyển nhanh chóng, an toàn và tiện lợi nhất cho khách hàng
          </p>
        </div>

        {/* Shipping Methods */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Phương thức vận chuyển</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingMethods.map((method) => {
              const IconComponent = method.icon
              return (
                <Card key={method.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{method.name}</CardTitle>
                    <div className="flex justify-center space-x-4">
                      <Badge variant="outline">{method.time}</Badge>
                      <Badge className="bg-green-500">{method.fee}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-center">{method.description}</p>
                    <ul className="space-y-2">
                      {method.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Thời gian giao hàng theo khu vực</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Khu vực</th>
                      <th className="px-6 py-4 text-center font-bold">Tiêu chuẩn</th>
                      <th className="px-6 py-4 text-center font-bold">Nhanh</th>
                      <th className="px-6 py-4 text-center font-bold">Hỏa tốc</th>
                      <th className="px-6 py-4 text-center font-bold">Phí ship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryAreas.map((area, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-6 py-4 font-medium">{area.area}</td>
                        <td className="px-6 py-4 text-center">{area.standard}</td>
                        <td className="px-6 py-4 text-center">{area.fast}</td>
                        <td className="px-6 py-4 text-center">{area.express}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={area.fee === 'Miễn phí' ? 'default' : 'outline'}>
                            {area.fee}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Calculator */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Tính phí vận chuyển</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Công cụ tính phí ship
              </CardTitle>
              <CardDescription>
                Nhập thông tin để tính toán chính xác phí vận chuyển
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from">Gửi từ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hn">Hà Nội</SelectItem>
                      <SelectItem value="dn">Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="to">Giao đến</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hn">Hà Nội</SelectItem>
                      <SelectItem value="dn">Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Khối lượng (kg)</Label>
                  <Input type="number" placeholder="0.5" />
                </div>
                <div>
                  <Label htmlFor="value">Giá trị hàng hóa (VNĐ)</Label>
                  <Input type="number" placeholder="500000" />
                </div>
              </div>
              <Button className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Tính phí vận chuyển
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Partners */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Đối tác vận chuyển</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingPartners.map((partner, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="h-12 mx-auto mb-4 object-contain"
                  />
                  <h3 className="font-bold text-lg mb-2">{partner.name}</h3>
                  <div className="space-y-2">
                    <Badge variant="outline">{partner.coverage}</Badge>
                    <p className="text-sm text-gray-600">{partner.specialty}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Chính sách vận chuyển</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingPolicies.map((policy, index) => {
              const IconComponent = policy.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{policy.title}</h3>
                        <p className="text-gray-600">{policy.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Câu hỏi thường gặp</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              <Phone className="w-4 h-4 mr-2" />
              Hotline: 1900 1234
            </Button>
            <Button variant="outline">
              Chat với CSKH
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ShippingInfo
import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { CreditCard, Smartphone, Building, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Payment = () => {
  const paymentMethods = [
    {
      category: 'Ví điện tử',
      methods: [
        {
          name: 'MoMo',
          logo: '/api/placeholder/60/40',
          description: 'Thanh toán nhanh chóng với ví MoMo',
          fee: 'Miễn phí',
          processingTime: 'Tức thì',
          icon: Smartphone,
          color: 'bg-pink-50 border-pink-200'
        },
        {
          name: 'ZaloPay',
          logo: '/api/placeholder/60/40',
          description: 'Thanh toán an toàn với ZaloPay',
          fee: 'Miễn phí',
          processingTime: 'Tức thì',
          icon: Smartphone,
          color: 'bg-blue-50 border-blue-200'
        },
        {
          name: 'ShopeePay',
          logo: '/api/placeholder/60/40',
          description: 'Tích điểm và nhận ưu đãi',
          fee: 'Miễn phí',
          processingTime: 'Tức thì',
          icon: Smartphone,
          color: 'bg-orange-50 border-orange-200'
        }
      ]
    },
    {
      category: 'Thẻ ngân hàng',
      methods: [
        {
          name: 'Thẻ tín dụng/ghi nợ',
          logo: '/api/placeholder/60/40',
          description: 'Visa, Mastercard, JCB',
          fee: 'Miễn phí',
          processingTime: 'Tức thì',
          icon: CreditCard,
          color: 'bg-green-50 border-green-200'
        },
        {
          name: 'Thẻ ATM nội địa',
          logo: '/api/placeholder/60/40',
          description: 'Các ngân hàng trong nước',
          fee: 'Miễn phí',
          processingTime: 'Tức thì',
          icon: CreditCard,
          color: 'bg-purple-50 border-purple-200'
        }
      ]
    },
    {
      category: 'Chuyển khoản ngân hàng',
      methods: [
        {
          name: 'Internet Banking',
          logo: '/api/placeholder/60/40',
          description: 'Chuyển khoản qua ngân hàng trực tuyến',
          fee: 'Theo ngân hàng',
          processingTime: '1-24 giờ',
          icon: Building,
          color: 'bg-gray-50 border-gray-200'
        },
        {
          name: 'Chuyển khoản QR',
          logo: '/api/placeholder/60/40',
          description: 'Quét mã QR để chuyển khoản',
          fee: 'Theo ngân hàng',
          processingTime: 'Tức thì',
          icon: Building,
          color: 'bg-indigo-50 border-indigo-200'
        }
      ]
    }
  ]

  const supportedBanks = [
    { name: 'Vietcombank', logo: '/api/placeholder/80/40' },
    { name: 'BIDV', logo: '/api/placeholder/80/40' },
    { name: 'VietinBank', logo: '/api/placeholder/80/40' },
    { name: 'Agribank', logo: '/api/placeholder/80/40' },
    { name: 'Techcombank', logo: '/api/placeholder/80/40' },
    { name: 'MB Bank', logo: '/api/placeholder/80/40' },
    { name: 'ACB', logo: '/api/placeholder/80/40' },
    { name: 'VPBank', logo: '/api/placeholder/80/40' },
    { name: 'Sacombank', logo: '/api/placeholder/80/40' },
    { name: 'TPBank', logo: '/api/placeholder/80/40' },
    { name: 'HDBank', logo: '/api/placeholder/80/40' },
    { name: 'OCB', logo: '/api/placeholder/80/40' }
  ]

  const securityFeatures = [
    {
      title: 'Mã hóa SSL 256-bit',
      description: 'Bảo mật thông tin thanh toán với công nghệ mã hóa tiên tiến',
      icon: Shield
    },
    {
      title: 'Xác thực 3D Secure',
      description: 'Lớp bảo mật bổ sung cho thẻ tín dụng/ghi nợ',
      icon: CheckCircle
    },
    {
      title: 'Giám sát giao dịch 24/7',
      description: 'Hệ thống phát hiện và ngăn chặn giao dịch bất thường',
      icon: AlertCircle
    }
  ]

  const paymentSteps = [
    {
      step: 1,
      title: 'Chọn sản phẩm',
      description: 'Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán'
    },
    {
      step: 2,
      title: 'Chọn phương thức',
      description: 'Lựa chọn phương thức thanh toán phù hợp'
    },
    {
      step: 3,
      title: 'Xác nhận thông tin',
      description: 'Kiểm tra thông tin đơn hàng và địa chỉ giao hàng'
    },
    {
      step: 4,
      title: 'Thanh toán',
      description: 'Hoàn tất thanh toán và nhận xác nhận đơn hàng'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Phương thức thanh toán - Yapee</title>
        <meta name="description" content="Thông tin chi tiết về các phương thức thanh toán an toàn và tiện lợi tại Yapee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <CreditCard className="w-8 h-8 mr-3 text-blue-500" />
            Phương thức thanh toán
          </h1>
          <p className="text-gray-600">Thanh toán an toàn, nhanh chóng với nhiều lựa chọn tiện lợi</p>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Các phương thức thanh toán</h2>
          
          {paymentMethods.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.methods.map((method, methodIndex) => {
                  const IconComponent = method.icon
                  return (
                    <Card key={methodIndex} className={`${method.color} hover:shadow-lg transition-shadow`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-2">{method.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">Phí: {method.fee}</Badge>
                              <Badge variant="outline">Xử lý: {method.processingTime}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quy trình thanh toán</CardTitle>
            <CardDescription>
              4 bước đơn giản để hoàn tất thanh toán
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {paymentSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.step}
                  </div>
                  <h4 className="font-medium mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supported Banks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ngân hàng hỗ trợ</CardTitle>
            <CardDescription>
              Yapee hỗ trợ thanh toán qua hầu hết các ngân hàng tại Việt Nam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {supportedBanks.map((bank, index) => (
                <div key={index} className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="h-8 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <img src={bank.logo} alt={bank.name} className="max-h-6" />
                  </div>
                  <p className="text-xs font-medium">{bank.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Policies */}
        <Tabs defaultValue="security" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
            <TabsTrigger value="policy">Chính sách</TabsTrigger>
            <TabsTrigger value="support">Hỗ trợ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Bảo mật thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {securityFeatures.map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <IconComponent className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="policy">
            <Card>
              <CardHeader>
                <CardTitle>Chính sách thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Quy định chung</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Thanh toán phải được thực hiện trước khi giao hàng (trừ COD)</li>
                      <li>• Yapee không lưu trữ thông tin thẻ của khách hàng</li>
                      <li>• Mọi giao dịch đều được mã hóa và bảo mật</li>
                      <li>• Khách hàng chịu trách nhiệm bảo mật thông tin tài khoản</li>
                      <li>• Yapee có quyền từ chối giao dịch bất thường</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Hoàn tiền</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Hoàn tiền trong 3-7 ngày làm việc</li>
                      <li>• Hoàn về phương thức thanh toán gốc</li>
                      <li>• Phí giao dịch (nếu có) sẽ không được hoàn</li>
                      <li>• Cần cung cấp đầy đủ thông tin để xử lý hoàn tiền</li>
                      <li>• Liên hệ CSKH để được hỗ trợ nhanh nhất</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Hỗ trợ thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Khi gặp sự cố</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Kiểm tra kết nối internet và thử lại</li>
                      <li>• Đảm bảo thông tin thẻ/tài khoản chính xác</li>
                      <li>• Kiểm tra số dư tài khoản</li>
                      <li>• Liên hệ ngân hàng nếu thẻ bị khóa</li>
                      <li>• Gọi hotline Yapee: 1900 1234</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Thông tin liên hệ</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-medium">Hotline 24/7</p>
                        <p className="text-blue-600">1900 1234</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-medium">Email hỗ trợ</p>
                        <p className="text-blue-600">payment@yapee.vn</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-medium">Chat trực tuyến</p>
                        <Button size="sm" className="mt-1">Bắt đầu chat</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default Payment
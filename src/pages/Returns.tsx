import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { RotateCcw, Package, Clock, CheckCircle, AlertTriangle, CreditCard, Truck, FileText, Phone, Mail, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

const Returns = () => {
  const returnPolicies = [
    {
      category: 'Thời gian đổi trả',
      icon: Clock,
      rules: [
        'Trong vòng 15 ngày kể từ ngày nhận hàng',
        'Sản phẩm thời trang: 30 ngày',
        'Điện tử, gia dụng: 7 ngày',
        'Mỹ phẩm, thực phẩm: Không đổi trả'
      ]
    },
    {
      category: 'Điều kiện sản phẩm',
      icon: Package,
      rules: [
        'Còn nguyên tem mác, nhãn hiệu',
        'Chưa qua sử dụng, còn mới 100%',
        'Đầy đủ phụ kiện, hộp đựng',
        'Không bị hư hỏng do người dùng'
      ]
    },
    {
      category: 'Lý do đổi trả',
      icon: FileText,
      rules: [
        'Sản phẩm bị lỗi từ nhà sản xuất',
        'Giao sai sản phẩm, sai màu sắc',
        'Không đúng mô tả trên website',
        'Hư hỏng trong quá trình vận chuyển'
      ]
    },
    {
      category: 'Chi phí đổi trả',
      icon: CreditCard,
      rules: [
        'Miễn phí nếu lỗi từ Yapee',
        'Khách hàng chịu phí nếu đổi ý',
        'Phí vận chuyển 2 chiều: 30.000đ',
        'Hoàn tiền trong 3-7 ngày làm việc'
      ]
    }
  ]

  const returnProcess = [
    {
      step: 1,
      title: 'Tạo yêu cầu đổi trả',
      description: 'Đăng nhập tài khoản và tạo yêu cầu đổi trả trong mục "Đơn hàng của tôi"',
      timeframe: '1-2 phút',
      status: 'active'
    },
    {
      step: 2,
      title: 'Xác nhận từ Yapee',
      description: 'Yapee sẽ xem xét và xác nhận yêu cầu đổi trả của bạn',
      timeframe: '2-4 giờ',
      status: 'pending'
    },
    {
      step: 3,
      title: 'Đóng gói và gửi hàng',
      description: 'Đóng gói sản phẩm cẩn thận và gửi về kho Yapee',
      timeframe: '1-2 ngày',
      status: 'pending'
    },
    {
      step: 4,
      title: 'Kiểm tra sản phẩm',
      description: 'Yapee kiểm tra tình trạng sản phẩm và xác nhận đổi trả',
      timeframe: '1-3 ngày',
      status: 'pending'
    },
    {
      step: 5,
      title: 'Hoàn tiền/Gửi hàng mới',
      description: 'Hoàn tiền vào tài khoản hoặc gửi sản phẩm mới cho khách hàng',
      timeframe: '3-7 ngày',
      status: 'pending'
    }
  ]

  const returnReasons = [
    {
      reason: 'Sản phẩm bị lỗi',
      description: 'Sản phẩm có lỗi kỹ thuật, hư hỏng từ nhà sản xuất',
      refundRate: '100%',
      processingTime: '3-5 ngày',
      shippingFee: 'Miễn phí'
    },
    {
      reason: 'Giao sai sản phẩm',
      description: 'Nhận được sản phẩm khác với đơn hàng đã đặt',
      refundRate: '100%',
      processingTime: '2-3 ngày',
      shippingFee: 'Miễn phí'
    },
    {
      reason: 'Không đúng mô tả',
      description: 'Sản phẩm không giống với mô tả trên website',
      refundRate: '100%',
      processingTime: '3-5 ngày',
      shippingFee: 'Miễn phí'
    },
    {
      reason: 'Đổi ý không muốn mua',
      description: 'Khách hàng thay đổi quyết định sau khi nhận hàng',
      refundRate: '90%',
      processingTime: '5-7 ngày',
      shippingFee: 'Khách hàng trả'
    },
    {
      reason: 'Không vừa size',
      description: 'Sản phẩm thời trang không vừa kích thước',
      refundRate: '95%',
      processingTime: '3-5 ngày',
      shippingFee: 'Khách hàng trả'
    },
    {
      reason: 'Hư hỏng khi vận chuyển',
      description: 'Sản phẩm bị hư hỏng trong quá trình giao hàng',
      refundRate: '100%',
      processingTime: '2-4 ngày',
      shippingFee: 'Miễn phí'
    }
  ]

  const returnCenters = [
    {
      city: 'TP. Hồ Chí Minh',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '028 1234 5678',
      hours: '8:00 - 17:00 (T2-T6)',
      services: ['Nhận hàng trả', 'Kiểm tra sản phẩm', 'Tư vấn đổi trả']
    },
    {
      city: 'Hà Nội',
      address: '456 Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
      phone: '024 1234 5678',
      hours: '8:00 - 17:00 (T2-T6)',
      services: ['Nhận hàng trả', 'Kiểm tra sản phẩm', 'Tư vấn đổi trả']
    },
    {
      city: 'Đà Nẵng',
      address: '789 Hải Châu, Quận Hải Châu, Đà Nẵng',
      phone: '0236 1234 567',
      hours: '8:00 - 17:00 (T2-T6)',
      services: ['Nhận hàng trả', 'Kiểm tra sản phẩm', 'Tư vấn đổi trả']
    }
  ]

  const faqs = [
    {
      question: 'Tôi có thể đổi trả sản phẩm sau bao lâu?',
      answer: 'Thời gian đổi trả phụ thuộc vào loại sản phẩm: Thời trang 30 ngày, điện tử 7 ngày, các sản phẩm khác 15 ngày kể từ ngày nhận hàng.'
    },
    {
      question: 'Chi phí đổi trả như thế nào?',
      answer: 'Nếu lỗi từ Yapee (sai sản phẩm, hàng lỗi), chúng tôi sẽ chịu toàn bộ chi phí. Nếu khách hàng đổi ý, khách hàng sẽ chịu phí vận chuyển 2 chiều.'
    },
    {
      question: 'Tôi có thể đổi sang sản phẩm khác không?',
      answer: 'Có, bạn có thể đổi sang sản phẩm khác cùng giá trị hoặc bù thêm tiền nếu sản phẩm mới có giá cao hơn.'
    },
    {
      question: 'Khi nào tôi nhận được tiền hoàn?',
      answer: 'Sau khi chúng tôi nhận và kiểm tra sản phẩm, tiền sẽ được hoàn vào tài khoản của bạn trong 3-7 ngày làm việc.'
    },
    {
      question: 'Sản phẩm nào không thể đổi trả?',
      answer: 'Mỹ phẩm đã mở seal, thực phẩm, đồ lót, sản phẩm theo yêu cầu riêng và một số sản phẩm đặc biệt khác.'
    },
    {
      question: 'Làm sao để theo dõi tiến trình đổi trả?',
      answer: 'Bạn có thể theo dõi trong mục "Đơn hàng của tôi" hoặc qua email/SMS thông báo từ Yapee.'
    }
  ]

  const returnStats = {
    totalReturns: '2.1M+',
    successRate: '98.5%',
    avgProcessingTime: '3.2 ngày',
    customerSatisfaction: '4.8/5'
  }

  return (
    <Layout>
      <Helmet>
        <title>Chính sách đổi trả - Yapee</title>
        <meta name="description" content="Chính sách đổi trả hàng hóa tại Yapee. Quy trình đổi trả đơn giản, nhanh chóng với cam kết bảo vệ quyền lợi khách hàng." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Chính sách đổi trả</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quy trình đổi trả đơn giản, minh bạch với cam kết bảo vệ quyền lợi khách hàng
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Đổi trả dễ dàng
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Xử lý nhanh chóng
            </Badge>
            <Badge variant="outline" className="text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Hoàn tiền 100%
            </Badge>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{returnStats.totalReturns}</div>
                <div className="text-sm text-gray-600">Đơn đổi trả đã xử lý</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{returnStats.successRate}</div>
                <div className="text-sm text-gray-600">Tỷ lệ thành công</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">{returnStats.avgProcessingTime}</div>
                <div className="text-sm text-gray-600">Thời gian xử lý TB</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{returnStats.customerSatisfaction}</div>
                <div className="text-sm text-gray-600">Đánh giá khách hàng</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Return Policies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Chính sách đổi trả</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnPolicies.map((policy, index) => {
              const IconComponent = policy.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{policy.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {policy.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Quy trình đổi trả</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {returnProcess.map((step, index) => (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${
                  step.status === 'active' ? 'border-blue-500 bg-blue-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold ${
                        step.status === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.timeframe}
                          </Badge>
                          {step.status === 'active' && (
                            <Badge className="bg-blue-600">
                              Đang thực hiện
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reasons" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="reasons">Lý do đổi trả</TabsTrigger>
            <TabsTrigger value="request">Tạo yêu cầu</TabsTrigger>
            <TabsTrigger value="centers">Trung tâm đổi trả</TabsTrigger>
            <TabsTrigger value="faq">Câu hỏi thường gặp</TabsTrigger>
          </TabsList>

          <TabsContent value="reasons" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Các lý do đổi trả phổ biến</h3>
                <p className="text-gray-600">
                  Mức hoàn tiền và thời gian xử lý tùy thuộc vào lý do đổi trả
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {returnReasons.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        {item.reason}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-semibold text-green-600">Hoàn tiền</div>
                          <div>{item.refundRate}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-600">Thời gian</div>
                          <div>{item.processingTime}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-orange-600">Phí ship</div>
                          <div>{item.shippingFee}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="request" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Tạo yêu cầu đổi trả</h3>
                <p className="text-gray-600">
                  Điền thông tin chi tiết để chúng tôi xử lý yêu cầu đổi trả của bạn
                </p>
              </div>
              
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Biểu mẫu yêu cầu đổi trả</CardTitle>
                  <CardDescription>
                    Vui lòng cung cấp thông tin chính xác để được hỗ trợ tốt nhất
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orderNumber">Mã đơn hàng *</Label>
                      <Input id="orderNumber" placeholder="VD: YP123456789" />
                    </div>
                    <div>
                      <Label htmlFor="orderDate">Ngày đặt hàng *</Label>
                      <Input id="orderDate" type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="productName">Tên sản phẩm *</Label>
                    <Input id="productName" placeholder="Nhập tên sản phẩm cần đổi trả" />
                  </div>
                  
                  <div>
                    <Label htmlFor="returnReason">Lý do đổi trả *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do đổi trả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defective">Sản phẩm bị lỗi</SelectItem>
                        <SelectItem value="wrong-item">Giao sai sản phẩm</SelectItem>
                        <SelectItem value="not-as-described">Không đúng mô tả</SelectItem>
                        <SelectItem value="change-mind">Đổi ý không muốn mua</SelectItem>
                        <SelectItem value="wrong-size">Không vừa size</SelectItem>
                        <SelectItem value="damaged-shipping">Hư hỏng khi vận chuyển</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Mô tả chi tiết *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Mô tả chi tiết về vấn đề của sản phẩm..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="images">Hình ảnh sản phẩm</Label>
                    <Input id="images" type="file" multiple accept="image/*" />
                    <p className="text-sm text-gray-500 mt-1">
                      Tải lên hình ảnh sản phẩm để hỗ trợ xử lý nhanh hơn
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">Số điện thoại liên hệ *</Label>
                      <Input id="contactPhone" placeholder="0123456789" />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email liên hệ *</Label>
                      <Input id="contactEmail" type="email" placeholder="email@example.com" />
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Lưu ý:</strong> Vui lòng đảm bảo sản phẩm còn nguyên tem mác, 
                      chưa qua sử dụng và trong thời hạn đổi trả theo chính sách.
                    </AlertDescription>
                  </Alert>
                  
                  <Button className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Gửi yêu cầu đổi trả
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="centers" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Trung tâm đổi trả</h3>
                <p className="text-gray-600">
                  Bạn có thể mang sản phẩm đến trực tiếp các trung tâm đổi trả của Yapee
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {returnCenters.map((center, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        {center.city}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                        <span className="text-sm">{center.address}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm">{center.phone}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm">{center.hours}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Dịch vụ:</h4>
                        <div className="flex flex-wrap gap-1">
                          {center.services.map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        Xem bản đồ
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Câu hỏi thường gặp</h3>
                <p className="text-gray-600">
                  Những câu hỏi phổ biến về chính sách đổi trả tại Yapee
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3 flex items-start">
                        <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 ml-11">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Support */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Cần hỗ trợ thêm?</h3>
            <p className="text-gray-700 mb-6">
              Đội ngũ chăm sóc khách hàng của Yapee luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Phone className="w-4 h-4 mr-2" />
                Gọi hotline: 1900 1234
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Email: support@yapee.vn
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Returns
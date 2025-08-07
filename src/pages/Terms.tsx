import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Users, CreditCard, Truck, RotateCcw, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

const Terms = () => {
  const termsSections = [
    {
      title: 'Điều khoản chung',
      icon: FileText,
      items: [
        'Chấp nhận điều khoản khi sử dụng dịch vụ',
        'Quyền thay đổi điều khoản của Yapee',
        'Tuổi tối thiểu để sử dụng dịch vụ',
        'Trách nhiệm của người dùng'
      ]
    },
    {
      title: 'Tài khoản người dùng',
      icon: Users,
      items: [
        'Đăng ký và xác thực tài khoản',
        'Bảo mật thông tin đăng nhập',
        'Trách nhiệm bảo vệ tài khoản',
        'Quyền đình chỉ tài khoản'
      ]
    },
    {
      title: 'Mua hàng & Thanh toán',
      icon: CreditCard,
      items: [
        'Quy trình đặt hàng và thanh toán',
        'Xác nhận đơn hàng và hóa đơn',
        'Các phương thức thanh toán',
        'Chính sách hoàn tiền'
      ]
    },
    {
      title: 'Vận chuyển & Giao hàng',
      icon: Truck,
      items: [
        'Thời gian và phương thức giao hàng',
        'Phí vận chuyển và miễn phí ship',
        'Trách nhiệm trong quá trình vận chuyển',
        'Xử lý hàng hóa bị hư hỏng'
      ]
    },
    {
      title: 'Đổi trả & Hoàn tiền',
      icon: RotateCcw,
      items: [
        'Điều kiện đổi trả sản phẩm',
        'Thời hạn và quy trình đổi trả',
        'Chi phí đổi trả và vận chuyển',
        'Chính sách hoàn tiền'
      ]
    },
    {
      title: 'Trách nhiệm pháp lý',
      icon: Scale,
      items: [
        'Giới hạn trách nhiệm của Yapee',
        'Bồi thường thiệt hại',
        'Giải quyết tranh chấp',
        'Luật áp dụng'
      ]
    }
  ]

  const userObligations = [
    {
      title: 'Sử dụng hợp pháp',
      description: 'Chỉ sử dụng dịch vụ cho mục đích hợp pháp và không vi phạm pháp luật',
      examples: ['Không mua bán hàng cấm', 'Không gian lận thông tin', 'Tuân thủ quy định về thuế']
    },
    {
      title: 'Thông tin chính xác',
      description: 'Cung cấp thông tin đúng sự thật và cập nhật khi có thay đổi',
      examples: ['Thông tin cá nhân chính xác', 'Địa chỉ giao hàng đúng', 'Số điện thoại liên lạc được']
    },
    {
      title: 'Bảo mật tài khoản',
      description: 'Bảo vệ thông tin đăng nhập và chịu trách nhiệm về hoạt động trên tài khoản',
      examples: ['Mật khẩu mạnh và bảo mật', 'Không chia sẻ tài khoản', 'Thông báo khi phát hiện bất thường']
    },
    {
      title: 'Tôn trọng quyền sở hữu',
      description: 'Không vi phạm bản quyền, thương hiệu và quyền sở hữu trí tuệ',
      examples: ['Không sao chép nội dung', 'Tôn trọng thương hiệu', 'Không sử dụng hình ảnh trái phép']
    }
  ]

  const yapeeRights = [
    {
      right: 'Thay đổi dịch vụ',
      description: 'Yapee có quyền thay đổi, cập nhật hoặc ngừng cung cấp dịch vụ',
      notice: 'Thông báo trước ít nhất 30 ngày'
    },
    {
      right: 'Kiểm duyệt nội dung',
      description: 'Kiểm tra và gỡ bỏ nội dung vi phạm chính sách',
      notice: 'Thực hiện ngay khi phát hiện'
    },
    {
      right: 'Đình chỉ tài khoản',
      description: 'Tạm khóa hoặc khóa vĩnh viễn tài khoản vi phạm',
      notice: 'Thông báo lý do và thời hạn'
    },
    {
      right: 'Thu thập dữ liệu',
      description: 'Thu thập và sử dụng dữ liệu theo chính sách bảo mật',
      notice: 'Tuân thủ quy định bảo vệ dữ liệu'
    }
  ]

  const prohibitedActivities = [
    {
      category: 'Hoạt động gian lận',
      activities: [
        'Sử dụng thông tin thẻ tín dụng giả',
        'Tạo nhiều tài khoản để lạm dụng khuyến mãi',
        'Đặt hàng ảo để tăng doanh số',
        'Sử dụng mã giảm giá không hợp lệ'
      ]
    },
    {
      category: 'Vi phạm bản quyền',
      activities: [
        'Sao chép hình ảnh, mô tả sản phẩm',
        'Sử dụng logo, thương hiệu trái phép',
        'Chia sẻ nội dung có bản quyền',
        'Bán hàng nhái, hàng giả'
      ]
    },
    {
      category: 'Spam và quấy rối',
      activities: [
        'Gửi tin nhắn quảng cáo không mong muốn',
        'Đánh giá ảo, bình luận spam',
        'Quấy rối người dùng khác',
        'Tạo nhiều tài khoản để spam'
      ]
    },
    {
      category: 'Hoạt động bất hợp pháp',
      activities: [
        'Bán hàng cấm theo pháp luật',
        'Rửa tiền qua giao dịch',
        'Trốn thuế, gian lận thuế',
        'Hoạt động khủng bố, tội phạm'
      ]
    }
  ]

  const disputeResolution = [
    {
      step: 1,
      title: 'Liên hệ trực tiếp',
      description: 'Khách hàng liên hệ với Yapee để giải quyết vấn đề',
      timeframe: '24-48 giờ',
      methods: ['Hotline', 'Email', 'Chat trực tuyến']
    },
    {
      step: 2,
      title: 'Thương lượng',
      description: 'Hai bên thương lượng để tìm ra giải pháp phù hợp',
      timeframe: '3-7 ngày',
      methods: ['Điện thoại', 'Email', 'Họp trực tuyến']
    },
    {
      step: 3,
      title: 'Hòa giải',
      description: 'Sử dụng dịch vụ hòa giải của bên thứ ba',
      timeframe: '15-30 ngày',
      methods: ['Trung tâm hòa giải', 'Luật sư', 'Chuyên gia']
    },
    {
      step: 4,
      title: 'Tòa án',
      description: 'Giải quyết tranh chấp tại tòa án có thẩm quyền',
      timeframe: 'Theo quy định pháp luật',
      methods: ['Tòa án kinh tế', 'Tòa án dân sự']
    }
  ]

  const importantNotices = [
    {
      type: 'warning',
      title: 'Thay đổi điều khoản',
      content: 'Yapee có quyền thay đổi điều khoản sử dụng bất kỳ lúc nào. Thay đổi sẽ có hiệu lực sau 30 ngày thông báo.'
    },
    {
      type: 'info',
      title: 'Giới hạn trách nhiệm',
      content: 'Trách nhiệm của Yapee được giới hạn trong phạm vi giá trị đơn hàng và không bao gồm thiệt hại gián tiếp.'
    },
    {
      type: 'success',
      title: 'Bảo vệ người tiêu dùng',
      content: 'Yapee cam kết bảo vệ quyền lợi người tiêu dùng theo quy định của pháp luật Việt Nam.'
    }
  ]

  const contactInfo = {
    legal: {
      title: 'Phòng Pháp chế',
      email: 'legal@yapee.vn',
      phone: '1900 1234 (máy lẻ 2)',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
    },
    support: {
      title: 'Hỗ trợ khách hàng',
      email: 'support@yapee.vn',
      phone: '1900 1234',
      hours: '24/7'
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>Điều khoản sử dụng - Yapee</title>
        <meta name="description" content="Điều khoản và điều kiện sử dụng dịch vụ Yapee. Quyền và nghĩa vụ của người dùng khi sử dụng nền tảng thương mại điện tử." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Điều khoản sử dụng</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quy định về quyền và nghĩa vụ khi sử dụng dịch vụ thương mại điện tử Yapee
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="text-sm">
              Có hiệu lực từ: 01/01/2024
            </Badge>
          </div>
        </div>

        {/* Important Notices */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Thông báo quan trọng</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {importantNotices.map((notice, index) => (
              <Alert key={index} className={`border-l-4 ${
                notice.type === 'warning' ? 'border-amber-500 bg-amber-50' :
                notice.type === 'info' ? 'border-blue-500 bg-blue-50' :
                'border-green-500 bg-green-50'
              }`}>
                <AlertTriangle className={`h-4 w-4 ${
                  notice.type === 'warning' ? 'text-amber-600' :
                  notice.type === 'info' ? 'text-blue-600' :
                  'text-green-600'
                }`} />
                <AlertDescription>
                  <strong>{notice.title}:</strong> {notice.content}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        {/* Terms Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Tổng quan điều khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {termsSections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="obligations" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="obligations">Nghĩa vụ người dùng</TabsTrigger>
            <TabsTrigger value="rights">Quyền của Yapee</TabsTrigger>
            <TabsTrigger value="prohibited">Hoạt động cấm</TabsTrigger>
            <TabsTrigger value="disputes">Giải quyết tranh chấp</TabsTrigger>
          </TabsList>

          <TabsContent value="obligations" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Nghĩa vụ của người dùng</h3>
                <p className="text-gray-600">
                  Khi sử dụng dịch vụ Yapee, bạn cam kết tuân thủ các nghĩa vụ sau
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userObligations.map((obligation, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        {obligation.title}
                      </CardTitle>
                      <CardDescription>{obligation.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold text-sm mb-2">Bao gồm:</h4>
                      <ul className="space-y-1">
                        {obligation.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rights" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Quyền của Yapee</h3>
                <p className="text-gray-600">
                  Yapee có các quyền sau để đảm bảo chất lượng dịch vụ và bảo vệ cộng đồng
                </p>
              </div>
              
              <div className="space-y-4">
                {yapeeRights.map((right, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{right.right}</h4>
                          <p className="text-gray-600 mb-2">{right.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {right.notice}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prohibited" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Hoạt động bị cấm</h3>
                <p className="text-gray-600">
                  Các hoạt động sau đây bị nghiêm cấm trên nền tảng Yapee
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prohibitedActivities.map((category, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-700">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-red-800">Hậu quả vi phạm</h4>
                      <p className="text-red-700 mb-3">
                        Vi phạm các quy định trên có thể dẫn đến cảnh báo, đình chỉ tài khoản tạm thời hoặc vĩnh viễn, 
                        và có thể phải chịu trách nhiệm pháp lý theo quy định của pháp luật.
                      </p>
                      <Button size="sm" variant="destructive">
                        Báo cáo vi phạm
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="disputes" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Quy trình giải quyết tranh chấp</h3>
                <p className="text-gray-600">
                  Yapee cam kết giải quyết mọi tranh chấp một cách công bằng và minh bạch
                </p>
              </div>
              
              <div className="space-y-6">
                {disputeResolution.map((step, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold text-sm mb-1">Thời gian xử lý:</h5>
                              <Badge variant="outline">{step.timeframe}</Badge>
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm mb-1">Phương thức:</h5>
                              <div className="flex flex-wrap gap-1">
                                {step.methods.map((method, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {method}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Legal Framework */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Khung pháp lý</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Luật áp dụng</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-1 text-blue-600" />
                      Luật Thương mại điện tử 2005
                    </li>
                    <li className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-1 text-blue-600" />
                      Luật Bảo vệ quyền lợi người tiêu dùng 2010
                    </li>
                    <li className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-1 text-blue-600" />
                      Luật An toàn thông tin mạng 2015
                    </li>
                    <li className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-1 text-blue-600" />
                      Nghị định 52/2013/NĐ-CP về TMĐT
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Thẩm quyền tòa án</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 mt-1 text-green-600" />
                      Tòa án nhân dân TP. Hồ Chí Minh
                    </li>
                    <li className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 mt-1 text-green-600" />
                      Tòa án kinh tế có thẩm quyền
                    </li>
                    <li className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 mt-1 text-green-600" />
                      Trung tâm trọng tài quốc tế Việt Nam
                    </li>
                    <li className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 mt-1 text-green-600" />
                      Trung tâm hòa giải thương mại
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Liên hệ pháp lý</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  {contactInfo.legal.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${contactInfo.legal.email}`} className="text-blue-600 hover:underline">
                    {contactInfo.legal.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{contactInfo.legal.phone}</span>
                </div>
                <div className="flex items-start">
                  <FileText className="w-4 h-4 mr-2 mt-1" />
                  <span>{contactInfo.legal.address}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {contactInfo.support.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${contactInfo.support.email}`} className="text-blue-600 hover:underline">
                    {contactInfo.support.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{contactInfo.support.phone}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Hỗ trợ {contactInfo.support.hours}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Acceptance Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Chấp nhận điều khoản</h3>
            <p className="text-gray-700 mb-6">
              Bằng việc sử dụng dịch vụ Yapee, bạn đã đọc, hiểu và đồng ý tuân thủ toàn bộ điều khoản sử dụng này. 
              Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Tải xuống điều khoản (PDF)
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Đăng ký nhận cập nhật
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Terms
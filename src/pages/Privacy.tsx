import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Shield, Eye, Lock, Users, Database, Globe, FileText, AlertTriangle, CheckCircle, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

const Privacy = () => {
  const privacyPrinciples = [
    {
      title: 'Minh bạch',
      description: 'Chúng tôi luôn rõ ràng về việc thu thập và sử dụng dữ liệu của bạn',
      icon: Eye,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Bảo mật',
      description: 'Dữ liệu của bạn được bảo vệ bằng các công nghệ bảo mật tiên tiến nhất',
      icon: Lock,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Kiểm soát',
      description: 'Bạn có quyền kiểm soát hoàn toàn dữ liệu cá nhân của mình',
      icon: Users,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Tuân thủ',
      description: 'Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu',
      icon: Shield,
      color: 'bg-orange-100 text-orange-800'
    }
  ]

  const dataTypes = [
    {
      category: 'Thông tin cá nhân',
      items: [
        'Họ tên, ngày sinh, giới tính',
        'Số điện thoại, email',
        'Địa chỉ giao hàng',
        'Ảnh đại diện (nếu có)'
      ],
      purpose: 'Để tạo tài khoản, xử lý đơn hàng và liên lạc với bạn'
    },
    {
      category: 'Thông tin thanh toán',
      items: [
        'Thông tin thẻ ngân hàng (được mã hóa)',
        'Lịch sử giao dịch',
        'Phương thức thanh toán ưa thích',
        'Địa chỉ thanh toán'
      ],
      purpose: 'Để xử lý thanh toán và phát hiện gian lận'
    },
    {
      category: 'Dữ liệu sử dụng',
      items: [
        'Lịch sử duyệt web',
        'Sản phẩm đã xem, mua',
        'Thời gian sử dụng ứng dụng',
        'Thiết bị và trình duyệt'
      ],
      purpose: 'Để cải thiện trải nghiệm và đề xuất sản phẩm phù hợp'
    },
    {
      category: 'Dữ liệu vị trí',
      items: [
        'Vị trí GPS (khi được cho phép)',
        'Địa chỉ IP',
        'Múi giờ',
        'Ngôn ngữ thiết bị'
      ],
      purpose: 'Để cung cấp dịch vụ địa phương và giao hàng chính xác'
    }
  ]

  const userRights = [
    {
      right: 'Quyền truy cập',
      description: 'Bạn có quyền biết dữ liệu nào của mình đang được lưu trữ',
      action: 'Yêu cầu xem dữ liệu'
    },
    {
      right: 'Quyền chỉnh sửa',
      description: 'Bạn có thể cập nhật hoặc sửa đổi thông tin cá nhân bất kỳ lúc nào',
      action: 'Chỉnh sửa trong tài khoản'
    },
    {
      right: 'Quyền xóa',
      description: 'Bạn có thể yêu cầu xóa tài khoản và dữ liệu cá nhân',
      action: 'Gửi yêu cầu xóa'
    },
    {
      right: 'Quyền di chuyển',
      description: 'Bạn có thể yêu cầu xuất dữ liệu để chuyển sang nền tảng khác',
      action: 'Tải xuống dữ liệu'
    },
    {
      right: 'Quyền từ chối',
      description: 'Bạn có thể từ chối việc xử lý dữ liệu cho mục đích marketing',
      action: 'Tắt thông báo'
    },
    {
      right: 'Quyền khiếu nại',
      description: 'Bạn có thể khiếu nại về việc xử lý dữ liệu không phù hợp',
      action: 'Liên hệ hỗ trợ'
    }
  ]

  const securityMeasures = [
    {
      measure: 'Mã hóa dữ liệu',
      description: 'Tất cả dữ liệu nhạy cảm được mã hóa bằng chuẩn AES-256',
      icon: Lock
    },
    {
      measure: 'Xác thực 2 lớp',
      description: 'Hỗ trợ xác thực 2 yếu tố để bảo vệ tài khoản',
      icon: Shield
    },
    {
      measure: 'Giám sát 24/7',
      description: 'Hệ thống giám sát bảo mật hoạt động liên tục',
      icon: Eye
    },
    {
      measure: 'Kiểm tra định kỳ',
      description: 'Thực hiện kiểm tra bảo mật và đánh giá rủi ro thường xuyên',
      icon: CheckCircle
    }
  ]

  const thirdParties = [
    {
      name: 'Đối tác thanh toán',
      purpose: 'Xử lý giao dịch thanh toán',
      data: 'Thông tin thanh toán được mã hóa',
      examples: 'VNPay, MoMo, ZaloPay'
    },
    {
      name: 'Đối tác vận chuyển',
      purpose: 'Giao hàng đến khách hàng',
      data: 'Tên, số điện thoại, địa chỉ giao hàng',
      examples: 'Giao Hàng Nhanh, Viettel Post, J&T'
    },
    {
      name: 'Dịch vụ phân tích',
      purpose: 'Cải thiện trải nghiệm người dùng',
      data: 'Dữ liệu sử dụng được ẩn danh',
      examples: 'Google Analytics, Facebook Analytics'
    },
    {
      name: 'Dịch vụ marketing',
      purpose: 'Gửi thông báo và quảng cáo',
      data: 'Email, số điện thoại (với sự đồng ý)',
      examples: 'Email marketing, SMS marketing'
    }
  ]

  const cookieTypes = [
    {
      type: 'Cookie cần thiết',
      description: 'Cần thiết để website hoạt động bình thường',
      required: true,
      examples: 'Đăng nhập, giỏ hàng, bảo mật'
    },
    {
      type: 'Cookie hiệu suất',
      description: 'Giúp chúng tôi hiểu cách bạn sử dụng website',
      required: false,
      examples: 'Google Analytics, thống kê truy cập'
    },
    {
      type: 'Cookie chức năng',
      description: 'Ghi nhớ lựa chọn và cài đặt của bạn',
      required: false,
      examples: 'Ngôn ngữ, tiền tệ, giao diện'
    },
    {
      type: 'Cookie quảng cáo',
      description: 'Hiển thị quảng cáo phù hợp với sở thích',
      required: false,
      examples: 'Facebook Pixel, Google Ads'
    }
  ]

  const contactInfo = {
    dpo: {
      title: 'Cán bộ Bảo vệ Dữ liệu (DPO)',
      name: 'Nguyễn Văn An',
      email: 'dpo@yapee.vn',
      phone: '1900 1234 (máy lẻ 3)'
    },
    legal: {
      title: 'Phòng Pháp chế',
      email: 'legal@yapee.vn',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>Chính sách bảo mật - Yapee</title>
        <meta name="description" content="Chính sách bảo mật và quyền riêng tư của Yapee. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Chính sách bảo mật</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yapee cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn một cách minh bạch và an toàn
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="text-sm">
              Cập nhật lần cuối: 15/01/2024
            </Badge>
          </div>
        </div>

        {/* Privacy Principles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Nguyên tắc bảo mật</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {privacyPrinciples.map((principle, index) => {
              const IconComponent = principle.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{principle.title}</h3>
                    <Badge className={principle.color + ' mb-3'}>{principle.title}</Badge>
                    <p className="text-gray-600 text-sm">{principle.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="data-collection" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="data-collection">Thu thập dữ liệu</TabsTrigger>
            <TabsTrigger value="user-rights">Quyền của bạn</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
            <TabsTrigger value="third-party">Bên thứ ba</TabsTrigger>
            <TabsTrigger value="cookies">Cookie</TabsTrigger>
          </TabsList>

          <TabsContent value="data-collection" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Dữ liệu chúng tôi thu thập</h3>
                <p className="text-gray-600">
                  Chúng tôi chỉ thu thập dữ liệu cần thiết để cung cấp dịch vụ tốt nhất cho bạn
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataTypes.map((dataType, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        {dataType.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Bao gồm:</h4>
                          <ul className="space-y-1">
                            {dataType.items.map((item, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Mục đích:</h4>
                          <p className="text-sm text-gray-600">{dataType.purpose}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user-rights" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Quyền của bạn</h3>
                <p className="text-gray-600">
                  Bạn có quyền kiểm soát hoàn toàn dữ liệu cá nhân của mình
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRights.map((right, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{right.right}</h4>
                          <p className="text-gray-600 text-sm mb-3">{right.description}</p>
                          <Button size="sm" variant="outline">
                            {right.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Biện pháp bảo mật</h3>
                <p className="text-gray-600">
                  Chúng tôi sử dụng các công nghệ bảo mật tiên tiến để bảo vệ dữ liệu của bạn
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityMeasures.map((measure, index) => {
                  const IconComponent = measure.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-2">{measure.measure}</h4>
                            <p className="text-gray-600 text-sm">{measure.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg mb-2">Báo cáo sự cố bảo mật</h4>
                      <p className="text-gray-700 mb-3">
                        Nếu bạn phát hiện bất kỳ vấn đề bảo mật nào, vui lòng liên hệ ngay với chúng tôi qua email: security@yapee.vn
                      </p>
                      <Button size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Báo cáo sự cố
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="third-party" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Chia sẻ với bên thứ ba</h3>
                <p className="text-gray-600">
                  Chúng tôi chỉ chia sẻ dữ liệu với các đối tác đáng tin cậy và cần thiết
                </p>
              </div>
              
              <div className="space-y-4">
                {thirdParties.map((party, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{party.name}</h4>
                          <p className="text-sm text-gray-500">{party.examples}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm mb-1">Mục đích</h5>
                          <p className="text-sm text-gray-600">{party.purpose}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm mb-1">Dữ liệu chia sẻ</h5>
                          <p className="text-sm text-gray-600">{party.data}</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Được mã hóa
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cookies" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Chính sách Cookie</h3>
                <p className="text-gray-600">
                  Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn trên website
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cookieTypes.map((cookie, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{cookie.type}</span>
                        <Badge variant={cookie.required ? "default" : "secondary"}>
                          {cookie.required ? "Bắt buộc" : "Tùy chọn"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3">{cookie.description}</p>
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Ví dụ:</h5>
                        <p className="text-sm text-gray-500">{cookie.examples}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg mb-3">Quản lý Cookie</h4>
                  <p className="text-gray-700 mb-4">
                    Bạn có thể quản lý cài đặt cookie trong trình duyệt hoặc thông qua cài đặt tài khoản của mình.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="sm">
                      Cài đặt Cookie
                    </Button>
                    <Button size="sm" variant="outline">
                      Từ chối Cookie không cần thiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Information */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Liên hệ về bảo mật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  {contactInfo.dpo.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Người phụ trách:</strong> {contactInfo.dpo.name}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${contactInfo.dpo.email}`} className="text-blue-600 hover:underline">
                    {contactInfo.dpo.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{contactInfo.dpo.phone}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
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
                <div className="flex items-start">
                  <Globe className="w-4 h-4 mr-2 mt-1" />
                  <span>{contactInfo.legal.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legal Notice */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Thông báo pháp lý</h3>
            <p className="text-gray-600 mb-4">
              Chính sách bảo mật này có hiệu lực từ ngày 15/01/2024. Chúng tôi có thể cập nhật chính sách này theo thời gian. 
              Mọi thay đổi quan trọng sẽ được thông báo trước ít nhất 30 ngày.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Tải xuống PDF
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Đăng ký nhận thông báo cập nhật
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Privacy
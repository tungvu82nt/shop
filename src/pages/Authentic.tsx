import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Shield, CheckCircle, AlertTriangle, Search, Eye, Award, Users, Zap, Lock, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

const Authentic = () => {
  const verificationSteps = [
    {
      step: 1,
      title: 'Kiểm tra nguồn gốc',
      description: 'Xác minh nguồn gốc sản phẩm từ nhà sản xuất hoặc đại lý chính thức',
      icon: Search,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      step: 2,
      title: 'Kiểm tra chất lượng',
      description: 'Đánh giá chất lượng sản phẩm theo tiêu chuẩn quốc tế',
      icon: Eye,
      color: 'bg-green-50 border-green-200'
    },
    {
      step: 3,
      title: 'Cấp chứng nhận',
      description: 'Cấp tem xác thực và chứng nhận hàng chính hãng',
      icon: Award,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      step: 4,
      title: 'Theo dõi liên tục',
      description: 'Giám sát và cập nhật trạng thái xác thực định kỳ',
      icon: TrendingUp,
      color: 'bg-orange-50 border-orange-200'
    }
  ]

  const authenticFeatures = [
    {
      title: 'Tem xác thực QR Code',
      description: 'Mỗi sản phẩm chính hãng đều có tem QR code độc quyền để kiểm tra',
      icon: Shield,
      stats: '99.9% độ chính xác'
    },
    {
      title: 'Đối tác chính thức',
      description: 'Hợp tác trực tiếp với các thương hiệu và nhà phân phối uy tín',
      icon: Users,
      stats: '500+ thương hiệu'
    },
    {
      title: 'Kiểm tra nhanh chóng',
      description: 'Xác thực sản phẩm chỉ trong vài giây bằng công nghệ AI',
      icon: Zap,
      stats: '< 3 giây'
    },
    {
      title: 'Bảo mật tuyệt đối',
      description: 'Hệ thống bảo mật đa lớp để chống làm giả và gian lận',
      icon: Lock,
      stats: '256-bit mã hóa'
    }
  ]

  const brandPartners = [
    {
      name: 'Apple',
      logo: '/api/placeholder/80/40',
      category: 'Điện tử',
      verified: true,
      products: '1,234'
    },
    {
      name: 'Samsung',
      logo: '/api/placeholder/80/40',
      category: 'Điện tử',
      verified: true,
      products: '2,156'
    },
    {
      name: 'Nike',
      logo: '/api/placeholder/80/40',
      category: 'Thời trang',
      verified: true,
      products: '3,421'
    },
    {
      name: 'Adidas',
      logo: '/api/placeholder/80/40',
      category: 'Thể thao',
      verified: true,
      products: '2,876'
    },
    {
      name: 'L\'Oreal',
      logo: '/api/placeholder/80/40',
      category: 'Làm đẹp',
      verified: true,
      products: '1,987'
    },
    {
      name: 'Unilever',
      logo: '/api/placeholder/80/40',
      category: 'Gia dụng',
      verified: true,
      products: '4,532'
    }
  ]

  const fakeWarnings = [
    {
      title: 'Giá quá rẻ so với thị trường',
      description: 'Sản phẩm có giá thấp hơn 30-50% so với giá thị trường thường là hàng giả',
      severity: 'high'
    },
    {
      title: 'Không có tem xác thực',
      description: 'Sản phẩm chính hãng luôn có tem QR code hoặc hologram xác thực',
      severity: 'high'
    },
    {
      title: 'Chất lượng bao bì kém',
      description: 'Bao bì mờ, in ấn kém chất lượng, lỗi chính tả thường là dấu hiệu hàng giả',
      severity: 'medium'
    },
    {
      title: 'Người bán không uy tín',
      description: 'Shop mới, ít đánh giá, không có chứng nhận từ Yapee',
      severity: 'medium'
    },
    {
      title: 'Thông tin sản phẩm mơ hồ',
      description: 'Mô tả sản phẩm không rõ ràng, thiếu thông tin chi tiết',
      severity: 'low'
    }
  ]

  const verificationStats = [
    { label: 'Sản phẩm đã xác thực', value: '2.5M+', icon: CheckCircle },
    { label: 'Thương hiệu đối tác', value: '500+', icon: Award },
    { label: 'Tỷ lệ chính xác', value: '99.9%', icon: Shield },
    { label: 'Người dùng tin tưởng', value: '1.8M+', icon: Users }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Hàng chính hãng - Yapee Authentic</title>
        <meta name="description" content="Cam kết 100% hàng chính hãng với hệ thống xác thực tiên tiến. Mua sắm an toàn tại Yapee." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 mr-4 text-green-500" />
            <h1 className="text-4xl font-bold">Yapee Authentic</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Cam kết 100% hàng chính hãng với hệ thống xác thực tiên tiến. 
            Mua sắm an toàn, yên tâm với Yapee.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {verificationStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <IconComponent className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Verification */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Kiểm tra sản phẩm ngay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input placeholder="Nhập mã QR hoặc SKU sản phẩm" />
                <Button>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Quét mã QR hoặc nhập mã sản phẩm để xác thực
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Quy trình xác thực</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <Card key={index} className={`${step.color} relative`}>
                  <CardContent className="p-6 text-center">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authenticFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{feature.title}</h3>
                          <Badge className="bg-green-100 text-green-800">{feature.stats}</Badge>
                        </div>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Brand Partners & Fake Warnings */}
        <Tabs defaultValue="partners" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="partners">Thương hiệu đối tác</TabsTrigger>
            <TabsTrigger value="warnings">Cảnh báo hàng giả</TabsTrigger>
          </TabsList>
          
          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <CardTitle>Thương hiệu chính thức</CardTitle>
                <CardDescription>
                  Yapee hợp tác trực tiếp với các thương hiệu uy tín để đảm bảo 100% hàng chính hãng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {brandPartners.map((brand, index) => (
                    <Card key={index} className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="w-16 h-8 mx-auto mb-3 bg-gray-100 rounded flex items-center justify-center">
                          <img 
                            src={brand.logo} 
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-center mb-1">
                          <h4 className="font-bold text-sm">{brand.name}</h4>
                          {brand.verified && (
                            <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{brand.category}</p>
                        <Badge variant="outline" className="text-xs">
                          {brand.products} sản phẩm
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="warnings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Cách nhận biết hàng giả
                </CardTitle>
                <CardDescription>
                  Những dấu hiệu cảnh báo giúp bạn tránh mua phải hàng giả, hàng nhái
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fakeWarnings.map((warning, index) => (
                    <Alert key={index} className={`${
                      warning.severity === 'high' ? 'border-red-200 bg-red-50' :
                      warning.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        warning.severity === 'high' ? 'text-red-500' :
                        warning.severity === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold mb-1">{warning.title}</h4>
                            <p className="text-sm">{warning.description}</p>
                          </div>
                          <Badge className={`${
                            warning.severity === 'high' ? 'bg-red-100 text-red-800' :
                            warning.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {warning.severity === 'high' ? 'Cao' :
                             warning.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Guarantee Section */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white mb-8">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Cam kết Yapee Authentic</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold mb-2">100% Chính hãng</h3>
                <p className="text-sm opacity-90">Hoàn tiền 200% nếu phát hiện hàng giả</p>
              </div>
              <div>
                <Star className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold mb-2">Chất lượng đảm bảo</h3>
                <p className="text-sm opacity-90">Kiểm tra chất lượng trước khi giao hàng</p>
              </div>
              <div>
                <Award className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold mb-2">Bảo hành chính hãng</h3>
                <p className="text-sm opacity-90">Hỗ trợ bảo hành từ nhà sản xuất</p>
              </div>
            </div>
            <Button size="lg" variant="secondary">
              Tìm hiểu thêm về cam kết
            </Button>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Câu hỏi thường gặp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-bold mb-2">Làm thế nào để kiểm tra sản phẩm chính hãng?</h4>
                <p className="text-gray-600">Bạn có thể quét mã QR trên sản phẩm hoặc nhập mã SKU vào hệ thống xác thực của Yapee để kiểm tra tính chính hãng.</p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-bold mb-2">Nếu mua phải hàng giả thì sao?</h4>
                <p className="text-gray-600">Yapee cam kết hoàn tiền 200% giá trị sản phẩm nếu bạn mua phải hàng giả từ các shop có chứng nhận Yapee Authentic.</p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-bold mb-2">Tất cả sản phẩm trên Yapee đều chính hãng?</h4>
                <p className="text-gray-600">Các sản phẩm có nhãn "Yapee Authentic" được đảm bảo 100% chính hãng. Các sản phẩm khác vui lòng kiểm tra thông tin shop và đánh giá từ người mua.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Làm sao để trở thành shop Yapee Authentic?</h4>
                <p className="text-gray-600">Shop cần đăng ký và vượt qua quy trình xác thực nghiêm ngặt của Yapee, bao gồm kiểm tra nguồn gốc hàng hóa và ký kết hợp đồng cam kết.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Authentic
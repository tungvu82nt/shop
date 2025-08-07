import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Store, TrendingUp, Users, DollarSign, Package, BarChart3, Settings, HelpCircle, Star, Zap, Shield, Award, ArrowRight, Play } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

const SellerCenter = () => {
  const sellerBenefits = [
    {
      title: 'Tiếp cận hàng triệu khách hàng',
      description: 'Kết nối với 50+ triệu người dùng trên toàn Đông Nam Á',
      icon: Users,
      stats: '50M+ người dùng',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Tăng trưởng doanh số nhanh chóng',
      description: 'Công cụ marketing mạnh mẽ và hỗ trợ bán hàng chuyên nghiệp',
      icon: TrendingUp,
      stats: '+150% doanh thu',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Chi phí vận hành thấp',
      description: 'Phí dịch vụ cạnh tranh, không phí đăng ký ban đầu',
      icon: DollarSign,
      stats: 'Chỉ từ 2.5%',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Hỗ trợ logistics toàn diện',
      description: 'Hệ thống vận chuyển và kho bãi chuyên nghiệp',
      icon: Package,
      stats: '24h giao hàng',
      color: 'bg-purple-50 border-purple-200'
    }
  ]

  const sellerTools = [
    {
      name: 'Seller Dashboard',
      description: 'Quản lý shop, đơn hàng và doanh thu một cách dễ dàng',
      icon: BarChart3,
      features: ['Thống kê real-time', 'Quản lý đơn hàng', 'Báo cáo doanh thu']
    },
    {
      name: 'Marketing Tools',
      description: 'Công cụ quảng cáo và khuyến mãi hiệu quả',
      icon: Zap,
      features: ['Ads Manager', 'Flash Sale', 'Voucher & Discount']
    },
    {
      name: 'Analytics & Insights',
      description: 'Phân tích chi tiết về khách hàng và xu hướng thị trường',
      icon: TrendingUp,
      features: ['Customer Analytics', 'Market Trends', 'Competitor Analysis']
    },
    {
      name: 'Support Center',
      description: 'Hỗ trợ 24/7 từ đội ngũ chuyên gia',
      icon: HelpCircle,
      features: ['Live Chat', 'Phone Support', 'Training Materials']
    }
  ]

  const successStories = [
    {
      shopName: 'Fashion House VN',
      category: 'Thời trang',
      growth: '+300%',
      period: '6 tháng',
      revenue: '2.5 tỷ VNĐ/tháng',
      story: 'Từ shop nhỏ địa phương đến thương hiệu thời trang hàng đầu Việt Nam',
      avatar: '/api/placeholder/60/60'
    },
    {
      shopName: 'Tech Gadgets Pro',
      category: 'Điện tử',
      growth: '+250%',
      period: '8 tháng',
      revenue: '1.8 tỷ VNĐ/tháng',
      story: 'Mở rộng từ 1 cửa hàng thành chuỗi bán lẻ điện tử uy tín',
      avatar: '/api/placeholder/60/60'
    },
    {
      shopName: 'Beauty Corner',
      category: 'Làm đẹp',
      growth: '+400%',
      period: '4 tháng',
      revenue: '3.2 tỷ VNĐ/tháng',
      story: 'Startup làm đẹp trở thành brand được yêu thích nhất',
      avatar: '/api/placeholder/60/60'
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Miễn phí',
      description: 'Dành cho người bán mới bắt đầu',
      features: [
        'Đăng tối đa 100 sản phẩm',
        'Phí giao dịch 3.5%',
        'Hỗ trợ email',
        'Analytics cơ bản'
      ],
      recommended: false,
      buttonText: 'Bắt đầu miễn phí'
    },
    {
      name: 'Professional',
      price: '299,000 VNĐ/tháng',
      description: 'Dành cho shop đang phát triển',
      features: [
        'Đăng không giới hạn sản phẩm',
        'Phí giao dịch 2.5%',
        'Hỗ trợ ưu tiên',
        'Analytics nâng cao',
        'Marketing tools',
        'Bulk upload'
      ],
      recommended: true,
      buttonText: 'Nâng cấp ngay'
    },
    {
      name: 'Enterprise',
      price: 'Liên hệ',
      description: 'Dành cho doanh nghiệp lớn',
      features: [
        'Tất cả tính năng Professional',
        'Phí giao dịch tùy chỉnh',
        'Account manager riêng',
        'API integration',
        'Custom solutions',
        'White-label options'
      ],
      recommended: false,
      buttonText: 'Liên hệ tư vấn'
    }
  ]

  const gettingStartedSteps = [
    {
      step: 1,
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản seller và xác thực thông tin doanh nghiệp',
      time: '5 phút'
    },
    {
      step: 2,
      title: 'Thiết lập shop',
      description: 'Tùy chỉnh giao diện shop và thông tin liên hệ',
      time: '15 phút'
    },
    {
      step: 3,
      title: 'Đăng sản phẩm',
      description: 'Upload sản phẩm với hình ảnh và mô tả chi tiết',
      time: '30 phút'
    },
    {
      step: 4,
      title: 'Bắt đầu bán hàng',
      description: 'Kích hoạt shop và bắt đầu nhận đơn hàng',
      time: '1 phút'
    }
  ]

  const stats = [
    { label: 'Seller đang hoạt động', value: '2M+', icon: Store },
    { label: 'Đơn hàng mỗi ngày', value: '5M+', icon: Package },
    { label: 'Doanh thu trung bình', value: '+180%', icon: TrendingUp },
    { label: 'Đánh giá trung bình', value: '4.8/5', icon: Star }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Trung tâm người bán - Yapee Seller Center</title>
        <meta name="description" content="Tham gia Yapee Seller Center để mở rộng kinh doanh online. Công cụ bán hàng chuyên nghiệp, hỗ trợ 24/7." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Store className="w-12 h-12 mr-4 text-blue-500" />
            <h1 className="text-4xl font-bold">Yapee Seller Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Mở rộng kinh doanh online với nền tảng bán hàng hàng đầu Đông Nam Á. 
            Tiếp cận hàng triệu khách hàng và tăng trưởng doanh thu vượt bậc.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Đăng ký bán hàng ngay
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Xem video hướng dẫn
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Tại sao chọn Yapee?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellerBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className={`${benefit.color} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{benefit.title}</h3>
                          <Badge className="bg-blue-100 text-blue-800">{benefit.stats}</Badge>
                        </div>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tools & Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Công cụ bán hàng chuyên nghiệp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellerTools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                        <p className="text-gray-600 mb-3">{tool.description}</p>
                        <div className="space-y-1">
                          {tool.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-500">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Success Stories & Pricing */}
        <Tabs defaultValue="stories" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories">Câu chuyện thành công</TabsTrigger>
            <TabsTrigger value="pricing">Bảng giá dịch vụ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stories">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        <img 
                          src={story.avatar} 
                          alt={story.shopName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{story.shopName}</h4>
                        <p className="text-sm text-gray-600">{story.category}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{story.growth}</div>
                        <div className="text-xs text-gray-500">Tăng trưởng</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{story.revenue}</div>
                        <div className="text-xs text-gray-500">Doanh thu</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 italic mb-3">"{story.story}"</p>
                    
                    <Badge variant="outline" className="text-xs">
                      Thành công trong {story.period}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pricing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.recommended ? 'border-blue-500 shadow-lg' : ''}`}>
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">Phổ biến nhất</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`w-full ${plan.recommended ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      variant={plan.recommended ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Getting Started */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Bắt đầu bán hàng chỉ trong 4 bước</CardTitle>
            <CardDescription className="text-center">
              Quy trình đơn giản và nhanh chóng để bắt đầu kinh doanh trên Yapee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {gettingStartedSteps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="font-bold mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">{step.time}</Badge>
                  
                  {index < gettingStartedSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-6 -right-3 w-6 h-6 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu hành trình kinh doanh?</h2>
            <p className="text-lg mb-6 opacity-90">
              Tham gia cùng hàng triệu seller thành công trên Yapee. 
              Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Đăng ký miễn phí ngay
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Tư vấn 1:1 miễn phí
              </Button>
            </div>
            
            <div className="mt-6 text-sm opacity-75">
              🎉 Ưu đãi đặc biệt: Miễn phí 3 tháng đầu cho gói Professional
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default SellerCenter
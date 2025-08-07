import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Users, DollarSign, TrendingUp, Gift, Star, Award, Target, Zap, Calculator, BookOpen, MessageCircle, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

const Affiliate = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Hoa hồng hấp dẫn',
      description: 'Nhận hoa hồng lên đến 15% cho mỗi đơn hàng thành công',
      highlight: 'Lên đến 15%'
    },
    {
      icon: TrendingUp,
      title: 'Thu nhập thụ động',
      description: 'Kiếm tiền 24/7 ngay cả khi bạn đang ngủ',
      highlight: 'Thu nhập 24/7'
    },
    {
      icon: Gift,
      title: 'Bonus đặc biệt',
      description: 'Nhận thưởng thêm khi đạt mục tiêu doanh số hàng tháng',
      highlight: 'Thưởng thêm'
    },
    {
      icon: Users,
      title: 'Cộng đồng hỗ trợ',
      description: 'Tham gia cộng đồng affiliate với nhiều tips và tricks',
      highlight: 'Hỗ trợ 24/7'
    }
  ]

  const commissionTiers = [
    {
      tier: 'Đồng',
      minSales: 0,
      commission: '3-5%',
      color: 'bg-amber-100 text-amber-800',
      benefits: ['Dashboard cơ bản', 'Hỗ trợ email', 'Link affiliate cá nhân']
    },
    {
      tier: 'Bạc',
      minSales: 10000000,
      commission: '5-8%',
      color: 'bg-gray-100 text-gray-800',
      benefits: ['Dashboard nâng cao', 'Hỗ trợ ưu tiên', 'Công cụ marketing', 'Báo cáo chi tiết']
    },
    {
      tier: 'Vàng',
      minSales: 50000000,
      commission: '8-12%',
      color: 'bg-yellow-100 text-yellow-800',
      benefits: ['Account manager riêng', 'Chiến dịch độc quyền', 'Thanh toán nhanh', 'Workshop miễn phí']
    },
    {
      tier: 'Kim cương',
      minSales: 100000000,
      commission: '12-15%',
      color: 'bg-blue-100 text-blue-800',
      benefits: ['Hoa hồng cao nhất', 'Sự kiện VIP', 'Tư vấn 1-1', 'Cơ hội hợp tác đặc biệt']
    }
  ]

  const topAffiliates = [
    {
      rank: 1,
      name: 'Nguyễn Văn A',
      avatar: '/api/placeholder/40/40',
      sales: 250000000,
      commission: 15000000,
      tier: 'Kim cương'
    },
    {
      rank: 2,
      name: 'Trần Thị B',
      avatar: '/api/placeholder/40/40',
      sales: 180000000,
      commission: 12000000,
      tier: 'Kim cương'
    },
    {
      rank: 3,
      name: 'Lê Văn C',
      avatar: '/api/placeholder/40/40',
      sales: 120000000,
      commission: 8500000,
      tier: 'Vàng'
    },
    {
      rank: 4,
      name: 'Phạm Thị D',
      avatar: '/api/placeholder/40/40',
      sales: 95000000,
      commission: 6800000,
      tier: 'Vàng'
    },
    {
      rank: 5,
      name: 'Hoàng Văn E',
      avatar: '/api/placeholder/40/40',
      sales: 75000000,
      commission: 5200000,
      tier: 'Bạc'
    }
  ]

  const marketingTools = [
    {
      icon: Target,
      title: 'Banner quảng cáo',
      description: 'Hơn 100+ banner đẹp mắt, chuyên nghiệp cho mọi kích thước'
    },
    {
      icon: Zap,
      title: 'Link rút gọn',
      description: 'Tạo link affiliate ngắn gọn, dễ nhớ và theo dõi hiệu quả'
    },
    {
      icon: BarChart3,
      title: 'Analytics chi tiết',
      description: 'Theo dõi clicks, conversions và thu nhập real-time'
    },
    {
      icon: BookOpen,
      title: 'Content templates',
      description: 'Mẫu bài viết, review sản phẩm được tối ưu SEO'
    }
  ]

  const successStories = [
    {
      name: 'Minh Anh',
      role: 'Beauty Blogger',
      avatar: '/api/placeholder/60/60',
      story: 'Từ 0 đến 50 triệu/tháng chỉ trong 6 tháng với Yapee Affiliate',
      income: '50,000,000 VNĐ/tháng',
      quote: 'Yapee đã thay đổi cuộc sống của tôi. Từ một blogger nhỏ, giờ tôi có thu nhập ổn định và tự do tài chính.'
    },
    {
      name: 'Đức Thành',
      role: 'Tech Reviewer',
      avatar: '/api/placeholder/60/60',
      story: 'Chuyên gia công nghệ với hơn 100K followers',
      income: '35,000,000 VNĐ/tháng',
      quote: 'Hoa hồng từ Yapee giúp tôi tập trung hoàn toàn vào việc tạo content chất lượng mà không lo về tài chính.'
    },
    {
      name: 'Thu Hà',
      role: 'Lifestyle Influencer',
      avatar: '/api/placeholder/60/60',
      story: 'Mẹ bỉm sữa kiếm thêm thu nhập từ nhà',
      income: '25,000,000 VNĐ/tháng',
      quote: 'Làm affiliate cho phép tôi vừa chăm con vừa có thu nhập. Rất phù hợp với các mẹ như tôi.'
    }
  ]

  const faqs = [
    {
      question: 'Làm thế nào để trở thành affiliate của Yapee?',
      answer: 'Bạn chỉ cần đăng ký tài khoản, điền thông tin cá nhân và chờ phê duyệt. Quá trình thường mất 1-2 ngày làm việc.'
    },
    {
      question: 'Tôi có cần website riêng không?',
      answer: 'Không bắt buộc. Bạn có thể sử dụng social media, blog cá nhân hoặc bất kỳ kênh nào để chia sẻ link affiliate.'
    },
    {
      question: 'Khi nào tôi nhận được hoa hồng?',
      answer: 'Hoa hồng được tính sau khi đơn hàng hoàn thành (không hoàn trả) và được thanh toán vào ngày 15 hàng tháng.'
    },
    {
      question: 'Có giới hạn số lượng sản phẩm tôi có thể quảng bá không?',
      answer: 'Không có giới hạn. Bạn có thể quảng bá bất kỳ sản phẩm nào có sẵn trên Yapee.'
    },
    {
      question: 'Tôi có thể theo dõi hiệu quả như thế nào?',
      answer: 'Dashboard affiliate cung cấp thống kê real-time về clicks, conversions, doanh số và hoa hồng của bạn.'
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  return (
    <Layout>
      <Helmet>
        <title>Chương trình Affiliate - Kiếm tiền cùng Yapee</title>
        <meta name="description" content="Tham gia chương trình affiliate Yapee. Kiếm hoa hồng lên đến 15%, công cụ marketing miễn phí, hỗ trợ 24/7." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white rounded-2xl p-8 mb-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              💰 Kiếm tiền cùng Yapee Affiliate
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Tham gia chương trình affiliate #1 Việt Nam. Hoa hồng lên đến 15%, công cụ marketing miễn phí, hỗ trợ 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Đăng ký ngay
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Calculator className="w-5 h-5 mr-2" />
                Tính toán thu nhập
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Tại sao chọn Yapee Affiliate?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    <Badge className="bg-purple-500">{benefit.highlight}</Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Commission Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Bậc hoa hồng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionTiers.map((tier, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Badge className={`${tier.color} text-lg py-2 px-4 mb-2`}>
                    {tier.tier}
                  </Badge>
                  <CardTitle className="text-2xl text-purple-600">{tier.commission}</CardTitle>
                  <CardDescription>
                    Doanh số tối thiểu: {formatPrice(tier.minSales)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Affiliates */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Top Affiliate tháng này</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topAffiliates.map((affiliate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full font-bold">
                        {affiliate.rank}
                      </div>
                      <img 
                        src={affiliate.avatar} 
                        alt={affiliate.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-bold">{affiliate.name}</div>
                        <Badge className={`text-xs ${
                          affiliate.tier === 'Kim cương' ? 'bg-blue-100 text-blue-800' :
                          affiliate.tier === 'Vàng' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {affiliate.tier}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatPrice(affiliate.commission)}</div>
                      <div className="text-sm text-gray-500">Doanh số: {formatPrice(affiliate.sales)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketing Tools */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Công cụ marketing miễn phí</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketingTools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{tool.title}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Câu chuyện thành công</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <img 
                      src={story.avatar} 
                      alt={story.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3"
                    />
                    <h3 className="font-bold text-lg">{story.name}</h3>
                    <p className="text-purple-600 font-medium">{story.role}</p>
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      {story.income}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 italic">"{story.quote}"</p>
                  <p className="text-sm font-medium text-center">{story.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Câu hỏi thường gặp</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 ml-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu kiếm tiền?</h2>
          <p className="text-xl mb-6 opacity-90">
            Tham gia cùng hàng nghìn affiliate đang kiếm tiền mỗi ngày với Yapee
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Users className="w-5 h-5 mr-2" />
              Đăng ký miễn phí
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <MessageCircle className="w-5 h-5 mr-2" />
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Affiliate
import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Users, Target, Award, Globe, Heart, Shield, Zap, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const About = () => {
  const stats = [
    {
      number: '50M+',
      label: 'Người dùng',
      description: 'Trên toàn khu vực Đông Nam Á',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      number: '2M+',
      label: 'Nhà bán hàng',
      description: 'Đối tác kinh doanh tin cậy',
      icon: Globe,
      color: 'text-green-500'
    },
    {
      number: '100M+',
      label: 'Sản phẩm',
      description: 'Đa dạng mọi danh mục',
      icon: Award,
      color: 'text-purple-500'
    },
    {
      number: '99.9%',
      label: 'Độ tin cậy',
      description: 'Giao dịch an toàn',
      icon: Shield,
      color: 'text-orange-500'
    }
  ]

  const values = [
    {
      title: 'Khách hàng là trung tâm',
      description: 'Chúng tôi luôn đặt nhu cầu và trải nghiệm của khách hàng lên hàng đầu trong mọi quyết định.',
      icon: Heart,
      color: 'bg-red-50 border-red-200'
    },
    {
      title: 'Đổi mới không ngừng',
      description: 'Không ngừng cải tiến và phát triển công nghệ để mang đến trải nghiệm mua sắm tốt nhất.',
      icon: Zap,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Minh bạch và tin cậy',
      description: 'Xây dựng niềm tin thông qua sự minh bạch trong mọi hoạt động kinh doanh.',
      icon: Shield,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Phát triển bền vững',
      description: 'Cam kết phát triển kinh doanh song hành với trách nhiệm xã hội và môi trường.',
      icon: TrendingUp,
      color: 'bg-blue-50 border-blue-200'
    }
  ]

  const milestones = [
    {
      year: '2015',
      title: 'Thành lập Yapee',
      description: 'Ra mắt tại Singapore với tầm nhìn kết nối người mua và người bán'
    },
    {
      year: '2016',
      title: 'Mở rộng khu vực',
      description: 'Có mặt tại Malaysia, Thailand, Philippines, Indonesia, Vietnam và Taiwan'
    },
    {
      year: '2018',
      title: 'Yapee Pay ra đời',
      description: 'Phát triển hệ sinh thái thanh toán số hoàn chỉnh'
    },
    {
      year: '2020',
      title: 'Yapee Mall',
      description: 'Ra mắt nền tảng thương mại điện tử B2C với các thương hiệu chính hãng'
    },
    {
      year: '2022',
      title: 'Yapee Live',
      description: 'Tiên phong trong lĩnh vực livestream shopping tại Đông Nam Á'
    },
    {
      year: '2024',
      title: 'AI Shopping Assistant',
      description: 'Tích hợp trí tuệ nhân tạo để cá nhân hóa trải nghiệm mua sắm'
    }
  ]

  const leadership = [
    {
      name: 'Forrest Li',
      position: 'CEO & Founder',
      image: '/api/placeholder/150/150',
      description: 'Nhà sáng lập và CEO của Sea Limited, công ty mẹ của Yapee'
    },
    {
      name: 'Chris Feng',
      position: 'Chief Commercial Officer',
      image: '/api/placeholder/150/150',
      description: 'Chịu trách nhiệm phát triển kinh doanh và mở rộng thị trường'
    },
    {
      name: 'Zhou Junjie',
      position: 'Chief Technology Officer',
      image: '/api/placeholder/150/150',
      description: 'Dẫn dắt đội ngũ công nghệ và phát triển sản phẩm'
    },
    {
      name: 'Terence Pang',
      position: 'Chief Operating Officer',
      image: '/api/placeholder/150/150',
      description: 'Quản lý vận hành và tối ưu hóa quy trình kinh doanh'
    }
  ]

  const awards = [
    {
      year: '2024',
      title: 'Top E-commerce Platform',
      organization: 'Southeast Asia Digital Awards',
      description: 'Nền tảng thương mại điện tử hàng đầu Đông Nam Á'
    },
    {
      year: '2023',
      title: 'Best Mobile Shopping App',
      organization: 'Mobile Excellence Awards',
      description: 'Ứng dụng mua sắm di động xuất sắc nhất'
    },
    {
      year: '2022',
      title: 'Innovation in Fintech',
      organization: 'Asia Fintech Awards',
      description: 'Đổi mới sáng tạo trong lĩnh vực công nghệ tài chính'
    },
    {
      year: '2021',
      title: 'Sustainable Business Leader',
      organization: 'Green Business Awards',
      description: 'Doanh nghiệp phát triển bền vững hàng đầu'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Về Yapee - Câu chuyện của chúng tôi</title>
        <meta name="description" content="Tìm hiểu về Yapee - nền tảng thương mại điện tử hàng đầu Đông Nam Á" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Về Yapee</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Yapee là nền tảng thương mại điện tử hàng đầu Đông Nam Á, kết nối hàng triệu người mua và người bán, 
            mang đến trải nghiệm mua sắm trực tuyến an toàn, tiện lợi và thú vị.
          </p>
          <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-8">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Kết nối. Mua sắm. Phát triển.</h2>
              <p className="text-lg opacity-90">Cùng nhau xây dựng tương lai thương mại điện tử</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <IconComponent className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                  <p className="font-medium mb-1">{stat.label}</p>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-500" />
                Sứ mệnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Democratize commerce through technology - Dân chủ hóa thương mại thông qua công nghệ. 
                Chúng tôi tin rằng mọi người đều xứng đáng có cơ hội tham gia và thành công trong nền kinh tế số, 
                bất kể quy mô hay vị trí địa lý.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-6 h-6 mr-2 text-green-500" />
                Tầm nhìn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Trở thành nền tảng thương mại điện tử và công nghệ tài chính hàng đầu tại Đông Nam Á, 
                tạo ra một hệ sinh thái số hoàn chỉnh phục vụ nhu cầu của người tiêu dùng và doanh nghiệp 
                trong thời đại kỹ thuật số.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className={`${value.color} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Hành trình phát triển</CardTitle>
            <CardDescription>
              Những cột mốc quan trọng trong quá trình phát triển của Yapee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                      {milestone.year}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leadership */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Đội ngũ lãnh đạo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                    <img 
                      src={leader.image} 
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{leader.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{leader.position}</p>
                  <p className="text-sm text-gray-600">{leader.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-500" />
              Giải thưởng & Công nhận
            </CardTitle>
            <CardDescription>
              Những giải thưởng và sự công nhận mà Yapee đã nhận được
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {awards.map((award, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-yellow-100 text-yellow-800">{award.year}</Badge>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{award.title}</h4>
                  <p className="text-blue-600 font-medium mb-2">{award.organization}</p>
                  <p className="text-sm text-gray-600">{award.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Tham gia cùng chúng tôi</h2>
            <p className="text-lg mb-6 opacity-90">
              Hãy trở thành một phần của hành trình phát triển thương mại điện tử tại Đông Nam Á
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Tìm hiểu cơ hội nghề nghiệp
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Trở thành đối tác
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default About
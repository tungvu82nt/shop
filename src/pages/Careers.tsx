import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Briefcase, Users, MapPin, Clock, DollarSign, Search, Filter, Heart, Zap, Globe, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'TP. Hồ Chí Minh',
      type: 'Full-time',
      salary: '25-35 triệu VNĐ',
      experience: '3-5 năm',
      description: 'Phát triển giao diện người dùng cho các sản phẩm của Yapee',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      posted: '2 ngày trước',
      urgent: true
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'Hà Nội',
      type: 'Full-time',
      salary: '30-45 triệu VNĐ',
      experience: '4-6 năm',
      description: 'Quản lý sản phẩm và định hướng phát triển tính năng mới',
      skills: ['Product Strategy', 'Data Analysis', 'User Research', 'Agile'],
      posted: '1 tuần trước',
      urgent: false
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '28-40 triệu VNĐ',
      experience: '3-5 năm',
      description: 'Xây dựng và duy trì hạ tầng cloud cho hệ thống Yapee',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      posted: '3 ngày trước',
      urgent: true
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'TP. Hồ Chí Minh',
      type: 'Full-time',
      salary: '20-30 triệu VNĐ',
      experience: '2-4 năm',
      description: 'Thiết kế trải nghiệm người dùng cho ứng dụng mobile và web',
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
      posted: '5 ngày trước',
      urgent: false
    },
    {
      id: 5,
      title: 'Data Scientist',
      department: 'Data & Analytics',
      location: 'Hà Nội',
      type: 'Full-time',
      salary: '35-50 triệu VNĐ',
      experience: '4-7 năm',
      description: 'Phân tích dữ liệu và xây dựng mô hình machine learning',
      skills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow'],
      posted: '1 ngày trước',
      urgent: true
    },
    {
      id: 6,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'TP. Hồ Chí Minh',
      type: 'Full-time',
      salary: '25-35 triệu VNĐ',
      experience: '3-5 năm',
      description: 'Phát triển và thực hiện chiến lược marketing digital',
      skills: ['Digital Marketing', 'SEO/SEM', 'Social Media', 'Analytics'],
      posted: '4 ngày trước',
      urgent: false
    }
  ]

  const benefits = [
    {
      title: 'Lương thưởng cạnh tranh',
      description: 'Mức lương hấp dẫn + thưởng hiệu suất + cổ phiếu công ty',
      icon: DollarSign,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Môi trường làm việc linh hoạt',
      description: 'Hybrid working, flexible hours, unlimited PTO',
      icon: Clock,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Phát triển nghề nghiệp',
      description: 'Training budget, conference, mentorship program',
      icon: Award,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Bảo hiểm toàn diện',
      description: 'Bảo hiểm y tế cao cấp cho nhân viên và gia đình',
      icon: Heart,
      color: 'bg-red-50 border-red-200'
    },
    {
      title: 'Văn hóa đổi mới',
      description: 'Khuyến khích sáng tạo, thử nghiệm và học hỏi',
      icon: Zap,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Cơ hội quốc tế',
      description: 'Làm việc với team đa quốc gia, cơ hội overseas',
      icon: Globe,
      color: 'bg-indigo-50 border-indigo-200'
    }
  ]

  const departments = [
    { name: 'Engineering', count: 45, description: 'Phát triển sản phẩm và công nghệ' },
    { name: 'Product', count: 12, description: 'Quản lý sản phẩm và chiến lược' },
    { name: 'Design', count: 8, description: 'Thiết kế trải nghiệm người dùng' },
    { name: 'Data & Analytics', count: 15, description: 'Phân tích dữ liệu và insights' },
    { name: 'Marketing', count: 20, description: 'Marketing và truyền thông' },
    { name: 'Operations', count: 25, description: 'Vận hành và logistics' },
    { name: 'Business Development', count: 10, description: 'Phát triển kinh doanh' },
    { name: 'HR & Admin', count: 6, description: 'Nhân sự và hành chính' }
  ]

  const testimonials = [
    {
      name: 'Nguyễn Minh Anh',
      position: 'Senior Software Engineer',
      avatar: '/api/placeholder/60/60',
      quote: 'Yapee là nơi tôi có thể phát triển kỹ năng technical và leadership. Môi trường làm việc rất năng động và đầy thử thách.',
      years: '3 năm'
    },
    {
      name: 'Trần Thị Hương',
      position: 'Product Manager',
      avatar: '/api/placeholder/60/60',
      quote: 'Tôi yêu thích việc được làm việc với các sản phẩm có impact lớn đến hàng triệu người dùng. Team work ở đây rất tuyệt vời.',
      years: '2 năm'
    },
    {
      name: 'Lê Văn Đức',
      position: 'UX Designer',
      avatar: '/api/placeholder/60/60',
      quote: 'Yapee cho tôi cơ hội thiết kế những trải nghiệm người dùng tốt nhất. Công ty rất đầu tư cho việc phát triển nhân viên.',
      years: '1.5 năm'
    }
  ]

  const hiringProcess = [
    {
      step: 1,
      title: 'Ứng tuyển',
      description: 'Gửi CV và cover letter qua website hoặc email',
      duration: '1 ngày'
    },
    {
      step: 2,
      title: 'Sàng lọc CV',
      description: 'HR review và liên hệ với ứng viên phù hợp',
      duration: '3-5 ngày'
    },
    {
      step: 3,
      title: 'Phỏng vấn HR',
      description: 'Trao đổi về background, motivation và culture fit',
      duration: '30-45 phút'
    },
    {
      step: 4,
      title: 'Technical Interview',
      description: 'Đánh giá kỹ năng chuyên môn với hiring manager',
      duration: '60-90 phút'
    },
    {
      step: 5,
      title: 'Final Interview',
      description: 'Phỏng vấn với leadership team và offer negotiation',
      duration: '45-60 phút'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Tuyển dụng - Yapee Careers</title>
        <meta name="description" content="Tham gia đội ngũ Yapee - Cơ hội nghề nghiệp tuyệt vời trong lĩnh vực công nghệ và thương mại điện tử" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 flex items-center justify-center">
            <Briefcase className="w-10 h-10 mr-3 text-blue-500" />
            Careers at Yapee
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Tham gia cùng chúng tôi để xây dựng tương lai của thương mại điện tử tại Đông Nam Á. 
            Nơi tài năng được phát triển và ý tưởng được hiện thực hóa.
          </p>
          <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-8">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Join Our Mission</h2>
              <p className="text-lg opacity-90">Democratize Commerce Through Technology</p>
            </div>
          </div>
        </div>

        {/* Job Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Tìm kiếm cơ hội nghề nghiệp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input placeholder="Tìm kiếm vị trí..." />
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Địa điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả địa điểm</SelectItem>
                    <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="hn">Hà Nội</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Vị trí đang tuyển dụng</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {jobOpenings.length} vị trí
            </Badge>
          </div>
          
          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        {job.urgent && (
                          <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Đăng {job.posted}</span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Xem chi tiết</Button>
                          <Button size="sm">Ứng tuyển ngay</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Tại sao chọn Yapee?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className={`${benefit.color} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-3">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Departments */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Các phòng ban
            </CardTitle>
            <CardDescription>
              Khám phá cơ hội nghề nghiệp tại các phòng ban khác nhau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{dept.name}</h4>
                    <Badge variant="outline">{dept.count} vị trí</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{dept.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials & Hiring Process */}
        <Tabs defaultValue="testimonials" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testimonials">Nhân viên nói gì</TabsTrigger>
            <TabsTrigger value="process">Quy trình tuyển dụng</TabsTrigger>
          </TabsList>
          
          <TabsContent value="testimonials">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.position}</p>
                        <p className="text-xs text-blue-600">{testimonial.years} tại Yapee</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="process">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {hiringProcess.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-lg">{step.title}</h4>
                          <Badge variant="outline">{step.duration}</Badge>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng tham gia Yapee?</h2>
            <p className="text-lg mb-6 opacity-90">
              Không tìm thấy vị trí phù hợp? Hãy gửi CV cho chúng tôi để được cập nhật cơ hội mới nhất!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Gửi CV tự do
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Đăng ký nhận thông báo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Careers
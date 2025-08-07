import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Shield, Clock, CheckCircle, FileText, Phone, Mail, MapPin, AlertCircle, Award, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const Warranty = () => {
  const warrantyTypes = [
    {
      type: 'Bảo hành chính hãng',
      duration: '12-36 tháng',
      description: 'Bảo hành trực tiếp từ nhà sản xuất với đầy đủ quyền lợi',
      icon: Award,
      color: 'bg-green-100 text-green-800',
      features: [
        'Bảo hành toàn cầu',
        'Thay thế sản phẩm mới',
        'Hỗ trợ kỹ thuật 24/7',
        'Phụ kiện chính hãng'
      ]
    },
    {
      type: 'Bảo hành Yapee',
      duration: '6-12 tháng',
      description: 'Bảo hành bởi Yapee cho các sản phẩm không có bảo hành chính hãng',
      icon: Shield,
      color: 'bg-blue-100 text-blue-800',
      features: [
        'Sửa chữa miễn phí',
        'Đổi sản phẩm tương đương',
        'Hỗ trợ tận nơi',
        'Cam kết chất lượng'
      ]
    },
    {
      type: 'Bảo hành mở rộng',
      duration: 'Tùy chọn',
      description: 'Gia hạn thời gian bảo hành với các gói dịch vụ cao cấp',
      icon: Clock,
      color: 'bg-purple-100 text-purple-800',
      features: [
        'Gia hạn đến 5 năm',
        'Bảo hiểm rơi vỡ',
        'Vệ sinh bảo dưỡng',
        'Ưu tiên xử lý'
      ]
    }
  ]

  const warrantyProcess = [
    {
      step: 1,
      title: 'Kiểm tra bảo hành',
      description: 'Nhập mã sản phẩm hoặc số hóa đơn để kiểm tra tình trạng bảo hành',
      icon: FileText
    },
    {
      step: 2,
      title: 'Đăng ký yêu cầu',
      description: 'Điền form yêu cầu bảo hành với mô tả chi tiết vấn đề',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Gửi sản phẩm',
      description: 'Gửi sản phẩm đến trung tâm bảo hành hoặc chúng tôi sẽ đến lấy',
      icon: MapPin
    },
    {
      step: 4,
      title: 'Xử lý & trả kết quả',
      description: 'Kiểm tra, sửa chữa và trả sản phẩm trong thời gian cam kết',
      icon: Award
    }
  ]

  const warrantyTerms = [
    {
      title: 'Điều kiện bảo hành',
      items: [
        'Sản phẩm còn trong thời hạn bảo hành',
        'Có hóa đơn mua hàng hợp lệ',
        'Tem bảo hành còn nguyên vẹn',
        'Không có dấu hiệu tác động vật lý'
      ]
    },
    {
      title: 'Không áp dụng bảo hành',
      items: [
        'Hư hỏng do sử dụng sai cách',
        'Rơi vỡ, ngấm nước, cháy nổ',
        'Tự ý sửa chữa, thay đổi',
        'Hết thời hạn bảo hành'
      ]
    },
    {
      title: 'Quyền lợi khách hàng',
      items: [
        'Miễn phí kiểm tra và báo giá',
        'Thay thế sản phẩm mới nếu không sửa được',
        'Bảo hành cho phần đã sửa chữa',
        'Hỗ trợ vận chuyển 2 chiều'
      ]
    }
  ]

  const serviceCenters = [
    {
      city: 'TP. Hồ Chí Minh',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '028 1234 5678',
      email: 'baohanh.hcm@yapee.vn',
      hours: '8:00 - 18:00 (T2-T7)',
      services: ['Điện tử', 'Gia dụng', 'Thời trang']
    },
    {
      city: 'Hà Nội',
      address: '456 Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
      phone: '024 1234 5678',
      email: 'baohanh.hn@yapee.vn',
      hours: '8:00 - 18:00 (T2-T7)',
      services: ['Điện tử', 'Gia dụng', 'Máy tính']
    },
    {
      city: 'Đà Nẵng',
      address: '789 Hải Châu, Quận Hải Châu, Đà Nẵng',
      phone: '0236 1234 567',
      email: 'baohanh.dn@yapee.vn',
      hours: '8:00 - 17:30 (T2-T6)',
      services: ['Điện tử', 'Gia dụng']
    }
  ]

  const warrantyStats = [
    {
      label: 'Thời gian xử lý trung bình',
      value: '3-5 ngày',
      icon: Clock
    },
    {
      label: 'Tỷ lệ hài lòng khách hàng',
      value: '98.5%',
      icon: Users
    },
    {
      label: 'Sản phẩm được bảo hành',
      value: '500K+',
      icon: Shield
    },
    {
      label: 'Trung tâm bảo hành',
      value: '50+',
      icon: MapPin
    }
  ]

  const faqs = [
    {
      question: 'Làm thế nào để kiểm tra thời hạn bảo hành?',
      answer: 'Bạn có thể kiểm tra bằng cách nhập mã sản phẩm hoặc số hóa đơn trên trang web, hoặc liên hệ hotline để được hỗ trợ.'
    },
    {
      question: 'Tôi có thể bảo hành tại nhà không?',
      answer: 'Đối với các sản phẩm lớn như tủ lạnh, máy giặt, chúng tôi hỗ trợ bảo hành tại nhà. Các sản phẩm nhỏ cần mang đến trung tâm bảo hành.'
    },
    {
      question: 'Chi phí vận chuyển bảo hành như thế nào?',
      answer: 'Yapee hỗ trợ miễn phí vận chuyển 2 chiều cho tất cả sản phẩm trong thời hạn bảo hành.'
    },
    {
      question: 'Nếu sản phẩm không sửa được thì sao?',
      answer: 'Chúng tôi sẽ thay thế bằng sản phẩm mới cùng loại hoặc tương đương. Nếu không còn hàng, bạn sẽ được hoàn tiền 100%.'
    },
    {
      question: 'Bảo hành có áp dụng cho phụ kiện không?',
      answer: 'Phụ kiện đi kèm sản phẩm chính được bảo hành theo thời gian quy định của từng loại phụ kiện.'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Chính sách bảo hành - Yapee</title>
        <meta name="description" content="Thông tin chi tiết về chính sách bảo hành, quy trình bảo hành và trung tâm bảo hành của Yapee trên toàn quốc." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Chính sách bảo hành</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cam kết bảo hành chuyên nghiệp, nhanh chóng và đáng tin cậy cho mọi sản phẩm tại Yapee
          </p>
        </div>

        {/* Warranty Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {warrantyStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Warranty Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Các loại bảo hành</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warrantyTypes.map((warranty, index) => {
              const IconComponent = warranty.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-gray-600" />
                    </div>
                    <CardTitle className="text-xl">{warranty.type}</CardTitle>
                    <Badge className={warranty.color}>{warranty.duration}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-center">{warranty.description}</p>
                    <ul className="space-y-2">
                      {warranty.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
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

        {/* Warranty Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Quy trình bảo hành</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {warrantyProcess.map((process, index) => {
              const IconComponent = process.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {process.step}
                    </div>
                    <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">{process.title}</h3>
                    <p className="text-gray-600 text-sm">{process.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Warranty Check Form */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Kiểm tra bảo hành</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Tra cứu thông tin bảo hành
              </CardTitle>
              <CardDescription>
                Nhập thông tin sản phẩm để kiểm tra tình trạng bảo hành
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product-code">Mã sản phẩm / Số serial</Label>
                <Input 
                  id="product-code" 
                  placeholder="Nhập mã sản phẩm hoặc số serial" 
                />
              </div>
              <div>
                <Label htmlFor="invoice-number">Số hóa đơn (tùy chọn)</Label>
                <Input 
                  id="invoice-number" 
                  placeholder="Nhập số hóa đơn" 
                />
              </div>
              <Button className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Kiểm tra bảo hành
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Warranty Terms */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Điều khoản bảo hành</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warrantyTerms.map((term, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{term.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {term.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Centers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Trung tâm bảo hành</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceCenters.map((center, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {center.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <strong>Địa chỉ:</strong> {center.address}
                  </div>
                  <div className="text-sm">
                    <strong>Điện thoại:</strong> {center.phone}
                  </div>
                  <div className="text-sm">
                    <strong>Email:</strong> {center.email}
                  </div>
                  <div className="text-sm">
                    <strong>Giờ làm việc:</strong> {center.hours}
                  </div>
                  <div>
                    <strong className="text-sm">Dịch vụ:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {center.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Warranty Request Form */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Đăng ký yêu cầu bảo hành</h2>
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Thông tin yêu cầu bảo hành</CardTitle>
              <CardDescription>
                Vui lòng điền đầy đủ thông tin để chúng tôi xử lý yêu cầu nhanh nhất
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-name">Họ và tên</Label>
                  <Input id="customer-name" placeholder="Nhập họ và tên" />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Số điện thoại</Label>
                  <Input id="customer-phone" placeholder="Nhập số điện thoại" />
                </div>
              </div>
              <div>
                <Label htmlFor="customer-email">Email</Label>
                <Input id="customer-email" type="email" placeholder="Nhập email" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-name">Tên sản phẩm</Label>
                  <Input id="product-name" placeholder="Nhập tên sản phẩm" />
                </div>
                <div>
                  <Label htmlFor="purchase-date">Ngày mua</Label>
                  <Input id="purchase-date" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="issue-description">Mô tả vấn đề</Label>
                <Textarea 
                  id="issue-description" 
                  placeholder="Mô tả chi tiết vấn đề gặp phải với sản phẩm"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-600">
                  Vui lòng chuẩn bị sẵn hóa đơn mua hàng và hình ảnh sản phẩm để hỗ trợ xử lý nhanh hơn
                </span>
              </div>
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Gửi yêu cầu bảo hành
              </Button>
            </CardContent>
          </Card>
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
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ bảo hành?</h2>
          <p className="text-gray-600 mb-6">
            Liên hệ với chúng tôi để được tư vấn và hỗ trợ bảo hành nhanh chóng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              <Phone className="w-4 h-4 mr-2" />
              Hotline: 1900 1234
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email: baohanh@yapee.vn
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Warranty
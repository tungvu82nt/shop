import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, User, Building } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Hotline 24/7',
      content: '1900 1234',
      description: 'Miễn phí từ điện thoại cố định',
      color: 'bg-blue-50 border-blue-200',
      available: true
    },
    {
      icon: MessageCircle,
      title: 'Chat trực tuyến',
      content: 'Hỗ trợ tức thì',
      description: 'Phản hồi trong vòng 2 phút',
      color: 'bg-green-50 border-green-200',
      available: true
    },
    {
      icon: Mail,
      title: 'Email hỗ trợ',
      content: 'support@yapee.vn',
      description: 'Phản hồi trong 24 giờ',
      color: 'bg-purple-50 border-purple-200',
      available: true
    },
    {
      icon: Building,
      title: 'Trung tâm hỗ trợ',
      content: 'Tìm kiếm câu trả lời',
      description: 'Hơn 1000 bài viết hướng dẫn',
      color: 'bg-orange-50 border-orange-200',
      available: true
    }
  ]

  const offices = [
    {
      city: 'TP. Hồ Chí Minh',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '(028) 1234 5678',
      email: 'hcm@yapee.vn',
      hours: 'T2-T6: 8:00-17:30, T7: 8:00-12:00',
      isMain: true
    },
    {
      city: 'Hà Nội',
      address: '456 Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
      phone: '(024) 1234 5678',
      email: 'hn@yapee.vn',
      hours: 'T2-T6: 8:00-17:30, T7: 8:00-12:00',
      isMain: false
    },
    {
      city: 'Đà Nẵng',
      address: '789 Hải Châu, Quận Hải Châu, Đà Nẵng',
      phone: '(0236) 1234 567',
      email: 'dn@yapee.vn',
      hours: 'T2-T6: 8:00-17:30, T7: 8:00-12:00',
      isMain: false
    }
  ]

  const supportTopics = [
    'Đặt hàng và thanh toán',
    'Vận chuyển và giao hàng',
    'Đổi trả và hoàn tiền',
    'Tài khoản và bảo mật',
    'Sản phẩm và dịch vụ',
    'Khiếu nại và góp ý',
    'Hợp tác kinh doanh',
    'Khác'
  ]

  const faqs = [
    {
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer: 'Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" hoặc qua email xác nhận.'
    },
    {
      question: 'Chính sách đổi trả như thế nào?',
      answer: 'Yapee hỗ trợ đổi trả trong vòng 15 ngày với điều kiện sản phẩm còn nguyên vẹn.'
    },
    {
      question: 'Tôi có thể hủy đơn hàng không?',
      answer: 'Bạn có thể hủy đơn hàng trước khi người bán xác nhận và chuẩn bị hàng.'
    },
    {
      question: 'Phí vận chuyển được tính như thế nào?',
      answer: 'Phí vận chuyển phụ thuộc vào khoảng cách, khối lượng và phương thức giao hàng.'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Liên hệ - Yapee</title>
        <meta name="description" content="Liên hệ với đội ngũ hỗ trợ khách hàng Yapee qua nhiều kênh khác nhau" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 mr-3 text-blue-500" />
            Liên hệ với chúng tôi
          </h1>
          <p className="text-gray-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon
            return (
              <Card key={index} className={`${method.color} hover:shadow-lg transition-shadow cursor-pointer`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{method.content}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {method.available && (
                    <Badge className="mt-3 bg-green-100 text-green-800">Đang hoạt động</Badge>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Gửi tin nhắn cho chúng tôi
              </CardTitle>
              <CardDescription>
                Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                    <Input placeholder="Nhập họ và tên" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                    <Input placeholder="Nhập số điện thoại" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input type="email" placeholder="Nhập địa chỉ email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Chủ đề *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chủ đề cần hỗ trợ" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTopics.map((topic, index) => (
                        <SelectItem key={index} value={topic.toLowerCase()}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nội dung *</label>
                  <Textarea 
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." 
                    rows={5}
                  />
                </div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Gửi tin nhắn
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Câu hỏi thường gặp</CardTitle>
              <CardDescription>
                Tìm câu trả lời nhanh chóng cho các vấn đề phổ biến
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Xem thêm câu hỏi
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Office Locations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Văn phòng Yapee
            </CardTitle>
            <CardDescription>
              Địa chỉ các văn phòng và trung tâm hỗ trợ khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offices.map((office, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg">{office.city}</h4>
                    {office.isMain && (
                      <Badge className="bg-blue-100 text-blue-800">Trụ sở chính</Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{office.email}</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Giờ làm việc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Hotline 24/7</h4>
                <p className="text-sm text-gray-600">Hỗ trợ khách hàng 24 giờ/ngày, 7 ngày/tuần</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Luôn sẵn sàng</Badge>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Chat trực tuyến</h4>
                <p className="text-sm text-gray-600">Thứ 2 - Chủ nhật: 7:00 - 22:00</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Đang hoạt động</Badge>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Email hỗ trợ</h4>
                <p className="text-sm text-gray-600">Phản hồi trong vòng 24 giờ làm việc</p>
                <Badge className="mt-2 bg-purple-100 text-purple-800">Nhanh chóng</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Contact
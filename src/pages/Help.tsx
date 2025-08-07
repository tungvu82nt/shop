import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { HelpCircle, Search, MessageCircle, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const Help = () => {
  const faqData = [
    {
      question: 'Làm thế nào để đặt hàng trên Yapee?',
      answer: 'Bạn có thể đặt hàng bằng cách: 1) Tìm kiếm sản phẩm, 2) Thêm vào giỏ hàng, 3) Chọn phương thức thanh toán, 4) Xác nhận đơn hàng.'
    },
    {
      question: 'Tôi có thể hủy đơn hàng không?',
      answer: 'Bạn có thể hủy đơn hàng trong vòng 1 giờ sau khi đặt hàng nếu người bán chưa xác nhận. Sau khi người bán xác nhận, bạn cần liên hệ trực tiếp với người bán.'
    },
    {
      question: 'Yapee có những phương thức thanh toán nào?',
      answer: 'Yapee hỗ trợ thanh toán qua: Thẻ tín dụng/ghi nợ, Ví điện tử (MoMo, ZaloPay), Chuyển khoản ngân hàng, và Thanh toán khi nhận hàng (COD).'
    },
    {
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer: 'Bạn có thể theo dõi đơn hàng trong mục "Đơn mua" trên tài khoản của mình hoặc qua email/SMS thông báo từ Yapee.'
    },
    {
      question: 'Chính sách đổi trả như thế nào?',
      answer: 'Yapee hỗ trợ đổi trả trong vòng 15 ngày với điều kiện sản phẩm còn nguyên vẹn, chưa sử dụng và có đầy đủ bao bì.'
    }
  ]

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Chat trực tuyến',
      description: 'Nhận hỗ trợ ngay lập tức',
      action: 'Bắt đầu chat',
      available: true
    },
    {
      icon: Phone,
      title: 'Hotline',
      description: '1900 1234 (7:00 - 22:00)',
      action: 'Gọi ngay',
      available: true
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'support@yapee.vn',
      action: 'Gửi email',
      available: true
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Trung tâm trợ giúp - Yapee</title>
        <meta name="description" content="Tìm câu trả lời cho các câu hỏi thường gặp và nhận hỗ trợ từ Yapee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 mr-3 text-blue-500" />
            Trung tâm trợ giúp
          </h1>
          <p className="text-gray-600 mb-6">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Tìm kiếm câu hỏi..." 
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* FAQ */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
                <CardDescription>
                  Tìm câu trả lời nhanh chóng cho các vấn đề phổ biến
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Chủ đề phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium mb-2">Đặt hàng & Thanh toán</h3>
                    <p className="text-sm text-gray-600">Hướng dẫn đặt hàng và các phương thức thanh toán</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium mb-2">Vận chuyển & Giao hàng</h3>
                    <p className="text-sm text-gray-600">Thông tin về thời gian và phí vận chuyển</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium mb-2">Đổi trả & Hoàn tiền</h3>
                    <p className="text-sm text-gray-600">Chính sách đổi trả và quy trình hoàn tiền</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium mb-2">Tài khoản & Bảo mật</h3>
                    <p className="text-sm text-gray-600">Quản lý tài khoản và bảo mật thông tin</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact Support */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Liên hệ hỗ trợ</CardTitle>
                <CardDescription>
                  Cần thêm trợ giúp? Liên hệ với chúng tôi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportOptions.map((option, index) => {
                  const IconComponent = option.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium">{option.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Giờ làm việc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Thứ 2 - Thứ 6:</span>
                    <span>8:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thứ 7 - Chủ nhật:</span>
                    <span>9:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chat trực tuyến:</span>
                    <span className="text-green-600">24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Help
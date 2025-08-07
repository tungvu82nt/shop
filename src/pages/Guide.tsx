import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { BookOpen, ShoppingCart, CreditCard, Truck, RotateCcw, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const Guide = () => {
  const guides = [
    {
      icon: ShoppingCart,
      title: 'Hướng dẫn mua hàng',
      description: 'Tìm hiểu cách đặt hàng trên Yapee một cách dễ dàng',
      steps: [
        'Tìm kiếm sản phẩm bằng từ khóa hoặc duyệt theo danh mục',
        'Xem chi tiết sản phẩm, đánh giá và chọn phiên bản phù hợp',
        'Thêm sản phẩm vào giỏ hàng hoặc mua ngay',
        'Điền thông tin giao hàng và chọn phương thức vận chuyển',
        'Chọn phương thức thanh toán và hoàn tất đơn hàng'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: CreditCard,
      title: 'Phương thức thanh toán',
      description: 'Các cách thanh toán an toàn và tiện lợi',
      steps: [
        'Thanh toán khi nhận hàng (COD) - Miễn phí',
        'Thẻ tín dụng/ghi nợ Visa, Mastercard',
        'Ví điện tử: MoMo, ZaloPay, VNPay',
        'Chuyển khoản ngân hàng trực tuyến',
        'Trả góp 0% qua thẻ tín dụng (sản phẩm từ 3 triệu)'
      ],
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: Truck,
      title: 'Vận chuyển & Giao hàng',
      description: 'Thông tin về thời gian và phí vận chuyển',
      steps: [
        'Giao hàng tiêu chuẩn: 3-5 ngày làm việc',
        'Giao hàng nhanh: 1-2 ngày làm việc (phí 25.000đ)',
        'Miễn phí vận chuyển cho đơn hàng từ 150.000đ',
        'Giao hàng tận nơi trong nội thành các thành phố lớn',
        'Kiểm tra hàng trước khi thanh toán (COD)'
      ],
      color: 'bg-orange-50 border-orange-200'
    },
    {
      icon: RotateCcw,
      title: 'Đổi trả & Hoàn tiền',
      description: 'Chính sách đổi trả linh hoạt và thuận tiện',
      steps: [
        'Đổi trả miễn phí trong vòng 15 ngày',
        'Sản phẩm phải còn nguyên vẹn, chưa sử dụng',
        'Giữ nguyên bao bì, nhãn mác và hóa đơn',
        'Hoàn tiền trong 3-7 ngày làm việc',
        'Hỗ trợ đổi size/màu miễn phí (nếu có sẵn)'
      ],
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: Shield,
      title: 'Bảo mật & An toàn',
      description: 'Cam kết bảo vệ thông tin và quyền lợi khách hàng',
      steps: [
        'Mã hóa SSL 256-bit bảo vệ thông tin thanh toán',
        'Xác thực 2 lớp cho tài khoản người dùng',
        'Chính sách bảo mật thông tin cá nhân nghiêm ngặt',
        'Bảo hiểm đơn hàng cho các giao dịch lớn',
        'Hỗ trợ khiếu nại và giải quyết tranh chấp 24/7'
      ],
      color: 'bg-red-50 border-red-200'
    }
  ]

  const quickTips = [
    {
      title: 'Tìm kiếm thông minh',
      tip: 'Sử dụng bộ lọc để tìm sản phẩm phù hợp với ngân sách và nhu cầu'
    },
    {
      title: 'Đọc đánh giá',
      tip: 'Xem đánh giá từ người mua trước để có quyết định mua hàng tốt nhất'
    },
    {
      title: 'So sánh giá',
      tip: 'So sánh giá từ nhiều người bán để tìm được deal tốt nhất'
    },
    {
      title: 'Theo dõi khuyến mãi',
      tip: 'Đăng ký nhận thông báo để không bỏ lỡ các chương trình giảm giá'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Hướng dẫn sử dụng - Yapee</title>
        <meta name="description" content="Hướng dẫn chi tiết cách sử dụng Yapee để mua sắm hiệu quả và an toàn" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
            Hướng dẫn sử dụng
          </h1>
          <p className="text-gray-600">Tìm hiểu cách sử dụng Yapee một cách hiệu quả nhất</p>
        </div>

        {/* Main Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {guides.map((guide, index) => {
            const IconComponent = guide.icon
            return (
              <Card key={index} className={`${guide.color} hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <IconComponent className="w-6 h-6 mr-3" />
                    {guide.title}
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <Badge variant="outline" className="mr-3 mt-0.5 min-w-[24px] h-6 flex items-center justify-center">
                          {stepIndex + 1}
                        </Badge>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mẹo mua sắm thông minh</CardTitle>
            <CardDescription>
              Những lời khuyên hữu ích để có trải nghiệm mua sắm tốt nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Tutorials */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Video hướng dẫn</CardTitle>
            <CardDescription>
              Xem video để hiểu rõ hơn về cách sử dụng Yapee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-medium mb-2">Cách đặt hàng</h4>
                <p className="text-sm text-gray-600 mb-3">Hướng dẫn từng bước đặt hàng trên Yapee</p>
                <Button size="sm" variant="outline">Xem video</Button>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-medium mb-2">Thanh toán an toàn</h4>
                <p className="text-sm text-gray-600 mb-3">Các phương thức thanh toán bảo mật</p>
                <Button size="sm" variant="outline">Xem video</Button>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-medium mb-2">Đổi trả hàng</h4>
                <p className="text-sm text-gray-600 mb-3">Quy trình đổi trả đơn giản</p>
                <Button size="sm" variant="outline">Xem video</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Need More Help */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Cần thêm hỗ trợ?</h2>
          <p className="text-gray-600 mb-6">Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Chat với chúng tôi
            </Button>
            <Button size="lg" variant="outline">
              Gọi hotline: 1900 1234
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Guide
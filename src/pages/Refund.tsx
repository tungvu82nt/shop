import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { CreditCard, Clock, CheckCircle, AlertTriangle, DollarSign, Wallet, Building, Smartphone, Shield, FileText, Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

const Refund = () => {
  const refundMethods = [
    {
      method: 'Ví điện tử',
      icon: Wallet,
      timeframe: '1-2 giờ',
      fee: 'Miễn phí',
      description: 'Hoàn tiền nhanh chóng vào ví Yapee, ZaloPay, MoMo',
      popularity: 85,
      providers: ['Yapee Wallet', 'ZaloPay', 'MoMo', 'ViettelPay']
    },
    {
      method: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      timeframe: '3-5 ngày',
      fee: 'Miễn phí',
      description: 'Hoàn tiền về thẻ ngân hàng đã thanh toán',
      popularity: 70,
      providers: ['Visa', 'Mastercard', 'JCB', 'AMEX']
    },
    {
      method: 'Chuyển khoản ngân hàng',
      icon: Building,
      timeframe: '1-3 ngày',
      fee: 'Miễn phí',
      description: 'Chuyển khoản trực tiếp vào tài khoản ngân hàng',
      popularity: 60,
      providers: ['Vietcombank', 'BIDV', 'VietinBank', 'Techcombank']
    },
    {
      method: 'Tiền mặt tại cửa hàng',
      icon: DollarSign,
      timeframe: 'Ngay lập tức',
      fee: 'Miễn phí',
      description: 'Nhận tiền mặt tại các cửa hàng đối tác',
      popularity: 25,
      providers: ['Circle K', 'FamilyMart', 'VinMart', 'Co.opmart']
    }
  ]

  const refundProcess = [
    {
      step: 1,
      title: 'Yêu cầu hoàn tiền',
      description: 'Khách hàng tạo yêu cầu hoàn tiền trong mục "Đơn hàng của tôi"',
      timeframe: '1-2 phút',
      status: 'completed'
    },
    {
      step: 2,
      title: 'Xác minh thông tin',
      description: 'Yapee xác minh thông tin đơn hàng và lý do hoàn tiền',
      timeframe: '2-4 giờ',
      status: 'active'
    },
    {
      step: 3,
      title: 'Phê duyệt hoàn tiền',
      description: 'Bộ phận tài chính phê duyệt và xử lý yêu cầu hoàn tiền',
      timeframe: '4-8 giờ',
      status: 'pending'
    },
    {
      step: 4,
      title: 'Thực hiện hoàn tiền',
      description: 'Tiền được chuyển về tài khoản/phương thức thanh toán của khách hàng',
      timeframe: '1-5 ngày',
      status: 'pending'
    },
    {
      step: 5,
      title: 'Xác nhận hoàn thành',
      description: 'Khách hàng nhận được thông báo xác nhận hoàn tiền thành công',
      timeframe: '1 phút',
      status: 'pending'
    }
  ]

  const refundReasons = [
    {
      reason: 'Hủy đơn hàng',
      refundRate: '100%',
      processingTime: '1-2 giờ',
      description: 'Hủy đơn hàng trước khi giao hàng',
      conditions: ['Chưa chuẩn bị hàng', 'Trong thời gian cho phép']
    },
    {
      reason: 'Sản phẩm lỗi',
      refundRate: '100%',
      processingTime: '2-3 ngày',
      description: 'Sản phẩm có lỗi từ nhà sản xuất',
      conditions: ['Có hình ảnh chứng minh', 'Trong thời hạn bảo hành']
    },
    {
      reason: 'Giao sai hàng',
      refundRate: '100%',
      processingTime: '1-2 ngày',
      description: 'Nhận được sản phẩm khác với đơn hàng',
      conditions: ['Có video unboxing', 'Báo ngay khi nhận hàng']
    },
    {
      reason: 'Không nhận được hàng',
      refundRate: '100%',
      processingTime: '3-5 ngày',
      description: 'Đơn hàng bị thất lạc trong quá trình vận chuyển',
      conditions: ['Quá thời gian giao hàng', 'Xác nhận từ đơn vị vận chuyển']
    },
    {
      reason: 'Đổi ý không mua',
      refundRate: '90-95%',
      processingTime: '3-7 ngày',
      description: 'Khách hàng thay đổi quyết định sau khi đặt hàng',
      conditions: ['Sản phẩm chưa sử dụng', 'Trừ phí xử lý 5-10%']
    },
    {
      reason: 'Chương trình khuyến mãi',
      refundRate: '100%',
      processingTime: '1-3 ngày',
      description: 'Hoàn tiền do lỗi hệ thống khuyến mãi',
      conditions: ['Lỗi từ hệ thống', 'Xác minh tự động']
    }
  ]

  const refundPolicies = [
    {
      category: 'Thời gian hoàn tiền',
      icon: Clock,
      policies: [
        'Ví điện tử: 1-2 giờ sau khi phê duyệt',
        'Thẻ tín dụng: 3-5 ngày làm việc',
        'Chuyển khoản: 1-3 ngày làm việc',
        'Tiền mặt: Ngay lập tức tại cửa hàng'
      ]
    },
    {
      category: 'Phí hoàn tiền',
      icon: DollarSign,
      policies: [
        'Miễn phí nếu lỗi từ Yapee',
        'Phí 5-10% nếu khách hàng đổi ý',
        'Phí chuyển khoản quốc tế: 2-3%',
        'Không phí với ví điện tử'
      ]
    },
    {
      category: 'Điều kiện hoàn tiền',
      icon: Shield,
      policies: [
        'Đơn hàng phải được xác minh',
        'Thông tin tài khoản chính xác',
        'Tuân thủ chính sách đổi trả',
        'Không vi phạm điều khoản sử dụng'
      ]
    },
    {
      category: 'Bảo mật giao dịch',
      icon: Shield,
      policies: [
        'Mã hóa SSL 256-bit',
        'Xác thực 2 lớp (2FA)',
        'Kiểm tra chống gian lận',
        'Tuân thủ chuẩn PCI DSS'
      ]
    }
  ]

  const refundStats = {
    totalRefunds: '1.8M+',
    avgProcessingTime: '2.3 ngày',
    successRate: '99.2%',
    customerSatisfaction: '4.9/5'
  }

  const faqs = [
    {
      question: 'Tôi có thể hoàn tiền về phương thức thanh toán khác không?',
      answer: 'Có, bạn có thể chọn hoàn tiền về ví điện tử hoặc chuyển khoản ngân hàng khác với phương thức thanh toán ban đầu.'
    },
    {
      question: 'Tại sao hoàn tiền về thẻ tín dụng lại lâu?',
      answer: 'Hoàn tiền về thẻ tín dụng phải qua hệ thống ngân hàng và tổ chức thẻ, thường mất 3-5 ngày làm việc để xử lý.'
    },
    {
      question: 'Có phí hoàn tiền không?',
      answer: 'Miễn phí hoàn tiền nếu lỗi từ Yapee. Nếu khách hàng đổi ý, có thể áp dụng phí xử lý 5-10% tùy theo sản phẩm.'
    },
    {
      question: 'Làm sao để theo dõi tiến trình hoàn tiền?',
      answer: 'Bạn có thể theo dõi trong mục "Lịch sử giao dịch" hoặc nhận thông báo qua email/SMS khi có cập nhật.'
    },
    {
      question: 'Hoàn tiền có giới hạn số tiền không?',
      answer: 'Không có giới hạn số tiền hoàn. Tuy nhiên, các giao dịch lớn có thể cần thêm thời gian xác minh bảo mật.'
    },
    {
      question: 'Tôi có thể hủy yêu cầu hoàn tiền không?',
      answer: 'Có, bạn có thể hủy yêu cầu hoàn tiền trước khi được phê duyệt. Sau khi phê duyệt, không thể hủy.'
    }
  ]

  return (
    <Layout>
      <Helmet>
        <title>Chính sách hoàn tiền - Yapee</title>
        <meta name="description" content="Chính sách hoàn tiền tại Yapee. Quy trình hoàn tiền nhanh chóng, an toàn với nhiều phương thức linh hoạt." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Chính sách hoàn tiền</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quy trình hoàn tiền nhanh chóng, an toàn với nhiều phương thức thanh toán linh hoạt
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              <CreditCard className="w-4 h-4 mr-1" />
              Hoàn tiền nhanh
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Shield className="w-4 h-4 mr-1" />
              An toàn bảo mật
            </Badge>
            <Badge variant="outline" className="text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Miễn phí xử lý
            </Badge>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{refundStats.totalRefunds}</div>
                <div className="text-sm text-gray-600">Giao dịch hoàn tiền</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{refundStats.successRate}</div>
                <div className="text-sm text-gray-600">Tỷ lệ thành công</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">{refundStats.avgProcessingTime}</div>
                <div className="text-sm text-gray-600">Thời gian xử lý TB</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{refundStats.customerSatisfaction}</div>
                <div className="text-sm text-gray-600">Đánh giá khách hàng</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Refund Methods */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Phương thức hoàn tiền</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {refundMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.method}</CardTitle>
                          <CardDescription>{method.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{method.popularity}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-semibold text-green-600">Thời gian</div>
                        <div className="text-sm">{method.timeframe}</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-blue-600">Phí xử lý</div>
                        <div className="text-sm">{method.fee}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-semibold mb-2">Độ phổ biến:</div>
                      <Progress value={method.popularity} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold mb-2">Hỗ trợ:</div>
                      <div className="flex flex-wrap gap-1">
                        {method.providers.map((provider, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {provider}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Refund Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Quy trình hoàn tiền</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {refundProcess.map((step, index) => (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${
                  step.status === 'completed' ? 'border-green-500 bg-green-50' :
                  step.status === 'active' ? 'border-blue-500 bg-blue-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold ${
                        step.status === 'completed' ? 'bg-green-600 text-white' :
                        step.status === 'active' ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.timeframe}
                          </Badge>
                          {step.status === 'completed' && (
                            <Badge className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Hoàn thành
                            </Badge>
                          )}
                          {step.status === 'active' && (
                            <Badge className="bg-blue-600">
                              Đang xử lý
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reasons" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="reasons">Lý do hoàn tiền</TabsTrigger>
            <TabsTrigger value="policies">Chính sách</TabsTrigger>
            <TabsTrigger value="request">Yêu cầu hoàn tiền</TabsTrigger>
            <TabsTrigger value="faq">Câu hỏi thường gặp</TabsTrigger>
          </TabsList>

          <TabsContent value="reasons" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Các lý do hoàn tiền</h3>
                <p className="text-gray-600">
                  Mức hoàn tiền và thời gian xử lý tùy thuộc vào lý do hoàn tiền
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {refundReasons.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        {item.reason}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="font-semibold text-green-600">Mức hoàn tiền</div>
                          <div>{item.refundRate}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-600">Thời gian xử lý</div>
                          <div>{item.processingTime}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-sm mb-2">Điều kiện:</div>
                        <ul className="space-y-1">
                          {item.conditions.map((condition, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                              {condition}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Chính sách hoàn tiền</h3>
                <p className="text-gray-600">
                  Các quy định và điều kiện áp dụng cho việc hoàn tiền tại Yapee
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {refundPolicies.map((policy, index) => {
                  const IconComponent = policy.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          {policy.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {policy.policies.map((item, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="request" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Tạo yêu cầu hoàn tiền</h3>
                <p className="text-gray-600">
                  Điền thông tin chi tiết để chúng tôi xử lý yêu cầu hoàn tiền của bạn
                </p>
              </div>
              
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Biểu mẫu yêu cầu hoàn tiền</CardTitle>
                  <CardDescription>
                    Vui lòng cung cấp thông tin chính xác để được xử lý nhanh chóng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orderNumber">Mã đơn hàng *</Label>
                      <Input id="orderNumber" placeholder="VD: YP123456789" />
                    </div>
                    <div>
                      <Label htmlFor="transactionId">Mã giao dịch</Label>
                      <Input id="transactionId" placeholder="VD: TXN123456" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="refundReason">Lý do hoàn tiền *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do hoàn tiền" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cancel-order">Hủy đơn hàng</SelectItem>
                        <SelectItem value="defective-product">Sản phẩm lỗi</SelectItem>
                        <SelectItem value="wrong-item">Giao sai hàng</SelectItem>
                        <SelectItem value="not-received">Không nhận được hàng</SelectItem>
                        <SelectItem value="change-mind">Đổi ý không mua</SelectItem>
                        <SelectItem value="promotion-error">Lỗi khuyến mãi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="refundAmount">Số tiền hoàn *</Label>
                    <Input id="refundAmount" type="number" placeholder="0" />
                  </div>
                  
                  <div>
                    <Label htmlFor="refundMethod">Phương thức hoàn tiền *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phương thức hoàn tiền" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="e-wallet">Ví điện tử</SelectItem>
                        <SelectItem value="credit-card">Thẻ tín dụng/ghi nợ</SelectItem>
                        <SelectItem value="bank-transfer">Chuyển khoản ngân hàng</SelectItem>
                        <SelectItem value="cash">Tiền mặt tại cửa hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber">Số tài khoản/Số thẻ *</Label>
                      <Input id="accountNumber" placeholder="Nhập số tài khoản" />
                    </div>
                    <div>
                      <Label htmlFor="accountName">Tên chủ tài khoản *</Label>
                      <Input id="accountName" placeholder="Nhập tên chủ tài khoản" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bankName">Ngân hàng/Nhà cung cấp</Label>
                    <Input id="bankName" placeholder="VD: Vietcombank, ZaloPay, MoMo" />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Mô tả chi tiết</Label>
                    <Input id="description" placeholder="Mô tả lý do hoàn tiền chi tiết..." />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">Số điện thoại liên hệ *</Label>
                      <Input id="contactPhone" placeholder="0123456789" />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email liên hệ *</Label>
                      <Input id="contactEmail" type="email" placeholder="email@example.com" />
                    </div>
                  </div>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Bảo mật:</strong> Thông tin tài khoản của bạn được mã hóa và bảo vệ 
                      theo tiêu chuẩn bảo mật cao nhất. Yapee cam kết không chia sẻ thông tin với bên thứ ba.
                    </AlertDescription>
                  </Alert>
                  
                  <Button className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Gửi yêu cầu hoàn tiền
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Câu hỏi thường gặp</h3>
                <p className="text-gray-600">
                  Những câu hỏi phổ biến về chính sách hoàn tiền tại Yapee
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3 flex items-start">
                        <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 ml-11">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="bg-green-50 border-green-200 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-800">Cam kết bảo mật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                  <div>
                    <h4 className="font-semibold mb-2">Bảo vệ thông tin:</h4>
                    <ul className="space-y-1">
                      <li>• Mã hóa SSL 256-bit</li>
                      <li>• Xác thực 2 lớp (2FA)</li>
                      <li>• Tuân thủ chuẩn PCI DSS</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Chống gian lận:</h4>
                    <ul className="space-y-1">
                      <li>• AI phát hiện giao dịch bất thường</li>
                      <li>• Xác minh danh tính tự động</li>
                      <li>• Giám sát 24/7</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Cần hỗ trợ về hoàn tiền?</h3>
            <p className="text-gray-700 mb-6">
              Đội ngũ chăm sóc khách hàng của Yapee luôn sẵn sàng hỗ trợ bạn về các vấn đề hoàn tiền
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Phone className="w-4 h-4 mr-2" />
                Hotline: 1900 1234
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Email: refund@yapee.vn
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Refund
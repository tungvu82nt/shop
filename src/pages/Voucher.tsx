import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Ticket, Clock, Gift, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Voucher = () => {
  // Mock data cho voucher
  const vouchers = {
    available: [
      {
        id: 'VOUCHER001',
        title: 'Giảm 50K cho đơn từ 300K',
        description: 'Áp dụng cho tất cả sản phẩm',
        discount: '50.000đ',
        minOrder: '300.000đ',
        expiry: '2024-02-15',
        type: 'shipping'
      },
      {
        id: 'VOUCHER002',
        title: 'Giảm 20% tối đa 100K',
        description: 'Chỉ áp dụng cho thời trang',
        discount: '20%',
        minOrder: '200.000đ',
        expiry: '2024-02-20',
        type: 'discount'
      },
      {
        id: 'VOUCHER003',
        title: 'Miễn phí vận chuyển',
        description: 'Cho đơn hàng từ 150K',
        discount: 'Free Ship',
        minOrder: '150.000đ',
        expiry: '2024-02-25',
        type: 'freeship'
      }
    ],
    used: [
      {
        id: 'VOUCHER004',
        title: 'Giảm 30K cho đơn từ 200K',
        description: 'Đã sử dụng ngày 15/01/2024',
        discount: '30.000đ',
        minOrder: '200.000đ',
        usedDate: '2024-01-15',
        type: 'discount'
      }
    ],
    expired: [
      {
        id: 'VOUCHER005',
        title: 'Giảm 100K cho đơn từ 500K',
        description: 'Hết hạn ngày 10/01/2024',
        discount: '100.000đ',
        minOrder: '500.000đ',
        expiry: '2024-01-10',
        type: 'discount'
      }
    ]
  }

  const getVoucherIcon = (type: string) => {
    switch (type) {
      case 'freeship':
        return <Gift className="w-5 h-5" />
      case 'discount':
        return <Star className="w-5 h-5" />
      default:
        return <Ticket className="w-5 h-5" />
    }
  }

  const getVoucherColor = (type: string) => {
    switch (type) {
      case 'freeship':
        return 'bg-green-50 border-green-200'
      case 'discount':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-orange-50 border-orange-200'
    }
  }

  const VoucherCard = ({ voucher, status }: { voucher: any, status: string }) => (
    <Card className={`${getVoucherColor(voucher.type)} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg">
              {getVoucherIcon(voucher.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{voucher.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{voucher.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Đơn tối thiểu: {voucher.minOrder}</span>
                {status === 'available' && (
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    HSD: {voucher.expiry}
                  </span>
                )}
                {status === 'used' && (
                  <span>Đã dùng: {voucher.usedDate}</span>
                )}
                {status === 'expired' && (
                  <span className="text-red-500">Hết hạn: {voucher.expiry}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className="mb-2">{voucher.discount}</Badge>
            {status === 'available' && (
              <Button size="sm" className="block w-full">
                Lưu
              </Button>
            )}
            {status === 'used' && (
              <Badge variant="secondary">Đã dùng</Badge>
            )}
            {status === 'expired' && (
              <Badge variant="destructive">Hết hạn</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Layout>
      <Helmet>
        <title>Kho Voucher - Yapee</title>
        <meta name="description" content="Tổng hợp các mã giảm giá, voucher miễn phí vận chuyển trên Yapee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Ticket className="w-8 h-8 mr-3 text-orange-500" />
            Kho Voucher
          </h1>
          <p className="text-gray-600">Tổng hợp các mã giảm giá và ưu đãi hấp dẫn</p>
        </div>
        
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Có thể dùng ({vouchers.available.length})</TabsTrigger>
            <TabsTrigger value="used">Đã dùng ({vouchers.used.length})</TabsTrigger>
            <TabsTrigger value="expired">Hết hạn ({vouchers.expired.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="mt-6">
            <div className="space-y-4">
              {vouchers.available.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} status="available" />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="used" className="mt-6">
            <div className="space-y-4">
              {vouchers.used.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} status="used" />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="expired" className="mt-6">
            <div className="space-y-4">
              {vouchers.expired.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} status="expired" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Banner khuyến mãi */}
        <div className="mt-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Săn voucher mỗi ngày!</h2>
          <p className="mb-4">Đăng nhập hàng ngày để nhận voucher miễn phí</p>
          <Button variant="secondary" size="lg">
            Nhận voucher ngay
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default Voucher
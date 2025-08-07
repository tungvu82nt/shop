import { Helmet } from 'react-helmet-async'
import Layout from '@/components/layout/Layout'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const Orders = () => {
  // Mock data cho đơn hàng
  const orders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299000,
      items: [
        { name: 'Áo thun nam basic', quantity: 2, price: 149500 }
      ]
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      status: 'shipping',
      total: 450000,
      items: [
        { name: 'Giày sneaker nữ', quantity: 1, price: 450000 }
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Đã giao</Badge>
      case 'shipping':
        return <Badge className="bg-blue-100 text-blue-800"><Package className="w-3 h-3 mr-1" />Đang giao</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>Đơn mua - Yapee</title>
        <meta name="description" content="Quản lý đơn hàng của bạn trên Yapee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Đơn mua</h1>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Đơn hàng #{order.id}</h3>
                  <p className="text-gray-600">Ngày đặt: {order.date}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="font-semibold">
                  Tổng tiền: {order.total.toLocaleString('vi-VN')}đ
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                  </Button>
                  {order.status === 'delivered' && (
                    <Button size="sm">
                      Mua lại
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600">Hãy khám phá và mua sắm ngay!</p>
            <Button className="mt-4">
              Tiếp tục mua sắm
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Orders
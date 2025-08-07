import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';

const FreeShipping = () => {
  return (
    <>
      <Helmet>
        <title>Miễn phí vận chuyển - Shopy Vietnam</title>
        <meta name="description" content="Tìm hiểu về chính sách miễn phí vận chuyển tại Shopy Vietnam. Giao hàng nhanh chóng và tiện lợi." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <Truck className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Miễn phí vận chuyển
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tận hưởng dịch vụ giao hàng miễn phí với các điều kiện ưu đãi hấp dẫn từ Shopy Vietnam
            </p>
          </div>

          {/* Shipping Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Miễn phí 100%</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Không phí vận chuyển cho đơn hàng từ 300.000đ trở lên
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Giao hàng nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Giao hàng trong 1-3 ngày làm việc tại các thành phố lớn
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Toàn quốc</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Phủ sóng giao hàng trên toàn quốc, kể cả vùng sâu vùng xa
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Policy Details */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Điều kiện miễn phí vận chuyển</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">✓ Miễn phí hoàn toàn</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Đơn hàng từ 300.000đ trở lên</li>
                      <li>• Áp dụng cho tất cả sản phẩm</li>
                      <li>• Không giới hạn số lượng đơn hàng</li>
                      <li>• Áp dụng cho thành viên VIP</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-orange-600">⚡ Giao hàng nhanh</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Hà Nội, TP.HCM: 1-2 ngày</li>
                      <li>• Các tỉnh thành khác: 2-3 ngày</li>
                      <li>• Vùng sâu vùng xa: 3-5 ngày</li>
                      <li>• Giao hàng 7 ngày/tuần</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Phí vận chuyển theo khu vực</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Khu vực</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Phí vận chuyển</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Thời gian giao hàng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Nội thành Hà Nội, TP.HCM</td>
                        <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">Miễn phí</td>
                        <td className="border border-gray-300 px-4 py-2">1-2 ngày</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Các tỉnh thành khác</td>
                        <td className="border border-gray-300 px-4 py-2">25.000đ (Miễn phí từ 300k)</td>
                        <td className="border border-gray-300 px-4 py-2">2-3 ngày</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Vùng sâu vùng xa</td>
                        <td className="border border-gray-300 px-4 py-2">35.000đ (Miễn phí từ 500k)</td>
                        <td className="border border-gray-300 px-4 py-2">3-5 ngày</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Lưu ý quan trọng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <p>• Miễn phí vận chuyển áp dụng cho đơn hàng có giá trị sau khi đã trừ các voucher giảm giá</p>
                  <p>• Không áp dụng cho các sản phẩm cồng kềnh, nặng trên 30kg</p>
                  <p>• Thời gian giao hàng có thể thay đổi trong các dịp lễ tết hoặc thời tiết xấu</p>
                  <p>• Khách hàng có thể theo dõi đơn hàng qua SMS hoặc ứng dụng Shopy</p>
                  <p>• Hỗ trợ đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm lỗi</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Bắt đầu mua sắm ngay!</h2>
              <p className="text-lg mb-6">Tận hưởng ưu đãi miễn phí vận chuyển cho đơn hàng từ 300.000đ</p>
              <a 
                href="/" 
                className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Khám phá sản phẩm
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeShipping;
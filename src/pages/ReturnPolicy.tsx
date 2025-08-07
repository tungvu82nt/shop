import React from 'react';
import { ArrowLeft, Package, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

/**
 * Trang Chính sách Đổi trả
 */
const ReturnPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Chính sách Đổi trả</h1>
          <p className="text-gray-600 mt-2">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Yapee Vietnam cam kết mang đến trải nghiệm mua sắm tốt nhất. Nếu bạn không hài lòng 
            với sản phẩm, chúng tôi hỗ trợ đổi trả trong vòng 30 ngày.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                1. Thời gian đổi trả
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">1.1 Thời hạn chung</h4>
              <ul className="list-disc pl-6">
                <li><strong>30 ngày:</strong> Đối với hầu hết các sản phẩm</li>
                <li><strong>7 ngày:</strong> Đối với thực phẩm, mỹ phẩm đã mở seal</li>
                <li><strong>15 ngày:</strong> Đối với thiết bị điện tử</li>
                <li><strong>60 ngày:</strong> Đối với sản phẩm có lỗi từ nhà sản xuất</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">1.2 Tính từ khi nào?</h4>
              <p>
                Thời gian đổi trả được tính từ ngày bạn nhận được sản phẩm, 
                không phải từ ngày đặt hàng.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                2. Điều kiện đổi trả
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">2.1 Sản phẩm được chấp nhận đổi trả</h4>
              <ul className="list-disc pl-6">
                <li>Sản phẩm còn nguyên vẹn, chưa sử dụng</li>
                <li>Còn đầy đủ bao bì, nhãn mác gốc</li>
                <li>Có hóa đơn mua hàng hoặc mã đơn hàng</li>
                <li>Không có dấu hiệu hư hỏng do người dùng</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">2.2 Sản phẩm KHÔNG được đổi trả</h4>
              <ul className="list-disc pl-6">
                <li>Sản phẩm đã qua sử dụng hoặc hư hỏng</li>
                <li>Đồ lót, đồ bơi vì lý do vệ sinh</li>
                <li>Sản phẩm được cá nhân hóa theo yêu cầu</li>
                <li>Thực phẩm tươi sống, đã hết hạn</li>
                <li>Phần mềm, thẻ cào đã kích hoạt</li>
                <li>Sách, tạp chí đã đọc</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">2.3 Trường hợp đặc biệt</h4>
              <p>
                Đối với sản phẩm có lỗi từ nhà sản xuất hoặc giao sai hàng, 
                chúng tôi chấp nhận đổi trả ngay cả khi đã sử dụng.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Quy trình đổi trả</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">Bước 1: Tạo yêu cầu đổi trả</h4>
              <ul className="list-disc pl-6">
                <li>Đăng nhập vào tài khoản Yapee</li>
                <li>Vào "Đơn hàng của tôi" → Chọn đơn hàng cần đổi trả</li>
                <li>Nhấn "Yêu cầu đổi trả" và điền thông tin</li>
                <li>Chọn lý do đổi trả và tải ảnh minh chứng (nếu có)</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">Bước 2: Chờ xác nhận</h4>
              <ul className="list-disc pl-6">
                <li>Chúng tôi sẽ xem xét yêu cầu trong vòng 24 giờ</li>
                <li>Bạn sẽ nhận được email thông báo kết quả</li>
                <li>Nếu được chấp nhận, chúng tôi sẽ gửi nhãn giao hàng</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">Bước 3: Gửi hàng trả</h4>
              <ul className="list-disc pl-6">
                <li>Đóng gói sản phẩm cẩn thận</li>
                <li>Dán nhãn giao hàng được cung cấp</li>
                <li>Giao cho đơn vị vận chuyển hoặc mang đến bưu điện</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">Bước 4: Xử lý hoàn tiền</h4>
              <ul className="list-disc pl-6">
                <li>Sau khi nhận và kiểm tra hàng (2-3 ngày làm việc)</li>
                <li>Chúng tôi sẽ xử lý hoàn tiền trong 5-7 ngày làm việc</li>
                <li>Tiền sẽ được hoàn về phương thức thanh toán gốc</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                4. Phí đổi trả
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">4.1 Miễn phí đổi trả</h4>
              <ul className="list-disc pl-6">
                <li>Sản phẩm bị lỗi từ nhà sản xuất</li>
                <li>Giao sai hàng, thiếu hàng</li>
                <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                <li>Đơn hàng trên 500.000đ (áp dụng 1 lần đổi trả miễn phí)</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">4.2 Có phí đổi trả</h4>
              <ul className="list-disc pl-6">
                <li><strong>30.000đ:</strong> Đổi trả do thay đổi ý kiến (đơn hàng dưới 500.000đ)</li>
                <li><strong>50.000đ:</strong> Đổi trả lần thứ 2 trở đi trong cùng tháng</li>
                <li><strong>Miễn phí:</strong> Đổi size (chỉ áp dụng 1 lần/sản phẩm)</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">4.3 Cách tính phí</h4>
              <p>
                Phí đổi trả sẽ được trừ vào số tiền hoàn lại. Đối với đổi hàng, 
                phí sẽ được tính vào đơn hàng mới.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Hoàn tiền</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">5.1 Phương thức hoàn tiền</h4>
              <ul className="list-disc pl-6">
                <li><strong>Thẻ tín dụng/ghi nợ:</strong> 5-7 ngày làm việc</li>
                <li><strong>Ví điện tử:</strong> 1-3 ngày làm việc</li>
                <li><strong>Chuyển khoản ngân hàng:</strong> 3-5 ngày làm việc</li>
                <li><strong>Tiền mặt (COD):</strong> Chuyển khoản trong 5-7 ngày</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">5.2 Số tiền được hoàn</h4>
              <ul className="list-disc pl-6">
                <li>Giá sản phẩm (sau khi trừ khuyến mãi nếu có)</li>
                <li>Phí vận chuyển (nếu lỗi từ chúng tôi)</li>
                <li>Trừ phí đổi trả (nếu có)</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">5.3 Yapee Credit</h4>
              <p>
                Bạn có thể chọn nhận hoàn tiền dưới dạng Yapee Credit để sử dụng 
                cho lần mua tiếp theo với 5% bonus.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Đổi hàng</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">6.1 Đổi size/màu sắc</h4>
              <ul className="list-disc pl-6">
                <li>Miễn phí đổi 1 lần cho mỗi sản phẩm</li>
                <li>Sản phẩm mới phải có giá trị tương đương</li>
                <li>Nếu chênh lệch giá, bạn cần thanh toán thêm hoặc được hoàn lại</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">6.2 Đổi sang sản phẩm khác</h4>
              <ul className="list-disc pl-6">
                <li>Chỉ áp dụng trong vòng 15 ngày</li>
                <li>Sản phẩm mới phải cùng danh mục</li>
                <li>Phí đổi hàng: 30.000đ</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Trường hợp đặc biệt</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">7.1 Sản phẩm bị lỗi</h4>
              <p>
                Nếu sản phẩm bị lỗi trong thời gian bảo hành, bạn có thể:
              </p>
              <ul className="list-disc pl-6">
                <li>Đổi sản phẩm mới cùng loại</li>
                <li>Sửa chữa miễn phí (nếu có thể)</li>
                <li>Hoàn tiền 100% (nếu không thể sửa/đổi)</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">7.2 Giao sai hàng</h4>
              <ul className="list-disc pl-6">
                <li>Chúng tôi sẽ gửi sản phẩm đúng miễn phí</li>
                <li>Bạn có thể giữ sản phẩm sai (nếu giá trị dưới 100.000đ)</li>
                <li>Hoàn tiền 100% nếu không muốn đổi</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">7.3 Hàng bị hư hỏng khi vận chuyển</h4>
              <ul className="list-disc pl-6">
                <li>Chụp ảnh ngay khi nhận hàng</li>
                <li>Liên hệ hotline trong vòng 24 giờ</li>
                <li>Chúng tôi sẽ gửi hàng mới hoặc hoàn tiền</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Liên hệ hỗ trợ</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>Nếu bạn cần hỗ trợ về đổi trả, vui lòng liên hệ:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Hotline</h4>
                  <p>📞 1900-1234 (7:00 - 22:00 hàng ngày)</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p>✉️ support@yapee.vn</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Chat trực tuyến</h4>
                  <p>💬 Góc phải màn hình (8:00 - 20:00)</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Trung tâm trả hàng</h4>
                  <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
                </div>
              </div>
              
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Lưu ý:</strong> Để được hỗ trợ nhanh chóng, vui lòng chuẩn bị sẵn 
                  mã đơn hàng và thông tin sản phẩm cần đổi trả.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Cam kết của Yapee</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ul className="list-disc pl-6">
                <li>Xử lý yêu cầu đổi trả trong vòng 24 giờ</li>
                <li>Hoàn tiền đúng hạn cam kết</li>
                <li>Hỗ trợ khách hàng 24/7</li>
                <li>Minh bạch về phí và quy trình</li>
                <li>Bảo vệ quyền lợi người tiêu dùng</li>
              </ul>
              
              <p className="mt-4 font-semibold text-blue-600">
                Sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
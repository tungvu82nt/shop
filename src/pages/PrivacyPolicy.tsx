import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

/**
 * Trang Chính sách Bảo mật
 */
const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Chính sách Bảo mật</h1>
          <p className="text-gray-600 mt-2">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Yapee Vietnam ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư và thông tin 
                cá nhân của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, 
                lưu trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Thông tin chúng tôi thu thập</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">2.1 Thông tin cá nhân</h4>
              <ul className="list-disc pl-6">
                <li>Họ tên, email, số điện thoại</li>
                <li>Địa chỉ giao hàng và thanh toán</li>
                <li>Thông tin thanh toán (được mã hóa và bảo mật)</li>
                <li>Ngày sinh, giới tính (tùy chọn)</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">2.2 Thông tin sử dụng</h4>
              <ul className="list-disc pl-6">
                <li>Lịch sử duyệt web và tìm kiếm</li>
                <li>Sản phẩm đã xem và mua</li>
                <li>Tương tác với website và ứng dụng</li>
                <li>Địa chỉ IP và thông tin thiết bị</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">2.3 Cookies và công nghệ theo dõi</h4>
              <p>
                Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng, phân tích lưu lượng 
                và cá nhân hóa nội dung.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Cách chúng tôi sử dụng thông tin</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">3.1 Cung cấp dịch vụ</h4>
              <ul className="list-disc pl-6">
                <li>Xử lý đơn hàng và thanh toán</li>
                <li>Giao hàng và hỗ trợ khách hàng</li>
                <li>Quản lý tài khoản người dùng</li>
                <li>Xác thực danh tính và bảo mật</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">3.2 Cải thiện dịch vụ</h4>
              <ul className="list-disc pl-6">
                <li>Phân tích hành vi người dùng</li>
                <li>Cá nhân hóa trải nghiệm mua sắm</li>
                <li>Phát triển tính năng mới</li>
                <li>Đề xuất sản phẩm phù hợp</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">3.3 Marketing và truyền thông</h4>
              <ul className="list-disc pl-6">
                <li>Gửi thông báo về đơn hàng</li>
                <li>Khuyến mãi và ưu đãi (với sự đồng ý)</li>
                <li>Bản tin và cập nhật sản phẩm</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Chia sẻ thông tin</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:</p>
              
              <h4 className="font-semibold mb-2 mt-4">4.1 Đối tác dịch vụ</h4>
              <ul className="list-disc pl-6">
                <li>Đơn vị vận chuyển để giao hàng</li>
                <li>Cổng thanh toán để xử lý giao dịch</li>
                <li>Nhà cung cấp dịch vụ IT và bảo mật</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">4.2 Yêu cầu pháp lý</h4>
              <p>
                Khi được yêu cầu bởi cơ quan có thẩm quyền hoặc để tuân thủ pháp luật.
              </p>
              
              <h4 className="font-semibold mb-2 mt-4">4.3 Bảo vệ quyền lợi</h4>
              <p>
                Để bảo vệ quyền lợi, tài sản và an toàn của chúng tôi, người dùng và cộng đồng.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Bảo mật thông tin</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến:</p>
              
              <h4 className="font-semibold mb-2 mt-4">5.1 Bảo mật kỹ thuật</h4>
              <ul className="list-disc pl-6">
                <li>Mã hóa SSL/TLS cho tất cả dữ liệu truyền tải</li>
                <li>Mã hóa dữ liệu nhạy cảm trong cơ sở dữ liệu</li>
                <li>Tường lửa và hệ thống phát hiện xâm nhập</li>
                <li>Kiểm tra bảo mật định kỳ</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">5.2 Bảo mật vận hành</h4>
              <ul className="list-disc pl-6">
                <li>Kiểm soát truy cập nghiêm ngặt</li>
                <li>Đào tạo nhân viên về bảo mật</li>
                <li>Sao lưu dữ liệu định kỳ</li>
                <li>Kế hoạch ứng phó sự cố</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Quyền của bạn</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>Bạn có các quyền sau đối với thông tin cá nhân:</p>
              
              <h4 className="font-semibold mb-2 mt-4">6.1 Quyền truy cập và chỉnh sửa</h4>
              <p>
                Bạn có thể xem và cập nhật thông tin cá nhân trong tài khoản của mình.
              </p>
              
              <h4 className="font-semibold mb-2 mt-4">6.2 Quyền xóa dữ liệu</h4>
              <p>
                Bạn có thể yêu cầu xóa tài khoản và dữ liệu cá nhân (trừ thông tin cần thiết cho pháp lý).
              </p>
              
              <h4 className="font-semibold mb-2 mt-4">6.3 Quyền từ chối marketing</h4>
              <p>
                Bạn có thể hủy đăng ký nhận email marketing bất cứ lúc nào.
              </p>
              
              <h4 className="font-semibold mb-2 mt-4">6.4 Quyền khiếu nại</h4>
              <p>
                Bạn có thể khiếu nại về việc xử lý dữ liệu cá nhân đến cơ quan có thẩm quyền.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Lưu trữ dữ liệu</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">7.1 Thời gian lưu trữ</h4>
              <ul className="list-disc pl-6">
                <li>Thông tin tài khoản: Cho đến khi bạn xóa tài khoản</li>
                <li>Lịch sử giao dịch: 5 năm (theo quy định pháp luật)</li>
                <li>Dữ liệu marketing: Cho đến khi bạn hủy đăng ký</li>
                <li>Logs hệ thống: 12 tháng</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">7.2 Vị trí lưu trữ</h4>
              <p>
                Dữ liệu được lưu trữ tại các trung tâm dữ liệu an toàn tại Việt Nam và tuân thủ 
                các quy định về bảo vệ dữ liệu cá nhân.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Cookies và Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">8.1 Loại cookies chúng tôi sử dụng</h4>
              <ul className="list-disc pl-6">
                <li><strong>Cookies cần thiết:</strong> Để website hoạt động bình thường</li>
                <li><strong>Cookies hiệu suất:</strong> Để phân tích và cải thiện website</li>
                <li><strong>Cookies chức năng:</strong> Để ghi nhớ tùy chọn của bạn</li>
                <li><strong>Cookies marketing:</strong> Để hiển thị quảng cáo phù hợp</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">8.2 Quản lý cookies</h4>
              <p>
                Bạn có thể quản lý cookies thông qua cài đặt trình duyệt hoặc công cụ quản lý cookies 
                trên website của chúng tôi.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Trẻ em</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Dịch vụ của chúng tôi không dành cho trẻ em dưới 16 tuổi. Chúng tôi không cố ý 
                thu thập thông tin cá nhân từ trẻ em dưới 16 tuổi. Nếu phát hiện, chúng tôi sẽ 
                xóa thông tin đó ngay lập tức.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Thay đổi Chính sách</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Các thay đổi quan trọng 
                sẽ được thông báo qua email hoặc thông báo trên website. Ngày cập nhật cuối cùng sẽ 
                được hiển thị ở đầu chính sách.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:</p>
              <div className="mt-4">
                <p><strong>Email:</strong> privacy@yapee.vn</p>
                <p><strong>Điện thoại:</strong> 1900-1234</p>
                <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
                <p><strong>Người bảo vệ dữ liệu:</strong> dpo@yapee.vn</p>
              </div>
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

export default PrivacyPolicy;
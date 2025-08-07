import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

/**
 * Trang Điều khoản Dịch vụ
 */
const TermsOfService: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Điều khoản Dịch vụ</h1>
          <p className="text-gray-600 mt-2">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Chấp nhận Điều khoản</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Bằng việc truy cập và sử dụng website Yapee Vietnam ("Dịch vụ"), bạn đồng ý tuân thủ 
                và bị ràng buộc bởi các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với 
                bất kỳ phần nào của các điều khoản này, bạn không được sử dụng Dịch vụ của chúng tôi.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Mô tả Dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Yapee Vietnam là nền tảng thương mại điện tử cho phép người dùng mua bán sản phẩm trực tuyến. 
                Chúng tôi cung cấp:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Nền tảng kết nối người mua và người bán</li>
                <li>Hệ thống thanh toán an toàn</li>
                <li>Dịch vụ hỗ trợ khách hàng</li>
                <li>Công cụ quản lý đơn hàng và giao hàng</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Tài khoản Người dùng</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">3.1 Đăng ký Tài khoản</h4>
              <p>
                Để sử dụng một số tính năng của Dịch vụ, bạn phải tạo tài khoản. Bạn cam kết cung cấp 
                thông tin chính xác, đầy đủ và cập nhật.
              </p>
              
              <h4 className="font-semibold mb-2 mt-4">3.2 Bảo mật Tài khoản</h4>
              <p>
                Bạn có trách nhiệm bảo vệ mật khẩu và tất cả hoạt động diễn ra dưới tài khoản của bạn. 
                Hãy thông báo ngay cho chúng tôi nếu phát hiện việc sử dụng trái phép tài khoản.
              </p>
              
              <h4 className="font-semibold mb-2 mt-4">3.3 Chấm dứt Tài khoản</h4>
              <p>
                Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu vi phạm các điều khoản này.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Quy định Mua bán</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-2">4.1 Đối với Người mua</h4>
              <ul className="list-disc pl-6">
                <li>Cung cấp thông tin thanh toán và giao hàng chính xác</li>
                <li>Thanh toán đầy đủ theo đúng thỏa thuận</li>
                <li>Tuân thủ chính sách đổi trả của từng sản phẩm</li>
              </ul>
              
              <h4 className="font-semibold mb-2 mt-4">4.2 Đối với Người bán</h4>
              <ul className="list-disc pl-6">
                <li>Cung cấp thông tin sản phẩm chính xác và đầy đủ</li>
                <li>Giao hàng đúng thời gian cam kết</li>
                <li>Đảm bảo chất lượng sản phẩm như mô tả</li>
                <li>Tuân thủ các quy định pháp luật về kinh doanh</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Thanh toán và Phí</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Chúng tôi hỗ trợ nhiều phương thức thanh toán bao gồm thẻ tín dụng, chuyển khoản ngân hàng, 
                ví điện tử và thanh toán khi nhận hàng (COD).
              </p>
              <p className="mt-4">
                Người bán có thể phải trả phí dịch vụ theo quy định. Mọi thay đổi về phí sẽ được thông báo 
                trước ít nhất 30 ngày.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Sở hữu Trí tuệ</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo, thiết kế đều thuộc sở hữu 
                của Yapee Vietnam hoặc được cấp phép sử dụng hợp pháp.
              </p>
              <p className="mt-4">
                Người dùng không được sao chép, phân phối hoặc sử dụng nội dung này cho mục đích thương mại 
                mà không có sự cho phép bằng văn bản.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Giới hạn Trách nhiệm</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Yapee Vietnam đóng vai trò là nền tảng kết nối và không chịu trách nhiệm về:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Chất lượng, tính chính xác của sản phẩm do người bán cung cấp</li>
                <li>Tranh chấp giữa người mua và người bán</li>
                <li>Thiệt hại gián tiếp hoặc hậu quả từ việc sử dụng dịch vụ</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Chính sách Bảo mật</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Việc thu thập và sử dụng thông tin cá nhân được quy định trong 
                <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">
                  Chính sách Bảo mật
                </a> của chúng tôi.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Thay đổi Điều khoản</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực 
                ngay khi được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi 
                đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Luật áp dụng</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết 
                tại Tòa án có thẩm quyền tại Thành phố Hồ Chí Minh.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ:</p>
              <div className="mt-4">
                <p><strong>Email:</strong> legal@yapee.vn</p>
                <p><strong>Điện thoại:</strong> 1900-1234</p>
                <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
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

export default TermsOfService;
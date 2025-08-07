import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">CHĂM SÓC KHÁCH HÀNG</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/help" className="hover:text-orange-500">Trung Tâm Trợ Giúp</Link></li>
              <li><Link to="/guide" className="hover:text-orange-500">Hướng Dẫn Mua Hàng</Link></li>
              <li><Link to="/shipping" className="hover:text-orange-500">Hướng Dẫn Bán Hàng</Link></li>
              <li><Link to="/payment" className="hover:text-orange-500">Thanh Toán</Link></li>
              <li><Link to="/shipping-info" className="hover:text-orange-500">Vận Chuyển</Link></li>
              <li><Link to="/return-policy" className="hover:text-orange-500">Trả Hàng & Hoàn Tiền</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500">Liên Hệ Yapee</Link></li>
              <li><Link to="/warranty" className="hover:text-orange-500">Chăm Sóc Khách Hàng</Link></li>
            </ul>
          </div>

          {/* About Yapee */}
            <div>
            <h3 className="font-semibold text-gray-900 mb-4">VỀ YAPEE</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-orange-500">Giới Thiệu Về Yapee Việt Nam</Link></li>
              <li><Link to="/careers" className="hover:text-orange-500">Tuyển Dụng</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-orange-500">Điều Khoản Dịch Vụ</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-orange-500">Chính Sách Bảo Mật</Link></li>
              <li><Link to="/authentic" className="hover:text-orange-500">Chính Hãng</Link></li>
              <li><Link to="/seller-center" className="hover:text-orange-500">Kênh Người Bán</Link></li>
              <li><Link to="/flash-sales" className="hover:text-orange-500">Flash Sales</Link></li>
              <li><Link to="/affiliate" className="hover:text-orange-500">Chương Trình Tiếp Thị Liên Kết</Link></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">THANH TOÁN</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">VISA</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">MC</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">JCB</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">AMEX</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">COD</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">VNPay</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-4">ĐƠN VỊ VẬN CHUYỂN</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">SPX</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">GHN</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">GHTK</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">VTP</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">J&T</span>
              </div>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                <span className="text-xs font-medium">GrabEx</span>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">THEO DÕI CHÚNG TÔI TRÊN</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="flex items-center space-x-2 hover:text-orange-500">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 hover:text-orange-500">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 hover:text-orange-500">
                  <Youtube className="h-4 w-4" />
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 hover:text-orange-500">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">TẢI ỨNG DỤNG YAPEE NGAY THÔI</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="bg-gray-100 p-2 rounded">
                  <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs">QR Code</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-100 p-2 rounded">
                    <span className="text-xs font-medium">App Store</span>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <span className="text-xs font-medium">Google Play</span>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <span className="text-xs font-medium">AppGallery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2024 Yapee. Tất cả các quyền được bảo lưu.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Quốc gia & Khu vực:</span>
              <select className="bg-transparent border-none text-sm">
                <option>Việt Nam</option>
                <option>Singapore</option>
                <option>Malaysia</option>
                <option>Indonesia</option>
                <option>Thailand</option>
                <option>Philippines</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t text-xs text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">CÔNG TY TNHH YAPEE</h4>
                <p>Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam.</p>
                <p>Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí. Liên hệ nội bộ: 024-73081221 (ext 4678)</p>
              </div>
              <div>
                <p>Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015</p>
                <p>© 2015 - Bản quyền thuộc về Công ty TNHH Yapee</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 p-1 rounded">
                    <span className="text-xs">Đã thông báo</span>
                  </div>
                  <div className="bg-gray-200 p-1 rounded">
                    <span className="text-xs">Đã đăng ký</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
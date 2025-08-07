import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AdminRouteProps {
  children: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, userProfile, loading } = useAuth()
  const location = useLocation()

  // Hiển thị loading khi đang tải thông tin người dùng
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Nếu người dùng đã đăng nhập nhưng không có quyền admin
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Truy cập bị từ chối</h2>
            <p className="text-muted-foreground">
              Bạn không có quyền truy cập vào trang quản trị này.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

export default AdminRoute
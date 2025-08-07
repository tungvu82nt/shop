import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import { toast } from 'sonner'
import AuthLayout from '@/components/layout/AuthLayout'

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState('')

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const { error } = await authService.verifyEmail(verificationToken)
      
      if (error) {
        setVerificationStatus('error')
        setMessage(error)
      } else {
        setVerificationStatus('success')
        setMessage('Email đã được xác thực thành công!')
        toast.success('Email đã được xác thực thành công!')
        
        // Chuyển hướng sau 3 giây
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      setVerificationStatus('error')
      setMessage('Có lỗi xảy ra khi xác thực email')
    }
  }

  const resendVerificationEmail = async () => {
    if (!email && !user?.email) {
      toast.error('Không tìm thấy email để gửi lại xác thực')
      return
    }

    setIsResending(true)
    try {
      const { error } = await authService.sendVerificationEmail(email || user!.email)
      
      if (error) {
        toast.error(error)
      } else {
        toast.success('Email xác thực đã được gửi lại!')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi email xác thực')
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    if (token) {
      // Đang xác thực với token
      switch (verificationStatus) {
        case 'pending':
          return (
            <div className="text-center">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Đang xác thực email...</h2>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
          )
        
        case 'success':
          return (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-semibold mb-2 text-green-700">Xác thực thành công!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Bạn sẽ được chuyển hướng đến trang đăng nhập...</p>
              <Button asChild className="mt-4">
                <Link to="/login">Đăng nhập ngay</Link>
              </Button>
            </div>
          )
        
        case 'error':
          return (
            <div className="text-center">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2 text-red-700">Xác thực thất bại</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <Button 
                  onClick={resendVerificationEmail}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Gửi lại email xác thực
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Quay lại đăng nhập</Link>
                </Button>
              </div>
            </div>
          )
      }
    } else {
      // Trang hướng dẫn xác thực email
      return (
        <div className="text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2">Xác thực email của bạn</h2>
          <p className="text-gray-600 mb-4">
            Chúng tôi đã gửi một email xác thực đến địa chỉ email của bạn. 
            Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác thực.
          </p>
          
          <Alert className="mb-4">
            <AlertDescription>
              Nếu bạn không thấy email, hãy kiểm tra thư mục spam hoặc thư rác.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button 
              onClick={resendVerificationEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi lại email xác thực
                </>
              )}
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">Quay lại đăng nhập</Link>
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Xác thực Email</CardTitle>
          <CardDescription className="text-center">
            Hoàn tất quá trình đăng ký tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
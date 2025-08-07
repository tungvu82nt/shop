import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = 'login' 
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)

  const handleSuccess = () => {
    onClose()
  }

  const handleSwitchToRegister = () => {
    setActiveTab('register')
  }

  const handleSwitchToLogin = () => {
    setActiveTab('login')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <h2>{activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h2>
        </DialogHeader>
        
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="p-6">
            {activeTab === 'login' ? (
              <LoginForm 
                onSuccess={handleSuccess}
                onSwitchToRegister={handleSwitchToRegister}
              />
            ) : (
              <RegisterForm 
                onSuccess={handleSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
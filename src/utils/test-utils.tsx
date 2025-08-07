import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Tạo QueryClient cho testing
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

// All providers wrapper
interface AllProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
}

const AllProviders = ({ children, queryClient }: AllProvidersProps) => {
  const testQueryClient = queryClient || createTestQueryClient()
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  initialEntries?: string[]
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, ...renderOptions } = options
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllProviders queryClient={queryClient}>
      {children}
    </AllProviders>
  )
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock user data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: null,
  phone: '+84123456789',
  address: {
    street: '123 Test Street',
    city: 'Ho Chi Minh City',
    district: 'District 1',
    ward: 'Ward 1',
    zipCode: '70000'
  }
}

// Mock product data
export const mockProduct = {
  id: '1',
  name: 'iPhone 15 Pro Max',
  price: 29990000,
  originalPrice: 32990000,
  discount: 9,
  rating: 4.8,
  reviewCount: 1250,
  imageUrl: 'https://example.com/iphone.jpg',
  images: [
    'https://example.com/iphone1.jpg',
    'https://example.com/iphone2.jpg',
    'https://example.com/iphone3.jpg'
  ],
  description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ',
  category: 'Điện thoại',
  brand: 'Apple',
  location: 'TP. Hồ Chí Minh',
  isFavorite: false,
  freeShipping: true,
  soldCount: 500,
  stock: 100,
  specifications: {
    screen: '6.7 inch',
    os: 'iOS 17',
    camera: '48MP',
    battery: '4422mAh',
    storage: '256GB'
  }
}

// Mock cart item
export const mockCartItem = {
  id: '1',
  productId: '1',
  name: 'iPhone 15 Pro Max',
  price: 29990000,
  quantity: 2,
  imageUrl: 'https://example.com/iphone.jpg',
  variant: {
    color: 'Titan Tự Nhiên',
    storage: '256GB'
  }
}

// Mock order data
export const mockOrder = {
  id: 'order-1',
  userId: '1',
  items: [mockCartItem],
  total: 59980000,
  status: 'pending' as const,
  shippingAddress: {
    name: 'Test User',
    phone: '+84123456789',
    street: '123 Test Street',
    city: 'Ho Chi Minh City',
    district: 'District 1',
    ward: 'Ward 1',
    zipCode: '70000'
  },
  paymentMethod: 'credit_card' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Helper functions
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  })
  window.IntersectionObserver = mockIntersectionObserver
  return mockIntersectionObserver
}

export const createMockResizeObserver = () => {
  const mockResizeObserver = vi.fn()
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  })
  window.ResizeObserver = mockResizeObserver
  return mockResizeObserver
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
export { createTestQueryClient }
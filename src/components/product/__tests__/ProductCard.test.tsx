import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'

// Mock product data
const mockProduct = {
  id: '1',
  name: 'iPhone 15 Pro Max',
  price: 29990000,
  originalPrice: 34990000,
  discount: 14,
  rating: 4.8,
  reviewCount: 1234,
  imageUrl: 'https://example.com/iphone.jpg',
  location: 'TP. Hồ Chí Minh',
  isLiked: false,
  isFreeShipping: true,
  soldCount: 500
}

const ProductCardWrapper = ({ product = mockProduct }) => {
  return (
    <BrowserRouter>
      <ProductCard product={product} />
    </BrowserRouter>
  )
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCardWrapper />)
    
    // Kiểm tra tên sản phẩm
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument()
    
    // Kiểm tra giá
    expect(screen.getByText('29.990.000 ₫')).toBeInTheDocument()
    expect(screen.getByText('34.990.000 ₫')).toBeInTheDocument()
    
    // Kiểm tra review count
    expect(screen.getByText('(1234)')).toBeInTheDocument()
    
    // Kiểm tra location
    expect(screen.getByText('TP. Hồ Chí Minh')).toBeInTheDocument()
    
    // Kiểm tra sold count
    expect(screen.getByText('Đã bán 500')).toBeInTheDocument()
  })

  it('renders discount badge when product has discount', () => {
    render(<ProductCardWrapper />)
    
    expect(screen.getByText('-14%')).toBeInTheDocument()
  })

  it('renders free shipping badge when applicable', () => {
    render(<ProductCardWrapper />)
    
    expect(screen.getByText('Miễn phí ship')).toBeInTheDocument()
  })

  it('renders heart icon for favorite functionality', () => {
    render(<ProductCardWrapper />)
    
    // Kiểm tra có nút heart (favorite)
    const heartButton = screen.getByRole('button')
    expect(heartButton).toBeInTheDocument()
  })
})
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import SearchBar from '../SearchBar'

const SearchBarWrapper = () => {
  return (
    <BrowserRouter>
      <SearchBar />
    </BrowserRouter>
  )
}

describe('SearchBar', () => {
  it('renders search input correctly', () => {
    render(<SearchBarWrapper />)
    
    // Kiểm tra input search có hiển thị
    const searchInput = screen.getByPlaceholderText('Tìm kiếm sản phẩm, thương hiệu, danh mục...')
    expect(searchInput).toBeInTheDocument()
  })

  it('allows user to type in search input', () => {
    render(<SearchBarWrapper />)
    
    const searchInput = screen.getByPlaceholderText('Tìm kiếm sản phẩm, thương hiệu, danh mục...')
    
    // Nhập text vào input
    fireEvent.change(searchInput, { target: { value: 'iPhone' } })
    
    // Kiểm tra value đã được cập nhật
    expect(searchInput).toHaveValue('iPhone')
  })

  it('shows clear button when input has value', () => {
    render(<SearchBarWrapper />)
    
    const searchInput = screen.getByPlaceholderText('Tìm kiếm sản phẩm, thương hiệu, danh mục...')
    
    // Nhập text vào input
    fireEvent.change(searchInput, { target: { value: 'iPhone' } })
    
    // Kiểm tra nút clear có hiển thị
    const clearButton = screen.getByRole('button')
    expect(clearButton).toBeInTheDocument()
  })

  it('clears input when clear button is clicked', () => {
    render(<SearchBarWrapper />)
    
    const searchInput = screen.getByPlaceholderText('Tìm kiếm sản phẩm, thương hiệu, danh mục...')
    
    // Nhập text vào input
    fireEvent.change(searchInput, { target: { value: 'iPhone' } })
    expect(searchInput).toHaveValue('iPhone')
    
    // Click nút clear
    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)
    
    // Kiểm tra input đã được xóa
    expect(searchInput).toHaveValue('')
  })

  it('shows search icon', () => {
    render(<SearchBarWrapper />)
    
    // Kiểm tra có icon search (svg)
    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  })
})
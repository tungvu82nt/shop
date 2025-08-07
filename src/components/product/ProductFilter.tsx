import React, { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

export interface FilterOptions {
  priceRange: [number, number]
  categories: string[]
  brands: string[]
  rating: number
  freeShipping: boolean
  inStock: boolean
  location: string[]
}

interface ProductFilterProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  className?: string
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ''
}) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    brand: true,
    rating: true,
    shipping: true,
    location: false
  })

  // Mock data - trong thực tế sẽ fetch từ API
  const categories = [
    { id: 'electronics', name: 'Điện tử', count: 1234 },
    { id: 'fashion', name: 'Thời trang', count: 2345 },
    { id: 'home', name: 'Nhà cửa & Đời sống', count: 876 },
    { id: 'beauty', name: 'Làm đẹp', count: 543 },
    { id: 'sports', name: 'Thể thao & Du lịch', count: 432 },
    { id: 'books', name: 'Sách', count: 321 }
  ]

  const brands = [
    { id: 'apple', name: 'Apple', count: 234 },
    { id: 'samsung', name: 'Samsung', count: 345 },
    { id: 'xiaomi', name: 'Xiaomi', count: 123 },
    { id: 'nike', name: 'Nike', count: 456 },
    { id: 'adidas', name: 'Adidas', count: 234 },
    { id: 'uniqlo', name: 'Uniqlo', count: 123 }
  ]

  const locations = [
    { id: 'hcm', name: 'TP. Hồ Chí Minh', count: 5432 },
    { id: 'hanoi', name: 'Hà Nội', count: 3456 },
    { id: 'danang', name: 'Đà Nẵng', count: 1234 },
    { id: 'cantho', name: 'Cần Thơ', count: 876 },
    { id: 'haiphong', name: 'Hải Phòng', count: 543 }
  ]

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.brands.length > 0) count++
    if (filters.rating > 0) count++
    if (filters.freeShipping) count++
    if (filters.inStock) count++
    if (filters.location.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) count++
    return count
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Bộ lọc
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Range Filter */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Khoảng giá</span>
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                max={10000000}
                min={0}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Category Filter */}
        <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Danh mục</span>
            {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilters({
                          categories: [...filters.categories, category.id]
                        })
                      } else {
                        updateFilters({
                          categories: filters.categories.filter(c => c !== category.id)
                        })
                      }
                    }}
                  />
                  <label htmlFor={category.id} className="text-sm cursor-pointer">
                    {category.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({category.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brand Filter */}
        <Collapsible open={openSections.brand} onOpenChange={() => toggleSection('brand')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Thương hiệu</span>
            {openSections.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id}
                    checked={filters.brands.includes(brand.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilters({
                          brands: [...filters.brands, brand.id]
                        })
                      } else {
                        updateFilters({
                          brands: filters.brands.filter(b => b !== brand.id)
                        })
                      }
                    }}
                  />
                  <label htmlFor={brand.id} className="text-sm cursor-pointer">
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({brand.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Rating Filter */}
        <Collapsible open={openSections.rating} onOpenChange={() => toggleSection('rating')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Đánh giá</span>
            {openSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => {
                    updateFilters({ rating: checked ? rating : 0 })
                  }}
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                  <div className="flex">
                    {renderStars(rating)}
                  </div>
                  <span className="text-sm">từ {rating} sao</span>
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Shipping & Stock Filter */}
        <Collapsible open={openSections.shipping} onOpenChange={() => toggleSection('shipping')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Dịch vụ</span>
            {openSections.shipping ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="free-shipping"
                checked={filters.freeShipping}
                onCheckedChange={(checked) => updateFilters({ freeShipping: !!checked })}
              />
              <label htmlFor="free-shipping" className="text-sm cursor-pointer">
                Miễn phí vận chuyển
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
              />
              <label htmlFor="in-stock" className="text-sm cursor-pointer">
                Còn hàng
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Location Filter */}
        <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Khu vực</span>
            {openSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={location.id}
                    checked={filters.location.includes(location.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilters({
                          location: [...filters.location, location.id]
                        })
                      } else {
                        updateFilters({
                          location: filters.location.filter(l => l !== location.id)
                        })
                      }
                    }}
                  />
                  <label htmlFor={location.id} className="text-sm cursor-pointer">
                    {location.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({location.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export default ProductFilter
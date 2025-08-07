import React from 'react'
import { ArrowUpDown, TrendingUp, Star, DollarSign, Clock } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type SortOption = 
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popularity'
  | 'newest'
  | 'best-selling'

interface ProductSortProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  totalResults?: number
  className?: string
}

const ProductSort: React.FC<ProductSortProps> = ({
  sortBy,
  onSortChange,
  totalResults,
  className = ''
}) => {
  const sortOptions = [
    {
      value: 'relevance' as SortOption,
      label: 'Liên quan nhất',
      icon: <ArrowUpDown className="h-4 w-4" />,
      description: 'Sắp xếp theo độ liên quan'
    },
    {
      value: 'popularity' as SortOption,
      label: 'Phổ biến',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Sản phẩm được xem nhiều nhất'
    },
    {
      value: 'best-selling' as SortOption,
      label: 'Bán chạy',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Sản phẩm bán chạy nhất'
    },
    {
      value: 'newest' as SortOption,
      label: 'Mới nhất',
      icon: <Clock className="h-4 w-4" />,
      description: 'Sản phẩm mới nhất'
    },
    {
      value: 'price-asc' as SortOption,
      label: 'Giá thấp đến cao',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Giá từ thấp đến cao'
    },
    {
      value: 'price-desc' as SortOption,
      label: 'Giá cao đến thấp',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Giá từ cao đến thấp'
    },
    {
      value: 'rating' as SortOption,
      label: 'Đánh giá cao nhất',
      icon: <Star className="h-4 w-4" />,
      description: 'Đánh giá từ cao đến thấp'
    }
  ]

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy)
    return option?.label || 'Liên quan nhất'
  }

  const formatResultsCount = (count?: number) => {
    if (!count) return ''
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toLocaleString('vi-VN')
  }

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Results Count */}
      <div className="flex items-center gap-2">
        {totalResults !== undefined && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{formatResultsCount(totalResults)}</span>
            <span className="ml-1">kết quả</span>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">Sắp xếp theo:</span>
        
        {/* Desktop Sort Dropdown */}
        <div className="hidden md:block">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[200px] border-gray-300 focus:border-orange-500">
              <SelectValue placeholder="Chọn cách sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Sort Buttons */}
        <div className="flex md:hidden gap-2 overflow-x-auto">
          {sortOptions.slice(0, 4).map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange(option.value)}
              className={`whitespace-nowrap ${
                sortBy === option.value 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-gray-300 hover:border-orange-500'
              }`}
            >
              {option.icon}
              <span className="ml-1 hidden sm:inline">{option.label}</span>
            </Button>
          ))}
          
          {/* More Options for Mobile */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-auto border-gray-300">
              <div className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                <span>Khác</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.slice(4).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default ProductSort
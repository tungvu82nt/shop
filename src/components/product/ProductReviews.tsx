import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// Interface cho Review
interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  images?: string[]
  createdAt: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  variant?: {
    color?: string
    size?: string
  }
}

// Interface cho Rating Summary
interface RatingSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ProductReviewsProps {
  productId: string
  ratingSummary: RatingSummary
  reviews: Review[]
  className?: string
}

// Mock data cho reviews
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://picsum.photos/300/300?random=1',
    rating: 5,
    title: 'Sản phẩm tuyệt vời!',
    content: 'iPhone 15 Pro Max thực sự xuất sắc. Camera chụp ảnh rất đẹp, màn hình sắc nét và hiệu suất mượt mà. Đáng đồng tiền bát gạo!',
    images: [
      'https://picsum.photos/300/300?random=1',
      'https://picsum.photos/300/300?random=1'
    ],
    createdAt: '2024-01-15',
    isVerifiedPurchase: true,
    helpfulCount: 24,
    variant: {
      color: 'Titan Tự Nhiên',
      size: '256GB'
    }
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Trần Thị B',
    rating: 4,
    title: 'Tốt nhưng giá hơi cao',
    content: 'Máy chạy mượt, camera đẹp. Tuy nhiên giá khá cao so với mặt bằng chung. Nếu có khuyến mãi thì sẽ tốt hơn.',
    createdAt: '2024-01-10',
    isVerifiedPurchase: true,
    helpfulCount: 12,
    variant: {
      color: 'Titan Xanh',
      size: '256GB'
    }
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Lê Văn C',
    rating: 5,
    title: 'Upgrade từ iPhone 12, cảm nhận rõ sự khác biệt',
    content: 'Nâng cấp từ iPhone 12 Pro lên 15 Pro Max. Cảm nhận được sự cải thiện về camera, pin và hiệu suất. Rất hài lòng với quyết định này.',
    createdAt: '2024-01-08',
    isVerifiedPurchase: true,
    helpfulCount: 18,
    variant: {
      color: 'Titan Đen',
      size: '512GB'
    }
  }
]

const mockRatingSummary: RatingSummary = {
  averageRating: 4.8,
  totalReviews: 2847,
  ratingDistribution: {
    5: 2134,
    4: 568,
    3: 98,
    2: 32,
    1: 15
  }
}

/**
 * Component hiển thị đánh giá sản phẩm với rating summary và danh sách reviews
 * @param productId - ID sản phẩm
 * @param ratingSummary - Tóm tắt đánh giá
 * @param reviews - Danh sách đánh giá
 * @param className - CSS class tùy chỉnh
 */
const ProductReviews = ({ 
  productId, 
  ratingSummary = mockRatingSummary, 
  reviews = mockReviews, 
  className = '' 
}: ProductReviewsProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful'>('newest')

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get percentage for rating distribution
  const getRatingPercentage = (count: number) => {
    return (count / ratingSummary.totalReviews) * 100
  }

  // Filter reviews by rating
  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'helpful':
        return b.helpfulCount - a.helpfulCount
      default:
        return 0
    }
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {ratingSummary.averageRating}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(ratingSummary.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">
                {ratingSummary.totalReviews.toLocaleString()} đánh giá
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingSummary.ratingDistribution[rating as keyof typeof ratingSummary.ratingDistribution]
                const percentage = getRatingPercentage(count)
                
                return (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className={`flex items-center space-x-2 w-full text-left hover:bg-gray-50 p-1 rounded ${
                      selectedRating === rating ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className="text-sm font-medium w-8">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Lọc theo:</span>
          <Button
            variant={selectedRating === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRating(null)}
          >
            Tất cả
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={selectedRating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
            >
              {rating} <Star className="h-3 w-3 ml-1" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="helpful">Hữu ích nhất</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Không có đánh giá nào phù hợp với bộ lọc</p>
            </CardContent>
          </Card>
        ) : (
          sortedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>
                          {review.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{review.userName}</h4>
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              Đã mua hàng
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        
                        {/* Variant Info */}
                        {review.variant && (
                          <div className="flex items-center space-x-2 mt-1">
                            {review.variant.color && (
                              <Badge variant="outline" className="text-xs">
                                {review.variant.color}
                              </Badge>
                            )}
                            {review.variant.size && (
                              <Badge variant="outline" className="text-xs">
                                {review.variant.size}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Review Content */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>
                  
                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Review Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Hữu ích ({review.helpfulCount})
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Không hữu ích
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      Trả lời
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Load More Button */}
      {sortedReviews.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="w-full sm:w-auto">
            Xem thêm đánh giá
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
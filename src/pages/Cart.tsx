import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { analytics } from '@/lib/analytics'

/**
 * Trang Cart - Hiển thị giỏ hàng dưới dạng trang riêng
 * Cho phép người dùng xem và quản lý giỏ hàng
 */
const Cart: React.FC = () => {
  const navigate = useNavigate()
  const { state, removeItem, updateQuantity, clearCart, getItemKey } = useCart()
  const { items, totalItems, totalPrice } = state

  // Track view cart analytics when component mounts
  useEffect(() => {
    analytics.trackEcommerce('view_cart', {
      currency: 'VND',
      value: totalPrice,
      items: items.map(item => ({
        item_id: item.product.id.toString(),
        item_name: item.product.name,
        item_category: item.product.category,
        item_brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity
      }))
    });
  }, [items, totalPrice]);

  /**
   * Xử lý tăng số lượng sản phẩm
   */
  const handleIncreaseQuantity = (itemKey: string, currentQuantity: number, maxQuantity: number) => {
    if (currentQuantity < maxQuantity) {
      const item = items.find(item => getItemKey(item.product.id, item.selectedVariant) === itemKey)
      if (item) {
        // Track quantity increase analytics
        analytics.track('cart_item_quantity_increased', {
          item_id: item.product.id.toString(),
          item_name: item.product.name,
          old_quantity: currentQuantity,
          new_quantity: currentQuantity + 1,
          price: item.product.price
        });
      }
      updateQuantity(itemKey, currentQuantity + 1)
    }
  }

  /**
   * Xử lý giảm số lượng sản phẩm
   */
  const handleDecreaseQuantity = (itemKey: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      const item = items.find(item => getItemKey(item.product.id, item.selectedVariant) === itemKey)
      if (item) {
        // Track quantity decrease analytics
        analytics.track('cart_item_quantity_decreased', {
          item_id: item.product.id.toString(),
          item_name: item.product.name,
          old_quantity: currentQuantity,
          new_quantity: currentQuantity - 1,
          price: item.product.price
        });
      }
      updateQuantity(itemKey, currentQuantity - 1)
    }
  }

  /**
   * Xử lý xóa sản phẩm khỏi giỏ hàng
   */
  const handleRemoveItem = (itemKey: string) => {
    const item = items.find(item => getItemKey(item.product.id, item.selectedVariant) === itemKey)
    if (item) {
      // Track remove from cart analytics
      analytics.trackEcommerce('remove_from_cart', {
        currency: 'VND',
        value: item.product.price * item.quantity,
        items: [{
          item_id: item.product.id.toString(),
          item_name: item.product.name,
          item_category: item.product.category,
          item_brand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity
        }]
      });
    }
    removeItem(itemKey)
  }

  /**
   * Xử lý thanh toán
   */
  const handleCheckout = () => {
    // Track begin checkout analytics
    analytics.trackEcommerce('begin_checkout', {
      currency: 'VND',
      value: totalPrice,
      items: items.map(item => ({
        item_id: item.product.id.toString(),
        item_name: item.product.name,
        item_category: item.product.category,
        item_brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity
      }))
    });
    
    navigate('/checkout')
  }

  /**
   * Xử lý quay lại trang trước
   */
  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Giỏ hàng</h1>
              {totalItems > 0 && (
                <Badge variant="secondary">
                  {totalItems} sản phẩm
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          // Giỏ hàng trống
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
              <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
                Tiếp tục mua sắm
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Có sản phẩm trong giỏ hàng
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm trong giỏ hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => {
                    const itemKey = getItemKey(item.product.id, item.selectedVariant)
                    return (
                      <div key={itemKey} className="flex gap-4 p-4 border rounded-lg">
                        {/* Hình ảnh sản phẩm */}
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                          <img
                            src={item.product.images?.[0] || '/placeholder.svg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="flex-1">
                          <h3 className="font-medium text-sm mb-1">{item.product.name}</h3>
                          {item.selectedVariant && (
                            <p className="text-xs text-gray-600 mb-2">
                              Phân loại: {item.selectedVariant.color} - {item.selectedVariant.size}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDecreaseQuantity(itemKey, item.quantity)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIncreaseQuantity(itemKey, item.quantity, item.selectedVariant?.stock || item.product.stock)}
                                disabled={item.quantity >= (item.selectedVariant?.stock || item.product.stock)}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-orange-600">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(itemKey)}
                                className="text-red-500 hover:text-red-700 p-0 h-auto"
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-orange-600">{formatPrice(totalPrice)}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                  >
                    Thanh toán
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Tiếp tục mua sắm
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

/**
 * Component CartDrawer - Hiển thị giỏ hàng dưới dạng sidebar
 * Cho phép người dùng xem, chỉnh sửa và quản lý các sản phẩm trong giỏ hàng
 */
const CartDrawer: React.FC = () => {
  const navigate = useNavigate()
  const { state, removeItem, updateQuantity, closeCart, clearCart, getItemKey } = useCart()
  const { items, totalItems, totalPrice, isOpen } = state

  /**
   * Xử lý tăng số lượng sản phẩm
   */
  const handleIncreaseQuantity = (itemKey: string, currentQuantity: number, maxQuantity: number) => {
    if (currentQuantity < maxQuantity) {
      updateQuantity(itemKey, currentQuantity + 1)
    }
  }

  /**
   * Xử lý giảm số lượng sản phẩm
   */
  const handleDecreaseQuantity = (itemKey: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(itemKey, currentQuantity - 1)
    }
  }

  /**
   * Xử lý xóa sản phẩm khỏi giỏ hàng
   */
  const handleRemoveItem = (itemKey: string) => {
    removeItem(itemKey)
  }

  /**
   * Xử lý xóa toàn bộ giỏ hàng
   */
  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      clearCart()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Giỏ Hàng</h2>
              {totalItems > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalItems}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              // Empty Cart
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-500 mb-6">
                  Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                </p>
                <Button onClick={closeCart} className="w-full">
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              // Cart Items
              <div className="p-4 space-y-4">
                {items.map((item) => {
                  const itemKey = getItemKey(item)
                  return (
                    <div key={itemKey} className="flex gap-3 p-3 border rounded-lg">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        
                        {/* Variants */}
                        <div className="flex gap-2 mt-1 text-xs text-gray-500">
                          {item.selectedColor && (
                            <span>Màu: {item.selectedColor}</span>
                          )}
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-red-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleDecreaseQuantity(itemKey, item.quantity)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2 text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleIncreaseQuantity(itemKey, item.quantity, item.maxQuantity)}
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(itemKey)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa toàn bộ giỏ hàng
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer - Total & Checkout */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  closeCart()
                  navigate('/checkout')
                }}
              >
                Tiến hành thanh toán
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={closeCart}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CartDrawer
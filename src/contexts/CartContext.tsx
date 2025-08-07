import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

// Interface cho Cart Item
export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  selectedColor?: string
  selectedSize?: string
  maxQuantity: number
}

// Interface cho Cart State
interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
}

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
}

// Cart reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...item } = action.payload
      const existingItemIndex = state.items.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.selectedColor === item.selectedColor && 
          cartItem.selectedSize === item.selectedSize
      )

      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Nếu item đã tồn tại, cập nhật quantity
        newItems = state.items.map((cartItem, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              cartItem.quantity + quantity,
              cartItem.maxQuantity
            )
            return { ...cartItem, quantity: newQuantity }
          }
          return cartItem
        })
      } else {
        // Nếu item chưa tồn tại, thêm mới
        const newItem: CartItem = {
          ...item,
          quantity: Math.min(quantity, item.maxQuantity)
        }
        newItems = [...state.items, newItem]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => {
        const itemKey = `${item.id}-${item.selectedColor}-${item.selectedSize}`
        const payloadKey = action.payload
        return itemKey !== payloadKey
      })

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        // Nếu quantity <= 0, xóa item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }

      const newItems = state.items.map(item => {
        const itemKey = `${item.id}-${item.selectedColor}-${item.selectedSize}`
        if (itemKey === id) {
          return {
            ...item,
            quantity: Math.min(quantity, item.maxQuantity)
          }
        }
        return item
      })

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      }

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      }

    case 'LOAD_CART': {
      const items = action.payload
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items,
        totalItems,
        totalPrice
      }
    }

    default:
      return state
  }
}

// Context interface
interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (itemKey: string) => void
  updateQuantity: (itemKey: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemKey: (item: Pick<CartItem, 'id' | 'selectedColor' | 'selectedSize'>) => string
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart từ localStorage khi component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('yapee-cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart) as CartItem[]
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem('yapee-cart', JSON.stringify(state.items))
  }, [state.items])

  // Helper function để tạo unique key cho item
  const getItemKey = (item: Pick<CartItem, 'id' | 'selectedColor' | 'selectedSize'>) => {
    return `${item.id}-${item.selectedColor}-${item.selectedSize}`
  }

  // Action functions
  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (itemKey: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemKey })
  }

  const updateQuantity = (itemKey: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemKey, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getItemKey
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook để sử dụng Cart Context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
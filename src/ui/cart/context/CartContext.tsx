import useLocalStorageState from 'use-local-storage-state'
import { createContext, useMemo } from 'react'
import type { Product } from '@/core/product'
import { Cart } from '@/core/cart'

export const CartContext = createContext<CartContextValue | null>(null)

export type CartContextValue = {
  cart: Cart.Type
  subtotal: number
  tax: number
  shipping: number
  total: number
  addItem: (product: Product.Type) => void
  removeItem: (productId: Product.Type['id']) => void
  updateQuantity: (productId: Product.Type['id'], quantity: number) => void
  clearCart: () => void
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useLocalStorageState('cart', {
    defaultValue: Cart.create(),
  })

  const addItem = (product: Product.Type) => {
    setCart((previousCart) => Cart.addProduct(previousCart, product))
  }

  const removeItem = (productId: number) => {
    setCart((previousCart) => Cart.removeProduct(previousCart, productId))
  }

  const updateQuantity = (productId: Product.Type['id'], quantity: number) => {
    setCart((previousCart) =>
      Cart.updateProductQuantity(previousCart, productId, quantity),
    )
  }

  const clearCart = () => {
    setCart(Cart.create())
  }

  const contextValue: CartContextValue = useMemo(
    () => ({
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      shipping: Cart.calculateShipping(cart),
      subtotal: Cart.calculateSubtotal(cart),
      tax: Cart.calculateTax(cart),
      total: Cart.calculateTotal(cart),
    }),
    [cart, addItem, removeItem, updateQuantity, clearCart],
  )

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}

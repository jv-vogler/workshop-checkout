import { createContext, useContext, useMemo } from 'react'

import useLocalStorageState from 'use-local-storage-state'

import type { Product } from '@/core/product'
import { Cart } from '@/core/cart'

const CartContext = createContext<CartContextValue | null>(null)

export type CartContextValue = {
  cart: Cart.Type
  subtotal: number
  tax: number
  shipping: number
  total: number
  addItem: (product: Product.Type, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useLocalStorageState('cart', {
    defaultValue: Cart.create(),
  })

  const addItem = (product: Product.Type, quantity: number) =>
    setCart((previousCart) => Cart.addItem(previousCart, product, quantity))

  const removeItem = (productId: number) =>
    setCart((previousCart) => Cart.removeItem(previousCart, productId))

  const updateQuantity = (productId: number, quantity: number) =>
    setCart((previousCart) =>
      Cart.setLineItemQuantity(previousCart, productId, quantity),
    )

  const contextValue = useMemo(
    () => ({
      cart,
      subtotal: Cart.getSubtotal(cart),
      tax: Cart.getTax(cart),
      shipping: Cart.getShipping(cart),
      total: Cart.getTotal(cart),
      addItem,
      removeItem,
      updateQuantity,
    }),
    [cart, addItem, removeItem, updateQuantity],
  )

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

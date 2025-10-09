import type { Product } from '@/core/product'
import type { CartItem } from './api'

export const getCartFromStorage = (): Array<CartItem> => {
  try {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Error reading cart from localStorage:', error)
    return []
  }
}

export const saveCartToStorage = (cart: Array<CartItem>): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export const addToCartWithStorage = (
  cart: Array<CartItem>,
  product: Product.Type,
  updateCartCount?: (count: number) => void,
): Array<CartItem> => {
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  saveCartToStorage(cart)

  if (updateCartCount) {
    updateCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
  }

  return cart
}

export const removeFromCartWithStorage = (
  cart: Array<CartItem>,
  productId: number,
  updateCartCount?: (count: number) => void,
): Array<CartItem> => {
  const newCart = cart.filter((item) => item.id !== productId)
  saveCartToStorage(newCart)

  if (updateCartCount) {
    updateCartCount(newCart.reduce((sum, item) => sum + item.quantity, 0))
  }

  return newCart
}

export const calculateTax = (subtotal: number): number => {
  const taxRate = 0.08
  return subtotal * taxRate
}

export const calculateShipping = (subtotal: number): number => {
  return subtotal > 100 ? 0 : 9.99
}

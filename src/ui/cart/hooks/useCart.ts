import { use } from 'react'
import { CartContext } from '@/ui/cart/context/CartContext'

export const useCart = () => {
  const context = use(CartContext)

  if (!context) {
    throw new Error('You forgot the provider!')
  }

  return context
}

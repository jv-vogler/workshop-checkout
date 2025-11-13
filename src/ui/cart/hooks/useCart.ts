import { CartContext } from '@/ui/cart/context/CartContext'
import { use } from 'react'

export const useCart = () => {
  const context = use(CartContext)

  if (!context) {
    throw new Error('You forgot the provider!')
  }

  return context
}

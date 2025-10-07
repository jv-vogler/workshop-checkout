import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { calculateShipping, calculateTax } from '../services/api'
import { getCartFromStorage, saveCartToStorage } from '../services/cart'
import type { CartItem } from '../services/api'

import { TypographyHeading } from '@/ui/components/ui/typography'
import { Button } from '@/ui/components/ui/button'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const [cartItems, setCartItems] = useState<Array<CartItem>>([])
  const [loading, setLoading] = useState(true)

  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const cart = getCartFromStorage()
    setCartItems(cart)

    const calculatedSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const calculatedTax = calculateTax(calculatedSubtotal)
    const calculatedShipping = calculateShipping(calculatedSubtotal)
    const calculatedTotal =
      calculatedSubtotal + calculatedTax + calculatedShipping

    setSubtotal(calculatedSubtotal)
    setTax(calculatedTax)
    setShipping(calculatedShipping)
    setTotal(calculatedTotal)
    setLoading(false)
  }, [])

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item,
    )

    setCartItems(updatedCart)
    saveCartToStorage(updatedCart)

    recalculateTotals(updatedCart)
  }

  const removeItem = (productId: number) => {
    if (!confirm('Remove this item from your cart?')) {
      return
    }

    const updatedCart = cartItems.filter((item) => item.id !== productId)
    setCartItems(updatedCart)
    saveCartToStorage(updatedCart)
    recalculateTotals(updatedCart)
  }

  const recalculateTotals = (cart: Array<CartItem>) => {
    const newSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const newTax = calculateTax(newSubtotal)
    const newShipping = calculateShipping(newSubtotal)
    const newTotal = newSubtotal + newTax + newShipping

    setSubtotal(newSubtotal)
    setTax(newTax)
    setShipping(newShipping)
    setTotal(newTotal)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading cart...
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <TypographyHeading>Your Cart is Empty</TypographyHeading>
        <p className="mt-4 text-gray-600">
          Add some products to your cart to get started!
        </p>
        <Link to="/" className="inline-block mt-4">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TypographyHeading className="mb-6">Shopping Cart</TypographyHeading>

      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex items-center space-x-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </Button>
              <span className="px-3 min-w-8 text-center">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button
                size="sm"
                variant="destructive"
                className="mt-2"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="max-w-sm ml-auto space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Link to="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link to="/checkout">
            <Button disabled={cartItems.length === 0}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

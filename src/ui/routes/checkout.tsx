import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { calculateShipping, calculateTax, orderApi } from '../services/api'
import { getCartFromStorage } from '../services/cart'
import type { CartItem } from '../services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TypographyHeading } from '@/components/ui/typography'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState<Array<CartItem>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const cart = getCartFromStorage()
    if (cart.length === 0) {
      navigate({ to: '/' })
      return
    }

    setCartItems(cart)

    const calculatedSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const calculatedTax = calculateTax(calculatedSubtotal)
    const calculatedShipping = calculateShipping(calculatedSubtotal)

    setSubtotal(calculatedSubtotal)
    setTax(calculatedTax)
    setShipping(calculatedShipping)
    setTotal(calculatedSubtotal + calculatedTax + calculatedShipping)
  }, [navigate])

  const validateStep1 = () => {
    if (!firstName.trim()) {
      alert('First name is required')
      return false
    }
    if (!lastName.trim()) {
      alert('Last name is required')
      return false
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Valid email is required')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!address.trim() || !city.trim() || !zipCode.trim()) {
      alert('Please fill in all shipping information')
      return false
    }
    return true
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep1()) {
      localStorage.setItem(
        'checkoutCustomer',
        JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      )
      setCurrentStep(2)
    }
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep2()) {
      localStorage.setItem(
        'checkoutShipping',
        JSON.stringify({
          address,
          city,
          zipCode,
        }),
      )
      setCurrentStep(3)
    }
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardNumber || !expiry || !cvv) {
      alert('Please fill in all payment information')
      return
    }

    setIsSubmitting(true)

    try {
      const orderResult = await orderApi.submitOrder({
        items: cartItems,
        customerInfo: { firstName, lastName, email },
        shippingInfo: { address, city, zipCode },
        paymentInfo: { cardNumber, expiry, cvv },
        totals: { subtotal, tax, shipping, total },
      })

      localStorage.removeItem('cart')
      localStorage.removeItem('checkoutCustomer')
      localStorage.removeItem('checkoutShipping')

      alert(`Order placed successfully! Order ID: ${orderResult.orderId}`)
      navigate({ to: '/' })
    } catch (error) {
      alert(
        'Order failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <TypographyHeading className="text-center mb-8">
        Checkout
      </TypographyHeading>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span
            className={`text-sm ${currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
          >
            Customer Info
          </span>
          <span
            className={`text-sm ${currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
          >
            Shipping
          </span>
          <span
            className={`text-sm ${currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
          >
            Payment
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {currentStep === 1 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Customer Information</h3>
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-6">
              Continue to Shipping
            </Button>
          </form>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Shipping Information</h3>
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code *</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue to Payment
              </Button>
            </div>
          </form>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Payment Information</h3>

          <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-3 text-gray-100">Order Summary</h4>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm mb-2 text-gray-300"
              >
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-gray-100">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry *</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Processing...'
                  : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

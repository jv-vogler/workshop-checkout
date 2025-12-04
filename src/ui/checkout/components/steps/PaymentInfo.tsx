import { useRef, useState } from 'react'

import { toast } from 'sonner'

import type { RefObject } from 'react'

import type { Order } from '@/core/order'
import { Product } from '@/core/product'
import { Checkout } from '@/core/checkout'

import { Button } from '@/ui/components/ui/button'
import { Input } from '@/ui/components/ui/input'
import { Label } from '@/ui/components/ui/label'
import { useCart } from '@/ui/cart/hooks/useCart'

type CheckoutPaymentInfoStepProps = {
  paymentInfo?: Order.Details.PaymentInfo
  isPerformingCheckout?: boolean
  onSubmit: (paymentInfo: Order.Details.PaymentInfo) => void
  goBack: () => void
}

const formatCardNumber = (cardNumber: string) => {
  return cardNumber.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
}

const formatExpiry = (expiry: string) => {
  return expiry.replace(/\//g, '').replace(/(\d{2})(?=\d)/g, '$1/')
}

export function CheckoutPaymentInfoStep({
  paymentInfo,
  onSubmit,
  goBack,
  isPerformingCheckout,
}: CheckoutPaymentInfoStepProps) {
  const { cart, subtotal, tax, shipping, total } = useCart()

  const [cardNumber, setCardNumber] = useState(paymentInfo?.cardNumber ?? '')
  const formattedCardNumber = formatCardNumber(cardNumber)
  const [expiry, setExpiry] = useState(paymentInfo?.expiry ?? '')
  const formattedExpiry = formatExpiry(expiry)
  const [cvv, setCvv] = useState(paymentInfo?.cvv ?? '')

  const cardNumberField = useRef<HTMLInputElement>(null)
  const expiryField = useRef<HTMLInputElement>(null)
  const cvvField = useRef<HTMLInputElement>(null)

  const setErrorMessage = (
    field: RefObject<HTMLInputElement | null>,
    message: string,
  ) => {
    field.current?.setCustomValidity(message)
    field.current?.reportValidity()
  }

  const clearErrorMessages = () => {
    setErrorMessage(cardNumberField, '')
    setErrorMessage(expiryField, '')
    setErrorMessage(cvvField, '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    clearErrorMessages()

    try {
      Checkout.assertValidPaymentInfo({ cardNumber, expiry, cvv })

      onSubmit({
        cardNumber: cardNumber.trim(),
        expiry: expiry.trim(),
        cvv: cvv.trim(),
      })
    } catch (error) {
      if (error instanceof Checkout.Errors.PaymentInfo.MissingCardNumberError) {
        setErrorMessage(cardNumberField, 'Card number is required')
      } else if (
        error instanceof Checkout.Errors.PaymentInfo.InvalidCardNumberError
      ) {
        setErrorMessage(cardNumberField, 'Card number must be a valid number')
      } else if (
        error instanceof Checkout.Errors.PaymentInfo.MissingCardExpiryError
      ) {
        setErrorMessage(expiryField, 'Expiry date is required')
      } else if (
        error instanceof Checkout.Errors.PaymentInfo.InvalidCardExpiryError
      ) {
        setErrorMessage(expiryField, 'Expiry must be a valid date')
      } else if (
        error instanceof Checkout.Errors.PaymentInfo.MissingCardCvvError
      ) {
        setErrorMessage(cvvField, 'CVV is required')
      } else if (
        error instanceof Checkout.Errors.PaymentInfo.InvalidCardCvvError
      ) {
        setErrorMessage(cvvField, 'CVV must be a valid 3 or 4 digit number')
      } else {
        toast.error(
          'Something went wrong while submitting your payment information',
        )

        throw error
      }
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Payment Information</h3>

      <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-3 text-gray-100">Order Summary</h4>

        {cart.lineItems.map((lineItem, index) => (
          <div
            key={index}
            className="flex justify-between text-sm mb-2 text-gray-300"
          >
            <span>
              {lineItem.item.name} x{lineItem.quantity}
            </span>
            <span>
              $
              {(
                Product.calculateDisplayPrice(lineItem.item) * lineItem.quantity
              ).toFixed(2)}
            </span>
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
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between font-semibold text-gray-100">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number *</Label>
          <Input
            id="cardNumber"
            value={formattedCardNumber}
            onChange={(e) => {
              cardNumberField.current?.setCustomValidity('')
              setCardNumber(e.target.value.replace(/\s/g, ''))
            }}
            placeholder="1234 5678 9012 3456"
            required
            maxLength={19}
            ref={cardNumberField}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Expiry *</Label>
            <Input
              id="expiry"
              value={formattedExpiry}
              onChange={(e) => {
                expiryField.current?.setCustomValidity('')
                setExpiry(e.target.value)
              }}
              placeholder="MM/YY"
              required
              maxLength={5}
              ref={expiryField}
            />
          </div>

          <div>
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              value={cvv}
              onChange={(e) => {
                cvvField.current?.setCustomValidity('')
                setCvv(e.target.value)
              }}
              placeholder="123"
              required
              maxLength={4}
              ref={cvvField}
            />
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="flex-1"
          >
            Back
          </Button>

          <Button
            type="submit"
            className="flex-1"
            disabled={isPerformingCheckout}
          >
            {isPerformingCheckout
              ? 'Processing...'
              : `Place Order - $${total.toFixed(2)}`}
          </Button>
        </div>
      </form>
    </div>
  )
}

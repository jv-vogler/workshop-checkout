import { useEffect } from 'react'

import { toast } from 'sonner'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Cart } from '@/core/cart'

import { CheckoutCustomerInfoStep } from '@/ui/checkout/components/steps/CustomerInfo'
import { CheckoutShippingInfoStep } from '@/ui/checkout/components/steps/ShippingInfo'
import { TypographyHeading } from '@/ui/components/ui/typography'
import { useCart } from '@/ui/cart/hooks/useCart'
import { useCheckout } from '@/ui/checkout/hooks/useCheckout'
import { CheckoutPaymentInfoStep } from '@/ui/checkout/components/steps/PaymentInfo'
import { CheckoutProgressBar } from '@/ui/checkout/components/ProgressBar'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const navigate = useNavigate()

  const { cart } = useCart()

  const {
    checkoutFlow,
    goToShippingInfo,
    goToPaymentInfo,
    checkout,
    goBack,
    isPerformingCheckout,
  } = useCheckout({
    onCheckoutSuccess: (order) => {
      toast.success(`Order placed successfully! Order ID: ${order.orderId}`)

      navigate({ to: '/' })
    },
    onCheckoutError: (error) => {
      toast.error(
        'Order failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    },
  })

  useEffect(() => {
    if (Cart.isEmpty(cart)) {
      navigate({ to: '/' })
      return
    }
  }, [navigate, cart])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <TypographyHeading className="text-center mb-8">
        Checkout
      </TypographyHeading>

      <CheckoutProgressBar step={checkoutFlow.step} />

      {checkoutFlow.step === 'CUSTOMER_INFO' && (
        <CheckoutCustomerInfoStep
          customerInfo={checkoutFlow.customerInfo}
          onSubmit={(customerInfo) => goToShippingInfo(customerInfo)}
        />
      )}

      {checkoutFlow.step === 'SHIPPING_INFO' && (
        <CheckoutShippingInfoStep
          shippingInfo={checkoutFlow.shippingInfo}
          onSubmit={(shippingInfo) => goToPaymentInfo(shippingInfo)}
          goBack={goBack}
        />
      )}

      {checkoutFlow.step === 'PAYMENT_INFO' && (
        <CheckoutPaymentInfoStep
          paymentInfo={checkoutFlow.paymentInfo}
          isPerformingCheckout={isPerformingCheckout}
          onSubmit={(paymentInfo) => checkout(paymentInfo)}
          goBack={goBack}
        />
      )}
    </div>
  )
}

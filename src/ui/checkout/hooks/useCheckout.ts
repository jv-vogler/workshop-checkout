import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import type { Order } from '@/core/order'
import { Checkout } from '@/core/checkout'

import { orderMutations } from '@/app/order/mutations'

import { useCart } from '@/ui/cart/hooks/useCart'

export type UseCheckoutOptions = {
  onCheckoutSuccess?: (order: Order.Type) => void
  onCheckoutError?: (error: Error) => void
}

export const useCheckout = (options: UseCheckoutOptions = {}) => {
  const { cart, clearCart } = useCart()

  const [checkoutFlow, setCheckoutFlow] = useState<Checkout.Flow>(
    Checkout.start(cart),
  )

  const { mutate, isPending: isPerformingCheckout } = useMutation({
    mutationFn: orderMutations.submitOrder,
    onSuccess: (order) => {
      options.onCheckoutSuccess?.(order)

      clearCart()
    },
    onError: (error) => {
      options.onCheckoutError?.(error)
    },
  })

  const goToShippingInfo = (customerInfo: Order.Details.CustomerInfo) => {
    setCheckoutFlow(Checkout.goToShippingInfo(checkoutFlow, customerInfo))
  }

  const goToPaymentInfo = (shippingInfo: Order.Details.ShippingInfo) => {
    setCheckoutFlow(Checkout.goToPaymentInfo(checkoutFlow, shippingInfo))
  }

  const checkout = (paymentInfo: Order.Details.PaymentInfo) => {
    const checkoutFlowAtOrderReview = Checkout.goToOrderReview(
      checkoutFlow,
      paymentInfo,
    )

    const orderDetails = Checkout.getOrderDetails(checkoutFlowAtOrderReview)

    mutate(orderDetails)
  }

  const goBack = () => {
    setCheckoutFlow(Checkout.goBack(checkoutFlow))
  }

  return {
    checkoutFlow,
    goToShippingInfo,
    goToPaymentInfo,
    checkout,
    isPerformingCheckout,
    goBack,
  }
}

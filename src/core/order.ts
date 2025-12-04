/* eslint-disable @typescript-eslint/no-namespace */
import type { Cart } from './cart'

export namespace Order {
  export namespace Details {
    export type CustomerInfo = {
      firstName: string
      lastName: string
      email: string
    }

    export type ShippingInfo = {
      address: string
      city: string
      zipCode: string
    }

    export type PaymentInfo = {
      cardNumber: string
      expiry: string
      cvv: string
    }

    export type Totals = {
      subtotal: number
      tax: number
      shipping: number
      total: number
    }

    export type Type = {
      customerInfo: CustomerInfo
      shippingInfo: ShippingInfo
      paymentInfo: PaymentInfo
      items: Cart.Type['lineItems']
      totals: Totals
    }
  }

  export type Type = {
    orderId: string
    status: string
    estimatedDelivery: string
    items: number
    total: number
  }
}

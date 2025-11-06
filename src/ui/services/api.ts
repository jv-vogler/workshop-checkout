import type { Cart } from '@/core/cart'
import { apiRequest } from '@/lib/api'

export const orderApi = {
  async submitOrder(orderData: {
    items: Array<Cart.LineItem>
    customerInfo: {
      firstName: string
      lastName: string
      email: string
    }
    shippingInfo: {
      address: string
      city: string
      zipCode: string
    }
    paymentInfo: {
      cardNumber: string
      expiry: string
      cvv: string
    }
    totals: {
      subtotal: number
      tax: number
      shipping: number
      total: number
    }
  }): Promise<{
    orderId: string
    status: string
    estimatedDelivery: string
    items: number
    total: number
  }> {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },
}

export const healthApi = {
  async check(): Promise<{
    status: string
    timestamp: string
  }> {
    return apiRequest<{ status: string; timestamp: string }>('/health')
  },
}

import type { Product } from '@/core/product'
import { apiRequest } from '@/lib/api'

export interface CartItem extends Product.Type {
  quantity: number
}

export const orderApi = {
  async submitOrder(orderData: {
    items: Array<CartItem>
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

export const calculateTax = (subtotal: number): number => {
  const taxRate = 0.08
  return subtotal * taxRate
}

export const calculateShipping = (subtotal: number): number => {
  return subtotal >= 100 ? 0 : 9.99
}

// Backward compatibility exports
export const fetchProducts = () => productApi.getProducts()
export const fetchProduct = (id: number) => productApi.getProduct(id)

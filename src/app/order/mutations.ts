import type { Order } from '@/core/order'
import { apiRequest } from '@/lib/api'

export const orderMutations = {
  async submitOrder(details: Order.Details.Type): Promise<Order.Type> {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(details),
    })
  },
}

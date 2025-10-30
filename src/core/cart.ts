import type { LineItem } from '@/core/lineItem'

const TAX_RATE = 0.08
const FREE_SHIPPING_THRESHOLD = 100
const DEFAULT_SHIPPING_VALUE = 9.99
const FREE_SHIPPING_VALUE = 0

/* eslint-disable @typescript-eslint/no-namespace */
export namespace Cart {
  export type Type = {
    lineItems: Array<LineItem.Type>
  }

  export const calculateTax = (subtotal: number): number => {
    return subtotal * TAX_RATE
  }

  export const calculateShipping = (subtotal: number): number => {
    return subtotal >= FREE_SHIPPING_THRESHOLD
      ? FREE_SHIPPING_VALUE
      : DEFAULT_SHIPPING_VALUE
  }

  export const isEmpty = (lineItems: Array<LineItem.Type>) => {
    return lineItems.length === 0;
  }

  export const createEmptyCart = (): Cart.Type => {
    return { lineItems: [] }
  }
}

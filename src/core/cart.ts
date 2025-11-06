import { Product } from './product'
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

  export namespace Errors {
    export class ProductOutOfStockError extends Error {}

    export class NonPositiveQuantityError extends Error {}

    export class LineItemNotFoundError extends Error {}

    export class QuantityExceedsProductStock extends Error {}
  }

  const getLineItem = (
    cart: Type,
    productId: Product.Type['id'],
  ): LineItem.Type | undefined => {
    return cart.lineItems.find((lineItem) => lineItem.item.id === productId)
  }

  export const addProduct = (cart: Type, product: Product.Type): Type => {
    if (Product.getStockStatus(product) === Product.StockStatus.OutOfStock) {
      throw new Errors.ProductOutOfStockError()
    }

    const lineItem = getLineItem(cart, product.id)

    if (lineItem) {
      return updateProductQuantity(cart, product.id, lineItem.quantity + 1)
    }

    const updatedCart = structuredClone(cart)

    updatedCart.lineItems.push({ item: product, quantity: 1 })

    return updatedCart
  }

  export const updateProductQuantity = (
    cart: Type,
    productId: Product.Type['id'],
    quantity: number,
  ) => {
    if (quantity <= 0) {
      throw new Errors.NonPositiveQuantityError()
    }

    const lineItem = getLineItem(cart, productId)

    if (!lineItem) {
      throw new Errors.LineItemNotFoundError()
    }

    if (quantity > lineItem.item.stock) {
      throw new Errors.QuantityExceedsProductStock()
    }

    const updatedCart = structuredClone(cart)

    updatedCart.lineItems = updatedCart.lineItems.map((cartLineItem) => {
      if (cartLineItem.item.id === productId) {
        return { ...cartLineItem, quantity }
      } else {
        return cartLineItem
      }
    })

    return updatedCart
  }

  export const removeProduct = (
    cart: Type,
    productId: Product.Type['id'],
  ): Type => {
    const lineItem = getLineItem(cart, productId)

    if (!lineItem) return cart

    const updatedCart = structuredClone(cart)

    updatedCart.lineItems = updatedCart.lineItems.filter(
      (cartLineItem) => cartLineItem.item.id !== productId,
    )

    return updatedCart
  }

  export const calculateTax = (cart: Type): number => {
    return calculateSubtotal(cart) * TAX_RATE
  }

  export const calculateShipping = (cart: Type): number => {
    return calculateSubtotal(cart) >= FREE_SHIPPING_THRESHOLD
      ? FREE_SHIPPING_VALUE
      : DEFAULT_SHIPPING_VALUE
  }

  export const calculateSubtotal = (cart: Type): number => {
    return cart.lineItems.reduce(
      (sum, lineItem) => sum + lineItem.item.price * lineItem.quantity,
      0,
    )
  }

  export const calculateTotal = (cart: Type): number => {
    return (
      calculateSubtotal(cart) + calculateTax(cart) + calculateShipping(cart)
    )
  }

  export const isEmpty = (cart: Type) => {
    return cart.lineItems.length === 0
  }

  export const create = (): Type => {
    return { lineItems: [] }
  }
}

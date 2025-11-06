import { Product } from './product'

/* eslint-disable @typescript-eslint/no-namespace */
export namespace Cart {
  export type LineItem = {
    product: Product.Type
    quantity: number
  }

  export type Type = {
    lineItems: Array<LineItem>
  }

  class CartEntityError extends Error {}

  export namespace Errors {
    export class NonPositiveQuantityError extends CartEntityError {}

    export class ProductOutOfStockError extends CartEntityError {}

    export class ProductQuantityExceedsStockError extends CartEntityError {}

    export class LineItemNotFoundError extends CartEntityError {}
  }

  export const create = (): Type => {
    return {
      lineItems: [],
    }
  }

  export const getLineItemQuantity = (
    cart: Type,
    productId: number,
  ): number | undefined => {
    return cart.lineItems.find((item) => item.product.id === productId)
      ?.quantity
  }

  export const addItem = (
    cart: Type,
    product: Product.Type,
    quantity: number,
  ): Type => {
    if (quantity <= 0) throw new Errors.NonPositiveQuantityError()

    if (Product.getStockStatus(product) === Product.StockStatus.OutOfStock)
      throw new Errors.ProductOutOfStockError()

    const lineItemQuantity = getLineItemQuantity(cart, product.id) ?? 0

    if (lineItemQuantity + quantity > product.stock)
      throw new Errors.ProductQuantityExceedsStockError()

    const lineItemIndex = cart.lineItems.findIndex(
      (item) => item.product.id === product.id,
    )

    const updatedLineItems = structuredClone(cart.lineItems)

    if (lineItemIndex !== -1) {
      updatedLineItems[lineItemIndex].quantity += quantity
    } else {
      updatedLineItems.push({ product, quantity })
    }
    return { ...cart, lineItems: updatedLineItems }
  }

  export const removeItem = (cart: Type, productId: number): Type => ({
    ...cart,
    lineItems: cart.lineItems.filter((item) => item.product.id !== productId),
  })

  export const getSubtotal = (cart: Type): number =>
    cart.lineItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )

  export const getTax = (cart: Type): number => getSubtotal(cart) * 0.08

  export const getShipping = (cart: Type): number =>
    getSubtotal(cart) > 100 ? 0 : 9.99

  export const getTotal = (cart: Type): number =>
    getSubtotal(cart) + getTax(cart) + getShipping(cart)

  export const setLineItemQuantity = (
    cart: Type,
    productId: number,
    quantity: number,
  ): Type => {
    if (quantity <= 0) throw new Errors.NonPositiveQuantityError()

    const lineItemIndex = cart.lineItems.findIndex(
      (item) => item.product.id === productId,
    )

    if (lineItemIndex === -1) throw new Errors.LineItemNotFoundError()

    const updatedLineItems = structuredClone(cart.lineItems)

    updatedLineItems[lineItemIndex].quantity = quantity

    return { ...cart, lineItems: updatedLineItems }
  }
}

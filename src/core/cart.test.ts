import { Cart } from '@/core/cart'
import {
  createCartWithLowerSubtotal,
  createCartWithProducts,
} from '@/tests/factories/cart'

describe('Cart', () => {
  describe('create', () => {
    it('returns an empty cart', () => {
      const cart = Cart.create()

      expect.soft(cart).toEqual({ lineItems: [] })
    })
  })

  describe('calculateShipping', () => {
    const DEFAULT_SHIPPING_VALUE = 9.99
    const FREE_SHIPPING_VALUE = 0

    describe('when subtotal is higher than or equal to free shipping threshold', () => {
      it('returns free shipping value', () => {
        const cart = createCartWithProducts()

        const shipping = Cart.calculateShipping(cart)

        expect(shipping).toBe(FREE_SHIPPING_VALUE)
      })
    })

    describe('when subtotal is lower than free shipping threshold', () => {
      it('returns the default shipping value', () => {
        const cart = createCartWithLowerSubtotal()

        const shipping = Cart.calculateShipping(cart)

        expect(shipping).toBe(DEFAULT_SHIPPING_VALUE)
      })
    })
  })
})

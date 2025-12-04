import cardValidator from 'card-validator'

import { Cart } from './cart'
import type { Order } from './order'

import { emailPattern, isEmpty } from '@/lib/string'

/* eslint-disable @typescript-eslint/no-namespace */
export namespace Checkout {
  export const steps = [
    'CUSTOMER_INFO',
    'SHIPPING_INFO',
    'PAYMENT_INFO',
    'ORDER_REVIEW',
  ] as const

  export type Step = (typeof steps)[number]

  export namespace Errors {
    export namespace CustomerInfo {
      export class InvalidCustomerInfoError extends Error {}

      export class MissingFirstNameError extends InvalidCustomerInfoError {}

      export class MissingLastNameError extends InvalidCustomerInfoError {}

      export class MissingEmailError extends InvalidCustomerInfoError {}

      export class InvalidEmailError extends InvalidCustomerInfoError {}
    }

    export namespace ShippingInfo {
      export class InvalidShippingInfoError extends Error {}

      export class MissingAddressError extends InvalidShippingInfoError {}

      export class MissingCityError extends InvalidShippingInfoError {}

      export class MissingZipCodeError extends InvalidShippingInfoError {}
    }

    export namespace PaymentInfo {
      export class InvalidPaymentInfoError extends Error {}

      export class MissingCardNumberError extends InvalidPaymentInfoError {}

      export class InvalidCardNumberError extends InvalidPaymentInfoError {}

      export class MissingCardExpiryError extends InvalidPaymentInfoError {}

      export class InvalidCardExpiryError extends InvalidPaymentInfoError {}

      export class MissingCardCvvError extends InvalidPaymentInfoError {}

      export class InvalidCardCvvError extends InvalidPaymentInfoError {}
    }

    export class InvalidCheckoutFlowTransitionError extends Error {}
  }

  type BaseFlow = {
    step: Step
    cart: Readonly<Cart.Type>
  }

  type FlowAtCustomerInfo = BaseFlow & {
    step: 'CUSTOMER_INFO'
    customerInfo?: Readonly<Order.Details.CustomerInfo>
    shippingInfo?: Readonly<Order.Details.ShippingInfo>
    paymentInfo?: Readonly<Order.Details.PaymentInfo>
  }

  type FlowAtShippingInfo = BaseFlow & {
    step: 'SHIPPING_INFO'
    customerInfo: Readonly<Order.Details.CustomerInfo>
    shippingInfo?: Readonly<Order.Details.ShippingInfo>
    paymentInfo?: Readonly<Order.Details.PaymentInfo>
  }

  type FlowAtPaymentInfo = BaseFlow & {
    step: 'PAYMENT_INFO'
    customerInfo: Readonly<Order.Details.CustomerInfo>
    shippingInfo: Readonly<Order.Details.ShippingInfo>
    paymentInfo?: Readonly<Order.Details.PaymentInfo>
  }

  type FlowAtOrderReview = BaseFlow & {
    step: 'ORDER_REVIEW'
    customerInfo: Readonly<Order.Details.CustomerInfo>
    shippingInfo: Readonly<Order.Details.ShippingInfo>
    paymentInfo: Readonly<Order.Details.PaymentInfo>
  }

  export type Flow =
    | FlowAtCustomerInfo
    | FlowAtShippingInfo
    | FlowAtPaymentInfo
    | FlowAtOrderReview

  export const start = (cart: Cart.Type): FlowAtCustomerInfo => {
    return {
      cart,
      step: 'CUSTOMER_INFO',
    }
  }

  const assertValidCustomerInfo = (
    customerInfo: Order.Details.CustomerInfo,
  ): void => {
    if (isEmpty(customerInfo.firstName)) {
      throw new Errors.CustomerInfo.MissingFirstNameError()
    }

    if (isEmpty(customerInfo.lastName)) {
      throw new Errors.CustomerInfo.MissingLastNameError()
    }

    if (isEmpty(customerInfo.email)) {
      throw new Errors.CustomerInfo.MissingEmailError()
    }

    if (!emailPattern.test(customerInfo.email.trim())) {
      throw new Errors.CustomerInfo.InvalidEmailError()
    }
  }

  export const goToShippingInfo = (
    checkout: Flow,
    customerInfo: Order.Details.CustomerInfo,
  ): FlowAtShippingInfo => {
    if (checkout.step !== 'CUSTOMER_INFO') {
      throw new Errors.InvalidCheckoutFlowTransitionError(
        `Expected checkout to be at CUSTOMER_INFO step, but got ${checkout.step}`,
      )
    }

    assertValidCustomerInfo(customerInfo)

    return {
      ...checkout,
      customerInfo,
      step: 'SHIPPING_INFO',
    }
  }

  const assertValidShippingInfo = (
    shippingInfo: Order.Details.ShippingInfo,
  ): void => {
    if (isEmpty(shippingInfo.address)) {
      throw new Errors.ShippingInfo.MissingAddressError()
    }
    if (isEmpty(shippingInfo.city)) {
      throw new Errors.ShippingInfo.MissingCityError()
    }
    if (isEmpty(shippingInfo.zipCode)) {
      throw new Errors.ShippingInfo.MissingZipCodeError()
    }
  }

  export const goToPaymentInfo = (
    checkout: Flow,
    shippingInfo: Order.Details.ShippingInfo,
  ): FlowAtPaymentInfo => {
    if (checkout.step !== 'SHIPPING_INFO') {
      throw new Errors.InvalidCheckoutFlowTransitionError(
        `Expected checkout to be at SHIPPING_INFO step, but got ${checkout.step}`,
      )
    }

    assertValidShippingInfo(shippingInfo)

    return {
      ...checkout,
      shippingInfo,
      step: 'PAYMENT_INFO',
    }
  }

  export const assertValidPaymentInfo = (
    paymentInfo: Order.Details.PaymentInfo,
  ): void => {
    if (isEmpty(paymentInfo.cardNumber)) {
      throw new Errors.PaymentInfo.MissingCardNumberError()
    }

    if (!cardValidator.number(paymentInfo.cardNumber).isValid) {
      throw new Errors.PaymentInfo.InvalidCardNumberError()
    }

    if (isEmpty(paymentInfo.expiry)) {
      throw new Errors.PaymentInfo.MissingCardExpiryError()
    }

    const expiry = cardValidator.expirationDate(paymentInfo.expiry)

    if (!expiry.isValid) {
      throw new Errors.PaymentInfo.InvalidCardExpiryError()
    }

    if (isEmpty(paymentInfo.cvv)) {
      throw new Errors.PaymentInfo.MissingCardCvvError()
    }

    if (!cardValidator.cvv(paymentInfo.cvv).isValid) {
      throw new Errors.PaymentInfo.InvalidCardCvvError()
    }
  }

  export const goToOrderReview = (
    checkout: Flow,
    paymentInfo: Order.Details.PaymentInfo,
  ): FlowAtOrderReview => {
    if (checkout.step !== 'PAYMENT_INFO') {
      throw new Errors.InvalidCheckoutFlowTransitionError(
        `Expected checkout to be at PAYMENT_INFO step, but got ${checkout.step}`,
      )
    }

    assertValidPaymentInfo(paymentInfo)

    return {
      ...checkout,
      paymentInfo,
      step: 'ORDER_REVIEW',
    }
  }

  export const getOrderDetails = (checkout: Flow): Order.Details.Type => {
    if (checkout.step !== 'ORDER_REVIEW') {
      throw new Errors.InvalidCheckoutFlowTransitionError(
        `Expected checkout to be at ORDER_REVIEW step, but got ${checkout.step}`,
      )
    }

    return {
      customerInfo: checkout.customerInfo,
      shippingInfo: checkout.shippingInfo,
      paymentInfo: checkout.paymentInfo,
      items: checkout.cart.lineItems,
      totals: {
        subtotal: Cart.calculateSubtotal(checkout.cart),
        tax: Cart.calculateTax(checkout.cart),
        shipping: Cart.calculateShipping(checkout.cart),
        total: Cart.calculateTotal(checkout.cart),
      },
    }
  }

  export const goBack = (checkout: Flow): Flow => {
    switch (checkout.step) {
      case 'CUSTOMER_INFO':
        return start(checkout.cart)
      case 'SHIPPING_INFO':
        return { ...checkout, step: 'CUSTOMER_INFO' }
      case 'PAYMENT_INFO':
        return { ...checkout, step: 'SHIPPING_INFO' }
      case 'ORDER_REVIEW':
        return { ...checkout, step: 'PAYMENT_INFO' }
      default:
        return checkout
    }
  }
}

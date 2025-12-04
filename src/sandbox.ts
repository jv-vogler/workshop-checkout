import { orderMutations } from './app/order/mutations'
import { productQueries } from './app/product/queries'
import { Cart } from './core/cart'
import { Checkout } from './core/checkout'

const products = await productQueries.getProducts()

let cart = Cart.create()

cart = Cart.addProduct(cart, products[0])
cart = Cart.addProduct(cart, products[1])
cart = Cart.addProduct(cart, products[2])
cart = Cart.addProduct(cart, products[2])
// cart = Cart.updateProductQuantity(cart, products[2].id, 99)

const checkoutAtCustomerInfo = Checkout.start(cart)

const checkoutAtShippingInfo = Checkout.goToShippingInfo(
  checkoutAtCustomerInfo,
  {
    firstName: 'Paulo',
    lastName: 'Souza',
    email: 'paulo@email.com',
  },
)

const checkoutAtPaymentInfo = Checkout.goToPaymentInfo(checkoutAtShippingInfo, {
  address: 'Ponce de Leon Blvd',
  city: 'Coral Gables',
  zipCode: '33134',
})

const checkoutAtOrderReview = Checkout.goToOrderReview(checkoutAtPaymentInfo, {
  cardNumber: '4242424242424242',
  expiry: '11/26',
  cvv: '432',
})

const orderDetails = Checkout.getOrderDetails(checkoutAtOrderReview)

const order = await orderMutations.submitOrder(orderDetails)

console.dir(order, { depth: null })

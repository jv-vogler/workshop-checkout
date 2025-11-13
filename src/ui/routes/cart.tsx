import { Link, createFileRoute } from '@tanstack/react-router'

import { TypographyHeading } from '@/ui/components/ui/typography'
import { Button } from '@/ui/components/ui/button'
import { Cart } from '@/core/cart'
import { useCart } from '@/ui/cart/hooks/useCart'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { cart, updateQuantity, removeItem, shipping, subtotal, tax, total } =
    useCart()

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    updateQuantity(productId, newQuantity)
  }

  const removeItemFromCart = (productId: number) => {
    if (!confirm('Remove this item from your cart?')) {
      return
    }

    removeItem(productId)
  }

  if (Cart.isEmpty(cart)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <TypographyHeading>Your Cart is Empty</TypographyHeading>
        <p className="mt-4 text-gray-600">
          Add some products to your cart to get started!
        </p>
        <Link to="/" className="inline-block mt-4">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TypographyHeading className="mb-6">Shopping Cart</TypographyHeading>

      <div className="space-y-4">
        {cart.lineItems.map((lineItem, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex items-center space-x-4"
          >
            <img
              src={lineItem.item.image}
              alt={lineItem.item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{lineItem.item.name}</h3>
              <p className="text-gray-600">${lineItem.item.price}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateCartQuantity(lineItem.item.id, lineItem.quantity - 1)
                }
                disabled={lineItem.quantity <= 1}
              >
                -
              </Button>
              <span className="px-3 min-w-8 text-center">
                {lineItem.quantity}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateCartQuantity(lineItem.item.id, lineItem.quantity + 1)
                }
              >
                +
              </Button>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ${(lineItem.item.price * lineItem.quantity).toFixed(2)}
              </p>
              <Button
                size="sm"
                variant="destructive"
                className="mt-2"
                onClick={() => removeItemFromCart(lineItem.item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="max-w-sm ml-auto space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Link to="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link to="/checkout">
            <Button disabled={Cart.isEmpty(cart)}>Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

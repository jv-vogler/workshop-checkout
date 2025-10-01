import { useEffect, useState } from 'react'

import { Link } from '@tanstack/react-router'

import { getCartFromStorage } from '../../services/cart'

export function Header() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const cart = getCartFromStorage()
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(count)

    setInterval(() => {
      const updatedCart = getCartFromStorage()
      const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(newCount)
    }, 1000)
  }, [])

  return (
    <header className="p-4 bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
              🛍️ GenShop
            </h1>
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className="font-medium text-gray-300 hover:text-blue-400 transition-colors"
          >
            Home
          </Link>

          <Link
            to="/cart"
            className="font-medium text-gray-300 hover:text-blue-400 transition-colors"
          >
            Cart
          </Link>

          <Link
            to="/checkout"
            className="font-medium text-gray-300 hover:text-blue-400 transition-colors"
          >
            Checkout
          </Link>

          <Link
            to="/cart"
            className="relative p-2 text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

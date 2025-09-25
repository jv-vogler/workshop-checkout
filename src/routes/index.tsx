import { useEffect, useMemo, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { calculateDiscountedPrice, productApi } from '../services/api'
import { addToCartWithStorage, getCartFromStorage } from '../services/cart'

import type { CartItem, Product } from '../services/api'

import { TypographyHeading, TypographyP } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({ component: IndexPage })

function IndexPage() {
  const [products, setProducts] = useState<Array<Product>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<Array<CartItem>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    productApi
      .getProducts()
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })

    const savedCart = getCartFromStorage()
    setCart(savedCart)
  }, [])

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock!')
      return
    }

    const updatedCart = addToCartWithStorage([...cart], product)
    setCart(updatedCart)

    alert(`${product.name} added to cart!`)
  }

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [products, selectedCategory, searchQuery])

  const calculateDisplayPrice = (product: Product) => {
    if (product.discount && product.discount.isActive) {
      return calculateDiscountedPrice(product.price, product.discount.value)
    }
    return product.price
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading products...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TypographyHeading className="text-center mb-8">
        Our Products
      </TypographyHeading>

      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium mb-2">
            Search Products
          </label>
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            className="px-3 py-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="audio">Audio</option>
            <option value="wearables">Wearables</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => {
          const displayPrice = calculateDisplayPrice(product)
          const isOnSale = displayPrice < product.price

          return (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-md relative"
            >
              {isOnSale && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  SALE
                </div>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src =
                    'https://via.placeholder.com/300x200?text=No+Image'
                }}
              />

              <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
              <TypographyP className="text-gray-600 text-sm">
                {product.description}
              </TypographyP>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  {isOnSale ? (
                    <>
                      <span className="text-xl font-bold text-red-600">
                        ${displayPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">${product.price}</span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>

              <Button
                className="w-full mt-4"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {product.stock > 0 && product.stock <= 30 && (
                <div className="text-orange-600 text-sm mt-2">
                  Only {product.stock} left in stock!
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}

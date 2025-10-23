import { useEffect, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { addToCartWithStorage, getCartFromStorage } from '../services/cart'

import { useProducts } from '../product/hooks/useProducts'
import { ProductFilters } from '../product/components/ProductFilters'
import { useProductFilters } from '../product/hooks/useProductFilters'
import { ProductCard } from '../product/components/ProductCard'
import type { CartItem } from '../services/api'

import type { Product } from '@/core/product'
import { TypographyHeading } from '@/ui/components/ui/typography'

export const Route = createFileRoute('/')({ component: IndexPage })

function IndexPage() {
  const [cart, setCart] = useState<Array<CartItem>>([])
  const { filters, debouncedFilters, setFilters } = useProductFilters()
  const { products, error, isLoadingProducts } = useProducts({
    filters: debouncedFilters,
  })

  useEffect(() => {
    const savedCart = getCartFromStorage()
    setCart(savedCart)
  }, [])

  const handleAddToCart = (product: Product.Type) => {
    if (product.stock <= 0) {
      alert('Product is out of stock!')
      return
    }

    const updatedCart = addToCartWithStorage([...cart], product)
    setCart(updatedCart)

    alert(`${product.name} added to cart!`)
  }

  const contentElement = (() => {
    if (isLoadingProducts) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          Loading products...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen text-red-600">
          Error: {error.message}
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No products found matching your criteria.
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    )
  })()

  return (
    <div className="container mx-auto px-4 py-8">
      <TypographyHeading className="text-center mb-8">
        Our Products
      </TypographyHeading>

      <ProductFilters filters={filters} setFilters={setFilters} />

      {contentElement}
    </div>
  )
}

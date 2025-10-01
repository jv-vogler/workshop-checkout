import { useEffect, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { ProductFilters } from '../product/components/ProductFilters'
import type { CartItem } from '@/ui/services/api'
import type {
  Product,
  ProductFilters as ProductFiltersType,
} from '@/core/product'
import { addToCartWithStorage, getCartFromStorage } from '@/ui/services/cart'

import { useProducts } from '@/ui/product/hooks/useProducts'

import { TypographyHeading } from '@/ui/shared/components/design/typography'
import { ProductCard } from '@/ui/product/components/ProductCard'

export const Route = createFileRoute('/')({ component: IndexPage })

function IndexPage() {
  const [cart, setCart] = useState<Array<CartItem>>([])
  const [filters, setFilters] = useState<Partial<ProductFiltersType>>({})
  const { products, error, isLoadingProducts } = useProducts(filters)

  useEffect(() => {
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

  const productListElement = () => {
    if (isLoadingProducts) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          Loading products...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[200px] text-red-600">
          Error: {error.message}
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          No products found matching your criteria.
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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TypographyHeading className="text-center mb-8">
        Our Products
      </TypographyHeading>

      <ProductFilters
        rootClassName="mb-6"
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters({ ...filters, [key]: value })
        }
      />

      {productListElement()}
    </div>
  )
}

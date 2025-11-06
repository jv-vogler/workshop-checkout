import { createFileRoute } from '@tanstack/react-router'

import { toast } from 'react-toastify'

import { useProducts } from '../product/hooks/useProducts'
import { ProductFilters } from '../product/components/ProductFilters'
import { useProductFilters } from '../product/hooks/useProductFilters'
import { ProductCard } from '../product/components/ProductCard'
import { useCart } from '../cart/contexts/CartContext'

import type { Product } from '@/core/product'
import { TypographyHeading } from '@/ui/components/ui/typography'
import { Cart } from '@/core/cart'

export const Route = createFileRoute('/')({ component: IndexPage })

function IndexPage() {
  const { addItem } = useCart()
  const { filters, debouncedFilters, setFilters } = useProductFilters()
  const { products, error, isLoadingProducts } = useProducts({
    filters: debouncedFilters,
  })

  const handleAddToCart = (product: Product.Type) => {
    try {
      addItem(product, 1)

      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      if (err instanceof Cart.Errors.ProductOutOfStockError) {
        toast.error(`${product.name} is out of stock!`)
      }

      if (err instanceof Cart.Errors.ProductQuantityExceedsStockError) {
        toast.error(`No more units left for ${product.name}!`)
      }
    }
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

import type { Product } from '@/core/product'
import {
  StockStatus,
  calculateDiscountedPrice,
  getStockStatus,
} from '@/core/product'
import { Button } from '@/ui/shared/components/design/button'
import { TypographyP } from '@/ui/shared/components/design/typography'

type ProductCardProps = {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const stockStatus = getStockStatus(product)
  const hasDiscount = product.discount?.isActive

  return (
    <div key={product.id} className="border rounded-lg p-4 shadow-md relative">
      {hasDiscount && (
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
          target.src = 'https://via.placeholder.com/300x200?text=No+Image'
        }}
      />

      <h3 className="text-lg font-semibold mt-4">{product.name}</h3>

      <TypographyP className="text-gray-600 text-sm">
        {product.description}
      </TypographyP>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-red-600">
                ${calculateDiscountedPrice(product).toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold">${product.price}</span>
          )}
        </div>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>

      <Button
        className="w-full mt-4"
        onClick={() => onAddToCart(product)}
        disabled={stockStatus === StockStatus.OutOfStock}
      >
        {stockStatus === StockStatus.OutOfStock
          ? 'Out of Stock'
          : 'Add to Cart'}
      </Button>

      {stockStatus === StockStatus.LowStock && (
        <div className="text-orange-600 text-sm mt-2">
          Only {product.stock} left in stock!
        </div>
      )}
    </div>
  )
}

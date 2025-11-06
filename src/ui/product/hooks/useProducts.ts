import { useQuery } from '@tanstack/react-query'

import type { UiProductFilters } from '../types'
import type { Product } from '@/core/product'
import { productQueries } from '@/app/product/queries'
import { useCart } from '@/ui/cart/contexts/CartContext'
import { Cart } from '@/core/cart'

type UseProductsProps = {
  filters: UiProductFilters
}

type UseProductsReturn = {
  products: Array<Product.Type & { stockLeft: number }>
  error: Error | null
  isLoadingProducts: boolean
}

export const useProducts = ({
  filters,
}: UseProductsProps): UseProductsReturn => {
  const { cart } = useCart()

  const { category, ...nonCategoryFilters } = filters

  const normalizedFilters = category === 'all' ? nonCategoryFilters : filters

  const { data, error, isFetching } = useQuery({
    queryKey: ['products', normalizedFilters],
    queryFn: () => productQueries.getProducts(normalizedFilters),
    initialData: [],
  })

  const products = data.map((product) => {
    const quantityInCart = Cart.getLineItemQuantity(cart, product.id) ?? 0

    return {
      ...product,
      stockLeft: product.stock - quantityInCart,
    }
  })

  return { products, error, isLoadingProducts: isFetching }
}

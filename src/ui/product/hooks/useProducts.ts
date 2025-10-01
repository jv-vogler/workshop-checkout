import { useQuery } from '@tanstack/react-query'

import type { ProductCategory } from '@/core/product'
import { productApi } from '@/services/product/api'

type UseProductsProps = Partial<{
  category?: ProductCategory | 'all'
  search?: string
}>

export const useProducts = (filters: UseProductsProps = {}) => {
  const { category, ...nonCategoryFilters } = filters

  const normalizedFilters = category === 'all' ? nonCategoryFilters : filters

  const {
    data: products,
    error,
    isFetching: isLoadingProducts,
  } = useQuery({
    queryKey: ['products', normalizedFilters],
    queryFn: () => productApi.getProducts(normalizedFilters),
    initialData: [],
  })

  return { products, error, isLoadingProducts }
}

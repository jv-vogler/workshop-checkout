import { useQuery } from '@tanstack/react-query'

import type { UiProductFilters } from '../types'
import { productQueries } from '@/app/product/queries'

type UseProductsProps = {
  filters: UiProductFilters
}

export const useProducts = ({ filters }: UseProductsProps) => {
  const { category, ...nonCategoryFilters } = filters

  const normalizedFilters = category === 'all' ? nonCategoryFilters : filters

  const { data, error, isFetching } = useQuery({
    queryKey: ['products', normalizedFilters],
    queryFn: () => productQueries.getProducts(normalizedFilters),
    initialData: [],
  })

  return { products: data, error, isLoadingProducts: isFetching }
}

import { useQuery } from '@tanstack/react-query'
import { productApi } from '@/ui/services/api'

type UseProductsProps = {
  filters: {
    category: string
    search: string
  }
}

export const useProducts = ({ filters }: UseProductsProps) => {
  const { category, ...nonCategoryFilters } = filters

  const normalizedFilters = category === 'all' ? nonCategoryFilters : filters

  const { data, error, isFetching } = useQuery({
    queryKey: ['products', normalizedFilters],
    queryFn: () => productApi.getProducts(normalizedFilters),
    initialData: [],
  })

  return { products: data, error, isLoadingProducts: isFetching }
}

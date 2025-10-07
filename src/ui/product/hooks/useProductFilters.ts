import { useState } from 'react'
import { useDebounce } from 'use-debounce'

export const useProductFilters = () => {
  const [filters, setFilters] = useState<{
    category: string
    search: string
  }>({
    search: '',
    category: 'all',
  })

  const [debouncedFilters] = useDebounce(filters, 300)

  return { filters, debouncedFilters, setFilters }
}

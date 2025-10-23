import { useState } from 'react'
import { useDebounce } from 'use-debounce'

import type { UiProductFilters } from '../types'

export const useProductFilters = () => {
  const [filters, setFilters] = useState<UiProductFilters>({
    search: '',
    category: 'all',
  })

  const [debouncedFilters] = useDebounce(filters, 300)

  return { filters, debouncedFilters, setFilters }
}

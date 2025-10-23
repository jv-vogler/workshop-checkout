import type { ProductFilters } from '@/app/product/queries'

export type UiProductFilters = Omit<ProductFilters, 'category'> & {
  category?: ProductFilters['category'] | 'all'
}

import type { ProductCategory, ProductFilters } from '@/core/product'
import { Input } from '@/ui/shared/components/design/input'
import { cn } from '@/ui/lib/cn'

type ProductFiltersProps = {
  rootClassName?: string
  filters?: Partial<ProductFilters>
  onFilterChange: <TKey extends keyof ProductFilters>(
    key: TKey,
    value: ProductFilters[TKey],
  ) => void
}

export function ProductFilters({
  filters,
  rootClassName,
  onFilterChange,
}: ProductFiltersProps) {
  return (
    <div className={cn('flex flex-wrap gap-4 items-end', rootClassName)}>
      <div className="flex-1 min-w-64">
        <label className="block text-sm font-medium mb-2">
          Search Products
        </label>
        <Input
          type="text"
          placeholder="Search products..."
          value={filters?.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          className="px-3 py-1.5 border rounded-md"
          value={filters?.category || ''}
          onChange={(e) =>
            onFilterChange('category', e.target.value as ProductCategory)
          }
        >
          <option value="all">All Categories</option>
          <option value="audio">Audio</option>
          <option value="wearables">Wearables</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>
    </div>
  )
}

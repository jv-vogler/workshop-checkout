import type { UiProductFilters } from '../../types'
import { Input } from '@/ui/components/ui/input'

type ProductFiltersProps = {
  filters: UiProductFilters
  setFilters: React.Dispatch<React.SetStateAction<UiProductFilters>>
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-64">
        <label className="block text-sm font-medium mb-2">
          Search Products
        </label>
        <Input
          type="text"
          placeholder="Search products..."
          value={filters.search ?? ''}
          onChange={(e) =>
            setFilters((previousFilters) => ({
              ...previousFilters,
              search: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          className="px-3 py-1.5 border rounded-md"
          value={filters.category ?? 'all'}
          onChange={(e) =>
            setFilters((previousFilters) => ({
              ...previousFilters,
              category: e.target.value as UiProductFilters['category'],
            }))
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

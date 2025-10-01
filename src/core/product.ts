export type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  stock: number
  category: ProductCategory
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    isActive: boolean
  }
}

export enum ProductCategory {
  Audio = 'audio',
  Wearables = 'wearables',
  Accessories = 'accessories',
}

export enum StockStatus {
  OutOfStock = 'OutOfStock',
  LowStock = 'LowStock',
  InStock = 'InStock',
}

export type ProductFilters = {
  search: string
  category: ProductCategory
}

export type GetProducts = (
  filters?: Partial<ProductFilters>,
) => Promise<Array<Product>>

export type GetProduct = (id: Product['id']) => Promise<Product>

export type GetProductCategories = () => Promise<Array<ProductCategory>>

export function calculateDiscountedPrice(product: Product) {
  if (product.discount && product.discount.isActive) {
    if (product.discount.type === 'percentage') {
      return product.price * (1 - product.discount.value / 100)
    } else {
      return product.price - product.discount.value
    }
  }

  return product.price
}

export function getStockStatus(product: Product) {
  if (product.stock === 0) return StockStatus.OutOfStock

  if (product.stock <= 30) return StockStatus.LowStock

  return StockStatus.InStock
}

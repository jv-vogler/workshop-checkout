/* eslint-disable @typescript-eslint/no-namespace */
export namespace Product {
  export type Type = {
    id: number
    name: string
    price: number
    image: string
    description: string
    stock: number
    category: Category
    discount?: Discount
  }

  export enum Category {
    Audio = 'audio',
    Wearables = 'wearables',
    Accessories = 'accessories',
  }

  export enum StockStatus {
    OutOfStock = 'OutOfStock',
    LowStock = 'LowStock',
    InStock = 'InStock',
  }

  export type Discount = {
    type: 'percentage' | 'fixed'
    value: number
    isActive: boolean
  }

  export const isOnSale = (product: Type): boolean => {
    const displayPrice = calculateDisplayPrice(product)
    return displayPrice < product.price
  }

  export const getStockStatus = (product: Type): StockStatus => {
    if (product.stock === 0) return StockStatus.OutOfStock
    if (product.stock > 0 && product.stock <= 30) return StockStatus.LowStock

    return StockStatus.InStock
  }

  export const calculateDisplayPrice = (
    product: Product.Type,
  ): Product.Type['price'] => {
    const discount = product.discount

    if (!discount || !discount.isActive) return product.price

    if (discount.type === 'percentage') {
      return product.price * (1 - discount.value / 100)
    }

    return product.price - discount.value
  }
}

import type { Product } from '@/core/product'

/* eslint-disable @typescript-eslint/no-namespace */
export namespace LineItem {
  export type Type = {
    item: Product.Type
    quantity: number
  }
}

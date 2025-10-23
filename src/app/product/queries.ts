import type { Product } from "@/core/product"
import { apiRequest } from "@/lib/api"

export type ProductFilters = {
  search?: string
  category?: Product.Category
}

export const productQueries = {
  async getProducts(filters?: ProductFilters): Promise<Array<Product.Type>> {
    const params = new URLSearchParams()

    if (filters?.category) {
      params.append('category', filters.category)
    }

    if (filters?.search) {
      params.append('search', filters.search)
    }

    const query = params.toString()
    const endpoint = `/products${query ? `?${query}` : ''}`

    return apiRequest<Array<Product.Type>>(endpoint)
  },

  async getProduct(id: number): Promise<Product.Type> {
    return apiRequest<Product.Type>(`/products/${id}`)
  },

  async getCategories(): Promise<Array<Product.Category>> {
    return apiRequest<Array<Product.Category>>('/categories')
  },
}

import { apiRequest } from '../shared/http'
import type {
  GetProduct,
  GetProductCategories,
  GetProducts,
} from '@/core/product'

type ProductAPI = {
  getProducts: GetProducts
  getProduct: GetProduct
  getCategories: GetProductCategories
}

export const productApi: ProductAPI = {
  async getProducts(filters) {
    const params = new URLSearchParams()

    if (filters?.category) {
      params.append('category', filters.category)
    }

    if (filters?.search) {
      params.append('search', filters.search)
    }

    const query = params.toString()
    const endpoint = `/products${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  async getProduct(id) {
    return apiRequest(`/products/${id}`)
  },

  async getCategories() {
    return apiRequest('/categories')
  },
}

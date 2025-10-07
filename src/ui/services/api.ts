const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
}

export interface Product {
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

export type ProductCategory = 'audio' | 'wearables' | 'accessories'

export interface CartItem extends Product {
  quantity: number
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data: ApiResponse<T> = await response.json()

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error || `HTTP ${response.status}`,
        response.status,
        data,
      )
    }

    return data.data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
    )
  }
}

export const productApi = {
  async getProducts(filters?: {
    category?: string
    search?: string
  }): Promise<Array<Product>> {
    const params = new URLSearchParams()

    if (filters?.category) {
      params.append('category', filters.category)
    }

    if (filters?.search) {
      params.append('search', filters.search)
    }

    const query = params.toString()
    const endpoint = `/products${query ? `?${query}` : ''}`

    return apiRequest<Array<Product>>(endpoint)
  },

  async getProduct(id: number): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`)
  },

  async getCategories(): Promise<Array<ProductCategory>> {
    return apiRequest<Array<ProductCategory>>('/categories')
  },
}

export const orderApi = {
  async submitOrder(orderData: {
    items: Array<CartItem>
    customerInfo: {
      firstName: string
      lastName: string
      email: string
    }
    shippingInfo: {
      address: string
      city: string
      zipCode: string
    }
    paymentInfo: {
      cardNumber: string
      expiry: string
      cvv: string
    }
    totals: {
      subtotal: number
      tax: number
      shipping: number
      total: number
    }
  }): Promise<{
    orderId: string
    status: string
    estimatedDelivery: string
    items: number
    total: number
  }> {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },
}

export const healthApi = {
  async check(): Promise<{
    status: string
    timestamp: string
  }> {
    return apiRequest<{ status: string; timestamp: string }>('/health')
  },
}

export const calculateDiscountedPrice = (
  price: number,
  discountPercent: number,
): number => {
  return price * (1 - discountPercent / 100)
}

export const calculateTax = (subtotal: number): number => {
  const taxRate = 0.08
  return subtotal * taxRate
}

export const calculateShipping = (subtotal: number): number => {
  return subtotal >= 100 ? 0 : 9.99
}

// Backward compatibility exports
export const fetchProducts = () => productApi.getProducts()
export const fetchProduct = (id: number) => productApi.getProduct(id)

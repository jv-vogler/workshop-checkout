const API_BASE_URL =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  import.meta?.env?.VITE_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
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

export async function apiRequest<T>(
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

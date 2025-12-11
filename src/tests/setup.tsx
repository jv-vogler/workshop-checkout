import '@testing-library/jest-dom'
import '@testing-library/user-event'

import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { CartProvider } from '@/ui/cart/context/CartContext'

export const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <CartProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </CartProvider>
  )
}

export const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'
export { customRender as render }

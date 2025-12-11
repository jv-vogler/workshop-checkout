import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routesDirectory: resolve(__dirname, 'src', 'ui', 'routes'),
      generatedRouteTree: resolve(__dirname, 'src', 'ui', 'routeTree.gen.ts'),
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    setupFiles: 'src/tests/setup.tsx',
    globals: true,
    environment: 'jsdom',
  },
})

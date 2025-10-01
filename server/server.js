import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { productSchemas, orderSchemas, healthSchemas } from './schemas.js'

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
})

await fastify.register(cors, {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

await fastify.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'GenShop API',
      description: 'API for GenShop',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'products', description: 'Product related endpoints' },
      { name: 'orders', description: 'Order related endpoints' },
      { name: 'health', description: 'Health check endpoints' },
    ],
  },
})

await fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecificationClone: true,
})

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation',
    stock: 10,
    category: 'audio',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    description: 'Advanced smartwatch with health monitoring',
    stock: 5,
    category: 'wearables',
    discount: {
      type: 'percentage',
      value: 10,
      isActive: true,
    },
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    description: 'Adjustable aluminum laptop stand',
    stock: 20,
    category: 'accessories',
  },
  {
    id: 4,
    name: 'Wireless Mouse',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop',
    description: 'Ergonomic wireless mouse with precision tracking',
    stock: 15,
    category: 'accessories',
  },
  {
    id: 5,
    name: 'USB-C Hub',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop',
    description: 'Multi-port USB-C hub with 4K HDMI output',
    stock: 8,
    category: 'accessories',
    discount: {
      type: 'percentage',
      value: 10,
      isActive: true,
    },
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    description: 'Portable waterproof Bluetooth speaker',
    stock: 12,
    category: 'audio',
  },
  {
    id: 7,
    name: 'Gaming Headset',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
    description: 'Professional gaming headset with 7.1 surround sound',
    stock: 25,
    category: 'audio',
    discount: {
      type: 'fixed',
      value: 15,
      isActive: true,
    },
  },
  {
    id: 8,
    name: 'Noise Cancelling Earbuds',
    price: 249.99,
    image:
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
    description: 'Premium wireless earbuds with active noise cancellation',
    stock: 8,
    category: 'audio',
  },
  {
    id: 9,
    name: 'Studio Monitor Headphones',
    price: 179.99,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    description: 'Professional studio monitor headphones for audio production',
    stock: 6,
    category: 'audio',
  },
  {
    id: 10,
    name: 'Fitness Tracker',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    description: 'Advanced fitness tracker with heart rate monitoring',
    stock: 18,
    category: 'wearables',
  },
  {
    id: 11,
    name: 'Smart Ring',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    description: 'Sleek smart ring with health tracking and notifications',
    stock: 3,
    category: 'wearables',
    discount: {
      type: 'percentage',
      value: 20,
      isActive: true,
    },
  },
  {
    id: 12,
    name: 'VR Headset',
    price: 399.99,
    image:
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=300&fit=crop',
    description: 'Immersive VR headset for gaming and entertainment',
    stock: 4,
    category: 'wearables',
  },
  {
    id: 13,
    name: 'Mechanical Keyboard',
    price: 149.99,
    image:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    stock: 22,
    category: 'accessories',
  },
  {
    id: 14,
    name: 'Webcam 4K',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=300&fit=crop',
    description: 'Professional 4K webcam with auto-focus and noise reduction',
    stock: 9,
    category: 'accessories',
    discount: {
      type: 'percentage',
      value: 15,
      isActive: true,
    },
  },
  {
    id: 15,
    name: 'Monitor Stand',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
    description: 'Adjustable dual monitor stand with cable management',
    stock: 14,
    category: 'accessories',
  },
  {
    id: 16,
    name: 'Desk Lamp',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    description:
      'LED desk lamp with adjustable brightness and color temperature',
    stock: 16,
    category: 'accessories',
  },
  {
    id: 17,
    name: 'Tablet Stand',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    description: 'Foldable tablet stand with multiple viewing angles',
    stock: 30,
    category: 'accessories',
  },
  {
    id: 18,
    name: 'Cable Organizer',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop',
    description: 'Cable management kit with clips and ties',
    stock: 45,
    category: 'accessories',
  },
  {
    id: 19,
    name: 'Wireless Charging Pad',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    description: 'Fast wireless charging pad with LED indicator',
    stock: 20,
    category: 'accessories',
  },
  {
    id: 20,
    name: 'Gaming Mouse Pad',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
    description: 'Large RGB gaming mouse pad with smooth surface',
    stock: 28,
    category: 'accessories',
    discount: {
      type: 'fixed',
      value: 5,
      isActive: true,
    },
  },
]

const simulateDelay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200))

fastify.get(
  '/api/products',
  { schema: productSchemas.getProducts },
  async (request, reply) => {
    await simulateDelay()

    const { category, search } = request.query
    let filteredProducts = [...products]

    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      )
    }

    return {
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
    }
  },
)

fastify.get(
  '/api/products/:id',
  { schema: productSchemas.getProductById },
  async (request, reply) => {
    await simulateDelay()

    const { id } = request.params
    const product = products.find((p) => p.id === parseInt(id))

    if (!product) {
      reply.code(404)
      return {
        success: false,
        error: 'Product not found',
      }
    }

    return {
      success: true,
      data: product,
    }
  },
)

fastify.get(
  '/api/categories',
  { schema: productSchemas.getCategories },
  async (request, reply) => {
    await simulateDelay()

    const categories = [...new Set(products.map((p) => p.category))]

    return {
      success: true,
      data: categories,
    }
  },
)

fastify.get(
  '/api/price-range',
  { schema: productSchemas.getPriceRange },
  async (request, reply) => {
    await simulateDelay()

    const prices = products.map((p) => p.price)

    return {
      success: true,
      data: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
    }
  },
)

fastify.get(
  '/api/products/:id/stock',
  { schema: productSchemas.getProductStock },
  async (request, reply) => {
    await simulateDelay()

    const { id } = request.params
    const { quantity = 1 } = request.query

    const product = products.find((p) => p.id === parseInt(id))

    if (!product) {
      reply.code(404)
      return {
        success: false,
        error: 'Product not found',
      }
    }

    return {
      success: true,
      data: {
        available: product.stock >= parseInt(quantity),
        stock: product.stock,
      },
    }
  },
)

fastify.post(
  '/api/orders',
  { schema: orderSchemas.createOrder },
  async (request, reply) => {
    await simulateDelay()

    const { items, customerInfo, shippingInfo, paymentInfo, totals } =
      request.body

    // Validate required fields
    if (!items || !items.length) {
      reply.code(400)
      return {
        success: false,
        error: 'Order must contain at least one item',
      }
    }

    if (!customerInfo || !shippingInfo || !paymentInfo) {
      reply.code(400)
      return {
        success: false,
        error: 'Missing required information',
      }
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    return {
      success: true,
      data: {
        orderId,
        status: 'confirmed',
        estimatedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        items: items.length,
        total: totals?.total || 0,
      },
    }
  },
)

fastify.get(
  '/api/health',
  { schema: healthSchemas.getHealth },
  async (request, reply) => {
    return {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }
  },
)

const start = async () => {
  try {
    const port = process.env.PORT || 3001
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 API Server running on http://localhost:${port}`)
    console.log(`📚 Swagger Documentation: http://localhost:${port}/docs`)
    console.log('📊 Available endpoints:')
    console.log(
      fastify.printRoutes({
        commonPrefix: false,
      }),
    )
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

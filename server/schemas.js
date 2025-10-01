export const productSchemas = {
  getProducts: {
    description: 'Get all products with optional filtering',
    tags: ['products'],
    querystring: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by product category',
          enum: ['audio', 'wearables', 'accessories'],
        },
        search: {
          type: 'string',
          description: 'Search in product name and description',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                price: { type: 'number' },
                image: { type: 'string' },
                description: { type: 'string' },
                stock: { type: 'number' },
                category: { type: 'string' },
                discount: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    value: { type: 'number' },
                    isActive: { type: 'boolean' },
                  },
                },
              },
            },
          },
          count: { type: 'number' },
        },
      },
    },
  },

  getProductById: {
    description: 'Get a specific product by ID',
    tags: ['products'],
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Product ID',
        },
      },
      required: ['id'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              price: { type: 'number' },
              image: { type: 'string' },
              description: { type: 'string' },
              stock: { type: 'number' },
              category: { type: 'string' },
              discount: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  value: { type: 'number' },
                  isActive: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
      404: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' },
        },
      },
    },
  },

  getCategories: {
    description: 'Get all available product categories',
    tags: ['products'],
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },

  getPriceRange: {
    description: 'Get the price range of all products',
    tags: ['products'],
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              min: { type: 'number' },
              max: { type: 'number' },
            },
          },
        },
      },
    },
  },

  getProductStock: {
    description: 'Check product stock availability',
    tags: ['products'],
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Product ID',
        },
      },
      required: ['id'],
    },
    querystring: {
      type: 'object',
      properties: {
        quantity: {
          type: 'string',
          description: 'Quantity to check availability for',
          default: '1',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              available: { type: 'boolean' },
              stock: { type: 'number' },
            },
          },
        },
      },
      404: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' },
        },
      },
    },
  },
}

export const orderSchemas = {
  createOrder: {
    description: 'Create a new order',
    tags: ['orders'],
    body: {
      type: 'object',
      required: ['items', 'customerInfo', 'shippingInfo', 'paymentInfo'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'number' },
              quantity: { type: 'number' },
              price: { type: 'number' },
            },
          },
        },
        customerInfo: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        shippingInfo: {
          type: 'object',
          properties: {
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string' },
            country: { type: 'string' },
          },
        },
        paymentInfo: {
          type: 'object',
          properties: {
            method: { type: 'string' },
            cardNumber: { type: 'string' },
            expiryDate: { type: 'string' },
            cvv: { type: 'string' },
          },
        },
        totals: {
          type: 'object',
          properties: {
            subtotal: { type: 'number' },
            tax: { type: 'number' },
            shipping: { type: 'number' },
            total: { type: 'number' },
          },
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              orderId: { type: 'string' },
              status: { type: 'string' },
              estimatedDelivery: { type: 'string' },
              items: { type: 'number' },
              total: { type: 'number' },
            },
          },
        },
      },
      400: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' },
        },
      },
    },
  },
}

export const healthSchemas = {
  getHealth: {
    description: 'Health check endpoint',
    tags: ['health'],
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          status: { type: 'string' },
          timestamp: { type: 'string' },
        },
      },
    },
  },
}

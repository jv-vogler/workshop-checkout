import { Product } from '@/core/product'
import { Cart } from '@/core/cart'

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation',
    stock: 10,
    category: Product.Category.Audio,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 5.0,
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
    name: 'Black Wireless Mouse',
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    description: 'Wireless mouse with 1000 DPI sensor and 1000Hz polling rate',
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
]

export const createCartWithProducts = (): Cart.Type => {
  let cart = Cart.create()
  cart = Cart.addProduct(cart, products[0] as Product.Type)
  cart = Cart.addProduct(cart, products[0] as Product.Type)
  cart = Cart.addProduct(cart, products[1] as Product.Type)

  return cart
}

export const createCartWithLowerSubtotal = (): Cart.Type => {
  let cart = Cart.create()
  cart = Cart.addProduct(cart, products[1] as Product.Type)

  return cart
}

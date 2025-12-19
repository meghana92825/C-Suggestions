import { Product, Category, Banner, AdminSettings } from '../types';

export const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    subcategories: ['Mobile Phones', 'Laptops', 'Headphones', 'Smart Watches']
  },
  {
    id: '2',
    name: 'Fashion',
    subcategories: ["Men's Clothing", "Women's Clothing", 'Shoes', 'Accessories']
  },
  {
    id: '3',
    name: 'Home & Living',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding']
  }
];

export const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    imageUrl: '/api/placeholder/300/300',
    mrp: 9999,
    sellingPrice: 6999,
    category: 'Electronics',
    subcategory: 'Headphones',
    code: 'PROD-0001',
    affiliateUrl: 'https://example.com/headphones',
    clicks: 0
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    imageUrl: '/api/placeholder/300/300',
    mrp: 15999,
    sellingPrice: 11999,
    category: 'Electronics',
    subcategory: 'Smart Watches',
    code: 'PROD-0002',
    affiliateUrl: 'https://example.com/watch',
    clicks: 0
  },
  {
    id: '3',
    name: 'Designer Leather Jacket',
    imageUrl: '/api/placeholder/300/300',
    mrp: 8999,
    sellingPrice: 5999,
    category: 'Fashion',
    subcategory: "Men's Clothing",
    code: 'PROD-0003',
    affiliateUrl: 'https://example.com/jacket',
    clicks: 0
  }
];

export const defaultBanners: Banner[] = [
  {
    id: '1',
    imageUrl: '/api/placeholder/800/300',
    affiliateUrl: 'https://example.com/electronics-sale',
    title: 'Big Sale on Electronics',
    isActive: true
  },
  {
    id: '2',
    imageUrl: '/api/placeholder/800/300',
    affiliateUrl: 'https://example.com/fashion-sale',
    title: 'New Fashion Collection',
    isActive: true
  }
];

export const defaultAdminSettings: AdminSettings = {
  secretCode: '123456',
  sessionActive: false,
  sessionExpiry: 0
};
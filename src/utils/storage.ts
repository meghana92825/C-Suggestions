import { Product, Category, Banner, AdminSettings, Analytics } from '../types';
import { db } from '../lib/db';

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    subcategories: ['Mobile Phones', 'Laptops', 'Tablets', 'Accessories']
  },
  {
    id: '2',
    name: 'Fashion',
    subcategories: ["Men's Clothing", "Women's Clothing", 'Footwear', 'Accessories']
  },
  {
    id: '3',
    name: 'Home & Kitchen',
    subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen Tools']
  }
];

export const storage = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    return db.getProducts();
  },

  saveProducts: async (products: Product[]): Promise<void> => {
    for (const product of products) {
      if ('id' in product && product.id) {
        await db.updateProduct(product.id, product);
      }
    }
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    return db.addProduct(product);
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<boolean> => {
    return db.updateProduct(id, updates);
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    return db.deleteProduct(id);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const categories = await db.getCategories();
    return categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  },

  saveCategories: async (categories: Category[]): Promise<void> => {
    for (const category of categories) {
      if ('id' in category && category.id) {
        await db.updateCategory(category.id, category);
      }
    }
  },

  addCategory: async (category: Omit<Category, 'id'>): Promise<Category | null> => {
    return db.addCategory(category);
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<boolean> => {
    return db.updateCategory(id, updates);
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    return db.deleteCategory(id);
  },

  // Banners
  getBanners: async (): Promise<Banner[]> => {
    return db.getBanners();
  },

  saveBanners: async (banners: Banner[]): Promise<void> => {
    for (const banner of banners) {
      if ('id' in banner && banner.id) {
        await db.updateBanner(banner.id, banner);
      }
    }
  },

  addBanner: async (banner: Omit<Banner, 'id'>): Promise<Banner | null> => {
    return db.addBanner(banner);
  },

  updateBanner: async (id: string, updates: Partial<Banner>): Promise<boolean> => {
    return db.updateBanner(id, updates);
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    return db.deleteBanner(id);
  },

  // Admin Settings
  getAdminSettings: async (): Promise<AdminSettings> => {
    return db.getAdminSettings();
  },

  saveAdminSettings: async (settings: AdminSettings): Promise<void> => {
    await db.updateAdminSettings(settings);
  },

  updateAdminSettings: async (updates: Partial<AdminSettings>): Promise<boolean> => {
    return db.updateAdminSettings(updates);
  },

  // Analytics
  getAnalytics: async (): Promise<Analytics[]> => {
    return db.getAnalytics();
  },

  saveAnalytics: async (_analytics: Analytics[]): Promise<void> => {
    // Analytics are tracked individually via trackProductClick
  },

  trackProductClick: async (productId: string, productName: string): Promise<void> => {
    return db.trackProductClick(productId, productName);
  },

  // Initialize default data if needed
  initializeDefaults: async (): Promise<void> => {
    await db.initializeDefaultCategories(DEFAULT_CATEGORIES);
    await db.initializeAdminSettings({ secretCode: '123456' });
  }
};
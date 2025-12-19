import { supabase } from './supabase';
import { Product, Category, Banner, AdminSettings, Analytics } from '../types';

const transformProductFromDb = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  imageUrl: dbProduct.imageurl,
  mrp: Number(dbProduct.mrp),
  sellingPrice: Number(dbProduct.sellingprice),
  category: dbProduct.category,
  subcategory: dbProduct.subcategory,
  code: dbProduct.code,
  affiliateUrl: dbProduct.affiliateurl,
  clicks: dbProduct.clicks || 0
});

const transformProductToDb = (product: Partial<Product>) => {
  const dbProduct: any = {};
  if (product.name !== undefined) dbProduct.name = product.name;
  if (product.imageUrl !== undefined) dbProduct.imageurl = product.imageUrl;
  if (product.mrp !== undefined) dbProduct.mrp = product.mrp;
  if (product.sellingPrice !== undefined) dbProduct.sellingprice = product.sellingPrice;
  if (product.category !== undefined) dbProduct.category = product.category;
  if (product.subcategory !== undefined) dbProduct.subcategory = product.subcategory;
  if (product.code !== undefined) dbProduct.code = product.code;
  if (product.affiliateUrl !== undefined) dbProduct.affiliateurl = product.affiliateUrl;
  if (product.clicks !== undefined) dbProduct.clicks = product.clicks;
  return dbProduct;
};

const transformBannerFromDb = (dbBanner: any): Banner => ({
  id: dbBanner.id,
  imageUrl: dbBanner.imageurl,
  affiliateUrl: dbBanner.affiliateurl,
  title: dbBanner.title,
  isActive: dbBanner.isactive
});

const transformBannerToDb = (banner: Partial<Banner>) => {
  const dbBanner: any = {};
  if (banner.imageUrl !== undefined) dbBanner.imageurl = banner.imageUrl;
  if (banner.affiliateUrl !== undefined) dbBanner.affiliateurl = banner.affiliateUrl;
  if (banner.title !== undefined) dbBanner.title = banner.title;
  if (banner.isActive !== undefined) dbBanner.isactive = banner.isActive;
  return dbBanner;
};

const transformAnalyticsFromDb = (dbAnalytics: any): Analytics => ({
  productId: dbAnalytics.productid,
  productName: dbAnalytics.productname,
  clicks: dbAnalytics.clicks || 0,
  lastClicked: dbAnalytics.lastclicked
});

export const db = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformProductFromDb);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const dbProduct = transformProductToDb(product);
      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data ? transformProductFromDb(data) : null;
    } catch (error) {
      console.error('Failed to add product:', error);
      return null;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const dbUpdates = transformProductToDb(updates);
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: category.name, subcategories: category.subcategories }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add category:', error);
      return null;
    }
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.subcategories !== undefined) dbUpdates.subcategories = updates.subcategories;

      const { error } = await supabase
        .from('categories')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update category:', error);
      return false;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  },

  async getBanners(): Promise<Banner[]> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformBannerFromDb);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      return [];
    }
  },

  async addBanner(banner: Omit<Banner, 'id'>): Promise<Banner | null> {
    try {
      const dbBanner = transformBannerToDb(banner);
      const { data, error } = await supabase
        .from('banners')
        .insert([dbBanner])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data ? transformBannerFromDb(data) : null;
    } catch (error) {
      console.error('Failed to add banner:', error);
      return null;
    }
  },

  async updateBanner(id: string, updates: Partial<Banner>): Promise<boolean> {
    try {
      const dbUpdates = transformBannerToDb(updates);
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('banners')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update banner:', error);
      return false;
    }
  },

  async deleteBanner(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete banner:', error);
      return false;
    }
  },

  async getAdminSettings(): Promise<AdminSettings> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const defaultSettings: AdminSettings = { secretCode: '123456', sessionActive: false, sessionExpiry: 0 };
        await db.initializeAdminSettings(defaultSettings);
        return defaultSettings;
      }

      return {
        secretCode: data.secretcode || '123456',
        sessionActive: false,
        sessionExpiry: 0
      };
    } catch (error) {
      console.error('Failed to fetch admin settings:', error);
      return { secretCode: '123456', sessionActive: false, sessionExpiry: 0 };
    }
  },

  async initializeAdminSettings(settings: Partial<AdminSettings>): Promise<void> {
    try {
      const { count } = await supabase
        .from('admin_settings')
        .select('*', { count: 'exact' });

      if (count === 0) {
        await supabase
          .from('admin_settings')
          .insert([{ secretcode: settings.secretCode || '123456' }]);
      }
    } catch (error) {
      console.error('Failed to initialize admin settings:', error);
    }
  },

  async updateAdminSettings(updates: Partial<AdminSettings>): Promise<boolean> {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.secretCode !== undefined) {
        dbUpdates.secretcode = updates.secretCode;
      }

      const { data: existing } = await supabase
        .from('admin_settings')
        .select('id')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('admin_settings')
          .update(dbUpdates)
          .eq('id', existing.id);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update admin settings:', error);
      return false;
    }
  },

  async getAnalytics(): Promise<Analytics[]> {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('clicks', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformAnalyticsFromDb);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return [];
    }
  },

  async trackProductClick(productId: string, productName: string): Promise<void> {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('analytics')
        .select('*')
        .eq('productid', productId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const now = Date.now();

      if (existing) {
        const { error: updateError } = await supabase
          .from('analytics')
          .update({
            clicks: existing.clicks + 1,
            lastclicked: now
          })
          .eq('productid', productId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('analytics')
          .insert([{
            productid: productId,
            productname: productName,
            clicks: 1,
            lastclicked: now
          }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Failed to track product click:', error);
    }
  },

  async initializeDefaultCategories(categories: Category[]): Promise<void> {
    try {
      const { count } = await supabase
        .from('categories')
        .select('*', { count: 'exact' });

      if (count === 0) {
        await supabase
          .from('categories')
          .insert(categories.map(c => ({
            name: c.name,
            subcategories: c.subcategories
          })));
      }
    } catch (error) {
      console.error('Failed to initialize default categories:', error);
    }
  }
};

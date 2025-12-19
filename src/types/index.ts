export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  mrp: number;
  sellingPrice: number;
  category: string;
  subcategory: string;
  code: string;
  affiliateUrl: string;
  clicks: number;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export interface Banner {
  id: string;
  imageUrl: string;
  affiliateUrl: string;
  title: string;
  isActive: boolean;
}

export interface AdminSettings {
  secretCode: string;
  sessionActive: boolean;
  sessionExpiry: number;
}

export interface Analytics {
  productId: string;
  productName: string;
  clicks: number;
  lastClicked: number;
}
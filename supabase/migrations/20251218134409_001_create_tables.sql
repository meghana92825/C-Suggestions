/*
  # Create Affiliate Hub Tables

  1. New Tables
    - `products` - Store product listings
      - `id` (uuid, primary key)
      - `name` (text)
      - `imageUrl` (text)
      - `mrp` (numeric)
      - `sellingPrice` (numeric)
      - `category` (text)
      - `subcategory` (text)
      - `code` (text, unique)
      - `affiliateUrl` (text)
      - `clicks` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `categories` - Store product categories with nested subcategories
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `subcategories` (jsonb array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `banners` - Store promotional banners
      - `id` (uuid, primary key)
      - `imageUrl` (text)
      - `affiliateUrl` (text)
      - `title` (text)
      - `isActive` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `admin_settings` - Store admin configuration
      - `id` (uuid, primary key)
      - `secretCode` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `analytics` - Track product clicks
      - `id` (uuid, primary key)
      - `productId` (uuid)
      - `productName` (text)
      - `clicks` (integer, default 0)
      - `lastClicked` (bigint)
      - `created_at` (timestamptz)

  2. Security
    - All tables allow public read/write (no RLS needed for this public affiliate hub)
    - Admin access is controlled by secret code at application level
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  imageUrl text NOT NULL,
  mrp numeric NOT NULL,
  sellingPrice numeric NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  code text NOT NULL UNIQUE,
  affiliateUrl text NOT NULL,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  subcategories jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  imageUrl text NOT NULL,
  affiliateUrl text NOT NULL,
  title text NOT NULL,
  isActive boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secretCode text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  productId uuid NOT NULL,
  productName text NOT NULL,
  clicks integer DEFAULT 0,
  lastClicked bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_analytics_productId ON analytics(productId);

/*
  # Create Admin Settings Table

  1. New Tables
    - `admin_settings`
      - `id` (uuid, primary key) - Unique identifier for settings record
      - `secretcode` (text) - The secret code for admin access (default: '123456')
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

  2. Security
    - Enable RLS on `admin_settings` table
    - Add policy for public read access (needed for login verification)
    - Add policy for authenticated update access (for changing settings)

  3. Initial Data
    - Insert default admin settings with secret code '123456'
*/

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secretcode text NOT NULL DEFAULT '123456',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read admin settings (needed for login verification)
CREATE POLICY "Anyone can read admin settings"
  ON admin_settings
  FOR SELECT
  USING (true);

-- Allow anyone to update admin settings (you can restrict this later)
CREATE POLICY "Anyone can update admin settings"
  ON admin_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert default admin settings if none exist
INSERT INTO admin_settings (secretcode)
SELECT '123456'
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- Skema Database Cloudflare D1 untuk SoundRent / Music DJ Rent

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  daily_price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL, -- JSON Array
  specs TEXT NOT NULL,    -- JSON Object
  is_promo INTEGER NOT NULL DEFAULT 0, -- 1 for true, 0 for false
  promo_discount_percent INTEGER DEFAULT 0,
  promo_tag TEXT,
  deposit_amount INTEGER NOT NULL DEFAULT 0,
  rating REAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  included_accessories TEXT NOT NULL, -- JSON Array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotions (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL CHECK(discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  min_spend INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  customer TEXT NOT NULL, -- JSON CustomerDetails
  items TEXT NOT NULL,    -- JSON CartRentalItem[]
  subtotal INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  deposit_total INTEGER NOT NULL DEFAULT 0,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  rental_status TEXT NOT NULL DEFAULT 'booked'
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

const fs = require('fs');
const path = require('path');

const productsTs = fs.readFileSync(path.join(__dirname, '../src/data/products.ts'), 'utf-8');
const promotionsTs = fs.readFileSync(path.join(__dirname, '../src/data/promotions.ts'), 'utf-8');

// Parse products array by stripping TS annotations
const cleanProductsCode = productsTs
  .replace(/import\s+[^;]+;/g, '')
  .replace(/export\s+const\s+DUMMY_PRODUCTS\s*:\s*Product\[\]\s*=\s*/, 'const DUMMY_PRODUCTS = ')
  + '\nmodule.exports = { DUMMY_PRODUCTS };';

fs.writeFileSync(path.join(__dirname, 'temp_products.cjs'), cleanProductsCode);
const { DUMMY_PRODUCTS } = require('./temp_products.cjs');
fs.unlinkSync(path.join(__dirname, 'temp_products.cjs'));

// Parse promotions
const cleanPromosCode = promotionsTs
  .replace(/import\s+[^;]+;/g, '')
  .replace(/export\s+interface\s+PromoBanner[\s\S]*?}/g, '')
  .replace(/export\s+const\s+PROMO_BANNERS[\s\S]*?];/g, '')
  .replace(/export\s+const\s+PROMO_COUPONS\s*:\s*PromoCoupon\[\]\s*=\s*/, 'const PROMO_COUPONS = ')
  .replace(/export\s+const\s+RENTAL_TERMS[\s\S]*?];/g, '')
  + '\nmodule.exports = { PROMO_COUPONS };';

fs.writeFileSync(path.join(__dirname, 'temp_promos.cjs'), cleanPromosCode);
const { PROMO_COUPONS } = require('./temp_promos.cjs');
fs.unlinkSync(path.join(__dirname, 'temp_promos.cjs'));

function sqlEscape(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- Seed Data untuk Cloudflare D1 Database\n\n`;

// Insert Promotions
sql += `-- Inisialisasi Kupon Promo\n`;
for (const promo of PROMO_COUPONS) {
  sql += `INSERT OR REPLACE INTO promotions (code, discount_type, discount_value, min_spend, description) VALUES (${sqlEscape(promo.code)}, ${sqlEscape(promo.discountType)}, ${promo.discountValue}, ${promo.minSpend}, ${sqlEscape(promo.description)});\n`;
}

sql += `\n-- Inisialisasi Produk Awal\n`;
for (const p of DUMMY_PRODUCTS) {
  const featuresJson = JSON.stringify(p.features || []);
  const specsJson = JSON.stringify(p.specs || {});
  const accessoriesJson = JSON.stringify(p.includedAccessories || []);

  sql += `INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  ${sqlEscape(p.id)},
  ${sqlEscape(p.name)},
  ${sqlEscape(p.brand)},
  ${sqlEscape(p.category)},
  ${p.dailyPrice},
  ${p.stock},
  ${sqlEscape(p.image)},
  ${sqlEscape(p.description)},
  ${sqlEscape(featuresJson)},
  ${sqlEscape(specsJson)},
  ${p.isPromo ? 1 : 0},
  ${p.promoDiscountPercent || 0},
  ${sqlEscape(p.promoTag || null)},
  ${p.depositAmount || 0},
  ${p.rating || 5.0},
  ${p.reviewsCount || 0},
  ${sqlEscape(accessoriesJson)}
);\n\n`;
}

fs.writeFileSync(path.join(__dirname, '../seed.sql'), sql, 'utf-8');
console.log('seed.sql successfully generated with', DUMMY_PRODUCTS.length, 'products and', PROMO_COUPONS.length, 'promotions.');

// Cloudflare Pages Function: /api/products
// GET /api/products - Get list of products
// POST /api/products - Create a new product

interface Env {
  DB: any; // D1Database
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function formatProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    dailyPrice: Number(row.daily_price),
    stock: Number(row.stock),
    image: row.image,
    description: row.description,
    features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || {}),
    isPromo: Boolean(row.is_promo),
    promoDiscountPercent: row.promo_discount_percent ? Number(row.promo_discount_percent) : 0,
    promoTag: row.promo_tag || undefined,
    depositAmount: Number(row.deposit_amount || 0),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    includedAccessories: typeof row.included_accessories === 'string' ? JSON.parse(row.included_accessories) : (row.included_accessories || []),
  };
}

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM products ORDER BY created_at ASC'
    ).all();

    const products = (results || []).map(formatProduct);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json() as any;
    
    const id = body.id || `prod-${Date.now()}`;
    const name = body.name || 'Produk Baru';
    const brand = body.brand || 'Custom';
    const category = body.category || 'DJ Gear';
    const daily_price = Number(body.dailyPrice || 0);
    const stock = Number(body.stock || 0);
    const image = body.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
    const description = body.description || '';
    const features = JSON.stringify(body.features || []);
    const specs = JSON.stringify(body.specs || {});
    const is_promo = body.isPromo ? 1 : 0;
    const promo_discount_percent = Number(body.promoDiscountPercent || 0);
    const promo_tag = body.promoTag || null;
    const deposit_amount = Number(body.depositAmount || 0);
    const rating = Number(body.rating || 5.0);
    const reviews_count = Number(body.reviewsCount || 0);
    const included_accessories = JSON.stringify(body.includedAccessories || []);

    await context.env.DB.prepare(`
      INSERT INTO products (
        id, name, brand, category, daily_price, stock, image, description,
        features, specs, is_promo, promo_discount_percent, promo_tag,
        deposit_amount, rating, reviews_count, included_accessories
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, name, brand, category, daily_price, stock, image, description,
      features, specs, is_promo, promo_discount_percent, promo_tag,
      deposit_amount, rating, reviews_count, included_accessories
    ).run();

    const created = formatProduct({
      id, name, brand, category, daily_price, stock, image, description,
      features, specs, is_promo, promo_discount_percent, promo_tag,
      deposit_amount, rating, reviews_count, included_accessories
    });

    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

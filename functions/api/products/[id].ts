// Cloudflare Pages Function: /api/products/[id]
// GET /api/products/:id - Get product detail
// PUT /api/products/:id - Update product
// DELETE /api/products/:id - Delete product

interface Env {
  DB: any;
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

export const onRequestGet = async (context: { params: { id: string }; env: Env }) => {
  const { id } = context.params;
  try {
    const row = await context.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    if (!row) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify(formatProduct(row)), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Database query error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestPut = async (context: { params: { id: string }; request: Request; env: Env }) => {
  const { id } = context.params;
  try {
    const body = await context.request.json() as any;
    const existing = await context.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const name = body.name !== undefined ? body.name : existing.name;
    const brand = body.brand !== undefined ? body.brand : existing.brand;
    const category = body.category !== undefined ? body.category : existing.category;
    const daily_price = body.dailyPrice !== undefined ? Number(body.dailyPrice) : existing.daily_price;
    const stock = body.stock !== undefined ? Number(body.stock) : existing.stock;
    const image = body.image !== undefined ? body.image : existing.image;
    const description = body.description !== undefined ? body.description : existing.description;
    const features = body.features !== undefined ? JSON.stringify(body.features) : existing.features;
    const specs = body.specs !== undefined ? JSON.stringify(body.specs) : existing.specs;
    const is_promo = body.isPromo !== undefined ? (body.isPromo ? 1 : 0) : existing.is_promo;
    const promo_discount_percent = body.promoDiscountPercent !== undefined ? Number(body.promoDiscountPercent) : existing.promo_discount_percent;
    const promo_tag = body.promoTag !== undefined ? body.promoTag : existing.promo_tag;
    const deposit_amount = body.depositAmount !== undefined ? Number(body.depositAmount) : existing.deposit_amount;
    const rating = body.rating !== undefined ? Number(body.rating) : existing.rating;
    const reviews_count = body.reviewsCount !== undefined ? Number(body.reviewsCount) : existing.reviews_count;
    const included_accessories = body.includedAccessories !== undefined ? JSON.stringify(body.includedAccessories) : existing.included_accessories;

    await context.env.DB.prepare(`
      UPDATE products SET
        name = ?, brand = ?, category = ?, daily_price = ?, stock = ?, image = ?, description = ?,
        features = ?, specs = ?, is_promo = ?, promo_discount_percent = ?, promo_tag = ?,
        deposit_amount = ?, rating = ?, reviews_count = ?, included_accessories = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name, brand, category, daily_price, stock, image, description,
      features, specs, is_promo, promo_discount_percent, promo_tag,
      deposit_amount, rating, reviews_count, included_accessories,
      id
    ).run();

    const updated = formatProduct({
      id, name, brand, category, daily_price, stock, image, description,
      features, specs, is_promo, promo_discount_percent, promo_tag,
      deposit_amount, rating, reviews_count, included_accessories
    });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to update product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestDelete = async (context: { params: { id: string }; env: Env }) => {
  const { id } = context.params;
  try {
    const res = await context.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

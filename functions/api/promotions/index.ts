// Cloudflare Pages Function: /api/promotions
// GET /api/promotions - List promo coupons

interface Env {
  DB: any;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM promotions').all();
    const coupons = (results || []).map((row: any) => ({
      code: row.code,
      discountType: row.discount_type,
      discountValue: Number(row.discount_value),
      minSpend: Number(row.min_spend),
      description: row.description,
    }));

    return new Response(JSON.stringify(coupons), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch coupons' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json() as any;
    const code = (body.code || '').trim().toUpperCase();
    const discount_type = body.discountType || 'percentage';
    const discount_value = Number(body.discountValue || 0);
    const min_spend = Number(body.minSpend || 0);
    const description = body.description || '';

    await context.env.DB.prepare(`
      INSERT OR REPLACE INTO promotions (code, discount_type, discount_value, min_spend, description)
      VALUES (?, ?, ?, ?, ?)
    `).bind(code, discount_type, discount_value, min_spend, description).run();

    return new Response(JSON.stringify({ code, discountType: discount_type, discountValue: discount_value, minSpend: min_spend, description }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to save coupon' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

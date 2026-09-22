// Cloudflare Pages Function: /api/orders
// GET /api/orders - List customer orders
// POST /api/orders - Create a new booking order and decrease stock in D1

import { getUser, requireAdmin, json } from '../_auth';
interface Env {
  DB: any;
  AUTH_SECRET: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    if (!await requireAdmin(context.request, context.env.AUTH_SECRET)) return json({ error: 'Admin authorization required.' }, 403);
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50'
    ).all();

    const orders = (results || []).map((row: any) => ({
      id: row.id,
      createdAt: row.created_at,
      customer: typeof row.customer === 'string' ? JSON.parse(row.customer) : row.customer,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      subtotal: Number(row.subtotal),
      discountAmount: Number(row.discount_amount),
      depositTotal: Number(row.deposit_total),
      deliveryFee: Number(row.delivery_fee),
      totalAmount: Number(row.total_amount),
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      rentalStatus: row.rental_status,
    }));

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const user = await getUser(context.request, context.env.AUTH_SECRET);
    if (!user) return json({ error: 'Silakan masuk sebelum membuat pesanan.' }, 401);
    const order = await context.request.json() as any;

    const id = order.id || `SR-${Date.now().toString().slice(-6)}`;
    const createdAt = order.createdAt || new Date().toISOString();
    const customerJson = JSON.stringify({ ...(order.customer || {}), fullName: order.customer?.fullName || user.fullName, email: user.email });
    const itemsJson = JSON.stringify(order.items || []);
    const subtotal = Number(order.subtotal || 0);
    const discountAmount = Number(order.discountAmount || 0);
    const depositTotal = Number(order.depositTotal || 0);
    const deliveryFee = Number(order.deliveryFee || 0);
    const totalAmount = Number(order.totalAmount || 0);
    const paymentMethod = order.paymentMethod || 'qris';
    const paymentStatus = order.paymentStatus || 'pending';
    const rentalStatus = order.rentalStatus || 'booked';

    // Insert order into orders table
    await context.env.DB.prepare(`
      INSERT INTO orders (
        id, created_at, customer, items, subtotal, discount_amount,
        deposit_total, delivery_fee, total_amount, payment_method,
        payment_status, rental_status, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, createdAt, customerJson, itemsJson, subtotal, discountAmount,
      depositTotal, deliveryFee, totalAmount, paymentMethod,
      paymentStatus, rentalStatus, user.id
    ).run();

    // Reduce stock for each booked item in products table
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        if (item?.product?.id && item?.quantity) {
          await context.env.DB.prepare(`
            UPDATE products 
            SET stock = MAX(0, stock - ?) 
            WHERE id = ?
          `).bind(Number(item.quantity), item.product.id).run();
        }
      }
    }

    return new Response(JSON.stringify({
      id, createdAt, customer: order.customer, items: order.items,
      subtotal, discountAmount, depositTotal, deliveryFee, totalAmount,
      paymentMethod, paymentStatus, rentalStatus
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

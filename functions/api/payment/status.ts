/**
 * Cloudflare Pages Function: GET /api/payment/status
 *
 * Endpoint polling untuk frontend mengecek status pembayaran order.
 * Frontend memanggil endpoint ini setelah user menutup Snap popup.
 *
 * Query params: ?order_id=<midtrans_order_id>
 */

import { getUser, json } from '../_auth';

interface Env {
  DB: any;
  AUTH_SECRET: string;
  MIDTRANS_SERVER_KEY: string;
}

const MIDTRANS_STATUS_URL =
  'https://api.sandbox.midtrans.com/v2/{order_id}/status';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
}) => {
  try {
    const user = await getUser(context.request, context.env.AUTH_SECRET);
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(context.request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return json({ error: 'Parameter order_id diperlukan.' }, 400);
    }

    // Ambil dari D1 terlebih dahulu
    let dbStatus: string | null = null;
    try {
      const row = await context.env.DB.prepare(
        'SELECT payment_status, rental_status FROM orders WHERE id = ?'
      )
        .bind(orderId)
        .first();

      if (row) {
        dbStatus = row.payment_status;
      }
    } catch (_) {}

    // Jika sudah paid di DB, kembalikan langsung
    if (dbStatus === 'paid') {
      return new Response(
        JSON.stringify({ payment_status: 'paid', source: 'db' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Jika belum/tidak ada di DB, tanya langsung ke Midtrans
    const url = MIDTRANS_STATUS_URL.replace('{order_id}', orderId);
    const authString = btoa(`${context.env.MIDTRANS_SERVER_KEY}:`);
    const mtRes = await fetch(url, {
      headers: {
        Authorization: `Basic ${authString}`,
        Accept: 'application/json',
      },
    });

    const mtData = await mtRes.json() as any;
    const txStatus = mtData.transaction_status;
    const fraudStatus = mtData.fraud_status;

    let paymentStatus = 'pending';
    if (txStatus === 'capture' && fraudStatus === 'accept') paymentStatus = 'paid';
    else if (txStatus === 'settlement') paymentStatus = 'paid';
    else if (['cancel', 'deny', 'expire'].includes(txStatus)) paymentStatus = 'cancelled';

    return new Response(
      JSON.stringify({
        payment_status: paymentStatus,
        transaction_status: txStatus,
        payment_type: mtData.payment_type,
        source: 'midtrans',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err: any) {
    return json({ error: err.message || 'Internal server error' }, 500);
  }
};

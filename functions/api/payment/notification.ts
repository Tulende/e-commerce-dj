/**
 * Cloudflare Pages Function: POST /api/payment/notification
 *
 * Webhook handler untuk notifikasi pembayaran dari Midtrans.
 * Midtrans akan POST ke endpoint ini setiap kali status pembayaran berubah.
 *
 * Proses:
 * 1. Verifikasi signature_key dari Midtrans untuk keamanan
 * 2. Update status order di Cloudflare D1
 * 3. Kurangi stok produk jika pembayaran berhasil (settlement / capture)
 *
 * Environment variables yang dibutuhkan:
 *   MIDTRANS_SERVER_KEY  – Server Key dari Midtrans Dashboard (sandbox)
 */

interface Env {
  DB: any;
  MIDTRANS_SERVER_KEY: string;
}

const MIDTRANS_STATUS_URL =
  'https://api.sandbox.midtrans.com/v2/{order_id}/status';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/** Hitung SHA-512 signature untuk verifikasi notifikasi Midtrans */
async function sha512(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Ambil status terkini dari Midtrans Status API (double-check keamanan) */
async function fetchMidtransStatus(orderId: string, serverKey: string) {
  const url = MIDTRANS_STATUS_URL.replace('{order_id}', orderId);
  const authString = btoa(`${serverKey}:`);
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${authString}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) return null;
  return res.json() as Promise<any>;
}

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}) => {
  try {
    const notification = await context.request.json() as any;

    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      fraud_status,
      payment_type,
      signature_key: receivedSignature,
    } = notification;

    if (!order_id || !status_code || !gross_amount) {
      return new Response(JSON.stringify({ error: 'Invalid notification payload.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ── VERIFIKASI SIGNATURE ──────────────────────────────────────────────────
    // Formula Midtrans: SHA512(order_id + status_code + gross_amount + server_key)
    const expectedSignature = await sha512(
      `${order_id}${status_code}${gross_amount}${context.env.MIDTRANS_SERVER_KEY}`
    );

    if (receivedSignature && receivedSignature !== expectedSignature) {
      console.warn('[Midtrans Webhook] Signature mismatch! Possible forgery.');
      return new Response(JSON.stringify({ error: 'Invalid signature.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ── DOUBLE-CHECK via Midtrans Status API ──────────────────────────────────
    const verified = await fetchMidtransStatus(order_id, context.env.MIDTRANS_SERVER_KEY);
    if (!verified || verified.order_id !== order_id) {
      return new Response(JSON.stringify({ error: 'Could not verify transaction with Midtrans.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ── TENTUKAN STATUS PEMBAYARAN ────────────────────────────────────────────
    let paymentStatus: 'pending' | 'paid' | 'cancelled' = 'pending';
    let rentalStatus: 'booked' | 'active' | 'returned' = 'booked';

    const txStatus = verified.transaction_status || transaction_status;
    const fraud = verified.fraud_status || fraud_status;

    if (txStatus === 'capture') {
      // Kartu kredit: capture + tidak fraud = bayar
      paymentStatus = fraud === 'accept' ? 'paid' : 'pending';
    } else if (txStatus === 'settlement') {
      // Transfer/VA/QRIS: settlement = bayar dikonfirmasi
      paymentStatus = 'paid';
    } else if (
      txStatus === 'cancel' ||
      txStatus === 'deny' ||
      txStatus === 'expire'
    ) {
      paymentStatus = 'cancelled';
    } else if (txStatus === 'pending') {
      paymentStatus = 'pending';
    }

    if (paymentStatus === 'paid') {
      rentalStatus = 'active';
    }

    // ── UPDATE DATABASE D1 ────────────────────────────────────────────────────
    try {
      // Update payment status di tabel orders
      await context.env.DB.prepare(`
        UPDATE orders 
        SET payment_status = ?, rental_status = ?, payment_method = ?
        WHERE id = ?
      `)
        .bind(paymentStatus, rentalStatus, payment_type || 'qris', order_id)
        .run();

      // Jika pembayaran berhasil, kurangi stok produk
      if (paymentStatus === 'paid') {
        // Ambil data order untuk mendapatkan items
        const orderRow = await context.env.DB.prepare(
          'SELECT items FROM orders WHERE id = ?'
        )
          .bind(order_id)
          .first();

        if (orderRow?.items) {
          const items =
            typeof orderRow.items === 'string'
              ? JSON.parse(orderRow.items)
              : orderRow.items;

          for (const item of items) {
            if (item?.product?.id && item?.quantity) {
              await context.env.DB.prepare(`
                UPDATE products 
                SET stock = MAX(0, stock - ?)
                WHERE id = ?
              `)
                .bind(Number(item.quantity), item.product.id)
                .run();
            }
          }
        }
      }
    } catch (dbErr: any) {
      console.error('[DB] Failed to update order after payment:', dbErr.message);
      // Tetap kembalikan 200 ke Midtrans agar tidak retry terus
    }

    console.log(
      `[Midtrans Webhook] order_id=${order_id} | tx_status=${txStatus} | payment_status=${paymentStatus}`
    );

    return new Response(
      JSON.stringify({ status: 'OK', order_id, payment_status: paymentStatus }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (err: any) {
    console.error('[payment/notification] Unhandled error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

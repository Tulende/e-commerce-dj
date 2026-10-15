/**
 * Cloudflare Pages Function: POST /api/payment/token
 *
 * Menerima data order dari frontend → memanggil Midtrans Snap API (server-side)
 * untuk membuat transaksi → mengembalikan snap_token ke frontend.
 *
 * Environment variables yang dibutuhkan (set di Cloudflare Dashboard > Secrets):
 *   MIDTRANS_SERVER_KEY  – Server Key dari Midtrans Dashboard (sandbox)
 */

import { getUser, json } from '../_auth';

interface Env {
  DB: any;
  AUTH_SECRET: string;
  MIDTRANS_SERVER_KEY: string;
}

const MIDTRANS_SNAP_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}) => {
  try {
    // Auth: hanya user yang login yang bisa membuat transaksi
    const user = await getUser(context.request, context.env.AUTH_SECRET);
    if (!user) {
      return json({ error: 'Silakan masuk terlebih dahulu untuk melanjutkan pembayaran.' }, 401);
    }

    if (!context.env.MIDTRANS_SERVER_KEY) {
      return json({ error: 'Konfigurasi payment gateway belum lengkap di server.' }, 500);
    }

    const body = await context.request.json() as any;
    const { order } = body;

    if (!order || !order.id) {
      return json({ error: 'Data order tidak valid.' }, 400);
    }

    // Buat nomor order unik (order_id harus unik di Midtrans)
    const orderId = `${order.id}-${Date.now()}`;

    // Susun item_details dari keranjang sewa
    const itemDetails: any[] = [];

    // Tambahkan setiap item rental
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        const effectivePrice =
          item.product.isPromo && item.product.promoDiscountPercent
            ? Math.round(
                item.product.dailyPrice *
                  (1 - item.product.promoDiscountPercent / 100)
              )
            : item.product.dailyPrice;

        itemDetails.push({
          id: item.product.id,
          name: `Sewa ${item.product.name} (${item.rentalDays} hari)`.slice(0, 50),
          price: effectivePrice * item.rentalDays,
          quantity: item.quantity,
          brand: item.product.brand,
          category: item.product.category,
        });
      }
    }

    // Tambahkan deposit jaminan sebagai item terpisah
    if (order.depositTotal > 0) {
      itemDetails.push({
        id: 'DEPOSIT',
        name: 'Uang Jaminan Sewa (Refundable)',
        price: order.depositTotal,
        quantity: 1,
      });
    }

    // Tambahkan ongkos kirim
    if (order.deliveryFee > 0) {
      itemDetails.push({
        id: 'DELIVERY',
        name: 'Biaya Pengiriman & Handling',
        price: order.deliveryFee,
        quantity: 1,
      });
    }

    // Kurangi diskon (Midtrans tidak punya discount field di Snap, 
    // tambahkan sebagai item negatif)
    if (order.discountAmount > 0) {
      itemDetails.push({
        id: 'DISCOUNT',
        name: 'Diskon Voucher Promo',
        price: -order.discountAmount,
        quantity: 1,
      });
    }

    // Gross amount harus sama persis dengan total amount
    const grossAmount = order.totalAmount;

    // Payload ke Midtrans Snap
    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: order.customer?.fullName?.split(' ')[0] || user.fullName,
        last_name: order.customer?.fullName?.split(' ').slice(1).join(' ') || '',
        email: order.customer?.email || user.email,
        phone: order.customer?.phone || '',
        billing_address: {
          first_name: order.customer?.fullName || user.fullName,
          email: order.customer?.email || user.email,
          phone: order.customer?.phone || '',
          address: order.customer?.address || '',
          city: order.customer?.eventCity || '',
          country_code: 'IDN',
        },
        shipping_address: {
          first_name: order.customer?.fullName || user.fullName,
          email: order.customer?.email || user.email,
          phone: order.customer?.phone || '',
          address: order.customer?.address || '',
          city: order.customer?.eventCity || '',
          country_code: 'IDN',
        },
      },
      // Aktifkan metode pembayaran yang didukung
      enabled_payments: [
        'credit_card',
        'cimb_clicks',
        'bca_klikbca',
        'bca_klikpay',
        'bri_epay',
        'echannel',        // Mandiri Bill
        'permata_va',
        'bca_va',
        'bni_va',
        'bri_va',
        'other_va',
        'gopay',
        'shopeepay',
        'indomaret',
        'alfamart',
        'akulaku',
        'qris',
      ],
      credit_card: {
        secure: true,
      },
      // Expiry 15 menit
      expiry: {
        unit: 'minute',
        duration: 15,
      },
      // Callback URLs (untuk production, ganti dengan domain Cloudflare Pages Anda)
      callbacks: {
        finish: `${new URL(context.request.url).origin}/payment/finish`,
        error: `${new URL(context.request.url).origin}/payment/error`,
        pending: `${new URL(context.request.url).origin}/payment/pending`,
      },
      custom_field1: order.id,            // SR order ID asli
      custom_field2: user.id,             // user ID
      custom_field3: JSON.stringify(order.items?.map((i: any) => i.product.id) || []),
    };

    // Buat Basic Auth header: base64(serverKey + ":")
    const authString = btoa(`${context.env.MIDTRANS_SERVER_KEY}:`);

    // Panggil Midtrans Snap API
    const midtransRes = await fetch(MIDTRANS_SNAP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(snapPayload),
    });

    const midtransData = await midtransRes.json() as any;

    if (!midtransRes.ok || !midtransData.token) {
      console.error('[Midtrans] Error creating transaction:', JSON.stringify(midtransData));
      return json(
        {
          error: midtransData.error_messages?.join(', ') || 'Gagal membuat transaksi pembayaran.',
          midtrans_error: midtransData,
        },
        midtransRes.status
      );
    }

    // Simpan order ke D1 dengan status pending (sebelum pembayaran dilakukan)
    try {
      const customerJson = JSON.stringify(order.customer || {});
      const itemsJson = JSON.stringify(order.items || []);
      await context.env.DB.prepare(`
        INSERT OR REPLACE INTO orders (
          id, created_at, customer, items, subtotal, discount_amount,
          deposit_total, delivery_fee, total_amount, payment_method,
          payment_status, rental_status, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'booked', ?)
      `)
        .bind(
          orderId,
          new Date().toISOString(),
          customerJson,
          itemsJson,
          Number(order.subtotal || 0),
          Number(order.discountAmount || 0),
          Number(order.depositTotal || 0),
          Number(order.deliveryFee || 0),
          Number(grossAmount),
          order.paymentMethod || 'qris',
          user.id
        )
        .run();
    } catch (dbErr: any) {
      // Jika DB tidak tersambung, tetap kembalikan token Midtrans
      console.warn('[DB] Failed to pre-save order:', dbErr.message);
    }

    return new Response(
      JSON.stringify({
        token: midtransData.token,
        redirect_url: midtransData.redirect_url,
        order_id: orderId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (err: any) {
    console.error('[payment/token] Unhandled error:', err);
    return json({ error: err.message || 'Internal server error' }, 500);
  }
};

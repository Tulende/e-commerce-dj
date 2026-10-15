/**
 * midtransService.ts
 *
 * Frontend service untuk integrasi Midtrans Snap.
 * Mengelola: pembuatan token, pemuatan Snap.js, dan polling status pembayaran.
 *
 * VITE_MIDTRANS_CLIENT_KEY harus diset di .env.local / Cloudflare Pages environment variables.
 */

import { BookingOrder } from '../types';

const API_BASE = '/api/payment';

// Client Key Midtrans (sandbox) - aman untuk diexpose ke frontend
const MIDTRANS_CLIENT_KEY =
  (import.meta as any).env?.VITE_MIDTRANS_CLIENT_KEY || '';

const MIDTRANS_SNAP_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';

/** Load Snap.js Midtrans (inject script sekali saja) */
function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Cek apakah sudah diload
    if (typeof (window as any).snap !== 'undefined') {
      resolve();
      return;
    }

    const existingScript = document.getElementById('midtrans-snap-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Midtrans Snap.js gagal dimuat.'))
      );
      return;
    }

    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.src = MIDTRANS_SNAP_URL;
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Midtrans Snap.js gagal dimuat. Periksa koneksi internet.'));
    document.head.appendChild(script);
  });
}

/** Minta snap_token dari backend Cloudflare Function */
async function createSnapToken(
  order: BookingOrder
): Promise<{ token: string; order_id: string; redirect_url: string }> {
  const authToken = localStorage.getItem('soundrent_token');
  const res = await fetch(`${API_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ order }),
  });

  if (!res.ok) {
    const err = await res.json() as any;
    throw new Error(err.error || `HTTP error ${res.status}`);
  }

  return res.json() as any;
}

/** Polling status pembayaran dari backend */
async function pollPaymentStatus(
  orderId: string,
  maxAttempts = 20,
  intervalMs = 3000
): Promise<string> {
  const authToken = localStorage.getItem('soundrent_token');

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));

    try {
      const res = await fetch(
        `${API_BASE}/status?order_id=${encodeURIComponent(orderId)}`,
        {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        }
      );
      if (!res.ok) continue;

      const data = await res.json() as any;
      if (data.payment_status === 'paid' || data.payment_status === 'cancelled') {
        return data.payment_status;
      }
    } catch (_) {
      // lanjutkan polling jika error sementara
    }
  }

  return 'pending'; // timeout
}

export interface SnapPaymentResult {
  status: 'success' | 'pending' | 'error' | 'cancelled';
  order_id?: string;
  message?: string;
}

/**
 * Fungsi utama: buka Midtrans Snap popup dan tunggu hasilnya.
 *
 * @param order  - BookingOrder yang sudah dibuat di processBooking()
 * @param onSuccess  - dipanggil jika pembayaran settlement/capture berhasil
 * @param onPending  - dipanggil jika pembayaran masih pending (VA belum dibayar, dll.)
 * @param onError    - dipanggil jika ada error atau pembayaran gagal
 */
export async function openMidtransSnap(
  order: BookingOrder,
  callbacks: {
    onSuccess: (result: SnapPaymentResult) => void;
    onPending: (result: SnapPaymentResult) => void;
    onError: (result: SnapPaymentResult) => void;
    onClose?: () => void;
  }
): Promise<void> {
  try {
    // 1. Load Snap.js jika belum ada
    await loadSnapScript();

    // 2. Minta token dari backend
    const { token, order_id } = await createSnapToken(order);

    // 3. Buka Snap popup
    const snap = (window as any).snap;
    if (!snap) {
      throw new Error('Midtrans Snap tidak tersedia. Periksa koneksi internet.');
    }

    snap.pay(token, {
      onSuccess: async (result: any) => {
        console.log('[Midtrans] onSuccess:', result);
        // Snap melaporkan sukses - konfirmasi ke backend (atau terima webhook)
        callbacks.onSuccess({
          status: 'success',
          order_id: result.order_id || order_id,
          message: 'Pembayaran berhasil dikonfirmasi!',
        });
      },

      onPending: async (result: any) => {
        console.log('[Midtrans] onPending:', result);
        // Tagihan dibuat tapi belum dibayar (VA, Indomaret, dll.)
        callbacks.onPending({
          status: 'pending',
          order_id: result.order_id || order_id,
          message:
            'Pembayaran sedang diproses. Selesaikan pembayaran sesuai instruksi yang diberikan.',
        });
      },

      onError: (result: any) => {
        console.error('[Midtrans] onError:', result);
        callbacks.onError({
          status: 'error',
          order_id: result.order_id || order_id,
          message: result.status_message || 'Pembayaran gagal. Silakan coba lagi.',
        });
      },

      onClose: async () => {
        console.log('[Midtrans] Popup ditutup oleh user');
        // User menutup popup - polling status untuk memastikan
        if (callbacks.onClose) callbacks.onClose();

        // Lakukan polling cepat untuk cek apakah sudah dibayar
        try {
          const finalStatus = await pollPaymentStatus(order_id, 5, 1500);
          if (finalStatus === 'paid') {
            callbacks.onSuccess({
              status: 'success',
              order_id,
              message: 'Pembayaran berhasil dikonfirmasi!',
            });
          }
          // Jika masih pending/cancelled setelah ditutup, biarkan user memutuskan
        } catch (_) {}
      },
    });
  } catch (err: any) {
    console.error('[Midtrans] openMidtransSnap error:', err);
    callbacks.onError({
      status: 'error',
      message: err.message || 'Gagal memuat payment gateway. Silakan coba lagi.',
    });
  }
}

/** Polling aktif untuk menunggu konfirmasi webhook (dipakai di PostPurchaseModal) */
export { pollPaymentStatus };

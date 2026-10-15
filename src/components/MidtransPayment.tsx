/**
 * MidtransPayment.tsx
 *
 * Komponen yang menangani alur pembayaran Midtrans Snap secara nyata.
 * Menggantikan PaymentSimulator.tsx yang hanya simulasi.
 *
 * Alur:
 * 1. Muncul setelah processBooking() dipanggil dari CheckoutModal
 * 2. Tombol "Bayar Sekarang" → membuka Midtrans Snap popup
 * 3. Jika pembayaran sukses → konfirmasi lokal & update D1 (via webhook)
 * 4. Tampilkan konfirmasi booking
 */

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatters';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  X,
  AlertTriangle,
  Loader2,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { openMidtransSnap } from '../services/midtransService';

type PaymentPhase =
  | 'ready'       // Siap bayar
  | 'loading'     // Memuat token Midtrans
  | 'waiting'     // Popup Snap terbuka (user di dalam Snap)
  | 'pending'     // Tagihan dibuat, belum dibayar (VA/Indomaret)
  | 'success'     // Pembayaran berhasil
  | 'error';      // Ada kesalahan

export const MidtransPayment: React.FC = () => {
  const {
    activeBooking,
    isPaymentSimulatorOpen,
    setIsPaymentSimulatorOpen,
    confirmPaymentSuccess,
  } = useCart();

  const [phase, setPhase] = useState<PaymentPhase>('ready');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Reset state setiap kali modal dibuka dengan order baru
  useEffect(() => {
    if (isPaymentSimulatorOpen && activeBooking) {
      setPhase('ready');
      setErrorMsg(null);
      setPendingOrderId(null);
      setTimeLeft(15 * 60); // 15 menit
    }
  }, [isPaymentSimulatorOpen, activeBooking?.id]);

  // Countdown untuk fase pending
  useEffect(() => {
    if (phase !== 'pending' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  if (!isPaymentSimulatorOpen || !activeBooking) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const fireConfetti = () => {
    try {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      setTimeout(
        () =>
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          }),
        250
      );
      setTimeout(
        () =>
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          }),
        400
      );
    } catch (_) {}
  };

  /** Klik tombol "Bayar Sekarang" → buka Snap popup */
  const handleOpenSnap = async () => {
    setPhase('loading');
    setErrorMsg(null);

    await openMidtransSnap(activeBooking, {
      onSuccess: (result) => {
        setPhase('success');
        confirmPaymentSuccess();
        setPendingOrderId(result.order_id || null);
        fireConfetti();
      },
      onPending: (result) => {
        setPhase('pending');
        setPendingOrderId(result.order_id || null);
        setTimeLeft(15 * 60);
      },
      onError: (result) => {
        setPhase('error');
        setErrorMsg(
          result.message || 'Pembayaran gagal. Silakan coba lagi atau pilih metode lain.'
        );
      },
      onClose: () => {
        // Jika masih di fase loading/waiting dan popup ditutup tanpa aksi
        setPhase((prev) =>
          prev === 'loading' || prev === 'waiting' ? 'ready' : prev
        );
      },
    });

    // Setelah await selesai (popup terbuka), ubah phase ke waiting
    setPhase((prev) => (prev === 'loading' ? 'waiting' : prev));
  };

  const handleClose = () => {
    setIsPaymentSimulatorOpen(false);
    setPhase('ready');
    setErrorMsg(null);
    setPendingOrderId(null);
  };

  const handleRetry = () => {
    setPhase('ready');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#131B2E] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F19]">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                phase === 'success'
                  ? 'bg-emerald-400'
                  : phase === 'error'
                  ? 'bg-red-400'
                  : phase === 'pending'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-blue-400 animate-pulse'
              }`}
            />
            <h3 className="text-sm font-bold text-white font-['Outfit']">
              {phase === 'success'
                ? 'Pembayaran Berhasil Dikonfirmasi ✓'
                : phase === 'pending'
                ? 'Menunggu Konfirmasi Pembayaran...'
                : phase === 'error'
                ? 'Pembayaran Gagal'
                : 'Midtrans Payment Gateway'}
            </h3>
          </div>
          {phase !== 'loading' && phase !== 'waiting' && (
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* ── SUCCESS ────────────────────────────────────────── */}
          {phase === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white font-['Outfit']">
                  Pemesanan Sewa Berhasil!
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Nomor Booking:{' '}
                  <span className="font-mono font-bold text-cyan-300">
                    {activeBooking.id}
                  </span>
                </p>
                {pendingOrderId && pendingOrderId !== activeBooking.id && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Midtrans Order:{' '}
                    <span className="font-mono text-slate-300">{pendingOrderId}</span>
                  </p>
                )}
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Status: Pembayaran Dikonfirmasi Midtrans ✓
                </p>
              </div>

              {/* Ringkasan Booking */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Penyewa:</span>
                  <span className="font-bold text-white">
                    {activeBooking.customer.fullName} ({activeBooking.customer.phone})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Lokasi Acara:</span>
                  <span className="text-slate-200 text-right max-w-xs">
                    {activeBooking.customer.address}, {activeBooking.customer.eventCity}
                  </span>
                </div>
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-slate-400 block mb-1">Daftar Alat Disewa:</span>
                  <ul className="space-y-1">
                    {activeBooking.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-slate-300">
                        <span>
                          {item.quantity}x {item.product.name} ({item.rentalDays} hari)
                        </span>
                        <span className="font-mono">{formatRupiah(item.itemSubtotal)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {activeBooking.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Diskon Voucher:</span>
                    <span className="font-mono">- {formatRupiah(activeBooking.discountAmount)}</span>
                  </div>
                )}
                {activeBooking.depositTotal > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Jaminan Deposit (refundable):</span>
                    <span className="font-mono text-slate-200">
                      {formatRupiah(activeBooking.depositTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-1">
                  <span>Total Dibayar:</span>
                  <span className="text-fuchsia-400 font-['Outfit']">
                    {formatRupiah(activeBooking.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-800/60 text-xs text-cyan-300 text-left">
                <p className="font-semibold">Informasi Pengambilan / Pengantaran:</p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Tim logistik kami akan menghubungi WhatsApp Anda di nomor{' '}
                  <strong>{activeBooking.customer.phone}</strong> untuk konfirmasi jam
                  serah terima dan pemeriksaan fisik alat musik/DJ.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Cetak Nota Sewa</span>
                </button>
                <button
                  onClick={handleClose}
                  className="py-2.5 px-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold"
                >
                  Selesai & Kembali
                </button>
              </div>
            </div>
          )}

          {/* ── PENDING ────────────────────────────────────────── */}
          {phase === 'pending' && (
            <div className="space-y-5">
              <div className="text-center p-4 rounded-2xl bg-amber-950/30 border border-amber-700/50">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-black text-white font-['Outfit']">
                  Menunggu Konfirmasi Pembayaran
                </h2>
                <p className="text-xs text-amber-300 mt-1">
                  Selesaikan pembayaran sebelum waktu habis
                </p>
                <div className="text-3xl font-mono font-bold text-amber-400 mt-2">
                  {timeFormatted}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-bold text-white">Instruksi Pembayaran:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Buka m-Banking atau dompet digital Anda</li>
                  <li>Bayar sesuai nominal yang tertera di instruksi Midtrans</li>
                  <li>Konfirmasi akan otomatis muncul setelah pembayaran terverifikasi</li>
                </ul>
              </div>

              {pendingOrderId && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs">
                  <span className="text-slate-400">Order ID Midtrans: </span>
                  <span className="font-mono text-cyan-300">{pendingOrderId}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-black text-white flex justify-between">
                <span>Total Tagihan:</span>
                <span className="text-fuchsia-400 font-['Outfit']">
                  {formatRupiah(activeBooking.totalAmount)}
                </span>
              </div>

              <p className="text-xs text-center text-slate-500">
                Notifikasi konfirmasi juga akan dikirim ke email{' '}
                <strong className="text-slate-300">{activeBooking.customer.email}</strong>
              </p>
            </div>
          )}

          {/* ── ERROR ──────────────────────────────────────────── */}
          {phase === 'error' && (
            <div className="space-y-5">
              <div className="text-center p-4 rounded-2xl bg-red-950/30 border border-red-700/50">
                <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-black text-white font-['Outfit']">
                  Pembayaran Gagal
                </h2>
                <p className="text-xs text-red-300 mt-2">
                  {errorMsg}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleClose}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold"
                >
                  Tutup
                </button>
                <button
                  onClick={handleRetry}
                  className="py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-bold"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* ── READY / LOADING / WAITING ─────────────────────── */}
          {(phase === 'ready' || phase === 'loading' || phase === 'waiting') && (
            <div className="space-y-5">
              {/* Ringkasan tagihan */}
              <div className="text-center p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">
                  Total Tagihan Booking Sewa:
                </span>
                <div className="text-3xl font-black text-white font-['Outfit']">
                  {formatRupiah(activeBooking.totalAmount)}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Booking: {activeBooking.id} ·{' '}
                  {activeBooking.items.length} alat ·{' '}
                  {activeBooking.customer.eventCity}
                </div>
              </div>

              {/* Rincian */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800 text-xs">
                <div className="flex justify-between px-4 py-2.5 text-slate-400">
                  <span>Subtotal Sewa</span>
                  <span className="text-slate-200">{formatRupiah(activeBooking.subtotal)}</span>
                </div>
                {activeBooking.discountAmount > 0 && (
                  <div className="flex justify-between px-4 py-2.5 text-emerald-400">
                    <span>Diskon Voucher</span>
                    <span>- {formatRupiah(activeBooking.discountAmount)}</span>
                  </div>
                )}
                {activeBooking.depositTotal > 0 && (
                  <div className="flex justify-between px-4 py-2.5 text-slate-400">
                    <span>Jaminan Deposit (refundable)</span>
                    <span className="text-slate-200">{formatRupiah(activeBooking.depositTotal)}</span>
                  </div>
                )}
                {activeBooking.deliveryFee > 0 && (
                  <div className="flex justify-between px-4 py-2.5 text-slate-400">
                    <span>Ongkos Kirim</span>
                    <span className="text-slate-200">{formatRupiah(activeBooking.deliveryFee)}</span>
                  </div>
                )}
              </div>

              {/* Info metode pembayaran */}
              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                  <CreditCard className="w-4 h-4" />
                  <span>Didukung oleh Midtrans Payment Gateway</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  QRIS (GoPay, OVO, ShopeePay, DANA), Virtual Account (BCA, Mandiri, BNI, BRI),
                  Kartu Kredit/Debit, Gopay, Alfamart, Indomaret, dan lainnya.
                </p>
              </div>

              {/* Tombol bayar */}
              <div className="p-3.5 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-800/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-300">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Mode Sandbox Midtrans — Data Transaksi Uji Coba</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Klik tombol di bawah untuk membuka jendela pembayaran resmi Midtrans Snap.
                  Gunakan{' '}
                  <a
                    href="https://docs.midtrans.com/docs/testing-payment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    kartu/nomor uji Midtrans
                  </a>{' '}
                  untuk simulasi sandbox.
                </p>

                <button
                  onClick={handleOpenSnap}
                  disabled={phase === 'loading' || phase === 'waiting'}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-fuchsia-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  {phase === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memuat Payment Gateway...</span>
                    </>
                  ) : phase === 'waiting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menunggu Pembayaran di Popup Midtrans...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Bayar Sekarang via Midtrans Snap</span>
                    </>
                  )}
                </button>
              </div>

              {/* Logo / powered by */}
              <p className="text-center text-[10px] text-slate-600">
                🔒 Pembayaran diamankan oleh Midtrans (Sandbox) · SSL/TLS Encrypted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

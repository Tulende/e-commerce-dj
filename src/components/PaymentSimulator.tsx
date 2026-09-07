import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatters';
import { CheckCircle2, Copy, Check, Clock, Sparkles, Download, X, QrCode, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentSimulator: React.FC = () => {
  const {
    activeBooking,
    isPaymentSimulatorOpen,
    setIsPaymentSimulatorOpen,
    confirmPaymentSuccess,
  } = useCart();

  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [copiedText, setCopiedText] = useState(false);
  const [isProcessingSimulation, setIsProcessingSimulation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isPaymentSimulatorOpen || isCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaymentSimulatorOpen, isCompleted]);

  if (!isPaymentSimulatorOpen || !activeBooking) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const virtualAccountNumber = activeBooking.paymentMethod === 'bca_va'
    ? `827708${activeBooking.customer.phone.replace(/^0/, '')}`
    : activeBooking.paymentMethod === 'mandiri_va'
    ? `889081${activeBooking.customer.phone.replace(/^0/, '')}`
    : `125008${activeBooking.customer.phone.replace(/^0/, '')}`;

  const handleCopyVA = () => {
    navigator.clipboard.writeText(virtualAccountNumber);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleSimulatePayment = () => {
    setIsProcessingSimulation(true);
    setTimeout(() => {
      setIsProcessingSimulation(false);
      setIsCompleted(true);
      confirmPaymentSuccess();

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback silently if confetti encounters environment issue
      }
    }, 1500);
  };

  const handleClose = () => {
    setIsPaymentSimulatorOpen(false);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#131B2E] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F19]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-sm font-bold text-white font-['Outfit']">
              {isCompleted ? 'Pembayaran Berhasil Dikonfirmasi' : 'Payment Gateway Online'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isCompleted ? (
            /* Payment Success Screen */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white font-['Outfit']">
                  Pemesanan Sewa Berhasil!
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Nomor Booking: <span className="font-mono font-bold text-cyan-300">{activeBooking.id}</span>
                </p>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Status: Pembayaran Lunas & Stok Telah Dikurangi
                </p>
              </div>

              {/* Order Detail Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Penyewa:</span>
                  <span className="font-bold text-white">{activeBooking.customer.fullName} ({activeBooking.customer.phone})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Alamat Acara:</span>
                  <span className="text-slate-200 text-right max-w-xs">{activeBooking.customer.address}, {activeBooking.customer.eventCity}</span>
                </div>
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-slate-400 block mb-1">Daftar Alat Disewa:</span>
                  <ul className="space-y-1">
                    {activeBooking.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-slate-300">
                        <span>{item.quantity}x {item.product.name} ({item.rentalDays} hari)</span>
                        <span className="font-mono">{formatRupiah(item.itemSubtotal)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Jaminan Deposit:</span>
                  <span className="font-mono text-slate-200">{formatRupiah(activeBooking.depositTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-1">
                  <span>Total Pembayaran Lunas:</span>
                  <span className="text-fuchsia-400 font-['Outfit']">{formatRupiah(activeBooking.totalAmount)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-800/60 text-xs text-cyan-300 text-left">
                <p className="font-semibold">Informasi Pengambilan / Pengantaran:</p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Tim logistik kami akan menghubungi WhatsApp Anda di nomor <strong>{activeBooking.customer.phone}</strong> untuk konfirmasi jam serah terima dan pemeriksaan uji fisik alat musik/DJ.
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
          ) : (
            /* Active Payment Gateway Screen */
            <div className="space-y-5">
              {/* Amount and Timer */}
              <div className="text-center p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Tagihan Booking Sewa:</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                  {formatRupiah(activeBooking.totalAmount)}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Selesaikan dalam {timeFormatted}</span>
                </div>
              </div>

              {/* QRIS View */}
              {activeBooking.paymentMethod === 'qris' && (
                <div className="flex flex-col items-center p-5 rounded-2xl bg-white text-slate-950 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between w-full border-b pb-2">
                    <span className="font-extrabold text-sm tracking-wider">QRIS STANDAR NASIONAL</span>
                    <span className="text-xs font-bold text-slate-600 font-mono">{activeBooking.id}</span>
                  </div>

                  {/* QRIS Graphic Mockup */}
                  <div className="p-3 bg-white border-2 border-slate-900 rounded-xl">
                    <div className="relative w-44 h-44 bg-slate-950 rounded-lg p-2 flex flex-col items-center justify-center text-white">
                      <QrCode className="w-32 h-32 text-white" />
                      <span className="text-[10px] font-mono tracking-widest text-cyan-400 mt-1">SCAN UNTUK BAYAR</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 text-center max-w-xs font-medium">
                    Buka aplikasi e-wallet atau m-Banking Anda (BCA, GoPay, OVO, ShopeePay, Dana, LinkAja), lalu scan kode QR di atas.
                  </p>
                </div>
              )}

              {/* Virtual Account View */}
              {(activeBooking.paymentMethod === 'bca_va' || activeBooking.paymentMethod === 'mandiri_va' || activeBooking.paymentMethod === 'bri_va') && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      Nomor Virtual Account
                    </span>
                    <span className="text-xs font-bold uppercase text-cyan-300">
                      {activeBooking.paymentMethod.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-700">
                    <span className="font-mono text-lg font-bold text-white tracking-wider">
                      {virtualAccountNumber}
                    </span>
                    <button
                      onClick={handleCopyVA}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Transfer tepat sejumlah <strong>{formatRupiah(activeBooking.totalAmount)}</strong> via ATM, Mobile Banking, atau Internet Banking. Transaksi akan terverifikasi secara otomatis dalam hitungan detik.
                  </p>
                </div>
              )}

              {/* Credit Card View */}
              {activeBooking.paymentMethod === 'credit_card' && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-white block">Simulasi Kartu Kredit / Debit (3D Secure)</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      disabled
                      value="4111 2222 3333 4444"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        disabled
                        value="MM / YY (12/28)"
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono"
                      />
                      <input
                        type="text"
                        disabled
                        value="CVV (***)"
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Test / Simulation Trigger Button */}
              <div className="p-3.5 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-800/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-300">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tombol Uji Coba Payment Gateway:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Klik tombol di bawah ini untuk mensimulasikan respons <em>Callback / Webhook Payment Berhasil</em> dari sistem Payment Gateway secara instan.
                </p>
                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessingSimulation}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  {isProcessingSimulation ? (
                    <span>Sedang Memverifikasi Pembayaran...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulasikan Pembayaran Berhasil</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

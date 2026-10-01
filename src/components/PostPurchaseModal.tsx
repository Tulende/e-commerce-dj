import React, { useState } from 'react';
import { BookingOrder } from '../types';
import { formatRupiah } from '../utils/formatters';
import { 
  CheckCircle2, Printer, MessageCircle, X, ShieldCheck, 
  Calendar, MapPin, Truck, Sparkles, Star 
} from 'lucide-react';

interface PostPurchaseModalProps {
  order: BookingOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview?: (reviewText: string, rating: number) => void;
}

export const PostPurchaseModal: React.FC<PostPurchaseModalProps> = ({ 
  order, 
  isOpen, 
  onClose,
  onSubmitReview 
}) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendToWhatsApp = () => {
    const itemsList = order.items
      .map(i => `- ${i.product.name} (${i.quantity}x, ${i.rentalDays} hari sewa: ${i.startDate} s/d ${i.endDate})`)
      .join('%0A');

    const msg = `Halo Admin BorrowDJ!%0ASaya sudah menyelesaikan booking sewa di website:%0A%0A` +
      `*ID Booking:* ${order.id}%0A` +
      `*Nama Penyewa:* ${order.customer.fullName}%0A` +
      `*No. Telepon:* ${order.customer.phone}%0A` +
      `*Kota / Lokasi Event:* ${order.customer.eventCity} (${order.customer.address})%0A` +
      `*Total Bayar:* ${formatRupiah(order.totalAmount)}%0A` +
      `*Metode:* ${order.paymentMethod.toUpperCase()}%0A%0A` +
      `*Daftar Unit Sewa:*%0A${itemsList}%0A%0A` +
      `Mohon info jadwal pengantaran atau penjemputan unit ya, terima kasih!`;

    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitReview && reviewText.trim()) {
      onSubmitReview(reviewText, rating);
    }
    setIsReviewSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#1A1520] border border-[#C9849A]/50 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Success Banner */}
        <div className="bg-gradient-to-r from-[#8B5F96] via-[#C9849A] to-[#F7C59F] p-6 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8 text-white animate-bounce" />
          </div>

          <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
            Status: Booking Lunas & Terkonfirmasi
          </span>
          <h2 className="text-2xl font-extrabold font-['Outfit']">Terima Kasih, {order.customer.fullName}!</h2>
          <p className="text-xs text-white/90 mt-1">
            Pesanan rental Anda telah tercatat di sistem kami dengan nomor referensi resmi.
          </p>
        </div>

        {/* Scrollable Receipt Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-200">
          
          {/* Order ID & Basic Details */}
          <div className="p-4 rounded-2xl bg-[#221B2E] border border-[#3D2E4F] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#A87BAC] uppercase font-bold block">Nomor Invoice / Booking</span>
              <span className="font-mono text-base font-black text-white">{order.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#A87BAC] uppercase font-bold block">Waktu Transaksi</span>
              <span className="text-slate-300 font-semibold">{new Date(order.createdAt).toLocaleString('id-ID')}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#A87BAC] uppercase font-bold block">Metode Pembayaran</span>
              <span className="px-2 py-0.5 rounded bg-[#3D2E4F] text-[#F7C59F] font-bold uppercase text-[10px]">
                {order.paymentMethod.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Rented Items List */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Rincian Perlengkapan Musik yang Disewa</span>
            </h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#221B2E]/80 border border-[#3D2E4F]/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-12 h-12 object-cover rounded-lg bg-slate-900 flex-shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-white text-xs">{item.product.name}</h5>
                      <p className="text-[11px] text-[#A87BAC]">
                        {item.quantity} unit &bull; {item.rentalDays} hari sewa ({item.startDate} s/d {item.endDate})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white block">{formatRupiah(item.itemSubtotal)}</span>
                    <span className="text-[10px] text-[#F7C59F]">Deposit: {formatRupiah(item.product.depositAmount * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="p-4 rounded-2xl bg-[#221B2E] border border-[#3D2E4F] space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Sewa</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Diskon Kupon</span>
                <span>-{formatRupiah(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#F7C59F]">
              <span>Uang Jaminan Deposit (100% Refundable)</span>
              <span>+{formatRupiah(order.depositTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Biaya Pengantaran / Logistik</span>
              <span>{order.deliveryFee === 0 ? 'GRATIS' : formatRupiah(order.deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-[#3D2E4F] flex justify-between items-center text-sm font-black text-white">
              <span>Total Biaya yang Dibayar</span>
              <span className="text-base text-[#F7C59F]">{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>

          {/* SOP Pengantaran & Pengembalian */}
          <div className="p-4 rounded-2xl bg-[#221B2E]/60 border border-[#C9849A]/30 space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C9849A]" />
              <span>Instruksi Pengantaran &amp; Pengembalian Unit</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-[#C9849A] font-bold">1.</span>
                <span>Tim logistik BorrowDJ akan menghubungi WhatsApp <strong>{order.customer.phone}</strong> untuk konfirmasi jam penyerahan ke <strong>{order.customer.address}, {order.customer.eventCity}</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C9849A] font-bold">2.</span>
                <span>Harap siapkan KTP asli penyewa (NIK: {order.customer.idCardNumber}) untuk pencocokan data saat serah terima unit dan penandatanganan berita acara sewa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C9849A] font-bold">3.</span>
                <span>Uang deposit sebesar <strong>{formatRupiah(order.depositTotal)}</strong> akan ditransfer balik 100% setelah masa sewa berakhir dan unit dicek berfungsi baik.</span>
              </li>
            </ul>
          </div>

          {/* Quick Review / Feedback Form */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#221B2E] to-[#2d1b3d] border border-[#3D2E4F]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#F7C59F]" />
              <h4 className="font-bold text-white text-xs">Beri Ulasan Pengalaman Sewa</h4>
            </div>

            {isReviewSubmitted ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-semibold">
                Terima kasih atas ulasan Anda! Penilaian Anda membantu musisi lain di BorrowDJ.
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-300">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda, kebersihan alat, atau pelayanan..."
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1520] border border-[#3D2E4F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9849A]"
                />
                <button
                  type="submit"
                  disabled={!reviewText.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#C9849A] hover:bg-[#b06b85] disabled:opacity-40 text-white font-bold text-xs transition-colors"
                >
                  Kirim Ulasan
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-[#3D2E4F] bg-[#120F1A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#221B2E] hover:bg-[#3D2E4F] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-[#3D2E4F] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#A87BAC]" />
            <span>Cetak / Simpan PDF Nota</span>
          </button>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <button
              onClick={handleSendToWhatsApp}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konfirmasi ke WhatsApp Admin</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#3D2E4F] hover:bg-[#4d3a63] text-white text-xs font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

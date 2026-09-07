import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { StockBadge } from './StockBadge';
import { formatRupiah, calculateDaysBetween, getTomorrowDateString, getDayAfterTomorrowDateString } from '../utils/formatters';
import { X, Calendar, Shield, PackageCheck, Star, Sparkles, Check, AlertCircle } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { selectedProductForModal, setSelectedProductForModal, addToCart, setIsCartOpen } = useCart();

  const [startDate, setStartDate] = useState(getTomorrowDateString());
  const [endDate, setEndDate] = useState(getDayAfterTomorrowDateString(getTomorrowDateString()));
  const [quantity, setQuantity] = useState(1);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const isOutOfStock = product.stock <= 0;
  const rentalDays = calculateDaysBetween(startDate, endDate);

  const effectiveDailyPrice = product.isPromo && product.promoDiscountPercent
    ? Math.round(product.dailyPrice * (1 - product.promoDiscountPercent / 100))
    : product.dailyPrice;

  const totalEstimatedCost = effectiveDailyPrice * quantity * rentalDays;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, quantity, startDate, endDate);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setFeedbackMsg(null);
        setSelectedProductForModal(null);
        setIsCartOpen(true);
      }, 1200);
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#131B2E] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F19]/60">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">{product.category}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-xs font-semibold text-slate-300">{product.brand}</span>
          </div>
          <button
            onClick={() => setSelectedProductForModal(null)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Top Section: Image & Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-square bg-slate-950 border border-slate-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <StockBadge stock={product.stock} />
                {product.isPromo && product.promoDiscountPercent && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-black bg-rose-600 text-white shadow-md">
                    DISKON {product.promoDiscountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* Right: Pricing, Stock, & Booking Form */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-500 font-normal">({product.reviewsCount} review penyewa)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Deposit Box */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Tarif Sewa per Hari:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-['Outfit']">
                      {formatRupiah(effectiveDailyPrice)}
                    </span>
                    {product.isPromo && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatRupiah(product.dailyPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Jaminan Sewa (Refundable):
                  </span>
                  <span className="font-semibold text-slate-200">
                    {formatRupiah(product.depositAmount)} / unit
                  </span>
                </div>
              </div>

              {/* Date Picker Form */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-fuchsia-400" />
                  Pilih Jadwal & Durasi Sewa
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mulai Sewa:</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (e.target.value >= endDate) {
                          setEndDate(getDayAfterTomorrowDateString(e.target.value));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pengembalian:</label>
                    <input
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                </div>

                {/* Quantity & Days Info */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Jumlah Unit:</span>
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="px-2.5 py-1 text-xs text-slate-300 hover:text-white disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 text-xs font-bold text-white min-w-[24px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock || isOutOfStock}
                        className="px-2.5 py-1 text-xs text-slate-300 hover:text-white disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                    {rentalDays} Hari Sewa
                  </span>
                </div>

                {/* Subtotal preview */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Biaya Sewa:</span>
                  <span className="text-sm font-extrabold text-fuchsia-400 font-['Outfit']">
                    {formatRupiah(totalEstimatedCost)}
                  </span>
                </div>
              </div>

              {/* Feedback alert */}
              {feedbackMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-700'
                }`}>
                  {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-fuchsia-600/30 active:scale-98'
                }`}
              >
                {isOutOfStock ? (
                  'Stok Sedang Habis'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Booking & Masukkan ke Keranjang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Tabs: Features, Included Accessories, & Technical Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                Fitur Utama & Keunggulan
              </h4>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 mt-1.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Included Accessories */}
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pt-3">
                <PackageCheck className="w-4 h-4 text-cyan-400" />
                Kelengkapan Aksesori & Kabel (Sudah Termasuk)
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.includedAccessories.map((acc, idx) => (
                  <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Specs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Spesifikasi Teknis
              </h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={idx} className={`flex justify-between p-2.5 ${idx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-900/20'}`}>
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-slate-200 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

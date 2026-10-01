import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { StockBadge } from './StockBadge';
import { formatRupiah, calculateDaysBetween, getTomorrowDateString, getDayAfterTomorrowDateString } from '../utils/formatters';
import { X, Calendar, Shield, PackageCheck, Star, Sparkles, Check, AlertCircle, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/reviews';
import { Review } from '../types';

export const ProductModal: React.FC = () => {
  const { selectedProductForModal, setSelectedProductForModal, addToCart, setIsCartOpen } = useCart();

  const [startDate, setStartDate] = useState(getTomorrowDateString());
  const [endDate, setEndDate] = useState(getDayAfterTomorrowDateString(getTomorrowDateString()));
  const [quantity, setQuantity] = useState(1);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(INITIAL_REVIEWS);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewerEvent, setReviewerEvent] = useState('Gig Musik / Kafe');
  const [isReviewAdded, setIsReviewAdded] = useState(false);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const isOutOfStock = product.stock <= 0;
  const rentalDays = calculateDaysBetween(startDate, endDate);

  const effectiveDailyPrice = product.isPromo && product.promoDiscountPercent
    ? Math.round(product.dailyPrice * (1 - product.promoDiscountPercent / 100))
    : product.dailyPrice;

  const totalEstimatedCost = effectiveDailyPrice * quantity * rentalDays;

  const productReviews = reviewsList.filter(r => r.productId === product.id);
  const displayReviews = productReviews.length > 0 ? productReviews : reviewsList.slice(0, 2);

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

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
      createdAt: new Date().toISOString().split('T')[0],
      eventType: reviewerEvent,
      verifiedRental: true,
    };

    setReviewsList(prev => [newRev, ...prev]);
    setIsReviewAdded(true);
    setReviewerName('');
    setReviewerComment('');
    setTimeout(() => setIsReviewAdded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#1A1520] border border-[#3D2E4F] rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3D2E4F] bg-[#120F1A]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#E8A0B4] uppercase tracking-wider">{product.category}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-xs font-semibold text-slate-300">{product.brand}</span>
          </div>
          <button
            onClick={() => setSelectedProductForModal(null)}
            className="p-1.5 rounded-xl bg-[#221B2E] hover:bg-[#3D2E4F] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-200">
          {/* Top Section: Image & Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-square bg-[#120F1A] border border-[#3D2E4F]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <StockBadge stock={product.stock} />
                {product.isPromo && product.promoDiscountPercent && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-black bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg animate-pulse">
                    DISKON {product.promoDiscountPercent}%
                  </span>
                )}
              </div>
              {product.promoTag && (
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-[#F7C59F] bg-black/70 px-2.5 py-1 rounded-md border border-[#F7C59F]/40 backdrop-blur-sm">
                  {product.promoTag}
                </span>
              )}
            </div>

            {/* Right: Pricing, Stock, & Booking Form */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({displayReviews.length} review terverifikasi)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Deposit Box (with item discount highlight) */}
              <div className="p-4 rounded-2xl bg-[#221B2E] border border-[#3D2E4F] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#D4A5C0]">Tarif Sewa per Hari:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-['Outfit']">
                      {formatRupiah(effectiveDailyPrice)}
                    </span>
                    {product.isPromo && product.promoDiscountPercent && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatRupiah(product.dailyPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#3D2E4F]">
                  <span className="flex items-center gap-1.5 text-[#A87BAC]">
                    <Shield className="w-3.5 h-3.5 text-[#C9849A]" />
                    Jaminan Sewa (100% Refundable):
                  </span>
                  <span className="font-semibold text-[#F7C59F]">
                    {formatRupiah(product.depositAmount)} / unit
                  </span>
                </div>
              </div>

              {/* Date Picker Form */}
              <div className="p-4 rounded-2xl bg-[#221B2E]/70 border border-[#3D2E4F] space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-[#C9849A]" />
                  Pilih Jadwal &amp; Durasi Sewa
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Mulai Sewa:</label>
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
                      className="w-full px-3 py-2 rounded-xl bg-[#1A1520] border border-[#3D2E4F] text-xs text-white focus:outline-none focus:border-[#C9849A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Pengembalian:</label>
                    <input
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1A1520] border border-[#3D2E4F] text-xs text-white focus:outline-none focus:border-[#C9849A]"
                    />
                  </div>
                </div>

                {/* Quantity & Days Info */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Jumlah Unit:</span>
                    <div className="flex items-center bg-[#1A1520] border border-[#3D2E4F] rounded-lg">
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

                  <span className="text-xs font-bold text-[#F7C59F] bg-[#3D2E4F] px-2.5 py-1 rounded-lg border border-[#C9849A]/40">
                    {rentalDays} Hari Sewa
                  </span>
                </div>

                {/* Subtotal preview */}
                <div className="pt-2 border-t border-[#3D2E4F] flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Biaya Sewa:</span>
                  <span className="text-sm font-extrabold text-[#F7C59F] font-['Outfit']">
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
                    : 'bg-gradient-to-r from-[#8B5F96] to-[#C9849A] hover:opacity-95 text-white shadow-[#C9849A]/30 active:scale-98'
                }`}
              >
                {isOutOfStock ? (
                  'Stok Sedang Habis'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F7C59F]" />
                    <span>Booking &amp; Masukkan ke Keranjang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Middle Tabs: Features, Included Accessories, & Technical Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#3D2E4F]">
            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9849A]" />
                Fitur Utama &amp; Keunggulan
              </h4>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9849A] mt-1.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Included Accessories */}
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pt-3">
                <PackageCheck className="w-4 h-4 text-[#F7C59F]" />
                Kelengkapan Aksesori &amp; Kabel (Sudah Termasuk)
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.includedAccessories.map((acc, idx) => (
                  <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#221B2E] text-slate-300 border border-[#3D2E4F]">
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
              <div className="rounded-xl border border-[#3D2E4F] overflow-hidden text-xs">
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={idx} className={`flex justify-between p-2.5 ${idx % 2 === 0 ? 'bg-[#221B2E]' : 'bg-[#1A1520]'}`}>
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-slate-200 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CUSTOMER REVIEWS SECTION (Feature from requirement) */}
          <div className="pt-6 border-t border-[#3D2E4F] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C9849A]" />
                <h4 className="text-sm font-bold text-white font-['Outfit']">Ulasan Pelanggan (Customer Reviews)</h4>
              </div>
              <span className="text-xs text-[#A87BAC]">
                {displayReviews.length} Ulasan Terverifikasi
              </span>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {displayReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-[#221B2E] border border-[#3D2E4F] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5F96] to-[#F7C59F] text-slate-950 font-black text-xs flex items-center justify-center">
                        {rev.userName.charAt(0)}
                      </span>
                      <div>
                        <span className="font-bold text-white text-xs block">{rev.userName}</span>
                        {rev.eventType && (
                          <span className="text-[10px] text-[#A87BAC]">{rev.eventType} &bull; {rev.createdAt}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    "{rev.comment}"
                  </p>

                  {rev.verifiedRental && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold pt-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>Penyewa Terverifikasi BorrowDJ</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <div className="p-4 rounded-2xl bg-[#221B2E]/80 border border-[#C9849A]/30 space-y-3">
              <h5 className="font-bold text-white text-xs">Pernah menyewa unit ini? Tulis Ulasan Anda:</h5>

              {isReviewAdded && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs">
                  Terima kasih! Ulasan Anda berhasil ditambahkan.
                </div>
              )}

              <form onSubmit={handleAddReview} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#D4A5C0] mb-1">Nama Anda *</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={e => setReviewerName(e.target.value)}
                      placeholder="Contoh: Sarah A."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#1A1520] border border-[#3D2E4F] text-xs text-white focus:outline-none focus:border-[#C9849A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#D4A5C0] mb-1">Jenis Event / Acara</label>
                    <input
                      type="text"
                      value={reviewerEvent}
                      onChange={e => setReviewerEvent(e.target.value)}
                      placeholder="Contoh: Kafe Gig, Ulang Tahun"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#1A1520] border border-[#3D2E4F] text-xs text-white focus:outline-none focus:border-[#C9849A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#D4A5C0] mb-1">Rating Bintang</label>
                    <div className="flex items-center gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setReviewerRating(st)}
                          className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${st <= reviewerRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#D4A5C0] mb-1">Ulasan &amp; Pengalaman *</label>
                  <textarea
                    rows={2}
                    required
                    value={reviewerComment}
                    onChange={e => setReviewerComment(e.target.value)}
                    placeholder="Ceritakan kondisi unit, kemudahan pemakaian, atau respon staf..."
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1520] border border-[#3D2E4F] text-xs text-white focus:outline-none focus:border-[#C9849A]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B5F96] to-[#C9849A] hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#C9849A]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Ulasan Produk</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

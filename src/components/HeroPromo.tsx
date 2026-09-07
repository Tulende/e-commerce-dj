import React, { useState, useEffect } from 'react';
import { PROMO_BANNERS } from '../data/promotions';
import { Copy, Check, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Zap, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const HeroPromo: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { applyCoupon, setIsCartOpen } = useCart();

  // Auto slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const banner = PROMO_BANNERS[currentIndex];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      {/* Main Promo Carousel Card */}
      <div className={`relative overflow-hidden rounded-3xl border border-slate-700/60 shadow-2xl bg-gradient-to-br ${banner.bgGradient} transition-all duration-700 min-h-[360px] md:min-h-[400px] flex flex-col justify-between`}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            {banner.badge}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-['Outfit']">
            {banner.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {banner.subtitle}
          </p>

          {/* Coupon Code Action */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-xl p-1.5 backdrop-blur-md shadow-inner">
              <span className="px-3 text-xs text-slate-400 font-semibold uppercase">
                {banner.discountText}
              </span>
              <button
                onClick={() => handleCopyCode(banner.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95"
                title="Klik untuk salin kode dan terapkan"
              >
                {copiedCode === banner.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{banner.code}</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                applyCoupon(banner.code);
                setIsCartOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
            >
              Klaim & Buka Keranjang
            </button>
          </div>
        </div>

        {/* Carousel Indicators & Arrows */}
        <div className="relative z-10 px-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {PROMO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-fuchsia-400 shadow-sm shadow-fuchsia-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % PROMO_BANNERS.length)}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Value Props Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Stok Real-Time</h4>
            <p className="text-[11px] text-slate-400">Unit terverifikasi siap sewa</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Deposit Aman</h4>
            <p className="text-[11px] text-slate-400">100% Refundable utuh</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Hitungan Fleksibel</h4>
            <p className="text-[11px] text-slate-400">Sewa 1 hari s/d mingguan</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Online Payment</h4>
            <p className="text-[11px] text-slate-400">QRIS & VA Bank otomatis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

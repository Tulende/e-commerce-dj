import React, { useState } from 'react';
import { PROMO_COUPONS } from '../data/promotions';
import { useCart } from '../context/CartContext';
import { X, Tag, Copy, Check, Sparkles } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose }) => {
  const { applyCoupon, appliedCoupon, setIsCartOpen } = useCart();
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    applyCoupon(code);
    setTimeout(() => {
      setCopied(null);
      onClose();
      setIsCartOpen(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#131B2E] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F19]/80">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-base font-bold text-white font-['Outfit']">Kupon & Promosi Sewa Aktif</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-slate-400">
            Pilih atau salin kode kupon promo di bawah ini untuk mendapatkan potongan harga spesial pada saat checkout penyewaan.
          </p>

          <div className="space-y-3">
            {PROMO_COUPONS.map((coupon) => {
              const isCurrentlyApplied = appliedCoupon?.code === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrentlyApplied
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
                      : 'bg-slate-900/90 border-slate-800 hover:border-fuchsia-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700">
                          {coupon.code}
                        </span>
                        {isCurrentlyApplied && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                            Aktif Digunakan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-2 font-medium">
                        {coupon.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApply(coupon.code)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                    >
                      {copied === coupon.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Dipakai!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Gunakan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-800/40 flex items-center gap-2.5 text-xs text-fuchsia-300">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Promo sewa mingguan & paket panggung otomatis mendapatkan free handling & kabel cadangan!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

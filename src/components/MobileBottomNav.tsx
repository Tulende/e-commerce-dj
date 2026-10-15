import React from 'react';
import { Disc3, Tag, Calculator, Bot, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  onOpenPromo: () => void;
  onOpenAI: () => void;
  onOpenEstimator: () => void;
  onGoToCatalog?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenPromo,
  onOpenAI,
  onOpenEstimator,
  onGoToCatalog,
}) => {
  const { totalItemCount, setIsCartOpen } = useCart();

  const handleKatalogClick = () => {
    if (onGoToCatalog) {
      onGoToCatalog();
    } else {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      aria-label="Navigasi Bawah Mobile"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Katalog */}
        <button
          onClick={handleKatalogClick}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-400 hover:text-fuchsia-400 active:scale-95 transition-all"
        >
          <Disc3 className="w-5 h-5 mb-0.5 text-slate-300" />
          <span className="text-[10px] font-semibold tracking-tight">Katalog</span>
        </button>

        {/* Tab 2: Promo */}
        <button
          onClick={onOpenPromo}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-400 hover:text-fuchsia-400 active:scale-95 transition-all"
        >
          <Tag className="w-5 h-5 mb-0.5 text-fuchsia-400" />
          <span className="text-[10px] font-semibold tracking-tight">Promo</span>
        </button>

        {/* Tab 3: Estimasi Sewa (Center Highlight FAB) */}
        <button
          onClick={onOpenEstimator}
          className="flex flex-col items-center justify-center -mt-4 py-1 px-1 active:scale-90 transition-all group"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-600/40 border-2 border-[#0B0F19] group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-amber-300 tracking-tight mt-0.5">
            Estimasi
          </span>
        </button>

        {/* Tab 4: SoundBot AI */}
        <button
          onClick={onOpenAI}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-400 hover:text-cyan-400 active:scale-95 transition-all"
        >
          <div className="relative">
            <Bot className="w-5 h-5 mb-0.5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">SoundBot</span>
        </button>

        {/* Tab 5: Keranjang */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-400 hover:text-pink-400 active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-pink-400" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white rounded-full text-[9px] font-black min-w-[16px] text-center shadow-md animate-in zoom-in-50">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Keranjang</span>
        </button>
      </div>
    </nav>
  );
};

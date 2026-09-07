import React from 'react';
import { ShoppingBag, Disc3, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatters';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenPromo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery, onOpenPromo }) => {
  const { totalItemCount, subtotal, setIsCartOpen, setIsTermsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0F19]/90 border-b border-slate-800/80 transition-all">
      {/* Top Banner Promo Bar */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-500 py-1.5 px-4 text-center text-xs font-semibold text-white flex items-center justify-center gap-2 tracking-wide">
        <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
        <span>Gunakan kode voucher <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-amber-200">SEWASERU15</span> untuk Diskon 15% booking minggu ini!</span>
        <button 
          onClick={onOpenPromo} 
          className="underline hover:text-amber-200 ml-2 hidden sm:inline-flex items-center gap-1 font-bold"
        >
          Lihat Semua Promo &rarr;
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-fuchsia-500/20 group-hover:shadow-fuchsia-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Disc3 className="w-6 h-6 text-fuchsia-400 group-hover:rotate-180 transition-transform duration-700 ease-out" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">Sound<span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400">Rent</span></span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800/60">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Rental Alat Musik & DJ Gear</p>
          </div>
        </div>

        {/* Center Search bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari alat musik, CDJ, controller, drum, gitar, speaker..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Syarat Sewa Button */}
          <button
            onClick={() => setIsTermsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/70 border border-slate-800 transition-colors"
            title="Syarat & Ketentuan Rental"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Syarat Sewa</span>
          </button>

          {/* Promo List Button */}
          <button
            onClick={onOpenPromo}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-fuchsia-300 hover:text-fuchsia-200 rounded-xl bg-fuchsia-950/40 hover:bg-fuchsia-900/50 border border-fuchsia-800/60 transition-colors"
          >
            <Tag className="w-4 h-4 text-fuchsia-400" />
            <span className="hidden sm:inline">Kupon Promo</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-semibold text-sm shadow-md shadow-fuchsia-600/30 transition-all transform active:scale-95"
            aria-label="Buka Keranjang Sewa"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline text-xs font-bold">Keranjang</span>
            {totalItemCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-fuchsia-700 rounded-full text-xs font-extrabold min-w-[20px] text-center shadow">
                {totalItemCount}
              </span>
            )}
            {subtotal > 0 && (
              <span className="hidden lg:inline text-xs font-mono font-medium border-l border-white/20 pl-2">
                {formatRupiah(subtotal)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="px-4 pb-3 md:hidden">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari alat musik atau DJ..."
          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
        />
      </div>
    </header>
  );
};

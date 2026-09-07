import React from 'react';
import { Product } from '../types';
import { StockBadge } from './StockBadge';
import { formatRupiah } from '../utils/formatters';
import { Star, Shield, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductForModal, addToCart, cartItems } = useCart();

  const isOutOfStock = product.stock <= 0;
  const isInCart = cartItems.some((item) => item.product.id === product.id);

  // Kalkulasi harga diskon promo
  const effectivePrice = product.isPromo && product.promoDiscountPercent
    ? Math.round(product.dailyPrice * (1 - product.promoDiscountPercent / 100))
    : product.dailyPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => setSelectedProductForModal(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#131B2E] border border-slate-800/80 hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-fuchsia-500/10 cursor-pointer overflow-hidden"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-transparent to-black/30" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
          <StockBadge stock={product.stock} />
          {product.isPromo && product.promoDiscountPercent && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md">
              HEMAT {product.promoDiscountPercent}%
            </span>
          )}
        </div>

        {/* Promo Tag */}
        {product.promoTag && (
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-700/50 backdrop-blur-sm">
            {product.promoTag}
          </span>
        )}
      </div>

      {/* Content Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {product.category} &bull; <span className="text-slate-300">{product.brand}</span>
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-bold text-base text-white group-hover:text-fuchsia-300 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Tarif Sewa / Hari:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-white font-['Outfit']">
                  {formatRupiah(effectivePrice)}
                </span>
                {product.isPromo && (
                  <span className="text-xs text-slate-500 line-through">
                    {formatRupiah(product.dailyPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Jaminan Sewa:</span>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1 justify-end">
                <Shield className="w-3 h-3 text-cyan-400" />
                {formatRupiah(product.depositAmount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedProductForModal(product)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors text-center"
            >
              Detail Alat
            </button>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : isInCart
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/30'
                  : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white hover:from-fuchsia-500 hover:to-pink-500 shadow-md shadow-fuchsia-600/20'
              }`}
            >
              {isOutOfStock ? (
                'Stok Habis'
              ) : isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Di Keranjang</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sewa Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

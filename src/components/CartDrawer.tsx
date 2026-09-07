import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatters';
import { X, Trash2, Tag, Calendar, Shield, ArrowRight, ShoppingBag, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    depositTotal,
    deliveryFee,
    totalAmount,
    setIsCheckoutOpen,
  } = useCart();

  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;
    const res = applyCoupon(voucherCodeInput);
    if (!res.success) {
      setVoucherError(res.message);
    } else {
      setVoucherError(null);
      setVoucherCodeInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#131B2E] border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B0F19]/80">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-fuchsia-400" />
              <h2 className="text-base font-bold text-white font-['Outfit']">Keranjang Sewa</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800">
                {cartItems.length} Alat
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-16 h-16 text-slate-700 mb-4 stroke-1" />
                <h3 className="font-bold text-base text-slate-300 mb-1 font-['Outfit']">Keranjang Anda Kosong</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-xs">
                  Pilih instrumen musik atau perangkat DJ favorit Anda dari katalog untuk memulai pemesanan sewa.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Jelajahi Alat Musik & DJ
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Hapus dari keranjang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] text-fuchsia-400 font-semibold block">
                        {formatRupiah(item.product.dailyPrice)} / hari
                      </span>

                      {/* Rental Duration badge */}
                      <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.rentalDays} hari ({item.startDate} s/d {item.endDate})</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Subtotal row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Jumlah:</span>
                      <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Subtotal:</span>
                      <span className="font-extrabold text-white font-mono">
                        {formatRupiah(item.itemSubtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary Area */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#0B0F19]/90 space-y-3">
              {/* Voucher Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Check className="w-4 h-4" />
                      <div>
                        <span className="font-bold font-mono">{appliedCoupon.code}</span>
                        <p className="text-[10px] text-emerald-400/80">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold ml-2"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyVoucher} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        value={voucherCodeInput}
                        onChange={(e) => {
                          setVoucherCodeInput(e.target.value.toUpperCase());
                          setVoucherError(null);
                        }}
                        placeholder="Kode kupon (contoh: SEWASERU15)"
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-fuchsia-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                    >
                      Gunakan
                    </button>
                  </form>
                )}

                {voucherError && (
                  <p className="text-[11px] text-rose-400 mt-1">{voucherError}</p>
                )}
              </div>

              {/* Cost Calculations Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Biaya Sewa ({cartItems.length} Alat):</span>
                  <span className="font-mono text-slate-200">{formatRupiah(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Diskon Voucher ({appliedCoupon?.code}):</span>
                    <span className="font-mono">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    Jaminan Deposit (100% Refundable):
                  </span>
                  <span className="font-mono text-slate-200">{formatRupiah(depositTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Biaya Pengantaran & Setup:</span>
                  <span className="font-mono text-slate-200">
                    {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">GRATIS</span> : formatRupiah(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Pembayaran:</span>
                  <span className="text-base font-extrabold text-fuchsia-400 font-['Outfit']">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/30 transition-all active:scale-98"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

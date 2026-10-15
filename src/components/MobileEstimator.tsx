import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatters';
import {
  Calculator,
  X,
  MapPin,
  Calendar,
  ArrowRight,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProductCategory } from '../types';

interface MobileEstimatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export const MobileEstimator: React.FC<MobileEstimatorProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onOpen: externalOnOpen,
}) => {
  const { products, setSelectedProductForModal, addToCart, setIsCartOpen } = useCart();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (externalIsOpen !== undefined) {
      if (!val && externalOnClose) externalOnClose();
      if (val && externalOnOpen) externalOnOpen();
    } else {
      setInternalIsOpen(val);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('DJ Gear');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [rentalDays, setRentalDays] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState('Jakarta Selatan');
  const [addedToast, setAddedToast] = useState(false);

  const filteredProducts = products.filter(p => p.category === selectedCategory);
  const currentProduct =
    products.find(p => p.id === selectedProductId) || filteredProducts[0] || products[0];

  if (!currentProduct) return null;

  const effectiveDaily =
    currentProduct.isPromo && currentProduct.promoDiscountPercent
      ? Math.round(currentProduct.dailyPrice * (1 - currentProduct.promoDiscountPercent / 100))
      : currentProduct.dailyPrice;

  const rentalSubtotal = effectiveDaily * quantity * rentalDays;
  const depositTotal = currentProduct.depositAmount * quantity;
  const deliveryFee =
    rentalSubtotal > 1000000
      ? 0
      : deliveryArea.includes('Tangerang') || deliveryArea.includes('Bekasi') || deliveryArea.includes('Depok')
      ? 75000
      : deliveryArea.includes('Bogor')
      ? 100000
      : 50000;
  const grandTotal = rentalSubtotal + depositTotal + deliveryFee;

  const handleAddToCart = () => {
    const res = addToCart(currentProduct, quantity);
    if (res.success) {
      setAddedToast(true);
      setTimeout(() => {
        setAddedToast(false);
        setIsOpen(false);
        setIsCartOpen(true);
      }, 900);
    }
  };

  const handleSelectProduct = () => {
    setSelectedProductForModal(currentProduct);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button (Khusus desktop / tablet, mobile memakai Bottom Nav) */}
      <div className="hidden md:block fixed sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs shadow-xl shadow-fuchsia-600/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          title="Buka Kalkulator Estimasi Biaya Sewa"
        >
          <div className="p-1 rounded-full bg-white/20">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <span className="font-['Outfit'] font-bold tracking-wide">Estimasi Sewa</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
        </button>
      </div>

      {/* Modal / Bottom Sheet */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-[#111625] border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-fuchsia-600/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-['Outfit']">
                    Kalkulator Estimasi Sewa
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hitung tarif sewa, uang jaminan, dan estimasi ongkir secara real-time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-3.5 text-xs">
              {/* Category Select Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Kategori Alat Musik
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    'DJ Gear',
                    'Sound System',
                    'Drum & Perkusi',
                    'Gitar & Bass',
                    'Keyboard & Synth',
                    'Microphone',
                    'Lighting & Stage',
                  ].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat as ProductCategory);
                        const first = products.find(p => p.category === cat);
                        if (first) setSelectedProductId(first.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-600/20'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Select Card */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Pilih Produk
                </label>
                <div className="relative">
                  <select
                    value={currentProduct.id}
                    onChange={e => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all appearance-none pr-8"
                  >
                    {filteredProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatRupiah(p.dailyPrice)}/hari {p.stock <= 0 ? '(Stok Habis)' : `(Stok: ${p.stock})`}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    ▼
                  </div>
                </div>

                {/* Selected Product Preview Card */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{currentProduct.name}</p>
                    <p className="text-[11px] text-fuchsia-400 font-bold font-mono">
                      {formatRupiah(effectiveDaily)} <span className="text-[10px] text-slate-400 font-normal">/ hari</span>
                    </p>
                  </div>
                  {currentProduct.stock > 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                      Sisa {currentProduct.stock} unit
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800/60 font-semibold">
                      Habis
                    </span>
                  )}
                </div>
              </div>

              {/* Duration and Quantity Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Durasi Sewa</span>
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="flex-1 text-center font-bold text-white text-xs">
                      {rentalDays} Hari
                    </span>
                    <button
                      type="button"
                      onClick={() => setRentalDays(rentalDays + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Preset Buttons */}
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 7].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setRentalDays(d)}
                        className={`flex-1 py-0.5 rounded text-[10px] font-semibold ${
                          rentalDays === d
                            ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}h
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Jumlah Unit
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="flex-1 text-center font-bold text-white text-xs">
                      {quantity} Unit
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentProduct.stock || 1, quantity + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-1.5">
                    Maks. stok: {currentProduct.stock} unit
                  </p>
                </div>
              </div>

              {/* Delivery Area Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Wilayah Pengiriman & Lokasi Acara</span>
                </label>
                <select
                  value={deliveryArea}
                  onChange={e => setDeliveryArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="Jakarta Selatan">Jakarta Selatan (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Pusat">Jakarta Pusat (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Barat">Jakarta Barat (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Timur">Jakarta Timur (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Utara">Jakarta Utara (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Tangerang / BSD">Tangerang / BSD (Rp 75.000)</option>
                  <option value="Depok">Depok (Rp 75.000)</option>
                  <option value="Bekasi">Bekasi (Rp 75.000)</option>
                  <option value="Bogor">Bogor (Rp 100.000)</option>
                </select>
              </div>
            </div>

            {/* Realtime Breakdown Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>
                  Biaya Sewa ({quantity} unit × {rentalDays} hari)
                </span>
                <span className="font-semibold text-slate-200">{formatRupiah(rentalSubtotal)}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Uang Jaminan Deposit (100% Refundable)</span>
                <span>+{formatRupiah(depositTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ongkos Kirim & Pengambilan</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-400 uppercase tracking-wider text-[11px]">
                      GRATIS (Promo &gt; 1Jt)
                    </strong>
                  ) : (
                    formatRupiah(deliveryFee)
                  )}
                </span>
              </div>
              <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center text-sm font-black text-white">
                <span className="font-['Outfit']">Perkiraan Total Bayar:</span>
                <span className="text-base text-fuchsia-400 font-['Outfit']">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            {/* Toast Notification */}
            {addedToast && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center justify-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Berhasil ditambahkan ke keranjang! Membuka keranjang...</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleSelectProduct}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentProduct.stock <= 0}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-fuchsia-600/30 transition-all"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

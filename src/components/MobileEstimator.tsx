import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatters';
import { Calculator, X, Sparkles, MapPin, Calendar, Check, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

export const MobileEstimator: React.FC = () => {
  const { products, setSelectedProductForModal } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('DJ Gear');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [rentalDays, setRentalDays] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState('Jakarta Selatan');

  const filteredProducts = products.filter(p => p.category === selectedCategory);
  const currentProduct = products.find(p => p.id === selectedProductId) || filteredProducts[0] || products[0];

  if (!currentProduct) return null;

  const effectiveDaily = currentProduct.isPromo && currentProduct.promoDiscountPercent
    ? Math.round(currentProduct.dailyPrice * (1 - currentProduct.promoDiscountPercent / 100))
    : currentProduct.dailyPrice;

  const rentalSubtotal = effectiveDaily * quantity * rentalDays;
  const depositTotal = currentProduct.depositAmount * quantity;
  const deliveryFee = rentalSubtotal > 1000000 ? 0 : (deliveryArea.includes('Tangerang') || deliveryArea.includes('Bekasi') ? 75000 : 50000);
  const grandTotal = rentalSubtotal + depositTotal + deliveryFee;

  const handleSelectProduct = () => {
    setSelectedProductForModal(currentProduct);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button (Highlighted on Mobile & Tablet) */}
      <div className="fixed bottom-20 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#8B5F96] via-[#C9849A] to-[#F7C59F] text-slate-950 font-extrabold text-xs shadow-xl shadow-[#C9849A]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Calculator className="w-4 h-4 text-slate-950" />
          <span className="font-['Outfit']">Estimasi Cepat</span>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </button>
      </div>

      {/* Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full sm:max-w-lg bg-[#1A1520] border-t sm:border border-[#C9849A]/40 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[85vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2E4F]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#221B2E] border border-[#C9849A]/50 flex items-center justify-center text-[#E8A0B4]">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white font-['Outfit']">Kalkulator Estimasi Sewa &amp; Ongkir</h3>
                  <p className="text-[10px] text-[#A87BAC]">Hitung cepat perkiraan biaya sewa sebelum booking</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#221B2E] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-3 text-xs">
              {/* Category Select */}
              <div>
                <label className="block text-[11px] font-bold text-[#D4A5C0] mb-1">Kategori Alat</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {(['DJ Gear', 'Sound System', 'Drum & Perkusi', 'Gitar & Bass', 'Keyboard & Synth'] as ProductCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        const first = products.find(p => p.category === cat);
                        if (first) setSelectedProductId(first.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#C9849A] text-white'
                          : 'bg-[#221B2E] text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Select */}
              <div>
                <label className="block text-[11px] font-bold text-[#D4A5C0] mb-1">Pilih Produk</label>
                <select
                  value={currentProduct.id}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#221B2E] border border-[#3D2E4F] text-white text-xs focus:outline-none focus:border-[#C9849A]"
                >
                  {filteredProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatRupiah(p.dailyPrice)}/hari) {p.stock <= 0 ? '- [Habis]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration and Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#D4A5C0] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C9849A]" />
                    Durasi Sewa
                  </label>
                  <div className="flex items-center rounded-xl bg-[#221B2E] border border-[#3D2E4F] p-1">
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      className="w-7 h-7 rounded-lg bg-[#3D2E4F] text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-white text-xs">{rentalDays} Hari</span>
                    <button
                      type="button"
                      onClick={() => setRentalDays(rentalDays + 1)}
                      className="w-7 h-7 rounded-lg bg-[#3D2E4F] text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#D4A5C0] mb-1">Jumlah Unit</label>
                  <div className="flex items-center rounded-xl bg-[#221B2E] border border-[#3D2E4F] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-[#3D2E4F] text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-white text-xs">{quantity} Unit</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentProduct.stock || 1, quantity + 1))}
                      className="w-7 h-7 rounded-lg bg-[#3D2E4F] text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Area */}
              <div>
                <label className="block text-[11px] font-bold text-[#D4A5C0] mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F7C59F]" />
                  Wilayah Pengantaran
                </label>
                <select
                  value={deliveryArea}
                  onChange={e => setDeliveryArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#221B2E] border border-[#3D2E4F] text-white text-xs focus:outline-none focus:border-[#C9849A]"
                >
                  <option value="Jakarta Selatan">Jakarta Selatan (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Pusat">Jakarta Pusat (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Barat">Jakarta Barat (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Timur">Jakarta Timur (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Jakarta Utara">Jakarta Utara (Rp 50.000 / Gratis &gt; 1jt)</option>
                  <option value="Tangerang / BSD">Tangerang / BSD Selatan (Rp 75.000)</option>
                  <option value="Depok">Depok (Rp 75.000)</option>
                  <option value="Bekasi">Bekasi (Rp 75.000)</option>
                </select>
              </div>
            </div>

            {/* Realtime Breakdown Card */}
            <div className="p-3.5 rounded-2xl bg-[#221B2E] border border-[#C9849A]/30 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Biaya Sewa ({quantity} unit x {rentalDays} hari)</span>
                <span className="font-semibold text-white">{formatRupiah(rentalSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#F7C59F]">
                <span>Uang Jaminan Deposit (Refundable)</span>
                <span>+{formatRupiah(depositTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Ongkir ke {deliveryArea}</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-400">GRATIS</strong> : formatRupiah(deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-[#3D2E4F] flex justify-between items-center text-xs font-black text-white">
                <span>Perkiraan Total Bayar:</span>
                <span className="text-sm text-[#F7C59F]">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSelectProduct}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B5F96] to-[#C9849A] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C9849A]/30 transition-all"
            >
              <span>Lihat Detail &amp; Booking {currentProduct.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

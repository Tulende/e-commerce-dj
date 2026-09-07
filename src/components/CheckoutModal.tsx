import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CustomerDetails, PaymentMethodType } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, ShieldCheck, QrCode, Building2, CreditCard, Lock, ArrowRight, UserCheck } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    subtotal,
    discountAmount,
    depositTotal,
    deliveryFee,
    totalAmount,
    processBooking,
    setIsPaymentSimulatorOpen,
  } = useCart();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    eventCity: 'Jakarta',
    idCardNumber: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.idCardNumber.trim() || !customer.address.trim()) {
      setErrorMsg('Mohon lengkapi Nama, WhatsApp, NIK KTP/SIM, dan Alamat Lokasi Acara.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('Anda harus menyetujui syarat & ketentuan sewa untuk melanjutkan.');
      return;
    }

    setErrorMsg(null);
    processBooking(customer, paymentMethod);
    setIsCheckoutOpen(false);
    setIsPaymentSimulatorOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#131B2E] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F19]/80">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">Checkout & Data Penyewa</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Customer Data for Rental Guarantee */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              1. Identitas Penyewa (Jaminan Sewa Alat Musik & DJ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Nama Lengkap Sesuai KTP *</label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder="Contoh: Budi Pratama"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Email *</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="email@domain.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Nomor NIK KTP / SIM *</label>
                <input
                  type="text"
                  required
                  value={customer.idCardNumber}
                  onChange={(e) => setCustomer({ ...customer, idCardNumber: e.target.value })}
                  placeholder="16 Digit NIK KTP untuk verifikasi sewa"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Alamat Lengkap Pengiriman / Lokasi Acara *</label>
              <textarea
                required
                rows={2}
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="Nama gedung, jalan, nomor rumah, RT/RW, kelurahan..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Kota Wilayah Sewa</label>
                <select
                  value={customer.eventCity}
                  onChange={(e) => setCustomer({ ...customer, eventCity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                >
                  <option value="Jakarta">DKI Jakarta (Pusat, Selatan, Barat, Timur, Utara)</option>
                  <option value="Tangerang">Tangerang & Tangsel (BSD, Serpong, Bintaro)</option>
                  <option value="Bekasi">Bekasi & Cikarang</option>
                  <option value="Depok">Depok & Cibubur</option>
                  <option value="Bogor">Bogor Kota & Sentul</option>
                  <option value="Bandung">Bandung & Sekitarnya</option>
                  <option value="Bali">Bali (Kuta, Seminyak, Canggu, Denpasar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Catatan Khusus (Opsional)</label>
                <input
                  type="text"
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="Contoh: Tolong siapkan kabel jack extra 10m"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              2. Metode Pembayaran Online (Payment Gateway)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* QRIS */}
              <label
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'qris'
                    ? 'bg-fuchsia-950/40 border-fuchsia-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'qris'}
                    onChange={() => setPaymentMethod('qris')}
                    className="accent-fuchsia-500"
                  />
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-fuchsia-400" />
                    <div>
                      <span className="text-xs font-bold block text-white">QRIS Instant</span>
                      <span className="text-[10px] text-slate-400">GoPay, OVO, ShopeePay, BCA, Dana</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">Otomatis</span>
              </label>

              {/* BCA Virtual Account */}
              <label
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'bca_va'
                    ? 'bg-fuchsia-950/40 border-fuchsia-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bca_va'}
                    onChange={() => setPaymentMethod('bca_va')}
                    className="accent-fuchsia-500"
                  />
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold block text-white">BCA Virtual Account</span>
                      <span className="text-[10px] text-slate-400">Verifikasi instan 24 jam</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-cyan-300">BCA</span>
              </label>

              {/* Mandiri Virtual Account */}
              <label
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'mandiri_va'
                    ? 'bg-fuchsia-950/40 border-fuchsia-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'mandiri_va'}
                    onChange={() => setPaymentMethod('mandiri_va')}
                    className="accent-fuchsia-500"
                  />
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold block text-white">Mandiri Livin' VA</span>
                      <span className="text-[10px] text-slate-400">Verifikasi instan via Livin'</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-300">Mandiri</span>
              </label>

              {/* Credit Card */}
              <label
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'bg-fuchsia-950/40 border-fuchsia-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="accent-fuchsia-500"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold block text-white">Kartu Kredit / Debit</span>
                      <span className="text-[10px] text-slate-400">Visa, Mastercard, JCB</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-300">3D Secure</span>
              </label>
            </div>
          </div>

          {/* Section 3: Ringkasan Biaya & Perjanjian */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Ringkasan Biaya Sewa ({cartItems.length} Alat)</h4>
            <div className="flex justify-between text-slate-400">
              <span>Sewa Instrumen:</span>
              <span className="font-mono text-white">{formatRupiah(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Diskon Kupon:</span>
                <span className="font-mono">-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Uang Jaminan Deposit (Refundable 100%):</span>
              <span className="font-mono text-white">{formatRupiah(depositTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Biaya Pengantaran:</span>
              <span className="font-mono text-white">{deliveryFee === 0 ? 'GRATIS' : formatRupiah(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
              <span>Total yang Harus Dibayar:</span>
              <span className="text-lg text-fuchsia-400 font-['Outfit']">{formatRupiah(totalAmount)}</span>
            </div>

            {/* Terms checkbox */}
            <div className="pt-3 border-t border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded accent-fuchsia-500"
                />
                <span className="text-[11px] leading-relaxed">
                  Saya setuju dengan <strong className="text-cyan-300">Syarat & Ketentuan Rental SoundRent</strong>, bersedia menjaga fisik alat musik/DJ, serta memahami deposit akan dikembalikan 100% setelah inspeksi pengembalian selesai.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-fuchsia-600/30 transition-all active:scale-98"
          >
            <Lock className="w-4 h-4" />
            <span>Bayar Sekarang Melalui Payment Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Wallet, 
  Boxes, 
  Activity, 
  X, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Package, 
  Calendar, 
  User, 
  ArrowUpRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BookingOrder } from '../types';
import { soundRentApi } from '../services/api';
import { formatRupiah } from '../utils/formatters';
import { CRMDashboard } from './crm/CRMDashboard';

export const AdminDashboard: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { products, setIsAdminOpen } = useCart();
  const [orders, setOrders] = useState<BookingOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<'operasional' | 'crm'>('operasional');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'semua' | 'paid' | 'pending' | 'cancelled'>('semua');

  useEffect(() => {
    if (open) {
      setIsLoadingOrders(true);
      soundRentApi.getOrders()
        .then(setOrders)
        .finally(() => setIsLoadingOrders(false));
    }
  }, [open]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = orderStatusFilter === 'semua' || o.paymentStatus === orderStatusFilter;
      const q = orderSearchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q) ||
        o.customer.eventCity.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  if (!open) return null;

  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const revenue = paidOrders.reduce((n, o) => n + o.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stock < 3);

  const renderPaymentBadge = (status: BookingOrder['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Lunas</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Menunggu</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/70 text-red-300 border border-red-800/60 flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Batal</span>;
    }
  };

  const renderRentalBadge = (status: BookingOrder['rentalStatus']) => {
    switch (status) {
      case 'booked':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950/70 text-blue-300 border border-blue-800/60">Terjadwal</span>;
      case 'active':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-800/60">Sedang Disewa</span>;
      case 'returned':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">Dikembalikan</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#0B0F19] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-500 bg-pink-950/60 px-2.5 py-0.5 rounded-full border border-pink-800/60">
                SOUNDRENT PRO CONTROL PANEL
              </span>
              <span className="text-xs text-slate-400">Pusat Operasional & Bisnis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
              Dashboard Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Kelola inventaris stok alat DJ, monitoring rental masuk, dan relasi pelanggan terpadu.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 font-bold text-xs flex items-center gap-2 transition-all shadow-sm shadow-violet-950"
            >
              <Boxes className="w-4 h-4 text-violet-400" />
              <span>Kelola Produk</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#131B2E] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tutup Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Switcher Utama */}
        <div className="flex items-center gap-1.5 bg-[#131B2E] p-1.5 rounded-2xl border border-slate-800/80 w-fit">
          <button
            onClick={() => setActiveTab('operasional')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'operasional'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>📊 Operasional Rental</span>
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'crm'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>👥 CRM Pelanggan & Pipeline</span>
          </button>
        </div>

        {/* Tab 1: Operasional Rental */}
        {activeTab === 'operasional' && (
          <div className="space-y-6">
            {/* Stat Cards Operasional */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Pesanan */}
              <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-pink-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pesanan</span>
                  <div className="p-2.5 rounded-xl bg-pink-950/50 border border-pink-800/50 text-pink-400">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{orders.length}</div>
                <p className="text-xs text-slate-400 mt-1">{paidOrders.length} transaksi telah lunas</p>
              </div>

              {/* Card 2: Pendapatan Lunas */}
              <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pendapatan Lunas</span>
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{formatRupiah(revenue)}</div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Total penerimaan sewa terverifikasi
                </p>
              </div>

              {/* Card 3: Produk Terdaftar */}
              <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-violet-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Produk Terdaftar</span>
                  <div className="p-2.5 rounded-xl bg-violet-950/50 border border-violet-800/50 text-violet-400">
                    <Boxes className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{products.length}</div>
                <p className="text-xs text-slate-400 mt-1">Katalog alat aktif di katalog rental</p>
              </div>

              {/* Card 4: Stok Menipis */}
              <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stok Menipis</span>
                  <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/50 text-amber-400">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{lowStockProducts.length}</div>
                <p className="text-xs text-amber-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Alat dengan stok &lt; 3 unit
                </p>
              </div>
            </div>

            {/* Tabel Pesanan Rental Terbaru */}
            <section className="bg-[#131B2E] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-base text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-pink-500" />
                    Proses Rental & Pesanan Masuk
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Daftar transaksi pesanan dari pelanggan di database</p>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari ID pesanan, nama, kota..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="bg-[#0B0F19] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="paid">Lunas (Paid)</option>
                    <option value="pending">Menunggu (Pending)</option>
                    <option value="cancelled">Batal (Cancelled)</option>
                  </select>
                </div>
              </div>

              {isLoadingOrders ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Memuat data transaksi pesanan...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  {orders.length === 0
                    ? 'Belum ada pesanan dari database. Pesanan yang masuk akan tampil di sini.'
                    : 'Tidak ada pesanan yang cocok dengan filter pencarian.'}
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#0B0F19]/40 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono font-bold text-xs text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800/50">
                            {order.id}
                          </span>
                          <span className="font-bold text-sm text-slate-200">
                            {order.customer.fullName}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({order.customer.eventCity})
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-slate-500" />
                            {order.items.length} item alat disewa
                          </span>
                          <span>•</span>
                          <span className="text-slate-300 font-mono">
                            Metode: {order.paymentMethod.toUpperCase()}
                          </span>
                        </div>

                        {/* Items snippet */}
                        <div className="text-xs text-slate-400 line-clamp-1 pt-0.5">
                          Alat: {order.items.map(i => `${i.product.name} (${i.quantity}x, ${i.rentalDays}hr)`).join(', ')}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end justify-between shrink-0 gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Transaksi</span>
                          <span className="text-base font-black text-emerald-400">
                            {formatRupiah(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderPaymentBadge(order.paymentStatus)}
                          {renderRentalBadge(order.rentalStatus)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab 2: CRM Module */}
        {activeTab === 'crm' && (
          <CRMDashboard />
        )}
      </div>
    </div>
  );
};

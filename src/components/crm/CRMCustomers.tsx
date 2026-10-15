import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Phone, Mail, MapPin, CreditCard, ChevronDown, ChevronUp, Save, X, User, Calendar, ShieldCheck, Check } from 'lucide-react';
import { CustomerCRM } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export interface CRMCustomersProps {
  customers: CustomerCRM[];
  onUpdateCustomer: (updated: CustomerCRM) => void;
  onAddCustomer: (customer: CustomerCRM) => void;
}

export const CRMCustomers: React.FC<CRMCustomersProps> = ({
  customers,
  onUpdateCustomer,
  onAddCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'Semua' | 'Regular' | 'Silver' | 'Gold' | 'VIP'>('Semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Local state for editing notes
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savedNotesAlert, setSavedNotesAlert] = useState<string | null>(null);

  // Add customer modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    idCardNumber: '',
    tier: 'Regular' as CustomerCRM['tier'],
    notes: ''
  });
  const [formError, setFormError] = useState('');

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesTier = tierFilter === 'Semua' || c.tier === tierFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q);
      return matchesTier && matchesSearch;
    });
  }, [customers, tierFilter, searchQuery]);

  const toggleExpand = (id: string, initialNotes?: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (editingNotes[id] === undefined) {
        setEditingNotes(prev => ({ ...prev, [id]: initialNotes || '' }));
      }
    }
  };

  const handleSaveNotes = (customer: CustomerCRM) => {
    const updatedNotes = editingNotes[customer.id] ?? customer.notes ?? '';
    onUpdateCustomer({ ...customer, notes: updatedNotes });
    setSavedNotesAlert(customer.id);
    setTimeout(() => setSavedNotesAlert(null), 2500);
  };

  const handleTierChange = (customer: CustomerCRM, newTier: CustomerCRM['tier']) => {
    onUpdateCustomer({ ...customer, tier: newTier });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.fullName.trim() || !newCustomer.phone.trim() || !newCustomer.email.trim()) {
      setFormError('Nama lengkap, nomor telepon, dan email wajib diisi.');
      return;
    }

    const created: CustomerCRM = {
      id: `crm-${Date.now()}`,
      fullName: newCustomer.fullName.trim(),
      phone: newCustomer.phone.trim(),
      email: newCustomer.email.trim(),
      address: newCustomer.address.trim() || '-',
      city: newCustomer.city.trim() || 'Jakarta',
      idCardNumber: newCustomer.idCardNumber.trim() || `317${Date.now().toString().slice(-13)}`,
      totalOrders: 0,
      totalSpent: 0,
      lastRentalDate: new Date().toISOString().split('T')[0],
      tier: newCustomer.tier,
      notes: newCustomer.notes.trim() || undefined
    };

    onAddCustomer(created);
    setIsModalOpen(false);
    setNewCustomer({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      idCardNumber: '',
      tier: 'Regular',
      notes: ''
    });
    setFormError('');
  };

  const renderTierBadge = (tier: CustomerCRM['tier']) => {
    switch (tier) {
      case 'VIP':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-800/60 shadow-sm shadow-fuchsia-950">VIP</span>;
      case 'Gold':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-800/60 shadow-sm shadow-amber-950">Gold</span>;
      case 'Silver':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 shadow-sm shadow-cyan-950">Silver</span>;
      case 'Regular':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">Regular</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Action Bar */}
      <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pelanggan berdasarkan nama, email, kota, telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B0F19] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Tier and Add Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="Semua" className="bg-[#131B2E] text-slate-200">Semua Tier</option>
              <option value="VIP" className="bg-[#131B2E] text-fuchsia-300">VIP</option>
              <option value="Gold" className="bg-[#131B2E] text-amber-300">Gold</option>
              <option value="Silver" className="bg-[#131B2E] text-cyan-300">Silver</option>
              <option value="Regular" className="bg-[#131B2E] text-slate-300">Regular</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-900/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pelanggan</span>
          </button>
        </div>
      </div>

      {/* Customer Count Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Menampilkan <strong className="text-slate-200">{filteredCustomers.length}</strong> dari {customers.length} total pelanggan</span>
        {tierFilter !== 'Semua' && (
          <span className="text-cyan-400">Filter aktif: Tier {tierFilter}</span>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#131B2E] border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0B0F19]/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Pelanggan</th>
              <th className="py-3.5 px-4">Kontak</th>
              <th className="py-3.5 px-4">Lokasi & KTP</th>
              <th className="py-3.5 px-4">Tier</th>
              <th className="py-3.5 px-4 text-right">Total Transaksi</th>
              <th className="py-3.5 px-4 text-center">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  Tidak ada pelanggan yang cocok dengan pencarian atau filter.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => {
                const isExpanded = expandedId === c.id;
                return (
                  <React.Fragment key={c.id}>
                    <tr className={`hover:bg-[#0B0F19]/40 transition-colors ${isExpanded ? 'bg-[#0B0F19]/60' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs border border-slate-700">
                            {c.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-200">{c.fullName}</p>
                            <p className="text-[10px] text-slate-400">ID: {c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500" /> {c.phone}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" /> {c.email}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-300 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-cyan-400" /> {c.city}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <CreditCard className="w-3 h-3 text-slate-500" /> {c.idCardNumber}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {renderTierBadge(c.tier)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="font-bold text-emerald-400">{formatRupiah(c.totalSpent)}</p>
                        <p className="text-[10px] text-slate-400">{c.totalOrders}x pesanan rental</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleExpand(c.id, c.notes)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Lihat Detail & Catatan"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-[#0B0F19]/90 border-b border-slate-800">
                        <td colSpan={6} className="p-4">
                          <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-slate-400 font-semibold block mb-1">Alamat Lengkap</span>
                                <p className="text-slate-200">{c.address || 'Belum diatur'}</p>
                              </div>
                              <div>
                                <span className="text-slate-400 font-semibold block mb-1">Terakhir Sewa</span>
                                <p className="text-slate-200 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                  {c.lastRentalDate ? new Date(c.lastRentalDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-400 font-semibold block mb-1">Ubah Tier Loyalitas</span>
                                <select
                                  value={c.tier}
                                  onChange={(e) => handleTierChange(c, e.target.value as any)}
                                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                                >
                                  <option value="Regular">Regular (&lt; 1jt)</option>
                                  <option value="Silver">Silver (1jt - 2jt)</option>
                                  <option value="Gold">Gold (2jt - 3jt)</option>
                                  <option value="VIP">VIP (&gt; 3jt)</option>
                                </select>
                              </div>
                            </div>

                            {/* Editable Notes */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-slate-300">
                                  Catatan Khusus Pelanggan (Preferensi rider DJ, riwayat klaim, atau kebutuhan khusus):
                                </label>
                                {savedNotesAlert === c.id && (
                                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                                    <Check className="w-3.5 h-3.5" /> Catatan berhasil disimpan!
                                  </span>
                                )}
                              </div>
                              <textarea
                                value={editingNotes[c.id] ?? c.notes ?? ''}
                                onChange={(e) => setEditingNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                                placeholder="Tuliskan catatan preferensi alat, kebiasaan event, atau catatan khusus pelanggan..."
                                rows={2}
                                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => handleSaveNotes(c)}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/60 text-xs font-bold flex items-center gap-1.5 transition-all"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Simpan Catatan</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            Tidak ada pelanggan yang sesuai dengan filter.
          </div>
        ) : (
          filteredCustomers.map((c) => {
            const isExpanded = expandedId === c.id;
            return (
              <div
                key={c.id}
                className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs border border-slate-700">
                      {c.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{c.fullName}</h4>
                      <p className="text-[10px] text-slate-400">{c.city} · ID: {c.id}</p>
                    </div>
                  </div>
                  {renderTierBadge(c.tier)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Transaksi</span>
                    <span className="font-bold text-emerald-400">{formatRupiah(c.totalSpent)}</span>
                    <span className="text-[10px] text-slate-500 block">{c.totalOrders}x sewa</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Kontak</span>
                    <span className="text-slate-300 block truncate">{c.phone}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{c.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(c.id, c.notes)}
                  className="w-full py-1.5 px-3 rounded-xl bg-[#0B0F19] text-slate-300 text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors font-medium"
                >
                  <span>{isExpanded ? 'Tutup Detail' : 'Lihat Detail & Catatan'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="pt-2 border-t border-slate-800 space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Alamat:</span>
                      <p className="text-slate-200 text-xs">{c.address || '-'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">NIK KTP:</span>
                      <p className="text-slate-200 text-xs">{c.idCardNumber}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold mb-1">Ubah Tier:</span>
                      <select
                        value={c.tier}
                        onChange={(e) => handleTierChange(c, e.target.value as any)}
                        className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold mb-1">Catatan Khusus:</span>
                      <textarea
                        value={editingNotes[c.id] ?? c.notes ?? ''}
                        onChange={(e) => setEditingNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                        rows={2}
                        className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                      <button
                        onClick={() => handleSaveNotes(c)}
                        className="mt-1.5 w-full py-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-lg font-bold text-xs"
                      >
                        Simpan Catatan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tambah Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Tambah Pelanggan CRM Baru</h3>
                  <p className="text-xs text-slate-400">Daftarkan pelanggan ke sistem database loyalitas</p>
                </div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setFormError(''); }}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: DJ Alika Chandra"
                    value={newCustomer.fullName}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp/HP *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: 081299887766"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="misal: alika@soundrent.id"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kota / Domisili *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Jakarta Selatan"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. KTP / SIM (Identitas)</label>
                  <input
                    type="text"
                    placeholder="317405..."
                    value={newCustomer.idCardNumber}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, idCardNumber: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tier Pelanggan</label>
                  <select
                    value={newCustomer.tier}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, tier: e.target.value as any }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alamat Pengiriman / Studio</label>
                <input
                  type="text"
                  placeholder="Jl. Thamrin No..."
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Khusus (Preferensi)</label>
                <textarea
                  rows={2}
                  placeholder="misal: Lebih suka CDJ versi firmware terbaru..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-md shadow-cyan-950"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ProductCategory, Product, CustomerCRM } from '../types';
import { 
  X, Plus, Trash2, Edit3, RefreshCw, CheckCircle2, 
  Database, Package, Sparkles, Users, Phone, Mail, 
  Award, MessageCircle, MapPin, Search, Save
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { INITIAL_CRM_CUSTOMERS } from '../data/crmData';

const CATEGORIES: ProductCategory[] = [
  'DJ Gear',
  'Gitar & Bass',
  'Drum & Perkusi',
  'Keyboard & Synth',
  'Sound System',
  'Microphone',
  'Lighting & Stage',
];

export const AdminProductManager: React.FC = () => {
  const { 
    products, 
    isAdminOpen, 
    setIsAdminOpen, 
    isBackendConnected, 
    reloadProducts,
    addNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    isLoadingProducts 
  } = useCart();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'crm'>('list');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // CRM state
  const [crmCustomers, setCrmCustomers] = useState<CustomerCRM[]>(() => {
    const saved = localStorage.getItem('borrowdj_crm_customers');
    return saved ? JSON.parse(saved) : INITIAL_CRM_CUSTOMERS;
  });
  const [crmSearch, setCrmSearch] = useState('');
  const [crmTierFilter, setCrmTierFilter] = useState<string>('Semua');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('DJ Gear');
  const [formDailyPrice, setFormDailyPrice] = useState<number>(250000);
  const [formStock, setFormStock] = useState<number>(3);
  const [formDeposit, setFormDeposit] = useState<number>(500000);
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formIsPromo, setFormIsPromo] = useState(false);
  const [formPromoDiscount, setFormPromoDiscount] = useState(10);
  const [formPromoTag, setFormPromoTag] = useState('PROMO SPESIAL');

  if (!isAdminOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('DJ Gear');
    setFormDailyPrice(250000);
    setFormStock(3);
    setFormDeposit(500000);
    setFormImage('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80');
    setFormDescription('');
    setFormFeatures('Unit berfungsi normal\nKondisi terawat prima\nKabel & aksesoris lengkap');
    setFormIsPromo(false);
    setFormPromoDiscount(0);
    setFormPromoTag('');
    setActiveTab('create');
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormCategory(prod.category);
    setFormDailyPrice(prod.dailyPrice);
    setFormStock(prod.stock);
    setFormDeposit(prod.depositAmount);
    setFormImage(prod.image);
    setFormDescription(prod.description);
    setFormFeatures(prod.features.join('\n'));
    setFormIsPromo(prod.isPromo);
    setFormPromoDiscount(prod.promoDiscountPercent || 0);
    setFormPromoTag(prod.promoTag || '');
    setActiveTab('create');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSaving(true);
    const parsedFeatures = formFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    try {
      if (editingProduct) {
        await updateExistingProduct(editingProduct.id, {
          name: formName,
          brand: formBrand,
          category: formCategory,
          dailyPrice: formDailyPrice,
          stock: formStock,
          depositAmount: formDeposit,
          image: formImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
          description: formDescription,
          features: parsedFeatures.length > 0 ? parsedFeatures : ['Unit siap pakai'],
          isPromo: formIsPromo,
          promoDiscountPercent: formIsPromo ? formPromoDiscount : 0,
          promoTag: formIsPromo ? formPromoTag : undefined,
        });
        showNotification(`Produk "${formName}" berhasil diperbarui!`);
      } else {
        await addNewProduct({
          id: `prod-${Date.now()}`,
          name: formName,
          brand: formBrand || 'Custom Brand',
          category: formCategory,
          dailyPrice: formDailyPrice,
          stock: formStock,
          depositAmount: formDeposit,
          image: formImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
          description: formDescription || 'Peralatan musik/DJ berkualitas siap sewa.',
          features: parsedFeatures.length > 0 ? parsedFeatures : ['Unit orisinil terawat'],
          specs: { 'Status': 'Siap Sewa', 'Kondisi': '98% Like New' },
          isPromo: formIsPromo,
          promoDiscountPercent: formIsPromo ? formPromoDiscount : 0,
          promoTag: formIsPromo ? formPromoTag : undefined,
          rating: 5.0,
          reviewsCount: 1,
          includedAccessories: ['Kabel Power AC', 'Kabel Konektor Utama'],
        });
        showNotification(`Produk baru "${formName}" berhasil disimpan ke Database!`);
      }
      setActiveTab('list');
      setEditingProduct(null);
    } catch (err: any) {
      showNotification(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;
    try {
      await deleteExistingProduct(id);
      showNotification(`Produk "${name}" berhasil dihapus.`);
    } catch (err: any) {
      showNotification(`Gagal menghapus: ${err.message}`);
    }
  };

  // CRM Functions
  const handleUpdateNote = (id: string) => {
    const updated = crmCustomers.map(c => c.id === id ? { ...c, notes: noteText } : c);
    setCrmCustomers(updated);
    localStorage.setItem('borrowdj_crm_customers', JSON.stringify(updated));
    setEditingNoteId(null);
    showNotification('Catatan pelanggan berhasil diperbarui!');
  };

  const handleChangeTier = (id: string, newTier: CustomerCRM['tier']) => {
    const updated = crmCustomers.map(c => c.id === id ? { ...c, tier: newTier } : c);
    setCrmCustomers(updated);
    localStorage.setItem('borrowdj_crm_customers', JSON.stringify(updated));
    showNotification(`Status loyalitas diubah menjadi ${newTier}`);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredCRM = crmCustomers.filter(c => {
    const matchSearch = c.fullName.toLowerCase().includes(crmSearch.toLowerCase()) ||
      c.phone.includes(crmSearch) ||
      c.city.toLowerCase().includes(crmSearch.toLowerCase()) ||
      c.idCardNumber.includes(crmSearch);
    const matchTier = crmTierFilter === 'Semua' || c.tier === crmTierFilter;
    return matchSearch && matchTier;
  });

  const totalSpentAll = crmCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrdersAll = crmCustomers.reduce((acc, c) => acc + c.totalOrders, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1A1520] border border-[#3D2E4F] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#120F1A] border-b border-[#3D2E4F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#221B2E] border border-[#C9849A]/40 flex items-center justify-center text-[#E8A0B4]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide font-['Outfit']">Admin BorrowDJ Dashboard</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                  isBackendConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {isBackendConnected ? 'Cloudflare D1 Aktif' : 'Local / Offline Cache'}
                </span>
              </div>
              <p className="text-xs text-[#A87BAC] mt-0.5">
                Kelola katalog produk sewa, stok, harga, serta Customer Relationship Management (CRM).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => reloadProducts()}
              disabled={isLoadingProducts}
              title="Refresh / Sinkronkan Data dari Database"
              className="p-2 text-slate-400 hover:text-[#E8A0B4] hover:bg-[#221B2E] rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isLoadingProducts ? 'animate-spin text-[#E8A0B4]' : ''}`} />
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-[#221B2E] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications Bar */}
        {notification && (
          <div className="px-6 py-2.5 bg-[#C9849A]/20 border-b border-[#C9849A]/40 text-[#F5EEF8] text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E8A0B4]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="px-6 py-3 bg-[#1A1520] border-b border-[#3D2E4F] flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-gradient-to-r from-[#8B5F96] to-[#C9849A] text-white shadow-md shadow-[#C9849A]/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#221B2E]'
              }`}
            >
              Daftar Produk ({products.length})
            </button>

            <button
              onClick={handleStartCreate}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-[#8B5F96] to-[#C9849A] text-white shadow-md shadow-[#C9849A]/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#221B2E]'
              }`}
            >
              <Plus className="w-4 h-4" />
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Asli'}
            </button>

            {/* CRM Tab */}
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'crm'
                  ? 'bg-gradient-to-r from-[#8B5F96] to-[#C9849A] text-white shadow-md shadow-[#C9849A]/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#221B2E]'
              }`}
            >
              <Users className="w-4 h-4 text-[#F7C59F]" />
              <span>Data Pelanggan (CRM)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#3D2E4F] text-[10px] text-white">
                {crmCustomers.length}
              </span>
            </button>
          </div>

          {activeTab === 'list' && (
            <input
              type="text"
              placeholder="Cari produk / brand..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white focus:outline-none focus:border-[#C9849A] w-48 sm:w-64"
            />
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-slate-200">
          
          {/* TAB 1: PRODUCT LIST */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p>Tidak ada produk yang cocok dengan pencarian.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredProducts.map((p) => (
                    <div 
                      key={p.id} 
                      className="flex items-center gap-3 p-3 bg-[#221B2E] border border-[#3D2E4F] hover:border-[#C9849A]/50 rounded-xl transition-all"
                    >
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-16 h-16 object-cover rounded-lg bg-slate-900 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-[#E8A0B4] bg-[#3D2E4F] px-1.5 py-0.5 rounded border border-[#C9849A]/30">
                            {p.category}
                          </span>
                          {p.isPromo && (
                            <span className="text-[10px] font-semibold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/40">
                              Diskon {p.promoDiscountPercent}%
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate mt-1">{p.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="text-[#F7C59F] font-bold">{formatRupiah(p.dailyPrice)}/hari</span>
                          <span>&bull;</span>
                          <span>Stok: <b className={p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>{p.stock}</b></span>
                          <span>&bull;</span>
                          <span>Deposit: {formatRupiah(p.depositAmount)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-[#E8A0B4] hover:bg-[#3D2E4F] rounded transition-colors"
                          title="Edit Produk"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#3D2E4F] rounded transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE / EDIT PRODUCT */}
          {activeTab === 'create' && (
            <form onSubmit={handleSaveProduct} className="space-y-4 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Contoh: Pioneer DJ CDJ-3000"
                    className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand / Merk *</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    placeholder="Contoh: Pioneer DJ, Yamaha, Fender, JBL"
                    className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tarif / Hari (Rp) *</label>
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      required
                      value={formDailyPrice}
                      onChange={e => setFormDailyPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Stok Unit *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formStock}
                      onChange={e => setFormStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Uang Deposit Jaminan (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formDeposit}
                    onChange={e => setFormDeposit(Number(e.target.value))}
                    placeholder="Contoh: 500000"
                    className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                  />
                  <p className="text-[11px] text-[#A87BAC] mt-0.5">Uang jaminan yang dikembalikan saat barang kembali aman.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL Foto Produk</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={e => setFormImage(e.target.value)}
                    placeholder="https://i.imgur.com/... atau URL foto"
                    className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Produk</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Deskripsikan fitur utama, kondisi barang, kelayakan konser/event..."
                  className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fitur Unggulan (1 baris per fitur)
                </label>
                <textarea
                  rows={2}
                  value={formFeatures}
                  onChange={e => setFormFeatures(e.target.value)}
                  placeholder="Touch screen 9 inch&#10;Resolusi 96kHz/32-bit&#10;Pro DJ Link Gigabit"
                  className="w-full px-3 py-2 bg-[#221B2E] border border-[#3D2E4F] rounded-lg text-white text-xs focus:outline-none focus:border-[#C9849A]"
                />
              </div>

              {/* Promo Switch (Diskon untuk item tertentu) */}
              <div className="p-3 bg-[#221B2E] border border-[#3D2E4F] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F7C59F]" />
                    <span className="text-xs font-semibold text-white">Status Promo Diskon Khusus Item Ini</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPromo}
                      onChange={e => setFormIsPromo(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9849A]"></div>
                  </label>
                </div>

                {formIsPromo && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#3D2E4F]">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Besar Diskon (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={formPromoDiscount}
                        onChange={e => setFormPromoDiscount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-[#1A1520] border border-[#3D2E4F] rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Label / Tag Promo</label>
                      <input
                        type="text"
                        value={formPromoTag}
                        onChange={e => setFormPromoTag(e.target.value)}
                        placeholder="Contoh: BEST DEAL 2026"
                        className="w-full px-2.5 py-1.5 bg-[#1A1520] border border-[#3D2E4F] rounded text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('list');
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#221B2E] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-gradient-to-r from-[#8B5F96] to-[#C9849A] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[#C9849A]/20 text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk Baru ke Database'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CUSTOMER RELATIONSHIP MANAGEMENT (CRM) */}
          {activeTab === 'crm' && (
            <div className="space-y-5">
              {/* CRM Key Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#221B2E] border border-[#3D2E4F]">
                  <span className="text-[10px] text-[#A87BAC] uppercase font-bold block">Total Pelanggan</span>
                  <div className="text-xl font-black text-white font-['Outfit'] mt-1">{crmCustomers.length} Orang</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">&uarr; Aktif Booking</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#221B2E] border border-[#3D2E4F]">
                  <span className="text-[10px] text-[#A87BAC] uppercase font-bold block">Total Nilai Sewa CRM</span>
                  <div className="text-xl font-black text-[#F7C59F] font-['Outfit'] mt-1">{formatRupiah(totalSpentAll)}</div>
                  <span className="text-[10px] text-slate-400">Dari {totalOrdersAll} Transaksi</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#221B2E] border border-[#3D2E4F]">
                  <span className="text-[10px] text-[#A87BAC] uppercase font-bold block">Pelanggan VIP</span>
                  <div className="text-xl font-black text-[#E8A0B4] font-['Outfit'] mt-1">
                    {crmCustomers.filter(c => c.tier === 'VIP').length} Orang
                  </div>
                  <span className="text-[10px] text-[#D4A5C0]">Prioritas Booking</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#221B2E] border border-[#3D2E4F]">
                  <span className="text-[10px] text-[#A87BAC] uppercase font-bold block">Rata-rata Sewa</span>
                  <div className="text-xl font-black text-white font-['Outfit'] mt-1">
                    {formatRupiah(Math.round(totalSpentAll / Math.max(1, totalOrdersAll)))}
                  </div>
                  <span className="text-[10px] text-slate-400">Per Transaksi</span>
                </div>
              </div>

              {/* CRM Search & Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#221B2E]/60 border border-[#3D2E4F]">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#A87BAC]" />
                  <input
                    type="text"
                    value={crmSearch}
                    onChange={e => setCrmSearch(e.target.value)}
                    placeholder="Cari pelanggan berdasarkan nama, nomor HP, kota, NIK..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1A1520] border border-[#3D2E4F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9849A]"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-slate-400">Tier:</span>
                  {['Semua', 'VIP', 'Gold', 'Silver', 'Regular'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setCrmTierFilter(tier)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        crmTierFilter === tier
                          ? 'bg-[#C9849A] text-white'
                          : 'bg-[#1A1520] text-slate-400 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer CRM Cards */}
              <div className="space-y-3">
                {filteredCRM.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-[#221B2E] border border-[#3D2E4F] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3D2E4F] pb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5F96] to-[#F7C59F] text-slate-950 font-black text-sm flex items-center justify-center">
                          {c.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white font-['Outfit']">{c.fullName}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              c.tier === 'VIP' ? 'bg-[#8B5F96] text-white border border-[#C9849A]' :
                              c.tier === 'Gold' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                              c.tier === 'Silver' ? 'bg-slate-800 text-slate-200 border border-slate-700' :
                              'bg-zinc-800 text-zinc-400'
                            }`}>
                              {c.tier} Member
                            </span>
                          </div>
                          <span className="text-[11px] text-[#A87BAC]">NIK: {c.idCardNumber}</span>
                        </div>
                      </div>

                      {/* WhatsApp Contact Action */}
                      <a
                        href={`https://wa.me/62${c.phone.replace(/^0/, '')}?text=Halo%20Kak%20${encodeURIComponent(c.fullName)}%2C%20kami%20dari%20BorrowDJ%20ingin%20follow%20up%20seputar%20sewa%20alat%20DJ...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp ({c.phone})</span>
                      </a>
                    </div>

                    {/* Customer Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div>
                        <span className="text-[10px] text-[#A87BAC] block">Alamat / Lokasi</span>
                        <span className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{c.city} &bull; {c.address}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#A87BAC] block">Statistik Sewa</span>
                        <span className="mt-0.5 block">
                          <strong>{c.totalOrders}x Sewa</strong> &bull; Total: <strong className="text-[#F7C59F]">{formatRupiah(c.totalSpent)}</strong>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#A87BAC] block">Sewa Terakhir &amp; Ganti Tier</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span>{c.lastRentalDate}</span>
                          <select
                            value={c.tier}
                            onChange={e => handleChangeTier(c.id, e.target.value as CustomerCRM['tier'])}
                            className="px-2 py-0.5 bg-[#1A1520] border border-[#3D2E4F] rounded text-[10px] text-white"
                          >
                            <option value="Regular">Regular</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="VIP">VIP</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Admin Notes Box */}
                    <div className="p-2.5 rounded-xl bg-[#1A1520] border border-[#3D2E4F]/60 flex items-center justify-between gap-2 text-xs">
                      {editingNoteId === c.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded bg-[#221B2E] border border-[#C9849A] text-xs text-white focus:outline-none"
                            placeholder="Tulis catatan CRM tentang pelanggan ini..."
                          />
                          <button
                            onClick={() => handleUpdateNote(c.id)}
                            className="px-2.5 py-1 bg-[#C9849A] text-white rounded text-xs font-bold flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <p className="text-[11px] text-[#D4A5C0]">
                            <strong>Catatan CRM:</strong> {c.notes || 'Belum ada catatan khusus.'}
                          </p>
                          <button
                            onClick={() => {
                              setEditingNoteId(c.id);
                              setNoteText(c.notes || '');
                            }}
                            className="text-[10px] font-semibold text-[#E8A0B4] hover:underline"
                          >
                            Edit Catatan
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

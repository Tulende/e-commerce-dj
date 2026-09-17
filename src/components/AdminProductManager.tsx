import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ProductCategory, Product } from '../types';
import { 
  X, Plus, Trash2, Edit3, RefreshCw, CheckCircle2, 
  Database, Package, Sparkles
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

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

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">Kelola Data Produk</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                  isBackendConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {isBackendConnected ? 'Cloudflare D1 Connected' : 'Local / Offline Cache'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola katalog barang asli, tarif sewa harian, uang deposit, dan stok live di database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => reloadProducts()}
              disabled={isLoadingProducts}
              title="Refresh / Sinkronkan Data dari Database"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isLoadingProducts ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications Bar */}
        {notification && (
          <div className="px-6 py-2.5 bg-cyan-500/10 border-b border-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'list'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Daftar Produk ({products.length})
            </button>
            <button
              onClick={handleStartCreate}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Asli'}
            </button>
          </div>

          {activeTab === 'list' && (
            <input
              type="text"
              placeholder="Cari produk / brand..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="px-3 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
            />
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'list' ? (
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
                      className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all"
                    >
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-16 h-16 object-cover rounded-lg bg-slate-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            {p.category}
                          </span>
                          {p.isPromo && (
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/40">
                              Promo -{p.promoDiscountPercent}%
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate mt-1">{p.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="text-cyan-300 font-medium">{formatRupiah(p.dailyPrice)}/hari</span>
                          <span>•</span>
                          <span>Stok: <b className={p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>{p.stock}</b></span>
                          <span>•</span>
                          <span>Deposit: {formatRupiah(p.depositAmount)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                          title="Edit Produk"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
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
          ) : (
            /* Form Tambah / Edit Produk */
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
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
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
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
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">Uang jaminan yang dikembalikan saat barang kembali aman.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL Foto Produk</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={e => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Produk</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Deskripsikan fitur utama, kondisi barang, kelayakan konser/event..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fitur Unggulan (1 baris per fitur)
                </label>
                <textarea
                  rows={3}
                  value={formFeatures}
                  onChange={e => setFormFeatures(e.target.value)}
                  placeholder="Touch screen 9 inch&#10;Resolusi 96kHz/32-bit&#10;Pro DJ Link Gigabit"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Promo Switch */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">Status Promo Diskon</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPromo}
                      onChange={e => setFormIsPromo(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                {formIsPromo && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Besar Diskon (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={formPromoDiscount}
                        onChange={e => setFormPromoDiscount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Label / Tag Promo</label>
                      <input
                        type="text"
                        value={formPromoTag}
                        onChange={e => setFormPromoTag(e.target.value)}
                        placeholder="Contoh: BEST DEAL 2026"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs"
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
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/20 text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk Baru ke Database'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

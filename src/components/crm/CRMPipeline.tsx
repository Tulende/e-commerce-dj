import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, DollarSign, Calendar, FileText, X, Sparkles, CheckCircle2, AlertOctagon, HelpCircle, Layers } from 'lucide-react';
import { PipelineDeal, PipelineStage } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export interface CRMPipelineProps {
  deals: PipelineDeal[];
  onUpdateDeal: (updated: PipelineDeal) => void;
  onAddDeal: (deal: PipelineDeal) => void;
}

const STAGES: { key: PipelineStage; label: string; description: string; headerColor: string; cardBg: string; borderColor: string; badgeColor: string }[] = [
  {
    key: 'lead',
    label: 'Lead Masuk',
    description: 'Inkuiri sewa baru',
    headerColor: 'text-blue-400',
    cardBg: 'bg-blue-950/20',
    borderColor: 'border-blue-900/60',
    badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800/60'
  },
  {
    key: 'negosiasi',
    label: 'Negosiasi',
    description: 'Penawaran & rider',
    headerColor: 'text-amber-400',
    cardBg: 'bg-amber-950/20',
    borderColor: 'border-amber-900/60',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60'
  },
  {
    key: 'deal',
    label: 'Deal / DP',
    description: 'Menunggu DP / Siap kirim',
    headerColor: 'text-fuchsia-400',
    cardBg: 'bg-fuchsia-950/20',
    borderColor: 'border-fuchsia-900/60',
    badgeColor: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800/60'
  },
  {
    key: 'selesai',
    label: 'Selesai / Lunas',
    description: 'Barang kembali & lunas',
    headerColor: 'text-emerald-400',
    cardBg: 'bg-emerald-950/20',
    borderColor: 'border-emerald-900/60',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
  },
  {
    key: 'batal',
    label: 'Batal',
    description: 'Batal / Venue reschedule',
    headerColor: 'text-red-400',
    cardBg: 'bg-red-950/15',
    borderColor: 'border-red-900/30',
    badgeColor: 'bg-red-950/80 text-red-300 border-red-800/60'
  }
];

export const CRMPipeline: React.FC<CRMPipelineProps> = ({
  deals,
  onUpdateDeal,
  onAddDeal
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    customerName: '',
    value: 1500000,
    stage: 'lead' as PipelineStage,
    expectedCloseDate: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');

  const stageKeys = STAGES.map(s => s.key);

  const moveStage = (deal: PipelineDeal, direction: 'prev' | 'next') => {
    const currentIndex = stageKeys.indexOf(deal.stage);
    if (currentIndex === -1) return;

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < stageKeys.length) {
      const nextStage = stageKeys[newIndex];
      onUpdateDeal({
        ...deal,
        stage: nextStage,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title.trim() || !newDeal.customerName.trim() || newDeal.value <= 0) {
      setFormError('Mohon isi judul deal, nama pelanggan, dan nilai rental yang valid.');
      return;
    }

    const created: PipelineDeal = {
      id: `deal-${Date.now()}`,
      customerId: `crm-${Date.now()}`,
      customerName: newDeal.customerName.trim(),
      title: newDeal.title.trim(),
      stage: newDeal.stage,
      value: Number(newDeal.value),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      expectedCloseDate: newDeal.expectedCloseDate || undefined,
      notes: newDeal.notes.trim() || undefined
    };

    onAddDeal(created);
    setIsAddModalOpen(false);
    setNewDeal({
      title: '',
      customerName: '',
      value: 1500000,
      stage: 'lead',
      expectedCloseDate: '',
      notes: ''
    });
    setFormError('');
  };

  const totalPipelineValue = deals
    .filter(d => ['lead', 'negosiasi', 'deal'].includes(d.stage))
    .reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="space-y-5">
      {/* Top Header / Action Bar */}
      <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-fuchsia-400" />
              Pipeline Kanban Board
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-800/50">
              {deals.length} Total Deals
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total potensi pipeline aktif: <strong className="text-emerald-400 font-bold">{formatRupiah(totalPipelineValue)}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-fuchsia-950/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Deal Baru</span>
        </button>
      </div>

      {/* 5-Column Kanban Board with Horizontal Scroll on Mobile/Tablet */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-5 gap-3.5 min-w-[1100px]">
          {STAGES.map((col) => {
            const colDeals = deals.filter(d => d.stage === col.key);
            const colTotalValue = colDeals.reduce((sum, d) => sum + d.value, 0);
            const colIndex = stageKeys.indexOf(col.key);

            return (
              <div
                key={col.key}
                className={`flex flex-col rounded-2xl border ${col.borderColor} ${col.cardBg} backdrop-blur-sm p-3.5 min-h-[500px]`}
              >
                {/* Column Header */}
                <div className="mb-3.5 pb-2.5 border-b border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>
                      {col.label}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                      {colDeals.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{col.description}</p>
                  <div className="mt-1.5 text-xs font-black text-slate-200">
                    {formatRupiah(colTotalValue)}
                  </div>
                </div>

                {/* Column Deals List */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                  {colDeals.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-3 rounded-xl border border-dashed border-slate-800/80 text-slate-500 text-[11px]">
                      <span>Belum ada deal di tahap ini</span>
                    </div>
                  ) : (
                    colDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-[#131B2E] border border-slate-800/90 hover:border-slate-700 rounded-xl p-3.5 space-y-2.5 shadow-md shadow-black/20 group transition-all"
                      >
                        {/* Deal Title & Customer */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {deal.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
                            {deal.customerName}
                          </p>
                        </div>

                        {/* Value & Date */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/70">
                          <span className="font-extrabold text-emerald-400">
                            {formatRupiah(deal.value)}
                          </span>
                          {deal.expectedCloseDate && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {deal.expectedCloseDate.slice(5)}
                            </span>
                          )}
                        </div>

                        {/* Notes snippet */}
                        {deal.notes && (
                          <p className="text-[11px] text-slate-400 italic bg-[#0B0F19]/60 p-2 rounded-lg line-clamp-2 border border-slate-800/50">
                            "{deal.notes}"
                          </p>
                        )}

                        {/* Stage Navigator Arrows */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                          <button
                            onClick={() => moveStage(deal, 'prev')}
                            disabled={colIndex === 0}
                            className={`p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-semibold transition-all ${
                              colIndex === 0
                                ? 'text-slate-600 bg-slate-900/50 cursor-not-allowed'
                                : 'text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white'
                            }`}
                            title="Pindah ke tahap sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Mundur</span>
                          </button>

                          <button
                            onClick={() => moveStage(deal, 'next')}
                            disabled={colIndex === stageKeys.length - 1}
                            className={`p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-semibold transition-all ${
                              colIndex === stageKeys.length - 1
                                ? 'text-slate-600 bg-slate-900/50 cursor-not-allowed'
                                : 'text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white'
                            }`}
                            title="Pindah ke tahap berikutnya"
                          >
                            <span>Maju</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Tambah Deal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-fuchsia-950/60 border border-fuchsia-800/50 text-fuchsia-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Tambah Peluang Rental (Deal)</h3>
                  <p className="text-xs text-slate-400">Masukkan inkuiri atau penawaran baru ke pipeline</p>
                </div>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setFormError(''); }}
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

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul / Paket Sewa *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Sewa Pioneer DDJ-REV7 + Speaker Monitor 2 Hari"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Pelanggan *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: DJ Rendy Mahesa"
                    value={newDeal.customerName}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nilai Sewa Estimasi (IDR) *</label>
                  <input
                    type="number"
                    required
                    min={100000}
                    step={50000}
                    value={newDeal.value}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tahap Awal (Stage)</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, stage: e.target.value as PipelineStage }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-fuchsia-500 cursor-pointer"
                  >
                    <option value="lead">Lead Masuk</option>
                    <option value="negosiasi">Negosiasi</option>
                    <option value="deal">Deal / DP</option>
                    <option value="selesai">Selesai / Lunas</option>
                    <option value="batal">Batal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Tanggal Selesai</label>
                  <input
                    type="date"
                    value={newDeal.expectedCloseDate}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Tambahan / Kebutuhan Acara</label>
                <textarea
                  rows={2}
                  placeholder="misal: Membutuhkan kabel RCA to XLR tambahan dan stand tripod..."
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold transition-all shadow-md shadow-fuchsia-950"
                >
                  Simpan Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

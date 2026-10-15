import React, { useState, useMemo } from 'react';
import { Plus, Check, Clock, Calendar, AlertTriangle, MessageSquare, Tag, Gift, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { FollowUp } from '../../types';

export interface CRMFollowUpsProps {
  followUps: FollowUp[];
  onToggle: (id: string) => void;
  onAdd: (fu: FollowUp) => void;
}

export const CRMFollowUps: React.FC<CRMFollowUpsProps> = ({
  followUps,
  onToggle,
  onAdd
}) => {
  const [filterTab, setFilterTab] = useState<'semua' | 'mendatang' | 'selesai'>('mendatang');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    customerName: '',
    type: 'follow_up_lead' as FollowUp['type'],
    message: '',
    scheduledDate: new Date().toISOString().split('T')[0]
  });
  const [formError, setFormError] = useState('');

  // Sorted and filtered list
  const filteredFollowUps = useMemo(() => {
    return followUps
      .filter((fu) => {
        if (filterTab === 'mendatang') return !fu.isDone;
        if (filterTab === 'selesai') return fu.isDone;
        return true;
      })
      .sort((a, b) => {
        // Sort by scheduledDate ascending for pending, descending for finished
        const dateA = new Date(a.scheduledDate).getTime();
        const dateB = new Date(b.scheduledDate).getTime();
        if (filterTab === 'selesai') return dateB - dateA;
        return dateA - dateB;
      });
  }, [followUps, filterTab]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUp.customerName.trim() || !newFollowUp.message.trim() || !newFollowUp.scheduledDate) {
      setFormError('Mohon isi nama pelanggan, tanggal follow-up, dan pesan agenda.');
      return;
    }

    const created: FollowUp = {
      id: `fu-${Date.now()}`,
      customerId: `crm-${Date.now()}`,
      customerName: newFollowUp.customerName.trim(),
      type: newFollowUp.type,
      message: newFollowUp.message.trim(),
      scheduledDate: newFollowUp.scheduledDate,
      isDone: false
    };

    onAdd(created);
    setIsAddModalOpen(false);
    setNewFollowUp({
      customerName: '',
      type: 'follow_up_lead',
      message: '',
      scheduledDate: new Date().toISOString().split('T')[0]
    });
    setFormError('');
  };

  const renderTypeBadge = (type: FollowUp['type']) => {
    switch (type) {
      case 'jatuh_tempo':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/70 text-red-300 border border-red-800/60 flex items-center gap-1">⏰ Jatuh Tempo</span>;
      case 'follow_up_lead':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/70 text-blue-300 border border-blue-800/60 flex items-center gap-1">🎯 Follow Up Lead</span>;
      case 'ucapan':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">🎉 Ucapan & Loyalty</span>;
      case 'penawaran':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-800/60 flex items-center gap-1">💼 Penawaran Promo</span>;
      default:
        return null;
    }
  };

  const getRelativeDateLabel = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return <span className="text-amber-400 font-bold">Hari ini</span>;
    if (diffDays === 1) return <span className="text-cyan-400 font-medium">Besok</span>;
    if (diffDays === -1) return <span className="text-red-400 font-bold">Kemarin (Lewat)</span>;
    if (diffDays < -1) return <span className="text-red-400 font-bold">Terlewat {Math.abs(diffDays)} hari</span>;
    return <span className="text-slate-400">{diffDays} hari lagi</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header and Filter Tabs */}
      <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex gap-1.5 bg-[#0B0F19] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterTab('mendatang')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'mendatang'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mendatang ({followUps.filter(f => !f.isDone).length})</span>
          </button>
          <button
            onClick={() => setFilterTab('selesai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'selesai'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesai ({followUps.filter(f => f.isDone).length})</span>
          </button>
          <button
            onClick={() => setFilterTab('semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterTab === 'semua'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({followUps.length})
          </button>
        </div>

        {/* Add Follow Up Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Follow-Up</span>
        </button>
      </div>

      {/* Follow-Ups List */}
      <div className="space-y-3">
        {filteredFollowUps.length === 0 ? (
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            {filterTab === 'mendatang'
              ? 'Tidak ada agenda follow-up mendatang. Kerja bagus!'
              : 'Belum ada agenda yang sesuai dengan filter ini.'}
          </div>
        ) : (
          filteredFollowUps.map((fu) => (
            <div
              key={fu.id}
              className={`bg-[#131B2E] border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                fu.isDone
                  ? 'border-slate-800/60 opacity-60 bg-[#131B2E]/60'
                  : 'border-slate-800/90 hover:border-amber-500/40 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Done toggle checkbox button */}
                <button
                  onClick={() => onToggle(fu.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                    fu.isDone
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm shadow-emerald-900'
                      : 'bg-[#0B0F19] border-slate-700 hover:border-amber-500 text-transparent hover:text-amber-400'
                  }`}
                  title={fu.isDone ? 'Tandai Belum Selesai' : 'Tandai Sudah Selesai'}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-bold ${fu.isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {fu.customerName}
                    </span>
                    {renderTypeBadge(fu.type)}
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(fu.scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {!fu.isDone && (
                        <span className="text-[11px] font-medium ml-1">
                          ({getRelativeDateLabel(fu.scheduledDate)})
                        </span>
                      )}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${fu.isDone ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {fu.message}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="self-end sm:self-center shrink-0">
                <button
                  onClick={() => onToggle(fu.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    fu.isDone
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      : 'bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900/80 border border-emerald-800/60 font-bold'
                  }`}
                >
                  {fu.isDone ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Batal Selesai</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tandai Selesai</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Follow-Up */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Jadwalkan Follow-Up Pelanggan</h3>
                  <p className="text-xs text-slate-400">Pasang reminder komunikasi, jatuh tempo sewa, atau penawaran</p>
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
                <label className="block text-slate-300 font-semibold mb-1">Nama Pelanggan *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: DJ Nadya Putri"
                  value={newFollowUp.customerName}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Agenda</label>
                  <select
                    value={newFollowUp.type}
                    onChange={(e) => setNewFollowUp(prev => ({ ...prev, type: e.target.value as FollowUp['type'] }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="follow_up_lead">Follow Up Lead Inkuiri</option>
                    <option value="penawaran">Penawaran Paket / Promo</option>
                    <option value="jatuh_tempo">Jatuh Tempo Pembayaran/Sewa</option>
                    <option value="ucapan">Ucapan Selamat & Loyalty VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Rencana *</label>
                  <input
                    type="date"
                    required
                    value={newFollowUp.scheduledDate}
                    onChange={(e) => setNewFollowUp(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pesan / Agenda Komunikasi *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="misal: Kirim pesan WhatsApp konfirmasi rider sound system dan ingatkan transfer DP 50%..."
                  value={newFollowUp.message}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold transition-all shadow-md shadow-amber-950"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, LifeBuoy, AlertCircle, Clock, CheckCircle2, ChevronDown, ChevronUp, X, User, Tag, Calendar, AlertTriangle } from 'lucide-react';
import { SupportTicket } from '../../types';

export interface CRMTicketsProps {
  tickets: SupportTicket[];
  onUpdateTicket: (updated: SupportTicket) => void;
  onAddTicket: (ticket: SupportTicket) => void;
}

export const CRMTickets: React.FC<CRMTicketsProps> = ({
  tickets,
  onUpdateTicket,
  onAddTicket
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | SupportTicket['status']>('semua');
  const [priorityFilter, setPriorityFilter] = useState<'semua' | SupportTicket['priority']>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal tambah tiket
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customerName: '',
    subject: '',
    description: '',
    priority: 'medium' as SupportTicket['priority'],
    status: 'open' as SupportTicket['status']
  });
  const [formError, setFormError] = useState('');

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = statusFilter === 'semua' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'semua' || t.priority === priorityFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        t.subject.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchStatus && matchPriority && matchSearch;
    });
  }, [tickets, statusFilter, priorityFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleStatusChange = (ticket: SupportTicket, newStatus: SupportTicket['status']) => {
    const isResolvedOrClosed = newStatus === 'resolved' || newStatus === 'closed';
    onUpdateTicket({
      ...ticket,
      status: newStatus,
      resolvedAt: isResolvedOrClosed ? (ticket.resolvedAt || new Date().toISOString().split('T')[0]) : undefined
    });
  };

  const handlePriorityChange = (ticket: SupportTicket, newPriority: SupportTicket['priority']) => {
    onUpdateTicket({
      ...ticket,
      priority: newPriority
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.customerName.trim() || !newTicket.description.trim()) {
      setFormError('Mohon lengkapi nama pelanggan, subjek tiket, dan deskripsi masalah.');
      return;
    }

    const created: SupportTicket = {
      id: `ticket-${Date.now()}`,
      customerId: `crm-${Date.now()}`,
      customerName: newTicket.customerName.trim(),
      subject: newTicket.subject.trim(),
      description: newTicket.description.trim(),
      priority: newTicket.priority,
      status: newTicket.status,
      createdAt: new Date().toISOString().split('T')[0],
      resolvedAt: newTicket.status === 'resolved' ? new Date().toISOString().split('T')[0] : undefined
    };

    onAddTicket(created);
    setIsAddModalOpen(false);
    setNewTicket({
      customerName: '',
      subject: '',
      description: '',
      priority: 'medium',
      status: 'open'
    });
    setFormError('');
  };

  const renderStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950/70 text-red-300 border border-red-800/60 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Baru (Open)</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1"><Clock className="w-3 h-3" /> Diproses</span>;
      case 'resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">Ditutup</span>;
    }
  };

  const renderPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-950 text-rose-300 border border-rose-800/70 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/60 text-amber-300 border border-amber-800/50">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">Low</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tiket kendala, nama pelanggan, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B0F19] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="semua" className="bg-[#131B2E]">Semua Status</option>
              <option value="open" className="bg-[#131B2E]">Open</option>
              <option value="in_progress" className="bg-[#131B2E]">In Progress</option>
              <option value="resolved" className="bg-[#131B2E]">Resolved</option>
              <option value="closed" className="bg-[#131B2E]">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Prioritas:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="semua" className="bg-[#131B2E]">Semua Prioritas</option>
              <option value="high" className="bg-[#131B2E]">High</option>
              <option value="medium" className="bg-[#131B2E]">Medium</option>
              <option value="low" className="bg-[#131B2E]">Low</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tiket</span>
          </button>
        </div>
      </div>

      {/* Ticket List Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Menampilkan <strong className="text-slate-200">{filteredTickets.length}</strong> tiket bantuan</span>
        <span className="text-amber-400">
          {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length} butuh tindak lanjut
        </span>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            Tidak ada tiket bantuan yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <div
                key={t.id}
                className={`bg-[#131B2E] border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isExpanded ? 'border-amber-500/40 shadow-lg shadow-amber-950/20' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Main Card Row */}
                <div
                  onClick={() => toggleExpand(t.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 shrink-0 mt-0.5">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{t.id}</span>
                        {renderPriorityBadge(t.priority)}
                        {renderStatusBadge(t.status)}
                      </div>
                      <h4 className="text-sm font-bold text-slate-100">{t.subject}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span className="text-slate-300 font-medium">{t.customerName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(t.id); }}
                      className="p-2 rounded-xl bg-[#0B0F19] text-slate-400 hover:text-white transition-colors"
                      title={isExpanded ? 'Tutup Detail' : 'Buka Detail'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detail View */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-slate-800/80 bg-[#0B0F19]/40 space-y-4 text-xs">
                    <div>
                      <h5 className="font-semibold text-slate-300 mb-1.5">Deskripsi Kendala & Pertanyaan:</h5>
                      <div className="p-3.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-slate-200 leading-relaxed">
                        {t.description}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
                      {/* Change Status Fast Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-400 font-semibold mr-1">Ubah Status:</span>
                        <button
                          onClick={() => handleStatusChange(t, 'open')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            t.status === 'open'
                              ? 'bg-red-950 text-red-300 border border-red-700'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Open
                        </button>
                        <button
                          onClick={() => handleStatusChange(t, 'in_progress')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            t.status === 'in_progress'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => handleStatusChange(t, 'resolved')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            t.status === 'resolved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Resolved
                        </button>
                        <button
                          onClick={() => handleStatusChange(t, 'closed')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            t.status === 'closed'
                              ? 'bg-slate-700 text-slate-200 border border-slate-600'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Closed
                        </button>
                      </div>

                      {/* Change Priority */}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-semibold">Ubah Prioritas:</span>
                        <select
                          value={t.priority}
                          onChange={(e) => handlePriorityChange(t, e.target.value as any)}
                          className="bg-[#0B0F19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    {t.resolvedAt && (
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Diselesaikan pada: {new Date(t.resolvedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tambah Tiket */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Buat Tiket Bantuan Baru</h3>
                  <p className="text-xs text-slate-400">Catat kendala teknis atau pengaduan pelanggan rental</p>
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
                  value={newTicket.customerName}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subjek Masalah *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Suara channel 2 mixer kemresek / kabel RCA berdengung"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prioritas</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="low">Low (Pertanyaan umum)</option>
                    <option value="medium">Medium (Kendala operasional minor)</option>
                    <option value="high">High (Alat bermasalah saat gig)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Awal</label>
                  <select
                    value={newTicket.status}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="open">Open (Baru)</option>
                    <option value="in_progress">In Progress (Sedang ditangani)</option>
                    <option value="resolved">Resolved (Sudah selesai)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Lengkap Kendala *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan detail masalah, kondisi di venue, atau alat yang terlibat..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold transition-all shadow-md shadow-amber-950"
                >
                  Simpan Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

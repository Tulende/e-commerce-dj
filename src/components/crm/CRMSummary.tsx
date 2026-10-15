import React from 'react';
import { Users, Wallet, GitPullRequest, LifeBuoy, Clock, CheckCircle2, Sparkles, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { CustomerCRM, PipelineDeal, SupportTicket, FollowUp } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export interface CRMSummaryProps {
  customers: CustomerCRM[];
  pipeline: PipelineDeal[];
  tickets: SupportTicket[];
  followUps: FollowUp[];
  onToggleFollowUp: (id: string) => void;
}

export const CRMSummary: React.FC<CRMSummaryProps> = ({
  customers,
  pipeline,
  tickets,
  followUps,
  onToggleFollowUp
}) => {
  // Stat calculations
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const activePipelineDeals = pipeline.filter(d => ['lead', 'negosiasi', 'deal'].includes(d.stage));
  const activePipelineValue = activePipelineDeals.reduce((acc, d) => acc + d.value, 0);
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const highPriorityTickets = tickets.filter(t => t.priority === 'high' && t.status !== 'closed' && t.status !== 'resolved');

  // Tier distributions
  const tierCounts = {
    VIP: customers.filter(c => c.tier === 'VIP').length,
    Gold: customers.filter(c => c.tier === 'Gold').length,
    Silver: customers.filter(c => c.tier === 'Silver').length,
    Regular: customers.filter(c => c.tier === 'Regular').length,
  };

  const getTierPercent = (count: number) => {
    if (totalCustomers === 0) return 0;
    return Math.round((count / totalCustomers) * 100);
  };

  // Static / popular rental items extracted from deals
  const popularRentals = [
    { name: 'Pioneer DDJ-FLX10 4-Channel DJ Controller', category: 'DJ Gear', count: 6, tag: 'Favorit DJ SCBD' },
    { name: 'Paket DJM-900NXS2 + 2x CDJ-3000 Standard Club', category: 'DJ Gear', count: 5, tag: 'Standard Club' },
    { name: 'Paket Sound System Active 5000W + Wireless Mic', category: 'Sound System', count: 4, tag: 'Best Seller Event' },
    { name: 'Roland FANTOM-08 88-Key Synthesizer Workstation', category: 'Keyboard', count: 3, tag: 'Rider Artis' },
    { name: 'Stage Lighting Beam 230W 7R + Par LED Moving Head', category: 'Lighting', count: 3, tag: 'Lighting Show' },
  ];

  // Top 3 upcoming follow-ups
  const pendingFollowUps = followUps
    .filter(fu => !fu.isDone)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 3);

  const getFollowUpTypeBadge = (type: FollowUp['type']) => {
    switch (type) {
      case 'jatuh_tempo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950/70 text-red-300 border border-red-800/60">⏰ Jatuh Tempo</span>;
      case 'follow_up_lead':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/70 text-blue-300 border border-blue-800/60">🎯 Follow Up Lead</span>;
      case 'ucapan':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">🎉 Ucapan & Loyalty</span>;
      case 'penawaran':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-800/60">💼 Penawaran Promo</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Pelanggan */}
        <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pelanggan</span>
            <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/50 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{totalCustomers}</div>
          <div className="mt-2 flex items-center text-xs text-slate-400 gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>{tierCounts.VIP + tierCounts.Gold} Pelanggan Prioritas (VIP & Gold)</span>
          </div>
        </div>

        {/* Card 2: Total Pendapatan */}
        <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{formatRupiah(totalRevenue)}</div>
          <div className="mt-2 flex items-center text-xs text-emerald-400 gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Akumulasi sewa dari pelanggan terdaftar</span>
          </div>
        </div>

        {/* Card 3: Pipeline Aktif */}
        <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-fuchsia-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pipeline Aktif</span>
            <div className="p-2.5 rounded-xl bg-fuchsia-950/50 border border-fuchsia-800/50 text-fuchsia-400">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{activePipelineDeals.length} Deal</div>
          <div className="mt-2 flex items-center text-xs text-fuchsia-400 gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Potensi nilai: {formatRupiah(activePipelineValue)}</span>
          </div>
        </div>

        {/* Card 4: Tiket Open */}
        <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tiket Open</span>
            <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/50 text-amber-400">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{openTickets.length} Tiket</div>
          <div className="mt-2 flex items-center text-xs text-amber-400 gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{highPriorityTickets.length} Prioritas Tinggi butuh respon</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Distribusi Tier & Produk Sering Disewa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Tier Pelanggan */}
        <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Distribusi Tier Pelanggan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Segmentasi loyalitas berdasarkan riwayat rental</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              {totalCustomers} Customer
            </span>
          </div>

          {/* Progress Bar Tier Segments */}
          <div className="space-y-4">
            {/* Visual Multi-segment Bar */}
            <div className="h-3 w-full bg-slate-800/90 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${getTierPercent(tierCounts.VIP)}%` }}
                className="bg-fuchsia-500 h-full transition-all duration-500"
                title={`VIP: ${tierCounts.VIP} (${getTierPercent(tierCounts.VIP)}%)`}
              />
              <div
                style={{ width: `${getTierPercent(tierCounts.Gold)}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Gold: ${tierCounts.Gold} (${getTierPercent(tierCounts.Gold)}%)`}
              />
              <div
                style={{ width: `${getTierPercent(tierCounts.Silver)}%` }}
                className="bg-cyan-500 h-full transition-all duration-500"
                title={`Silver: ${tierCounts.Silver} (${getTierPercent(tierCounts.Silver)}%)`}
              />
              <div
                style={{ width: `${getTierPercent(tierCounts.Regular)}%` }}
                className="bg-slate-500 h-full transition-all duration-500"
                title={`Regular: ${tierCounts.Regular} (${getTierPercent(tierCounts.Regular)}%)`}
              />
            </div>

            {/* Individual Tier Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* VIP */}
              <div className="bg-[#0B0F19]/80 border border-fuchsia-900/40 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-fuchsia-500 shadow-sm shadow-fuchsia-500/50"></span>
                  <div>
                    <span className="text-xs font-bold text-fuchsia-300">VIP</span>
                    <p className="text-[10px] text-slate-400">&gt; Rp 3.000.000</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{tierCounts.VIP}</span>
                  <p className="text-[10px] text-slate-400">{getTierPercent(tierCounts.VIP)}%</p>
                </div>
              </div>

              {/* Gold */}
              <div className="bg-[#0B0F19]/80 border border-amber-900/40 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                  <div>
                    <span className="text-xs font-bold text-amber-300">Gold</span>
                    <p className="text-[10px] text-slate-400">Rp 2.000.000 - 3.000.000</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{tierCounts.Gold}</span>
                  <p className="text-[10px] text-slate-400">{getTierPercent(tierCounts.Gold)}%</p>
                </div>
              </div>

              {/* Silver */}
              <div className="bg-[#0B0F19]/80 border border-cyan-900/40 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50"></span>
                  <div>
                    <span className="text-xs font-bold text-cyan-300">Silver</span>
                    <p className="text-[10px] text-slate-400">Rp 1.000.000 - 2.000.000</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{tierCounts.Silver}</span>
                  <p className="text-[10px] text-slate-400">{getTierPercent(tierCounts.Silver)}%</p>
                </div>
              </div>

              {/* Regular */}
              <div className="bg-[#0B0F19]/80 border border-slate-700/40 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-slate-500"></span>
                  <div>
                    <span className="text-xs font-bold text-slate-300">Regular</span>
                    <p className="text-[10px] text-slate-400">&lt; Rp 1.000.000</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{tierCounts.Regular}</span>
                  <p className="text-[10px] text-slate-400">{getTierPercent(tierCounts.Regular)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produk Paling Sering Disewa */}
        <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-fuchsia-400" />
                Peralatan Paling Sering Disewa
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Top gear incaran event & DJ profesional</p>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
              High Demand
            </span>
          </div>

          <div className="space-y-2.5">
            {popularRentals.map((prod, idx) => (
              <div
                key={idx}
                className="bg-[#0B0F19]/60 hover:bg-[#0B0F19] border border-slate-800/80 rounded-xl p-3 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400">{prod.category} · <span className="text-fuchsia-400 font-medium">{prod.tag}</span></p>
                  </div>
                </div>
                <div className="text-right pl-3 shrink-0">
                  <span className="text-xs font-bold text-slate-100">{prod.count}x Sewa</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Follow-up Mendatang (3 teratas yang belum done) */}
      <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Follow-Up & Reminder Mendatang
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">3 agenda tindak lanjut terdekat dengan pelanggan</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/50">
            {pendingFollowUps.length} Pending
          </span>
        </div>

        {pendingFollowUps.length === 0 ? (
          <div className="text-center py-8 bg-[#0B0F19]/50 rounded-xl border border-dashed border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-semibold text-slate-300">Semua agenda follow-up telah selesai!</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Tidak ada follow-up mendesak yang menunggu saat ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingFollowUps.map(fu => (
              <div
                key={fu.id}
                className="bg-[#0B0F19]/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleFollowUp(fu.id)}
                    className="mt-0.5 w-5 h-5 rounded-md border border-slate-600 bg-slate-900 hover:border-emerald-500 hover:bg-emerald-950/40 flex items-center justify-center text-transparent hover:text-emerald-400 transition-all"
                    title="Tandai Selesai"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{fu.customerName}</span>
                      {getFollowUpTypeBadge(fu.type)}
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {new Date(fu.scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{fu.message}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => onToggleFollowUp(fu.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/50 flex items-center gap-1.5 transition-all font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selesaikan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

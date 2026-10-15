import React, { useState } from 'react';
import { BarChart3, Users, GitPullRequest, LifeBuoy, Bell, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { CustomerCRM, PipelineDeal, SupportTicket, FollowUp } from '../../types';
import { INITIAL_CRM_CUSTOMERS } from '../../data/crmData';
import { INITIAL_PIPELINE, INITIAL_TICKETS, INITIAL_FOLLOWUPS } from '../../data/crmPipelineData';

import { CRMSummary } from './CRMSummary';
import { CRMCustomers } from './CRMCustomers';
import { CRMPipeline } from './CRMPipeline';
import { CRMTickets } from './CRMTickets';
import { CRMFollowUps } from './CRMFollowUps';

export type CRMTabType = 'ringkasan' | 'pelanggan' | 'pipeline' | 'tiket' | 'followup';

export const CRMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CRMTabType>('ringkasan');

  // Master CRM states initialized with seed data
  const [customers, setCustomers] = useState<CustomerCRM[]>(INITIAL_CRM_CUSTOMERS);
  const [pipeline, setPipeline] = useState<PipelineDeal[]>(INITIAL_PIPELINE);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOWUPS);

  // Customer handlers
  const handleUpdateCustomer = (updated: CustomerCRM) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddCustomer = (customer: CustomerCRM) => {
    setCustomers(prev => [customer, ...prev]);
  };

  // Pipeline handlers
  const handleUpdateDeal = (updated: PipelineDeal) => {
    setPipeline(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleAddDeal = (deal: PipelineDeal) => {
    setPipeline(prev => [deal, ...prev]);
  };

  // Ticket handlers
  const handleUpdateTicket = (updated: SupportTicket) => {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleAddTicket = (ticket: SupportTicket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  // Follow-up handlers
  const handleToggleFollowUp = (id: string) => {
    setFollowUps(prev => prev.map(fu => fu.id === id ? { ...fu, isDone: !fu.isDone } : fu));
  };

  const handleAddFollowUp = (fu: FollowUp) => {
    setFollowUps(prev => [fu, ...prev]);
  };

  // Badge counts
  const activeDealsCount = pipeline.filter(d => ['lead', 'negosiasi', 'deal'].includes(d.stage)).length;
  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const pendingFollowUpsCount = followUps.filter(f => !f.isDone).length;

  return (
    <div className="space-y-6">
      {/* CRM Header Hub Banner */}
      <div className="bg-gradient-to-r from-[#131B2E] via-[#161F36] to-[#1A1838] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 via-fuchsia-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                CRM SOUNDRENT PRO
              </span>
              <span className="text-xs text-slate-400">v2.4 Relasi & Penjualan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
              Pusat Manajemen Pelanggan
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Pantau siklus relasi penyewa, alur transaksi pipeline deals, penanganan komplain support, serta agenda follow-up berkala.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#0B0F19]/80 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[70px]">
              <span className="text-xs text-slate-400 block font-medium">Pelanggan</span>
              <span className="text-base font-black text-cyan-400">{customers.length}</span>
            </div>
            <div className="bg-[#0B0F19]/80 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[70px]">
              <span className="text-xs text-slate-400 block font-medium">Pipeline</span>
              <span className="text-base font-black text-fuchsia-400">{activeDealsCount}</span>
            </div>
            <div className="bg-[#0B0F19]/80 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[70px]">
              <span className="text-xs text-slate-400 block font-medium">Tiket Open</span>
              <span className="text-base font-black text-amber-400">{openTicketsCount}</span>
            </div>
            <div className="bg-[#0B0F19]/80 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[70px]">
              <span className="text-xs text-slate-400 block font-medium">Follow-Up</span>
              <span className="text-base font-black text-emerald-400">{pendingFollowUpsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-[#131B2E] border border-slate-800/80 p-1.5 rounded-2xl w-full sm:w-fit scrollbar-none">
        {/* Tab 1: Ringkasan */}
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'ringkasan'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ringkasan</span>
        </button>

        {/* Tab 2: Pelanggan */}
        <button
          onClick={() => setActiveTab('pelanggan')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'pelanggan'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pelanggan</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
            activeTab === 'pelanggan' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
          }`}>
            {customers.length}
          </span>
        </button>

        {/* Tab 3: Pipeline */}
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'pipeline'
              ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Sales Pipeline</span>
          {activeDealsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'pipeline' ? 'bg-white/20 text-white' : 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800/50'
            }`}>
              {activeDealsCount}
            </span>
          )}
        </button>

        {/* Tab 4: Tiket Support */}
        <button
          onClick={() => setActiveTab('tiket')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'tiket'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Tiket Bantuan</span>
          {openTicketsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'tiket' ? 'bg-white/20 text-white' : 'bg-amber-950 text-amber-300 border border-amber-800/50'
            }`}>
              {openTicketsCount}
            </span>
          )}
        </button>

        {/* Tab 5: Follow-Up */}
        <button
          onClick={() => setActiveTab('followup')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'followup'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Follow-Up</span>
          {pendingFollowUpsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'followup' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
            }`}>
              {pendingFollowUpsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'ringkasan' && (
          <CRMSummary
            customers={customers}
            pipeline={pipeline}
            tickets={tickets}
            followUps={followUps}
            onToggleFollowUp={handleToggleFollowUp}
          />
        )}

        {activeTab === 'pelanggan' && (
          <CRMCustomers
            customers={customers}
            onUpdateCustomer={handleUpdateCustomer}
            onAddCustomer={handleAddCustomer}
          />
        )}

        {activeTab === 'pipeline' && (
          <CRMPipeline
            deals={pipeline}
            onUpdateDeal={handleUpdateDeal}
            onAddDeal={handleAddDeal}
          />
        )}

        {activeTab === 'tiket' && (
          <CRMTickets
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            onAddTicket={handleAddTicket}
          />
        )}

        {activeTab === 'followup' && (
          <CRMFollowUps
            followUps={followUps}
            onToggle={handleToggleFollowUp}
            onAdd={handleAddFollowUp}
          />
        )}
      </div>
    </div>
  );
};

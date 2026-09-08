import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface AIFloatingTriggerProps {
  onClick: () => void;
  isOpen: boolean;
}

export const AIFloatingTrigger: React.FC<AIFloatingTriggerProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Speech bubble hint */}
      <div 
        onClick={onClick}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#131B2E] border border-fuchsia-500/40 text-xs font-semibold text-white shadow-xl shadow-fuchsia-500/10 cursor-pointer hover:border-fuchsia-400 transition-all transform hover:-translate-y-0.5 animate-in fade-in slide-in-from-right duration-300"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
        <span>Bingung pilih alat? <strong>Tanya SoundBot AI</strong></span>
      </div>

      {/* Main floating action button */}
      <button
        onClick={onClick}
        className="relative group p-0.5 rounded-full bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-cyan-400 shadow-xl shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label="Buka SoundBot AI Consultant"
      >
        {/* Glow pulse ring */}
        <span className="absolute inset-0 rounded-full bg-fuchsia-500/30 animate-ping" />

        <div className="relative w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-950 to-slate-950 opacity-90" />
          
          <div className="relative flex flex-col items-center justify-center">
            <Bot className="w-6 h-6 text-fuchsia-300 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 font-mono">
              AI
            </span>
          </div>

          {/* Status online dot */}
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
        </div>
      </button>
    </div>
  );
};

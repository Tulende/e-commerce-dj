import React from 'react';
import { useCart } from '../context/CartContext';
import { RENTAL_TERMS } from '../data/promotions';
import { X, ShieldCheck, FileText, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export const RentalTermsModal: React.FC = () => {
  const { isTermsOpen, setIsTermsOpen } = useCart();

  if (!isTermsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#131B2E] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F19]/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-['Outfit']">Syarat & Ketentuan Rental SoundRent</h2>
          </div>
          <button
            onClick={() => setIsTermsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-300">
          <div className="space-y-3">
            <h3 className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-fuchsia-400" />
              Ketentuan Umum Penyewaan
            </h3>
            <ul className="space-y-2.5">
              {RENTAL_TERMS.map((term, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 flex items-center gap-2 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Sistem Jaminan Deposit (Refund 100%)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deposit jaminan sewa merupakan jaminan kepatuhan dan kehati-hatian atas aset alat musik & perangkat DJ berharga tinggi. Deposit akan dikembalikan secara penuh ke rekening atau e-wallet penyewa maksimal <strong>1 x 24 jam</strong> setelah proses check-out fisik selesai tanpa adanya kerusakan yang disengaja.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-2 text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Perawatan & Kelistrikan
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penyewa dihimbau memastikan tegangan listrik di tempat acara stabil (220V stabil) terutama untuk mixer digital, synthesizer, dan sound system berdaya besar guna menghindari lonjakan arus pendek.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-2 text-xs">
              <HelpCircle className="w-4 h-4 text-fuchsia-400" />
              Butuh Konsultasi Teknis atau Operator Panggung?
            </h4>
            <p className="text-xs text-slate-400">
              Kami juga melayani penyediaan soundman, road crew, dan teknisi DJ berlisensi untuk acara konser, wedding, atau festival Anda.
            </p>
          </div>

          <button
            onClick={() => setIsTermsOpen(false)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Saya Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

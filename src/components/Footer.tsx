import React from 'react';
import { Disc3, ShieldCheck, Cloud, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070A12] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-cyan-500 flex items-center justify-center text-white">
                <Disc3 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white font-['Outfit']">Sound<span className="text-fuchsia-400">Rent</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penyedia layanan rental alat musik, sound system panggung, dan DJ gear standar internasional nomor 1 di Indonesia. Peralatan bersih, bergaransi, dan selalu diuji sebelum digunakan.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span>Optimized for <strong>Cloudflare Pages</strong></span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Kategori Sewa</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-fuchsia-400 transition-colors">DJ Controller & CDJ Player</a></li>
              <li><a href="#" className="hover:text-fuchsia-400 transition-colors">Gitar Elektrik & Bass Fender / Gibson</a></li>
              <li><a href="#" className="hover:text-fuchsia-400 transition-colors">Drum Elektrik Yamaha & Akustik Pearl</a></li>
              <li><a href="#" className="hover:text-fuchsia-400 transition-colors">Stage Piano Roland & Nord Synthesizer</a></li>
              <li><a href="#" className="hover:text-fuchsia-400 transition-colors">Active PA System JBL & EV Subwoofer</a></li>
              <li><a href="#" className="hover:text-fuchsia-400 transition-colors">Moving Head Beam & LED Par Lighting</a></li>
            </ul>
          </div>

          {/* Col 3: Security & Guarantee */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Keamanan & Layanan</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deposit Jaminan 100% Refundable</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>QC & Testing Alat Sebelum Kirim</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-fuchsia-400" />
                <span>Kabel & Hardcase Flight Case Lengkap</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Siap Antar & Setup di Lokasi Gig</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Kontak & Lokasi Hub</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Warehouse SoundRent, Jakarta Selatan & BSD Tangerang</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: +62 812-9900-8800 (24 Jam)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>rent@soundrent.id</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Partner Logos & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SoundRent Indonesia. All rights reserved. Platform Penyewaan Alat Musik & DJ Terlengkap.
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-500">Metode Pembayaran:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">QRIS</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">BCA VA</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">MANDIRI VA</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">VISA/MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

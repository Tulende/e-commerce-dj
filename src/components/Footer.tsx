import React from 'react';
import { Disc3, ShieldCheck, Cloud, Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#3D2E4F]/70 bg-[#120F1A] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: About & New Social Accounts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5F96] via-[#C9849A] to-[#F7C59F] p-0.5 flex items-center justify-center text-white shadow-md shadow-[#C9849A]/20">
                <div className="w-full h-full bg-[#1A1520] rounded-[10px] flex items-center justify-center">
                  <Disc3 className="w-5 h-5 text-[#E8A0B4]" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white font-['Outfit']">Borrow<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E8A0B4] via-[#C9849A] to-[#A87BAC]">DJ</span></span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform e-commerce persewaan alat DJ dan instrumen musik profesional nomor 1 di Indonesia dengan antarmuka inklusif, transparan, dan terpercaya.
            </p>

            {/* Social Media Accounts (New) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4A5C0] block">Ikuti Media Sosial Kami:</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/borrowdj.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#221B2E] border border-[#3D2E4F] text-[#E8A0B4] hover:text-white hover:border-[#C9849A] transition-colors"
                  title="Instagram: @borrowdj.id"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* TikTok Icon */}
                <a
                  href="https://tiktok.com/@borrowdj.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#221B2E] border border-[#3D2E4F] text-[#E8A0B4] hover:text-white hover:border-[#C9849A] transition-colors"
                  title="TikTok: @borrowdj.official"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.48c1.65-1.57 2.45-3.69 2.45-6.16V8.67a8.28 8.28 0 0 0 4.82 1.52v-3.5a4.85 4.85 0 0 1-1.5-.0z"/>
                  </svg>
                </a>

                <a
                  href="https://youtube.com/@borrowdj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#221B2E] border border-[#3D2E4F] text-[#E8A0B4] hover:text-white hover:border-[#C9849A] transition-colors"
                  title="YouTube: @borrowdj"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                <a
                  href="https://wa.me/6281234567890?text=Halo%20BorrowDJ%2C%20saya%20ingin%20tanya%20sewa%20alat%20DJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#221B2E] border border-[#3D2E4F] text-emerald-400 hover:text-white hover:border-emerald-500 transition-colors"
                  title="WhatsApp Admin 24 Jam"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#221B2E] border border-[#3D2E4F] text-[11px] text-slate-300">
              <Cloud className="w-3.5 h-3.5 text-[#F7C59F]" />
              <span>Hosting: <strong>Cloudflare Pages &amp; D1</strong></span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Kategori Sewa</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><span className="hover:text-[#E8A0B4] transition-colors cursor-pointer">DJ Controller &amp; CDJ Player</span></li>
              <li><span className="hover:text-[#E8A0B4] transition-colors cursor-pointer">Gitar Elektrik &amp; Bass Fender / Gibson</span></li>
              <li><span className="hover:text-[#E8A0B4] transition-colors cursor-pointer">Drum Elektrik Yamaha &amp; Akustik Pearl</span></li>
              <li><span className="hover:text-[#E8A0B4] transition-colors cursor-pointer">Stage Piano Roland &amp; Nord Synthesizer</span></li>
              <li><span className="hover:text-[#E8A0B4] transition-colors cursor-pointer">Active PA System JBL &amp; EV Subwoofer</span></li>
              <li><span className="hover:text-[#E8A0B4] transition-colors cursor-pointer">Moving Head Beam &amp; LED Stage Lighting</span></li>
            </ul>
          </div>

          {/* Col 3: Security & Guarantee */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Jaminan &amp; Layanan</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deposit Jaminan 100% Refundable</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#E8A0B4]" />
                <span>QC &amp; Testing Alat Sebelum Kirim</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#F7C59F]" />
                <span>Kabel &amp; Flight Case Hardcase Lengkap</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Siap Antar &amp; Setup ke Lokasi Event</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social Handles */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Kontak &amp; Warehouse</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E8A0B4] shrink-0" />
                <span>Warehouse BorrowDJ, Jakarta Selatan &amp; BSD Tangerang</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WA: +62 812-3456-7890 (Admin 24 Jam)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F7C59F] shrink-0" />
                <span>halo@borrowdj.my.id</span>
              </p>
              <p className="text-[11px] text-[#A87BAC]">
                Instagram: <strong className="text-white">@borrowdj.id</strong><br/>
                TikTok: <strong className="text-white">@borrowdj.official</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Partner Logos & Copyright */}
        <div className="pt-8 border-t border-[#3D2E4F]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} BorrowDJ (borrowdj.my.id). Hak Cipta Dilindungi. Platform Rental Alat Musik &amp; DJ Terpercaya.
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-500">Metode Bayar:</span>
            <span className="px-2 py-0.5 rounded bg-[#221B2E] border border-[#3D2E4F] font-mono text-[10px] text-slate-300">QRIS</span>
            <span className="px-2 py-0.5 rounded bg-[#221B2E] border border-[#3D2E4F] font-mono text-[10px] text-slate-300">BCA VA</span>
            <span className="px-2 py-0.5 rounded bg-[#221B2E] border border-[#3D2E4F] font-mono text-[10px] text-slate-300">MANDIRI VA</span>
            <span className="px-2 py-0.5 rounded bg-[#221B2E] border border-[#3D2E4F] font-mono text-[10px] text-slate-300">KARTU KREDIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { PromoCoupon } from '../types';

export interface PromoBanner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  discountText: string;
  code: string;
  bgGradient: string;
  image: string;
}

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-1',
    badge: 'FESTIVAL SPECIAL 2026',
    title: 'Geber Panggung Musik & DJ Tanpa Beban Biaya Mahal',
    subtitle: 'Sewa paket CDJ-3000, DDJ-FLX10, hingga Drum Yamaha & PA System JBL dengan diskon eksklusif!',
    discountText: 'DISKON 15% DENGAN KODE',
    code: 'SEWASERU15',
    bgGradient: 'from-fuchsia-900/80 via-purple-950 to-slate-950',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'promo-2',
    badge: 'WEEKEND PARTY VIBES',
    title: 'DJ Gear Standar Internasional Pioneer DJ & Technics',
    subtitle: 'Cek ketersediaan stok live langsung dan booking untuk gig akhir pekanmu hari ini.',
    discountText: 'DISKON 10% KHUSUS DJ GEAR',
    code: 'PROMODJ10',
    bgGradient: 'from-cyan-950 via-blue-950 to-slate-950',
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'promo-3',
    badge: 'BAND GIG & CONCERT READY',
    title: 'Sound System 1300W JBL + Nord Stage 3 & Fender Custom',
    subtitle: 'Peralatan terawat prima, selalu dibersihkan dan diuji sebelum serah terima rental.',
    discountText: 'POTONGAN RP 50.000 FLAT',
    code: 'WEEKEND50K',
    bgGradient: 'from-amber-950 via-orange-950 to-slate-950',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80'
  }
];

export const PROMO_COUPONS: PromoCoupon[] = [
  {
    code: 'SEWASERU15',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 500000,
    description: 'Diskon 15% untuk semua penyewaan alat musik & DJ (Min. Sewa Rp 500.000)'
  },
  {
    code: 'PROMODJ10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 400000,
    description: 'Diskon 10% untuk perlengkapan DJ & Sound System'
  },
  {
    code: 'WEEKEND50K',
    discountType: 'fixed',
    discountValue: 50000,
    minSpend: 300000,
    description: 'Potongan langsung Rp 50.000 untuk penyewaan minimal Rp 300.000'
  }
];

export const RENTAL_TERMS = [
  'Penyewa wajib menyertakan foto identitas resmi (KTP / SIM / Paspor) yang masih berlaku.',
  'Uang jaminan (deposit refundable) akan dikembalikan 100% setelah unit dicek dalam kondisi utuh dan berfungsi normal saat pengembalian.',
  'Durasi sewa 1 hari dihitung 24 jam sejak waktu serah terima barang.',
  'Kerusakan akibat kelalaian operasional (terjatuh, terkena tumpahan cairan, korsleting listrik tidak stabil) menjadi tanggung jawab penyewa sesuai estimasi biaya reparasi resmi.',
  'Keterlambatan pengembalian tanpa konfirmasi perpanjangan sebelumnya akan dikenakan denda proporsional tarif sewa per jam.'
];

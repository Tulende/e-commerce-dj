import { PipelineDeal, SupportTicket, FollowUp } from '../types';

export const INITIAL_PIPELINE: PipelineDeal[] = [
  {
    id: 'deal-01',
    customerId: 'crm-01',
    customerName: 'DJ Nadya Putri',
    title: 'Sewa DDJ-FLX10 + JBL Monitor 3 hari',
    stage: 'deal',
    value: 2100000,
    createdAt: '2026-10-01',
    updatedAt: '2026-10-08',
    expectedCloseDate: '2026-10-18',
    notes: 'Untuk event club SCBD. Sudah setuju harga, menunggu DP 50%.'
  },
  {
    id: 'deal-02',
    customerId: 'crm-03',
    customerName: 'DJ Syifa R.',
    title: 'Paket Mixer DJM-900NXS2 + 2x CDJ-3000 (Weekend Gig)',
    stage: 'negosiasi',
    value: 3500000,
    createdAt: '2026-10-05',
    updatedAt: '2026-10-10',
    expectedCloseDate: '2026-10-22',
    notes: 'Meminta diskon bundling kabel audio & direct box.'
  },
  {
    id: 'deal-03',
    customerId: 'crm-02',
    customerName: 'Clarissa Maharani',
    title: 'Paket Sound System 5000W + Wireless Mic Wedding',
    stage: 'lead',
    value: 4800000,
    createdAt: '2026-10-11',
    updatedAt: '2026-10-12',
    expectedCloseDate: '2026-11-05',
    notes: 'Tanya ketersediaan teknisi on-site dan sound check H-1.'
  },
  {
    id: 'deal-04',
    customerId: 'crm-04',
    customerName: 'Tasya Tulende',
    title: 'Sewa Roland FANTOM-08 + Stand Keyboard Dual',
    stage: 'selesai',
    value: 1850000,
    createdAt: '2026-09-20',
    updatedAt: '2026-09-28',
    expectedCloseDate: '2026-09-27',
    notes: 'Barang sudah dikembalikan dalam kondisi sempurna, deposit jaminan telah di-refund.'
  },
  {
    id: 'deal-05',
    customerId: 'crm-05',
    customerName: 'Amanda V.',
    title: 'Lighting Stage Beam 230W 4 Unit + Par LED 8 Unit',
    stage: 'lead',
    value: 2400000,
    createdAt: '2026-10-09',
    updatedAt: '2026-10-11',
    expectedCloseDate: '2026-10-25',
    notes: 'Eksplorasi penambahan lighting untuk intimate concert kampus.'
  },
  {
    id: 'deal-06',
    customerId: 'crm-02',
    customerName: 'Clarissa Maharani',
    title: 'Paket Pioneer Opus Quad Festival',
    stage: 'batal',
    value: 5200000,
    createdAt: '2026-09-15',
    updatedAt: '2026-09-19',
    expectedCloseDate: '2026-09-21',
    notes: 'Batal karena venue festival diundur panitia ke akhir tahun.'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'ticket-01',
    customerId: 'crm-01',
    customerName: 'DJ Nadya Putri',
    subject: 'Pertanyaan Kalibrasi Fader DDJ-FLX10',
    description: 'Crossfader terasa sedikit loose saat scratching cepat, butuh panduan setting Rekordbox curve atau adjustment.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-10-12'
  },
  {
    id: 'ticket-02',
    customerId: 'crm-04',
    customerName: 'Tasya Tulende',
    subject: 'Kabel Power Roland FANTOM tertinggal saat pickup',
    description: 'Kabel power adaptor cadangan tertinggal di kendaraan kurir saat pickup semalam. Mohon bantu cek inventaris driver.',
    status: 'open',
    priority: 'high',
    createdAt: '2026-10-14'
  },
  {
    id: 'ticket-03',
    customerId: 'crm-03',
    customerName: 'DJ Syifa R.',
    subject: 'Klaim Refund Deposit Sewa #SR-88412',
    description: 'Sewa selesai 2 hari lalu, mohon bantuan cek mutasi pengembalian deposit jaminan ke rekening BCA.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-10-09',
    resolvedAt: '2026-10-10'
  },
  {
    id: 'ticket-04',
    customerId: 'crm-05',
    customerName: 'Amanda V.',
    subject: 'Request Panduan Setting Gain Speaker JBL EON715',
    description: 'Suara sempat peak/clip saat volume di-push di venue indoor. Butuh SOP rekomendasi gain staging.',
    status: 'closed',
    priority: 'medium',
    createdAt: '2026-09-23',
    resolvedAt: '2026-09-24'
  },
  {
    id: 'ticket-05',
    customerId: 'crm-02',
    customerName: 'Clarissa Maharani',
    subject: 'Ganti Jadwal Sewa Sound System Resepsi',
    description: 'Pergeseran tanggal acara dari 25 Oktober ke 26 Oktober karena penyesuaian izin ballroom hotel.',
    status: 'open',
    priority: 'high',
    createdAt: '2026-10-13'
  }
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fu-01',
    customerId: 'crm-01',
    customerName: 'DJ Nadya Putri',
    type: 'penawaran',
    message: 'Kirim invoice DP 50% dan konfirmasi rider kelistrikan untuk event SCBD weekend ini.',
    scheduledDate: '2026-10-16',
    isDone: false
  },
  {
    id: 'fu-02',
    customerId: 'crm-03',
    customerName: 'DJ Syifa R.',
    type: 'follow_up_lead',
    message: 'Konfirmasi ketersediaan paket DJM-900NXS2 + 2x CDJ-3000 untuk lock tanggal.',
    scheduledDate: '2026-10-17',
    isDone: false
  },
  {
    id: 'fu-03',
    customerId: 'crm-04',
    customerName: 'Tasya Tulende',
    type: 'ucapan',
    message: 'Ucapkan selamat atas kesuksesan album showcase dan berikan voucher VIP loyalty 15%.',
    scheduledDate: '2026-10-15',
    isDone: false
  },
  {
    id: 'fu-04',
    customerId: 'crm-02',
    customerName: 'Clarissa Maharani',
    type: 'jatuh_tempo',
    message: 'Reminder pelunasan sisa tagihan sewa sound system H-3 sebelum tanggal pengiriman.',
    scheduledDate: '2026-10-23',
    isDone: false
  },
  {
    id: 'fu-05',
    customerId: 'crm-05',
    customerName: 'Amanda V.',
    type: 'follow_up_lead',
    message: 'Kirimkan katalog paket lighting stage hemat untuk event kampus beserta simulasi harga.',
    scheduledDate: '2026-10-10',
    isDone: true
  }
];

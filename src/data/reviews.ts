import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-01', // Pioneer CDJ-3000
    userName: 'DJ Nadya Putri',
    rating: 5,
    comment: 'Pioneer CDJ-3000 dalam kondisi super mulus 99% like new! Layar sentuh responsif dan kabel LAN Pro DJ Link lengkap di dalam flightcase. Sukses bikin perform di lounge SCBD lancar tanpa hambatan.',
    createdAt: '2026-09-20',
    eventType: 'Lounge & Club Gig',
    verifiedRental: true,
  },
  {
    id: 'rev-02',
    productId: 'prod-01',
    userName: 'Clarissa Maharani',
    rating: 5,
    comment: 'Pelayanan BorrowDJ ramah banget untuk musisi cewek pemula! Dibantuin cek firmware dan diajarin cara link ke mixer. Recommended banget buat rental alat DJ!',
    createdAt: '2026-09-24',
    eventType: 'Private Party',
    verifiedRental: true,
  },
  {
    id: 'rev-03',
    productId: 'prod-02', // Pioneer DJM-900NXS2
    userName: 'DJ Syifa R.',
    rating: 5,
    comment: 'Sound Color FX dan Beat FX semuanya berfungsi normal dan jernih tanpa noise. Sangat puas dengan kebersihan alatnya!',
    createdAt: '2026-09-18',
    eventType: 'Festival Musik Kampus',
    verifiedRental: true,
  },
  {
    id: 'rev-04',
    productId: 'prod-03', // Pioneer DDJ-FLX10
    userName: 'Tasya Tulende',
    rating: 5,
    comment: 'FLX10 enak banget buat latihan dan live gig! Fitur Track Separation lancar di Rekordbox. Pengantaran tepat waktu dan deposit dikembalikan di hari yang sama.',
    createdAt: '2026-09-27',
    eventType: 'Intimate Concert',
    verifiedRental: true,
  },
  {
    id: 'rev-05',
    productId: 'prod-07', // JBL EON715
    userName: 'Amanda V.',
    rating: 5,
    comment: 'Sound system JBL-nya nendang banget buat acara indoor 100 orang. Suara vokal dan bass seimbang, kabel panjang & tripod kokoh.',
    createdAt: '2026-09-22',
    eventType: 'Birthday Party',
    verifiedRental: true,
  },
  {
    id: 'rev-06',
    productId: 'prod-05', // Fender Stratocaster
    userName: 'Kania Laksmi',
    rating: 4,
    comment: 'Action senarnya pas, tone vintage khas Stratocaster dapet banget. Termasuk gigbag tebal jadi aman saat dibawa transportasi.',
    createdAt: '2026-09-25',
    eventType: 'Studio Jamming',
    verifiedRental: true,
  },
];

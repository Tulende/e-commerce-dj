import { Product } from '../types';

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Pioneer DJ CDJ-3000 Professional Multi Player',
    brand: 'Pioneer DJ',
    category: 'DJ Gear',
    dailyPrice: 750000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    description: 'Flagship DJ multi-player standar klub dunia dengan layar sentuh 9 inci resolusi tinggi dan micro-processing unit (MPU) super cepat.',
    features: [
      'Touch screen 9" dengan Touch Preview & Touch Cue',
      'Audio DAC 96kHz/32-bit floating point',
      'Pro DJ Link dengan Gigabit Ethernet',
      'Key Sync & Key Shift hardware buttons'
    ],
    specs: {
      'Frequency Range': '4 - 40000 Hz',
      'D/A Converter': '32 bit',
      'Screen': '9 inch full-colour HD LCD touch',
      'Weight': '5.5 kg'
    },
    isPromo: true,
    promoDiscountPercent: 10,
    promoTag: 'SUPERSTAR DJ PICK',
    depositAmount: 1500000,
    rating: 4.9,
    reviewsCount: 38,
    includedAccessories: ['Hardcase Flight Case', 'Kabel Power', 'Kabel RCA Audio', 'Kabel LAN Pro DJ Link']
  },
  {
    id: 'prod-02',
    name: 'Pioneer DJ DJM-900NXS2 4-Channel Mixer',
    brand: 'Pioneer DJ',
    category: 'DJ Gear',
    dailyPrice: 650000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    description: 'Mixer 4-channel standar industri festival internasional. Dilengkapi dual soundcard USB dan 6 Sound Color FX studio-grade.',
    features: [
      'Pro Sound Quality 64-bit mixing processor',
      'Sound Color FX: Sweep, Deep, Crush, Dub Echo, Noise, Space',
      'Independent Send/Return untuk external FX / iPad',
      'Dual USB ports untuk seamless DJ handovers'
    ],
    specs: {
      'Channels': '4 audio channels, 2 mic channels',
      'Sampling Rate': '96 kHz',
      'Dimensions': '333 x 107.9 x 414.2 mm',
      'Weight': '8.0 kg'
    },
    isPromo: false,
    depositAmount: 1200000,
    rating: 4.8,
    reviewsCount: 29,
    includedAccessories: ['Flight Case Road Ready', 'Kabel Power AC', 'Kabel USB Type-B']
  },
  {
    id: 'prod-03',
    name: 'Pioneer DJ DDJ-FLX10 4-Channel DJ Controller',
    brand: 'Pioneer DJ',
    category: 'DJ Gear',
    dailyPrice: 450000,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800&auto=format&fit=crop&q=80',
    description: 'DJ controller 4-channel canggih untuk rekordbox dan Serato DJ Pro dengan fitur revolusioner Track Separation (Stems real-time).',
    features: [
      'Fitur Track Separation untuk vokal, drum, dan instrumen instan',
      'On Jog Display yang dapat dikustomisasi',
      'MAGVEL FADER 4-sensor ultra smooth',
      'DMX Output untuk kontrol lighting panggung'
    ],
    specs: {
      'Compatible Software': 'rekordbox, Serato DJ Pro',
      'Audio Interface': '24 bit/44.1 kHz',
      'Channels': '4 Deck Control',
      'Weight': '6.7 kg'
    },
    isPromo: true,
    promoDiscountPercent: 15,
    promoTag: 'BEST SELLER EVENT',
    depositAmount: 1000000,
    rating: 4.9,
    reviewsCount: 45,
    includedAccessories: ['Semi-hardcase Bag', 'Adaptor Power', 'Kabel USB-C to USB-A']
  },
  {
    id: 'prod-04',
    name: 'Technics SL-1210MK7 Direct Drive Turntable System',
    brand: 'Technics',
    category: 'DJ Gear',
    dailyPrice: 400000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
    description: 'Turntable legendaris untuk vinyl DJ, turntablist, dan pecinta scratching dengan coreless direct drive motor tanpa cogging.',
    features: [
      'Coreless Direct Drive Motor untuk putaran presisi tinggi',
      'Fungsi Reverse Play untuk variasi performa live',
      'Pitch control digital ±8% dan ±16%',
      'Bodi aluminium die-cast kokoh peredam vibrasi'
    ],
    specs: {
      'Speeds': '33-1/3, 45, 78 rpm',
      'Starting Torque': '0.18 N・m / 1.8 kg・cm',
      'Dimensions': '453 x 169 x 353 mm',
      'Weight': '9.6 kg'
    },
    isPromo: false,
    depositAmount: 1000000,
    rating: 5.0,
    reviewsCount: 19,
    includedAccessories: ['Flight Case Turntable', 'Slipmat Technics', 'Headshell & Cartridge Shure/Ortofon', 'Dust Cover']
  },
  {
    id: 'prod-05',
    name: 'Denon DJ Prime 4 Standalone 4-Deck DJ System',
    brand: 'Denon DJ',
    category: 'DJ Gear',
    dailyPrice: 550000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1546707012-c46675f12716?w=800&auto=format&fit=crop&q=80',
    description: 'Standalone DJ system tercanggih dengan layar multitouch 10 inci. Mainkan musik tanpa laptop langsung dari Flashdisk, SD Card, atau SATA drive internal.',
    features: [
      'Layar HD 10 inci dengan gestures multi-touch',
      'Bisa memainkan 4-deck tanpa bantuan laptop (Standalone)',
      'Dedicated Zone Output untuk kirim musik terpisah ke ruangan lain',
      'Built-in 2.5-inch SATA drive bay'
    ],
    specs: {
      'Inputs': '4 RCA, 2 XLR Combo Mic',
      'Outputs': 'Master XLR/RCA, Booth XLR, Zone XLR',
      'Storage Support': 'USB x 4, SD Card x 1, SATA bay',
      'Weight': '9.7 kg'
    },
    isPromo: true,
    promoDiscountPercent: 12,
    promoTag: 'STANDALONE POWER',
    depositAmount: 1200000,
    rating: 4.7,
    reviewsCount: 16,
    includedAccessories: ['Flight Case Odyssey', 'Kabel Power', 'Flashdisk Engine DJ Ready']
  },
  {
    id: 'prod-06',
    name: 'Fender American Professional II Stratocaster',
    brand: 'Fender',
    category: 'Gitar & Bass',
    dailyPrice: 250000,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&auto=format&fit=crop&q=80',
    description: 'Gitar elektrik legendaris buatan USA dengan pickup V-Mod II single-coil yang jernih, warm, dan artikulasi vintage modern.',
    features: [
      'Tiga pickup V-Mod II single-coil Stratocaster',
      'Neck profil "Deep C" dengan pinggiran fretboard rolled',
      'Treble bleed circuit mempertahankan nada tinggi saat volume turun',
      'Bridge 2-point tremolo dengan cold-rolled steel block'
    ],
    specs: {
      'Body': 'Alder / Sunburst Finish',
      'Neck': 'Maple dengan Rosewood Fingerboard',
      'Frets': '22 Narrow Tall',
      'Origin': 'Corona, California, USA'
    },
    isPromo: true,
    promoDiscountPercent: 10,
    promoTag: 'POPULAR GUITAR',
    depositAmount: 800000,
    rating: 4.9,
    reviewsCount: 52,
    includedAccessories: ['Fender Deluxe Molded Hardcase', 'Strap Gitar Kulit', 'Kabel Jack Mogami 3m', 'Pick Set']
  },
  {
    id: 'prod-07',
    name: "Gibson Les Paul Standard '60s Iced Tea",
    brand: 'Gibson',
    category: 'Gitar & Bass',
    dailyPrice: 350000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&auto=format&fit=crop&q=80',
    description: 'Gitar rock & blues legendaris dengan bodi solid mahogany, figur maple top AA, dan pickup 60s Burstbucker bertonasi tebal bertenaga.',
    features: [
      'Solid Mahogany Body dengan AA Figured Maple Top',
      'SlimTaper neck profile khas era 1960s yang nyaman',
      'Dual 60s Burstbucker pickups dengan kapasitor Orange Drop',
      'ABR-1 Tune-O-Matic bridge berbahan aluminium'
    ],
    specs: {
      'Body': 'Solid Mahogany non-weight relief',
      'Scale Length': '24.75" / 628.65mm',
      'Electronics': 'Hand-wired Orange Drop Capacitors',
      'Weight': '4.1 kg'
    },
    isPromo: false,
    depositAmount: 1200000,
    rating: 4.9,
    reviewsCount: 27,
    includedAccessories: ['Gibson Hardcase Cokelat Original', 'Strap Gibson', 'Kabel Jack Canare 5m']
  },
  {
    id: 'prod-08',
    name: 'Fender American Ultra Jazz Bass (5-String)',
    brand: 'Fender',
    category: 'Gitar & Bass',
    dailyPrice: 280000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
    description: 'Bass 5 senar level tertinggi dari Fender dengan pickup Ultra Noiseless Vintage dan preamp aktif 18-volt yang powerful untuk panggung.',
    features: [
      'Dual Ultra Noiseless Vintage Jazz Bass pickups',
      'Preamp aktif 18V dengan 3-band EQ dan active/passive switch',
      'Neck profil "Modern D" dengan compound radius 10"-14"',
      'HiMass bridge untuk sustain nada rendah yang solid'
    ],
    specs: {
      'Strings': '5 Senar (Low B)',
      'Preamp': '18-Volt Active with Passive bypass',
      'Body': 'Alder Olympic White finish',
      'Weight': '4.4 kg'
    },
    isPromo: false,
    depositAmount: 900000,
    rating: 4.8,
    reviewsCount: 22,
    includedAccessories: ['Fender Elite Molded Case', 'Strap Bass Lebar', 'Kabel Jack Gold Plated']
  },
  {
    id: 'prod-09',
    name: 'Yamaha DTX6K3-X Electronic Drum Kit',
    brand: 'Yamaha',
    category: 'Drum & Perkusi',
    dailyPrice: 400000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80',
    description: 'Drum elektrik profesional dengan pad TCS (Textured Cellular Silicone) alami dan sound module DTX-PRO yang merekam akustik drum asli.',
    features: [
      'DTX-PRO Module dengan Kit Modifier (Ambience, Comp, Effect)',
      'TCS Silicone pads super senyap dengan pantulan stick natural',
      '3-Zone snare dan ride cymbal dengan choke detection',
      'Integrasi aplikasi Rec\'n\'Share iOS/Android'
    ],
    specs: {
      'Pads': 'Snare 8" TCS, 3x Tom 7" TCS, Kick KP90, Hi-Hat RHH135',
      'Cymbals': 'PCY135 13" 3-zone, PCY155 15" 3-zone',
      'Presets': '712 suara drum berkualitas studio',
      'Power': '12V DC Adaptor'
    },
    isPromo: true,
    promoDiscountPercent: 20,
    promoTag: 'DISKON SPESIAL BAND',
    depositAmount: 1000000,
    rating: 4.8,
    reviewsCount: 31,
    includedAccessories: ['Kursi Drum Ergonomis', 'Single Kick Pedal Yamaha FP7210A', 'Drum Stick Pair', 'Kabel Audio Output L/R']
  },
  {
    id: 'prod-10',
    name: 'Pearl Masters Maple Complete 5-Piece Drum Set',
    brand: 'Pearl',
    category: 'Drum & Perkusi',
    dailyPrice: 700000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1543791187-df796fa11835?w=800&auto=format&fit=crop&q=80',
    description: 'Set drum akustik kelas konser 100% EvenPly-Six North American Maple. Menghasilkan resonansi nada tebal, artikulasi punchy, dan sustain kaya.',
    features: [
      'Shell 6-ply 5.4mm 100% North American Maple',
      'SuperHoop II triple-flanged hoops 2.3mm',
      'OptiMount Suspension System untuk resonansi bebas hambatan',
      'Konfigurasi 22" Bass, 10" & 12" Toms, 16" Floor Tom, 14" Snare'
    ],
    specs: {
      'Shell Material': 'Cross-laminated Maple',
      'Finish': 'Matte Caviar Black',
      'Hardware': 'Chrome Hardware Package 930 Series',
      'Total Weight': '38 kg (Full Set)'
    },
    isPromo: false,
    depositAmount: 1500000,
    rating: 5.0,
    reviewsCount: 14,
    includedAccessories: ['Set Cymbal Zildjian A Custom (Hihat, Crash, Ride)', 'Full Hardware Boom Stand Pearl 930', 'Kursi Drum Pearl', 'Karpet Drum Pearl 2x1.6m']
  },
  {
    id: 'prod-11',
    name: 'Roland RD-2000 Stage Piano & Master Keyboard',
    brand: 'Roland',
    category: 'Keyboard & Synth',
    dailyPrice: 450000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
    description: 'Stage piano panggung terbaik di dunia dengan dual sound engines (V-Piano Acoustic Engine + SuperNATURAL Sound Generator) dan tuts kayu hibrida PHA-50.',
    features: [
      'Dual Sound Engines untuk acoustic piano tak terbatas dan elektrik piano',
      'Tuts PHA-50 Hybrid Wood & Plastic dengan Escapement',
      '8 Knob putar dan 9 slider dengan LED status indicator',
      'Audio interface USB 24-bit/192kHz built-in'
    ],
    specs: {
      'Keys': '88 Tuts weighted hammer action',
      'Polyphony': 'Full polyphony V-Piano, 128 voice SuperNATURAL',
      'Outputs': 'Main XLR L/R balance, Main 1/4" L/R, Sub Out 1/4"',
      'Weight': '21.7 kg'
    },
    isPromo: false,
    depositAmount: 1200000,
    rating: 4.9,
    reviewsCount: 26,
    includedAccessories: ['Flight Case Roda', 'Damper Sustain Pedal DP-10 Original', 'X-Stand Dobel Kuat', 'Kabel Audio Stereo']
  },
  {
    id: 'prod-12',
    name: 'Nord Stage 3 88-Key Flagship Synthesizer',
    brand: 'Nord',
    category: 'Keyboard & Synth',
    dailyPrice: 800000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    description: 'Keyboard ikonik warna merah Swedia yang wajib ada di panggung konser artis papan atas. Menggabungkan Piano, Organ B3, dan Synth Engine Lead A1.',
    features: [
      'Dual OLED displays untuk navigasi cepat di panggung gelap',
      'Nord Lead A1 Synth Engine dengan Sample Playback 480MB',
      'Nord C2D Organ simulations (B3 Tonewheel, Vox, Farfisa)',
      '2GB memori piano library berdefinisi tinggi'
    ],
    specs: {
      'Keybed': '88 Hammer Action dengan Aftertouch',
      'Weight': '19 kg',
      'Outputs': '4 assignable audio outputs 1/4"',
      'Made In': 'Stockholm, Sweden'
    },
    isPromo: true,
    promoDiscountPercent: 10,
    promoTag: 'CONCERT STANDARD',
    depositAmount: 1800000,
    rating: 5.0,
    reviewsCount: 33,
    includedAccessories: ['Nord Soft Case Merah beroda', 'Nord Triple Pedal', 'Stand Keyboard Heavy Duty', 'Kabel Jack Mogami']
  },
  {
    id: 'prod-13',
    name: 'Korg Minilogue XD Polyphonic Analogue Synthesizer',
    brand: 'Keyboard & Synth',
    category: 'Keyboard & Synth',
    dailyPrice: 200000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    description: 'Synthesizer analog 4-suara sejati dengan digital multi-engine, efek stereo studio, dan 16-step sequencer polifonik interaktif.',
    features: [
      'Sirkuit analog asli 4-voice dengan warmth melimpah',
      'Multi-engine digital ketiga (Noise, VPM, User custom oscillator)',
      'Efek digital DSP 32-bit (Modulation, Reverb, Delay)',
      'Layar OLED oscilloscope yang menampilkan visual bentuk gelombang suara'
    ],
    specs: {
      'Keyboard': '37 tuts slim velocity-sensitive',
      'Sequencer': '16-step polyphonic dengan Motion Sequence',
      'I/O': 'Stereo Out, Sync In/Out, MIDI In/Out, USB-B',
      'Weight': '2.8 kg'
    },
    isPromo: false,
    depositAmount: 600000,
    rating: 4.7,
    reviewsCount: 18,
    includedAccessories: ['Gig Bag Korg', 'Adaptor DC Original', 'Kabel Jack Stereo 1/4"']
  },
  {
    id: 'prod-14',
    name: 'JBL EON715 1300W 15-inch Powered PA Speaker (Sepasang)',
    brand: 'JBL Professional',
    category: 'Sound System',
    dailyPrice: 500000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    description: 'Sepasang (2 unit) speaker aktif 15 inci 1300W peak dengan DSP canggih dari dbx (Automatic Feedback Suppression), Bluetooth 5.0 audio, dan kontrol aplikasi.',
    features: [
      'Power 1300W peak / 650W RMS per unit',
      'Teknologi waveguide JBL untuk sebaran suara merata',
      'Mixer 3-channel terintegrasi dengan layar LCD warna',
      'Audio streaming via Bluetooth 5.0'
    ],
    specs: {
      'Frequency Response': '45 Hz - 20 kHz',
      'Max SPL': '128 dB per speaker',
      'Coverage': '90° horizontal x 60° vertical',
      'Weight': '17 kg per unit'
    },
    isPromo: true,
    promoDiscountPercent: 10,
    promoTag: 'PAKET SOUND HEMAT',
    depositAmount: 1000000,
    rating: 4.8,
    reviewsCount: 42,
    includedAccessories: ['2x Tripod Speaker Stand Besi', '2x Kabel Power 10 meter', '2x Kabel XLR Audio 15 meter', 'Cover Pelindung Hujan']
  },
  {
    id: 'prod-15',
    name: 'Electro-Voice EV ELX200-18SP 18" Active Subwoofer',
    brand: 'Electro-Voice',
    category: 'Sound System',
    dailyPrice: 400000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
    description: 'Subwoofer aktif 18 inci 1200W Class-D dengan hentakan bass sub-rendah yang menggelegar dan presisi untuk panggung live musik & DJ party.',
    features: [
      'Power Amplifier Class-D 1200 Watt berefisiensi tinggi',
      'QuickSmartDSP dengan 3 preset (Music, Live, Club)',
      'Sub/top system-match crossovers terkalibrasi',
      'Pemantauan nirkabel via aplikasi QuickSmart Mobile'
    ],
    specs: {
      'Frequency Response': '40 Hz - 180 Hz',
      'Max SPL': '132 dB peak',
      'Transducer': 'EVS-18L 18-inch woofer',
      'Weight': '29 kg'
    },
    isPromo: false,
    depositAmount: 900000,
    rating: 4.9,
    reviewsCount: 23,
    includedAccessories: ['Tiang Speaker Pole Mount Sub-to-Top', 'Kabel Power 10m', 'Kabel XLR 10m']
  },
  {
    id: 'prod-16',
    name: 'Behringer X32 32-Channel Digital Mixing Console',
    brand: 'Behringer',
    category: 'Sound System',
    dailyPrice: 850000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    description: 'Mixer digital 40-input 32-channel dengan preamp mikrofon rancangan Midas, 25 motorized fader bermesin, dan kontrol iPad nirkabel.',
    features: [
      '32 Preamp mikrofon Midas fully programmable',
      '25 Motorized 100mm faders untuk instant total recall',
      '16 XLR output seimbang ditambah 6 aux line in/out',
      'Virtual FX Rack dengan 8 stereo effects processors'
    ],
    specs: {
      'Channels': '40 input channel, 25 bus',
      'Interface': '32x32 USB Audio Interface',
      'Network': 'Remote control via Wi-Fi / Ethernet',
      'Weight': '20.6 kg'
    },
    isPromo: true,
    promoDiscountPercent: 15,
    promoTag: 'LIVE EVENT MIXER',
    depositAmount: 1800000,
    rating: 4.9,
    reviewsCount: 35,
    includedAccessories: ['Flight Case Doghouse', 'Router Wi-Fi TP-Link 5GHz untuk iPad remote', 'Kabel Power', 'Dust Cover']
  },
  {
    id: 'prod-17',
    name: 'Shure BLX288/PG58 Dual Channel Wireless Microphone System',
    brand: 'Shure',
    category: 'Microphone',
    dailyPrice: 180000,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    description: 'Sistem 2 mikrofon vokal wireless legendaris dari Shure dengan setup frekuensi QuickScan satu sentuhan untuk kejernihan vokal bebas interferensi.',
    features: [
      'Sepasang (2) mikrofon genggam transmitter PG58',
      'Receiver dual channel BLX88 dengan antena internal',
      'One-touch QuickScan mencari frekuensi terbaik bebas gangguan',
      'Daya tahan baterai hingga 14 jam (2x baterai AA per mic)'
    ],
    specs: {
      'Operating Range': 'Hingga 100 meter line-of-sight',
      'Audio Dynamic Range': '100 dB',
      'Outputs': '2x XLR balance, 2x 1/4" unbalance',
      'RF Band': 'UHF band M19 / K12'
    },
    isPromo: false,
    depositAmount: 400000,
    rating: 4.8,
    reviewsCount: 68,
    includedAccessories: ['Hardcase Shure Portable', 'Adaptor Power Original', '2x Mic Stand Boom Hitam', '4x Baterai AA Alkaline Baru', '2x Busa Mic']
  },
  {
    id: 'prod-18',
    name: 'Sennheiser EW-D SKM-S Digital Wireless Vocal Set',
    brand: 'Sennheiser',
    category: 'Microphone',
    dailyPrice: 250000,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
    description: 'Sistem mic wireless digital generasi terbaru dengan rentang dinamis 134 dB dan latency mendekati 0 (1.9ms), dapat dikontrol via aplikasi smartphone.',
    features: [
      'Digital UHF menghilangkan noise, hiss, dan drop-out sinyal',
      'Dynamic range 134 dB tanpa distorsi pada vokal teriakan',
      'Aplikasi Sennheiser Smart Assist untuk auto-tuning cepat',
      'Kapsul mic MMD 835 cardioid condenser premium'
    ],
    specs: {
      'Latency': 'Ultra-low 1.9 ms',
      'Frequency Response': '20 Hz - 20,000 Hz',
      'Tuning Bandwidth': 'Hingga 56 MHz',
      'Weight': 'approx 304g'
    },
    isPromo: true,
    promoDiscountPercent: 10,
    promoTag: 'STUDIO GRADE VOCAL',
    depositAmount: 600000,
    rating: 5.0,
    reviewsCount: 24,
    includedAccessories: ['Custom Road Case', '2x Antena BNC', 'Rackmount Kit', 'Stand Mic K&M', 'Baterai Pack AA']
  },
  {
    id: 'prod-19',
    name: 'Beam 230W 7R Moving Head Stage Light (Sepasang/2 Unit)',
    brand: 'Stage Pro Light',
    category: 'Lighting & Stage',
    dailyPrice: 350000,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    description: 'Sepasang lampu panggung Beam 230 7R dengan sorot tajam tembus asap, 14 warna, 17 gobo pola, dan efek prisma 8-facet putar dramatis.',
    features: [
      'Lampu Osram 7R 230 Watt super terang tembus ruang outdoor',
      '14 roda warna + warna putih dengan efek rainbow',
      '17 pola gobo statis dengan gobo shake effect',
      'Prisma 8-facet berputar dua arah untuk efek laser beam'
    ],
    specs: {
      'Channel DMX': '16 / 20 Channels DMX512',
      'Pan / Tilt': '540° Pan / 270° Tilt dengan resolusi 16-bit',
      'Strobe': 'Double shutter strobe 1-13 kali per detik',
      'Weight': '16.5 kg per unit'
    },
    isPromo: true,
    promoDiscountPercent: 12,
    promoTag: 'FESTIVAL LIGHTING',
    depositAmount: 800000,
    rating: 4.7,
    reviewsCount: 19,
    includedAccessories: ['Flight Case isi 2 unit beroda', '2x Klem Bracket Truss Aluminium', '2x Kabel Powercon', '2x Kabel DMX 10m']
  },
  {
    id: 'prod-20',
    name: 'LED Par Light 54x3W RGBW Full Color (Paket 4 Unit + DMX Controller)',
    brand: 'Stage Pro Light',
    category: 'Lighting & Stage',
    dailyPrice: 200000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    description: 'Paket 4 unit lampu sorot panggung LED Par 54 mata x 3 Watt RGBW lengkap dengan mini DMX operator console untuk mewarnai panggung band dan DJ booth.',
    features: [
      '54 Buah LED 3W ultra-bright (Merah, Hijau, Biru, Putih)',
      'Sudut sebaran cahaya 25 derajat mencakup seluruh latar panggung',
      'Mode kontrol: DMX512, Sound Active (mengikuti beat musik), Auto Run',
      'Bodi aluminium cor pembuang panas efisien dan senyap'
    ],
    specs: {
      'LED Quantity': '54x3W RGBW (12R, 18G, 18B, 6W)',
      'Power Consumption': '180 Watt per unit',
      'DMX Channels': '8 Channels per lampu',
      'Total Weight': '14 kg (Paket 4 unit + controller)'
    },
    isPromo: false,
    depositAmount: 500000,
    rating: 4.8,
    reviewsCount: 37,
    includedAccessories: ['4x Lampu LED Par 54x3W', '1x DMX 512 Operator 192 Controller', '4x Kabel DMX 5m & 4x Kabel Power', '4x Bracket Gantung']
  }
];

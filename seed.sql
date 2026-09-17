-- Seed Data untuk Cloudflare D1 Database

-- Inisialisasi Kupon Promo
INSERT OR REPLACE INTO promotions (code, discount_type, discount_value, min_spend, description) VALUES ('SEWASERU15', 'percentage', 15, 500000, 'Diskon 15% untuk semua penyewaan alat musik & DJ (Min. Sewa Rp 500.000)');
INSERT OR REPLACE INTO promotions (code, discount_type, discount_value, min_spend, description) VALUES ('PROMODJ10', 'percentage', 10, 400000, 'Diskon 10% untuk perlengkapan DJ & Sound System');
INSERT OR REPLACE INTO promotions (code, discount_type, discount_value, min_spend, description) VALUES ('WEEKEND50K', 'fixed', 50000, 300000, 'Potongan langsung Rp 50.000 untuk penyewaan minimal Rp 300.000');

-- Inisialisasi Produk Awal
INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-01',
  'Pioneer DJ CDJ-3000 Professional Multi Player',
  'Pioneer DJ',
  'DJ Gear',
  750000,
  4,
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  'Flagship DJ multi-player standar klub dunia dengan layar sentuh 9 inci resolusi tinggi dan micro-processing unit (MPU) super cepat.',
  '["Touch screen 9\" dengan Touch Preview & Touch Cue","Audio DAC 96kHz/32-bit floating point","Pro DJ Link dengan Gigabit Ethernet","Key Sync & Key Shift hardware buttons"]',
  '{"Frequency Range":"4 - 40000 Hz","D/A Converter":"32 bit","Screen":"9 inch full-colour HD LCD touch","Weight":"5.5 kg"}',
  1,
  10,
  'SUPERSTAR DJ PICK',
  1500000,
  4.9,
  38,
  '["Hardcase Flight Case","Kabel Power","Kabel RCA Audio","Kabel LAN Pro DJ Link"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-02',
  'Pioneer DJ DJM-900NXS2 4-Channel Mixer',
  'Pioneer DJ',
  'DJ Gear',
  650000,
  3,
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
  'Mixer 4-channel standar industri festival internasional. Dilengkapi dual soundcard USB dan 6 Sound Color FX studio-grade.',
  '["Pro Sound Quality 64-bit mixing processor","Sound Color FX: Sweep, Deep, Crush, Dub Echo, Noise, Space","Independent Send/Return untuk external FX / iPad","Dual USB ports untuk seamless DJ handovers"]',
  '{"Channels":"4 audio channels, 2 mic channels","Sampling Rate":"96 kHz","Dimensions":"333 x 107.9 x 414.2 mm","Weight":"8.0 kg"}',
  0,
  0,
  NULL,
  1200000,
  4.8,
  29,
  '["Flight Case Road Ready","Kabel Power AC","Kabel USB Type-B"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-03',
  'Pioneer DJ DDJ-FLX10 4-Channel DJ Controller',
  'Pioneer DJ',
  'DJ Gear',
  450000,
  5,
  'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800&auto=format&fit=crop&q=80',
  'DJ controller 4-channel canggih untuk rekordbox dan Serato DJ Pro dengan fitur revolusioner Track Separation (Stems real-time).',
  '["Fitur Track Separation untuk vokal, drum, dan instrumen instan","On Jog Display yang dapat dikustomisasi","MAGVEL FADER 4-sensor ultra smooth","DMX Output untuk kontrol lighting panggung"]',
  '{"Compatible Software":"rekordbox, Serato DJ Pro","Audio Interface":"24 bit/44.1 kHz","Channels":"4 Deck Control","Weight":"6.7 kg"}',
  1,
  15,
  'BEST SELLER EVENT',
  1000000,
  4.9,
  45,
  '["Semi-hardcase Bag","Adaptor Power","Kabel USB-C to USB-A"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-04',
  'Technics SL-1210MK7 Direct Drive Turntable System',
  'Technics',
  'DJ Gear',
  400000,
  2,
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
  'Turntable legendaris untuk vinyl DJ, turntablist, dan pecinta scratching dengan coreless direct drive motor tanpa cogging.',
  '["Coreless Direct Drive Motor untuk putaran presisi tinggi","Fungsi Reverse Play untuk variasi performa live","Pitch control digital ±8% dan ±16%","Bodi aluminium die-cast kokoh peredam vibrasi"]',
  '{"Speeds":"33-1/3, 45, 78 rpm","Starting Torque":"0.18 N・m / 1.8 kg・cm","Dimensions":"453 x 169 x 353 mm","Weight":"9.6 kg"}',
  0,
  0,
  NULL,
  1000000,
  5,
  19,
  '["Flight Case Turntable","Slipmat Technics","Headshell & Cartridge Shure/Ortofon","Dust Cover"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-05',
  'Denon DJ Prime 4 Standalone 4-Deck DJ System',
  'Denon DJ',
  'DJ Gear',
  550000,
  2,
  'https://images.unsplash.com/photo-1546707012-c46675f12716?w=800&auto=format&fit=crop&q=80',
  'Standalone DJ system tercanggih dengan layar multitouch 10 inci. Mainkan musik tanpa laptop langsung dari Flashdisk, SD Card, atau SATA drive internal.',
  '["Layar HD 10 inci dengan gestures multi-touch","Bisa memainkan 4-deck tanpa bantuan laptop (Standalone)","Dedicated Zone Output untuk kirim musik terpisah ke ruangan lain","Built-in 2.5-inch SATA drive bay"]',
  '{"Inputs":"4 RCA, 2 XLR Combo Mic","Outputs":"Master XLR/RCA, Booth XLR, Zone XLR","Storage Support":"USB x 4, SD Card x 1, SATA bay","Weight":"9.7 kg"}',
  1,
  12,
  'STANDALONE POWER',
  1200000,
  4.7,
  16,
  '["Flight Case Odyssey","Kabel Power","Flashdisk Engine DJ Ready"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-06',
  'Fender American Professional II Stratocaster',
  'Fender',
  'Gitar & Bass',
  250000,
  6,
  'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&auto=format&fit=crop&q=80',
  'Gitar elektrik legendaris buatan USA dengan pickup V-Mod II single-coil yang jernih, warm, dan artikulasi vintage modern.',
  '["Tiga pickup V-Mod II single-coil Stratocaster","Neck profil \"Deep C\" dengan pinggiran fretboard rolled","Treble bleed circuit mempertahankan nada tinggi saat volume turun","Bridge 2-point tremolo dengan cold-rolled steel block"]',
  '{"Body":"Alder / Sunburst Finish","Neck":"Maple dengan Rosewood Fingerboard","Frets":"22 Narrow Tall","Origin":"Corona, California, USA"}',
  1,
  10,
  'POPULAR GUITAR',
  800000,
  4.9,
  52,
  '["Fender Deluxe Molded Hardcase","Strap Gitar Kulit","Kabel Jack Mogami 3m","Pick Set"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-07',
  'Gibson Les Paul Standard ''60s Iced Tea',
  'Gibson',
  'Gitar & Bass',
  350000,
  3,
  'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&auto=format&fit=crop&q=80',
  'Gitar rock & blues legendaris dengan bodi solid mahogany, figur maple top AA, dan pickup 60s Burstbucker bertonasi tebal bertenaga.',
  '["Solid Mahogany Body dengan AA Figured Maple Top","SlimTaper neck profile khas era 1960s yang nyaman","Dual 60s Burstbucker pickups dengan kapasitor Orange Drop","ABR-1 Tune-O-Matic bridge berbahan aluminium"]',
  '{"Body":"Solid Mahogany non-weight relief","Scale Length":"24.75\" / 628.65mm","Electronics":"Hand-wired Orange Drop Capacitors","Weight":"4.1 kg"}',
  0,
  0,
  NULL,
  1200000,
  4.9,
  27,
  '["Gibson Hardcase Cokelat Original","Strap Gibson","Kabel Jack Canare 5m"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-08',
  'Fender American Ultra Jazz Bass (5-String)',
  'Fender',
  'Gitar & Bass',
  280000,
  4,
  'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
  'Bass 5 senar level tertinggi dari Fender dengan pickup Ultra Noiseless Vintage dan preamp aktif 18-volt yang powerful untuk panggung.',
  '["Dual Ultra Noiseless Vintage Jazz Bass pickups","Preamp aktif 18V dengan 3-band EQ dan active/passive switch","Neck profil \"Modern D\" dengan compound radius 10\"-14\"","HiMass bridge untuk sustain nada rendah yang solid"]',
  '{"Strings":"5 Senar (Low B)","Preamp":"18-Volt Active with Passive bypass","Body":"Alder Olympic White finish","Weight":"4.4 kg"}',
  0,
  0,
  NULL,
  900000,
  4.8,
  22,
  '["Fender Elite Molded Case","Strap Bass Lebar","Kabel Jack Gold Plated"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-09',
  'Yamaha DTX6K3-X Electronic Drum Kit',
  'Yamaha',
  'Drum & Perkusi',
  400000,
  3,
  'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80',
  'Drum elektrik profesional dengan pad TCS (Textured Cellular Silicone) alami dan sound module DTX-PRO yang merekam akustik drum asli.',
  '["DTX-PRO Module dengan Kit Modifier (Ambience, Comp, Effect)","TCS Silicone pads super senyap dengan pantulan stick natural","3-Zone snare dan ride cymbal dengan choke detection","Integrasi aplikasi Rec''n''Share iOS/Android"]',
  '{"Pads":"Snare 8\" TCS, 3x Tom 7\" TCS, Kick KP90, Hi-Hat RHH135","Cymbals":"PCY135 13\" 3-zone, PCY155 15\" 3-zone","Presets":"712 suara drum berkualitas studio","Power":"12V DC Adaptor"}',
  1,
  20,
  'DISKON SPESIAL BAND',
  1000000,
  4.8,
  31,
  '["Kursi Drum Ergonomis","Single Kick Pedal Yamaha FP7210A","Drum Stick Pair","Kabel Audio Output L/R"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-10',
  'Pearl Masters Maple Complete 5-Piece Drum Set',
  'Pearl',
  'Drum & Perkusi',
  700000,
  2,
  'https://images.unsplash.com/photo-1543791187-df796fa11835?w=800&auto=format&fit=crop&q=80',
  'Set drum akustik kelas konser 100% EvenPly-Six North American Maple. Menghasilkan resonansi nada tebal, artikulasi punchy, dan sustain kaya.',
  '["Shell 6-ply 5.4mm 100% North American Maple","SuperHoop II triple-flanged hoops 2.3mm","OptiMount Suspension System untuk resonansi bebas hambatan","Konfigurasi 22\" Bass, 10\" & 12\" Toms, 16\" Floor Tom, 14\" Snare"]',
  '{"Shell Material":"Cross-laminated Maple","Finish":"Matte Caviar Black","Hardware":"Chrome Hardware Package 930 Series","Total Weight":"38 kg (Full Set)"}',
  0,
  0,
  NULL,
  1500000,
  5,
  14,
  '["Set Cymbal Zildjian A Custom (Hihat, Crash, Ride)","Full Hardware Boom Stand Pearl 930","Kursi Drum Pearl","Karpet Drum Pearl 2x1.6m"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-11',
  'Roland RD-2000 Stage Piano & Master Keyboard',
  'Roland',
  'Keyboard & Synth',
  450000,
  3,
  'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
  'Stage piano panggung terbaik di dunia dengan dual sound engines (V-Piano Acoustic Engine + SuperNATURAL Sound Generator) dan tuts kayu hibrida PHA-50.',
  '["Dual Sound Engines untuk acoustic piano tak terbatas dan elektrik piano","Tuts PHA-50 Hybrid Wood & Plastic dengan Escapement","8 Knob putar dan 9 slider dengan LED status indicator","Audio interface USB 24-bit/192kHz built-in"]',
  '{"Keys":"88 Tuts weighted hammer action","Polyphony":"Full polyphony V-Piano, 128 voice SuperNATURAL","Outputs":"Main XLR L/R balance, Main 1/4\" L/R, Sub Out 1/4\"","Weight":"21.7 kg"}',
  0,
  0,
  NULL,
  1200000,
  4.9,
  26,
  '["Flight Case Roda","Damper Sustain Pedal DP-10 Original","X-Stand Dobel Kuat","Kabel Audio Stereo"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-12',
  'Nord Stage 3 88-Key Flagship Synthesizer',
  'Nord',
  'Keyboard & Synth',
  800000,
  2,
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  'Keyboard ikonik warna merah Swedia yang wajib ada di panggung konser artis papan atas. Menggabungkan Piano, Organ B3, dan Synth Engine Lead A1.',
  '["Dual OLED displays untuk navigasi cepat di panggung gelap","Nord Lead A1 Synth Engine dengan Sample Playback 480MB","Nord C2D Organ simulations (B3 Tonewheel, Vox, Farfisa)","2GB memori piano library berdefinisi tinggi"]',
  '{"Keybed":"88 Hammer Action dengan Aftertouch","Weight":"19 kg","Outputs":"4 assignable audio outputs 1/4\"","Made In":"Stockholm, Sweden"}',
  1,
  10,
  'CONCERT STANDARD',
  1800000,
  5,
  33,
  '["Nord Soft Case Merah beroda","Nord Triple Pedal","Stand Keyboard Heavy Duty","Kabel Jack Mogami"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-13',
  'Korg Minilogue XD Polyphonic Analogue Synthesizer',
  'Keyboard & Synth',
  'Keyboard & Synth',
  200000,
  4,
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
  'Synthesizer analog 4-suara sejati dengan digital multi-engine, efek stereo studio, dan 16-step sequencer polifonik interaktif.',
  '["Sirkuit analog asli 4-voice dengan warmth melimpah","Multi-engine digital ketiga (Noise, VPM, User custom oscillator)","Efek digital DSP 32-bit (Modulation, Reverb, Delay)","Layar OLED oscilloscope yang menampilkan visual bentuk gelombang suara"]',
  '{"Keyboard":"37 tuts slim velocity-sensitive","Sequencer":"16-step polyphonic dengan Motion Sequence","I/O":"Stereo Out, Sync In/Out, MIDI In/Out, USB-B","Weight":"2.8 kg"}',
  0,
  0,
  NULL,
  600000,
  4.7,
  18,
  '["Gig Bag Korg","Adaptor DC Original","Kabel Jack Stereo 1/4\""]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-14',
  'JBL EON715 1300W 15-inch Powered PA Speaker (Sepasang)',
  'JBL Professional',
  'Sound System',
  500000,
  8,
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
  'Sepasang (2 unit) speaker aktif 15 inci 1300W peak dengan DSP canggih dari dbx (Automatic Feedback Suppression), Bluetooth 5.0 audio, dan kontrol aplikasi.',
  '["Power 1300W peak / 650W RMS per unit","Teknologi waveguide JBL untuk sebaran suara merata","Mixer 3-channel terintegrasi dengan layar LCD warna","Audio streaming via Bluetooth 5.0"]',
  '{"Frequency Response":"45 Hz - 20 kHz","Max SPL":"128 dB per speaker","Coverage":"90° horizontal x 60° vertical","Weight":"17 kg per unit"}',
  1,
  10,
  'PAKET SOUND HEMAT',
  1000000,
  4.8,
  42,
  '["2x Tripod Speaker Stand Besi","2x Kabel Power 10 meter","2x Kabel XLR Audio 15 meter","Cover Pelindung Hujan"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-15',
  'Electro-Voice EV ELX200-18SP 18" Active Subwoofer',
  'Electro-Voice',
  'Sound System',
  400000,
  4,
  'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
  'Subwoofer aktif 18 inci 1200W Class-D dengan hentakan bass sub-rendah yang menggelegar dan presisi untuk panggung live musik & DJ party.',
  '["Power Amplifier Class-D 1200 Watt berefisiensi tinggi","QuickSmartDSP dengan 3 preset (Music, Live, Club)","Sub/top system-match crossovers terkalibrasi","Pemantauan nirkabel via aplikasi QuickSmart Mobile"]',
  '{"Frequency Response":"40 Hz - 180 Hz","Max SPL":"132 dB peak","Transducer":"EVS-18L 18-inch woofer","Weight":"29 kg"}',
  0,
  0,
  NULL,
  900000,
  4.9,
  23,
  '["Tiang Speaker Pole Mount Sub-to-Top","Kabel Power 10m","Kabel XLR 10m"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-16',
  'Behringer X32 32-Channel Digital Mixing Console',
  'Behringer',
  'Sound System',
  850000,
  2,
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
  'Mixer digital 40-input 32-channel dengan preamp mikrofon rancangan Midas, 25 motorized fader bermesin, dan kontrol iPad nirkabel.',
  '["32 Preamp mikrofon Midas fully programmable","25 Motorized 100mm faders untuk instant total recall","16 XLR output seimbang ditambah 6 aux line in/out","Virtual FX Rack dengan 8 stereo effects processors"]',
  '{"Channels":"40 input channel, 25 bus","Interface":"32x32 USB Audio Interface","Network":"Remote control via Wi-Fi / Ethernet","Weight":"20.6 kg"}',
  1,
  15,
  'LIVE EVENT MIXER',
  1800000,
  4.9,
  35,
  '["Flight Case Doghouse","Router Wi-Fi TP-Link 5GHz untuk iPad remote","Kabel Power","Dust Cover"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-17',
  'Shure BLX288/PG58 Dual Channel Wireless Microphone System',
  'Shure',
  'Microphone',
  180000,
  10,
  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
  'Sistem 2 mikrofon vokal wireless legendaris dari Shure dengan setup frekuensi QuickScan satu sentuhan untuk kejernihan vokal bebas interferensi.',
  '["Sepasang (2) mikrofon genggam transmitter PG58","Receiver dual channel BLX88 dengan antena internal","One-touch QuickScan mencari frekuensi terbaik bebas gangguan","Daya tahan baterai hingga 14 jam (2x baterai AA per mic)"]',
  '{"Operating Range":"Hingga 100 meter line-of-sight","Audio Dynamic Range":"100 dB","Outputs":"2x XLR balance, 2x 1/4\" unbalance","RF Band":"UHF band M19 / K12"}',
  0,
  0,
  NULL,
  400000,
  4.8,
  68,
  '["Hardcase Shure Portable","Adaptor Power Original","2x Mic Stand Boom Hitam","4x Baterai AA Alkaline Baru","2x Busa Mic"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-18',
  'Sennheiser EW-D SKM-S Digital Wireless Vocal Set',
  'Sennheiser',
  'Microphone',
  250000,
  5,
  'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=800&auto=format&fit=crop&q=80',
  'Sistem mic wireless digital generasi terbaru dengan rentang dinamis 134 dB dan latency mendekati 0 (1.9ms), dapat dikontrol via aplikasi smartphone.',
  '["Digital UHF menghilangkan noise, hiss, dan drop-out sinyal","Dynamic range 134 dB tanpa distorsi pada vokal teriakan","Aplikasi Sennheiser Smart Assist untuk auto-tuning cepat","Kapsul mic MMD 835 cardioid condenser premium"]',
  '{"Latency":"Ultra-low 1.9 ms","Frequency Response":"20 Hz - 20,000 Hz","Tuning Bandwidth":"Hingga 56 MHz","Weight":"approx 304g"}',
  1,
  10,
  'STUDIO GRADE VOCAL',
  600000,
  5,
  24,
  '["Custom Road Case","2x Antena BNC","Rackmount Kit","Stand Mic K&M","Baterai Pack AA"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-19',
  'Beam 230W 7R Moving Head Stage Light (Sepasang/2 Unit)',
  'Stage Pro Light',
  'Lighting & Stage',
  350000,
  6,
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
  'Sepasang lampu panggung Beam 230 7R dengan sorot tajam tembus asap, 14 warna, 17 gobo pola, dan efek prisma 8-facet putar dramatis.',
  '["Lampu Osram 7R 230 Watt super terang tembus ruang outdoor","14 roda warna + warna putih dengan efek rainbow","17 pola gobo statis dengan gobo shake effect","Prisma 8-facet berputar dua arah untuk efek laser beam"]',
  '{"Channel DMX":"16 / 20 Channels DMX512","Pan / Tilt":"540° Pan / 270° Tilt dengan resolusi 16-bit","Strobe":"Double shutter strobe 1-13 kali per detik","Weight":"16.5 kg per unit"}',
  1,
  12,
  'FESTIVAL LIGHTING',
  800000,
  4.7,
  19,
  '["Flight Case isi 2 unit beroda","2x Klem Bracket Truss Aluminium","2x Kabel Powercon","2x Kabel DMX 10m"]'
);

INSERT OR REPLACE INTO products (
  id, name, brand, category, daily_price, stock, image, description,
  features, specs, is_promo, promo_discount_percent, promo_tag,
  deposit_amount, rating, reviews_count, included_accessories
) VALUES (
  'prod-20',
  'LED Par Light 54x3W RGBW Full Color (Paket 4 Unit + DMX Controller)',
  'Stage Pro Light',
  'Lighting & Stage',
  200000,
  8,
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
  'Paket 4 unit lampu sorot panggung LED Par 54 mata x 3 Watt RGBW lengkap dengan mini DMX operator console untuk mewarnai panggung band dan DJ booth.',
  '["54 Buah LED 3W ultra-bright (Merah, Hijau, Biru, Putih)","Sudut sebaran cahaya 25 derajat mencakup seluruh latar panggung","Mode kontrol: DMX512, Sound Active (mengikuti beat musik), Auto Run","Bodi aluminium cor pembuang panas efisien dan senyap"]',
  '{"LED Quantity":"54x3W RGBW (12R, 18G, 18B, 6W)","Power Consumption":"180 Watt per unit","DMX Channels":"8 Channels per lampu","Total Weight":"14 kg (Paket 4 unit + controller)"}',
  0,
  0,
  NULL,
  500000,
  4.8,
  37,
  '["4x Lampu LED Par 54x3W","1x DMX 512 Operator 192 Controller","4x Kabel DMX 5m & 4x Kabel Power","4x Bracket Gantung"]'
);


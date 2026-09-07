# SoundRent PRO - Platform E-Commerce Penyewaan Alat Musik & DJ Gear

Aplikasi web modern untuk penyewaan alat musik dan perangkat DJ profesional dengan informasi ketersediaan stok real-time, sistem promosi & kupon diskon, kalkulator durasi sewa, checkout jaminan sewa (KTP/WhatsApp), simulator Payment Gateway (QRIS & Virtual Account), dan 100% siap dideploy ke **Cloudflare Pages**.

---

## Fitur Utama

- **Informasi Stok Real-Time**: 
  - Indikator visual ketersediaan unit: *Tersedia*, *Sisa N Unit (Warning)*, atau *Stok Tersewa / Habis*.
  - Pengurangan stok otomatis setelah pembayaran berhasil dikonfirmasi.
- **Katalog & Filter Lengkap**: 
  - Filter kategori: *DJ Gear*, *Gitar & Bass*, *Drum & Perkusi*, *Keyboard & Synth*, *Sound System*, *Microphone*, *Lighting & Stage*.
  - Filter hanya produk yang ready stock & hanya produk yang sedang diskon promo.
  - Pengurutan berdasarkan rekomendasi, tarif sewa terendah/tertinggi, dan rating ulasan.
- **Promosi & Diskon**:
  - Banner hero interaktif dengan tombol satu klik salin & terapkan kupon.
  - Kode kupon aktif:
    - `SEWASERU15`: Diskon 15% (Min. sewa Rp 500.000)
    - `PROMODJ10`: Diskon 10% (Min. sewa Rp 400.000)
    - `WEEKEND50K`: Potongan langsung Rp 50.000 (Min. sewa Rp 300.000)
- **Sistem Booking & Tanggal Sewa**:
  - Kalender pemilihan tanggal mulai dan selesai sewa.
  - Perhitungan otomatis durasi hari sewa (`Tarif per hari x Jumlah Unit x Hari`).
- **Verifikasi Jaminan Sewa & Checkout**:
  - Formulir identitas resmi (Nama, WhatsApp, NIK KTP/SIM, Alamat Lokasi Acara).
  - Sistem uang jaminan deposit sewa (100% refundable setelah alat dikembalikan).
- **Payment Gateway Interaktif**:
  - Simulasi pembayaran online standar Indonesia: **QRIS** (GoPay, OVO, ShopeePay, Dana, BCA) & **Virtual Account** (BCA, Mandiri, BRI).
  - Tombol simulasi webhook callback instan dengan efek animasi perayaan konfirmasi sewa.
  - Siap dihubungkan ke backend Midtrans Snap / Xendit Invoice.
- **20 Data Dummy Realistis**:
  - Dilengkapi spesifikasi teknis, daftar kabel/hardcase bawaan, foto resolusi tinggi, dan harga pasar rental Indonesia.

---

## 20 Daftar Data Dummy Alat Musik & DJ

1. **Pioneer DJ CDJ-3000 Professional Multi Player** (DJ Gear) - Rp 750.000 / hari (Stok: 4) [Promo 10%]
2. **Pioneer DJ DJM-900NXS2 4-Channel Mixer** (DJ Gear) - Rp 650.000 / hari (Stok: 3)
3. **Pioneer DJ DDJ-FLX10 4-Channel DJ Controller** (DJ Gear) - Rp 450.000 / hari (Stok: 5) [Promo 15%]
4. **Technics SL-1210MK7 Direct Drive Turntable** (DJ Gear) - Rp 400.000 / hari (Stok: 2)
5. **Denon DJ Prime 4 Standalone DJ System** (DJ Gear) - Rp 550.000 / hari (Stok: 2) [Promo 12%]
6. **Fender American Professional II Stratocaster** (Gitar & Bass) - Rp 250.000 / hari (Stok: 6) [Promo 10%]
7. **Gibson Les Paul Standard '60s Iced Tea** (Gitar & Bass) - Rp 350.000 / hari (Stok: 3)
8. **Fender American Ultra Jazz Bass (5-String)** (Gitar & Bass) - Rp 280.000 / hari (Stok: 4)
9. **Yamaha DTX6K3-X Electronic Drum Kit** (Drum & Perkusi) - Rp 400.000 / hari (Stok: 3) [Promo 20%]
10. **Pearl Masters Maple Complete 5-Piece Drum Set** (Drum & Perkusi) - Rp 700.000 / hari (Stok: 2)
11. **Roland RD-2000 Stage Piano & Master Keyboard** (Keyboard & Synth) - Rp 450.000 / hari (Stok: 3)
12. **Nord Stage 3 88-Key Flagship Synthesizer** (Keyboard & Synth) - Rp 800.000 / hari (Stok: 2) [Promo 10%]
13. **Korg Minilogue XD Polyphonic Synthesizer** (Keyboard & Synth) - Rp 200.000 / hari (Stok: 4)
14. **JBL EON715 1300W Active PA Speaker (Sepasang)** (Sound System) - Rp 500.000 / hari (Stok: 8) [Promo 10%]
15. **Electro-Voice EV ELX200-18SP 18" Subwoofer** (Sound System) - Rp 400.000 / hari (Stok: 4)
16. **Behringer X32 32-Channel Digital Mixing Console** (Sound System) - Rp 850.000 / hari (Stok: 2) [Promo 15%]
17. **Shure BLX288/PG58 Dual Wireless Mic System** (Microphone) - Rp 180.000 / hari (Stok: 10)
18. **Sennheiser EW-D SKM-S Digital Wireless Vocal Set** (Microphone) - Rp 250.000 / hari (Stok: 5) [Promo 10%]
19. **Beam 230W 7R Moving Head Stage Light (Sepasang)** (Lighting & Stage) - Rp 350.000 / hari (Stok: 6) [Promo 12%]
20. **LED Par Light 54x3W RGBW (Paket 4 Unit + DMX)** (Lighting & Stage) - Rp 200.000 / hari (Stok: 8)

---

## Menjalankan Proyek Secara Lokal

1. Buka terminal pada folder proyek:
   ```bash
   cd C:\Users\USER\.gemini\antigravity\scratch\music-dj-rent
   ```
2. Pasang semua dependensi:
   ```bash
   npm install
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
4. Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:5173`).

---

## Panduan Deploy ke Cloudflare Pages (Deploy Sendiri)

Aplikasi ini menghasilkan build berkas statis super cepat di folder `dist/`, sehingga sangat hemat resource dan memiliki performa loading instan melalui jaringan Edge Global Cloudflare.

### Opsi A: Deploy Otomatis via Git (GitHub / GitLab) - Paling Direkomendasikan
1. Buat repository baru di GitHub/GitLab Anda, lalu push folder proyek ini:
   ```bash
   git init
   git add .
   git commit -m "Initial commit SoundRent E-Commerce"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
2. Masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git**.
3. Pilih repository GitHub Anda.
4. Isi konfigurasi build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js Version** (Environment Variable): `NODE_VERSION` = `20` atau `22`
5. Klik **Save and Deploy**. Cloudflare akan secara otomatis membuild dan memberikan domain gratis seperti `https://soundrent-xyz.pages.dev`.

### Opsi B: Deploy Langsung Menggunakan Cloudflare Wrangler CLI (Tanpa Git)
1. Login ke akun Cloudflare melalui CLI:
   ```bash
   npx wrangler login
   ```
2. Jalankan build produksi lokal:
   ```bash
   npm run build
   ```
3. Kirim folder `dist` langsung ke Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist --project-name=soundrent-dj-store
   ```
4. Cloudflare akan mengunggah dan memberikan URL live website Anda seketika.

---

## Panduan Mengintegrasikan ke Midtrans / Xendit Asli

Jika Anda ingin mengaktifkan pembayaran asli (live production):
1. **Midtrans**:
   - Daftarkan akun di [Midtrans](https://midtrans.com/).
   - Buat endpoint backend kecil (bisa menggunakan **Cloudflare Workers** atau serverless function) untuk memanggil API Midtrans Snap: `POST https://app.midtrans.com/snap/v1/transactions` dengan Server Key Anda.
   - Panggil Snap modal di frontend: `window.snap.pay(snapToken)`.
2. **Xendit**:
   - Daftarkan akun di [Xendit](https://www.xendit.co/).
   - Panggil API `POST https://api.xendit.co/v2/invoices` dari backend/Worker dan arahkan customer ke URL Invoice pembayaran.

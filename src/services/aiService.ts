import { Product } from '../types';
import { ChatMessage, AIPromptSuggestion } from '../types/ai';
import { PROMO_COUPONS } from '../data/promotions';

export const DEFAULT_PROMPT_SUGGESTIONS: AIPromptSuggestion[] = [
  {
    id: 'p1',
    label: 'Paket DJ Party Club',
    prompt: 'Rekomendasikan paket DJ lengkap untuk acara party / club malam',
    icon: '🎧',
    category: 'dj',
  },
  {
    id: 'p2',
    label: 'Live Band Kafe & Akustik',
    prompt: 'Saya butuh rekomendasi alat musik live band kafe untuk 50-100 orang',
    icon: '🎸',
    category: 'band',
  },
  {
    id: 'p3',
    label: 'Sound System & Mic Wedding',
    prompt: 'Rekomendasikan sound system, mic wireless, dan mixer untuk acara wedding',
    icon: '🔊',
    category: 'sound',
  },
  {
    id: 'p4',
    label: 'Sewa Hemat Budget < Rp 300rb',
    prompt: 'Rekomendasikan alat musik atau perangkat yang tarif sewanya di bawah Rp 300.000 per hari',
    icon: '💰',
    category: 'budget',
  },
  {
    id: 'p5',
    label: 'Kupon Promo & Diskon',
    prompt: 'Apa saja kode voucher promo sewa dan diskon yang sedang aktif?',
    icon: '🏷️',
    category: 'promo',
  },
];

export class AIService {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  public async generateResponse(userMessage: string, _chatHistory?: ChatMessage[]): Promise<ChatMessage> {
    const trimmed = userMessage.trim().toLowerCase();
    
    // Check if external Gemini API key is configured
    const geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        return await this.callGeminiAPI(userMessage, geminiApiKey);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to built-in smart engine:', err);
      }
    }

    // Built-in Smart Audio & Gear Consultant Engine
    return this.generateSmartLocalResponse(trimmed);
  }

  private generateSmartLocalResponse(query: string): ChatMessage {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const id = `msg-${Date.now()}`;

    // 1. INTENT: DJ Equipment / Party
    if (query.includes('dj') || query.includes('cdj') || query.includes('turntable') || query.includes('club') || query.includes('party')) {
      const djItems = this.products.filter(p => p.category === 'DJ Gear');
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Untuk kebutuhan **DJ Party & Club**, kami sangat merekomendasikan setup standar festival internasional:\n\n` +
          `1. **Pioneer CDJ-3000 + DJM-900NXS2**: Pilihan mutlak DJ profesional dan festival panggung besar. Dilengkapi mikroprosesor ultra cepat dan DSP 64-bit studio.\n` +
          `2. **Pioneer DDJ-FLX10**: Pilihan terfavorit jika menggunakan laptop rekordbox/Serato, memiliki fitur Track Separation (Stems real-time) revolusioner!\n` +
          `3. **Technics SL-1210MK7**: Terbaik untuk vinyl DJ dan pertunjukan scratch manual.\n\n` +
          `Semua unit DJ kami sudah termasuk **Flight Case Road-Ready & kabel audio lengkap**. Berikut pilihan alat yang ready stock:`,
        recommendedProducts: djItems.slice(0, 3),
        suggestedPrompts: [
          'Berapa watt sound system untuk DJ Party?',
          'Apakah ada diskon untuk sewa DJ gear weekend?',
          'Bagaimana cara booking sewa 3 hari?'
        ],
        bundleSummary: {
          packageName: 'Paket DJ Superstar Pro (CDJ-3000 + DJM-900NXS2)',
          totalDailyPrice: 1400000,
          discountedDailyPrice: 1190000,
          productIds: ['prod-01', 'prod-02']
        }
      };
    }

    // 2. INTENT: Band / Akustik / Kafe / Konser
    if (query.includes('band') || query.includes('gitar') || query.includes('bass') || query.includes('drum') || query.includes('keyboard') || query.includes('kafe') || query.includes('akustik')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Untuk performa **Live Band Kafe & Konser Musik**, berikut kombinasi instrumen terbaik yang terjamin prima:\n\n` +
          `🎸 **Fender Stratocaster USA & Jazz Bass 5-String**: Karakter tone renyah, serbaguna untuk pop, jazz, hingga rock.\n` +
          `🥁 **Yamaha DTX6K3-X (Elektrik)**: Pilihan ideal untuk kafe indoor karena volume bisa diatur presisi tanpa mengganggu pengunjung.\n` +
          `🎹 **Roland RD-2000 / Nord Stage 3**: Stage piano legendaris dengan suara grand piano akustik dan synth otentik.\n\n` +
          `Semua gitar dan drum sudah dilengkapi hardcase, strap, pedal kick, dan kabel jack bermutu tinggi.`,
        recommendedProducts: [
          this.products.find(p => p.id === 'prod-06')!, // Fender Stratocaster
          this.products.find(p => p.id === 'prod-09')!, // Yamaha DTX Drum
          this.products.find(p => p.id === 'prod-11')!, // Roland RD-2000
        ].filter(Boolean),
        suggestedPrompts: [
          'Rekomendasikan sound system untuk band',
          'Apakah bisa sewa drum akustik Pearl?',
          'Cek kode voucher diskon band'
        ]
      };
    }

    // 3. INTENT: Sound System, Speaker, PA, Mic, Mixer, Watt
    if (query.includes('sound') || query.includes('speaker') || query.includes('watt') || query.includes('mic') || query.includes('mixer') || query.includes('wedding')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Berikut panduan kapasitas **Sound System & Mikrofon** berdasarkan kapasitas acara Anda:\n\n` +
          `🔊 **Kapasitas 50 - 200 Orang (Indoor/Semi-Outdoor)**:\n` +
          `Gunakan sepasang **JBL EON715 (1300W Peak)** yang jernih dengan dispersi 90°. Tambahkan subwoofer **EV ELX200-18SP (1200W)** jika memutar musik berkarakter bass tebal (EDM/Band).\n\n` +
          `🎤 **Vokal & MC Jernih Bebas Feedback**:\n` +
          `Gunakan **Shure BLX288/PG58 Dual Wireless** (sudah termasuk stand & baterai baru) atau **Sennheiser EW-D Digital** untuk vokal penyanyi profesional.\n\n` +
          `🎛️ **Kontrol Multi-Channel**:\n` +
          `Gunakan mixer **Behringer X32** jika membutuhkan 32-channel dengan kendali nirkabel via iPad.`,
        recommendedProducts: [
          this.products.find(p => p.id === 'prod-14')!, // JBL EON715
          this.products.find(p => p.id === 'prod-15')!, // EV Subwoofer
          this.products.find(p => p.id === 'prod-17')!, // Shure Wireless Mic
        ].filter(Boolean),
        suggestedPrompts: [
          'Apakah sudah dapat kabel audio?',
          'Berapa watt listrik yang harus disiapkan?',
          'Paket hemat sound system kafe'
        ]
      };
    }

    // 4. INTENT: Budget / Di bawah 300rb / Murah
    if (query.includes('budget') || query.includes('murah') || query.includes('300') || query.includes('hemat') || query.includes('terjangkau')) {
      const budgetItems = this.products.filter(p => p.dailyPrice <= 300000);
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Mencari alat dengan **budget hemat di bawah Rp 300.000 / hari**? Kami memiliki beberapa opsi unggulan yang siap menunjang acaramu tanpa merogoh kocek dalam:\n\n` +
          `1. **Shure BLX288 Wireless Mic Dual**: Rp 180.000 / hari (Dapat 2 mic sekaligus + stand + baterai).\n` +
          `2. **Korg Minilogue XD Synth**: Rp 200.000 / hari (Synthesizer analog analog hangat).\n` +
          `3. **LED Par Light 54x3W (Paket 4 Unit + DMX)**: Rp 200.000 / hari (Lighting panggung komplit).\n` +
          `4. **Fender Stratocaster USA**: Rp 225.000 / hari (Promo diskon 10% dari Rp 250.000).\n` +
          `5. **Sennheiser EW-D Vocal Mic**: Rp 225.000 / hari (Promo diskon 10%).\n\n` +
          `Gunakan juga kode kupon \`WEEKEND50K\` untuk potongan langsung Rp 50.000!`,
        recommendedProducts: budgetItems.slice(0, 4),
        suggestedPrompts: [
          'Gunakan kupon WEEKEND50K',
          'Berapa deposit untuk mic Shure?',
          'Rekomendasi paket panggung murah'
        ]
      };
    }

    // 5. INTENT: Promo, Diskon, Voucher, Kupon
    if (query.includes('promo') || query.includes('diskon') || query.includes('voucher') || query.includes('kupon') || query.includes('kode')) {
      const couponsText = PROMO_COUPONS.map(c => `• **\`${c.code}\`**: ${c.description}`).join('\n');
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `🎉 **Kupon Promo & Diskon Sewa Aktif Hari Ini**:\n\n` +
          `${couponsText}\n\n` +
          `💡 **Tips Hemat Tambahan**:\n` +
          `- Penyewaan di atas Rp 1.000.000 otomatis mendapatkan **GRATIS Biaya Pengantaran & Setup**!\n` +
          `- Produk bertanda **HEMAT 10% - 20%** di katalog sudah langsung mendapatkan harga spesial sewa per hari.\n\n` +
          `Anda bisa langsung memasukkan kode voucher di halaman **Keranjang Sewa** sebelum checkout!`,
        recommendedProducts: this.products.filter(p => p.isPromo).slice(0, 3),
        suggestedPrompts: [
          'Pakai kode SEWASERU15',
          'Rekomendasikan paket DJ promo',
          'Berapa minimal sewa voucher?'
        ]
      };
    }

    // 6. INTENT: Syarat sewa, Deposit, Jaminan, KTP, Pembayaran
    if (query.includes('syarat') || query.includes('deposit') || query.includes('ktp') || query.includes('bayar') || query.includes('jaminan') || query.includes('rusak')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Berikut ringkasan **Syarat & Ketentuan Rental SoundRent**:\n\n` +
          `📋 **Persyaratan Identitas**:\n` +
          `- Cukup isi formulir data diri dan cantumkan nomor NIK KTP / SIM yang sah.\n\n` +
          `🛡️ **Uang Jaminan (Deposit 100% Refundable)**:\n` +
          `- Setiap alat memiliki deposit jaminan yang tertera transparan.\n` +
          `- Deposit akan dikembalikan **100% utuh** maksimal 1x24 jam setelah alat selesai digunakan dan dicek fisik.\n\n` +
          `💳 **Metode Pembayaran Online**:\n` +
          `- Mendukung QRIS (GoPay, OVO, ShopeePay, Dana, BCA Mobile) dan Virtual Account (BCA, Mandiri, BRI) dengan verifikasi otomatis instan.`,
        suggestedPrompts: [
          'Bagaimana jika alat terlambat dikembalikan?',
          'Apakah melayani pengantaran ke luar kota?',
          'Tanya rekomendasi alat panggung'
        ]
      };
    }

    // 7. INTENT: Lighting / Tata Cahaya Panggung
    if (query.includes('lighting') || query.includes('lampu') || query.includes('beam') || query.includes('par') || query.includes('panggung')) {
      const lightItems = this.products.filter(p => p.category === 'Lighting & Stage');
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Untuk efek visual panggung yang memukau, kami menyediakan:\n\n` +
          `💡 **Beam 230W 7R Moving Head (Sepasang)**: Sorot cahaya tajam menembus asap panggung dengan 14 variasi warna, prisma putar 8-facet, dan gobo dramatis.\n` +
          `🌈 **LED Par Light 54x3W (Paket 4 Unit + DMX Console)**: Lampu sorot warna-warni RGBW untuk mencuci latar belakang panggung (wash light) dengan mode mengikuti ketukan musik (*Sound Active*).\n\n` +
          `Sudah termasuk bracket klem aluminium, kabel powercon, dan kabel DMX kontrol panggung.`,
        recommendedProducts: lightItems,
        suggestedPrompts: [
          'Apakah sudah termasuk operator lighting?',
          'Berapa konsumsi daya listrik Beam 230W?',
          'Paket lighting + DJ sound system'
        ]
      };
    }

    // DEFAULT FALLBACK: General Audio Consultant
    return {
      id,
      sender: 'assistant',
      timestamp,
      text: `Halo! Saya **SoundBot AI**, konsultan teknis audio & gear rental Anda di SoundRent PRO. 🎧\n\n` +
        `Saya dapat membantu Anda dalam:\n` +
        `• Rekomendasi setup DJ (*CDJ-3000, DDJ-FLX10, Turntable Technics*).\n` +
        `• Peralatan Live Band (*Gitar Fender/Gibson, Drum Yamaha, Keyboard Nord/Roland*).\n` +
        `• Sound System PA (*Speaker JBL 1300W, EV Subwoofer, Behringer X32*).\n` +
        `• Pilihan alat sesuai budget & kupon diskon aktif.\n\n` +
        `Bisa ceritakan jenis acara Anda, lokasi ruangan (indoor/outdoor), dan perkiraan jumlah tamu/audiens?`,
      suggestedPrompts: [
        'Rekomendasi paket DJ Party',
        'Paket Live Band Kafe 50-100 orang',
        'Sound System & Mic Wedding',
        'Kupon diskon yang sedang aktif'
      ]
    };
  }

  private async callGeminiAPI(userMessage: string, apiKey: string): Promise<ChatMessage> {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Anda adalah SoundBot AI, konsultan audio dan rental alat musik & DJ profesional di SoundRent Indonesia.
Jawablah ramah, praktis, berbahasa Indonesia, dan bantu pelanggan memilih alat dari katalog rental berikut:
${this.products.map(p => `- ${p.name} (${p.category}): Rp ${p.dailyPrice}/hari, Stok: ${p.stock}`).join('\n')}

Pertanyaan user: "${userMessage}"
Berikan rekomendasi praktis.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak dapat memproses jawaban saat ini.';

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text
    };
  }
}

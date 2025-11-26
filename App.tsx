import React, { useState } from 'react';
import { AppState, ImageStatus } from './types';
import { analyzeAndCreatePrompts, generateImage } from './services/geminiService';
import { ArticleSection } from './components/ArticleSection';
import { VisualsSection } from './components/VisualsSection';

const INITIAL_ARTICLE = `Serangan phishing—upaya untuk mencuri data sensitif seperti password dan nomor kartu kredit melalui penyamaran—bukanlah hal baru. Namun, dengan munculnya AI generatif, metode penipuan ini telah berevolusi dari surel yang penuh salah ketik menjadi pesan yang sangat meyakinkan dan personal. Artikel ini akan membahas bagaimana AI memperkuat serangan phishing dan langkah-langkah konkret untuk melindungi diri. 

Ancaman Baru: Phishing yang Difasilitasi AI

Dahulu, surel phishing mudah dikenali dari tata bahasa yang buruk dan alamat pengirim yang mencurigakan. Kini, AI telah menghilangkan dua kelemahan utama ini:

Penyempurnaan Bahasa: Large Language Models (LLM) mampu menulis surel, SMS, atau pesan instan dengan tata bahasa yang sempurna dan nada yang sesuai (misalnya, otoritatif seperti bank atau mendesak seperti CEO). Ini membuat pesan penipuan hampir tidak dapat dibedakan dari komunikasi resmi.

Hyper-Personalization (Spear Phishing): AI dapat memproses data publik dalam jumlah besar—dari media sosial, pengumuman perusahaan, hingga berita—untuk menyusun serangan yang ditargetkan (spear phishing). Penipu dapat menyebutkan detail pekerjaan Anda, proyek yang sedang Anda kerjakan, atau nama rekan kerja Anda, meningkatkan kredibilitas pesan secara drastis.

Voice Phishing (Vishing) dan Deepfake: AI dapat meniru suara seseorang (deepfake) dengan menganalisis sedikit sampel suara. Penjahat siber kini menggunakan teknik vishing (phishing melalui telepon) untuk menelepon target dengan meniru suara bos atau anggota keluarga, meminta transfer uang atau data penting dengan dalih darurat.

Bagaimana AI Menghadapi AI? (Pertahanan)

Kabar baiknya, teknologi yang sama yang digunakan untuk menyerang juga dapat digunakan untuk pertahanan:

Sistem Pemblokiran Surel Tingkat Lanjut: Filter surel modern kini menggunakan AI dan machine learning untuk mendeteksi pola anomali—bukan hanya kata kunci—dalam surel masuk, bahkan yang tata bahasanya sempurna.

Otentikasi Multi-Faktor (MFA) adalah Wajib: Ini adalah benteng pertahanan terkuat. Sekalipun password Anda dicuri melalui phishing, penipu tidak dapat masuk tanpa kode kedua yang dikirim ke perangkat fisik Anda (ponsel). Gunakan MFA untuk semua akun penting.

Pelatihan Kesadaran Siber yang Diperbarui: Perusahaan harus secara rutin melatih karyawan dengan simulasi phishing yang mencakup skenario yang didukung AI, seperti pesan yang sangat personal atau panggilan suara yang mencurigakan.

Kesimpulan

Di era AI, batas antara komunikasi otentik dan penipuan menjadi sangat kabur. Perlindungan digital tidak lagi hanya bergantung pada kecerdasan software, tetapi pada kesadaran kritis setiap pengguna. Selalu perlakukan permintaan sensitif dengan skeptis, verifikasi melalui kanal kedua (misalnya, telepon langsung ke nomor yang diketahui), dan jadikan MFA sebagai kebiasaan wajib. Hanya dengan kewaspadaan ganda, kita dapat memenangkan perlombaan senjata siber melawan penipu yang kini bersenjatakan AI.`;

export default function App() {
  const [state, setState] = useState<AppState>({
    articleText: INITIAL_ARTICLE,
    status: ImageStatus.IDLE,
    prompts: null,
    images: { thumbnail: null, illustration: null },
    error: null,
  });

  const handleTextChange = (text: string) => {
    setState(prev => ({ ...prev, articleText: text }));
  };

  const handleGeneratePrompts = async () => {
    setState(prev => ({ 
      ...prev, 
      status: ImageStatus.GENERATING_PROMPTS, 
      error: null,
      images: { thumbnail: null, illustration: null } // Reset images if prompts change
    }));

    try {
      const prompts = await analyzeAndCreatePrompts(state.articleText);
      setState(prev => ({
        ...prev,
        status: ImageStatus.PROMPTS_READY,
        prompts,
      }));
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        status: ImageStatus.ERROR,
        error: e.message || "Failed to generate prompts",
      }));
    }
  };

  const handleGenerateImages = async () => {
    if (!state.prompts) return;

    setState(prev => ({ ...prev, status: ImageStatus.GENERATING_IMAGES, error: null }));

    try {
      // Execute in parallel for efficiency
      const [thumbnailBase64, illustrationBase64] = await Promise.all([
        generateImage(state.prompts.thumbnailPrompt, "16:9"),
        generateImage(state.prompts.illustrationPrompt, "4:3")
      ]);

      setState(prev => ({
        ...prev,
        status: ImageStatus.COMPLETED,
        images: {
          thumbnail: thumbnailBase64,
          illustration: illustrationBase64,
        }
      }));
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        status: ImageStatus.ERROR,
        error: e.message || "Failed to generate images. Check API key or quota.",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-white font-sans selection:bg-cyber-accent selection:text-cyber-900">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cyber-900/80 backdrop-blur-md border-b border-cyber-700">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-accent to-blue-600 flex items-center justify-center font-bold text-cyber-900 text-xl font-mono">
              C
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              CyberGuard <span className="text-cyber-accent font-mono font-normal">Visuals</span>
            </h1>
          </div>
          <div className="text-xs font-mono text-gray-500 hidden sm:block">
            POWERED BY GEMINI 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto h-screen flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Article Input */}
        <section className="flex-1 min-h-[50vh] md:h-[calc(100vh-8rem)]">
          <ArticleSection 
            text={state.articleText}
            setText={handleTextChange}
            disabled={state.status === ImageStatus.GENERATING_PROMPTS || state.status === ImageStatus.GENERATING_IMAGES}
          />
        </section>

        {/* Right Column: Visuals Control & Display */}
        <section className="w-full md:w-[450px] lg:w-[500px] h-full md:h-[calc(100vh-8rem)]">
           <VisualsSection 
              state={state}
              onGeneratePrompts={handleGeneratePrompts}
              onGenerateImages={handleGenerateImages}
           />
        </section>

      </main>
    </div>
  );
}

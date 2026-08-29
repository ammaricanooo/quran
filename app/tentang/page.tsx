import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User,
  Github,
  Linkedin,
  Instagram,
  AtSign,
  BookOpen,
  Compass,
  Clock,
  Layers,
  Wind,
  Quote,
  Sparkles,
  ScrollText,
  BookHeart,
  Newspaper,
  Gamepad2,
  CheckCircle2,
  Code2,
  Heart,
  Globe
} from "lucide-react";

export default function TentangPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Tentang Al-Qur'an Ku & Ammar Abdul Malik",
    "description": "Halaman tentang platform Al-Qur'an Ku dan profil pembuatnya, Ammar Abdul Malik.",
    "mainEntity": {
      "@type": "Person",
      "name": "Ammar Abdul Malik",
      "alternateName": "Ammaricano",
      "jobTitle": "Full Stack Software Developer",
      "url": "https://linkedin.com/in/ammaricano",
      "sameAs": [
        "https://linkedin.com/in/ammaricano",
        "https://github.com/ammaricanooo",
        "https://instagram.com/ammaricano",
        "https://threads.com/@ammaricano"
      ],
      "knowsAbout": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Islamic Tech", "Web Development"]
    }
  };

  const socialLinks = [
    { name: "LinkedIn", href: "https://linkedin.com/in/ammaricano", icon: <Linkedin size={20} />, label: "linkedin.com/in/ammaricano" },
    { name: "GitHub", href: "https://github.com/ammaricanooo", icon: <Github size={20} />, label: "github.com/ammaricanooo" },
    { name: "Instagram", href: "https://instagram.com/ammaricano", icon: <Instagram size={20} />, label: "@ammaricano" },
    { name: "Threads", href: "https://threads.com/@ammaricano", icon: <AtSign size={20} />, label: "@ammaricano" },
  ];

  const features = [
    { title: "114 Surah & 30 Juz", desc: "Teks Arab standar Kemenag RI, transliterasi Latin presisi, terjemahan resmi, dan tafsir lengkap.", icon: <BookOpen className="text-blue-400" size={24} /> },
    { title: "Audio Murottal 30 Qari", desc: "Dengarkan lantunan suara indah dari para qari internasional ayat demi ayat.", icon: <Layers className="text-indigo-400" size={24} /> },
    { title: "Jadwal Sholat & Imsakiyah", desc: "Waktu sholat akurat 5 waktu otomatis mendeteksi lokasi GPS Anda di seluruh Indonesia.", icon: <Clock className="text-teal-400" size={24} /> },
    { title: "Kumpulan Hadits Shahih", desc: "Ribuan hadits shahih dari 9 imam besar: Bukhari, Muslim, Abu Dawud, Tirmidzi, dll.", icon: <Quote className="text-rose-400" size={24} /> },
    { title: "Doa Harian & Dzikir", desc: "Koleksi doa sehari-hari dan dzikir pagi petang lengkap dengan faedah dan sanad.", icon: <Wind className="text-emerald-400" size={24} /> },
    { title: "Asmaul Husna & Maulid", desc: "99 Nama Allah beserta makna & audio, serta kitab maulid Barzanji, Simtudduror, Diba.", icon: <Sparkles className="text-amber-400" size={24} /> },
    { title: "Kuis Quran Interaktif", desc: "Mode solo dan multiplayer kuis sambung ayat & tebak surah untuk mengasah hafalan.", icon: <Gamepad2 className="text-violet-400" size={24} /> },
    { title: "Kiblat Finder & Tahlil", desc: "Arah kiblat presisi dengan kompas dan panduan tahlil ziarah kubur lengkap.", icon: <Compass className="text-cyan-400" size={24} /> },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col lg:ml-72 transition-all">
        <div className="flex-1 px-4 md:px-8 py-8 max-w-5xl mx-auto w-full space-y-12 pb-24">
          
          {/* Header Banner */}
          <section className="relative overflow-hidden bg-white/5 border border-white/10 rounded-4xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
            <div className="relative z-10 space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary-2 text-xs font-black uppercase tracking-wider">
                <Code2 size={14} /> Profil Pengembang &amp; Platform
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Tentang Al-Qur&apos;an Ku &amp; Ammar Abdul Malik
              </h1>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify">
                Al-Qur&apos;an Ku adalah platform aplikasi Al-Qur&apos;an digital modern, cepat, dan terlengkap di Indonesia yang dikembangkan oleh <strong>Ammar Abdul Malik</strong>. Dibuat dengan niat tulus untuk memfasilitasi umat Islam dalam membaca, memahami, mendengarkan murottal, dan mengamalkan isi kandungan Al-Qur&apos;an di era digital.
              </p>
            </div>
          </section>

          {/* Profil Ammar Abdul Malik */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-xl">
              <div className="w-28 h-28 mx-auto rounded-3xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                <User size={56} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Ammar Abdul Malik</h2>
                <p className="text-xs font-semibold text-primary-2 uppercase tracking-widest mt-0.5">Software Engineer &amp; Creator</p>
                <p className="text-xs text-gray-400 mt-2">Dikenal luas sebagai <strong>Ammaricano</strong></p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-left">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-medium"
                  >
                    <span className="text-primary-2">{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                  <Heart className="text-red-400" size={20} /> Visi &amp; Dedikasi
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed text-justify">
                  Platform ini dibangun secara independen oleh <strong>Ammar Abdul Malik</strong> dengan visi menghadirkan Al-Qur&apos;an digital yang ramah pengguna, berkecepatan tinggi, bebas iklan mengganggu, dan sarat fitur edukasi Islami. Seluruh data Al-Qur&apos;an, terjemahan, dan tafsir mengacu pada standar resmi Kementerian Agama Republik Indonesia (Kemenag RI).
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                  <Globe className="text-teal-400" size={20} /> Teknologi Modern
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Dibangun menggunakan ekosistem web modern untuk memastikan performa kilat, SEO optimal, dan pengalaman mobile PWA yang responsif:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Next.js App Router", "React 19", "TypeScript", "Tailwind CSS", "Firebase Firestore & Auth", "Progressive Web App (PWA)", "Web Audio API", "Schema.org Rich Snippets"].map((tech) => (
                    <span key={tech} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-gray-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Fitur Lengkap Al-Qur'an Ku */}
          <section className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl md:text-3xl font-black">Fitur Unggulan Al-Qur&apos;an Ku</h2>
              <p className="text-xs md:text-sm text-gray-400">
                Lengkap, akurat, dan dirancang khusus untuk kenyamanan ibadah sehari-hari.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg space-y-3">
                  <div className="p-3 bg-white/5 rounded-2xl w-fit">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-base text-white">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed text-justify">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Komitmen & Legalitas */}
          <section className="bg-linear-to-r from-primary/10 to-primary-2/10 border border-primary/20 rounded-3xl p-6 md:p-8 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={20} /> 100% Gratis &amp; Terbuka untuk Umat
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed text-justify">
              Al-Qur&apos;an Ku karya Ammar Abdul Malik berkomitmen untuk selalu menyediakan akses Al-Qur&apos;an dan kajian Islam secara gratis tanpa biaya langganan apapun. Kritik, saran, atau masukan untuk pengembangan aplikasi dapat disampaikan langsung melalui kontak media sosial resmi pengembang.
            </p>
          </section>

          <Footer />
        </div>
      </main>
    </>
  );
}

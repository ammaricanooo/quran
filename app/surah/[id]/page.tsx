"use client";

import { useState, useRef, useEffect, use as useHook } from "react";
import Link from "next/link";
import { Play, Pause, ExternalLink, BookOpen, ChevronUp, ArrowLeft, ScrollText, Search } from 'lucide-react';

const LIST_QARI = [
  { id: "01", name: "Abdullah Al-Juhany", img: "/abdullah.webp" },
  { id: "02", name: "Abdul-Muhsin", img: "/muhsin.png" },
  { id: "05", name: "Misyari Rasyid", img: "/rashid.png" },
  { id: "06", name: "Yasser Al-Dosari", img: "/Yasser.png" },
];

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrapping params dengan benar untuk Client Component
  const resolvedParams = useHook(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<any>(null);
  const [currentAyatIndex, setCurrentAyatIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQari, setSelectedQari] = useState("05");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [tafsirData, setTafsirData] = useState<any[]>([]);
  const [openTafsirIndex, setOpenTafsirIndex] = useState<number | null>(null);

  const [surahList, setSurahList] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk mobile drawer

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch daftar surah untuk navigasi
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((json) => setSurahList(json.data));
  }, []);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        // Update Title secara dynamic di Client Side
        document.title = `${json.data.namaLatin} - Al-Qur'an Ku`;
      });
  }, [id]);

  useEffect(() => {
    if (isPlaying && currentAyatIndex !== null && audioRef.current) {
      const currentPos = audioRef.current.currentTime;
      audioRef.current.src = data.ayat[currentAyatIndex].audio[selectedQari];
      audioRef.current.load();
      audioRef.current.currentTime = currentPos;
      audioRef.current.play();
    }
  }, [selectedQari]);

  const playAudio = async (index: number) => {
    if (!data || !audioRef.current) return;

    const audioUrl = data.ayat[index].audio[selectedQari];

    // Reset audio jika ganti ayat
    if (currentAyatIndex !== index) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }

    setCurrentAyatIndex(index);

    try {
      // Browser butuh interaksi user, .play() di sini dipicu oleh onClick (aman)
      await audioRef.current.play();
      setIsPlaying(true);

      ayatRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  const handleShare = (item: any) => {
    const text = `📖 *${data.namaLatin} Ayat ${item.nomorAyat}*\n\n${item.teksArab}\n\n"${item.teksIndonesia}"\n\nBaca di Al-Qur'an Ku: ${window.location.href}`;

    if (navigator.share) {
      navigator.share({ title: data.namaLatin, text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Ayat disalin!");
    }
  };

  const handleNextAyat = () => {
    if (data && currentAyatIndex !== null && currentAyatIndex < data.ayat.length - 1) {
      playAudio(currentAyatIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentAyatIndex(null);
    }
  };

  useEffect(() => {
    // Fetch Data Surah
    fetch(`https://equran.id/api/v2/surat/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        document.title = `${json.data.namaLatin} - Al-Qur'an Ku`;
      });

    // Fetch Data Tafsir
    fetch(`https://equran.id/api/v2/tafsir/${id}`)
      .then((res) => res.json())
      .then((json) => setTafsirData(json.data.tafsir));
  }, [id]);

  if (!data) return <div className="p-10 text-white animate-pulse text-center">Memuat...</div>;

  const filteredSurah = surahList.filter((s) =>
    s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nomor.toString().includes(searchQuery)
  );

  return (
    <>
      {/* Sidebar Desktop & Overlay Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tighter">Daftar <span className="text-primary-2">Surah</span></h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/5 rounded-xl"><ChevronUp className="-rotate-90" size={18} /></button>
          </div>
          <div className="relative group mb-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Cari Surah (contoh: Al-Fatihah atau Kahfi)..."
              className="w-full bg-white/5 border border-white/5 rounded-3xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
            {filteredSurah.map((s) => (
              <Link
                key={s.nomor}
                href={`/surah/${s.nomor}`}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${id === String(s.nomor) ? "bg-primary-2/20 border-primary-2/50 text-primary-2" : "bg-white/5 border-transparent hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono opacity-50">{s.nomor}</span>
                  <span className="text-sm font-bold">{s.namaLatin}</span>
                </div>
                <i
                  className={`font-surah-icon icon-${s.nomor} text-white/30 group-hover:text-white transition-all duration-500`}
                  data-icon={String.fromCharCode(0xE800 + s.nomor)}
                ></i>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Overlay untuk nutup sidebar di mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* STICKY HEADER AREA */}
        <div className="sticky top-0 z-20 p-6 transition-all duration-300">
          <header className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition">
                  <ArrowLeft size={20} />
                </Link>
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold">
                  <ScrollText size={16} className="text-primary-2" /> Daftar Surah
                </button>
              </div>

              {/* INPUT LONCAT AYAT */}
              <div className="flex items-center bg-white/5 rounded-xl border border-white/5 px-3 py-1.5">
                <span className="text-[10px] font-black text-gray-500 uppercase mr-2">Ke Ayat</span>
                <input
                  type="number"
                  min="1"
                  max={data.jumlahAyat}
                  placeholder="..."
                  className="w-12 bg-transparent text-sm font-bold focus:outline-none text-primary-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt((e.target as HTMLInputElement).value);
                      if (val > 0 && val <= data.jumlahAyat) {
                        ayatRefs.current[val - 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <h1 className="md:text-3xl font-black tracking-tighter leading-none">
                Surah<span className="text-primary-2"> {data.namaLatin}</span>
              </h1>
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-primary-2 uppercase tracking-widest leading-none mb-1">{data.arti}</p>
                <p className="text-xs opacity-50 font-bold uppercase tracking-widest">{data.jumlahAyat} Ayat</p>
              </div>
            </div>
          </header>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Card Info */}
            {/* DATA SINGKAT SURAT (Card Info) */}
            <div className="relative overflow-hidden bg-linear-to-br from-primary to-secondary p-8 rounded-4xl mb-10 shadow-2xl">
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold mb-1">{data.namaLatin}</h2>
                <p className="text-lg opacity-90 mb-4">{data.arti}</p>
                <div className="h-px w-full max-w-50 bg-white/30 mb-4"></div>
                <div className="flex gap-4 text-sm font-medium uppercase tracking-widest">
                  <span>{data.tempatTurun}</span>
                  <span>•</span>
                  <span>{data.jumlahAyat} Ayat</span>
                </div>
                {/* Ornament Kaligrafi background */}
                <div className="font-ayat absolute -right-10 -bottom-10 opacity-10 text-9xl font-arabic select-none">{data.nama}
                </div>
              </div>
            </div>

            {/* Qari Selection */}
            <div className="mb-10 overflow-hidden">
              <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">Pilih Murottal</h3>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {LIST_QARI.map((qari) => (
                  <button
                    key={qari.id}
                    onClick={() => setSelectedQari(qari.id)}
                    className={`flex flex-col items-center gap-3 p-4 min-w-35 rounded-3xl transition-all border md:w-full ${selectedQari === qari.id ? "bg-white text-bg-primary border-white" : "bg-white/5 border-white/10"
                      }`}
                  >
                    <img src={qari.img} alt={qari.name} className="w-16 h-16 object-cover rounded-full shadow-lg" />
                    <span className="text-[10px] font-black uppercase text-center leading-tight">{qari.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List Ayat */}
            <div className="space-y-6">
              {id !== "1" && id !== "9" && (
                <div className="text-center py-10 text-4xl font-arabic opacity-80 leading-loose text-white/90">
                  بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                </div>
              )}

              {data.ayat.map((item: any, index: number) => {
                // Cari teks tafsir yang sesuai dengan nomor ayat ini
                const currentTafsir = tafsirData.find((t) => t.ayat === item.nomorAyat);

                return (
                  <div
                    key={item.nomorAyat}
                    ref={(el) => { ayatRefs.current[index] = el }}
                    className={`group p-6 rounded-4xl transition-all duration-500 border ${currentAyatIndex === index ? "bg-white/15 border-white/30 shadow-2xl" : "bg-white/5 border-transparent"
                      }`}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded-2xl bg-linear-to-t from-primary to-primary-2 flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20">
                            {item.nomorAyat}
                          </div>
                          <button onClick={() => playAudio(index)} className="p-2 text-gray-400 hover:text-white transition transform active:scale-90">
                            {currentAyatIndex === index && isPlaying ? (
                              <span className="flex gap-1">
                                <span className="w-1 h-3 bg-white animate-bounce"></span>
                                <span className="w-1 h-3 bg-white animate-bounce [animation-delay:-0.2s]"></span>
                                <span className="w-1 h-3 bg-white animate-bounce [animation-delay:-0.4s]"></span>
                              </span>
                            ) : (
                              <Play size={20} fill="currentColor" />
                            )}
                          </button>
                        </div>
                        <p className="text-4xl text-right font-ayat grow leading-18" dir="rtl">
                          {item.teksArab}
                        </p>
                      </div>

                      <div className="space-y-2 border-l-2 border-primary/30 pl-4 py-1">
                        <p className="font-bold italic tracking-wide">{item.teksLatin}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{item.teksIndonesia}</p>
                      </div>

                      {/* --- TAFSIR SECTION --- */}
                      {openTafsirIndex === index && currentTafsir && (
                        <div className="mt-2 p-5 bg-black/30 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
                          <h4 className="text-xs font-bold text-primary-2 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <BookOpen size={14} /> Tafsir Kemenag
                          </h4>
                          <p className="text-sm text-gray-300 leading-loose whitespace-pre-line text-justify">
                            {currentTafsir.teks}
                          </p>
                        </div>
                      )}

                      {/* --- ACTION BUTTONS --- */}
                      <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5">
                        <button
                          onClick={() => setOpenTafsirIndex(openTafsirIndex === index ? null : index)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${openTafsirIndex === index
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                        >
                          {openTafsirIndex === index ? <ChevronUp size={14} /> : <BookOpen size={14} />}
                          {openTafsirIndex === index ? "Tutup Tafsir" : "Lihat Tafsir"}
                        </button>

                        <button
                          onClick={() => handleShare(item)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-primary-2 transition"
                        >
                          <ExternalLink size={14} />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Audio Element Hidden */}
        <audio
          ref={audioRef}
          onEnded={handleNextAyat}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Floating Player */}
        {/* Floating Player - Penempatan Responsif */}
        {currentAyatIndex !== null && (
          <div className="fixed bottom-6 left-4 right-4 lg:left-80 lg:right-8 z-30 transition-all pointer-events-none">
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-3xl border border-white/20 p-4 rounded-[2.5rem] shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-10 pointer-events-auto">
              <img src={LIST_QARI.find(q => q.id === selectedQari)?.img} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" alt="Qari" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary-2 font-black uppercase tracking-tighter">Ayat {data.ayat[currentAyatIndex].nomorAyat}</p>
                <p className="text-sm font-bold truncate">{data.namaLatin}</p>
              </div>
              <button
                onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause()}
                className="w-12 h-12 bg-white text-bg-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shrink-0"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
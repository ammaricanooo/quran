"use client";

import { useState, useRef, useEffect, use as useHook } from "react";
import Link from "next/link";
import { Play, Pause, ExternalLink, BookOpen, ChevronUp, ArrowLeft, ScrollText, Search, Layers } from 'lucide-react';

const LIST_QARI = [
  { id: "01", name: "Abdullah Al-Juhany", img: "/abdullah.webp" },
  { id: "02", name: "Abdul-Muhsin", img: "/muhsin.png" },
  { id: "05", name: "Misyari Rasyid", img: "/rashid.png" },
  { id: "06", name: "Yasser Al-Dosari", img: "/Yasser.png" },
];

export default function JuzDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useHook(params);
  const juzId = resolvedParams.id;

  const [juzData, setJuzData] = useState<any>(null);
  const [currentAyatIndex, setCurrentAyatIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQari, setSelectedQari] = useState("05");
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [openTafsirIndex, setOpenTafsirIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [juzList, setJuzList] = useState<any[]>([]);

  // 1. Fetch Daftar Juz untuk Sidebar
  useEffect(() => {
    fetch("/api/proxy-juz")
      .then((res) => res.json())
      .then((json) => setJuzList(json.data));
  }, []);

  // 2. Logika Utama "Menjahit" Ayat Juz
  useEffect(() => {
    async function fetchJuzAyats() {
      try {
        setLoading(true);
        // Ambil info rentang juz
        const resJuz = await fetch(`/api/proxy-juz/${juzId}`);
        const juzInfo = await resJuz.json();
        const dataJuz = juzInfo.data;

        const startSurah = parseInt(dataJuz.surah_id_start);
        const endSurah = parseInt(dataJuz.surah_id_end);
        
        // Fetch semua surah & tafsir yang terlibat
        const surahNumbers = Array.from({length: endSurah - startSurah + 1}, (_, i) => startSurah + i);
        
        const surahPromises = surahNumbers.map(num => 
          fetch(`https://equran.id/api/v2/surat/${num}`).then(res => res.json())
        );
        const tafsirPromises = surahNumbers.map(num => 
          fetch(`https://equran.id/api/v2/tafsir/${num}`).then(res => res.json())
        );

        const surahResponses = await Promise.all(surahPromises);
        const tafsirResponses = await Promise.all(tafsirPromises);

        let combinedVerses: any[] = [];

        surahResponses.forEach((res, idx) => {
          const sData = res.data;
          const tData = tafsirResponses[idx].data.tafsir;
          const sNum = surahNumbers[idx];

          let filtered = sData.ayat;
          if (sNum === startSurah) filtered = filtered.filter((a: any) => a.nomorAyat >= parseInt(dataJuz.verse_start));
          if (sNum === endSurah) filtered = filtered.filter((a: any) => a.nomorAyat <= parseInt(dataJuz.verse_end));

          const mapped = filtered.map((a: any) => ({
            ...a,
            surahName: sData.namaLatin,
            surahNameArab: sData.nama,
            surahNum: sData.nomor,
            tafsir: tData.find((t: any) => t.ayat === a.nomorAyat)?.teks
          }));

          combinedVerses = [...combinedVerses, ...mapped];
        });

        setJuzData({ verses: combinedVerses });
        document.title = `Juz ${juzId} - Al-Qur'an Ku`;
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchJuzAyats();
  }, [juzId]);

  // Audio Logic (Sama dengan Surah Page)
  const playAudio = async (index: number) => {
    if (!juzData || !audioRef.current) return;
    const audioUrl = juzData.verses[index].audio[selectedQari];

    if (currentAyatIndex !== index) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }

    setCurrentAyatIndex(index);
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      ayatRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) { console.error(err); }
  };

  const handleNextAyat = () => {
    if (juzData && currentAyatIndex !== null && currentAyatIndex < juzData.verses.length - 1) {
      playAudio(currentAyatIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentAyatIndex(null);
    }
  };

  const handleShare = (item: any) => {
    const text = `📖 *Juz ${juzId} - ${item.surahName} Ayat ${item.nomorAyat}*\n\n${item.teksArab}\n\n"${item.teksIndonesia}"`;
    if (navigator.share) navigator.share({ title: `Juz ${juzId}`, text });
    else { navigator.clipboard.writeText(text); alert("Disalin!"); }
  };

  if (loading) return <div className="h-screen bg-bg-primary flex items-center justify-center text-white animate-pulse font-black">MEMUAT JUZ {juzId}...</div>;

  return (
    <>
      {/* SIDEBAR JUZ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tighter">Daftar <span className="text-primary-2">Juz</span></h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/5 rounded-xl"><ChevronUp className="-rotate-90" size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
            {juzList.map((j) => (
              <Link key={j.number} href={`/juz/${j.number}`} className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${juzId === String(j.number) ? "bg-primary-2/20 border-primary-2/50 text-primary-2" : "bg-white/5 border-transparent hover:bg-white/10"}`}>
                <span className="text-sm font-bold">Juz {j.number}</span>
                <span className="text-[10px] opacity-40 font-mono">{j.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* HEADER AREA */}
        <div className="sticky top-0 z-20 p-6 border-b border-white/5">
          <header className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link href="/juz" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition"><ArrowLeft size={20} /></Link>
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold">
                  <Layers size={16} className="text-primary-2" /> Pilih Juz
                </button>
              </div>
              <div className="text-right">
                <h1 className="md:text-3xl font-black tracking-tighter">Juz <span className="text-primary-2">{juzId}</span></h1>
              </div>
            </div>
          </header>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* QARI SELECTION */}
            <div className="mb-10">
              <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Pilih Murottal</h3>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {LIST_QARI.map((qari) => (
                  <button key={qari.id} onClick={() => setSelectedQari(qari.id)} className={`flex flex-col items-center gap-3 p-4 min-w-35 rounded-3xl transition-all border md:w-full ${selectedQari === qari.id ? "bg-white text-bg-primary border-white" : "bg-white/5 border-white/10"}`}>
                    <img src={qari.img} className="w-12 h-12 object-cover rounded-full shadow-lg" alt={qari.name} />
                    <span className="text-[9px] font-black uppercase text-center leading-tight">{qari.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* LIST AYAT */}
            <div className="space-y-6">
              {juzData.verses.map((item: any, index: number) => {
                const isNewSurah = index === 0 || item.surahNum !== juzData.verses[index - 1].surahNum;
                return (
                  <div key={`${item.surahNum}-${item.nomorAyat}`} ref={(el) => { ayatRefs.current[index] = el }}>
                    {isNewSurah && (
                      <div className="my-10 text-center py-8 rounded-4xl bg-white/5 border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] font-black text-primary-2 uppercase tracking-[0.3em] mb-2">Memasuki Surah</p>
                        <h2 className="text-3xl font-black italic">{item.surahName}</h2>
                        <div className="font-ayat absolute right-0 bottom-0 opacity-5 text-7xl select-none">
                            {item.surahNameArab}
                        </div>
                      </div>
                    )}

                    <div className={`group p-6 rounded-4xl transition-all duration-500 border ${currentAyatIndex === index ? "bg-white/15 border-white/30 shadow-2xl scale-[1.01]" : "bg-white/5 border-transparent"}`}>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex gap-2">
                            <div className="w-10 h-10 rounded-2xl bg-linear-to-t from-primary to-primary-2 flex items-center justify-center text-xs font-bold shadow-lg">
                              {item.nomorAyat}
                            </div>
                            <button onClick={() => playAudio(index)} className="p-2 text-gray-400 hover:text-white transition">
                              {currentAyatIndex === index && isPlaying ? (
                                <span className="flex gap-1">
                                  <span className="w-1 h-3 bg-white animate-bounce"></span>
                                  <span className="w-1 h-3 bg-white animate-bounce [animation-delay:-0.2s]"></span>
                                  <span className="w-1 h-3 bg-white animate-bounce [animation-delay:-0.4s]"></span>
                                </span>
                              ) : <Play size={20} fill="currentColor" />}
                            </button>
                          </div>
                          <p className="text-4xl text-right font-ayat grow leading-18" dir="rtl">{item.teksArab}</p>
                        </div>

                        <div className="space-y-2 border-l-2 border-primary/30 pl-4 py-1">
                          <p className="font-bold italic tracking-wide text-primary-2/80">{item.teksLatin}</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{item.teksIndonesia}</p>
                        </div>

                        {openTafsirIndex === index && item.tafsir && (
                          <div className="mt-2 p-5 bg-black/30 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95">
                            <h4 className="text-xs font-bold text-primary-2 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={14} /> Tafsir Kemenag</h4>
                            <p className="text-sm text-gray-300 leading-loose text-justify whitespace-pre-line">{item.tafsir}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                          <div className="flex gap-2">
                            <button onClick={() => setOpenTafsirIndex(openTafsirIndex === index ? null : index)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${openTafsirIndex === index ? "bg-primary text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                              {openTafsirIndex === index ? <ChevronUp size={14} /> : <BookOpen size={14} />} Tafsir
                            </button>
                            <button onClick={() => handleShare(item)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:text-primary-2 transition">
                              <ExternalLink size={14} /> Share
                            </button>
                          </div>
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{item.surahName} : {item.nomorAyat}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <audio ref={audioRef} onEnded={handleNextAyat} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />

        {/* FLOATING PLAYER */}
        {currentAyatIndex !== null && (
          <div className="fixed bottom-6 left-4 right-4 lg:left-80 lg:right-8 z-30 pointer-events-none">
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-3xl border border-white/20 p-4 rounded-[2.5rem] shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-10 pointer-events-auto">
              <img src={LIST_QARI.find(q => q.id === selectedQari)?.img} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" alt="Qari" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary-2 font-black uppercase tracking-tighter">Ayat {juzData.verses[currentAyatIndex].nomorAyat}</p>
                <p className="text-sm font-bold truncate">{juzData.verses[currentAyatIndex].surahName}</p>
              </div>
              <button onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause()} className="w-12 h-12 bg-white text-bg-primary rounded-full flex items-center justify-center transition shadow-lg shrink-0">
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
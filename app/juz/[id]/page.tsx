"use client";

import { useState, useRef, useEffect, use as useHook } from "react";
import Link from "next/link";
import { Play, Pause, ExternalLink, BookOpen, ChevronUp, ArrowLeft, Layers, BookmarkCheck } from 'lucide-react';
import { db, auth, googleProvider } from "@/lib/firebase";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonAyatList } from "@/components/Skeleton";

const LIST_QARI = [
  { id: "01", name: "Abdullah Al-Juhany", img: "/abdullah.webp" },
  { id: "02", name: "Abdul-Muhsin", img: "/muhsin.png" },
  { id: "05", name: "Misyari Rasyid", img: "/rashid.png" },
  { id: "06", name: "Yasser Al-Dosari", img: "/Yasser.png" },
];

interface JuzVerse {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { [key: string]: string };
  surahName: string;
  surahNameArab: string;
  surahNum: number;
  tafsir?: string;
}

interface JuzDetailData {
  verses: JuzVerse[];
}

interface SidebarJuzItem {
  number: number;
  name: string;
}

interface LastReadData {
  surahNo: number;
  surahName: string;
  ayatNo: number;
}

interface TafsirItem {
  ayat: number;
  teks: string;
}


export default function JuzDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useHook(params);
  const juzId = resolvedParams.id;

  const [juzData, setJuzData] = useState<JuzDetailData | null>(null);
  const [currentAyatIndex, setCurrentAyatIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQari, setSelectedQari] = useState("05");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [savingId, setSavingId] = useState<number | null>(null);
  const [lastReadData, setLastReadData] = useState<LastReadData | null>(null);
  const [basmalahAudio, setBasmalahAudio] = useState<{ [key: string]: string } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [openTafsirIndex, setOpenTafsirIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [juzList, setJuzList] = useState<SidebarJuzItem[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 1. Fetch Daftar Juz untuk Sidebar
  useEffect(() => {
    fetch("/api/proxy-juz")
      .then((res) => res.json())
      .then((json) => setJuzList(json.data));
  }, []);

  // Auth: subscribe to user's lastRead
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.uid);
        const unsubDoc = onSnapshot(userDoc, (docSnap) => {
          if (docSnap.exists()) setLastReadData(docSnap.data().lastRead);
        });
        return () => unsubDoc();
      }
    });
    return () => unsubscribe();
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
        const surahNumbers = Array.from({ length: endSurah - startSurah + 1 }, (_, i) => startSurah + i);

        const surahPromises = surahNumbers.map(num =>
          fetch(`https://equran.id/api/v2/surat/${num}`).then(res => res.json())
        );
        const tafsirPromises = surahNumbers.map(num =>
          fetch(`https://equran.id/api/v2/tafsir/${num}`).then(res => res.json())
        );

        const surahResponses = await Promise.all(surahPromises);
        const tafsirResponses = await Promise.all(tafsirPromises);

        let combinedVerses: JuzVerse[] = [];

        surahResponses.forEach((surahRes: { data: { nomor: number; namaLatin: string; nama: string; ayat: JuzVerse[] } }, idx) => {
          const sData = surahRes.data;
          const tData: TafsirItem[] = tafsirResponses[idx].data.tafsir;
          const sNum = surahNumbers[idx];

          let filtered: JuzVerse[] = sData.ayat;
          if (sNum === startSurah) filtered = filtered.filter(a => a.nomorAyat >= parseInt(dataJuz.verse_start));
          if (sNum === endSurah) filtered = filtered.filter(a => a.nomorAyat <= parseInt(dataJuz.verse_end));

          const mapped: JuzVerse[] = filtered.map(a => ({
            ...a,
            surahName: sData.namaLatin,
            surahNameArab: sData.nama,
            surahNum: sData.nomor,
            tafsir: tData.find(t => t.ayat === a.nomorAyat)?.teks
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

   const isAyatInViewport = (index: number): boolean => {
    const element = ayatRefs.current[index];
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    return rect.top <= viewportHeight * 7 && rect.bottom >= viewportHeight * -2;
  };

  // Audio Logic (Sama dengan Surah Page)
  const playAudio = async (index: number) => {
    if (!juzData || !audioRef.current) return;
    const audioUrl = juzData.verses[index].audio[selectedQari];

    if (currentAyatIndex !== index) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setCurrentTime(0);
    }

    setCurrentAyatIndex(index);
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      
      if (isAyatInViewport(index)) {
        ayatRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) { console.error(err); }
  };

  const saveLastRead = async (surahNo: number, ayatNo: number, surahName: string) => {
    if (!auth.currentUser) {
      setShowLoginModal(true);
      return;
    }

    const isAlready = lastReadData?.surahNo === surahNo && lastReadData?.ayatNo === ayatNo;
    if (isAlready) return;

    setSavingId(ayatNo);
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        lastRead: {
          surahNo,
          surahName,
          ayatNo,
          updatedAt: new Date()
        }
      }, { merge: true });

      setLastReadData({ surahNo, surahName, ayatNo, updatedAt: new Date() });
      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err) {
      console.error("Gagal simpan:", err);
    } finally {
      setSavingId(null);
    }
  };

  // fallback clear for stuck saving state
  useEffect(() => {
    if (savingId !== null) {
      const t = setTimeout(() => setSavingId(null), 8000);
      return () => clearTimeout(t);
    }
  }, [savingId]);

  // Basmalah: prepare audio if the first surah in juz needs it
  useEffect(() => {
    const firstSurah = juzData?.verses?.[0]?.surahNum;
    if (!firstSurah) return;
    if (firstSurah !== 1 && firstSurah !== 9) {
      if (cachedBasmalahAudio) {
        setBasmalahAudio(cachedBasmalahAudio);
      } else {
        fetch("https://equran.id/api/v2/surat/1")
          .then(res => res.json())
          .then(json => {
            const audioData = json.data.ayat[0].audio;
            cachedBasmalahAudio = audioData;
            setBasmalahAudio(audioData);
          });
      }
    }
  }, [juzData]);

  const playBasmalah = () => {
    if (!basmalahAudio || !audioRef.current) return;
    audioRef.current.src = basmalahAudio[selectedQari];
    audioRef.current.load();
    audioRef.current.play();
    const handleEnd = () => { playAudio(0); audioRef.current?.removeEventListener('ended', handleEnd); };
    audioRef.current.addEventListener('ended', handleEnd);
  };

  const handleNextAyat = () => {
    if (juzData && currentAyatIndex !== null && currentAyatIndex < juzData.verses.length - 1) {
      playAudio(currentAyatIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentAyatIndex(null);
    }
  };

  const handleShare = (item: JuzVerse) => {
    const text = `📖 *Juz ${juzId} - ${item.surahName} Ayat ${item.nomorAyat}*\n\n${item.teksArab}\n\n"${item.teksIndonesia}"`;
    if (navigator.share) navigator.share({ title: `Juz ${juzId}`, text });
    else { navigator.clipboard.writeText(text); alert("Disalin!"); }
  };

  if (loading) return (
    <>
      {/* Sidebar skeleton — sama persis dimensi dengan sidebar asli */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white hidden lg:flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 w-28 bg-white/8 rounded-xl animate-pulse" />
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <Navbar hideSidebar />

      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        <div className="sticky top-0 z-20 px-4 md:px-6 py-4 border-b border-white/5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/8 rounded-2xl animate-pulse" />
              <div className="h-8 w-24 bg-white/8 rounded-xl animate-pulse lg:hidden" />
            </div>
            <div className="h-8 w-20 bg-white/8 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 pb-24 lg:pb-8">
          <SkeletonAyatList count={5} />
        </div>
      </main>
    </>
  );

  return (
    <>
      {/* SIDEBAR JUZ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black ">Daftar <span className="text-primary-2">Juz</span></h2>
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
      {/* Bottom nav mobile */}
      <Navbar hideSidebar />
      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* HEADER AREA */}
        <div className="sticky top-0 z-20 px-4 md:px-6 py-4 border-b border-white/5">
          <header className="max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/juz" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition"><ArrowLeft size={20} /></Link>
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold">
                  <Layers size={16} className="text-primary-2" /> Pilih Juz
                </button>
              </div>
              <div className="text-right">
                <h1 className="md:text-3xl font-black ">Juz <span className="text-primary-2">{juzId}</span></h1>
              </div>
            </div>
          </header>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 pb-24 lg:pb-8">
          <div className="max-w-5xl mx-auto pb-8">
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
              {juzData.verses?.[0] && juzData.verses[0].surahNum !== 1 && juzData.verses[0].surahNum !== 9 && (
                <div className="flex flex-col items-center group/basmalah py-10">
                  <div className="text-4xl font-ayat opacity-80 leading-loose text-white/90 mb-4">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
                  <button
                    onClick={playBasmalah}
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary-2/10 hover:bg-primary-2/20 border border-primary-2/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-2 transition-all active:scale-95"
                  >
                    <Play size={12} fill="currentColor" /> Putar Basmalah
                  </button>
                </div>
              )}

              {juzData.verses.map((item: JuzVerse, index: number) => {
                const isLastRead = lastReadData?.surahNo === item.surahNum && lastReadData?.ayatNo === item.nomorAyat;
                const isCurrentlySaving = savingId === item.nomorAyat;
                const showSaving = isCurrentlySaving && !isLastRead;
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
                          <p className="font-bold italic tracking-wide">{item.teksLatin}</p>
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
                              <ExternalLink size={14} /> <span className="hidden md:flex">Share</span>
                            </button>

                            <button
                              onClick={() => saveLastRead(item.surahNum, item.nomorAyat, item.surahName)}
                              disabled={showSaving}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${showSaving
                                ? "bg-amber-500 text-white animate-pulse"
                                : isLastRead
                                  ? "bg-primary text-white scale-95"
                                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-primary"
                                }`}
                            >
                              {showSaving ? (
                                <>
                                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                                  <span className="hidden md:flex">Menyimpan...</span>
                                </>
                              ) : isLastRead ? (
                                <>
                                  <BookmarkCheck size={14} fill="currentColor" />
                                  <span className="hidden md:flex">Terakhir Dibaca</span>
                                </>
                              ) : (
                                <>
                                  <BookmarkCheck size={14} />
                                  <span className="hidden md:flex">Tandai Terakhir Dibaca</span>
                                </>
                              )}
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
          <Footer />
        </div>

         <audio ref={audioRef} onEnded={handleNextAyat} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />

        {/* FLOATING PLAYER */}
        {currentAyatIndex !== null && (
          <div className="fixed bottom-4 left-4 right-4 lg:left-80 lg:right-8 z-30 pointer-events-none">
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-3xl border border-white/20 rounded-4xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 pointer-events-auto mb-20 lg:mb-0">
              {/* Progress Bar */}
              <div className="h-1 bg-white/10 cursor-pointer group" onClick={(e) => {
                if (!audioRef.current || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audioRef.current.currentTime = percent * duration;
              }}>
                <div className="h-full bg-gradient-to-r from-primary to-primary-2 transition-all group-hover:h-1.5" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
              </div>
              
              <div className="p-4 flex items-center gap-4">
                <img src={LIST_QARI.find(q => q.id === selectedQari)?.img} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" alt="Qari" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-primary-2 font-black uppercase ">Ayat {juzData.verses[currentAyatIndex].nomorAyat}</p>
                  <p className="text-sm font-bold truncate">{juzData.verses[currentAyatIndex].surahName}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</p>
                </div>
                <button onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause()} className="w-12 h-12 bg-white text-bg-primary rounded-full flex items-center justify-center transition shadow-lg shrink-0">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-bg-primary border border-white/20 backdrop-blur-2xl rounded-3xl p-6 max-w-sm w-full shadow-2xl">
              <div className="text-center">
                <h3 className="text-xl font-black text-white mb-2">Login Diperlukan</h3>
                <p className="text-gray-300 text-sm mb-6">
                  Silakan login untuk menyimpan progres bacaan Anda.
                </p>
                <button
                  onClick={() => signInWithPopup(auth, googleProvider).then(() => setShowLoginModal(false))}
                  className="w-full bg-white text-bg-primary hover:bg-gray-100 font-black py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Login dengan Google
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="mt-4 text-gray-400 hover:text-white text-sm font-medium transition"
                >
                  Nanti saja
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
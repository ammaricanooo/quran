"use client";

import { useState, useRef, useEffect, use as useHook } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Play, Pause, ExternalLink, BookOpen, ChevronUp, ArrowLeft, List, Search, BookmarkCheck, X } from 'lucide-react';
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

let cachedBasmalahAudio: { [qariId: string]: string } | null = null;

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrapping params dengan benar untuk Client Component
  const resolvedParams = useHook(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<any>(null);
  const [currentAyatIndex, setCurrentAyatIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQari, setSelectedQari] = useState("05");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [tafsirData, setTafsirData] = useState<any[]>([]);
  const [openTafsirIndex, setOpenTafsirIndex] = useState<number | null>(null);

  const [surahList, setSurahList] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk mobile drawer

  const [searchQuery, setSearchQuery] = useState("");

  const [basmalahAudio, setBasmalahAudio] = useState<{ [key: string]: string } | null>(null);

  const [savingId, setSavingId] = useState<number | null>(null);
  const [lastReadData, setLastReadData] = useState<any>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const fromLastRead = searchParams.get("fromLastRead");
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Ambil data terakhir dibaca secara real-time
        const userDoc = doc(db, "users", currentUser.uid);
        const unsubDoc = onSnapshot(userDoc, (docSnap) => {
          if (docSnap.exists()) {
            setLastReadData(docSnap.data().lastRead);
          }
        });
        return () => unsubDoc();
      }
    });
    return () => unsubscribe();
  }, []);

  const saveLastRead = async (ayatNo: number) => {
    if (!auth.currentUser || !data) {
      setShowLoginModal(true);
      return;
    }

    const isAlreadyLastRead = lastReadData?.surahNo === data.nomor && lastReadData?.ayatNo === ayatNo;
    if (isAlreadyLastRead) {
      // nothing to do, already last read
      return;
    }

    // set loading indicator
    setSavingId(ayatNo);

    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        lastRead: {
          surahNo: data.nomor,
          surahName: data.namaLatin,
          ayatNo: ayatNo,
          updatedAt: new Date()
        }
      }, { merge: true });

      // update local state once backend confirmed
      setLastReadData({
        surahNo: data.nomor,
        surahName: data.namaLatin,
        ayatNo: ayatNo,
        updatedAt: new Date()
      });

      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err) {
      console.error("Gagal simpan:", err);
    } finally {
      // always clear loading flag; even if setLastReadData hasn't run or failed
      setSavingId(null);
    }
  };

  // fallback: if the saving state somehow gets stuck we clear it after a few seconds
  useEffect(() => {
    if (savingId !== null) {
      const t = setTimeout(() => setSavingId(null), 8000);
      return () => clearTimeout(t);
    }
  }, [savingId]);

  const isAyatInViewport = (index: number): boolean => {
    const element = ayatRefs.current[index];
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    return rect.top <= viewportHeight * 2 && rect.bottom >= viewportHeight * -2;
  };

  useEffect(() => {
    // Jika suratnya bukan Al-Fatihah (1) dan bukan At-Taubah (9), kita siapkan Basmalah
    if (id !== "1" && id !== "9") {
      if (cachedBasmalahAudio) {
        setBasmalahAudio(cachedBasmalahAudio);
      } else {
        // Ambil dari ayat 1 surat 1 (Al-Fatihah)
        fetch("https://equran.id/api/v2/surat/1")
          .then(res => res.json())
          .then(json => {
            const audioData = json.data.ayat[0].audio;
            cachedBasmalahAudio = audioData; // Simpan di variable luar (cache)
            setBasmalahAudio(audioData);
          });
      }
    }
  }, [id]);

  useEffect(() => {
    // only perform autoscroll when the page was opened via the "last read" link
    if (
      fromLastRead &&
      data &&
      lastReadData &&
      lastReadData.surahNo === data.nomor
    ) {
      const timer = setTimeout(() => {
        const targetAyat = lastReadData.ayatNo - 1;
        // Only scroll if the target ayat is in the current viewport area
        if (isAyatInViewport(targetAyat)) {
          ayatRefs.current[targetAyat]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        // clear the query parameter so future navigations don't auto‑scroll again
        const params = new URLSearchParams(searchParams.toString());
        params.delete("fromLastRead");
        router.replace(`/surah/${id}${params.toString() ? "?" + params.toString() : ""}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fromLastRead, data, lastReadData, searchParams]);

  // Fungsi khusus untuk putar Basmalah
  const playBasmalah = () => {
    if (!basmalahAudio || !audioRef.current) return;

    setCurrentAyatIndex(null);

    // Set audio ke basmalah sesuai qari yang dipilih
    audioRef.current.src = basmalahAudio[selectedQari];
    audioRef.current.load();
    audioRef.current.play();

    // Opsional: Setelah Basmalah selesai, otomatis lanjut ke ayat 1
    const handleBasmalahEnd = () => {
      playAudio(0); // Putar ayat 1
      audioRef.current?.removeEventListener('ended', handleBasmalahEnd);
    };
    audioRef.current.addEventListener('ended', handleBasmalahEnd);
  };

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
        ayatRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
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

  if (!data) return (
    <>
      {/* Sidebar skeleton — sama persis dimensi dengan sidebar asli */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white hidden lg:flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 w-36 bg-white/8 rounded-xl animate-pulse" />
        </div>
        <div className="h-11 bg-white/5 rounded-3xl animate-pulse mb-4" />
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
              <div className="h-8 w-24 bg-white/8 rounded-xl animate-pulse" />
            </div>
            <div className="h-8 w-28 bg-white/8 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 pb-24 lg:pb-8">
          <SkeletonAyatList count={5} />
        </div>
      </main>
    </>
  );

  const filteredSurah = surahList.filter((s) =>
    s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nomor.toString().includes(searchQuery)
  );

  return (
    <>
      {/* Sidebar Daftar Surah — desktop always visible, mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black ">Daftar <span className="text-primary-2">Surah</span></h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/5 rounded-xl"><ChevronUp className="-rotate-90" size={18} /></button>
          </div>
          <div className="relative group mb-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Cari Surah..."
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
      {/* Bottom nav mobile */}
      <Navbar hideSidebar />
      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* STICKY HEADER AREA */}
        <div className="sticky top-0 z-20 px-4 md:px-6 py-4 transition-all duration-300">
          <header className="max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition">
                  <ArrowLeft size={20} />
                </Link>
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-2 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold">
                  <List size={20} className="text-primary-2" />
                  <span className="hidden md:flex">Daftar Surah</span>
                </button>
                <div className="">
                  <h1 className="md:text-3xl font-black  leading-none">
                    Surah<span className="text-primary-2"> {data.namaLatin}</span>
                  </h1>
                </div>
              </div>

              {/* INPUT LONCAT AYAT */}
              <div className="flex items-center bg-white/5 rounded-xl border border-white/5 px-3 py-1.5">
                <span className="text-[10px] font-black text-gray-500 uppercase mr-2">Ke Ayat</span>
                <input
                  type="number"
                  min="1"
                  max={data.jumlahAyat}
                  placeholder="..."
                  className="w-6 bg-transparent text-sm font-bold focus:outline-none text-primary-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt((e.target as HTMLInputElement).value);
                      if (val > 0 && val <= data.jumlahAyat) {
                        ayatRefs.current[val - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }
                  }}
                />
              </div>
            </div>
          </header>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 pb-24 lg:pb-8">
          <div className="max-w-5xl mx-auto">
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
                <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-ayat select-none">{data.nama}
                </div>
              </div>
            </div>

            {/* Qari Selection */}
            <div className="mb-10 overflow-hidden">
              <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">Pilih Murottal</h3>
              <div className="flex gap-4 overflow-x-auto custom-scroll pb-4">
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
                <div className="flex flex-col items-center group/basmalah py-10">
                  <div className="text-4xl font-ayat opacity-80 leading-loose text-white/90 mb-4">
                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </div>
                  <button
                    onClick={playBasmalah}
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary-2/10 hover:bg-primary-2/20 border border-primary-2/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-2 transition-all active:scale-95"
                  >
                    <Play size={12} fill="currentColor" /> Putar Basmalah
                  </button>
                </div>
              )}

              {data.ayat.map((item: any, index: number) => {
                const currentTafsir = tafsirData.find((t) => t.ayat === item.nomorAyat);
                const isLastRead = lastReadData?.surahNo === data.nomor && lastReadData?.ayatNo === item.nomorAyat;
                const isCurrentlySaving = savingId === item.nomorAyat;
                const showSaving = isCurrentlySaving && !isLastRead;

                return (
                  <div
                    key={item.nomorAyat}
                    ref={(el) => { ayatRefs.current[index] = el }}
                    className={`group p-6 rounded-4xl transition-all duration-500 border ${currentAyatIndex === index ? "bg-white/15 border-white/30 shadow-2xl" : "bg-white/5 border-transparent"
                      }`}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
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
                          <span className="hidden md:flex">Share</span>
                        </button>

                        <button
                          onClick={() => saveLastRead(item.nomorAyat)}
                          disabled={showSaving}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${showSaving
                            ? "bg-primary text-white animate-pulse"
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
                    </div>
                  </div>
                );
              })}
              <Footer />
            </div>
          </div>
        </div>

        {/* Audio Element Hidden */}
         <audio
           ref={audioRef}
           onEnded={handleNextAyat}
           onPlay={() => setIsPlaying(true)}
           onPause={() => setIsPlaying(false)}
           onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
           onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
         />

        {/* Floating Player */}
         {/* Floating Player - Penempatan Responsif */}
         {currentAyatIndex !== null && (
           <div className="fixed bottom-4 left-4 right-4 lg:left-80 lg:right-8 z-30 transition-all pointer-events-none">
             <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-3xl border border-white/20 rounded-4xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 pointer-events-auto mb-20 lg:mb-0">
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
                   <p className="text-[10px] text-primary-2 font-black uppercase">Ayat {data.ayat[currentAyatIndex].nomorAyat}</p>
                   <p className="text-sm font-bold truncate">{data.namaLatin}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</p>
                 </div>
                 <button
                   onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause()}
                   className="w-12 h-12 bg-white text-bg-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shrink-0"
                 >
                   {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                 </button>
                 <button
                   onClick={() => {
                     audioRef.current?.pause();
                     setCurrentAyatIndex(null);
                   }}
                   className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shrink-0"
                 >
                   <X size={20} />
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
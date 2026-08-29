"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Search, LogIn, LogOut, Bookmark, BookOpen, X, HelpCircle, ChevronDown } from "lucide-react";
import { Surah } from "./page";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface LastRead {
    surahNo: number;
    surahName: string;
    ayatNo: number;
}

export default function HomeClient({ surahs }: { surahs: Surah[] }) {
    const [user, setUser] = useState<User | null>(null);
    const [lastRead, setLastRead] = useState<LastRead | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Semua");
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
                    if (snap.exists()) setLastRead(snap.data().lastRead);
                });
            }
        });
        return () => unsubscribe();
    }, []);

    // Close suggestions on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleLogin = () => signInWithPopup(auth, googleProvider);
    const handleLogout = () => auth.signOut();

    const filters = ["Semua", "Mekah", "Madinah"];

    const filteredSurahs = surahs.filter((s) => {
        const matchSearch = s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = activeFilter === "Semua" || s.tempatTurun === activeFilter;
        return matchSearch && matchFilter;
    });

    // Top 5 suggestions (only when actively typing)
    const suggestions = searchQuery.trim().length > 0
        ? surahs
            .filter(s =>
                s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(s.nomor).includes(searchQuery)
            )
            .slice(0, 5)
        : [];

    return (
        <>
            <Navbar />
            {/* lg:ml-72 menggeser konten ke kanan saat sidebar desktop muncul */}
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* ── HEADER ── */}
                        <header className="pt-2 pb-4">
                    <div className="flex justify-between items-start mb-8 gap-8">
                        <div>
                            <p className="text-gray-300 font-bold flex flex-wrap items-center gap-1 text-xs md:text-base">
                                Assalamu&apos;alaikum,
                                {user && (
                                    <Link href="/profil" className="hover:underline cursor-pointer">
                                        Yaa {user.displayName?.split(" ")[0]}
                                    </Link>
                                )}
                                {user ? (
                                    <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-500">
                                        <LogOut size={14} />
                                    </button>
                                ) : (
                                    <button onClick={handleLogin} className="flex items-center gap-1 text-xs">
                                        Yaa <span className="flex gap-1 items-center text-green-400 hover:text-green-500">Login <LogIn size={14} /></span>
                                    </button>
                                )}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-2">Al-Qur&apos;an Ku</h1>
                            <p className="text-xs text-white/30 max-w-sm">Bercerminlah pada setiap ayat Al Quran yang kita baca, karena di dalamnya terdapat petunjuk hidup yang sempurna.</p>
                        </div>
                        <div className="opacity-80 p-3 bg-white/5 rounded-2xl shrink-0 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                            <Image src="/ic_kaligrafi.svg" alt="Kaligrafi" width={128} height={128} className="w-28 md:w-32" priority />
                        </div>
                    </div>

                    {/* ── LAST READ ── */}
                    <div className="relative overflow-hidden bg-white/5 p-6 rounded-4xl shadow-2xl group cursor-pointer border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <Bookmark size={18} fill="white" />
                                <span className="text-xs font-black uppercase tracking-widest">Terakhir Dibaca</span>
                            </div>
                            {!user ? (
                                <button onClick={handleLogin} className="text-left">
                                    <h3 className="text-xl font-bold mb-1">Silakan Login</h3>
                                    <p className="text-xs opacity-70">Login untuk simpan progres bacaanmu</p>
                                </button>
                            ) : lastRead ? (
                                <Link href={`/surah/${lastRead.surahNo}?fromLastRead=1`} className="text-left">
                                    <h3 className="text-2xl font-bold mb-1">{lastRead.surahName}</h3>
                                    <p className="text-sm opacity-90 italic">Ayat ke-{lastRead.ayatNo}</p>
                                </Link>
                            ) : (
                                <p className="text-sm">Belum ada progres bacaan.</p>
                            )}
                        </div>
                        <BookOpen size={120} className="absolute -right-6 -bottom-6 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                </header>

                {/* ── SURAH LIST SECTION ── */}
                <div className="pt-2 pb-4 space-y-6 w-full">
                    {/* Search Bar with Suggestions */}
                    <div className="relative" ref={searchRef}>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors z-10" size={18} />
                            <input
                                type="text"
                                placeholder="Cari Surah..."
                                className="w-full bg-white/5 border border-white/5 rounded-3xl py-3.5 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        {/* Suggestion Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-bg-primary-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                                {suggestions.map((s) => (
                                    <Link
                                        key={s.nomor}
                                        href={`/surah/${s.nomor}`}
                                        onClick={() => { setSearchQuery(s.namaLatin); setShowSuggestions(false); }}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 bg-linear-to-t ${s.tempatTurun === "Mekah" ? "from-primary to-primary-2" : "from-secondarys to-secondarys-2"}`}>
                                            {s.nomor}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{s.namaLatin}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.arti}</p>
                                        </div>
                                        <span className="text-[9px] font-black text-primary-2 uppercase shrink-0">{s.jumlahAyat} Ayat</span>
                                    </Link>
                                ))}
                                {filteredSurahs.length > 5 && (
                                    <div className="px-4 py-2 text-[10px] text-gray-500 font-bold text-center uppercase tracking-widest">
                                        {filteredSurahs.length} hasil ditemukan
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Judul & Filter */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative">
                            <h2 className="text-2xl font-black text-white">Daftar Surah</h2>
                            <div className="absolute -bottom-1 left-0 w-8 h-1 bg-primary-2 rounded-full" />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                            {filters.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`flex-1 rounded-3xl px-4 py-2 text-[11px] font-black uppercase tracking-wider transition ${
                                        activeFilter === f
                                            ? "bg-white text-bg-primary shadow-md"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── GRID SURAH ── */}
                <div className="pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSurahs.map((surah) => (
                        <Link
                            key={surah.nomor}
                            href={`/surah/${surah.nomor}`}
                            className="group flex justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-4xl items-center transition-all duration-300 shadow-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-t shadow-lg ${
                                    surah.tempatTurun === "Mekah" ? "from-primary to-primary-2" : "from-secondarys to-secondarys-2"
                                }`}>
                                    <span className="text-xs font-black">{surah.nomor}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold">{surah.namaLatin}</span>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{surah.arti}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <i
                                    className={`font-surah-icon icon-${surah.nomor} text-4xl text-white/30 group-hover:text-white transition-all duration-500`}
                                    data-icon={String.fromCharCode(0xE800 + surah.nomor)}
                                />
                                <span className="text-[9px] text-primary-2 font-black uppercase">
                                    {surah.jumlahAyat} Ayat
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── FAQ & SEO CONTENT SECTION ── */}
                <section className="pt-8 pb-4 space-y-6">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="text-primary-2" size={22} />
                        <h2 className="text-xl md:text-2xl font-black text-white">Pertanyaan Umum (FAQ)</h2>
                    </div>

                    <div className="space-y-3">
                        <details className="group bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-200 open:bg-white/10">
                            <summary className="font-bold text-sm md:text-base text-white cursor-pointer flex justify-between items-center list-none select-none">
                                <span>Apa itu Al-Qur&apos;an Ku dan siapa pengembangnya?</span>
                                <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0" size={18} />
                            </summary>
                            <p className="mt-3 text-xs md:text-sm text-gray-300 leading-relaxed text-justify">
                                <strong>Al-Qur&apos;an Ku</strong> adalah aplikasi web Al-Qur&apos;an digital inovatif yang dikembangkan oleh <strong>Ammar Abdul Malik</strong> (Ammaricano). Aplikasi ini dirancang untuk memudahkan masyarakat muslim membaca, mentadabburi, dan menghafal Al-Qur&apos;an secara online dengan fitur terlengkap di Indonesia.
                            </p>
                        </details>

                        <details className="group bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-200 open:bg-white/10">
                            <summary className="font-bold text-sm md:text-base text-white cursor-pointer flex justify-between items-center list-none select-none">
                                <span>Fitur apa saja yang tersedia di Al-Qur&apos;an Ku?</span>
                                <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0" size={18} />
                            </summary>
                            <p className="mt-3 text-xs md:text-sm text-gray-300 leading-relaxed text-justify">
                                Al-Qur&apos;an Ku menyediakan bacaan 114 Surah, 30 Juz lengkap dengan teks Arab standar Kemenag, transliterasi Latin, terjemahan Indonesia, audio murottal berbagai qari, jadwal sholat otomatis GPS, kumpulan hadits shahih 9 imam, doa harian, dzikir pagi petang, Asmaul Husna, tahlil, maulid nabi, dan kuis cerdas cermat Qur&apos;an interaktif.
                            </p>
                        </details>

                        <details className="group bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-200 open:bg-white/10">
                            <summary className="font-bold text-sm md:text-base text-white cursor-pointer flex justify-between items-center list-none select-none">
                                <span>Apakah aplikasi Al-Qur&apos;an Ku gratis digunakan?</span>
                                <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0" size={18} />
                            </summary>
                            <p className="mt-3 text-xs md:text-sm text-gray-300 leading-relaxed text-justify">
                                Ya, 100% gratis tanpa biaya berlangganan dan dapat diakses dari browser maupun diinstal sebagai Progressive Web App (PWA) di perangkat Android, iOS, Windows, atau Mac.
                            </p>
                        </details>
                    </div>
                </section>

                        {/* Empty State */}
                        {filteredSurahs.length === 0 && (
                            <div className="text-center py-20 opacity-40">
                                <Search size={48} className="mx-auto mb-4" />
                                <p className="font-bold">Surah &quot;{searchQuery}&quot; tidak ditemukan</p>
                            </div>
                        )}

                        <div className="mb-8" />
                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}

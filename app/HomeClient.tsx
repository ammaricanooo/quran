"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Search, LogIn, LogOut, Bookmark, BookOpen } from "lucide-react";
import { Surah } from "./page";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeClient({ surahs }: { surahs: Surah[] }) {
    const [user, setUser] = useState<User | null>(null);
    const [lastRead, setLastRead] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("Semua");

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

    const handleLogin = () => signInWithPopup(auth, googleProvider);
    const handleLogout = () => auth.signOut();

    const filters = ["Semua", "Mekah", "Madinah"];
    const activeIndex = filters.indexOf(activeFilter);

    const filteredSurahs = surahs.filter((s) => {
        const matchSearch = s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = activeFilter === "Semua" || s.tempatTurun === activeFilter;
        return matchSearch && matchFilter;
    });

    return (
        <>
            <Navbar />
            {/* lg:ml-72 menggeser konten ke kanan saat sidebar desktop muncul */}
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
            {/* pb-24 untuk memberi ruang di atas bottom nav mobile */}
            <div className="px-4 md:px-8 overflow-auto flex-1 scrollbar-hide pb-24 lg:pb-0">

                {/* ── HEADER ── */}
                <header className="py-8">
                    <div className="flex justify-between items-start mb-8 gap-8">
                        <div>
                            <p className="text-gray-300 font-medium flex items-center gap-2 text-xs md:text-base">
                                Assalamu'alaikum, Yaa
                                {user && (
                                    <span className="hover:underline cursor-pointer">
                                        {user.displayName?.split(" ")[0]}
                                    </span>
                                )}
                                {user ? (
                                    <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-500">
                                        <LogOut size={14} />
                                    </button>
                                ) : (
                                    <button onClick={handleLogin} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-500">
                                        Login <LogIn size={14} />
                                    </button>
                                )}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-2">Al-Qur'an Ku</h1>
                            <p className="text-xs text-white/30 max-w-sm">Bercerminlah pada setiap ayat Al Quran yang kita baca, karena di dalamnya terdapat petunjuk hidup yang sempurna.</p>
                        </div>
                        <div className="opacity-80 p-2 bg-white/5 rounded-2xl shrink-0">
                            <img src="ic_kaligrafi.svg" alt="Kaligrafi" className="w-28 md:w-32" />
                        </div>
                    </div>

                    {/* ── LAST READ ── */}
                    <div className="relative overflow-hidden bg-white/5 p-6 rounded-4xl shadow-2xl group cursor-pointer border border-white/5">
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
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Cari Surah (contoh: Al-Fatihah atau Kahfi)..."
                            className="w-full bg-white/5 border border-white/5 rounded-3xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Judul & Filter */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative">
                            <h2 className="text-2xl font-black text-white">Daftar Surah</h2>
                            <div className="absolute -bottom-1 left-0 w-8 h-1 bg-primary-2 rounded-full" />
                        </div>

                        {/* Filter Slider */}
                        <div className="flex overflow-x-auto pb-1 scrollbar-hide">
                            <div className="relative flex bg-white/5 p-1 rounded-2xl border border-white/5 min-w-[280px]">
                                <div
                                    className="absolute top-1 bottom-1 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white rounded-xl shadow-md"
                                    style={{
                                        width: `${100 / filters.length}%`,
                                        left: 0,
                                        transform: `translateX(${activeIndex * 100}%) scale(0.92)`,
                                    }}
                                />
                                {filters.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`relative z-10 flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider transition-colors duration-300 ${
                                            activeFilter === f ? "text-bg-primary" : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── GRID SURAH ── */}
                <div className="pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSurahs.map((surah) => (
                        <Link
                            key={surah.nomor}
                            href={`/surah/${surah.nomor}`}
                            className="group flex justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-4xl items-center transition-all duration-300 hover:scale-[1.02] shadow-xl"
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

                {/* Empty State */}
                {filteredSurahs.length === 0 && (
                    <div className="text-center py-20 opacity-40 animate-pulse">
                        <Search size={48} className="mx-auto mb-4" />
                        <p className="font-medium">Surah "{searchQuery}" tidak ditemukan</p>
                    </div>
                )}

                <Footer />
            </div>
            </main>
        </>
    );
}

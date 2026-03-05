"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Search, Compass, Clock, BookOpen, Layers, Wind, Quote, LogIn, LogOut, Bookmark, User as UserIcon } from "lucide-react";
import { Surah } from "./page";
import Footer from "@/components/Footer";

export default function HomeClient({ surahs }: { surahs: Surah[] }) {
    const [user, setUser] = useState<User | null>(null);
    const [lastRead, setLastRead] = useState<any>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("Semua");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    if (doc.exists()) setLastRead(doc.data().lastRead);
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = () => signInWithPopup(auth, googleProvider);
    const handleLogout = () => auth.signOut();

    const menuItems = [
        { name: "Doa", icon: <BookOpen size={20} />, color: "bg-blue-500", href: "/doa" },
        { name: "Kiblat", icon: <Compass size={20} />, color: "bg-orange-500", href: "https://qiblafinder.withgoogle.com/" },
        { name: "Jadwal", icon: <Clock size={20} />, color: "bg-emerald-500", href: "/jadwal" },
        { name: "Juz", icon: <Layers size={20} />, color: "bg-purple-500", href: "/juz" },
        { name: "Dzikir", icon: <Wind size={20} />, color: "bg-teal-500", href: "/dzikir" },
        { name: "Hadits", icon: <Quote size={20} />, color: "bg-amber-500", href: "/hadits" },
    ];

    const filters = ["Semua", "Mekah", "Madinah"];

    const filteredSurahs = surahs.filter((s) => {
        const matchSearch = s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = activeFilter === "Semua" || s.tempatTurun === activeFilter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="overflow-auto flex-1 scrollbar-hide">
            {/* Header Section */}
            <header className="p-4 md:px-8 md:py-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-gray-300 font-medium flex items-center gap-2">
                            Assalamu’alaikum,
                            {user && (
                                <span className="hover:underline cursor-pointer">
                                    {user ? user.displayName?.split(' ')[0] : ""}
                                </span>
                            )}
                            {/* login/logout kecil */}
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-red-400 hover:text-red-500"
                                >
                                    <LogOut size={14} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="flex  items-center gap-1 text-xs text-green-400 hover:text-green-500"
                                >
                                    Login
                                    <LogIn size={14} />
                                </button>
                            )}
                        </p>
                        <h1 className="text-4xl font-bold mt-1 tracking-tight">
                            Al-Qur'an Ku
                        </h1>
                    </div>
                    <div className="opacity-80 p-2 bg-white/5 rounded-2xl shrink-0">
                        <img src="ic_kaligrafi.svg" alt="Kaligrafi" className="w-16 shrink-0" />
                    </div>
                </div>

                {/* Quick Menu */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-4xl border border-white/5 hover:bg-white/10 transition group text-center"
                        >
                            <div className={`${item.color} p-3 rounded-2xl shadow-lg group-hover:scale-110 transition`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* LAST READ SECTION */}
                <div className="relative overflow-hidden bg-white/5 p-6 rounded-4xl shadow-2xl group cursor-pointer">
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

            <div className="px-4 md:px-8 pb-4 space-y-6 max-w-7xl mx-auto w-full">
                {/* Search Bar - Dibuat sedikit lebih lebar/fokus */}
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Cari Surah (contoh: Al-Fatihah atau Kahfi)..."
                        className="w-full bg-white/5 border border-white/5 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Header Section: Judul & Filter Slider */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative">
                        <h2 className="text-2xl font-black text-white tracking-tight">Daftar Surah</h2>
                        <div className="absolute -bottom-1 left-0 w-8 h-1 bg-primary-2 rounded-full" /> {/* Aksen garis bawah */}
                    </div>

                    {/* Filter Slider - Scrollable di mobile, rapi di desktop */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <div className="flex gap-2 justify-between sm:justify-start bg-white/5 p-1.5 rounded-2xl border border-white/5 w-full sm:w-fit">
                            {filters.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-5 py-2 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 ${activeFilter === f
                                        ? "bg-white text-bg-primary shadow-lg shadow-white/10 scale-100"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Surah */}
            <div className="px-4 md:px-8 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                    <Link
                        key={surah.nomor}
                        href={`/surah/${surah.nomor}`}
                        className="group flex justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-4xl items-center transition-all duration-300 hover:scale-[1.02] shadow-xl"
                    >
                        <div className="flex items-center gap-4">
                            {/* Number Badge */}
                            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-t shadow-lg ${surah.tempatTurun === "Mekah" ? 'from-primary to-primary-2' : 'from-secondarys to-secondarys-2'
                                }`}>
                                <span className="text-xs font-black">{surah.nomor}</span>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col">
                                <span className="text-lg font-bold group-hover:text-primary-2 transition-colors">
                                    {surah.namaLatin}
                                </span>
                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                    {surah.arti}
                                </span>
                            </div>
                        </div>

                        {/* Icon Surah (INI SUDAH SAYA KEMBALIKAN) */}
                        <div className="flex flex-col items-end gap-1">
                            <i
                                className={`font-surah-icon icon-${surah.nomor} text-4xl text-white/30 group-hover:text-white transition-all duration-500`}
                                data-icon={String.fromCharCode(0xE800 + surah.nomor)}
                            ></i>
                            <span className="text-[9px] text-primary-2 font-black uppercase tracking-tighter">
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
    );
}
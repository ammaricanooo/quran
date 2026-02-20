"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Compass, Clock, BookOpen } from "lucide-react";
import { Surah } from "./page";

export default function HomeClient({ surahs }: { surahs: Surah[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("Semua");

    const menuItems = [
        { name: "Doa", icon: <BookOpen size={20} />, color: "bg-blue-500", href: "/doa" },
        { name: "Kiblat", icon: <Compass size={20} />, color: "bg-orange-500", href: "https://qiblafinder.withgoogle.com/" },
        { name: "Jadwal", icon: <Clock size={20} />, color: "bg-emerald-500", href: "/jadwal" },
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
            <header className="p-6 md:px-10 md:py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-gray-300 font-medium">Assalamu’alaikum</p>
                        <h1 className="text-4xl font-bold mt-1 tracking-tight">Al-Qur'an Ku</h1>
                    </div>
                    <div className="opacity-80 p-2 bg-white/5 rounded-2xl">
                        <img src="ic_kaligrafi.svg" alt="Kaligrafi" className="w-16" />
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
            </header>

            <div className="px-6 pb-4 space-y-6 max-w-7xl mx-auto w-full">
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
                        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
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
            <div className="px-6 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
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
        </div>
    );
}
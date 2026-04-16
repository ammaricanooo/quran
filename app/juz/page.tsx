"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Layers, BookOpen, Compass, Clock, Wind, Quote, ChevronUp } from "lucide-react";
import Footer from "@/components/Footer";

export default function JuzListPage() {
    const [juzList, setJuzList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: "Doa", icon: <BookOpen size={20} />, color: "bg-white/5", href: "/doa" },
        { name: "Kiblat", icon: <Compass size={20} />, color: "bg-white/5", href: "https://qiblafinder.withgoogle.com/" },
        { name: "Jadwal", icon: <Clock size={20} />, color: "bg-white/5", href: "/jadwal" },
        { name: "Juz", icon: <Layers size={20} />, color: "bg-white/5", href: "/juz" },
        { name: "Dzikir", icon: <Wind size={20} />, color: "bg-white/5", href: "/dzikir" },
        { name: "Hadits", icon: <Quote size={20} />, color: "bg-white/5", href: "/hadits" },
    ];

    useEffect(() => {
        fetch("/api/proxy-juz")
            .then((res) => res.json())
            .then((json) => {
                setJuzList(json.data);
                setLoading(false);
            });
    }, []);

    const filteredJuz = juzList.filter((j) =>
        j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.number.toString().includes(searchQuery)
    );

    return (
        <>
            {/* Sidebar Desktop & Overlay Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black ">Menu <span className="text-primary-2">Utama</span></h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/5 rounded-xl"><ChevronUp className="-rotate-90" size={18} /></button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${item.name === "Juz"
                                    ? "bg-primary/10 border-primary/15"
                                    : "bg-white/5 border-transparent hover:bg-white/10"
                                    } group`}
                            >
                                <div className={`${item.color} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition`}>
                                    <div className="text-white">{item.icon}</div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-bold">{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Overlay untuk close sidebar di mobile */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                {/* Header Fixed */}
                <div className="flex-none p-4 md:px-8 border-b border-white/5 z-20">
                    <header className="max-w-5xl mx-auto w-full flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                    <ArrowLeft size={18} />
                                </Link>
                                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold">
                                    <BookOpen size={16} className="text-primary-2" />
                                </button>
                                <h1 className="text-xl md:text-2xl font-black ">
                                    Daftar <span className="text-primary">Juz</span>
                                </h1>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-primary uppercase">
                                30 Juz
                            </div>
                        </div>
                    </header>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
                    {loading ? (
                        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div>
                            <div className="group w-full flex md:justify-end mb-4 mx-auto">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Cari nomor juz..."
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:bg-white/10 transition-all text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                                {filteredJuz.map((juz) => (
                                    <Link
                                        key={juz.number}
                                        href={`/juz/${juz.number}`}
                                        className="group bg-white/5 border border-white/5 p-5 rounded-3xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300 shadow-xl"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                                                {juz.number}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-primary-2 uppercase ">Mulai Dari</p>
                                                <p className="text-xs font-bold">{juz.name_start_id} : {juz.verse_start}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{juz.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mb-4">
                                            {juz.name_start_id} — {juz.name_end_id}
                                        </p>

                                        <div className="p-3 bg-black/20 rounded-2xl border border-white/5 group-hover:bg-black/40 transition-colors">
                                            <p className="text-right font-ayat text-lg opacity-80 truncate" dir="rtl">{juz.ayat_arab}</p>
                                            <p className="text-[10px] text-gray-500 italic line-clamp-1 mt-1">{juz.ayat_indo}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <Footer />
                    {!loading && filteredJuz.length === 0 && (
                        <div className="text-center py-20 opacity-30">
                            <Layers size={48} className="mx-auto mb-4" />
                            <p>Juz tidak ditemukan</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
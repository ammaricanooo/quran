"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Copy, Share2, Quote, Compass, Clock, Layers, Wind, ChevronUp } from "lucide-react";
import Footer from "@/components/Footer";

export default function HaditsPage() {
    const [haditsData, setHaditsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
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
        fetch("/api/proxy-hadits") // Pastikan route proxy sudah ada
            .then((res) => res.json())
            .then((json) => {
                setHaditsData(json.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredHadits = haditsData.filter((h) =>
        h.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.no.toString().includes(searchQuery)
    );

    const handleCopy = (item: any) => {
        const text = `📜 *${item.judul}*\n\n${item.arab}\n\nArtinya: "${item.indo}"\n\n(Hadits No. ${item.no})`;
        navigator.clipboard.writeText(text);
        alert("Hadits disalin ke clipboard!");
    };

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
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${item.name === "Hadits"
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
                {/* Header Area */}
                <div className="flex-none p-4 md:px-8 border-b border-white/5 z-20">
                    <header className="max-w-5xl mx-auto w-full">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold">
                                <BookOpen size={16} className="text-primary-2" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-black ">
                                    Hadits <span className="text-primary">Arbain</span>
                                </h1>
                        </div>
                    </header>
                </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
                <div className="group max-w-5xl flex md:justify-end mb-4 mx-auto">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                            type="text"
                            placeholder="Cari judul hadits atau nomor..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:bg-white/10 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="max-w-5xl mx-auto space-y-6 pb-20">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="h-64 bg-white/5 rounded-4xl animate-pulse" />
                        ))
                    ) : filteredHadits.length > 0 ? (
                        filteredHadits.map((item) => (
                            <div
                                key={item.no}
                                className="group p-6 md:p-8 rounded-4xl bg-white/5 border border-white/5 hover:border-primary-2/30 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Nomor Hadits Badge */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-primary to-primary-2 flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                                            {item.no}
                                        </div>
                                        <h2 className="text-sm md:text-base font-bold text-primary-2 ">{item.judul}</h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleCopy(item)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Arab */}
                                <div className="relative mb-8">
                                    <Quote className="absolute -top-4 -left-2 text-primary-2/10 w-12 h-12 rotate-180" />
                                    <p className="text-2xl md:text-3xl text-right font-ayat leading-loose text-white/90" dir="rtl">
                                        {item.arab}
                                    </p>
                                </div>

                                {/* Terjemahan */}
                                <div className="space-y-3 border-t border-white/5 pt-6">
                                    <p className="text-[10px] font-black text-primary-2 uppercase tracking-[0.2em]">Terjemahan</p>
                                    <p className="text-sm text-gray-400 leading-relaxed text-justify">
                                        {item.indo}
                                    </p>
                                </div>

                                {/* Background Ornament */}
                                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                                    <BookOpen size={120} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 font-bold">Hadits tidak ditemukan.</p>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
            </main>
        </>
    );
}
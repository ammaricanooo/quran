"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Share2, ArrowLeft, BookOpen, Copy, Check, Compass, Clock, Layers, Wind, Quote, ChevronUp } from "lucide-react";
import Footer from "@/components/Footer";

export default function DoaPage() {
    const [doaList, setDoaList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [openTentangId, setOpenTentangId] = useState<number | null>(null);
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
        fetch("https://equran.id/api/doa")
            .then((res) => res.json())
            .then((json) => {
                setDoaList(json.data);
                setLoading(false);
            });
    }, []);

    const handleShare = (doa: any) => {
        const text = `✨ *${doa.nama}*\n\n${doa.ar}\n\n"${doa.idn}"\n\nSumber: Al-Qur'an Ku`;
        if (navigator.share) {
            navigator.share({ title: doa.nama, text });
        } else {
            navigator.clipboard.writeText(text);
            alert("Doa berhasil disalin!");
        }
    };

    const filteredDoa = doaList.filter((d) =>
        d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.grup.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-10 text-white animate-pulse text-center">Memuat Doa...</div>;

    return (
        <>
            {/* Sidebar Desktop & Overlay Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-t from-bg-primary to-bg-primary-2 border-r border-white/5 text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black">Menu <span className="text-primary-2">Utama</span></h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/5 rounded-xl"><ChevronUp className="-rotate-90" size={18} /></button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${item.name === "Doa"
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
                {/* --- FIXED HEADER AREA --- */}
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
                                    Daftar <span className="text-primary">Doa</span>
                                </h1>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-sm font-black text-primary uppercase">
                                {doaList.length} Doa
                            </div>
                        </div>
                    </header>
                </div>

                {/* --- SCROLLABLE CONTENT AREA --- */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
                    <div className="group max-w-5xl flex md:justify-end mb-4 mx-auto">
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="text"
                                placeholder="Cari nama doa..."
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:bg-white/10 transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="max-w-5xl mx-auto space-y-6 pb-20">
                        {filteredDoa.map((doa) => (
                            <div
                                key={doa.id}
                                className="bg-white/5 border border-white/10 rounded-4xl p-6 hover:bg-white/10 transition-all duration-300 shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-primary/20 text-primary-2 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-primary/30">
                                        {doa.grup}
                                    </span>
                                    <button
                                        onClick={() => handleShare(doa)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-primary-2 transition"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold mb-6 text-white/90 leading-tight">{doa.nama}</h3>

                                <p className="text-4xl text-right font-ayat leading-16 mb-6 antialiased" dir="rtl">
                                    {doa.ar}
                                </p>

                                <div className="space-y-4 border-l-2 border-primary/30 pl-4 py-1">
                                    <p className="font-bold italic tracking-wide text-sm">{doa.tr}</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">{doa.idn}</p>
                                </div>

                                {/* --- TOGGLE KETERANGAN (TENTANG) --- */}
                                {doa.tentang && (
                                    <div className="mt-4 pt-2">
                                        {openTentangId === doa.id && (
                                            <div className="mb-4 p-4 bg-black/20 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
                                                <p className="text-xs text-gray-400 leading-relaxed italic whitespace-pre-line">
                                                    {doa.tentang}
                                                </p>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setOpenTentangId(openTentangId === doa.id ? null : doa.id)}
                                            className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${openTentangId === doa.id ? "text-primary-2" : "text-gray-500 hover:text-white"
                                                }`}
                                        >
                                            <BookOpen size={14} />
                                            {openTentangId === doa.id ? "Tutup Keterangan" : "Lihat Keterangan"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredDoa.length === 0 && (
                            <div className="text-center py-20 opacity-40">
                                <BookOpen size={48} className="mx-auto mb-4" />
                                <p className="font-bold ">Doa tidak ditemukan</p>
                            </div>
                        )}
                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}
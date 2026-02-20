"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Share2, ArrowLeft, BookOpen, Copy, Check } from "lucide-react";

export default function DoaPage() {
    const [doaList, setDoaList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [openTentangId, setOpenTentangId] = useState<number | null>(null);

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
        <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden">
            {/* --- FIXED HEADER AREA --- */}
            <div className="flex-none p-6 z-20">
            <header className="max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="bg-white/5 px-4 py-1.5 rounded-2xl border border-white/5 flex items-center gap-3">
                        <p className="text-[10px] font-black text-primary-2 uppercase tracking-widest">Total</p>
                        <p className="text-sm font-mono font-black">{doaList.length} Doa</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <h1 className="text-3xl font-black tracking-tighter leading-none">
                        Kumpulan<span className="text-primary-2"> Doa</span>
                    </h1>
                    
                    {/* Search Bar di Header */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Cari doa..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-2/50 transition text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>
        </div>

            {/* --- SCROLLABLE CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
                <div className="max-w-4xl mx-auto space-y-6 pb-20">
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

                            <p className="text-3xl text-right font-ayat leading-16 mb-6 antialiased" dir="rtl">
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
                            <p className="font-bold tracking-tighter">Doa tidak ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Copy, Share2, Quote } from "lucide-react";

export default function HaditsPage() {
    const [haditsData, setHaditsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
        <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden">
            {/* Header Area */}
            <div className="flex-none p-6 bg-bg-primary/40 backdrop-blur-md border-b border-white/5 z-20">
                <header className="max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-xl font-black tracking-tighter uppercase">
                            Hadits <span className="text-primary-2">Arbain</span>
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari judul hadits atau nomor..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary-2/30 focus:bg-white/10 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6 pb-20">
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
                                        <h2 className="text-sm md:text-base font-bold text-primary-2 tracking-tight">{item.judul}</h2>
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
                                    <p className="text-2xl md:text-3xl text-right font-arabic leading-[2] text-white/90" dir="rtl">
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
            </div>
        </main>
    );
}
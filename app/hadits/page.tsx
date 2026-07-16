"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Copy, Quote } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonCardList } from "@/components/Skeleton";

export default function HaditsPage() {
    const [haditsData, setHaditsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/api/proxy-hadits")
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
            <Navbar />

            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                {/* ── HEADER ── */}
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl md:text-2xl font-black">
                                Hadits <span className="text-primary">Arbain</span>
                            </h1>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-primary uppercase">
                            {haditsData.length} Hadits
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* Search */}
                        <div className="flex md:justify-end">
                            <div className="relative w-full md:w-1/2">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="Cari judul hadits atau nomor..."
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:bg-white/10 transition-all text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Hadits Cards */}
                        {loading ? (
                            <SkeletonCardList count={4} />
                        ) : filteredHadits.length > 0 ? (
                            filteredHadits.map((item) => (
                                <div
                                    key={item.no}
                                    className="group p-6 md:p-8 rounded-4xl bg-white/5 border border-white/5 relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-2 flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                                                {item.no}
                                            </div>
                                            <h2 className="text-sm md:text-base font-bold">{item.judul}</h2>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(item)}
                                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>

                                    <div className="relative mb-6">
                                        <Quote className="absolute -top-4 -left-2 text-primary-2/10 w-12 h-12 rotate-180" />
                                        <p className="text-2xl md:text-3xl text-right font-ayat leading-loose text-white/90" dir="rtl">
                                            {item.arab}
                                        </p>
                                    </div>

                                    <div className="space-y-2 border-t border-white/5 pt-5">
                                        <p className="text-xs text-gray-400 italic leading-relaxed border-l-2 border-primary-2/30 pl-3 text-justify">{item.indo}</p>
                                    </div>

                                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                                        <BookOpen size={120} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 opacity-40">
                                <BookOpen size={48} className="mx-auto mb-4" />
                                <p className="font-bold">Hadits tidak ditemukan</p>
                            </div>
                        )}

                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Share2, Quote } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonCardList } from "@/components/Skeleton";

interface Hadits {
    no: number;
    judul: string;
    arab: string;
    indo: string;
}

export default function HaditsPage() {
    const [haditsData, setHaditsData] = useState<Hadits[]>([]);
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

    const handleShare = (item: Hadits) => {
        const text = `📜 *${item.judul}*\n\n${item.arab}\n\nArtinya: "${item.indo}"\n\n(Hadits Arbain No. ${item.no})\n\nSumber: Al-Qur'an Ku`;
        if (navigator.share) {
            navigator.share({ title: item.judul, text });
        } else {
            navigator.clipboard.writeText(text);
            alert("Hadits berhasil disalin!");
        }
    };

    const filteredHadits = haditsData.filter((h) =>
        h.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.no.toString().includes(searchQuery)
    );

    if (loading) return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/8 rounded-xl animate-pulse" />
                            <div className="h-6 w-40 bg-white/8 rounded-xl animate-pulse" />
                        </div>
                        <div className="h-6 w-16 bg-white/8 rounded-lg animate-pulse" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto">
                        <SkeletonCardList count={4} />
                    </div>
                </div>
            </main>
        </>
    );

    return (
        <>
            <Navbar />

            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                {/* ── HEADER ── */}
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
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

                        {/* Search — hanya tampil setelah data loaded */}
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
                        {filteredHadits.length > 0 ? (
                            filteredHadits.map((item) => (
                                <div
                                    key={item.no}
                                    className="group p-6 md:p-8 rounded-4xl bg-white/5 border border-white/5 relative overflow-hidden"
                                >
                                    {/* Badge nomor + judul */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-2 flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20 shrink-0">
                                            {item.no}
                                        </div>
                                        <h2 className="text-sm md:text-base font-bold text-primary-2 flex-1">{item.judul}</h2>
                                    </div>

                                    {/* Teks Arab */}
                                    <div className="relative mb-6">
                                        <Quote className="absolute -top-4 -left-2 text-primary-2/10 w-12 h-12 rotate-180" />
                                        <p className="text-2xl md:text-3xl text-right font-ayat leading-loose text-white/90" dir="rtl">
                                            {item.arab}
                                        </p>
                                    </div>

                                    {/* Terjemahan */}
                                    <div className="space-y-2 border-l-2 border-primary/30 pl-4 py-1 mb-6">
                                        <p className="text-[10px] font-black text-primary-2 uppercase tracking-widest mb-1">Terjemahan</p>
                                        <p className="text-sm text-gray-300 leading-relaxed text-justify">{item.indo}</p>
                                    </div>

                                    {/* Action row — konsisten dengan halaman lain */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => handleShare(item)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-primary-2 transition"
                                        >
                                            <Share2 size={14} />
                                            <span className="hidden md:flex">Bagikan</span>
                                        </button>
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

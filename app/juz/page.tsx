"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Layers } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonJuzList } from "@/components/Skeleton";

interface JuzItem {
    number: number;
    name: string;
    name_start_id: string;
    name_end_id: string;
    verse_start: string;
    verse_end: string;
    ayat_arab: string;
    ayat_indo: string;
}

export default function JuzListPage() {
    const [juzList, setJuzList] = useState<JuzItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

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
                                Daftar <span className="text-primary-2">Juz</span>
                            </h1>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-primary-2 uppercase tracking-wider">
                            30 Juz
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    {loading ? (
                        <SkeletonJuzList count={8} />
                    ) : (
                        <div className="max-w-5xl mx-auto">
                            {/* Search */}
                            <div className="relative group w-full mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari nomor atau nama juz..."
                                    className="w-full bg-white/5 border border-white/5 rounded-3xl py-3.5 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                                {filteredJuz.map((juz) => (
                                    <Link
                                        key={juz.number}
                                        href={`/juz/${juz.number}`}
                                        className="group bg-white/5 border border-white/5 p-6 rounded-4xl hover:bg-white/10 hover:border-white/10 transition-all duration-300 shadow-xl flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-2 font-black text-sm border border-primary/20">
                                                {juz.number}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-primary-2 uppercase tracking-wider">Mulai Dari</p>
                                                <p className="text-xs font-bold">{juz.name_start_id} : {juz.verse_start}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary-2 transition-colors">{juz.name}</h3>
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

                            {filteredJuz.length === 0 && (
                                <div className="text-center py-20 opacity-30">
                                    <Layers size={48} className="mx-auto mb-4" />
                                    <p>Juz tidak ditemukan</p>
                                </div>
                            )}

                            <Footer />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

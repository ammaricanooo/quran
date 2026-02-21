"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Layers, BookOpen } from "lucide-react";

export default function JuzListPage() {
    const [juzList, setJuzList] = useState<any[]>([]);
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
        <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden">
            {/* Header Fixed */}
            <div className="flex-none p-4 md:px-8 border-b border-white/5 z-20">
                <header className="mx-auto w-full flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl md:text-2xl font-black tracking-tighter">
                                Daftar <span className="text-purple-400">Juz</span>
                            </h1>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-purple-400 uppercase">
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
                        <div className="group w-full flex md:justify-end mb-4">
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
                                    className="group bg-white/5 border border-white/5 p-5 rounded-3xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-xl"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-sm border border-purple-500/20">
                                            {juz.number}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-primary-2 uppercase tracking-tighter">Mulai Dari</p>
                                            <p className="text-xs font-bold">{juz.name_start_id} : {juz.verse_start}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold mb-1 group-hover:text-purple-400 transition-colors">{juz.name}</h3>
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

                {!loading && filteredJuz.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <Layers size={48} className="mx-auto mb-4" />
                        <p>Juz tidak ditemukan</p>
                    </div>
                )}
            </div>
        </main>
    );
}
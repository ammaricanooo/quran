"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Share2, ChevronLeft, BookOpen, Copy, Check } from "lucide-react";

export default function DoaPage() {
    const [doaList, setDoaList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);

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
            {/* Header */}
            <div className="sticky top-0 z-20 bg-bg-primary/90 backdrop-blur-md p-4 flex items-center gap-4 border-b border-white/10">
                <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-lg font-bold">Kumpulan Doa</h1>
            </div>

            <div className="flex-1 overflow-auto scrollbar-hide p-6">
                {/* Search Bar */}
                <div className="relative mb-8 max-w-4xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari doa (misal: tidur, makan)..."
                        className="w-full bg-white/10 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* List Doa */}
                <div className="max-w-4xl mx-auto space-y-6 pb-20">
                    {filteredDoa.map((doa) => (
                        <div
                            key={doa.id}
                            className="bg-white/5 border border-white/10 rounded-4xl p-6 hover:bg-white/10 transition-all duration-300 shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-4 py-1 bg-primary/20 text-primary-2 text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/30">
                                    {doa.grup}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleShare(doa)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-primary-2 transition"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-6 text-white/90">{doa.nama}</h3>

                            <p className="text-3xl text-right font-ayat leading-16 mb-6 antialiased" dir="rtl">
                                {doa.ar}
                            </p>

                            <div className="space-y-4 border-l-2 border-primary/30 pl-4">
                                <p className="text-primary-2 text-xs font-medium italic leading-relaxed">
                                    {doa.tr}
                                </p>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {doa.idn}
                                </p>
                            </div>

                            {doa.tentang && (
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <p className="text-[10px] text-gray-500 italic leading-relaxed whitespace-pre-line">
                                        {doa.tentang}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredDoa.length === 0 && (
                        <div className="text-center py-20 opacity-40">
                            <BookOpen size={48} className="mx-auto mb-4" />
                            <p>Doa tidak ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
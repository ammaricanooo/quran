"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, CheckCircle2, RotateCcw, Sparkles, Wind, Share2 } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { dzikirData as localDzikirData, DzikirItem } from "@/lib/dzikir/dzikir-data";

export default function DzikirPage() {
    const dzikirData = localDzikirData;
    const [activeTab, setActiveTab] = useState("pagi");
    const [counts, setCounts] = useState<{ [key: string]: number }>({});

    const [customCounter, setCustomCounter] = useState(0);
    const [customMax, setCustomMax] = useState(33);

    const incrementCount = (id: string, maxStr: string) => {
        const max = parseInt(maxStr.replace("x", "")) || 1;
        const current = counts[id] || 0;
        if (current < max) {
            const next = current + 1;
            setCounts({ ...counts, [id]: next });
            if (navigator.vibrate) navigator.vibrate(40);
        }
    };

    const resetCount = (id: string) => {
        setCounts({ ...counts, [id]: 0 });
    };

    const categories = [
        { id: "pagi",  label: "Pagi",  icon: <Sun size={14} /> },
        { id: "sore",  label: "Sore",  icon: <Moon size={14} /> },
        { id: "solat", label: "Solat", icon: <Sparkles size={14} /> },
    ];

    const handleShare = (item: DzikirItem) => {
        const text = `🌙 *Dzikir ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}*\n\n${item.arab}\n\n"${item.indo}"\n\nDibaca: ${item.ulang}\n\nSumber: Al-Qur'an Ku`;
        if (navigator.share) {
            navigator.share({ title: `Dzikir ${activeTab}`, text });
        } else {
            navigator.clipboard.writeText(text);
            alert("Dzikir berhasil disalin!");
        }
    };

    const filteredData = dzikirData.filter((d) => d.type.toLowerCase() === activeTab.toLowerCase());

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
                            <h1 className="text-xl md:text-2xl font-black">Dzikir</h1>
                        </div>

                        {/* Tab Filter */}
                        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                        activeTab === cat.id ? "bg-primary-2 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                    }`}
                                >
                                    {cat.icon}
                                    <span className={`${activeTab === cat.id ? "inline" : "hidden"} sm:inline`}>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-4">

                        {/* Tasbih Digital */}
                        <div className="p-6 rounded-4xl bg-gradient-to-br from-primary/20 to-primary-2/20 border border-primary-2/30">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-2">Tasbih Digital</span>
                                <div className="flex gap-2">
                                    {[33, 100].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => { setCustomMax(val); setCustomCounter(0); }}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition ${
                                                customMax === val ? "bg-primary-2 border-primary-2 text-white" : "border-white/10 text-gray-500 hover:text-white"
                                            }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                    <button onClick={() => setCustomCounter(0)} className="p-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition">
                                        <RotateCcw size={14} />
                                    </button>
                                </div>
                            </div>
                            <div
                                onClick={() => customCounter < customMax && setCustomCounter((prev) => prev + 1)}
                                className="bg-black/40 rounded-3xl py-8 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all border border-white/5 hover:border-primary-2/50"
                            >
                                <span className="text-5xl font-black text-white mb-1">{customCounter}</span>
                                <span className="text-xs font-bold text-primary-2 uppercase">Klik untuk Menghitung</span>
                                <div className="w-full max-w-40 h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-2 transition-all"
                                        style={{ width: `${(customCounter / customMax) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dzikir List */}
                        {filteredData.map((item, index) => {
                            const id = `${activeTab}-${index}`;
                            const current = counts[id] || 0;
                            const max = parseInt(item.ulang.replace("x", "")) || 1;
                            const isDone = current >= max;

                            return (
                                <div
                                    key={id}
                                    onClick={() => incrementCount(id, item.ulang)}
                                    className={`relative group p-6 rounded-4xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                        isDone ? "bg-primary-2/10 border-primary-2/40" : "bg-white/5 border-white/5 hover:bg-white/8"
                                    }`}
                                >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                                                    isDone ? "bg-primary-2 border-primary-2 shadow-lg shadow-primary-2/40" : "bg-white/5 border-white/10"
                                                }`}>
                                                    {isDone ? (
                                                        <CheckCircle2 size={16} />
                                                    ) : (
                                                        <span className="text-[10px] font-black text-primary-2">{current}</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                    Target: {item.ulang}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); resetCount(id); }}
                                                className="p-2 text-gray-600 hover:text-white transition"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        </div>

                                        <p className="text-4xl text-right font-ayat leading-relaxed mb-4 text-white/90" dir="rtl">
                                            {item.arab}
                                        </p>
                                        <p className="text-xs text-gray-400 italic leading-relaxed border-l-2 border-primary-2/30 pl-3">
                                            "{item.indo}"
                                        </p>

                                        {/* Action row */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleShare(item); }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-primary-2 transition"
                                            >
                                                <Share2 size={14} />
                                                <span className="hidden md:flex">Bagikan</span>
                                            </button>
                                        </div>

                                        <div
                                            className="absolute bottom-0 left-0 h-1 bg-primary-2 transition-all duration-300 rounded-b-4xl"
                                            style={{ width: `${(current / max) * 100}%` }}
                                        />
                                    </div>
                                );
                            })}

                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}

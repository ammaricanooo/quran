"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, CheckCircle2, RotateCcw, Sparkles, Plus, Wind, BookOpen, Compass, Clock, Layers, Quote, ChevronUp } from "lucide-react";
import Footer from "@/components/Footer";

export default function DzikirPage() {
    const [dzikirData, setDzikirData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pagi");
    const [counts, setCounts] = useState<{ [key: string]: number }>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State untuk Tasbih Custom
    const [customCounter, setCustomCounter] = useState(0);
    const [customMax, setCustomMax] = useState(33);

    const menuItems = [
        { name: "Doa", icon: <BookOpen size={20} />, color: "bg-white/5", href: "/doa" },
        { name: "Kiblat", icon: <Compass size={20} />, color: "bg-white/5", href: "https://qiblafinder.withgoogle.com/" },
        { name: "Jadwal", icon: <Clock size={20} />, color: "bg-white/5", href: "/jadwal" },
        { name: "Juz", icon: <Layers size={20} />, color: "bg-white/5", href: "/juz" },
        { name: "Dzikir", icon: <Wind size={20} />, color: "bg-white/5", href: "/dzikir" },
        { name: "Hadits", icon: <Quote size={20} />, color: "bg-white/5", href: "/hadits" },
    ];

    useEffect(() => {
        // Menggunakan proxy yang sudah dibuat sebelumnya
        fetch("/api/proxy-dzikir")
            .then((res) => res.json())
            .then((json) => {
                setDzikirData(json.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const incrementCount = (id: string, maxStr: string) => {
        const max = parseInt(maxStr.replace("x", "")) || 1;
        const current = counts[id] || 0;
        if (current < max) {
            setCounts({ ...counts, [id]: current + 1 });
            if (navigator.vibrate) navigator.vibrate(40);
        }
    };

    const resetCount = (id: string) => {
        setCounts({ ...counts, [id]: 0 });
    };

    const categories = [
        { id: "pagi", icon: <Sun size={14} /> },
        { id: "sore", icon: <Moon size={14} /> },
        { id: "solat", icon: <Sparkles size={14} /> }
    ];

    // Perbaikan Logika Filter
    const filteredData = dzikirData.filter(d => d.type.toLowerCase() === activeTab.toLowerCase());

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
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${item.name === "Dzikir"
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
                {/* Simple Header */}
                <div className="flex-none p-4 md:px-8 border-b border-white/5 z-20">
                    <header className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold">
                                <BookOpen size={16} className="text-primary-2" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-black ">
                                Dzikir
                                </h1>
                        </div>
                        {/* Compact Filter */}
                        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase  transition-all ${activeTab === cat.id ? "bg-primary-2 text-white shadow-lg" : "text-gray-500"
                                        }`}
                                >
                                    {cat.icon} <span className="hidden sm:inline">{cat.id}</span>
                                </button>
                            ))}
                        </div>
                    </header>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
                    <div className="max-w-5xl mx-auto ">

                        {/* TASBIH CUSTOM (Dzikir Mandiri) */}
                        <div className="mb-8 p-6 rounded-4xl bg-linear-to-br from-primary/20 to-primary-2/20 border border-primary-2/30">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-2">Tasbih Digital</span>
                                <div className="flex gap-2">
                                    {[33, 100].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => { setCustomMax(val); setCustomCounter(0); }}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition ${customMax === val ? 'bg-primary-2 border-primary-2' : 'border-white/10 text-gray-500'}`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                    <button onClick={() => setCustomCounter(0)} className="p-1.5 bg-white/5 rounded-lg text-gray-400"><RotateCcw size={14} /></button>
                                </div>
                            </div>
                            <div
                                onClick={() => customCounter < customMax && setCustomCounter(prev => prev + 1)}
                                className="bg-black/40 rounded-3xl py-8 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all border border-white/5 hover:border-primary-2/50"
                            >
                                <span className="text-5xl font-black text-white mb-1">{customCounter}</span>
                                <span className="text-xs font-bold text-primary-2 uppercase">Klik untuk Menghitung</span>
                                <div className="w-full max-w-40 h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-2 transition-all" style={{ width: `${(customCounter / customMax) * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pb-6">
                            {loading ? (
                                [...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-4xl animate-pulse" />)
                            ) : (
                                filteredData.map((item, index) => {
                                    const id = `${activeTab}-${index}`;
                                    const current = counts[id] || 0;
                                    const max = parseInt(item.ulang.replace("x", "")) || 1;
                                    const isDone = current >= max;

                                    return (
                                        <div
                                            key={id}
                                            onClick={() => incrementCount(id, item.ulang)}
                                            className={`relative group p-6 rounded-4xl border transition-all duration-300 cursor-pointer overflow-hidden ${isDone ? "bg-primary-2/10 border-primary-2/40" : "bg-white/5 border-white/5"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${isDone ? "bg-primary-2 border-primary-2 shadow-lg shadow-primary-2/40" : "bg-white/5 border-white/10"
                                                        }`}>
                                                        {isDone ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black text-primary-2">{current}</span>}
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target: {item.ulang}</span>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); resetCount(id); }} className="p-2 text-gray-600 hover:text-white"><RotateCcw size={14} /></button>
                                            </div>

                                            <p className="text-4xl text-right font-ayat leading-relaxed mb-4 text-white/90" dir="rtl">{item.arab}</p>
                                            <p className="text-xs text-gray-400 italic leading-relaxed border-l border-primary-2/30 pl-3">"{item.indo}"</p>

                                            {/* Progress Line */}
                                            <div className="absolute bottom-0 left-0 h-1 bg-primary-2 transition-all duration-300" style={{ width: `${(current / max) * 100}%` }} />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                            <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}
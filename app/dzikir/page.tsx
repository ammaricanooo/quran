"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, CheckCircle2, RotateCcw, Sparkles, Plus, Minus } from "lucide-react";

export default function DzikirPage() {
    const [dzikirData, setDzikirData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pagi");
    const [counts, setCounts] = useState<{ [key: string]: number }>({});
    
    // State untuk Tasbih Custom
    const [customCounter, setCustomCounter] = useState(0);
    const [customMax, setCustomMax] = useState(33);

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
        <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden">
            {/* Simple Header */}
            <div className="flex-none p-4 md:px-8 border-b border-white/5 z-20">
                <header className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-lg font-black tracking-tighter uppercase">Dzikir</h1>
                    </div>
                    {/* Compact Filter */}
                    <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                                    activeTab === cat.id ? "bg-primary-2 text-white shadow-lg" : "text-gray-500"
                                }`}
                            >
                                {cat.icon} <span className="hidden sm:inline">{cat.id}</span>
                            </button>
                        ))}
                    </div>
                </header>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
                <div className="max-w-4xl mx-auto pb-32">
                    
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
                                <button onClick={() => setCustomCounter(0)} className="p-1.5 bg-white/5 rounded-lg text-gray-400"><RotateCcw size={14}/></button>
                            </div>
                        </div>
                        <div 
                            onClick={() => customCounter < customMax && setCustomCounter(prev => prev + 1)}
                            className="bg-black/40 rounded-3xl py-8 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all border border-white/5 hover:border-primary-2/50"
                        >
                            <span className="text-5xl font-black text-white mb-1">{customCounter}</span>
                            <span className="text-xs font-bold text-primary-2 uppercase">Klik untuk Menghitung</span>
                            <div className="w-full max-w-40 h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-2 transition-all" style={{ width: `${(customCounter/customMax)*100}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
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
                                        className={`relative group p-6 rounded-4xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                            isDone ? "bg-primary-2/10 border-primary-2/40" : "bg-white/5 border-white/5"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                                                    isDone ? "bg-primary-2 border-primary-2 shadow-lg shadow-primary-2/40" : "bg-white/5 border-white/10"
                                                }`}>
                                                    {isDone ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black text-primary-2">{current}</span>}
                                                </div>
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target: {item.ulang}</span>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); resetCount(id); }} className="p-2 text-gray-600 hover:text-white"><RotateCcw size={14} /></button>
                                        </div>

                                        <p className="text-2xl text-right font-ayat leading-relaxed mb-4 text-white/90" dir="rtl">{item.arab}</p>
                                        <p className="text-xs text-gray-400 italic leading-relaxed border-l border-primary-2/30 pl-3">"{item.indo}"</p>

                                        {/* Progress Line */}
                                        <div className="absolute bottom-0 left-0 h-1 bg-primary-2 transition-all duration-300" style={{ width: `${(current / max) * 100}%` }} />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
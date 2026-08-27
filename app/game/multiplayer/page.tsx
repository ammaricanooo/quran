"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Plus, LogIn, Swords } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

type View = "home" | "create" | "join";

export default function MultiplayerPage() {
    const [view, setView] = useState<View>("home");

    if (view === "create") return <CreateRoom onBack={() => setView("home")} />;
    if (view === "join")   return <JoinRoom   onBack={() => setView("home")} />;

    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center gap-3">
                        <Link href="/game" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-black">
                            Kuis <span className="text-rose-400">Multiplayer</span>
                        </h1>
                    </header>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* Hero */}
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-4xl p-6 md:p-8 flex flex-col items-center text-center gap-4">
                            <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                                <Swords size={40} className="text-rose-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black">Tantang Temanmu!</h2>
                                <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                                    Buat room, bagikan kode, dan lihat siapa yang paling hafal Al-Qur'an.
                                    Skor dihitung dari kebenaran <strong className="text-white">dan</strong> kecepatan menjawab.
                                </p>
                            </div>
                        </div>

                        {/* Action Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setView("create")}
                                className="group flex flex-col gap-4 p-6 rounded-4xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all active:scale-[0.98] text-left"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus size={24} className="text-primary-2" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">Buat Room</h3>
                                    <p className="text-gray-400 text-sm mt-1">Jadilah host, pilih mode, dan undang teman.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setView("join")}
                                className="group flex flex-col gap-4 p-6 rounded-4xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-rose-500/30 transition-all active:scale-[0.98] text-left"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <LogIn size={24} className="text-rose-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">Gabung Room</h3>
                                    <p className="text-gray-400 text-sm mt-1">Masukkan kode 6 digit dari temanmu.</p>
                                </div>
                            </button>
                        </div>

                        {/* Rules */}
                        <div className="bg-white/5 border border-white/5 rounded-4xl p-6 space-y-2">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cara Bermain</p>
                            <ul className="text-sm text-gray-400 space-y-1.5">
                                <li className="flex items-start gap-2"><span className="text-primary-2 font-black shrink-0">1.</span> Host buat room &amp; pilih mode kuis.</li>
                                <li className="flex items-start gap-2"><span className="text-primary-2 font-black shrink-0">2.</span> Bagikan kode 6 digit ke teman-teman.</li>
                                <li className="flex items-start gap-2"><span className="text-primary-2 font-black shrink-0">3.</span> Setiap pemain masukkan nama sebelum mulai.</li>
                                <li className="flex items-start gap-2"><span className="text-primary-2 font-black shrink-0">4.</span> Host mulai kapan saja — soal muncul bersamaan.</li>
                                <li className="flex items-start gap-2"><span className="text-primary-2 font-black shrink-0">5.</span> Skor = 500 poin + bonus kecepatan hingga 500 poin.</li>
                                <li className="flex items-start gap-2"><span className="text-primary-2 font-black shrink-0">6.</span> Papan peringkat tampil setelah semua soal selesai.</li>
                            </ul>
                        </div>

                        <div className="mb-8" />
                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}

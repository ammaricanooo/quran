import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft, Headphones, Link2, BookMarked, Swords } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kuis Al-Qur'an — Al-Qur'an Ku",
    description: "Uji hafalan Al-Qur'an kamu dengan mini-game edukatif.",
};

const soloModes = [
    {
        href: "/game/tebak-ayat",
        icon: <Headphones size={28} />,
        title: "Tebak Ayat",
        desc: "Dengar murottal, pilih terjemahan.",
        accent: "from-primary/20 to-primary/5 border-primary/30",
        iconBg: "bg-primary/20 text-primary-2",
    },
    {
        href: "/game/sambung-ayat",
        icon: <Link2 size={28} />,
        title: "Sambung Ayat",
        desc: "Lanjutkan potongan ayat.",
        accent: "from-violet-500/20 to-violet-600/5 border-violet-500/30",
        iconBg: "bg-violet-500/20 text-violet-400",
    },
    {
        href: "/game/tebak-surah",
        icon: <BookMarked size={28} />,
        title: "Tebak Surah",
        desc: "Tebak nama surah & nomor ayat.",
        accent: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
        iconBg: "bg-amber-500/20 text-amber-400",
    },
];

export default function GameHomePage() {
    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center gap-3">
                        <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-black">
                            Kuis <span className="text-primary-2">Al-Qur'an</span>
                        </h1>
                    </header>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* Multiplayer Banner */}
                        <Link href="/game/multiplayer"
                            className="group flex items-center gap-5 p-6 rounded-4xl bg-gradient-to-br from-rose-500/20 to-rose-600/5 border border-rose-500/30 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl overflow-hidden relative">
                            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Swords size={32} className="text-rose-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Fitur Unggulan</p>
                                <h2 className="text-xl font-black">Kuis Multiplayer</h2>
                                <p className="text-gray-400 text-sm mt-1">Tantang teman secara realtime. Buat room, bagikan kode, siapa tercepat?</p>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                            <div className="absolute -right-4 -bottom-4 text-[80px] font-black opacity-5 select-none">⚔</div>
                        </Link>

                        {/* Solo Modes */}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Mode Solo — 10 Soal</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {soloModes.map((mode) => (
                                    <Link key={mode.href} href={mode.href}
                                        className={`group flex flex-col gap-4 p-5 rounded-4xl bg-gradient-to-br ${mode.accent} border hover:brightness-110 active:scale-[0.98] transition-all shadow-xl`}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${mode.iconBg} group-hover:scale-110 transition-transform`}>
                                            {mode.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-base">{mode.title}</h3>
                                            <p className="text-gray-400 text-xs mt-1">{mode.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-2">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sistem Skor</p>
                            <ul className="text-sm text-gray-400 space-y-1.5">
                                <li>Jawaban benar: <strong className="text-white">500 poin dasar</strong></li>
                                <li>Bonus kecepatan: hingga <strong className="text-primary-2">+500 poin</strong> (semakin cepat = lebih banyak)</li>
                                <li>Jawaban salah atau timeout: <strong className="text-rose-400">0 poin</strong></li>
                                <li>Skor maksimum per soal: <strong className="text-white">1.000 poin</strong></li>
                            </ul>
                        </div>
            <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}

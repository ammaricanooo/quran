"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { buildPool, buildTebakAyatQ, buildSambungAyatQ, buildTebakSurahQ } from "@/lib/game-utils";
import type { QuizMode, SerializedQuestion } from "@/lib/room-types";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const MODES: { id: QuizMode; label: string; desc: string; color: string }[] = [
    { id: "tebak-ayat",  label: "Tebak Ayat",   desc: "Dengar audio, pilih terjemahan",           color: "border-primary/40 text-primary-2" },
    { id: "sambung-ayat",label: "Sambung Ayat",  desc: "Lanjutkan potongan ayat",                  color: "border-violet-400/40 text-violet-400" },
    { id: "tebak-surah", label: "Tebak Surah",   desc: "Tebak nama surah & nomor ayat",            color: "border-amber-400/40 text-amber-400" },
];

function randomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CreateRoom({ onBack }: { onBack: () => void }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [hostPlaying, setHostPlaying] = useState(true);
    const [mode, setMode] = useState<QuizMode>("tebak-ayat");
    const [total, setTotal] = useState(10);
    const [time, setTime] = useState(30);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (hostPlaying && !name.trim()) { setError("Masukkan nama kamu dulu!"); return; }
        setError("");
        setLoading(true);

        try {
            setProgress("Menyiapkan soal...");
            const pool = await buildPool(total + 6);
            setProgress("Membangun pertanyaan...");

            const serialized: SerializedQuestion[] = pool.slice(0, total).map((a, i) => {
                let q;
                if (mode === "tebak-ayat")        q = buildTebakAyatQ(a, pool.filter((_, j) => j !== i), i);
                else if (mode === "sambung-ayat")  q = buildSambungAyatQ(a, pool.filter((_, j) => j !== i), i);
                else                               q = buildTebakSurahQ(a, pool.filter((_, j) => j !== i), i);

                return {
                    id: q.id,
                    mode: q.mode,
                    arabText: q.ayat.teksArab,
                    latinText: q.ayat.teksLatin,
                    indonesiaText: q.ayat.teksIndonesia,
                    audioUrl: q.ayat.audio?.["05"] ?? "",
                    surahName: q.ayat.surahName,
                    surahNo: q.ayat.surahNo,
                    ayatNo: q.ayat.nomorAyat,
                    choices: q.choices,
                    correctIndex: q.correctIndex,
                    prompt: q.prompt ?? null,
                    promptLatin: q.promptLatin ?? null,
                } satisfies SerializedQuestion;
            });

            setProgress("Membuat room...");
            const code = randomCode();
            const hostId = `host-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

            // Kalau host ikut main, daftarkan sebagai player
            const players: Record<string, object> = hostPlaying
                ? {
                    [hostId]: {
                        name: name.trim(),
                        score: 0,
                        answeredAt: null,
                        lastAnswer: null,
                        correct: null,
                        joinedAt: Date.now(),
                        isHost: true,
                    },
                }
                : {};

            const roomData = {
                code,
                hostId,
                hostPlaying,
                status: "waiting",
                mode,
                createdAt: Date.now(),
                currentQuestion: 0,
                questionStartedAt: 0,
                timePerQuestion: time,
                totalQuestions: total,
                questions: serialized,
                players,
            };

            await setDoc(doc(db, "quiz_rooms", code), roomData);

            // Simpan hostId di sessionStorage agar room page tahu siapa host
            sessionStorage.setItem(`room_${code}_playerId`, hostId);
            if (hostPlaying) {
                sessionStorage.setItem(`room_${code}_playerName`, name.trim());
            }

            router.push(`/game/multiplayer/room/${code}`);
        } catch (e) {
            console.error(e);
            setError("Gagal membuat room. Coba lagi.");
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center gap-3">
                        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-xl font-black">Buat <span className="text-primary-2">Room</span></h1>
                    </header>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-5">

                        {/* Toggle ikut main */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kamu Ikut Bermain?</label>
                            <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setHostPlaying(true)}
                                    className={`flex-1 py-3 text-sm font-black transition-all flex items-center justify-center gap-2 ${hostPlaying ? "bg-primary/20 text-primary-2" : "text-gray-500"}`}
                                >
                                    ✅ Ya, ikut main
                                </button>
                                <button
                                    onClick={() => { setHostPlaying(false); setName(""); }}
                                    className={`flex-1 py-3 text-sm font-black transition-all flex items-center justify-center gap-2 ${!hostPlaying ? "bg-white/10 text-white" : "text-gray-500"}`}
                                >
                                    👁️ Hanya pantau
                                </button>
                            </div>
                        </div>

                        {/* Nama — hanya tampil kalau ikut main */}
                        {hostPlaying && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Kamu</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    maxLength={20}
                                    placeholder="Masukkan nama..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all"
                                />
                            </div>
                        )}

                        {/* Mode */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mode Kuis</label>
                            <div className="space-y-2">
                                {MODES.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMode(m.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                            mode === m.id
                                                ? `bg-white/10 ${m.color}`
                                                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/8"
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${mode === m.id ? "border-current" : "border-gray-600"}`}>
                                            {mode === m.id && <div className="w-2 h-2 rounded-full bg-current" />}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black">{m.label}</p>
                                            <p className="text-xs opacity-60">{m.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Jumlah Soal</label>
                                <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                    {[5, 10, 15].map(v => (
                                        <button key={v} onClick={() => setTotal(v)}
                                            className={`flex-1 py-3 text-sm font-black transition-all ${total === v ? "bg-primary/20 text-primary-2" : "text-gray-500"}`}>
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Waktu/Soal</label>
                                <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                    {[15, 30, 45].map(v => (
                                        <button key={v} onClick={() => setTime(v)}
                                            className={`flex-1 py-3 text-sm font-black transition-all ${time === v ? "bg-primary/20 text-primary-2" : "text-gray-500"}`}>
                                            {v}s
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-rose-400 text-sm font-bold text-center">{error}</p>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center gap-2 py-2">
                                <Loader2 size={24} className="animate-spin text-primary-2" />
                                <p className="text-sm text-gray-400">{progress}</p>
                            </div>
                        )}

                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-3xl text-sm font-black text-primary-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                            Buat Room
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

"use client";

import { useState } from "react";
import { ArrowLeft, LogIn, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function JoinRoom({ onBack }: { onBack: () => void }) {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleJoin = async () => {
        const trimCode = code.trim().toUpperCase();
        const trimName = name.trim();
        if (!trimCode || trimCode.length !== 6) { setError("Kode harus 6 karakter."); return; }
        if (!trimName)                           { setError("Masukkan nama kamu dulu!"); return; }
        setError("");
        setLoading(true);

        try {
            const ref = doc(db, "quiz_rooms", trimCode);
            const snap = await getDoc(ref);

            if (!snap.exists()) { setError("Room tidak ditemukan."); setLoading(false); return; }
            const data = snap.data();
            if (data.status !== "waiting") { setError("Room sudah dimulai atau selesai."); setLoading(false); return; }

            const playerId = `player-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
            await updateDoc(ref, {
                [`players.${playerId}`]: {
                    name: trimName,
                    score: 0,
                    answeredAt: null,
                    lastAnswer: null,
                    correct: null,
                    joinedAt: Date.now(),
                    isHost: false,
                },
            });

            sessionStorage.setItem(`room_${trimCode}_playerId`, playerId);
            sessionStorage.setItem(`room_${trimCode}_playerName`, trimName);

            router.push(`/game/multiplayer/room/${trimCode}`);
        } catch (e) {
            console.error(e);
            setError("Gagal bergabung. Coba lagi.");
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
                        <h1 className="text-xl md:text-2xl font-black">Gabung <span className="text-rose-400">Room</span></h1>
                    </header>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-24 lg:pb-6">
                    <div className="max-w-sm w-full space-y-5">

                        {/* Kode */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kode Room (6 karakter)</label>
                            <input
                                value={code}
                                onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                                placeholder="Contoh: AB3XY7"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-black tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white/10 transition-all"
                                maxLength={6}
                            />
                        </div>

                        {/* Nama */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Kamu</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                maxLength={20}
                                placeholder="Masukkan nama..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white/10 transition-all"
                            />
                        </div>

                        {error && <p className="text-rose-400 text-sm font-bold text-center">{error}</p>}

                        <button
                            onClick={handleJoin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-3xl text-sm font-black text-rose-400 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                            Gabung Room
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

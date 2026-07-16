"use client";

import { useState, useEffect, useRef, useCallback, use as useHook } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import type { RoomDoc, Player, SerializedQuestion } from "@/lib/room-types";
import { calcScore } from "@/lib/game-utils";
import Navbar from "@/components/Navbar";
import {
    Users, Copy, Check, Play, Trophy, Timer,
    CheckCircle2, XCircle, Crown, ArrowLeft, Loader2, Swords,
} from "lucide-react";

// ─── Sub-components ─────────────────────────────────────────────────────────

function PlayerCard({ player, rank }: { player: Player & { id: string }; rank?: number }) {
    const rankIcon = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-black shrink-0">
                {rankIcon ?? <span className="text-gray-500">{rank}</span>}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate flex items-center gap-1.5">
                    {player.name}
                    {player.isHost && <Crown size={12} className="text-amber-400 shrink-0" />}
                </p>
            </div>
            <span className="text-xs font-black text-primary-2">{player.score.toLocaleString()}</span>
        </div>
    );
}

function WaitingRoom({ room, playerId, code }: { room: RoomDoc; playerId: string; code: string }) {
    const [copied, setCopied] = useState(false);
    // Host diidentifikasi dari room.hostId, bukan dari players (karena host bisa spectator)
    const isHost = room.hostId === playerId;
    const isSpectator = isHost && !room.hostPlaying;
    const playerList = Object.entries(room.players)
        .sort(([,a],[,b]) => a.joinedAt - b.joinedAt);

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const startGame = async () => {
        await updateDoc(doc(db, "quiz_rooms", code), {
            status: "countdown",
            countdownStartedAt: Date.now(),
        });
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
            <div className="max-w-5xl mx-auto space-y-5">
                <div className="bg-white/5 border border-white/10 rounded-4xl p-6 flex flex-col items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kode Room</p>
                    <p className="text-5xl font-black tracking-[0.3em] text-primary-2">{code}</p>
                    <button onClick={copyCode}
                        className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-gray-400 transition-all active:scale-95">
                        {copied ? <><Check size={14} className="text-emerald-400" /> Tersalin!</> : <><Copy size={14} /> Salin Kode</>}
                    </button>
                    <p className="text-xs text-gray-500 text-center">Bagikan kode ini ke teman-temanmu</p>
                </div>

                {/* Badge host spectator */}
                {isSpectator && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <Crown size={14} className="text-amber-400 shrink-0" />
                        <p className="text-xs font-bold text-amber-400">Kamu adalah host. Kamu tidak ikut bermain — hanya memantau & mengelola room.</p>
                    </div>
                )}

                {/* Daftar Pemain */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Users size={12} /> Pemain ({playerList.length})
                        </p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[10px] text-emerald-400 font-bold">Menunggu...</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {playerList.length === 0 && (
                            <p className="text-center text-gray-600 text-sm py-4">Belum ada pemain yang bergabung.</p>
                        )}
                        {playerList.map(([id, p]) => (
                            <div key={id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl">
                                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-black shrink-0">
                                    {p.name[0].toUpperCase()}
                                </div>
                                <p className="text-sm font-black flex-1 flex items-center gap-2">
                                    {p.name}
                                    {p.isHost && <Crown size={12} className="text-amber-400" />}
                                    {id === playerId && <span className="text-[9px] text-primary-2 font-bold uppercase">(Kamu)</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info mode */}
                <div className="bg-white/5 border border-white/5 rounded-3xl p-4 text-sm text-gray-400">
                    Mode: <strong className="text-white capitalize">{room.mode.replace(/-/g, " ")}</strong>
                    {" · "}{room.totalQuestions} soal{" · "}{room.timePerQuestion}s/soal
                </div>

                {/* Tombol mulai (hanya host) */}
                {isHost && (
                    <button onClick={startGame}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-3xl text-sm font-black text-emerald-400 transition-all active:scale-95">
                        <Play size={18} fill="currentColor" /> Mulai Permainan
                    </button>
                )}
                {!isHost && (
                    <p className="text-center text-gray-500 text-sm">Menunggu host memulai...</p>
                )}
            </div>
        </div>
    );
}

function Countdown({ room, code }: { room: RoomDoc; code: string }) {
    const [count, setCount] = useState(3);

    useEffect(() => {
        const elapsed = Math.floor((Date.now() - (room.countdownStartedAt ?? Date.now())) / 1000);
        const remaining = Math.max(0, 3 - elapsed);
        setCount(remaining);

        if (remaining === 0) {
            updateDoc(doc(db, "quiz_rooms", code), {
                status: "question",
                currentQuestion: 0,
                questionStartedAt: Date.now(),
            });
            return;
        }

        const iv = setInterval(() => {
            setCount(p => {
                const next = p - 1;
                if (next <= 0) {
                    clearInterval(iv);
                    updateDoc(doc(db, "quiz_rooms", code), {
                        status: "question",
                        currentQuestion: 0,
                        questionStartedAt: Date.now(),
                    });
                }
                return Math.max(0, next);
            });
        }, 1000);
        return () => clearInterval(iv);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Permainan dimulai dalam</p>
            <div className="w-36 h-36 rounded-full bg-primary/20 border-4 border-primary/40 flex items-center justify-center">
                <span className="text-7xl font-black text-primary-2 animate-pulse">{count}</span>
            </div>
            <p className="text-gray-500 text-sm">Siapkan dirimu!</p>
        </div>
    );
}

function QuestionView({
    room, playerId, code, q,
}: {
    room: RoomDoc; playerId: string; code: string; q: SerializedQuestion;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(room.timePerQuestion);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const qIdx = room.currentQuestion;
    // Host diidentifikasi dari room.hostId
    const isHost = room.hostId === playerId;
    // Host spectator = host yang tidak ikut bermain
    const isSpectator = isHost && !room.hostPlaying;
    const isActivePlayer = !isSpectator && !!room.players[playerId];

    // Reset when question changes
    useEffect(() => {
        setSelected(null);
        setAnswered(false);
        setIsPlaying(false);
        audioRef.current?.pause();
    }, [qIdx]);

    // Timer
    useEffect(() => {
        const elapsed = Math.floor((Date.now() - room.questionStartedAt) / 1000);
        const remaining = Math.max(0, room.timePerQuestion - elapsed);
        setTimeLeft(remaining);
        if (remaining === 0) { handleTimeout(); return; }

        const iv = setInterval(() => {
            setTimeLeft(p => {
                if (p <= 1) { clearInterval(iv); handleTimeout(); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(iv);
    }, [qIdx, room.questionStartedAt]);

    const handleTimeout = () => {
        if (answered) return;
        setAnswered(true);
        // Auto-advance host after 3s
        if (isHost) {
            setTimeout(() => advanceQuestion(), 3000);
        }
    };

    const handleAnswer = async (idx: number) => {
        if (answered || isSpectator) return;   // spectator tidak bisa jawab
        setSelected(idx);
        setAnswered(true);
        audioRef.current?.pause();

        const elapsed = (Date.now() - room.questionStartedAt) / 1000;
        const remaining = Math.max(0, room.timePerQuestion - elapsed);
        const correct = idx === q.correctIndex;
        const gained = calcScore(correct, remaining, room.timePerQuestion);

        await updateDoc(doc(db, "quiz_rooms", code), {
            [`players.${playerId}.answeredAt`]: Date.now(),
            [`players.${playerId}.lastAnswer`]: idx,
            [`players.${playerId}.correct`]: correct,
            [`players.${playerId}.score`]: (room.players[playerId]?.score ?? 0) + gained,
        });

        if (navigator.vibrate) navigator.vibrate(correct ? 50 : [80, 40, 80]);

        // Host auto-advances when all answered or time up
        if (isHost) {
            setTimeout(() => advanceQuestion(), 3000);
        }
    };

    const advanceQuestion = async () => {
        const next = qIdx + 1;
        if (next >= room.totalQuestions) {
            await updateDoc(doc(db, "quiz_rooms", code), { status: "finished" });
        } else {
            await updateDoc(doc(db, "quiz_rooms", code), {
                status: "question",
                currentQuestion: next,
                questionStartedAt: Date.now(),
                // Reset semua jawaban pemain untuk soal ini
                ...Object.fromEntries(Object.keys(room.players).map(pid => [
                    `players.${pid}.answeredAt`, null,
                ])),
            });
        }
    };

    const playAudio = () => {
        if (!audioRef.current) return;
        if (!audioRef.current.src || audioRef.current.src !== q.audioUrl) {
            audioRef.current.src = q.audioUrl;
            audioRef.current.load();
        }
        if (audioRef.current.paused) { audioRef.current.play(); setIsPlaying(true); }
        else { audioRef.current.pause(); setIsPlaying(false); }
    };

    const answeredCount = Object.values(room.players).filter(p => p.answeredAt !== null).length;
    const totalPlayers = Object.keys(room.players).length;
    const timerPct = (timeLeft / room.timePerQuestion) * 100;
    const timerColor = timeLeft > (room.timePerQuestion * 0.5) ? "bg-primary-2"
        : timeLeft > (room.timePerQuestion * 0.25) ? "bg-amber-400" : "bg-rose-500";

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-4 pb-24 lg:pb-6">
            <div className="max-w-5xl mx-auto flex flex-col gap-4">

                {/* Banner spectator */}
                {isSpectator && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <Crown size={14} className="text-amber-400 shrink-0" />
                        <p className="text-xs font-bold text-amber-400">Mode pantau — kamu tidak ikut menjawab soal ini.</p>
                    </div>
                )}

                {/* Header info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-black">Soal {qIdx + 1} / {room.totalQuestions}</span>
                    <span>{answeredCount}/{totalPlayers} menjawab</span>
                </div>

                {/* Timer */}
                <div className="flex items-center gap-3">
                    <Timer size={14} className={timeLeft <= room.timePerQuestion * 0.25 ? "text-rose-500 animate-pulse" : "text-gray-500"} />
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
                    </div>
                    <span className={`text-xs font-black w-6 text-right ${timeLeft <= 7 ? "text-rose-400" : "text-gray-500"}`}>{timeLeft}</span>
                </div>

                {/* Ayat Card */}
                <div className={`rounded-4xl p-5 flex flex-col gap-3 border ${
                    q.mode === "tebak-ayat" ? "bg-primary/10 border-primary/20"
                    : q.mode === "sambung-ayat" ? "bg-violet-500/10 border-violet-500/20"
                    : "bg-amber-500/10 border-amber-500/20"
                }`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {q.mode === "tebak-ayat" ? "Pilih terjemahan yang benar"
                            : q.mode === "sambung-ayat" ? "Lanjutkan ayat ini"
                            : "Ayat ini dari Surah & Ayat berapa?"}
                    </p>

                    {q.mode === "sambung-ayat" ? (
                        <p className="text-2xl font-ayat leading-loose text-right" dir="rtl">
                            {q.prompt} <span className="text-violet-400/60">...</span>
                        </p>
                    ) : (
                        <p className="text-2xl font-ayat leading-loose text-right" dir="rtl">{q.arabText}</p>
                    )}

                    {q.mode === "tebak-ayat" && (
                        <button onClick={playAudio}
                            className="self-start flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-black text-primary-2 transition-all">
                            {isPlaying ? "⏸ Hentikan" : "▶ Putar Murottal"}
                        </button>
                    )}

                    {q.mode !== "tebak-ayat" && (
                        <p className="text-xs text-gray-400 italic">{q.latinText}</p>
                    )}

                    {answered && q.mode === "sambung-ayat" && (
                        <div className="pt-2 border-t border-white/10">
                            <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Ayat lengkap:</p>
                            <p className="text-xl font-ayat leading-loose text-right text-white/80" dir="rtl">{q.arabText}</p>
                        </div>
                    )}
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 gap-3">
                    {q.choices.map((choice, idx) => {
                        let style = "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10";
                        if (answered) {
                            if (idx === q.correctIndex) style = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                            else if (idx === selected) style = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                            else style = "bg-white/5 border-white/5 text-gray-500 opacity-40";
                        }
                        const isArabChoice = q.mode === "sambung-ayat";
                        return (
                            <button key={idx} onClick={() => handleAnswer(idx)}
                                disabled={answered || isSpectator}
                                className={`flex items-center gap-3 w-full p-4 rounded-3xl border transition-all duration-200 active:scale-[0.98] ${style} ${isArabChoice ? "flex-row-reverse text-right" : "text-left"}`}
                                dir={isArabChoice ? "rtl" : "ltr"}>
                                <span className="w-7 h-7 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[11px] font-black" dir="ltr">
                                    {["A","B","C","D"][idx]}
                                </span>
                                <span className={`flex-1 ${isArabChoice ? "text-xl font-ayat leading-relaxed" : "text-sm"}`}>{choice}</span>
                                {answered && idx === q.correctIndex && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                                {answered && idx === selected && idx !== q.correctIndex && <XCircle size={18} className="text-rose-400 shrink-0" />}
                            </button>
                        );
                    })}
                </div>

                {/* Skor gained */}
                {answered && selected !== null && selected === q.correctIndex && (() => {
                    const elapsed = (Date.now() - room.questionStartedAt) / 1000;
                    const gained = calcScore(true, Math.max(0, room.timePerQuestion - elapsed), room.timePerQuestion);
                    return <p className="text-center text-sm font-black text-emerald-400 animate-pulse">+{gained.toLocaleString()} poin ⚡</p>;
                })()}

                {(answered || isSpectator) && (
                    <p className="text-center text-xs text-gray-500">
                        {isHost ? "Soal berikutnya dalam 3 detik..." : "Menunggu soal berikutnya..."}
                    </p>
                )}
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
}

function Leaderboard({ room }: { room: RoomDoc }) {
    const sorted = Object.entries(room.players)
        .map(([id, p]) => ({ id, ...p }))
        .sort((a, b) => b.score - a.score);

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
            <div className="max-w-5xl mx-auto space-y-5">
                <div className="text-center">
                    <div className="text-5xl mb-3">🏆</div>
                    <h2 className="text-2xl font-black">Peringkat Akhir</h2>
                    <p className="text-gray-400 text-sm mt-1">Kuis selesai!</p>
                </div>

                {/* Podium top 3 */}
                {sorted.length >= 1 && (
                    <div className="flex items-end justify-center gap-3 py-4">
                        {[1, 0, 2].map(rank => {
                            const p = sorted[rank];
                            if (!p) return <div key={rank} className="w-20" />;
                            const heights = ["h-28", "h-36", "h-20"];
                            const medals = ["🥈", "🥇", "🥉"];
                            const colors = ["bg-gray-400/20", "bg-amber-400/20", "bg-orange-400/20"];
                            return (
                                <div key={rank} className={`flex flex-col items-center gap-2 ${rank === 0 ? "w-28" : "w-20"}`}>
                                    <span className="text-2xl">{medals[rank]}</span>
                                    <p className="text-xs font-black text-center truncate w-full text-center">{p.name}</p>
                                    <p className="text-[10px] font-black text-primary-2">{p.score.toLocaleString()}</p>
                                    <div className={`w-full rounded-t-2xl ${heights[rank]} ${colors[rank]} border border-white/10 flex items-end justify-center pb-2`}>
                                        <span className="text-xs font-black text-white/40">#{rank + 1}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Full list */}
                <div className="space-y-2">
                    {sorted.map((p, i) => (
                        <PlayerCard key={p.id} player={p} rank={i + 1} />
                    ))}
                </div>

                <Link href="/game"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl text-sm font-black text-gray-400 transition-all">
                    Kembali ke Menu
                </Link>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = useHook(params);
    const router = useRouter();
    const [room, setRoom] = useState<RoomDoc | null>(null);
    const [playerId, setPlayerId] = useState<string>("");
    const [error, setError] = useState("");

    // Ambil playerId dari sessionStorage
    useEffect(() => {
        const pid = sessionStorage.getItem(`room_${code}_playerId`);
        if (!pid) {
            router.replace("/game/multiplayer");
            return;
        }
        setPlayerId(pid);
    }, [code]);

    // Subscribe Firestore realtime
    useEffect(() => {
        if (!code) return;
        const ref = doc(db, "quiz_rooms", code);
        const unsub = onSnapshot(ref, (snap) => {
            if (!snap.exists()) { setError("Room tidak ditemukan."); return; }
            setRoom(snap.data() as RoomDoc);
        }, () => setError("Koneksi terputus."));
        return () => unsub();
    }, [code]);

    if (error) return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col items-center justify-center lg:ml-72 gap-4 px-8 text-center">
                <Swords size={48} className="text-rose-400 opacity-50" />
                <p className="font-black text-lg">{error}</p>
                <Link href="/game/multiplayer" className="px-6 py-3 bg-white/5 rounded-2xl text-sm font-bold text-gray-400 hover:bg-white/10 transition">Kembali</Link>
            </main>
        </>
    );

    if (!room || !playerId) return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col items-center justify-center lg:ml-72 gap-4">
                <Loader2 size={36} className="animate-spin text-primary-2" />
                <p className="text-gray-400 text-sm">Memuat room...</p>
            </main>
        </>
    );

    const currentQ = room.questions?.[room.currentQuestion];

    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                {/* Header */}
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/game/multiplayer" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl font-black">
                                Room <span className="text-rose-400">{code}</span>
                            </h1>
                        </div>
                        {room.status === "question" && (
                            <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                                <Users size={14} />
                                {Object.keys(room.players).length}
                            </div>
                        )}
                    </header>
                </div>

                {/* Content by status */}
                {room.status === "waiting" && (
                    <WaitingRoom room={room} playerId={playerId} code={code} />
                )}
                {room.status === "countdown" && (
                    <Countdown room={room} code={code} />
                )}
                {room.status === "question" && currentQ && (
                    <QuestionView room={room} playerId={playerId} code={code} q={currentQ} />
                )}
                {room.status === "finished" && (
                    <Leaderboard room={room} />
                )}
            </main>
        </>
    );
}

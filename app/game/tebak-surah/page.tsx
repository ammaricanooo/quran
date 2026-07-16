"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    ArrowLeft, CheckCircle2, XCircle, Trophy,
    RotateCcw, ChevronRight, BookMarked, Timer,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { buildPool, buildTebakSurahQ, calcScore, type Question } from "@/lib/game-utils";

const TOTAL = 10;
const TIME = 30;

function LoadingScreen({ progress }: { progress: number }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <BookMarked size={36} className="text-amber-400 animate-pulse" />
            </div>
            <div className="text-center">
                <h2 className="text-xl font-black mb-1">Menyiapkan Soal...</h2>
                <p className="text-gray-400 text-sm">Memuat {progress} dari {TOTAL} ayat</p>
            </div>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${(progress / TOTAL) * 100}%` }} />
            </div>
        </div>
    );
}

function ResultScreen({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
    const pct = Math.round((score / (total * 1000)) * 100);
    const correct = score > 0 ? Math.round(score / 750) : 0; // estimasi
    const grade = pct >= 80 ? { label: "Ahli Navigasi Al-Qur'an!", color: "text-amber-400", icon: "🏆" }
        : pct >= 60 ? { label: "Penghafal Handal!", color: "text-primary-2", icon: "⭐" }
        : pct >= 30 ? { label: "Terus Belajar", color: "text-violet-400", icon: "📖" }
        : { label: "Perbanyak Bacaan!", color: "text-rose-400", icon: "💪" };

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="text-6xl">{grade.icon}</div>
            <div>
                <h2 className={`text-3xl font-black ${grade.color}`}>{grade.label}</h2>
                <p className="text-gray-400 text-sm mt-1">Kuis selesai</p>
            </div>
            <div className="w-40 h-40 rounded-full bg-white/5 border-4 border-amber-500/30 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-3xl font-black">{score.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Poin</span>
            </div>
            <div className="flex gap-3">
                <button onClick={onRestart}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-2xl text-sm font-bold text-amber-400 transition-all active:scale-95">
                    <RotateCcw size={16} /> Main Lagi
                </button>
                <Link href="/game"
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold text-gray-400 transition-all">
                    Keluar
                </Link>
            </div>
        </div>
    );
}

export default function TebakSurahPage() {
    const [phase, setPhase] = useState<"loading" | "playing" | "result">("loading");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadProgress, setLoadProgress] = useState(0);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    const load = useCallback(async () => {
        setPhase("loading");
        setLoadProgress(0);
        setTotalScore(0);
        setCurrent(0);
        setSelected(null);
        setAnswered(false);

        const pool = await buildPool(TOTAL + 6);
        setLoadProgress(TOTAL);

        const qs = pool.slice(0, TOTAL).map((a, i) =>
            buildTebakSurahQ(a, pool.filter((_, j) => j !== i), i)
        );
        setQuestions(qs);
        setPhase("playing");
    }, []);

    useEffect(() => { load(); }, [load]);

    // Timer
    useEffect(() => {
        if (phase !== "playing" || answered) return;
        setTimeLeft(TIME);
        setQuestionStartTime(Date.now());
        const iv = setInterval(() => {
            setTimeLeft(p => {
                if (p <= 1) { clearInterval(iv); handleAnswer(-1); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(iv);
    }, [current, phase]);

    const handleAnswer = (idx: number) => {
        if (answered) return;
        const elapsed = (Date.now() - questionStartTime) / 1000;
        const remaining = Math.max(0, TIME - elapsed);
        setSelected(idx);
        setAnswered(true);
        const q = questions[current];
        if (idx === q?.correctIndex) {
            setTotalScore(s => s + calcScore(true, remaining, TIME));
            if (navigator.vibrate) navigator.vibrate(50);
        } else {
            if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
        }
    };

    const handleNext = () => {
        if (current + 1 >= TOTAL) { setPhase("result"); return; }
        setCurrent(c => c + 1);
        setSelected(null);
        setAnswered(false);
    };

    const q = questions[current];
    const timerPct = (timeLeft / TIME) * 100;
    const timerColor = timeLeft > 15 ? "bg-amber-400" : timeLeft > 7 ? "bg-orange-400" : "bg-rose-500";

    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/game" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl font-black">Tebak <span className="text-amber-400">Surah</span></h1>
                        </div>
                        {phase === "playing" && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                                    <Trophy size={14} /> {totalScore.toLocaleString()}
                                </div>
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-xs font-black text-gray-400">
                                    {current + 1}/{TOTAL}
                                </div>
                            </div>
                        )}
                    </header>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6 flex flex-col">
                    <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 gap-5">
                        {phase === "loading" && <LoadingScreen progress={loadProgress} />}
                        {phase === "result" && <ResultScreen score={totalScore} total={TOTAL} onRestart={load} />}

                        {phase === "playing" && q && (
                            <>
                                {/* Progress */}
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full transition-all duration-300"
                                        style={{ width: `${(current / TOTAL) * 100}%` }} />
                                </div>

                                {/* Timer */}
                                <div className="flex items-center gap-3">
                                    <Timer size={14} className={timeLeft <= 7 ? "text-rose-500 animate-pulse" : "text-gray-500"} />
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
                                            style={{ width: `${timerPct}%` }} />
                                    </div>
                                    <span className={`text-xs font-black w-6 text-right ${timeLeft <= 7 ? "text-rose-400" : "text-gray-500"}`}>
                                        {timeLeft}
                                    </span>
                                </div>

                                {/* Ayat Card */}
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-4xl p-6 flex flex-col gap-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                                        Soal {current + 1} — Ayat ini dari Surah & Ayat berapa?
                                    </p>
                                    <p className="text-3xl font-ayat leading-loose text-right text-white/90" dir="rtl">
                                        {q.ayat.teksArab}
                                    </p>
                                    <div className="border-t border-white/10 pt-3 space-y-1">
                                        <p className="text-xs italic text-gray-400 leading-relaxed">{q.ayat.teksLatin}</p>
                                        <p className="text-sm text-gray-300 leading-relaxed">{q.ayat.teksIndonesia}</p>
                                    </div>
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
                                        return (
                                            <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered}
                                                className={`flex items-center gap-4 w-full p-4 rounded-3xl border text-left transition-all duration-200 active:scale-[0.98] ${style}`}>
                                                <span className="w-7 h-7 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[11px] font-black">
                                                    {["A", "B", "C", "D"][idx]}
                                                </span>
                                                <span className="text-sm font-bold flex-1">{choice}</span>
                                                {answered && idx === q.correctIndex && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                                                {answered && idx === selected && idx !== q.correctIndex && <XCircle size={18} className="text-rose-400 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Skor soal ini */}
                                {answered && selected === q.correctIndex && (
                                    <div className="text-center text-sm font-black text-amber-400 animate-pulse">
                                        +{calcScore(true, timeLeft, TIME).toLocaleString()} poin ⚡
                                    </div>
                                )}

                                {answered && (
                                    <button onClick={handleNext}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-3xl text-sm font-black text-amber-400 transition-all active:scale-95">
                                        {current + 1 >= TOTAL ? <><Trophy size={16} /> Lihat Hasil</> : <>Soal Berikutnya <ChevronRight size={16} /></>}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

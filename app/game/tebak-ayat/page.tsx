"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Volume2, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, Timer } from "lucide-react";
import Navbar from "@/components/Navbar";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksIndonesia: string;
    audio: { [key: string]: string };
    surahName: string;
    surahNo: number;
}

interface Question {
    ayat: Ayat;
    choices: string[]; // 4 terjemahan
    correctIndex: number;
}

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 30;
const QARI = "05"; // Misyari Rasyid

// Ambil ayat acak dari surah acak
async function fetchRandomAyat(): Promise<Ayat> {
    const surahNo = Math.floor(Math.random() * 114) + 1;
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNo}`);
    const json = await res.json();
    const data = json.data;
    const ayatList: Ayat[] = data.ayat.map((a: any) => ({
        ...a,
        surahName: data.namaLatin,
        surahNo: data.nomor,
    }));
    const idx = Math.floor(Math.random() * ayatList.length);
    return ayatList[idx];
}

// Buat 1 soal: 1 ayat benar + 3 distractor terjemahan dari ayat lain
async function buildQuestion(correctAyat: Ayat, distractors: Ayat[]): Promise<Question> {
    const pool = distractors.filter(a => a.teksIndonesia !== correctAyat.teksIndonesia);
    // Ambil 3 unik
    const chosen: string[] = [];
    const used = new Set<string>();
    for (const d of pool) {
        if (used.has(d.teksIndonesia)) continue;
        used.add(d.teksIndonesia);
        chosen.push(d.teksIndonesia);
        if (chosen.length === 3) break;
    }
    // Jika kurang, isi dengan placeholder
    while (chosen.length < 3) chosen.push(`(Terjemahan pilihan ${chosen.length + 1})`);

    const correctIndex = Math.floor(Math.random() * 4);
    const choices = [...chosen];
    choices.splice(correctIndex, 0, correctAyat.teksIndonesia);

    return { ayat: correctAyat, choices, correctIndex };
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen({ progress }: { progress: number }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Volume2 size={36} className="text-primary-2 animate-pulse" />
            </div>
            <div className="text-center">
                <h2 className="text-xl font-black mb-1">Menyiapkan Soal...</h2>
                <p className="text-gray-400 text-sm">Memuat {progress} dari {TOTAL_QUESTIONS} ayat</p>
            </div>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary-2 rounded-full transition-all duration-500"
                    style={{ width: `${(progress / TOTAL_QUESTIONS) * 100}%` }}
                />
            </div>
        </div>
    );
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 80 ? { label: "Luar Biasa!", color: "text-emerald-400", icon: "🏆" }
        : pct >= 60 ? { label: "Bagus!", color: "text-primary-2", icon: "⭐" }
        : pct >= 40 ? { label: "Cukup Baik", color: "text-amber-400", icon: "📖" }
        : { label: "Terus Belajar!", color: "text-rose-400", icon: "💪" };

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="text-6xl">{grade.icon}</div>
            <div>
                <h2 className={`text-3xl font-black ${grade.color}`}>{grade.label}</h2>
                <p className="text-gray-400 text-sm mt-1">Kuis selesai</p>
            </div>

            {/* Score circle */}
            <div className="w-36 h-36 rounded-full bg-white/5 border-4 border-primary/30 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-4xl font-black">{score}</span>
                <span className="text-xs text-gray-400 font-bold">dari {total} benar</span>
            </div>

            {/* Score bar */}
            <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Skor</span><span>{pct}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary-2 rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-2">
                <button
                    onClick={onRestart}
                    className="flex items-center gap-2 px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-2xl text-sm font-bold text-primary-2 transition-all active:scale-95"
                >
                    <RotateCcw size={16} /> Main Lagi
                </button>
                <Link
                    href="/game"
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold text-gray-400 transition-all"
                >
                    Keluar
                </Link>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TebakAyatPage() {
    const [phase, setPhase] = useState<"loading" | "playing" | "result">("loading");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadProgress, setLoadProgress] = useState(0);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Load questions ──────────────────────────────────────────────────────
    const loadQuestions = useCallback(async () => {
        setPhase("loading");
        setLoadProgress(0);
        setScore(0);
        setCurrent(0);
        setSelected(null);
        setAnswered(false);

        // Fetch TOTAL + 3 extra untuk dijadikan distractor
        const total = TOTAL_QUESTIONS + 3;
        const ayatPool: Ayat[] = [];
        for (let i = 0; i < total; i++) {
            const a = await fetchRandomAyat();
            ayatPool.push(a);
            setLoadProgress(i + 1);
        }

        const qs: Question[] = [];
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            const correct = ayatPool[i];
            const distractors = ayatPool.filter((_, idx) => idx !== i);
            qs.push(await buildQuestion(correct, distractors));
        }

        setQuestions(qs);
        setPhase("playing");
    }, []);

    useEffect(() => { loadQuestions(); }, [loadQuestions]);

    // ── Timer ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== "playing" || answered) return;
        setTimeLeft(TIME_PER_QUESTION);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    handleAnswer(-1); // timeout = salah
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [current, phase]);

    // ── Audio ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== "playing") return;
        setIsPlaying(false);
        audioRef.current?.pause();
    }, [current, phase]);

    const playAudio = () => {
        if (!audioRef.current || !questions[current]) return;
        const url = questions[current].ayat.audio[QARI];
        if (audioRef.current.src !== url) {
            audioRef.current.src = url;
            audioRef.current.load();
        }
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    // ── Answer ──────────────────────────────────────────────────────────────
    const handleAnswer = (idx: number) => {
        if (answered) return;
        if (timerRef.current) clearInterval(timerRef.current);
        audioRef.current?.pause();
        setIsPlaying(false);
        setSelected(idx);
        setAnswered(true);
        if (idx === questions[current]?.correctIndex) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (current + 1 >= TOTAL_QUESTIONS) {
            setPhase("result");
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
            setAnswered(false);
        }
    };

    // ── Render helpers ──────────────────────────────────────────────────────
    const q = questions[current];
    const timerPct = (timeLeft / TIME_PER_QUESTION) * 100;
    const timerColor = timeLeft > 15 ? "bg-primary-2" : timeLeft > 7 ? "bg-amber-400" : "bg-rose-500";

    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">

                {/* ── HEADER ── */}
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/game" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl md:text-2xl font-black">
                                Tebak <span className="text-primary-2">Ayat</span>
                            </h1>
                        </div>
                        {phase === "playing" && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-black text-primary-2">
                                    <Trophy size={14} /> {score}
                                </div>
                                <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-xs font-black text-gray-400">
                                    {current + 1} / {TOTAL_QUESTIONS}
                                </div>
                            </div>
                        )}
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6 flex flex-col">
                    <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 gap-5 pb-6">

                        {phase === "loading" && (
                            <LoadingScreen progress={loadProgress} />
                        )}

                        {phase === "result" && (
                            <ResultScreen score={score} total={TOTAL_QUESTIONS} onRestart={loadQuestions} />
                        )}

                        {phase === "playing" && q && (
                            <>
                                {/* Progress bar soal */}
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((current) / TOTAL_QUESTIONS) * 100}%` }}
                                    />
                                </div>

                                {/* Timer */}
                                <div className="flex items-center gap-3">
                                    <Timer size={14} className={timeLeft <= 7 ? "text-rose-500 animate-pulse" : "text-gray-500"} />
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
                                            style={{ width: `${timerPct}%` }}
                                        />
                                    </div>
                                    <span className={`text-xs font-black w-6 text-right ${timeLeft <= 7 ? "text-rose-400" : "text-gray-500"}`}>
                                        {timeLeft}
                                    </span>
                                </div>

                                {/* Audio Player Card */}
                                <div className="bg-primary/10 border border-primary/20 rounded-4xl p-6 flex flex-col items-center gap-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-2">
                                        Soal {current + 1} — Terjemahan Ayat Mana?
                                    </p>

                                    {/* Arabic text */}
                                    <p className="text-3xl font-ayat leading-loose text-center text-white/90" dir="rtl">
                                        {q.ayat.teksArab}
                                    </p>

                                    {/* Play button */}
                                    <button
                                        onClick={playAudio}
                                        className="flex items-center gap-3 px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-2xl text-sm font-black text-primary-2 transition-all active:scale-95"
                                    >
                                        {isPlaying
                                            ? <><Pause size={18} fill="currentColor" /> Hentikan Audio</>
                                            : <><Play size={18} fill="currentColor" /> Putar Murottal</>
                                        }
                                    </button>

                                    <p className="text-[10px] text-gray-500 font-bold">
                                        {q.ayat.surahName} : {q.ayat.nomorAyat}
                                    </p>
                                </div>

                                {/* Choices */}
                                <div className="grid grid-cols-1 gap-3">
                                    {q.choices.map((choice, idx) => {
                                        let style = "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10";
                                        if (answered) {
                                            if (idx === q.correctIndex) style = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                                            else if (idx === selected) style = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                                            else style = "bg-white/5 border-white/5 text-gray-500 opacity-50";
                                        } else if (selected === idx) {
                                            style = "bg-primary/20 border-primary/40 text-white";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={answered}
                                                className={`flex items-center gap-4 w-full p-4 rounded-3xl border text-left transition-all duration-200 active:scale-[0.98] ${style}`}
                                            >
                                                <span className="w-7 h-7 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[11px] font-black">
                                                    {["A", "B", "C", "D"][idx]}
                                                </span>
                                                <span className="text-sm leading-relaxed flex-1">{choice}</span>
                                                {answered && idx === q.correctIndex && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                                                {answered && idx === selected && idx !== q.correctIndex && <XCircle size={18} className="text-rose-400 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next button */}
                                {answered && (
                                    <button
                                        onClick={handleNext}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-3xl text-sm font-black text-primary-2 transition-all active:scale-95"
                                    >
                                        {current + 1 >= TOTAL_QUESTIONS ? (
                                            <><Trophy size={16} /> Lihat Hasil</>
                                        ) : (
                                            <>Soal Berikutnya <ChevronRight size={16} /></>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />
        </>
    );
}

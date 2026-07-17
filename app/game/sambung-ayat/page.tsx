"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, Link2, Timer } from "lucide-react";
import Navbar from "@/components/Navbar";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    surahName: string;
    surahNo: number;
}

interface Question {
    prompt: string;          // penggalan awal ayat (Arab)
    promptLatin: string;     // latin dari prompt
    fullAyat: string;        // ayat lengkap (Arab)
    choices: string[];       // 4 sambungan (Arab)
    correctIndex: number;
    surahName: string;
    ayatNo: number;
    splitAt: number;         // berapa kata prompt
}

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 30;
const MIN_WORDS = 3; // minimal kata untuk prompt

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchRandomSurahAyats(): Promise<Ayat[]> {
    const surahNo = Math.floor(Math.random() * 114) + 1;
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNo}`);
    const json = await res.json();
    const data = json.data;
    return data.ayat
        .filter((a: any) => {
            const words = a.teksArab.trim().split(/\s+/);
            return words.length > MIN_WORDS + 1; // ayat harus cukup panjang
        })
        .map((a: any) => ({
            nomorAyat: a.nomorAyat,
            teksArab: a.teksArab,
            teksLatin: a.teksLatin,
            teksIndonesia: a.teksIndonesia,
            surahName: data.namaLatin,
            surahNo: data.nomor,
        }));
}

// Potong ayat: ambil beberapa kata pertama sebagai prompt
function splitAyat(teksArab: string): { prompt: string; continuation: string; splitAt: number } {
    const words = teksArab.trim().split(/\s+/);
    // Ambil 30-50% kata pertama sebagai prompt, minimal MIN_WORDS
    const promptLen = Math.max(MIN_WORDS, Math.floor(words.length * (0.3 + Math.random() * 0.2)));
    const prompt = words.slice(0, promptLen).join(" ");
    const continuation = words.slice(promptLen).join(" ");
    return { prompt, continuation, splitAt: promptLen };
}

async function buildQuestion(
    correct: Ayat,
    distractors: Ayat[]
): Promise<Question> {
    const { prompt, continuation, splitAt } = splitAyat(correct.teksArab);

    // Potong distractor di posisi yang sama relatif
    const pool: string[] = [];
    const used = new Set<string>();
    used.add(continuation);

    for (const d of distractors) {
        const dWords = d.teksArab.trim().split(/\s+/);
        if (dWords.length <= splitAt) continue;
        const dCont = dWords.slice(splitAt).join(" ");
        if (used.has(dCont)) continue;
        used.add(dCont);
        pool.push(dCont);
        if (pool.length === 3) break;
    }

    // Jika distractor kurang, buat variasi dari distractor lain
    let fill = 1;
    while (pool.length < 3) {
        pool.push(`(pilihan ${fill++})`);
    }

    const correctIndex = Math.floor(Math.random() * 4);
    const choices = [...pool];
    choices.splice(correctIndex, 0, continuation);

    return {
        prompt,
        promptLatin: correct.teksLatin.split(" ").slice(0, splitAt).join(" ") + "...",
        fullAyat: correct.teksArab,
        choices,
        correctIndex,
        surahName: correct.surahName,
        ayatNo: correct.nomorAyat,
        splitAt,
    };
}

// ─── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen({ progress }: { progress: number }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
            <div className="w-20 h-20 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Link2 size={36} className="text-violet-400 animate-pulse" />
            </div>
            <div className="text-center">
                <h2 className="text-xl font-black mb-1">Menyiapkan Soal...</h2>
                <p className="text-gray-400 text-sm">Memuat {progress} dari {TOTAL_QUESTIONS} ayat</p>
            </div>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-violet-400 rounded-full transition-all duration-500"
                    style={{ width: `${(progress / TOTAL_QUESTIONS) * 100}%` }}
                />
            </div>
        </div>
    );
}

// ─── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 80 ? { label: "Hafidz Mode!", color: "text-emerald-400", icon: "🏆" }
        : pct >= 60 ? { label: "Hampir Sempurna!", color: "text-violet-400", icon: "⭐" }
        : pct >= 40 ? { label: "Terus Berlatih", color: "text-amber-400", icon: "📖" }
        : { label: "Yuk Perbanyak Hafalan!", color: "text-rose-400", icon: "💪" };

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="text-6xl">{grade.icon}</div>
            <div>
                <h2 className={`text-3xl font-black ${grade.color}`}>{grade.label}</h2>
                <p className="text-gray-400 text-sm mt-1">Kuis selesai</p>
            </div>
            <div className="w-36 h-36 rounded-full bg-white/5 border-4 border-violet-500/30 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-4xl font-black">{score}</span>
                <span className="text-xs text-gray-400 font-bold">dari {total} benar</span>
            </div>
            <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Skor</span><span>{pct}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-violet-400 rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
            <div className="flex gap-3 mt-2">
                <button
                    onClick={onRestart}
                    className="flex items-center gap-2 px-6 py-3 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-2xl text-sm font-bold text-violet-400 transition-all active:scale-95"
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
export default function SambungAyatPage() {
    const [phase, setPhase] = useState<"loading" | "playing" | "result">("loading");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadProgress, setLoadProgress] = useState(0);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [showFull, setShowFull] = useState(false);

    const timerRef = { current: null as ReturnType<typeof setInterval> | null };

    // ── Load questions ──────────────────────────────────────────────────────
    const loadQuestions = useCallback(async () => {
        setPhase("loading");
        setLoadProgress(0);
        setScore(0);
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setShowFull(false);

        // Ambil pool besar dari surah acak, lalu pilih TOTAL_QUESTIONS ayat
        const allAyats: Ayat[] = [];
        let attempts = 0;
        while (allAyats.length < TOTAL_QUESTIONS + 10 && attempts < 20) {
            const ayats = await fetchRandomSurahAyats();
            // Shuffle dan ambil yang belum ada
            const shuffled = ayats.sort(() => Math.random() - 0.5);
            for (const a of shuffled) {
                if (allAyats.length >= TOTAL_QUESTIONS + 10) break;
                // Hindari duplikat surah
                if (!allAyats.find(x => x.surahNo === a.surahNo && x.nomorAyat === a.nomorAyat)) {
                    allAyats.push(a);
                }
            }
            attempts++;
            setLoadProgress(Math.min(allAyats.length, TOTAL_QUESTIONS));
        }

        const qs: Question[] = [];
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            const correct = allAyats[i];
            const distractors = allAyats.filter((_, idx) => idx !== i);
            qs.push(await buildQuestion(correct, distractors));
            setLoadProgress(i + 1);
        }

        setQuestions(qs);
        setPhase("playing");
    }, []);

    useEffect(() => { loadQuestions(); }, [loadQuestions]);

    // ── Timer ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== "playing" || answered) return;
        setTimeLeft(TIME_PER_QUESTION);
        setShowFull(false);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleAnswer(-1);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        timerRef.current = interval;
        return () => clearInterval(interval);
    }, [current, phase]);

    // ── Answer ──────────────────────────────────────────────────────────────
    const handleAnswer = (idx: number) => {
        if (answered) return;
        if (timerRef.current) clearInterval(timerRef.current);
        setSelected(idx);
        setAnswered(true);
        setShowFull(true);
        if (idx === questions[current]?.correctIndex) {
            setScore(s => s + 1);
            if (navigator.vibrate) navigator.vibrate(50);
        } else {
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    };

    const handleNext = () => {
        if (current + 1 >= TOTAL_QUESTIONS) {
            setPhase("result");
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
            setAnswered(false);
            setShowFull(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────
    const q = questions[current];
    const timerPct = (timeLeft / TIME_PER_QUESTION) * 100;
    const timerColor = timeLeft > 15 ? "bg-violet-400" : timeLeft > 7 ? "bg-amber-400" : "bg-rose-500";

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
                            <h1 className="text-xl font-black">
                                Sambung <span className="text-violet-400">Ayat</span>
                            </h1>
                        </div>
                        {phase === "playing" && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-black text-violet-400">
                                    <Trophy size={14} /> {score}
                                </div>
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-xs font-black text-gray-400">
                                    {current + 1} / {TOTAL_QUESTIONS}
                                </div>
                            </div>
                        )}
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6 flex flex-col">
                    <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 gap-5 pb-6">

                        {phase === "loading" && <LoadingScreen progress={loadProgress} />}
                        {phase === "result" && <ResultScreen score={score} total={TOTAL_QUESTIONS} onRestart={loadQuestions} />}

                        {phase === "playing" && q && (
                            <>
                                {/* Progress bar soal */}
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-violet-400 rounded-full transition-all duration-300"
                                        style={{ width: `${(current / TOTAL_QUESTIONS) * 100}%` }}
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

                                {/* Prompt Card */}
                                <div className="bg-violet-500/10 border border-violet-500/20 rounded-4xl p-6 flex flex-col gap-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                                        Soal {current + 1} — Lanjutkan Ayat Ini
                                    </p>

                                    {/* Prompt arab */}
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Awal Ayat:</p>
                                        <p className="text-3xl font-ayat leading-loose text-right text-white/90" dir="rtl">
                                            {q.prompt}
                                            {/* placeholder sambungan */}
                                            <span className="inline-block mx-2 text-violet-400/60">...</span>
                                        </p>
                                        <p className="text-xs text-gray-500 italic text-right">{q.promptLatin}</p>
                                    </div>

                                    {/* Setelah jawab: tampilkan ayat lengkap */}
                                    {showFull && (
                                        <div className="mt-2 pt-3 border-t border-white/10 space-y-1">
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Ayat Lengkap:</p>
                                            <p className="text-2xl font-ayat leading-loose text-right text-white/80" dir="rtl">
                                                {q.fullAyat}
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-[10px] text-gray-500 font-bold text-right">
                                        {q.surahName} : {q.ayatNo}
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
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={answered}
                                                className={`flex items-start gap-3 w-full p-4 rounded-3xl border text-right transition-all duration-200 active:scale-[0.98] ${style}`}
                                                dir="rtl"
                                            >
                                                <span className="w-7 h-7 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[11px] font-black" dir="ltr">
                                                    {["A", "B", "C", "D"][idx]}
                                                </span>
                                                <span className="text-lg font-ayat leading-relaxed flex-1">{choice}</span>
                                                 {answered && idx === q.correctIndex && <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-1" />}
                                                 {answered && idx === selected && idx !== q.correctIndex && <XCircle size={18} className="text-rose-400 shrink-0 mt-1" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next button */}
                                {answered && (
                                    <button
                                        onClick={handleNext}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-3xl text-sm font-black text-violet-400 transition-all active:scale-95"
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
        </>
    );
}

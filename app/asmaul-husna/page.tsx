"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Share2, BookOpen, Check, X, BookmarkPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BookmarkItem } from "@/lib/bookmark-types";
import { shareOrCopy } from "@/lib/share-utils";

interface Nama {
    id: number;
    arab: string;
    latin: string;
    indo: string;
}

// Warna aksen berputar per kartu
const ACCENTS = [
    "from-primary/20 to-primary/5 border-primary/20",
    "from-secondarys/20 to-secondarys/5 border-secondarys/20"
];

const ACCENT_TEXT = [
    "text-primary-2",
    "text-secondarys-2",
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-36 bg-white/5 border border-white/5 rounded-3xl animate-pulse"
                    style={{ animationDelay: `${i * 30}ms` }} />
            ))}
        </div>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
    nama,
    onClose,
    isBookmarked,
    isBookmarking,
    onToggleBookmark,
}: {
    nama: Nama;
    onClose: () => void;
    isBookmarked: boolean;
    isBookmarking: boolean;
    onToggleBookmark: (nama: Nama) => void;
}) {
    const accentIdx = (nama.id - 1) % ACCENTS.length;

    const handleShare = () => {
        shareOrCopy(
            {
                title: `${nama.latin} (No. ${nama.id})`,
                arab: nama.arab,
                latin: nama.latin,
                translation: nama.indo,
                extra: `Asmaul Husna ke-${nama.id}`,
            },
            "Asmaul Husna disalin!"
        );
    };

    // Tutup dengan klik backdrop atau Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-bg-primary border border-white/10 rounded-4xl p-8 space-y-5 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Nomor badge */}
                <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${ACCENT_TEXT[accentIdx]}`}>
                        Nama ke-{nama.id}
                    </span>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition text-sm font-black">
                        ✕
                    </button>
                </div>

                {/* Arab besar */}
                <p className="text-5xl font-ayat leading-loose text-center text-white/90" dir="rtl">
                    {nama.arab}
                </p>

                {/* Latin */}
                <p className={`text-2xl font-black text-center ${ACCENT_TEXT[accentIdx]}`}>
                    {nama.latin}
                </p>

                {/* Arti */}
                <div className={`bg-linear-to-br ${ACCENTS[accentIdx]} border rounded-3xl p-4 text-center`}>
                    <p className="text-white font-bold text-lg leading-snug">{nama.indo}</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={() => onToggleBookmark(nama)}
                        disabled={isBookmarking}
                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition active:scale-95 ${
                            isBookmarked
                                ? "bg-primary/20 text-primary-2 border border-primary/30 shadow-md"
                                : "bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white"
                        }`}
                    >
                        <BookmarkPlus size={16} fill={isBookmarked ? "currentColor" : "none"} />
                        <span>{isBookmarked ? "Tersimpan" : isBookmarking ? "Menyimpan..." : "Simpan"}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-black text-gray-400 hover:text-white transition active:scale-95"
                    >
                        <Share2 size={16} />
                        <span>Bagikan</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AsmaulHusnaPage() {
    const [data, setData]               = useState<Nama[]>([]);
    const [loading, setLoading]         = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selected, setSelected]       = useState<Nama | null>(null);
    const [memorized, setMemorized]     = useState<Set<number>>(new Set());
    const [user, setUser]               = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [rawBookmarks, setRawBookmarks] = useState<BookmarkItem[]>([]);
    const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/asmaul-husna")
            .then(r => r.json())
            .then((d: Nama[]) => {
                setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Auth listener + Firestore sync
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = doc(db, "users", currentUser.uid);
                const unsubDoc = onSnapshot(userDoc, (snap) => {
                    if (snap.exists()) {
                        const ids: number[] = snap.data().asmaulHusnaMemorized ?? [];
                        setMemorized(new Set(ids));
                        setRawBookmarks(snap.data().bookmarks ?? []);
                    }
                });
                return () => unsubDoc();
            } else {
                setRawBookmarks([]);
                // Fallback to localStorage when not logged in
                try {
                    const saved = localStorage.getItem("asmaul_memorized");
                    if (saved) setMemorized(new Set(JSON.parse(saved)));
                } catch {}
            }
        });
        return () => unsub();
    }, []);

    const isAsmaulBookmarked = (id: number) => {
        const key = `asmaul-${id}`;
        return rawBookmarks.some(
            (b) => b.id === key || (b.category === "asmaul-husna" && b.title.includes(`No. ${id}`))
        );
    };

    const handleToggleBookmark = async (nama: Nama) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const key = `asmaul-${nama.id}`;
        const existing = rawBookmarks.find(
            (b) => b.id === key || (b.category === "asmaul-husna" && b.title.includes(`No. ${nama.id}`))
        );

        setBookmarkingId(key);
        try {
            if (existing) {
                await updateDoc(doc(db, "users", user.uid), {
                    bookmarks: arrayRemove(existing),
                });
            } else {
                const newBookmark: BookmarkItem = {
                    id: key,
                    category: "asmaul-husna",
                    title: `${nama.latin} (No. ${nama.id})`,
                    subtitle: nama.indo,
                    teksArab: nama.arab,
                    teksLatin: nama.latin,
                    teksIndonesia: nama.indo,
                    url: "/asmaul-husna",
                    savedAt: new Date().toISOString(),
                };
                await setDoc(
                    doc(db, "users", user.uid),
                    { bookmarks: arrayUnion(newBookmark) },
                    { merge: true }
                );
            }
            if (navigator.vibrate) navigator.vibrate(50);
        } catch (err) {
            console.error("Gagal mengubah bookmark Asmaul Husna:", err);
        } finally {
            setBookmarkingId(null);
        }
    };

    const toggleMemorized = (id: number) => {
        setMemorized(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            const arr = [...next];
            if (user) {
                // Sync to Firestore
                setDoc(doc(db, "users", user.uid), { asmaulHusnaMemorized: arr }, { merge: true })
                    .catch(console.error);
            } else {
                // Fallback to localStorage
                try { localStorage.setItem("asmaul_memorized", JSON.stringify(arr)); } catch {}
            }
            return next;
        });
    };

    const filtered = data.filter(n =>
        n.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.indo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(n.id).includes(searchQuery)
    );

    const suggestions = searchQuery.trim().length > 0
        ? data
            .filter(n =>
                n.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.indo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(n.id).includes(searchQuery)
            )
            .slice(0, 5)
        : [];

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node))
                setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const memorizedCount = memorized.size;

    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">

                {/* ── HEADER ── */}
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl md:text-2xl font-black">
                                Asmaul <span className="text-primary-2">Husna</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Progress hafalan */}
                            {memorizedCount > 0 && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-xl">
                                    <span className="text-[10px] font-black text-primary-2 uppercase">
                                        Hafal {memorizedCount}/99
                                    </span>
                                </div>
                            )}
                            <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-primary-2 uppercase tracking-wider">
                                99 Nama
                            </div>
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* Progress bar hafalan */}
                        {!loading && memorizedCount > 0 && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <span>Progress Hafalan</span>
                                    <span>{Math.round((memorizedCount / 99) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${(memorizedCount / 99) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Search */}
                        <div className="relative mb-6" ref={searchRef}>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors z-10" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari nama, arti, atau nomor..."
                                    className="w-full bg-white/5 border border-white/5 rounded-3xl py-3.5 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-primary-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                                    {suggestions.map((n) => {
                                        const accentIdx = (n.id - 1) % ACCENTS.length;
                                        return (
                                            <button
                                                key={n.id}
                                                onMouseDown={() => { setSelected(n); setSearchQuery(n.latin); setShowSuggestions(false); }}
                                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 text-left"
                                            >
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 bg-linear-to-br ${ACCENTS[accentIdx]}`}>
                                                    {n.id}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{n.latin}</p>
                                                    <p className="text-[10px] text-gray-500 truncate">{n.indo}</p>
                                                </div>
                                                <p className="text-xl font-ayat text-white/50 shrink-0" dir="rtl">{n.arab}</p>
                                            </button>
                                        );
                                    })}
                                    {filtered.length > 5 && (
                                        <div className="px-4 py-2 text-[10px] text-gray-500 font-bold text-center uppercase tracking-widest">
                                            {filtered.length} nama ditemukan
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tip hafalan */}
                        {!loading && !searchQuery && (
                            <p className="text-[10px] text-gray-600 font-bold text-center uppercase tracking-widest flex justify-center items-center gap-2">
                                Ketuk kartu untuk detail · Tahan untuk tandai hafal <Check size={14} />
                            </p>
                        )}

                        {/* Grid */}
                        {loading ? (
                            <Skeleton />
                        ) : filtered.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {filtered.map((nama) => {
                                    const accentIdx = (nama.id - 1) % ACCENTS.length;
                                    const isMemorized = memorized.has(nama.id);

                                    return (
                                        <button
                                            key={nama.id}
                                            onClick={() => setSelected(nama)}
                                            onContextMenu={e => { e.preventDefault(); toggleMemorized(nama.id); }}
                                            onPointerDown={(e) => {
                                                // Long press 600ms untuk toggle hafalan di mobile
                                                const timer = setTimeout(() => {
                                                    toggleMemorized(nama.id);
                                                    if (navigator.vibrate) navigator.vibrate(40);
                                                }, 600);
                                                const cancel = () => clearTimeout(timer);
                                                e.currentTarget.addEventListener("pointerup", cancel, { once: true });
                                                e.currentTarget.addEventListener("pointermove", cancel, { once: true });
                                            }}
                                            className={`
                                                relative flex flex-col items-center justify-center gap-2
                                                p-4 rounded-3xl border text-center
                                                bg-linear-to-br ${ACCENTS[accentIdx]}
                                                hover:brightness-125 active:scale-95
                                                transition-all duration-200 group
                                                ${isMemorized ? "ring ring-white/50" : ""}
                                            `}
                                        >
                                            {/* Badge nomor */}
                                            <span className="absolute top-2 left-2.5 text-[9px] font-black text-white/30">
                                                {nama.id}
                                            </span>

                                            {/* Centang hafalan */}
                                            {isMemorized && (
                                                <span className="absolute top-2 right-2.5 text-white text-xs"><Check size={14} /></span>
                                            )}

                                            {/* Arab */}
                                            <p className="text-2xl font-ayat leading-loose text-white/90 mt-2" dir="rtl">
                                                {nama.arab}
                                            </p>

                                            {/* Latin */}
                                            <p className={`text-[10px] font-black leading-tight ${ACCENT_TEXT[accentIdx]}`}>
                                                {nama.latin}
                                            </p>

                                            {/* Arti */}
                                            <p className="text-[9px] text-white/50 leading-tight line-clamp-2">
                                                {nama.indo}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-40">
                                <BookOpen size={48} className="mx-auto mb-4" />
                                <p className="font-bold">Nama tidak ditemukan</p>
                            </div>
                        )}

                        {/* Info hasil pencarian */}
                        {searchQuery && filtered.length > 0 && (
                            <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                {filtered.length} nama ditemukan
                            </p>
                        )}

                        <div className="mb-8" />
                        <Footer />
                    </div>
                </div>
            </main>

            {/* Modal detail */}
            {selected && (
                <DetailModal
                    nama={selected}
                    onClose={() => setSelected(null)}
                    isBookmarked={isAsmaulBookmarked(selected.id)}
                    isBookmarking={bookmarkingId === `asmaul-${selected.id}`}
                    onToggleBookmark={handleToggleBookmark}
                />
            )}

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Login Diperlukan"
                description="Silakan login dengan Google untuk menyimpan Asmaul Husna ke bookmark profil Anda."
            />
        </>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Share2, ArrowLeft, BookOpen, X, BookmarkPlus, ChevronUp } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonCardList } from "@/components/Skeleton";
import LoginModal from "@/components/LoginModal";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BookmarkItem } from "@/lib/bookmark-types";
import { shareOrCopy } from "@/lib/share-utils";

interface Doa {
    id: number;
    nama: string;
    grup: string;
    ar: string;
    tr: string;
    idn: string;
    tentang?: string;
}

export default function DoaPage() {
    const [doaList, setDoaList] = useState<Doa[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openTentangId, setOpenTentangId] = useState<number | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [rawBookmarks, setRawBookmarks] = useState<BookmarkItem[]>([]);
    const [bookmarkingId, setBookmarkingId] = useState<number | null>(null);

    useEffect(() => {
        fetch("https://equran.id/api/doa")
            .then((res) => res.json())
            .then((json) => {
                setDoaList(json.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = doc(db, "users", currentUser.uid);
                const unsubDoc = onSnapshot(userDoc, (docSnap) => {
                    if (docSnap.exists()) {
                        setRawBookmarks(docSnap.data().bookmarks ?? []);
                    } else {
                        setRawBookmarks([]);
                    }
                });
                return () => unsubDoc();
            } else {
                setRawBookmarks([]);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node))
                setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const isDoaBookmarked = (doaId: number) => {
        return rawBookmarks.some(
            (b) => b.id === `doa-${doaId}` || (b.category === "doa" && b.title === doaList.find(d => d.id === doaId)?.nama)
        );
    };

    const handleToggleBookmark = async (doa: Doa) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const existing = rawBookmarks.find(
            (b) => b.id === `doa-${doa.id}` || (b.category === "doa" && b.title === doa.nama)
        );

        setBookmarkingId(doa.id);
        try {
            if (existing) {
                await updateDoc(doc(db, "users", user.uid), {
                    bookmarks: arrayRemove(existing),
                });
            } else {
                const newBookmark: BookmarkItem = {
                    id: `doa-${doa.id}`,
                    category: "doa",
                    title: doa.nama,
                    subtitle: doa.grup,
                    teksArab: doa.ar,
                    teksLatin: doa.tr,
                    teksIndonesia: doa.idn,
                    url: "/doa",
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
            console.error("Gagal mengubah bookmark doa:", err);
        } finally {
            setBookmarkingId(null);
        }
    };

    const handleShare = (doa: Doa) => {
        shareOrCopy(
            {
                title: doa.nama,
                arab: doa.ar,
                latin: doa.tr,
                translation: doa.idn,
                extra: `Kategori: ${doa.grup}`,
            },
            "Doa berhasil disalin!"
        );
    };

    const filteredDoa = doaList.filter((d) =>
        d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.grup.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const suggestions = searchQuery.trim().length > 0
        ? doaList
            .filter(d =>
                d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.grup.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5)
        : [];

    if (loading) return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/10 rounded-xl animate-pulse" />
                            <div className="h-6 w-36 bg-white/10 rounded-xl animate-pulse" />
                        </div>
                        <div className="h-6 w-16 bg-white/10 rounded-xl animate-pulse" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto">
                        <SkeletonCardList count={4} />
                    </div>
                </div>
            </main>
        </>
    );

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
                                Daftar <span className="text-primary-2">Doa</span>
                            </h1>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-primary-2 uppercase tracking-wider">
                            {doaList.length} Doa
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* Search */}
                        <div className="relative mb-6" ref={searchRef}>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors z-10" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau kategori doa..."
                                    className="w-full bg-white/5 border border-white/5 rounded-3xl py-3.5 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
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
                                    {suggestions.map((d) => (
                                        <button
                                            key={d.id}
                                            onMouseDown={() => { setSearchQuery(d.nama); setShowSuggestions(false); }}
                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 text-left"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                                                <BookOpen size={14} className="text-primary-2" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{d.nama}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{d.grup}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {filteredDoa.length > 5 && (
                                        <div className="px-4 py-2 text-[10px] text-gray-500 font-bold text-center uppercase tracking-widest">
                                            {filteredDoa.length} hasil ditemukan
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Doa Cards */}
                        {filteredDoa.map((doa) => {
                            const bookmarked = isDoaBookmarked(doa.id);
                            return (
                                <div
                                    key={doa.id}
                                    className="bg-white/5 border border-white/5 hover:border-white/10 rounded-4xl p-6 hover:bg-white/10 transition-all duration-300 shadow-xl"
                                >
                                    {/* Badge grup */}
                                    <span className="px-3 py-1 bg-primary/20 text-primary-2 text-[9px] font-black uppercase tracking-widest rounded-xl border border-primary/30 inline-block mb-4">
                                        {doa.grup}
                                    </span>

                                    <h3 className="text-xl font-bold mb-6 text-white/90 leading-tight">{doa.nama}</h3>

                                    <p className="text-4xl text-right font-ayat leading-loose mb-6 text-white/90" dir="rtl">
                                        {doa.ar}
                                    </p>

                                    <p className="border-l-2 border-primary/30 pl-4 text-sm font-bold italic leading-relaxed text-primary-2 mb-3">
                                        {doa.tr}
                                    </p>
                                    <p className="border-l-2 border-white/15 pl-4 text-sm leading-relaxed text-gray-300">
                                        {doa.idn}
                                    </p>

                                    {/* Action row — konsisten dengan halaman surah */}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                                        {doa.tentang && (
                                            <button
                                                onClick={() => setOpenTentangId(openTentangId === doa.id ? null : doa.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                                                    openTentangId === doa.id
                                                        ? "bg-primary text-white"
                                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                }`}
                                            >
                                                {openTentangId === doa.id ? <ChevronUp size={14} /> : <BookOpen size={14} />}
                                                {openTentangId === doa.id ? "Tutup Keterangan" : "Lihat Keterangan"}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleShare(doa)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                                        >
                                            <Share2 size={14} />
                                            <span className="hidden md:flex">Bagikan</span>
                                        </button>

                                        <button
                                            onClick={() => handleToggleBookmark(doa)}
                                            disabled={bookmarkingId === doa.id}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                                                bookmarked
                                                    ? "bg-primary/20 text-primary-2 border border-primary/30 shadow-md"
                                                    : bookmarkingId === doa.id
                                                    ? "bg-white/5 text-gray-400 animate-pulse"
                                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                            }`}
                                        >
                                            <BookmarkPlus size={14} fill={bookmarked ? "currentColor" : "none"} />
                                            <span className="hidden md:flex">
                                                {bookmarked
                                                    ? "Tersimpan"
                                                    : bookmarkingId === doa.id
                                                    ? "Menyimpan..."
                                                    : "Simpan"}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Keterangan panel — muncul di bawah action row */}
                                    {doa.tentang && openTentangId === doa.id && (
                                        <div className="mt-3 p-5 bg-black/30 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
                                            <h4 className="text-xs font-bold text-primary-2 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <BookOpen size={14} /> Keterangan
                                            </h4>
                                            <p className="text-sm text-gray-300 leading-loose whitespace-pre-line text-justify">
                                                {doa.tentang}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredDoa.length === 0 && (
                            <div className="text-center py-20 opacity-40">
                                <BookOpen size={48} className="mx-auto mb-4" />
                                <p className="font-bold">Doa tidak ditemukan</p>
                            </div>
                        )}

                        <div className="mb-8" />
                        <Footer />
                    </div>
                </div>
            </main>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Login Diperlukan"
                description="Silakan login dengan Google untuk menyimpan doa ke bookmark profil Anda."
            />
        </>
    );
}

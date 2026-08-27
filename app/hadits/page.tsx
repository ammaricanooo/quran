"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
    ArrowLeft, Search, BookOpen, Share2, Quote,
    ChevronLeft, ChevronRight, X, BookmarkPlus,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BookmarkItem } from "@/lib/bookmark-types";
import { shareOrCopy } from "@/lib/share-utils";

const LIMIT = 20;

interface KitabInfo { name: string; slug: string; total: number; }
interface HaditsItem { number: number; arab: string; id: string; judul: string; }

// ─── Skeleton ────────────────────────────────────────────────────────────────
function HaditsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="relative w-full">
                <div className="w-full h-12 md:h-12 rounded-4xl border border-white/5 bg-white/5 animate-pulse" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-4xl p-6 md:p-8 space-y-4"
                    style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-2xl animate-pulse shrink-0" />
                        <div className="h-5 w-48 bg-white/10 rounded-xl animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-7 w-full bg-white/10 rounded-xl animate-pulse" />
                        <div className="h-7 w-4/5 bg-white/10 rounded-xl animate-pulse ml-auto" />
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-white/5">
                        <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-white/5">
                        <div className="h-8 w-24 bg-white/10 rounded-xl animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, pages, onChange }: {
    page: number; pages: number; onChange: (p: number) => void;
}) {
    if (pages <= 1) return null;

    // Tampilkan maks 5 halaman di sekitar halaman aktif
    const getRange = () => {
        const delta = 2;
        const range: (number | "…")[] = [];
        const left  = Math.max(2, page - delta);
        const right = Math.min(pages - 1, page + delta);

        range.push(1);
        if (left > 2) range.push("…");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < pages - 1) range.push("…");
        if (pages > 1) range.push(pages);

        return range;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 py-4">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-30 transition"
            >
                <ChevronLeft size={16} />
            </button>
            {getRange().map((p, i) =>
                p === "…" ? (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-xs text-gray-600">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p as number)}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition ${
                            page === p
                                ? "bg-primary/20 border border-primary/30 text-primary-2"
                                : "bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}
            <button
                onClick={() => onChange(page + 1)}
                disabled={page >= pages}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-30 transition"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HaditsPage() {
    const [kitabList, setKitabList]   = useState<KitabInfo[]>([]);
    const [activeKitab, setActiveKitab] = useState("arbain");
    const [haditsList, setHaditsList] = useState<HaditsItem[]>([]);
    const [kitabName, setKitabName]   = useState("Arbain Nawawi");
    const [totalHadits, setTotalHadits] = useState(0);
    const [page, setPage]             = useState(1);
    const [pages, setPages]           = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading]       = useState(true);
    const [kitabLoading, setKitabLoading] = useState(true);
    const searchRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [rawBookmarks, setRawBookmarks] = useState<BookmarkItem[]>([]);
    const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node))
                setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
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

    // Fetch daftar kitab sekali
    useEffect(() => {
        fetch("/api/hadits/index")
            .then(r => r.json())
            .then((data: KitabInfo[]) => {
                // Tambahkan Arbain ke daftar (dari dataset lokal)
                const arbain: KitabInfo = { name: "Arbain Nawawi", slug: "arbain", total: 42 };
                const withArbain = [arbain, ...data];
                setKitabList(withArbain);
                setKitabLoading(false);
            })
            .catch(() => setKitabLoading(false));
    }, []);

    // Fetch hadits saat kitab/page/search berubah
    const fetchHadits = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({
            kitab: activeKitab,
            page:  String(page),
            limit: String(LIMIT),
            q:     searchQuery,
        });
        fetch(`/api/hadits?${params}`)
            .then(r => r.json())
            .then(data => {
                setHaditsList(data.hadits ?? []);
                setKitabName(data.name ?? activeKitab);
                setTotalHadits(data.total ?? 0);
                setPages(data.pages ?? 1);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [activeKitab, page, searchQuery]);

    // Fetch hadits saat kitab/page/searchQuery berubah
    useEffect(() => {
        fetchHadits();
    }, [fetchHadits]);

    // Auto search dengan debounce 300ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearchQuery(searchInput);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Reset halaman saat ganti kitab
    const handleKitabChange = (slug: string) => {
        setActiveKitab(slug);
        setPage(1);
        setSearchQuery("");
        setSearchInput("");
    };

    const isHaditsBookmarked = (itemNumber: number) => {
        const key = `hadits-${activeKitab}-${itemNumber}`;
        return rawBookmarks.some((b) => b.id === key || (b.category === "hadits" && b.title.includes(`${kitabName} No. ${itemNumber}`)));
    };

    const handleToggleBookmark = async (item: HaditsItem) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const key = `hadits-${activeKitab}-${item.number}`;
        const existing = rawBookmarks.find(
            (b) => b.id === key || (b.category === "hadits" && b.title.includes(`${kitabName} No. ${item.number}`))
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
                    category: "hadits",
                    title: `${kitabName} No. ${item.number}`,
                    subtitle: item.judul,
                    teksArab: item.arab,
                    teksIndonesia: item.id,
                    url: `/hadits`,
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
            console.error("Gagal mengubah bookmark hadits:", err);
        } finally {
            setBookmarkingId(null);
        }
    };

    const handleShare = (item: HaditsItem) => {
        shareOrCopy(
            {
                title: item.judul,
                arab: item.arab,
                translation: item.id,
                extra: `${kitabName} No. ${item.number}`,
            },
            "Hadits berhasil disalin!"
        );
    };

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
                                Hadits <span className="text-primary-2">{kitabName}</span>
                            </h1>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-primary-2 uppercase tracking-wider">
                            {totalHadits.toLocaleString()} Hadits
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* ── FILTER KITAB ── */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                            {kitabLoading
                                ? Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-8 w-24 bg-white/10 rounded-xl animate-pulse shrink-0" />
                                ))
                                : kitabList.map(k => (
                                    <button
                                        key={k.slug}
                                        onClick={() => handleKitabChange(k.slug)}
                                        className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                                            activeKitab === k.slug
                                                ? "bg-primary/20 border border-primary/30 text-primary-2"
                                                : "bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        {k.name}
                                        <span className="ml-1.5 text-[9px] opacity-50">
                                            {k.total >= 1000 ? `${(k.total / 1000).toFixed(1)}k` : k.total}
                                        </span>
                                    </button>
                                ))
                            }
                        </div>

                        {/* ── SEARCH BAR DENGAN AUTOCOMPLETE ── */}
                        <div className="relative" ref={searchRef}>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-2 transition-colors z-10" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Cari hadits di ${kitabName}...`}
                                    className="w-full bg-white/5 border border-white/5 rounded-3xl py-3.5 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white/10 transition-all text-sm"
                                    value={searchInput}
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {searchInput && (
                                    <button
                                        onClick={() => {
                                            setSearchInput("");
                                            setSearchQuery("");
                                            setShowSuggestions(false);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown Saran */}
                            {showSuggestions && searchInput.trim().length > 0 && haditsList.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-primary-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                                    {haditsList.slice(0, 5).map((item) => (
                                        <button
                                            key={`${activeKitab}-${item.number}`}
                                            onMouseDown={() => {
                                                setSearchInput(item.judul);
                                                setSearchQuery(item.judul);
                                                setShowSuggestions(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 text-left"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-black text-primary-2">{item.number}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{item.judul}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{item.id}</p>
                                            </div>
                                        </button>
                                    ))}
                                    <div className="px-4 py-2 text-[10px] text-gray-500 font-bold text-center uppercase tracking-widest">
                                        {totalHadits} hadits ditemukan
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── INFO BAR ── */}
                        {searchQuery && (
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Hasil pencarian: <strong className="text-white">&quot;{searchQuery}&quot;</strong> — {totalHadits} ditemukan</span>
                                <button
                                    onClick={() => { setSearchQuery(""); setSearchInput(""); setPage(1); }}
                                    className="text-rose-400 hover:text-rose-300 font-bold transition"
                                >
                                    Hapus
                                </button>
                            </div>
                        )}

                        {/* ── HADITS LIST ── */}
                        {loading ? (
                            <HaditsSkeleton />
                        ) : haditsList.length > 0 ? (
                            <>
                                {haditsList.map((item) => {
                                    const key = `hadits-${activeKitab}-${item.number}`;
                                    const bookmarked = isHaditsBookmarked(item.number);
                                    return (
                                        <div
                                            key={key}
                                            className="group p-6 md:p-8 rounded-4xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 shadow-xl transition-all duration-300 relative overflow-hidden"
                                        >
                                            {/* Nomor + judul */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-primary to-primary-2 flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20 shrink-0">
                                                    {item.number}
                                                </div>
                                                <h2 className="text-sm md:text-base font-bold text-primary-2 flex-1 leading-snug">{item.judul}</h2>
                                            </div>

                                            {/* Arab */}
                                            <div className="relative mb-6">
                                                <Quote className="absolute -top-4 -left-2 text-primary-2/10 w-12 h-12 rotate-180" />
                                                <p className="text-2xl md:text-3xl text-right font-ayat leading-loose text-white/90" dir="rtl">
                                                    {item.arab}
                                                </p>
                                            </div>

                                            {/* Terjemahan */}
                                            <div className="mb-4">
                                                <p className="text-[10px] font-black text-primary-2 uppercase tracking-widest border-l-2 border-primary/30 pl-4 mb-3">Terjemahan</p>
                                                <p className="border-l-2 border-white/15 pl-4 text-sm leading-relaxed text-gray-300 text-justify">{item.id}</p>
                                            </div>

                                            {/* Action row */}
                                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                                <button
                                                    onClick={() => handleToggleBookmark(item)}
                                                    disabled={bookmarkingId === key}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                                                        bookmarked
                                                            ? "bg-primary/20 text-primary-2 border border-primary/30 shadow-md"
                                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                >
                                                    <BookmarkPlus size={14} fill={bookmarked ? "currentColor" : "none"} />
                                                    <span>
                                                        {bookmarked
                                                            ? "Tersimpan"
                                                            : bookmarkingId === key
                                                            ? "Menyimpan..."
                                                            : "Simpan"}
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() => handleShare(item)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                                                >
                                                    <Share2 size={14} />
                                                    <span className="hidden md:flex">Bagikan</span>
                                                </button>
                                            </div>

                                            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                                                <BookOpen size={120} />
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                <Pagination page={page} pages={pages} onChange={(p) => { setPage(p); window.scrollTo(0, 0); }} />

                                {/* Info halaman */}
                                <p className="text-center text-[10px] text-gray-600 font-bold pb-2">
                                    Halaman {page} dari {pages} · {totalHadits.toLocaleString()} hadits
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-20 opacity-40">
                                <BookOpen size={48} className="mx-auto mb-4" />
                                <p className="font-bold">Hadits tidak ditemukan</p>
                                <p className="text-sm mt-1">Coba kata kunci lain atau pilih kitab berbeda.</p>
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
                description="Silakan login dengan Google untuk menyimpan hadits ke bookmark profil Anda."
            />
        </>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, LogOut, BookOpen, Bookmark, BookmarkCheck,
    Trash2, User, Sparkles, Star, Clock, ExternalLink, Check,
} from "lucide-react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    BookmarkCategory,
    BookmarkItem,
    CATEGORY_CONFIG,
    getBookmarkCategory,
    getBookmarkKey,
} from "@/lib/bookmark-types";

interface LastRead {
    surahNo: number;
    surahName: string;
    ayatNo: number;
    updatedAt?: string | null;
}

interface UserData {
    lastRead?: LastRead;
    bookmarks?: BookmarkItem[];
    asmaulHusnaMemorized?: number[];
}

// ─── Tab ──────────────────────────────────────────────────────────────────────
type Tab = "ringkasan" | "bookmark" | "hafalan";

type BookmarkFilter = "all" | BookmarkCategory;

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User size={36} className="text-primary-2" />
            </div>
            <div>
                <h2 className="text-2xl font-black mb-2">Masuk untuk Melanjutkan</h2>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                    Login dengan Google untuk menyimpan progres, bookmark (surah, doa, hadits, dll), dan hafalan Asmaul Husna.
                </p>
            </div>
            <button
                onClick={onLogin}
                className="flex items-center gap-3 px-6 py-3 bg-white text-bg-primary rounded-2xl font-black text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
            >
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Login dengan Google
            </button>
        </div>
    );
}

export default function ProfilPage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("ringkasan");
    const [bookmarkFilter, setBookmarkFilter] = useState<BookmarkFilter>("all");
    const [deletingBookmark, setDeletingBookmark] = useState<string | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setImgError(false);
            setLoadingAuth(false);
            if (u) {
                const userDoc = doc(db, "users", u.uid);
                onSnapshot(userDoc, (snap) => {
                    if (snap.exists()) setUserData(snap.data() as UserData);
                    else setUserData({});
                });
            } else {
                setUserData(null);
            }
        });
        return () => unsub();
    }, []);

    const handleLogin = () => signInWithPopup(auth, googleProvider);
    const handleLogout = () => { auth.signOut(); setUserData(null); };

    const handleDeleteBookmark = async (bookmark: BookmarkItem) => {
        if (!user) return;
        const key = getBookmarkKey(bookmark);
        setDeletingBookmark(key);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                bookmarks: arrayRemove(bookmark),
            });
        } catch (e) {
            console.error(e);
        } finally {
            setDeletingBookmark(null);
        }
    };

    const bookmarks = userData?.bookmarks ?? [];
    const memorized = userData?.asmaulHusnaMemorized ?? [];
    const lastRead = userData?.lastRead;

    const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: "ringkasan",  label: "Ringkasan",  icon: <User size={16} /> },
        { id: "bookmark",   label: "Bookmark",   icon: <Bookmark size={16} />, count: bookmarks.length },
        { id: "hafalan",    label: "Asmaul Husna", icon: <Sparkles size={16} />, count: memorized.length },
    ];

    const categoryFilters: { id: BookmarkFilter; label: string }[] = [
        { id: "all", label: "Semua" },
        { id: "surah", label: "Surah" },
        { id: "doa", label: "Doa" },
        { id: "hadits", label: "Hadits" },
        { id: "maulid", label: "Maulid" },
        { id: "dzikir", label: "Dzikir" },
        { id: "tahlil", label: "Tahlil" },
        { id: "asmaul-husna", label: "Asmaul Husna" },
    ];

    const filteredBookmarks = bookmarks.filter((b) => {
        if (bookmarkFilter === "all") return true;
        return getBookmarkCategory(b) === bookmarkFilter;
    });

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
                                Profil <span className="text-primary-2">Saya</span>
                            </h1>
                        </div>
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition"
                            >
                                <LogOut size={14} /> Keluar
                            </button>
                        )}
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {loadingAuth ? (
                            <div className="flex items-center justify-center py-24">
                                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary-2 animate-spin" />
                            </div>
                        ) : !user ? (
                            <LoginPrompt onLogin={handleLogin} />
                        ) : (
                            <>
                                {/* ── USER CARD ── */}
                                <div className="relative overflow-hidden bg-linear-to-br from-primary/20 to-primary-2/10 border border-primary/20 rounded-4xl p-6 shadow-xl">
                                    <div className="flex items-center gap-4">
                                        {user.photoURL && !imgError ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName ?? ""}
                                                onError={() => setImgError(true)}
                                                referrerPolicy="no-referrer"
                                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/30 to-primary-2/30 border border-primary/40 flex items-center justify-center shadow-lg">
                                                {user.displayName ? (
                                                    <span className="text-xl font-black text-primary-2">
                                                        {user.displayName.charAt(0).toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <User size={24} className="text-primary-2" />
                                                )}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-black truncate">{user.displayName || "Pengguna"}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3 mt-5">
                                        {[
                                            { label: "Bookmark", value: bookmarks.length, icon: <Bookmark size={14} /> },
                                            { label: "Asmaul Husna", value: `${memorized.length}/99`, icon: <Sparkles size={14} /> },
                                            { label: "Terakhir Dibaca", value: lastRead ? lastRead.surahName : "—", icon: <BookOpen size={14} /> },
                                        ].map((s) => (
                                            <div key={s.label} className="bg-black/20 rounded-2xl p-3 border border-white/5 text-center">
                                                <div className="flex items-center justify-center gap-1 text-primary-2 mb-1">{s.icon}</div>
                                                <p className="text-sm font-black truncate">{s.value}</p>
                                                <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── TABS ── */}
                                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 gap-1">
                                    {tabs.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setActiveTab(t.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                                activeTab === t.id
                                                    ? "bg-primary/20 border border-primary/30 text-primary-2 shadow-md"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            {t.icon}
                                            <span className="hidden sm:inline">{t.label}</span>
                                            {t.count !== undefined && t.count > 0 && (
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${activeTab === t.id ? "bg-primary/30 text-primary-2" : "bg-white/10 text-gray-500"}`}>
                                                    {t.count}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* ── TAB: RINGKASAN ── */}
                                {activeTab === "ringkasan" && (
                                    <div className="space-y-4">
                                        {/* Last Read */}
                                        <div className="bg-white/5 border border-white/5 rounded-4xl p-6 shadow-xl hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                                            <div className="flex items-center gap-2 mb-4">
                                                <BookmarkCheck size={16} className="text-primary-2" />
                                                <span className="text-xs font-black uppercase tracking-widest text-primary-2">Terakhir Dibaca</span>
                                            </div>
                                            {lastRead ? (
                                                <Link href={`/surah/${lastRead.surahNo}?fromLastRead=1`} className="flex items-center justify-between group">
                                                    <div>
                                                        <p className="text-xl font-black">{lastRead.surahName}</p>
                                                        <p className="text-sm text-gray-400 mt-1">Ayat ke-{lastRead.ayatNo}</p>
                                                        {lastRead.updatedAt && (
                                                            <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                                                                <Clock size={10} />
                                                                {new Date(lastRead.updatedAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition shrink-0" />
                                                </Link>
                                            ) : (
                                                <p className="text-sm text-gray-500">Belum ada riwayat bacaan. Mulai baca surah sekarang.</p>
                                            )}
                                        </div>

                                        {/* Recent Bookmarks */}
                                        {bookmarks.length > 0 && (
                                            <div className="bg-white/5 border border-white/5 rounded-4xl p-6 shadow-xl">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Bookmark size={16} className="text-primary-2" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-primary-2">Bookmark Terbaru</span>
                                                    </div>
                                                    <button onClick={() => setActiveTab("bookmark")} className="text-[10px] font-black text-gray-500 hover:text-white transition uppercase tracking-wider">
                                                        Lihat semua →
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {[...bookmarks].reverse().slice(0, 3).map((b) => {
                                                        const cat = getBookmarkCategory(b);
                                                        const cfg = CATEGORY_CONFIG[cat];
                                                        const displayTitle = b.title || `${b.surahName} : ${b.ayatNo}`;
                                                        const targetUrl = b.url || (b.surahNo ? `/surah/${b.surahNo}` : "/");
                                                        const key = getBookmarkKey(b);

                                                        return (
                                                            <Link key={key} href={targetUrl} className="flex items-center gap-3 p-3 bg-black/20 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                                                                <div className={`px-2.5 py-1 rounded-xl ${cfg.bg} ${cfg.border} border text-[10px] font-black ${cfg.text} shrink-0`}>
                                                                    {cfg.label}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold truncate">{displayTitle}</p>
                                                                    <p className="text-[10px] text-gray-500 truncate">{b.teksIndonesia}</p>
                                                                </div>
                                                                <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition shrink-0" />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Asmaul Husna Progress */}
                                        {memorized.length > 0 && (
                                            <div className="bg-white/5 border border-white/5 rounded-4xl p-6 shadow-xl">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles size={16} className="text-primary-2" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-primary-2">Hafalan Asmaul Husna</span>
                                                    </div>
                                                    <button onClick={() => setActiveTab("hafalan")} className="text-[10px] font-black text-gray-500 hover:text-white transition uppercase tracking-wider">
                                                        Detail →
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                        <span>Progress</span>
                                                        <span>{memorized.length}/99 · {Math.round((memorized.length / 99) * 100)}%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-linear-to-r from-primary to-primary-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${(memorized.length / 99) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {bookmarks.length === 0 && memorized.length === 0 && !lastRead && (
                                            <div className="text-center py-12 opacity-40">
                                                <Star size={48} className="mx-auto mb-4" />
                                                <p className="font-bold">Belum ada aktivitas.</p>
                                                <p className="text-sm mt-1">Mulai baca, bookmark konten, atau tandai hafalan Asmaul Husna.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── TAB: BOOKMARK ── */}
                                {activeTab === "bookmark" && (
                                    <div className="space-y-4">
                                        {/* Filter Kategori Bookmark */}
                                        {bookmarks.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                                                {categoryFilters.map((cat) => {
                                                    const count = cat.id === "all"
                                                        ? bookmarks.length
                                                        : bookmarks.filter(b => getBookmarkCategory(b) === cat.id).length;

                                                    if (count === 0 && cat.id !== "all") return null;

                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => setBookmarkFilter(cat.id)}
                                                            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                                                                bookmarkFilter === cat.id
                                                                    ? "bg-primary/20 border border-primary/30 text-primary-2 shadow-sm"
                                                                    : "bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                        >
                                                            {cat.label}
                                                            <span className="ml-1.5 text-[9px] opacity-60">({count})</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {bookmarks.length === 0 ? (
                                            <div className="text-center py-16 opacity-40">
                                                <Bookmark size={48} className="mx-auto mb-4" />
                                                <p className="font-bold">Belum ada bookmark.</p>
                                                <p className="text-sm mt-1">Tekan ikon bookmark pada surah, doa, hadits, maulid, dll untuk menyimpannya di sini.</p>
                                            </div>
                                        ) : filteredBookmarks.length === 0 ? (
                                            <div className="text-center py-12 opacity-40">
                                                <Bookmark size={40} className="mx-auto mb-3" />
                                                <p className="font-bold">Tidak ada bookmark di kategori ini.</p>
                                            </div>
                                        ) : (
                                            [...filteredBookmarks].reverse().map((b) => {
                                                const cat = getBookmarkCategory(b);
                                                const cfg = CATEGORY_CONFIG[cat];
                                                const key = getBookmarkKey(b);
                                                const displayTitle = b.title || `${b.surahName} : ${b.ayatNo}`;
                                                const targetUrl = b.url || (b.surahNo ? `/surah/${b.surahNo}` : "/");

                                                return (
                                                    <div key={key} className="bg-white/5 border border-white/5 rounded-4xl p-6 shadow-xl hover:border-white/10 hover:bg-white/10 transition-all duration-300">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`px-3 py-1 rounded-xl ${cfg.bg} ${cfg.border} border text-xs font-black ${cfg.text} shadow-sm shrink-0`}>
                                                                    {cfg.label}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black">{displayTitle}</p>
                                                                    {b.subtitle && (
                                                                        <p className="text-[10px] text-gray-400 mt-0.5">{b.subtitle}</p>
                                                                    )}
                                                                    {b.savedAt && (
                                                                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                                            <Clock size={10} />
                                                                            {new Date(b.savedAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteBookmark(b)}
                                                                disabled={deletingBookmark === key}
                                                                className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-gray-500 rounded-xl transition"
                                                                title="Hapus bookmark"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>

                                                        {b.teksArab && (
                                                            <p className="text-3xl text-right font-ayat leading-loose mb-4 text-white/90" dir="rtl">
                                                                {b.teksArab}
                                                            </p>
                                                        )}

                                                        {b.teksLatin && (
                                                            <p className="border-l-2 border-primary/30 pl-4 text-xs font-bold italic leading-relaxed text-primary-2 mb-3">
                                                                {b.teksLatin}
                                                            </p>
                                                        )}

                                                        {b.teksIndonesia && (
                                                            <p className="border-l-2 border-white/15 pl-4 text-sm leading-relaxed text-gray-300 mb-4">
                                                                {b.teksIndonesia}
                                                            </p>
                                                        )}

                                                        <div className="pt-3 border-t border-white/5">
                                                            <Link
                                                                href={targetUrl}
                                                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition w-fit"
                                                            >
                                                                <ExternalLink size={14} /> Buka {cfg.label}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {/* ── TAB: HAFALAN ASMAUL HUSNA ── */}
                                {activeTab === "hafalan" && (
                                    <div className="space-y-4">
                                        <div className="bg-white/5 border border-white/5 rounded-4xl p-6 shadow-xl">
                                            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                                                <span>Progress Hafalan</span>
                                                <span>{memorized.length}/99 · {Math.round((memorized.length / 99) * 100)}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-linear-to-r from-primary to-primary-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(memorized.length / 99) * 100}%` }} />
                                            </div>
                                        </div>

                                        {memorized.length === 0 ? (
                                            <div className="text-center py-16 opacity-40">
                                                <Sparkles size={48} className="mx-auto mb-4" />
                                                <p className="font-bold">Belum ada hafalan.</p>
                                                <p className="text-sm mt-1">Tandai nama yang sudah dihafal di halaman Asmaul Husna.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                {memorized.sort((a, b) => a - b).map((id) => (
                                                    <div key={id} className="flex flex-col items-center gap-1.5 p-3 bg-white/5 border border-white/5 rounded-3xl text-center">
                                                        <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                                            <Check size={14} className="text-primary-2" />
                                                        </div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase">{id}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <Link
                                            href="/asmaul-husna"
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-2xl text-sm font-bold text-primary-2 hover:text-white transition-all active:scale-95"
                                        >
                                            <Sparkles size={16} /> Lanjut Hafalan Asmaul Husna
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="mb-8" />
                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}

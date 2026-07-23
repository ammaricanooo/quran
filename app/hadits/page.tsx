"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    ArrowLeft, Search, BookOpen, Share2, Quote,
    ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const LIMIT = 20;

interface KitabInfo { name: string; slug: string; total: number; }
interface HaditsItem { number: number; arab: string; id: string; judul: string; }

// ─── Skeleton ────────────────────────────────────────────────────────────────
function HaditsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="w-full md:w-1/2 h-11 bg-white/8 rounded-xl animate-pulse ml-auto" />
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-4xl p-6 md:p-8 space-y-4"
                    style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/8 rounded-2xl animate-pulse shrink-0" />
                        <div className="h-5 w-48 bg-white/8 rounded-xl animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-7 w-full bg-white/8 rounded-xl animate-pulse" />
                        <div className="h-7 w-4/5 bg-white/8 rounded-xl animate-pulse ml-auto" />
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-white/5">
                        <div className="h-4 w-full bg-white/8 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-white/8 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-white/5">
                        <div className="h-8 w-24 bg-white/8 rounded-xl animate-pulse" />
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
        <div className="flex items-center justify-center gap-1 flex-wrap pt-2">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-30 transition"
            >
                <ChevronLeft size={16} />
            </button>

            {getRange().map((p, i) =>
                p === "…" ? (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-600 text-sm">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p as number)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-black transition ${
                            page === p
                                ? "bg-primary/20 border border-primary/30 text-primary-2"
                                : "bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onChange(page + 1)}
                disabled={page === pages}
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
    const [loading, setLoading]       = useState(true);
    const [kitabLoading, setKitabLoading] = useState(true);

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

    useEffect(() => { fetchHadits(); }, [fetchHadits]);

    // Reset halaman saat ganti kitab atau search
    const handleKitabChange = (slug: string) => {
        setActiveKitab(slug);
        setPage(1);
        setSearchQuery("");
        setSearchInput("");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearchQuery(searchInput);
    };

    const handleShare = (item: HaditsItem) => {
        const text = `📜 *${item.judul}*\n\n${item.arab}\n\nArtinya: "${item.id}"\n\n(${kitabName} No. ${item.number})\n\nSumber: Al-Qur'an Ku`;
        if (navigator.share) {
            navigator.share({ title: item.judul, text });
        } else {
            navigator.clipboard.writeText(text);
            alert("Hadits berhasil disalin!");
        }
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
                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-primary-2 uppercase">
                            {totalHadits.toLocaleString()} Hadits
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-5">

                        {/* ── FILTER KITAB ── */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                            {kitabLoading
                                ? Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-8 w-24 bg-white/8 rounded-xl animate-pulse shrink-0" />
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

                        {/* ── SEARCH ── */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="Cari judul, terjemahan, atau nomor..."
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:bg-white/10 transition-all text-sm"
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-xs font-black text-primary-2 transition-all active:scale-95 shrink-0"
                            >
                                Cari
                            </button>
                        </form>

                        {/* ── INFO BAR ── */}
                        {searchQuery && (
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Hasil pencarian: <strong className="text-white">"{searchQuery}"</strong> — {totalHadits} ditemukan</span>
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
                                {haditsList.map((item) => (
                                    <div
                                        key={`${activeKitab}-${item.number}`}
                                        className="group p-6 md:p-8 rounded-4xl bg-white/5 border border-white/5 relative overflow-hidden"
                                    >
                                        {/* Nomor + judul */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-2 flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20 shrink-0">
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
                                        <div className="space-y-1 border-l-2 border-primary/30 pl-4 py-1 mb-6">
                                            <p className="text-[10px] font-black text-primary-2 uppercase tracking-widest mb-1">Terjemahan</p>
                                            <p className="text-sm text-gray-300 leading-relaxed text-justify">{item.id}</p>
                                        </div>

                                        {/* Action row */}
                                        <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => handleShare(item)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-primary-2 transition"
                                            >
                                                <Share2 size={14} />
                                                <span className="hidden md:flex">Bagikan</span>
                                            </button>
                                        </div>

                                        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                                            <BookOpen size={120} />
                                        </div>
                                    </div>
                                ))}

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
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(""); setSearchInput(""); }}
                                        className="mt-4 text-primary-2 text-sm font-bold hover:underline"
                                    >
                                        Hapus pencarian
                                    </button>
                                )}
                            </div>
                        )}

                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}

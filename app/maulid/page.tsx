"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonMaulidGrid } from "@/components/Skeleton";
import type { MaulidBook } from "@/app/api/proxy-maulid/route";

export default function MaulidPage() {
  const [books, setBooks] = useState<MaulidBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/proxy-maulid")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((json) => { setBooks(json.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <>
      <Navbar />
      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* ── HEADER ── */}
        <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
          <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition"
                aria-label="Kembali ke beranda"
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl md:text-2xl font-black">
                Kumpulan <span className="text-primary-2">Maulid</span>
              </h1>
            </div>
            {books.length > 0 && (
              <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-primary-2 uppercase tracking-wider">
                {books.length} Kitab
              </div>
            )}
          </header>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <SkeletonMaulidGrid count={6} />
            ) : error ? (
              <p className="py-16 text-center text-gray-400">
                Daftar maulid belum dapat dimuat. Coba lagi nanti.
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {books.map((book, index) => (
                  <Link
                    key={book.slug}
                    href={`/maulid/${book.slug}`}
                    className="rounded-4xl border border-white/5 bg-white/5 p-6 transition-all hover:border-white/10 hover:bg-white/10 shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary-2">
                        <BookOpen size={20} />
                      </div>
                      <span className="text-xs font-bold text-primary-2">
                        {book.count} Bacaan
                      </span>
                    </div>
                    <h2 className="mt-5 text-lg font-bold">
                      {index + 1}. {book.name}
                    </h2>
                  </Link>
                ))}
              </div>
            )}
            <div className="mb-8" />
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
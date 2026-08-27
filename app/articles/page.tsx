"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonArticleGrid } from "@/components/Skeleton";

interface Article {
  id: number;
  title: string;
  slug: string;
  image?: { thumbnail?: string; caption?: string };
  category?: { name: string };
  published_at: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/proxy-articles")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((json) => { setArticles(Array.isArray(json.data) ? json.data : json.data?.data ?? []); setLoading(false); })
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
                Artikel <span className="text-primary-2">NU</span>
              </h1>
            </div>
            {articles.length > 0 && (
              <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-primary-2 uppercase tracking-wider">
                {articles.length} Artikel
              </div>
            )}
          </header>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <SkeletonArticleGrid count={6} />
            ) : error ? (
              <p className="py-16 text-center text-gray-400">
                Artikel belum dapat dimuat. Coba lagi nanti.
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="group overflow-hidden rounded-4xl border border-white/5 bg-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/10 shadow-xl"
                  >
                    {article.image?.thumbnail ? (
                      <img
                        src={article.image.thumbnail}
                        alt={article.image.caption || article.title}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-white/5 text-primary-2">
                        <Newspaper size={36} />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-2">
                        {article.category?.name || "NU Online"}
                      </p>
                      <h2 className="mt-2 line-clamp-2 text-lg font-bold">
                        {article.title}
                      </h2>
                      <time className="mt-4 block text-xs text-gray-500">
                        {new Date(article.published_at).toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })}
                      </time>
                    </div>
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
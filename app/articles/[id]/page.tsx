"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Newspaper } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface ArticleDetail {
  title: string;
  content: string;
  url?: string;
  image?: { full?: string; caption?: string };
  category?: { name: string };
  published_at: string;
}

interface ArticleListItem {
  id: number;
  title: string;
  image?: { thumbnail?: string; caption?: string };
  category?: { name: string };
  published_at: string;
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [currentId, setCurrentId] = useState<string>("");
  const [otherArticles, setOtherArticles] = useState<ArticleListItem[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setCurrentId(id);
      fetch(`/api/proxy-articles/${id}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((json) => setArticle(json.data))
        .catch(() => setError(true));
    });
  }, [params]);

  useEffect(() => {
    fetch("/api/proxy-articles")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((json) => {
        const all: ArticleListItem[] = Array.isArray(json.data)
          ? json.data
          : json.data?.data ?? [];
        setOtherArticles(all.filter((a) => String(a.id) !== currentId).slice(0, 8));
      })
      .catch(() => {});
  }, [currentId]);

  return (
    <>
      <Navbar />
      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* ── HEADER ── */}
        <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
          <header className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <Link
              href="/articles"
              className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition"
              aria-label="Kembali ke artikel"
            >
              <ArrowLeft size={18} />
            </Link>
            {article?.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition"
                aria-label="Buka sumber asli"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </header>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-6xl mx-auto">
            {error ? (
              <p className="py-16 text-center text-gray-400">
                Artikel belum dapat dimuat. Coba lagi nanti.
              </p>
            ) : !article ? (
              <div className="h-96 animate-pulse rounded-3xl bg-white/5" />
            ) : (
              <div className="flex gap-8 items-start">
                {/* ── MAIN ARTICLE ── */}
                <article className="min-w-0 flex-1">
                  {article.image?.full && (
                    <img
                      src={article.image.full}
                      alt={article.image.caption || article.title}
                      className="mb-8 max-h-96 w-full rounded-3xl object-cover"
                    />
                  )}
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-2">
                    {article.category?.name || "NU Online"}
                  </p>
                  <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                    {article.title}
                  </h1>
                  <time className="mt-4 block text-xs text-gray-500">
                    {new Date(article.published_at).toLocaleDateString("id-ID", {
                      dateStyle: "long",
                    })}
                  </time>
                  <div
                    className="prose prose-invert mt-8 max-w-none text-gray-300 leading-relaxed
                      [&_p]:mb-6 [&_p+p]:mt-0
                      [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-white
                      [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-bold [&_h3]:text-white
                      [&_ul]:mb-6 [&_ol]:mb-6
                      [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </article>

                {/* ── SIDEBAR: ARTIKEL LAIN ── */}
                {otherArticles.length > 0 && (
                  <aside className="hidden xl:flex w-72 shrink-0 flex-col gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Artikel Lainnya
                    </h2>
                    {otherArticles.map((other) => (
                      <Link
                        key={other.id}
                        href={`/articles/${other.id}`}
                        className="flex gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 transition-all duration-300 hover:border-white/10 hover:bg-white/10"
                      >
                        {other.image?.thumbnail ? (
                          <img
                            src={other.image.thumbnail}
                            alt={other.title}
                            className="h-16 w-20 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary-2">
                            <Newspaper size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-wider text-primary-2">
                            {other.category?.name || "NU Online"}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs font-bold leading-snug">
                            {other.title}
                          </p>
                          <time className="mt-2 block text-[9px] text-gray-600">
                            {new Date(other.published_at).toLocaleDateString("id-ID", {
                              dateStyle: "medium",
                            })}
                          </time>
                        </div>
                      </Link>
                    ))}
                  </aside>
                )}
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
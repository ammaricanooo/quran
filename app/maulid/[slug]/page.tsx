"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { SkeletonMaulidReadings } from "@/components/Skeleton";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BookmarkItem } from "@/lib/bookmark-types";
import { shareOrCopy } from "@/lib/share-utils";
import type { MaulidReading } from "@/app/api/proxy-maulid/[slug]/route";

export default function MaulidDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [title, setTitle] = useState("Bacaan Maulid");
  const [readings, setReadings] = useState<MaulidReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [rawBookmarks, setRawBookmarks] = useState<BookmarkItem[]>([]);
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ slug: currentSlug }) => {
      setSlug(currentSlug);
      fetch(`/api/proxy-maulid/${currentSlug}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((json) => {
          setTitle(json.data.title);
          setReadings(json.data.readings);
          setLoading(false);
        })
        .catch(() => { setError(true); setLoading(false); });
    });
  }, [params]);

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

  const isReadingBookmarked = (reading: MaulidReading, index: number) => {
    const key = `maulid-${slug}-${reading.id || index + 1}`;
    return rawBookmarks.some(
      (b) => b.id === key || (b.category === "maulid" && b.title === `${title} - ${reading.title}`)
    );
  };

  const handleToggleBookmark = async (reading: MaulidReading, index: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const key = `maulid-${slug}-${reading.id || index + 1}`;
    const existing = rawBookmarks.find(
      (b) => b.id === key || (b.category === "maulid" && b.title === `${title} - ${reading.title}`)
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
          category: "maulid",
          title: `${title} - ${reading.title}`,
          subtitle: `Bait ke-${index + 1}`,
          teksArab: reading.arabic,
          teksLatin: reading.transliteration,
          teksIndonesia: reading.translation || "",
          url: `/maulid/${slug}`,
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
      console.error("Gagal mengubah bookmark maulid:", err);
    } finally {
      setBookmarkingId(null);
    }
  };

  const handleShare = (reading: MaulidReading) => {
    shareOrCopy(
      {
        title: `${title} - ${reading.title}`,
        arab: reading.arabic,
        latin: reading.transliteration,
        translation: reading.translation,
        extra: `Kitab Maulid: ${title}`,
      },
      "Bacaan Maulid berhasil disalin!"
    );
  };

  return (
    <>
      <Navbar />
      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* ── HEADER ── */}
        <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
          <header className="max-w-5xl mx-auto w-full flex items-center gap-3">
            <Link
              href="/maulid"
              className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition"
              aria-label="Kembali ke daftar maulid"
            >
              <ArrowLeft size={18} />
            </Link>
            {(() => {
              const words = title.trim().split(" ");
              const prefix = words.length > 1 ? words.slice(0, -1).join(" ") : "Maulid";
              const suffix = words.length > 1 ? words.slice(-1).join(" ") : words[0];
              return (
                <h1 className="text-xl md:text-2xl font-black line-clamp-1">
                  {prefix} <span className="text-primary-2">{suffix}</span>
                </h1>
              );
            })()}
          </header>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <SkeletonMaulidReadings count={4} />
            ) : error ? (
              <p className="py-16 text-center text-gray-400">
                Bacaan maulid belum dapat dimuat. Coba lagi nanti.
              </p>
            ) : (
              <div className="space-y-6">
                {readings.map((reading, index) => {
                  const key = `maulid-${slug}-${reading.id || index + 1}`;
                  const bookmarked = isReadingBookmarked(reading, index);
                  return (
                    <article
                      key={reading.id || index}
                      className="rounded-4xl border border-white/5 bg-white/5 p-5 md:p-7 transition-all hover:border-white/10 hover:bg-white/10 shadow-xl"
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-t from-primary to-primary-2 flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20 shrink-0">
                          {index + 1}
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-wider">{reading.title}</h2>
                      </div>
                      <p dir="rtl" className="font-ayat text-3xl leading-loose md:text-4xl">
                        {reading.arabic}
                      </p>
                      {reading.transliteration && (
                        <p className="mt-5 border-l-2 border-primary/30 pl-4 text-sm font-bold italic leading-relaxed text-primary-2 mb-3">
                          {reading.transliteration}
                        </p>
                      )}
                      {reading.translation && (
                        <p className="border-l-2 border-white/15 pl-4 text-sm leading-relaxed text-gray-300">
                          {reading.translation}
                        </p>
                      )}

                      {/* Action Row */}
                      <div className="flex items-center gap-2 pt-5 mt-5 border-t border-white/5">
                        <button
                          onClick={() => handleToggleBookmark(reading, index)}
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
                          onClick={() => handleShare(reading)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                        >
                          <Share2 size={14} />
                          <span className="hidden md:flex">Bagikan</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
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
        description="Silakan login dengan Google untuk menyimpan bacaan maulid ke bookmark profil Anda."
      />
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { tahlilData, TahlilSection } from "@/lib/tahlil/tahlil-data";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BookmarkItem } from "@/lib/bookmark-types";
import { shareOrCopy } from "@/lib/share-utils";

export default function TahlilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [rawBookmarks, setRawBookmarks] = useState<BookmarkItem[]>([]);
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

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

  const isSectionBookmarked = (section: TahlilSection) => {
    const key = `tahlil-${section.id}`;
    return rawBookmarks.some(
      (b) => b.id === key || (b.category === "tahlil" && b.title === section.title)
    );
  };

  const handleToggleBookmark = async (section: TahlilSection, index: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const key = `tahlil-${section.id}`;
    const existing = rawBookmarks.find(
      (b) => b.id === key || (b.category === "tahlil" && b.title === section.title)
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
          category: "tahlil",
          title: section.title,
          subtitle: `Bacaan ke-${index + 1}`,
          teksArab: section.arabic,
          teksLatin: section.latin,
          teksIndonesia: section.translation,
          url: "/tahlil",
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
      console.error("Gagal mengubah bookmark tahlil:", err);
    } finally {
      setBookmarkingId(null);
    }
  };

  const handleShare = (section: TahlilSection) => {
    shareOrCopy(
      {
        title: `Tahlil: ${section.title}`,
        arab: section.arabic,
        latin: section.latin,
        translation: section.translation,
        extra: "Bacaan Tahlil & Doa Arwah",
      },
      "Bacaan Tahlil berhasil disalin!"
    );
  };

  const sections = tahlilData.sections;

  return (
    <>
      <Navbar />
      <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
        {/* ── HEADER ── */}
        <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
          <header className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl md:text-2xl font-black">
                Bacaan <span className="text-primary-2">Tahlil</span>
              </h1>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-primary-2 uppercase tracking-wider">
              {sections.length} Bacaan
            </div>
          </header>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Card Info */}
            <div className="relative overflow-hidden bg-linear-to-br from-primary/20 to-primary-2/20 border border-primary-2/30 p-8 rounded-4xl shadow-2xl">
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-3xl font-black mb-1">Tahlil Lengkap</h2>
                <p className="text-sm text-gray-400 mb-4">Doa &amp; Bacaan Khusus Arwah</p>
                <div className="h-px w-full max-w-xs bg-white/10 mb-4"></div>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-primary-2">
                  <span>{sections.length} Susunan Bacaan</span>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-ayat select-none pointer-events-none">لا إله إلا الله</div>
            </div>

            {/* List Bacaan Tahlil */}
            <div className="space-y-6">
              {sections.map((section: TahlilSection, index: number) => {
                const key = `tahlil-${section.id}`;
                const bookmarked = isSectionBookmarked(section);

                return (
                  <div
                    key={section.id}
                    className="group p-6 rounded-4xl transition-all duration-300 border bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 shadow-xl"
                  >
                    {/* ── Top row: Number + Title ── */}
                    <div className="flex justify-between items-center gap-4 mb-6">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-t from-primary to-primary-2 flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20 shrink-0">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest grow">
                        {section.title}
                      </h3>
                    </div>

                    {/* ── Arabic text ── */}
                    <p className="text-4xl text-right font-ayat leading-18 mb-6" dir="rtl">
                      {section.arabic}
                    </p>

                    {/* ── Latin + Translation (separate border-left lines) ── */}
                    <p className="border-l-2 border-primary/30 pl-4 text-sm font-bold italic leading-relaxed text-primary-2 mb-3">
                      {section.latin}
                    </p>
                    <p className="border-l-2 border-white/15 pl-4 text-sm leading-relaxed text-gray-300">
                      {section.translation}
                    </p>

                    {/* ── Action buttons ── */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleToggleBookmark(section, index)}
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
                          onClick={() => handleShare(section)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                        >
                          <Share2 size={14} />
                          <span className="hidden md:flex">Bagikan</span>
                        </button>
                      </div>
                  </div>
                );
              })}
            </div>
            <div className="mb-8" />
            <Footer />
          </div>
        </div>
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Diperlukan"
        description="Silakan login dengan Google untuk menyimpan bacaan tahlil ke bookmark profil Anda."
      />
    </>
  );
}

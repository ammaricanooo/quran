"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { tahlilData, TahlilSection } from "@/lib/tahlil/tahlil-data";

export default function TahlilPage() {
  const handleShare = async (section: TahlilSection) => {
    const text = `${section.title}\n\nArab:\n${section.arabic}\n\nLatin:\n${section.latin}\n\nTerjemahan:\n${section.translation}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bacaan Tahlil",
          text: text,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
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
              <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl md:text-3xl font-black text-center">
                Bacaan <span className="text-primary">Tahlil</span>
              </h1>
            </div>
          </header>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-8">
          <div className="max-w-5xl mx-auto">
            {/* Card Info */}
            <div className="relative overflow-hidden bg-linear-to-br from-primary to-secondary p-8 rounded-4xl mb-10 shadow-2xl">
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold mb-1">Tahlil</h2>
                <p className="text-lg opacity-90 mb-4">Bacaan untuk Arwah</p>
                <div className="h-px w-full max-w-50 bg-white/30 mb-4"></div>
                <div className="flex gap-4 text-sm font-medium uppercase tracking-widest">
                  <span>{sections.length} Bacaan</span>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-ayat select-none">لا إله إلا الله</div>
              </div>
            </div>

            {/* List Bacaan Tahlil */}
            <div className="space-y-6">
              {sections.map((section: TahlilSection, index: number) => {
                return (
                  <div
                    key={section.id}
                    className="group p-6 rounded-4xl transition-all duration-500 border bg-white/5 border-transparent hover:border-white/10"
                  >
                    <div className="flex flex-col gap-6">
                      {/* ── Top row: Number + Title ── */}
                      <div className="flex justify-between items-center gap-4">
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
                      <p className="text-4xl text-right font-ayat leading-18" dir="rtl">
                        {section.arabic}
                      </p>

                      {/* ── Latin + Translation (border-left style) ── */}
                      <div className="space-y-2 border-l-2 border-primary/30 pl-4 py-1">
                        <p className="font-bold italic tracking-wide">{section.latin}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{section.translation}</p>
                      </div>

                      {/* ── Action buttons ── */}
                      <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleShare(section)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-primary-2 transition"
                        >
                          <ExternalLink size={14} />
                          <span className="hidden md:flex">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

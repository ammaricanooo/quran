import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuis Qur'an Interaktif - Tebak Surah & Sambung Ayat | Al-Qur'an Ku",
  description: "Mainkan kuis Qur'an interaktif: tebak surah, sambung ayat, dan multiplayer. Uji pengetahuan Anda tentang Al-Qur'an dengan cara yang menyenangkan.",
  keywords: [
    "kuis Qur'an",
    "game Al-Qur'an",
    "tebak surah",
    "sambung ayat",
    "kuis Islam",
    "permainan edukasi",
    "belajar Quran dengan game"
  ],
  alternates: {
    canonical: "https://quran.ammaricano.my.id/game"
  },
  openGraph: {
    title: "Kuis Qur'an Interaktif | Al-Qur'an Ku",
    description: "Mainkan kuis Qur'an interaktif: tebak surah, sambung ayat, dan multiplayer.",
    url: "https://quran.ammaricano.my.id/game",
    type: "website"
  }
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
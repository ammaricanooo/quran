import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuis Qur'an Interaktif - Tebak Surah & Sambung Ayat | Al-Qur'an Ku",
  description: "Mainkan kuis Qur'an interaktif: tebak surah, sambung ayat, dan mode multiplayer. Uji dan latih hafalan Al-Qur'an Anda dengan cara yang seru dan menyenangkan.",
  keywords: [
    "kuis Qur'an",
    "game Al-Qur'an",
    "tebak surah",
    "sambung ayat",
    "kuis Islam",
    "permainan edukasi",
    "belajar Quran dengan game",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/game"
  },
  openGraph: {
    title: "Kuis Qur'an Interaktif | Al-Qur'an Ku",
    description: "Mainkan kuis Qur'an interaktif: tebak surah, sambung ayat, dan multiplayer.",
    url: "https://quran.ammaricano.my.id/game",
    type: "website",
    siteName: "Al-Qur'an Ku"
  }
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
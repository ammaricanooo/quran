import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dzikir Pagi Petang & Wirid Lengkap Bacaan Arab Latin | Al-Qur'an Ku",
  description: "Bacaan dzikir pagi dan petang lengkap dari Al-Qur'an dan Sunnah. Dilengkapi tulisan Arab, Latin, artinya, dan keutamaan dzikir.",
  keywords: [
    "dzikir",
    "dzikir pagi",
    "dzikir petang",
    "wirid",
    "dzikir setelah sholat",
    "bacaan dzikir",
    "dzikir lengkap",
    "dzikir islam"
  ],
  alternates: {
    canonical: "https://quran-ku.vercel.app/dzikir"
  },
  openGraph: {
    title: "Dzikir Pagi Petang & Wirid Lengkap | Al-Qur'an Ku",
    description: "Bacaan dzikir pagi dan petang lengkap dari Al-Qur'an dan Sunnah dengan terjemahan.",
    url: "https://quran-ku.vercel.app/dzikir",
    type: "website"
  }
};

export default function DzikirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
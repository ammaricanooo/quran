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
    "dzikir islam",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/dzikir"
  },
  openGraph: {
    title: "Dzikir Pagi Petang & Wirid Lengkap | Al-Qur'an Ku",
    description: "Bacaan dzikir pagi dan petang lengkap dari Al-Qur'an dan Sunnah dengan terjemahan.",
    url: "https://quran.ammaricano.my.id/dzikir",
    type: "website",
    siteName: "Al-Qur'an Ku"
  }
};

export default function DzikirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
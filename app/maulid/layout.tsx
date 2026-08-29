import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kumpulan Maulid Arab, Latin dan Terjemah | Al-Qur'an Ku",
  description: "Baca kumpulan maulid lengkap: Maulid Simtudduror, Barzanji, Diba'i, Dhiyaul Lami' dengan teks Arab, transliterasi Latin, dan terjemahan Bahasa Indonesia.",
  keywords: [
    "maulid nabi",
    "maulid simtudduror",
    "maulid barzanji",
    "maulid dibai",
    "maulid dhiyaullami",
    "bacaan maulid arab latin",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: { canonical: "https://quran.ammaricano.my.id/maulid" },
  openGraph: {
    title: "Kumpulan Maulid Arab, Latin dan Terjemah | Al-Qur'an Ku",
    description: "Kumpulan bacaan maulid lengkap dengan Arab, Latin, dan terjemah.",
    url: "https://quran.ammaricano.my.id/maulid",
    type: "website",
    siteName: "Al-Qur'an Ku"
  },
};

export default function MaulidLayout({ children }: { children: React.ReactNode }) {
  return children;
}
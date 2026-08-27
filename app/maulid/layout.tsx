import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kumpulan Maulid Arab, Latin dan Terjemah | Al-Qur'an Ku",
  description: "Baca kumpulan maulid lengkap dengan teks Arab, transliterasi Latin, dan terjemahan Bahasa Indonesia.",
  alternates: { canonical: "https://quran.ammaricano.my.id/maulid" },
  openGraph: {
    title: "Kumpulan Maulid Arab, Latin dan Terjemah | Al-Qur'an Ku",
    description: "Kumpulan bacaan maulid lengkap dengan Arab, Latin, dan terjemah.",
    url: "https://quran.ammaricano.my.id/maulid",
    type: "website",
  },
};

export default function MaulidLayout({ children }: { children: React.ReactNode }) {
  return children;
}
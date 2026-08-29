import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baca Al-Qur'an 30 Juz Lengkap dengan Terjemahan | Al-Qur'an Ku",
  description: "Daftar bacaan Al-Qur'an lengkap 30 Juz: dari Juz 1 (Al-Fatihah) hingga Juz 30 (Juz Amma) dengan teks Arab, Latin, terjemahan Indonesia, dan audio murottal.",
  keywords: [
    "Al Quran 30 juz",
    "baca quran per juz",
    "juz amma",
    "juz 1 sampai 30",
    "quran digital indonesia",
    "terjemahan per juz",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/juz"
  },
  openGraph: {
    title: "Baca Al-Qur'an 30 Juz Lengkap | Al-Qur'an Ku",
    description: "Bacaan Al-Qur'an per juz lengkap 30 Juz dengan teks Arab, Latin, dan terjemahan Indonesia.",
    url: "https://quran.ammaricano.my.id/juz",
    type: "website",
    siteName: "Al-Qur'an Ku"
  }
};

export default function JuzLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hadits Nabi Lengkap 9 Imam Kutubus Sittah Terjemahan | Al-Qur'an Ku",
  description: "Kumpulan hadits Nabi Muhammad SAW lengkap dari 9 kitab imam besar: Bukhari, Muslim, Tirmidzi, Abu Dawud, Nasai, Ibnu Majah, Ahmad, Malik, dan Darimi.",
  keywords: [
    "hadits",
    "hadits Nabi",
    "hadits shahih",
    "hadits Bukhari",
    "hadits Muslim",
    "hadits Tirmidzi",
    "hadits Abu Dawud",
    "kumpulan hadits 9 imam",
    "riwayat hadits",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/hadits"
  },
  openGraph: {
    title: "Hadits Nabi Lengkap 9 Kitab Imam | Al-Qur'an Ku",
    description: "Kumpulan hadits Nabi Muhammad SAW lengkap dengan sanad dan terjemahan bahasa Indonesia.",
    url: "https://quran.ammaricano.my.id/hadits",
    type: "website",
    siteName: "Al-Qur'an Ku"
  }
};

export default function HaditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
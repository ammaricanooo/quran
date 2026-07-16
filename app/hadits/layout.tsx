import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hadits Nabi Lengkap 4 Kutub dengan Terjemahan | Al-Qur'an Ku",
  description: "Kumpulan hadits Nabi Muhammad SAW lengkap dari 4 kitab: Bukhari, Muslim, Tirmidzi, Abu Dawud, dan lainnya. Lengkap dengan sanad dan artinya.",
  keywords: [
    "hadits",
    "hadits Nabi",
    "hadits shahih",
    "hadits Bukhari",
    "hadits Muslim",
    "hadits Tirmidzi",
    "hadits Abu Dawud",
    "kumpulan hadits",
    "riwayat hadits"
  ],
  alternates: {
    canonical: "https://quran-ku.vercel.app/hadits"
  },
  openGraph: {
    title: "Hadits Nabi Lengkap 4 Kutub | Al-Qur'an Ku",
    description: "Kumpulan hadits Nabi Muhammad SAW lengkap dari 4 kitab dengan terjemahan.",
    url: "https://quran-ku.vercel.app/hadits",
    type: "website"
  }
};

export default function HaditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
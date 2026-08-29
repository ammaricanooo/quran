import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Sholat Hari Ini - Waktu Shalat Akurat Berdasarkan Lokasi | Al-Qur'an Ku",
  description: "Cek jadwal sholat hari ini untuk wilayah Anda. Waktu shalat akurat: Subuh, Dzuhur, Ashar, Maghrib, dan Isya berdasarkan lokasi GPS Anda.",
  keywords: [
    "jadwal sholat",
    "jadwal shalat",
    "waktu sholat",
    "waktu shalat hari ini",
    "jadwal imsakiyah",
    "waktu subuh",
    "waktu dzuhur",
    "waktu ashar",
    "waktu maghrib",
    "waktu isya",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/jadwal"
  },
  openGraph: {
    title: "Jadwal Sholat Hari Ini | Al-Qur'an Ku",
    description: "Cek jadwal sholat hari ini untuk wilayah Anda. Waktu shalat akurat berdasarkan lokasi.",
    url: "https://quran.ammaricano.my.id/jadwal",
    type: "website",
    siteName: "Al-Qur'an Ku"
  }
};

export default function JadwalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
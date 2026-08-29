import { Metadata } from "next";

export function generateHomePageMetadata(): Metadata {
  return {
    title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap Indonesia | Ammar Abdul Malik",
    description: "Aplikasi Al-Qur'an digital Indonesia terlengkap karya Ammar Abdul Malik: baca 114 Surah, 30 Juz, doa harian, jadwal sholat akurat, hadits 9 imam, asmaul husna, dzikir, tahlil, maulid, dan kuis Quran. Gratis!",
    keywords: [
      "Ammar Abdul Malik",
      "Ammar Abdul Malik Quran",
      "Ammaricano",
      "Al-Qur'an Ku",
      "Al-Qur'an digital",
      "aplikasi Al-Qur'an",
      "Qur'an online Indonesia",
      "baca Quran lengkap 30 juz",
      "doa harian Islam lengkap",
      "jadwal sholat akurat",
      "kuis Qur'an interaktif",
      "hadits Nabi lengkap",
      "dzikir pagi petang",
      "tahlil bacaan lengkap",
      "asmaul husna indonesia"
    ],
    authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
    creator: "Ammar Abdul Malik",
    publisher: "Ammar Abdul Malik",
    alternates: {
      canonical: "https://quran.ammaricano.my.id"
    },
    openGraph: {
      title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap Indonesia | Ammar Abdul Malik",
      description: "Baca Al-Qur'an lengkap 114 surah dengan terjemahan Indonesia & audio murottal, doa harian, jadwal sholat, hadits, dan fitur Islami lainnya karya Ammar Abdul Malik.",
      url: "https://quran.ammaricano.my.id",
      type: "website",
      siteName: "Al-Qur'an Ku"
    }
  };
}
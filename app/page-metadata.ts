import { Metadata } from "next";

export function generateHomePageMetadata(): Metadata {
  return {
    title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap Indonesia",
    description: "Aplikasi Al-Qur'an digital Indonesia lengkap: baca Quran 114 surah, doa harian, jadwal sholat, kuis, tahlil, hadits, dzikir, dan kiblat finder. Gratis!",
    keywords: [
      "Al-Qur'an digital",
      "aplikasi Al-Qur'an",
      "Qur'an online Indonesia",
      "baca Quran lengkap",
      "doa harian Islam",
      "jadwal sholat akurat",
      "kuis Qur'an interaktif",
      "hadits Nabi lengkap",
      "dzikir pagi petang",
      "tahlil bacaan lengkap"
    ],
    alternates: {
      canonical: "https://quran.ammaricano.my.id"
    },
    openGraph: {
      title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap",
      description: "Baca Al-Qur'an lengkap 114 surah dengan terjemahan, doa harian, jadwal sholat, kuis interaktif, dan fitur Islami lainnya.",
      url: "https://quran.ammaricano.my.id",
      type: "website"
    }
  };
}
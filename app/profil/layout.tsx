import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Pengguna, Bookmark & Progres Hafalan | Al-Qur'an Ku",
  description: "Kelola profil akun, simpan penanda terakhir dibaca (bookmark surah, doa, hadits), serta pantau progres hafalan Asmaul Husna di Al-Qur'an Ku.",
  keywords: [
    "profil quran",
    "bookmark quran",
    "terakhir dibaca",
    "hafalan asmaul husna",
    "progres baca quran",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/profil"
  },
  openGraph: {
    title: "Profil Pengguna & Bookmark | Al-Qur'an Ku",
    description: "Kelola profil akun, riwayat bacaan terakhir, dan progres hafalan di Al-Qur'an Ku.",
    url: "https://quran.ammaricano.my.id/profil",
    type: "website",
    siteName: "Al-Qur'an Ku"
  }
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

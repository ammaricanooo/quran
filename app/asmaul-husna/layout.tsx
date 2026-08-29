import { Metadata } from "next";

export const metadata: Metadata = {
  title: "99 Asmaul Husna Arab, Latin, Arti & Makna Lengkap | Al-Qur'an Ku",
  description: "Daftar lengkap 99 Asmaul Husna (Nama-Nama Indah Allah SWT) tulisan Arab, transliterasi Latin, arti bahasa Indonesia, dan keutamaan mengamalkannya.",
  keywords: [
    "asmaul husna",
    "99 asmaul husna",
    "nama nama allah",
    "asmaul husna arab latin",
    "arti asmaul husna",
    "makna 99 nama allah",
    "hafalan asmaul husna",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/asmaul-husna"
  },
  openGraph: {
    title: "99 Asmaul Husna Arab, Latin & Arti Lengkap | Al-Qur'an Ku",
    description: "Daftar 99 Asmaul Husna lengkap dengan teks Arab, Latin, dan arti bahasa Indonesia.",
    url: "https://quran.ammaricano.my.id/asmaul-husna",
    type: "website",
    siteName: "Al-Qur'an Ku"
  }
};

export default function AsmaulHusnaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

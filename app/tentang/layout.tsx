import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Ammar Abdul Malik & Al-Qur'an Ku - Profil Pengembang",
  description: "Profil pengembang Al-Qur'an Ku, Ammar Abdul Malik (Ammaricano). Mengenal visi, misi, teknologi, dan dedikasi di balik platform Al-Qur'an digital terlengkap Indonesia.",
  keywords: [
    "Ammar Abdul Malik",
    "Ammaricano",
    "Ammar Abdul Malik Web Developer",
    "Ammar Abdul Malik Al Quran",
    "Pengembang Al-Qur'an Ku",
    "Profil Ammar Abdul Malik",
    "Creator Al-Qur'an Ku",
    "Aplikasi Quran Indonesia",
    "Tentang Al-Qur'an Ku"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: {
    canonical: "https://quran.ammaricano.my.id/tentang"
  },
  openGraph: {
    title: "Tentang Ammar Abdul Malik & Al-Qur'an Ku",
    description: "Profil pengembang Al-Qur'an Ku, Ammar Abdul Malik (Ammaricano). Platform Al-Qur'an digital terlengkap dan gratis untuk seluruh umat muslim.",
    url: "https://quran.ammaricano.my.id/tentang",
    type: "profile",
    locale: "id_ID",
    siteName: "Al-Qur'an Ku"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Ammar Abdul Malik & Al-Qur'an Ku",
    description: "Profil pengembang Al-Qur'an Ku, Ammar Abdul Malik (Ammaricano).",
    creator: "@ammaricano"
  }
};

export default function TentangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

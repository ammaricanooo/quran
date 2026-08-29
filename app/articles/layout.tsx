import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artikel & Wawasan Keislaman Terkini | Al-Qur'an Ku",
  description: "Baca artikel, kajian Islam, fiqih, dan wawasan keislaman terkini dari NU Online terintegrasi di Al-Qur'an Ku.",
  keywords: [
    "artikel islam",
    "kajian islam",
    "artikel nu online",
    "berita islam",
    "khutbah jumat",
    "Al-Qur'an Ku",
    "Ammar Abdul Malik"
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  alternates: { canonical: "https://quran.ammaricano.my.id/articles" },
  openGraph: {
    title: "Artikel & Wawasan Keislaman Terkini | Al-Qur'an Ku",
    description: "Berita dan wawasan terkini dari NU Online di Al-Qur'an Ku.",
    url: "https://quran.ammaricano.my.id/articles",
    type: "website",
    siteName: "Al-Qur'an Ku"
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
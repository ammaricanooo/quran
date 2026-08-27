import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artikel NU Terkini | Al-Qur'an Ku",
  description: "Baca berita dan wawasan terkini dari NU Online.",
  alternates: { canonical: "https://quran.ammaricano.my.id/articles" },
  openGraph: {
    title: "Artikel NU Terkini | Al-Qur'an Ku",
    description: "Berita dan wawasan terkini dari NU Online.",
    url: "https://quran.ammaricano.my.id/articles",
    type: "website",
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
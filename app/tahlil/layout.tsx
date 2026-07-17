import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tahlil Lengkap Bacaan Arab Latin & Artinya | Al-Qur'an Ku",
  description: "Teks tahlil lengkap untuk almarhum dengan tulisan Arab, Latin, dan terjemahan Indonesia. Bacaan tahlil lengkap untuk wirid dan doa.",
  keywords: [
    "tahlil",
    "bacaan tahlil",
    "tahlil lengkap",
    "tahlil untuk orang meninggal",
    "tahlil arab latin",
    "doa tahlil"
  ],
  alternates: {
    canonical: "https://quran.ammaricano.my.id/tahlil"
  },
  openGraph: {
    title: "Tahlil Lengkap Bacaan Arab Latin | Al-Qur'an Ku",
    description: "Teks tahlil lengkap untuk almarhum dengan tulisan Arab, Latin, dan terjemahan Indonesia.",
    url: "https://quran.ammaricano.my.id/tahlil",
    type: "website"
  }
};

export default function TahlilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
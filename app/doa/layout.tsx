import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doa Harian Islam Lengkap dengan Arab, Latin & Artinya | Al-Qur'an Ku",
  description: "Kumpulan doa harian Islam lengkap dengan tulisan Arab, Latin, dan terjemahan Indonesia. Doa sehari-hari, doa makan, doa tidur, doa perjalanan, dan lainnya.",
  keywords: [
    "doa harian",
    "doa Islam",
    "doa sehari-hari",
    "doa makan",
    "doa tidur",
    "doa perjalanan",
    "doa pagi",
    "doa sore",
    "doa lengkap"
  ],
  alternates: {
    canonical: "https://quran.ammaricano.my.id/doa"
  },
  openGraph: {
    title: "Doa Harian Islam Lengkap | Al-Qur'an Ku",
    description: "Kumpulan doa harian Islam lengkap dengan tulisan Arab, Latin, dan terjemahan Indonesia.",
    url: "https://quran.ammaricano.my.id/doa",
    type: "website"
  }
};

export default function DoaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
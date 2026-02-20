import Link from "next/link";
import HomeClient from "./HomeClient";

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

async function getSurahs(): Promise<Surah[]> {
  const res = await fetch("https://equran.id/api/v2/surat", {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const surahs = await getSurahs();

  return (
    <main className="w-screen h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden">
      <HomeClient surahs={surahs} />
    </main>
  );
}
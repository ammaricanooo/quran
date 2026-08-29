import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${id}`, {
      next: { revalidate: 86400 }
    });
    const json = await res.json();
    const surah = json.data;

    const title = `Surah ${surah.namaLatin} (${surah.nama}) - ${surah.arti} | Al-Qur'an Ku`;
    const description = `Baca Surah ${surah.namaLatin} lengkap ${surah.jumlahAyat} ayat dengan terjemahan Indonesia, tafsir, dan audio murottal. Surah ${surah.namaLatin} diturunkan di ${surah.tempatTurun}.`;

    return {
      title,
      description,
      keywords: [
        `Surah ${surah.namaLatin}`,
        `${surah.nama}`,
        `Baca ${surah.namaLatin}`,
        `Terjemahan ${surah.namaLatin}`,
        `Tafsir ${surah.namaLatin}`,
        `Audio Murottal ${surah.namaLatin}`,
        "Al-Qur'an Indonesia",
        "Quran online",
        `Surah ${surah.tempatTurun}`,
        "Al-Qur'an Ku",
        "Ammar Abdul Malik"
      ],
      authors: [{ name: "Ammar Abdul Malik", url: "https://linkedin.com/in/ammaricano" }],
      creator: "Ammar Abdul Malik",
      publisher: "Ammar Abdul Malik",
      alternates: {
        canonical: `https://quran.ammaricano.my.id/surah/${id}`
      },
      openGraph: {
        title,
        description,
        url: `https://quran.ammaricano.my.id/surah/${id}`,
        type: "article",
        locale: "id_ID",
        siteName: "Al-Qur'an Ku"
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: "@ammaricano"
      }
    };
  } catch (error) {
    return {
      title: "Surah Al-Qur'an | Al-Qur'an Ku",
      description: "Baca Al-Qur'an lengkap dengan terjemahan Indonesia"
    };
  }
}

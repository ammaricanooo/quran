import { NextResponse } from "next/server";
import { getMaulidData } from "@/lib/maulid-data";

export interface MaulidReading {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Maulid tidak valid" }, { status: 400 });
    }

    const category = getMaulidData().categories.find((item) => item.slug === slug);
    if (!category) {
      return NextResponse.json({ error: "Maulid tidak ditemukan" }, { status: 404 });
    }

    const readings: MaulidReading[] = category.subcategories.flatMap((subcategory) =>
      subcategory.readings.map((reading) => ({
        id: String(reading.id),
        title: subcategory.name,
        arabic: reading.arabic,
        transliteration: reading.transliteration,
        translation: reading.translate,
      }))
    );

    return NextResponse.json({ data: { title: category.name, readings } });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil bacaan maulid" }, { status: 500 });
  }
}
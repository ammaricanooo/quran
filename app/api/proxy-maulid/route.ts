import { NextResponse } from "next/server";
import { getMaulidData } from "@/lib/maulid-data";

export interface MaulidBook {
  name: string;
  slug: string;
  count: number;
}

export async function GET() {
  const books: MaulidBook[] = getMaulidData().categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    count: category.subcategories.reduce((sum, sub) => sum + sub.readings.length, 0),
  }));

  return NextResponse.json({ data: books });
}
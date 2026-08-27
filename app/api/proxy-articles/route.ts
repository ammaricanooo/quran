import { NextResponse } from "next/server";

const ARTICLES_URL = "https://web-api.nu.or.id/api/articles";

export async function GET() {
  try {
    const response = await fetch(ARTICLES_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Gagal mengambil artikel" }, { status: 502 });
    }

    return NextResponse.json({ data: await response.json() });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil artikel" }, { status: 500 });
  }
}
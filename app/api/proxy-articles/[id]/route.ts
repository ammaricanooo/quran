import { NextResponse } from "next/server";

const ARTICLES_URL = "https://web-api.nu.or.id/api/articles";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: "Artikel tidak valid" }, { status: 400 });
    }

    const response = await fetch(`${ARTICLES_URL}/${id}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ data: await response.json() });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil artikel" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

// GET /api/hadits?kitab=bukhari&page=1&q=niat&limit=20
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const kitab  = searchParams.get("kitab")  ?? "arbain";
    const page   = parseInt(searchParams.get("page")  ?? "1");
    const limit  = parseInt(searchParams.get("limit") ?? "20");
    const q      = (searchParams.get("q") ?? "").toLowerCase().trim();

    try {
        const filePath = path.join(process.cwd(), "dataset", "hadits", `${kitab}.json`);
        const raw = readFileSync(filePath, "utf-8");
        const data = JSON.parse(raw);

        let hadits: any[] = data.hadits ?? [];

        // Filter pencarian
        if (q) {
            hadits = hadits.filter((h: any) =>
                h.judul?.toLowerCase().includes(q) ||
                h.id?.toLowerCase().includes(q) ||
                String(h.number).includes(q)
            );
        }

        const total   = hadits.length;
        const pages   = Math.ceil(total / limit);
        const start   = (page - 1) * limit;
        const items   = hadits.slice(start, start + limit);

        return NextResponse.json({
            name:  data.name,
            slug:  data.slug,
            total,
            pages,
            page,
            limit,
            hadits: items,
        });
    } catch {
        return NextResponse.json({ error: "Kitab tidak ditemukan." }, { status: 404 });
    }
}

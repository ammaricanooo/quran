import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

// In-memory cache agar file JSON puluhan MB tidak dibaca dan di-parse ulang pada tiap request pencarian
const kitabCache = new Map<string, any>();

function getKitabData(slug: string) {
    const slugMap: Record<string, string> = {
        bm: "bulughul-maram",
        "bulughul-maram": "bulughul-maram",
    };
    const fileName = slugMap[slug] || slug;

    if (kitabCache.has(fileName)) {
        return kitabCache.get(fileName);
    }

    const filePath = path.join(process.cwd(), "dataset", "hadits", `${fileName}.json`);
    if (!existsSync(filePath)) {
        return null;
    }

    const raw = readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    kitabCache.set(fileName, data);
    return data;
}

// GET /api/hadits?kitab=bukhari&page=1&q=niat&limit=20
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const kitab  = searchParams.get("kitab")  ?? "arbain";
    const page   = Math.max(1, parseInt(searchParams.get("page")  ?? "1") || 1);
    const limit  = Math.max(1, parseInt(searchParams.get("limit") ?? "20") || 20);
    const rawQ   = searchParams.get("q") ?? "";
    const q      = rawQ.toLowerCase().trim();

    try {
        const data = getKitabData(kitab);
        if (!data) {
            return NextResponse.json({ error: "Kitab tidak ditemukan." }, { status: 404 });
        }

        let hadits: any[] = data.hadits ?? [];

        // Filter pencarian
        if (q) {
            const isNum = /^\d+$/.test(q);
            const targetNum = isNum ? parseInt(q, 10) : null;

            hadits = hadits.filter((h: any) => {
                if (targetNum !== null && h.number === targetNum) {
                    return true;
                }
                const matchJudul = h.judul ? h.judul.toLowerCase().includes(q) : false;
                const matchId = h.id ? h.id.toLowerCase().includes(q) : false;
                const matchArab = h.arab ? h.arab.includes(rawQ.trim()) : false;
                const matchNumber = String(h.number).includes(q);

                return matchJudul || matchId || matchArab || matchNumber;
            });
        }

        const total   = hadits.length;
        const pages   = Math.max(1, Math.ceil(total / limit));
        const start   = (page - 1) * limit;
        const items   = hadits.slice(start, start + limit);

        return NextResponse.json({
            name:  data.name,
            slug:  data.slug ?? kitab,
            total,
            pages,
            page,
            limit,
            hadits: items,
        });
    } catch {
        return NextResponse.json({ error: "Terjadi kesalahan saat memuat hadits." }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

// GET /api/hadits/index — kembalikan daftar kitab dari _index.json
export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "dataset", "hadits", "_index.json");
        const raw = readFileSync(filePath, "utf-8");
        return NextResponse.json(JSON.parse(raw));
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}

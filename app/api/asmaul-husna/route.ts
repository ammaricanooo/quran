import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

// GET /api/asmaul-husna
export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "dataset", "asmaul-husna", "asmaul-husna.json");
        const raw = readFileSync(filePath, "utf-8");
        return NextResponse.json(JSON.parse(raw));
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}

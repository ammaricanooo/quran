import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Ubah tipe data menjadi Promise
) {
    // Tunggu (await) params-nya dulu sebelum mengambil id
    const { id } = await params;

    try {
        const res = await fetch(`https://muslim-api-three.vercel.app/v1/quran/juz?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) throw new Error("Failed to fetch from external API");

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
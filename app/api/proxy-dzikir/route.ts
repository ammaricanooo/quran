import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://muslim-api-three.vercel.app/v1/dzikir', {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 86400 } // Cache selama 24 jam
    });
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
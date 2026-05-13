import { NextRequest, NextResponse } from "next/server";

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("query");
    if (!query || query.trim().length < 2) {
        return NextResponse.json([]);
    }

    const url = `https://financialmodelingprep.com/stable/search-name?query=${encodeURIComponent(query.trim())}&apikey=${FMP_API_KEY}`;

    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return NextResponse.json([]);

    const data: unknown = await res.json();
    return NextResponse.json(Array.isArray(data) ? data.slice(0, 8) : []);
}

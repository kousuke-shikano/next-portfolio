// app/api/apod/route.ts
import { NextRequest, NextResponse } from "next/server";

type APODData = {
  date: string;
  title: string;
  url: string;
  media_type: "image" | "video";
  explanation: string;
};

export async function GET(req: NextRequest) {
  const API_KEY = process.env.NASA_API_KEY;
  if (!API_KEY) return NextResponse.json({ error: "NASA APIキー未設定" }, { status: 500 });

  const count = Number(req.nextUrl.searchParams.get("count") || 1);

  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data: APODData[] = await res.json();
  // count=1 の場合は配列ではなく単一オブジェクトにする
  if (count === 1) return NextResponse.json(data[0]);
  return NextResponse.json(data.filter(d => d && d.url));
}

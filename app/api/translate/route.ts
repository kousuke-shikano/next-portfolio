// app/api/translate/route.ts
import { NextRequest, NextResponse } from "next/server";

const MAX_LEN = 500; // MyMemory 1リクエストの最大文字数

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text");
  if (!text) return NextResponse.json({ error: "textが指定されていません" }, { status: 400 });

  // 文字列を分割
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + MAX_LEN));
    start += MAX_LEN;
  }

  const translatedChunks: string[] = [];

for (const chunk of chunks) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      chunk
    )}&langpair=en|ja`
  );

  let data;
  try {
    data = await res.json(); // JSONに変換
  } catch (err) {
    // JSONじゃない場合も必ず返す
    return NextResponse.json({ error: "翻訳APIのレスポンスが不正です" }, { status: 500 });
  }

  if (!data.responseData || !data.responseData.translatedText) {
    return NextResponse.json({ error: "翻訳に失敗しました" }, { status: 500 });
  }

  translatedChunks.push(data.responseData.translatedText);
}

  return NextResponse.json({ translated: translatedChunks.join("") });
}

// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Header from "../app/components/Header";

type APODData = {
  date: string;
  title: string;
  url: string;
  media_type: "image" | "video";
  explanation: string;
};

export default function Home() {
  const [data, setData] = useState<APODData | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // 最新1枚だけ取得。ブラウザキャッシュ回避
        const res = await fetch("/api/apod?count=1", { cache: "no-store" });
        const json: APODData = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatest();
  }, []);

  if (!data) return <div>読み込み中…</div>;

  return (
    <div>
      <Header />
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
        <p className="text-gray-600 mb-4">{data.date}</p>

        {data.media_type === "image" ? (
          <div className="mb-4 w-full max-w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden rounded-lg">
            <img
              src={`${data.url}?t=${Date.now()}`} // タイムスタンプでブラウザキャッシュ回避
              alt={data.title}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <iframe
            src={data.url}
            allow="fullscreen"
            className="mb-4 rounded-lg w-full aspect-video"
          />
        )}

        <p>{data.explanation}</p>
      </main>
    </div>
  );
}

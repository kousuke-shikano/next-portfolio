// app/archive/page.tsx
"use client"; // クライアントコンポーネント化

import { useEffect, useState } from "react";
import Header from "../../app/components/Header";

type APODData = {
  date: string;
  title: string;
  url: string;
  media_type: "image" | "video";
  explanation: string;
};

export default function Archive() {
  const [dataList, setDataList] = useState<APODData[] | null>(null);

  useEffect(() => {
    const fetchAPODs = async () => {
      try {
        const res = await fetch("/api/apod?count=7", { cache: "no-store" });
        const data: APODData[] = await res.json();
        // 配列をランダムにシャッフル
        setDataList(data.sort(() => Math.random() - 0.5));
      } catch (e) {
        console.error(e);
      }
    };
    fetchAPODs();
  }, []);

  if (!dataList) return <div>読み込み中…</div>;

  return (
    <div>
      <Header />
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dataList.map((data, index) => (
          <div key={`${data.date}-${index}`} className="border rounded-lg p-2">
            {data.media_type === "image" ? (
              <div className="mb-2 w-full h-60 sm:h-72 md:h-80 overflow-hidden rounded-md">
                <img
                  src={`${data.url}?t=${Date.now()}`} // ブラウザキャッシュ対策
                  alt={data.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <iframe
                src={data.url}
                title={data.title}
                allow="fullscreen"
                className="rounded-md mb-2 w-full aspect-video"
              />
            )}
            <h3 className="font-bold">{data.title}</h3>
            <p className="text-gray-600 text-sm">{data.date}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

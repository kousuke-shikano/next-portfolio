// app/page.tsx
import Header from "../app/components/Header";
import Image from "next/image";

async function getAPOD() {
  const API_KEY = process.env.NASA_API_KEY;
  if (!API_KEY) throw new Error("NASA APIキーが設定されていません");

  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NASA APIエラー ${res.status}: ${text}`);
  }

  return res.json();
}

export default async function Home() {
  const data = await getAPOD();

  return (
    <div>
      <Header />
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
        <p className="text-gray-600 mb-4">{data.date}</p>

        {data.media_type === "image" ? (
          // 画像表示
          <div className="mb-4 w-full relative h-[500px] sm:h-[600px] md:h-[700px]">
            <Image
              src={data.url}
              alt={data.title}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
          </div>
        ) : (
          // 動画表示
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

// app/archive/page.tsx
import Header from "../../app/components/Header";

type APODData = {
  date: string;
  title: string;
  url: string;
  media_type: "image" | "video";
  explanation: string;
};

async function getLatestAPODs(count: number = 7): Promise<APODData[]> {
  const API_KEY = process.env.NASA_API_KEY;
  if (!API_KEY) throw new Error("NASA APIキーが設定されていません");

  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NASA APIエラー ${res.status}: ${text}`);
  }

  const dataList: APODData[] = await res.json();
  return dataList.filter((data) => data && data.url);
}

export default async function Archive() {
  const dataList = await getLatestAPODs(7);

  return (
    <div>
      <Header />
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dataList.map((data: APODData, index: number) => (
          <div key={`${data.date}-${index}`} className="border rounded-lg p-2">
            {data.media_type === "image" ? (
              <div className="mb-2 w-full h-60 sm:h-72 md:h-80 overflow-hidden rounded-md">
                <img
                  src={data.url}
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

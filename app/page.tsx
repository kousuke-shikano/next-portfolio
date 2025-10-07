import Header from "./components/Header";

async function getAPOD() {
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`,
    { next: { revalidate: 3600 } } // 1時間ごとに再取得
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NASA API Error ${res.status}: ${text}`);
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
        <img
          src={data.url}
          alt={data.title}
          className="mb-4 rounded-lg"
        />
        <p>{data.explanation}</p>
      </main>
    </div>
  );
}

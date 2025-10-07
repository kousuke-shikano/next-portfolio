import Header from "./components/Header";

async function getAPOD() {
    const res = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
      { next: { revalidate: 3600 } } //1時間ごとに再取得
    );
    return res.json();
}

export default async function Home() {
  const date = await getAPOD();

  return (
    <div>
      <Header />
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-2">{date.title}</h2>
        <p className="text-gray-600 mb-4">{date.date}</p>
        <img src={date.url} alt={date.title} className="mb-4 rounded-lg" />
        <p>{date.explanation}</p>
      </main>
    </div>
  );
}
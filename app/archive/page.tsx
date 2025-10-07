import Header from '../components/Header'

async function getPastAPODs(days: number = 7) {
    const today = new Date();

    const dates = Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0];
    });

    const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

    const requests = dates.map((date) =>
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
            .then(async (res) => {
                if (!res.ok) {
                    // 未来日や未登録日はスキップ
                    console.warn(`Skipping date ${date}: ${res.status}`);
                    return null;
                }
                return res.json();
            })
            .catch((err) => {
                console.error(err);
                return null;
            })
    );

    return Promise.all(requests);
}

export default async function Archive() {
    const dataList = await getPastAPODs(7);

    return (
        <div>
            <Header />
            <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dataList
                    .filter((data) => data !== null)
                    .map((data, index) => (
                        <div key={`${data.date}-${index}`} className="border rounded-lg p-2">
                            {data.media_type === "image" ? (
                                <img
                                    src={data.url}
                                    alt={data.title}
                                    className="rounded-md mb-2 w-full"
                                />
                            ) : (
                                <iframe
                                    src={data.url}
                                    title={data.title}
                                    className="rounded-md mb-2 w-full aspect-video"
                                ></iframe>
                            )}
                            <h3 className="font-bold">{data.title}</h3>
                            <p className="text-gray-600 text-sm">{data.date}</p>
                        </div>
                    ))}
            </main>
        </div>
    );
}

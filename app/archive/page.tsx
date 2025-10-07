import Header from '../components/Header'

async function getPastAPODs(days: number = 7) {
    const today = new Date();
    const datas = Array.from({ length: days },(_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0];
     });

    const requests = datas.map((data) =>
        fetch(
            `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${data}`
        ).then((res) => res.json())
    );

    return Promise.all(requests);
}

export default async function Archive() {
    const dataList = await getPastAPODs(7);

    return (
        <div>
            <Header />
            <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dataList.map((data,index) =>(
                    <div key={`$data.date}-${index}`} className="border rounded-lg p-2">
                        <img
                            src={data.url}
                            alt={data.title}
                            className="rounded-md mb-2 w-full"
                        />
                        <h3 className="font-bold">{data.title}</h3>
                        <p className="text-gray-600 text-sm">{data.date}</p>
                    </div>
                ))}
            </main>
        </div>
    );
}
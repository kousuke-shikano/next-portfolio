import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between">
            <h1 className="text-x1 font-bold">宇宙写真ギャラリー</h1>
            <nav className="space-x-4">
                <Link href="/">Home</Link>
                <Link href="/archive">Archive</Link>
                <Link href="/about">About</Link>
            </nav>
        </header>
    );
}
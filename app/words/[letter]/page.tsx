import words from "@/data/words.json"
import Link from "next/link"

export default async function Page({ params }: { params: Promise<{ letter: string }> }) {

const { letter } = await params

const filtered = words.filter((w) =>
w.word.toLowerCase().startsWith(letter.toLowerCase())
)

return (
<div className="max-w-3xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
Words starting with {letter.toUpperCase()}
</h1>

<div className="grid gap-3">

{filtered.map((w) => (
<Link
key={w.slug}
href={`/word/${w.slug}`}
className="border p-3 rounded-lg hover:bg-gray-50"
>
{w.word}
</Link>
))}

</div>

</div>
)
}
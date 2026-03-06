import Link from "next/link"

export default function WordsIndex() {

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

return (

<div className="max-w-3xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
Browse Words A-Z
</h1>

<div className="grid grid-cols-6 gap-3">

{alphabet.map((letter) => (

<Link
key={letter}
href={`/words/${letter}`}
className="border p-4 text-center rounded hover:bg-gray-50 text-lg"
>
{letter.toUpperCase()}
</Link>

))}

</div>

</div>

)

}
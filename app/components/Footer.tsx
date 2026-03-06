import Link from "next/link"

export default function Footer() {

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

return (

<footer className="mt-20 border-t bg-gray-50">

<div className="max-w-5xl mx-auto px-6 py-10">

<h3 className="text-lg font-semibold mb-4 text-center">
Browse Words by Letter
</h3>

<div className="flex flex-wrap justify-center gap-2">

{alphabet.map((letter) => (

<Link
key={letter}
href={`/words/${letter}`}
className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 transition"
>
{letter.toUpperCase()}
</Link>

))}

</div>

<div className="text-center text-sm text-gray-500 mt-10 space-y-1">

<p>
© {new Date().getFullYear()} WordWord
</p>

<p>
Made with ❤️ in Bharat
</p>

<p className="font-medium">
by Aakash Belkar
</p>

</div>

</div>

</footer>

)

}
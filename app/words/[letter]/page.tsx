import words from "@/data/words.json"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ letter: string }>
}): Promise<Metadata> {

  const { letter } = await params

  const upper = letter.toUpperCase()

  return {
    title: `Words starting with ${upper} | WordWord`,
    description: `Explore English words starting with ${upper} with meanings, examples, and stories. Learn vocabulary easily with WordWord.`,
    alternates: {
      canonical: `https://wordword.app/words/${letter}`
    }
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ letter: string }>
  searchParams: Promise<{ page?: string }>
}) {

  const { letter } = await params
const { page } = await searchParams

const currentPage = Number(page) || 1
const perPage = 20

const filtered = words.filter((w) =>
  w.word.toLowerCase().startsWith(letter.toLowerCase())
)

const totalPages = Math.ceil(filtered.length / perPage)

const start = (currentPage - 1) * perPage
const paginatedWords = filtered.slice(start, start + perPage)

  return (

<div className="max-w-3xl mx-auto px-6 py-8">

<h1 className="text-3xl font-bold mb-8">
Words starting with "{letter.toUpperCase()}"
</h1>

<div className="grid gap-4">

{paginatedWords.map((w) => (

<a
key={w.slug}
href={`/word/${w.slug}`}
className="block border rounded-xl p-4 hover:bg-gray-50 transition"
>

<h2 className="text-lg font-semibold">
{w.word}
</h2>

<p className="text-gray-600 mt-1">
{w.meaning_en}
</p>

</a>

))}

</div>

<div className="flex gap-2 mt-10 flex-wrap justify-center">

{Array.from({ length: totalPages }).map((_, i) => (

<a
key={i}
href={`/words/${letter}?page=${i+1}`}
className={`px-3 py-1 border rounded ${
currentPage === i+1 ? "bg-black text-white" : ""
}`}
>

{i+1}

</a>

))}

</div>

</div>

)
}
"use client"

export const metadata = {
robots: {
index: false,
follow: false
}
}


import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import words from "@/data/words.json"
import Link from "next/link"

export default function ReviewPage() {

const [weakWords, setWeakWords] = useState<any[]>([])
const [page, setPage] = useState(1)
const [showAnswer, setShowAnswer] = useState<{[key:string]: boolean}>({})

const wordsPerPage = 5

useEffect(() => {

async function loadWeakWords() {

const { data: { user } } = await supabase.auth.getUser()
if (!user) return

const { data } = await supabase
.from("learned_words")
.select("word")
.eq("user_id", user.id)
.eq("status", "weak")

if (!data) return

const matched = words.filter(w =>
data.some(d => d.word === w.word)
)

setWeakWords(matched)

}

loadWeakWords()

}, [])

const start = (page - 1) * wordsPerPage
const end = start + wordsPerPage

const visibleWords = weakWords.slice(start, end)

const totalPages = Math.ceil(weakWords.length / wordsPerPage)

function toggleAnswer(slug:string) {

setShowAnswer(prev => ({
...prev,
[slug]: !prev[slug]
}))

}

async function markStatus(word:string, status:"mastered"|"weak") {

const { data: { user } } = await supabase.auth.getUser()
if (!user) return

await supabase
.from("learned_words")
.update({ status })
.eq("user_id", user.id)
.eq("word", word)

if (status === "mastered") {
setWeakWords(prev => prev.filter(w => w.word !== word))
setPage(1)
}

}

if (weakWords.length === 0) {

return (
<div className="p-10 text-xl text-center">
No weak words to review
</div>
)

}

return (

<div className="max-w-3xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8 text-center">
Review Weak Words
</h1>

<div className="grid gap-6">

{visibleWords.map(word => (

<div
key={word.slug}
className="border rounded-xl p-6 shadow-sm bg-red-100"
>

<h2 className="text-2xl font-semibold mb-3">
{word.word}
</h2>

{showAnswer[word.slug] && (

<p className="text-gray-700 mb-4">
{word.meaning_en}
</p>

)}

<div className="flex flex-wrap gap-3">

<button
onClick={() => toggleAnswer(word.slug)}
className="px-4 py-2 bg-blue-600 text-white rounded"
>
{showAnswer[word.slug] ? "Hide Answer" : "Show Answer"}
</button>

<Link
href={`/word/${word.slug}`}
className="px-4 py-2 bg-black text-white rounded"
>
More
</Link>

<button
onClick={() => markStatus(word.word,"mastered")}
className="px-4 py-2 bg-green-600 text-white rounded"
>
Mastered
</button>



</div>

</div>

))}

</div>

<div className="flex justify-center gap-2 mt-10 flex-wrap">

<button
disabled={page === 1}
onClick={() => setPage(page - 1)}
className="px-4 py-2 border rounded disabled:opacity-50"
>
Prev
</button>

{Array.from({ length: totalPages }).map((_, i) => (

<button
key={i}
onClick={() => setPage(i + 1)}
className={`px-4 py-2 border rounded ${
page === i + 1 ? "bg-black text-white" : ""
}`}
>
{i + 1}
</button>

))}

<button
disabled={page === totalPages}
onClick={() => setPage(page + 1)}
className="px-4 py-2 border rounded disabled:opacity-50"
>
Next
</button>

</div>

</div>

)

}
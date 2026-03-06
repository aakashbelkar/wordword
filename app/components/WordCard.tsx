"use client"

import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useState, useEffect } from "react"

type Props = {
  word: string
  meaning: string
  example: string
  slug: string
  language: string
}

type Status = "mastered" | "weak" | null

export default function WordCard({
  word,
  meaning,
  example,
  slug,
  language
}: Props) {

const [status, setStatus] = useState<Status>(null)

useEffect(() => {

async function checkStatus() {

const { data: { user } } = await supabase.auth.getUser()
if (!user) return

const { data } = await supabase
.from("learned_words")
.select("status")
.eq("user_id", user.id)
.eq("word", word)
.single()

if (data) {
setStatus(data.status)
} else {
setStatus(null)
}

}

checkStatus()

}, [word])


async function handleClick(type: Status) {

const { data: { user } } = await supabase.auth.getUser()
if (!user) {
alert("Please login")
return
}

const { data: existing } = await supabase
.from("learned_words")
.select("*")
.eq("user_id", user.id)
.eq("word", word)
.single()

// CASE 1: record exists
if (existing) {

if (existing.status === type) {

// clicking same button → remove
await supabase
.from("learned_words")
.delete()
.eq("user_id", user.id)
.eq("word", word)

setStatus(null)

} else {

// switching mastered ↔ weak
await supabase
.from("learned_words")
.update({ status: type })
.eq("user_id", user.id)
.eq("word", word)

setStatus(type)

}

} else {

// CASE 2: record doesn't exist
await supabase
.from("learned_words")
.insert({
user_id: user.id,
word: word,
status: type
})

setStatus(type)

}

}


return (

<div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

{/* WORD */}
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
{word}
</h2>

{/* STATUS BADGE */}

{status === "mastered" && (
<span className="inline-block text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full mb-3">
Mastered
</span>
)}

{status === "weak" && (
<span className="inline-block text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full mb-3">
Needs Practice
</span>
)}

{/* MEANING */}

<p className="text-gray-700 dark:text-gray-300 mb-2">
<span className="font-semibold">Meaning:</span> {meaning}
</p>

{/* EXAMPLE */}

<p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
<span className="font-semibold">Example:</span> {example}
</p>

{/* BUTTONS */}

<div className="flex flex-wrap gap-3">

<Link
href={`/word/${slug}?lang=${language}`}
className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90"
>
Learn More
</Link>

<button
onClick={() => handleClick("mastered")}
className="px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
>
Mastered
</button>

<button
onClick={() => handleClick("weak")}
className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
>
Weak
</button>

</div>

</div>

)

}
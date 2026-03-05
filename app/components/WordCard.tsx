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

<div
className={`border rounded-xl p-6 shadow-sm transition
${status === "mastered" ? "bg-green-100" : ""}
${status === "weak" ? "bg-red-100" : ""}
`}
>

<h2 className="text-2xl font-semibold mb-2">
{word}
</h2>

<p className="text-gray-700">
Meaning: {meaning}
</p>

<p className="text-gray-700 mb-3">
Example: {example}
</p>

<div className="flex gap-3 mt-3">

<Link
href={`/word/${slug}?lang=${language}`}
className="px-4 py-2 bg-black text-white rounded-lg"
>
More
</Link>

<button
onClick={() => handleClick("mastered")}
className="px-4 py-2 rounded-lg bg-gray-500 text-white"
>
Mastered
</button>

<button
onClick={() => handleClick("weak")}
className="px-4 py-2 rounded-lg bg-gray-500 text-white"
>
Weak
</button>

</div>

</div>

)

}
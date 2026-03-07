"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function MasteredWords() {

const [words, setWords] = useState<any[]>([])

useEffect(() => {

async function load() {

const { data: { user } } = await supabase.auth.getUser()

if (!user) return

const { data } = await supabase
.from("learned_words")
.select("*")
.eq("user_id", user.id)
.eq("status", "mastered")

if (data) setWords(data)

}

load()

}, [])

return (

<div className="max-w-4xl mx-auto px-5 py-10">

<h1 className="text-4xl font-bold mb-2 text-center">
Mastered Words
</h1>

<p className="text-center text-gray-500 mb-10">
Words you have successfully learned
</p>

{words.length === 0 && (
<p className="text-center text-gray-400">
No mastered words yet.
</p>
)}

<div className="grid gap-4">

{words.map((w) => (

<Link
key={w.word}
href={`/word/${w.word.toLowerCase()}`}
className="flex justify-between items-center p-5 rounded-xl border border-green-200 bg-green-50 hover:shadow-md hover:-translate-y-0.5 transition"
>

<span className="font-medium">
{w.word}
</span>

<span className="text-sm text-green-600">
View →
</span>

</Link>

))}

</div>

</div>

)

}
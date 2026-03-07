"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function WeakWords() {

const [words, setWords] = useState<any[]>([])

useEffect(() => {

async function load() {

const { data: { user } } = await supabase.auth.getUser()

if (!user) return

const { data } = await supabase
.from("learned_words")
.select("*")
.eq("user_id", user.id)
.eq("status", "weak")

if (data) setWords(data)

}

load()

}, [])

return (

<div className="max-w-4xl mx-auto px-5 py-10">

<h1 className="text-4xl font-bold mb-2 text-center">
Weak Words
</h1>

<p className="text-center text-gray-500 mb-10">
Practice vocabulary you marked as weak
</p>

{words.length === 0 && (
<p className="text-center text-gray-400">
No weak words yet here.
</p>
)}

<div className="grid gap-4">

{words.map((w) => (

<Link
key={w.word}
href={`/word/${w.word.toLowerCase()}`}
className="flex justify-between items-center p-5 rounded-xl border border-red-200 bg-red-50 hover:shadow-md hover:-translate-y-0.5 transition"
>

<span className="font-medium">
{w.word}
</span>

<span className="text-sm text-red-500">
Review →
</span>

</Link>

))}

</div>

</div>

)

}
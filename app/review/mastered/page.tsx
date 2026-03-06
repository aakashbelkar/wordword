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

<div className="max-w-4xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
Mastered Words
</h1>

<div className="grid gap-4">

{words.map((w) => (

<Link
key={w.word}
href={`/word/${w.word.toLowerCase()}`}
className="border p-4 rounded-xl hover:bg-green-50"
>

{w.word}

</Link>

))}

</div>

</div>

)

}
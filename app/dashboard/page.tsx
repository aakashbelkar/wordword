"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import words from "@/data/words.json"
import Link from "next/link"

export default function DashboardPage() {

const [mastered,setMastered] = useState(0)
const [weak,setWeak] = useState(0)
const [total,setTotal] = useState(words.length)

useEffect(()=>{

async function loadStats(){

const { data:{ user } } = await supabase.auth.getUser()

if(!user) return

const { data } = await supabase
.from("learned_words")
.select("status")
.eq("user_id",user.id)

if(!data) return

const masteredCount = data.filter(d=>d.status==="mastered").length
const weakCount = data.filter(d=>d.status==="weak").length

setMastered(masteredCount)
setWeak(weakCount)

}

loadStats()

},[])

const progress = Math.round((mastered / total) * 100)

return(

<div className="max-w-3xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8">
Learning Dashboard
</h1>

<div className="grid gap-6">

<div className="border p-6 rounded-xl">
<h2 className="text-xl font-semibold">Total Words</h2>
<p className="text-3xl mt-2">{total}</p>
</div>

<div className="border p-6 rounded-xl">
<h2 className="text-xl font-semibold">Mastered</h2>
<p className="text-3xl mt-2 text-green-600">{mastered}</p>
</div>

<div className="border p-6 rounded-xl">
<h2 className="text-xl font-semibold">Weak Words</h2>
<p className="text-3xl mt-2 text-red-600">{weak}</p>
</div>

<div className="border p-6 rounded-xl">
<h2 className="text-xl font-semibold">Progress</h2>
<p className="text-3xl mt-2">{progress}%</p>
</div>

</div>

<div className="mt-10 flex gap-4 flex-wrap">

<Link
href="/review"
className="px-4 py-2 bg-red-600 text-white rounded"
>
Review Weak Words
</Link>

<Link
href="/"
className="px-4 py-2 bg-black text-white rounded"
>
Continue Learning
</Link>

</div>

</div>

)

}
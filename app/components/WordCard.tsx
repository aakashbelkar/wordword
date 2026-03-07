"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function WordCard({ word }: { word: string }) {

const [status, setStatus] = useState<string | null>(null)
const [user, setUser] = useState<any>(null)
const [showLoginPopup, setShowLoginPopup] = useState(false)

const handleLogin = async () => {
await supabase.auth.signInWithOAuth({
provider: "google",
})
}

useEffect(() => {

async function loadUser() {

const { data: { user } } = await supabase.auth.getUser()

if (!user) return

setUser(user)

const { data } = await supabase
.from("learned_words")
.select("status")
.eq("user_id", user.id)
.eq("word", word)
.single()

if (data) setStatus(data.status)

}

loadUser()

}, [word])

async function updateStatus(newStatus: string) {

if (!user) {
setShowLoginPopup(true)
return
}

if (status === newStatus) {

await supabase
.from("learned_words")
.delete()
.eq("user_id", user.id)
.eq("word", word)

setStatus(null)
return

}

await supabase
.from("learned_words")
.upsert({
user_id: user.id,
word: word,
status: newStatus,
})

setStatus(newStatus)

}

return (

<>

<div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">

<div className="flex justify-between items-center">

<h2 className="text-lg font-semibold">
{word}
</h2>

{status && (
<span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
{status}
</span>
)}

</div>

<div className="flex gap-3 mt-4">

<button
onClick={() => updateStatus("mastered")}
className={`px-4 py-1.5 rounded-lg text-sm border transition ${
status === "mastered"
? "bg-green-500 text-white border-green-500"
: "hover:bg-green-50"
}`}
>
Mastered
</button>

<button
onClick={() => updateStatus("weak")}
className={`px-4 py-1.5 rounded-lg text-sm border transition ${
status === "weak"
? "bg-yellow-400 border-yellow-400"
: "hover:bg-yellow-50"
}`}
>
Mark Weak
</button>

</div>

</div>



{showLoginPopup && (

<div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

<div className="bg-white rounded-xl p-7 max-w-sm text-center shadow-lg">

<h3 className="text-xl font-semibold mb-3">
Login to Unlock Features 🚀
</h3>

<p className="text-sm text-gray-600 mb-6">
Track mastered words and review weak vocabulary.
</p>

<div className="flex justify-center gap-3">

<button
onClick={() => setShowLoginPopup(false)}
className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
>
Maybe Later
</button>

<button
onClick={handleLogin}
className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:opacity-90"
>
Register / Login
</button>

</div>

</div>

</div>

)}

</>

)

}
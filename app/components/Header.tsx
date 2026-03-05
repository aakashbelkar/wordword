"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Header() {

const [open, setOpen] = useState(false)
const [user, setUser] = useState<any>(null)

useEffect(() => {

supabase.auth.getUser().then(({ data }) => {
setUser(data.user)
})

}, [])

async function login() {
await supabase.auth.signInWithOAuth({
provider: "google",
})
}

async function logout() {
await supabase.auth.signOut()
location.reload()
}

return (

<header className="border-b bg-white">

<div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

<Link href="/" className="text-2xl font-bold">
WordWord
</Link>

<button
onClick={() => setOpen(!open)}
className="text-2xl"
>
☰
</button>

</div>

{open && (

<div className="border-t bg-gray-50">

<div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">

{!user && (

<button onClick={login}>
Login with Google
</button>

)}

{user && (

<>
<p className="text-sm text-gray-600">
{user.email}
</p>

<Link href="/dashboard">
Dashboard
</Link>

<button onClick={logout}>
Logout
</button>
</>

)}

</div>

</div>

)}

</header>

)
}
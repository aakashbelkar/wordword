"use client"

import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Header() {

const [user,setUser] = useState<any>(null)

useEffect(() => {

async function loadUser(){
const { data } = await supabase.auth.getUser()
setUser(data.user)
}

loadUser()

},[])

async function login(){
await supabase.auth.signInWithOAuth({
provider:"google"
})
}

async function logout(){
await supabase.auth.signOut()
location.reload()
}

return (

<header className="sticky top-0 z-50 bg-white border-b">

<div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

<Link href="/" className="text-xl font-bold tracking-tight">
WordWord
</Link>

<div className="flex items-center gap-4 text-sm">

{user && (

<>

<Link
href="/review"
className="hover:text-blue-600 transition"
>
Review
</Link>

<Link
href="/dashboard"
className="hover:text-blue-600 transition"
>
Dashboard
</Link>

</>

)}

{user ? (

<button
onClick={logout}
className="px-3 py-1.5 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
>
Logout
</button>

) : (

<button
onClick={login}
className="px-3 py-1.5 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
>
Login
</button>

)}

</div>

</div>

</header>

)

}
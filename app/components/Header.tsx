"use client"

import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Header(){

const [user,setUser] = useState<any>(null)
const [menuOpen,setMenuOpen] = useState(false)

useEffect(()=>{

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

return(

<header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">

<div className="max-w-4xl mx-auto flex items-center justify-between px-5 py-3">

<Link
href="/"
className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
>
WordWord
</Link>

<div className="hidden md:flex items-center gap-6 text-sm">

{user && (
<>
<Link href="/review" className="hover:text-indigo-600 transition">
Review
</Link>

<Link href="/dashboard" className="hover:text-indigo-600 transition">
Dashboard
</Link>
</>
)}

{user ? (

<button
onClick={logout}
className="px-4 py-1.5 bg-black text-white rounded-full hover:opacity-80 transition"
>
Logout
</button>

) : (

<button
onClick={login}
className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:opacity-90 transition"
>
Login
</button>

)}

</div>

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="md:hidden text-2xl"
>
☰
</button>

</div>

{menuOpen && (

<div className="md:hidden border-t px-5 py-4 space-y-3 bg-white">

{user && (
<>
<Link href="/review" className="block">
Review
</Link>

<Link href="/dashboard" className="block">
Dashboard
</Link>
</>
)}

{user ? (

<button
onClick={logout}
className="block w-full text-left"
>
Logout
</button>

) : (

<button
onClick={login}
className="block w-full text-left"
>
Login
</button>

)}

</div>

)}

</header>

)

}
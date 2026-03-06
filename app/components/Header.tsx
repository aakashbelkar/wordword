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

<header className="sticky top-0 z-50 bg-white border-b">

<div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

<Link href="/" className="text-xl font-bold">
WordWord
</Link>

{/* Desktop Menu */}

<div className="hidden md:flex items-center gap-4 text-sm">

{user && (
<>
<Link href="/review">Review</Link>
<Link href="/dashboard">Dashboard</Link>
</>
)}

{user ? (

<button
onClick={logout}
className="px-3 py-1 bg-black text-white rounded-lg"
>
Logout
</button>

) : (

<button
onClick={login}
className="px-3 py-1 bg-black text-white rounded-lg"
>
Login
</button>

)}

</div>

{/* Mobile Hamburger */}

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="md:hidden text-2xl"
>
☰
</button>

</div>

{/* Mobile Menu */}

{menuOpen && (

<div className="md:hidden border-t px-4 py-3 space-y-3">

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
className="block text-left w-full"
>
Logout
</button>

) : (

<button
onClick={login}
className="block text-left w-full"
>
Login
</button>

)}

</div>

)}

</header>

)

}
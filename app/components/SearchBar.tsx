"use client"

import { useState } from "react"

export default function SearchBar({ words,setFiltered,setPage }:any){

const [query,setQuery] = useState("")

function handleSearch(e:any){

const value = e.target.value
setQuery(value)

const filtered = words.filter((w:any)=>
w.word.toLowerCase().includes(value.toLowerCase())
)

setFiltered(filtered)
setPage(1)

}

return (

<div className="mt-6">

<input
type="text"
value={query}
onChange={handleSearch}
placeholder="Search vocabulary..."
className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
/>

</div>

)

}
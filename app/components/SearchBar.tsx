"use client"

import { useState } from "react"

export default function SearchBar({ words, setFiltered, setPage }: any) {

const [query, setQuery] = useState("")

function handleSearch(value: string) {

setQuery(value)

const result = words.filter((w: any) =>
w.word.toLowerCase().includes(value.toLowerCase())
)

setFiltered(result)

setPage(1) // reset pagination when searching
}

function clearSearch() {

setQuery("")

setFiltered(words)

setPage(1)

}

return (

<div className="relative">

<input
type="text"
value={query}
onChange={(e) => handleSearch(e.target.value)}
placeholder="Search words..."
className="w-full border rounded-xl p-3"
/>

{query && (

<button
onClick={clearSearch}
className="absolute right-3 top-3 text-gray-500"
>

✕

</button>

)}

</div>

)

}
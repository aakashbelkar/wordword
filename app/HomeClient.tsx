"use client"

import words from "@/data/words.json"
import WordCard from "./components/WordCard"
import Link from "next/link"
import { useState, useEffect } from "react"
import SearchBar from "./components/SearchBar"
import LanguageSelector from "./components/LanguageSelector"
import type { Metadata } from "next"

export const metadata: Metadata = {
title: "Learn English Vocabulary with Stories | WordWord",
description:
"Improve your English vocabulary through stories, examples and quizzes. Learn words faster with WordWord.",
}

export default function Home() {

const [filtered, setFiltered] = useState(words)
const [page, setPage] = useState(1)
const [language, setLanguage] = useState("en")

useEffect(() => {
const savedLang = localStorage.getItem("language")
if (savedLang) {
setLanguage(savedLang)
}
}, [])

useEffect(() => {
localStorage.setItem("language", language)
}, [language])

const wordsPerPage = 5

const start = (page - 1) * wordsPerPage
const end = start + wordsPerPage

const visibleWords = filtered.slice(start, end)

const totalPages = Math.ceil(filtered.length / wordsPerPage)

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

function getMeaning(word: any) {
if (language === "hi") return word.meaning_hi
if (language === "mr") return word.meaning_mr
return word.meaning_en
}

function getExample(word: any) {
if (language === "hi") return word.example_hi
if (language === "mr") return word.example_mr
return word.example_en
}

return (

<div className="max-w-4xl mx-auto p-6">

<Link
href="/review"
className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded"
>
Review Weak Words
</Link>

<SearchBar
words={words}
setFiltered={setFiltered}
setPage={setPage}
/>

<LanguageSelector
language={language}
setLanguage={setLanguage}
/>

<div className="flex flex-wrap gap-2 mt-6 justify-center">

{alphabet.map((letter) => (

<Link
key={letter}
href={`/words/${letter}`}
className="px-3 py-1 border rounded hover:bg-gray-100"
>
{letter.toUpperCase()}
</Link>

))}

</div>

<div className="grid gap-6 mt-6">

{visibleWords.map((word) => (

<WordCard
key={word.slug}
word={word.word}
meaning={getMeaning(word)}
example={getExample(word)}
slug={word.slug}
language={language}
/>

))}

</div>

<div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

<button
disabled={page === 1}
onClick={() => setPage(page - 1)}
className="px-4 py-2 border rounded disabled:opacity-50"
>
Prev
</button>

{Array.from({ length: totalPages }).map((_, i) => (

<button
key={i}
onClick={() => setPage(i + 1)}
className={`px-4 py-2 border rounded ${
page === i + 1 ? "bg-black text-white" : ""
}`}
>
{i + 1}
</button>

))}

<button
disabled={page === totalPages}
onClick={() => setPage(page + 1)}
className="px-4 py-2 border rounded disabled:opacity-50"
>
Next
</button>

</div>

</div>

)

}
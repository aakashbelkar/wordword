"use client"

import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useState } from "react"

type Props = {
  word: string
  meaning: string
  example: string
  slug: string
  language: string
}

export default function WordCard({
  word,
  meaning,
  example,
  slug,
  language,
}: Props) {
  const [loading, setLoading] = useState(false)

  // TEST LOG
  console.log("WordCard slug:", slug)

  async function mark(type: "weak" | "strong") {
    try {
      setLoading(true)

      const { error } = await supabase.from("progress").upsert({
        word_slug: slug,
        status: type,
        language: language,
      })

      if (error) throw error

      alert(`Marked ${type}`)
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition">

      <h2 className="text-lg font-semibold">{word}</h2>

      <p className="text-gray-700 mt-1">{meaning}</p>

      {example && (
        <p className="text-sm text-gray-500 mt-2 italic">
          "{example}"
        </p>
      )}

      <div className="flex gap-2 mt-4">

        <button
          onClick={() => mark("weak")}
          disabled={loading}
          title="Mark this word as difficult"
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
        >
          Mark Weak
        </button>

        <button
          onClick={() => mark("strong")}
          disabled={loading}
          title="Mark this word as mastered"
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
        >
          Mark Strong
        </button>

      </div>

      <div className="mt-3">

        <Link
          href={`/word/${slug}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          Learn more →
        </Link>

      </div>

    </div>
  )
}
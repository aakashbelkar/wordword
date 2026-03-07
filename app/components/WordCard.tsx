"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"
import Link from "next/link"

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

  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)

    const { error } = await supabase.from("saved_words").insert([
      {
        word,
        meaning,
        example,
        slug,
        language,
      },
    ])

    if (!error) {
      setSaved(true)
    }

    setLoading(false)
  }

  return (
    <div
      className={`relative border rounded-xl p-5 shadow-sm transition-all duration-300 
      ${loading ? "opacity-50 pointer-events-none" : ""}`}
    >
      
      {/* Updating overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
          <span className="text-sm font-medium animate-pulse">
            Updating...
          </span>
        </div>
      )}

      {/* Word */}
      <Link href={`/word/${slug}`}>
        <h2 className="text-xl font-semibold mb-2 hover:underline">
          {word}
        </h2>
      </Link>

      {/* Meaning */}
      <p className="text-gray-700 mb-3">{meaning}</p>

      {/* Example */}
      <p className="text-gray-500 italic mb-4">
        "{example}"
      </p>

      {/* Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          saved
            ? "bg-green-500 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {saved ? "Saved ✓" : "Save Word"}
      </button>
    </div>
  )
}
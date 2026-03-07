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

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function updateStatus(type: string) {

    setLoading(true)

    const { error } = await supabase
      .from("word_progress")
      .upsert({
        word,
        status: type,
      })

    if (!error) {
      setStatus(type)
    }

    setLoading(false)
  }

  return (
    <div
      className={`relative border rounded-xl p-5 shadow-sm transition-all duration-300 
      ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >

      {/* Overlay when updating */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            Updating...
          </div>
        </div>
      )}

      {/* WORD */}
      <Link href={`/word/${slug}`}>
        <h2 className="text-xl font-semibold hover:underline">
          {word}
        </h2>
      </Link>

      {/* MEANING */}
      <p className="text-gray-700 mt-2">
        {meaning}
      </p>

      {/* EXAMPLE */}
      <p className="text-gray-500 italic mt-2">
        "{example}"
      </p>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-2 mt-4">

        {/* Learn More */}
        <Link
          href={`/word/${slug}`}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          Learn More
        </Link>

        {/* Mark Weak */}
        <button
          onClick={() => updateStatus("weak")}
          className={`px-3 py-1 text-sm rounded border 
          ${status === "weak" ? "bg-yellow-200" : ""}`}
        >
          Mark Weak
        </button>

        {/* Mastered */}
        <button
          onClick={() => updateStatus("mastered")}
          className={`px-3 py-1 text-sm rounded border 
          ${status === "mastered" ? "bg-green-200" : ""}`}
        >
          Mastered
        </button>

      </div>

    </div>
  )
}
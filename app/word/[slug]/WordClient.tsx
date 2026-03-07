"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Word = {
  id: string
  slug: string
  word: string
  meaning_en: string
  meaning_hi?: string
  meaning_mr?: string
  example?: string
}

type Props = {
  word?: Word
  language: string
}

export default function WordClient({ word, language }: Props) {
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState<"strong" | "weak" | null>(null)

  if (!word) {
    return (
      <div className="p-6 text-center text-gray-500">
        Word not found
      </div>
    )
  }

  function getMeaning() {
    if (language === "hi") return word.meaning_hi ?? word.meaning_en
    if (language === "mr") return word.meaning_mr ?? word.meaning_en
    return word.meaning_en
  }

  async function markWord(type: "strong" | "weak") {
    try {
      setLoading(true)

      const { error } = await supabase
        .from("word_strength")
        .upsert({
          word_id: word.id,
          strength: type,
        })

      if (error) throw error

      setStrength(type)
    } catch (err) {
      alert("Something went wrong")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">{word.word}</h1>

      <p className="text-lg text-gray-700">
        {getMeaning()}
      </p>

      {word.example && (
        <p className="italic text-gray-500">
          {word.example}
        </p>
      )}

      <div className="flex gap-3 pt-4">

        <button
          onClick={() => markWord("weak")}
          disabled={loading}
          className={`px-4 py-2 rounded-lg border transition ${
            strength === "weak"
              ? "bg-red-500 text-white"
              : "bg-white hover:bg-red-50"
          }`}
        >
          Mark Weak
        </button>

        <button
          onClick={() => markWord("strong")}
          disabled={loading}
          className={`px-4 py-2 rounded-lg border transition ${
            strength === "strong"
              ? "bg-green-600 text-white"
              : "bg-white hover:bg-green-50"
          }`}
        >
          Mark Strong
        </button>

      </div>

    </div>
  )
}
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
  example_en?: string
  example_hi?: string
  example_mr?: string
  story_en?: string
  story_hi?: string
  story_mr?: string
  image?: string
}

type Props = {
  word: Word
  language: string
}

export default function WordClient({ word, language }: Props) {
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState<"strong" | "weak" | null>(null)

  function getMeaning() {
    if (language === "hi") return word.meaning_hi ?? word.meaning_en
    if (language === "mr") return word.meaning_mr ?? word.meaning_en
    return word.meaning_en
  }

  function getExample() {
    if (language === "hi") return word.example_hi ?? word.example_en
    if (language === "mr") return word.example_mr ?? word.example_en
    return word.example_en
  }

  function getStory() {
    if (language === "hi") return word.story_hi ?? word.story_en
    if (language === "mr") return word.story_mr ?? word.story_en
    return word.story_en
  }
async function markWord(type: "strong" | "weak") {
  try {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const confirmLogin = confirm(
        "You need to login to mark words. Login now?"
      )

      if (confirmLogin) {
        await supabase.auth.signInWithOAuth({
          provider: "google",
        })
      }

      return
    }

    const { error } = await supabase
      .from("word_strength")
      .upsert({
        user_id: user.id,
        slug: word.slug,
        strength: type,
      })

    if (error) throw error

    setStrength(type)

  } catch (err) {
    console.error(err)
    alert("Something went wrong")
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

      {getExample() && (
        <p className="italic text-gray-500">
          {getExample()}
        </p>
      )}

      {word.image && (
        <img
          src={word.image}
          alt={word.word}
          className="rounded-lg"
        />
      )}

      {getStory() && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">📖 Story</h2>
          <p>{getStory()}</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">

        <button
          onClick={() => markWord("weak")}
          disabled={loading}
          className={`px-4 py-2 rounded-lg border ${
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
          className={`px-4 py-2 rounded-lg border ${
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
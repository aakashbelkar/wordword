"use client"

import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useState, useEffect } from "react"

type Props = {
  word: string
  meaning: string
  example: string
  slug: string
  language: string
}

type Status = "mastered" | "weak" | null

export default function WordCard({
  word,
  meaning,
  example,
  slug,
  language
}: Props) {

  const [status, setStatus] = useState<Status>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    async function checkStatus() {

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("learned_words")
        .select("status")
        .eq("user_id", user.id)
        .eq("word", word)
        .single()

      if (data) {
        setStatus(data.status)
      } else {
        setStatus(null)
      }

    }

    checkStatus()

  }, [word])


  async function handleClick(type: Status) {

    if (loading) return

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Please login")
      setLoading(false)
      return
    }

    const { data: existing } = await supabase
      .from("learned_words")
      .select("*")
      .eq("user_id", user.id)
      .eq("word", word)
      .single()

    // CASE 1: record exists
    if (existing) {

      if (existing.status === type) {

        // remove
        await supabase
          .from("learned_words")
          .delete()
          .eq("user_id", user.id)
          .eq("word", word)

        setStatus(null)

      } else {

        // switch
        await supabase
          .from("learned_words")
          .update({ status: type })
          .eq("user_id", user.id)
          .eq("word", word)

        setStatus(type)

      }

    } else {

      // create record
      await supabase
        .from("learned_words")
        .insert({
          user_id: user.id,
          word: word,
          status: type
        })

      setStatus(type)

    }

    setLoading(false)
  }


  return (

    <div
      className={`border rounded-xl p-6 shadow-sm transition bg-white

      ${status === "mastered" ? "bg-green-50 border-green-200" : ""}
      ${status === "weak" ? "bg-red-50 border-red-200" : ""}

      `}
    >

      {/* WORD */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {word}
      </h2>

      {/* STATUS BADGE */}

      {status === "mastered" && (
        <span className="inline-block text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full mb-3">
          Mastered
        </span>
      )}

      {status === "weak" && (
        <span className="inline-block text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full mb-3">
          Needs Practice
        </span>
      )}

      {/* MEANING */}

      <p className="text-gray-800 font-medium">
        Meaning: {meaning}
      </p>

      {/* EXAMPLE */}

      <p className="text-gray-700 mt-1">
        Example: {example}
      </p>

      {/* ACTIONS */}

      <div className="flex items-center justify-between mt-5 text-sm">

        <Link
          href={`/word/${slug}?lang=${language}`}
          className="text-blue-600 hover:underline font-medium"
        >
          Learn more →
        </Link>

        <div className="flex gap-2">

          {/* MASTERED BUTTON */}

          <button
            disabled={loading}
            onClick={() => handleClick("mastered")}
            className={`px-2 py-1 rounded-md border text-sm transition
            ${status === "mastered" ? "bg-green-100 border-green-300" : "hover:bg-green-50"}
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            ✓
          </button>

          {/* WEAK BUTTON */}

          <button
            disabled={loading}
            onClick={() => handleClick("weak")}
            className={`px-2 py-1 rounded-md border text-sm transition
            ${status === "weak" ? "bg-red-100 border-red-300" : "hover:bg-red-50"}
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            !
          </button>

        </div>

      </div>

      {/* LOADING INDICATOR */}

      {loading && (
        <p className="text-xs text-gray-500 mt-2">
          Updating...
        </p>
      )}

    </div>

  )
}
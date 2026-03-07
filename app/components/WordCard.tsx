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

export default function WordCard({
  word,
  meaning,
  example,
  slug,
  language,
}: Props) {

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  // LOAD EXISTING STATUS
  useEffect(() => {
    async function loadStatus() {

      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) return

      const { data } = await supabase
        .from("learned_words")
        .select("status")
        .eq("word", word)
        .eq("user_id", userData.user.id)
        .single()

      if (data) {
        setStatus(data.status)
      }
    }

    loadStatus()
  }, [word])


  async function updateStatus(type: string) {

    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from("learned_words")
      .upsert({
        user_id: userData.user.id,
        word: word,
        status: type
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

      {/* Updating overlay */}
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

      {/* STATUS PILL */}
      <div className="mt-2">

        {status === "mastered" && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Mastered
          </span>
        )}

        {status === "weak" && (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
            Needs Practice
          </span>
        )}

      </div>

      {/* MEANING */}
      <p className="text-gray-700 mt-3">
        {meaning}
      </p>

      {/* EXAMPLE */}
      <p className="text-gray-500 italic mt-2">
        "{example}"
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2 mt-4">

        <Link
          href={`/word/${slug}`}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          Learn More
        </Link>

        <button
          onClick={() => updateStatus("weak")}
          className="px-3 py-1 text-sm border rounded hover:bg-yellow-50"
        >
          Mark Weak
        </button>

        <button
          onClick={() => updateStatus("mastered")}
          className="px-3 py-1 text-sm border rounded hover:bg-green-50"
        >
          Mastered
        </button>

      </div>

    </div>
  )
}
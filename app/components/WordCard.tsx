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
}: Props) {

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

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

      if (data) setStatus(data.status)
    }

    loadStatus()
  }, [word])

  async function updateStatus(type: string) {

    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      setShowLoginPopup(true)
      return
    }

    setLoading(true)

    const userId = userData.user.id

    if (status === type) {

      await supabase
        .from("learned_words")
        .delete()
        .eq("user_id", userId)
        .eq("word", word)

      setStatus(null)

    } else {

      await supabase
        .from("learned_words")
        .upsert(
          { user_id: userId, word, status: type },
          { onConflict: "user_id,word" }
        )

      setStatus(type)
    }

    setLoading(false)
  }

  return (
    <>
      <div className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition">

        <Link href={`/word/${slug}`}>
          <h2 className="text-2xl font-semibold hover:underline">
            {word}
          </h2>
        </Link>

        <div className="mt-2">

          {status === "mastered" && (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
              Mastered
            </span>
          )}

          {status === "weak" && (
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
              Needs Practice
            </span>
          )}
        </div>

        <p className="mt-4 text-gray-700">
          {meaning}
        </p>

        <p className="italic text-gray-500 mt-2">
          "{example}"
        </p>

        <div className="flex gap-3 mt-5 flex-wrap">

          <Link
            href={`/word/${slug}`}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            Learn More
          </Link>

          <button
            onClick={() => updateStatus("weak")}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-yellow-50"
          >
            Mark Weak
          </button>

          <button
            onClick={() => updateStatus("mastered")}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-green-50"
          >
            Mastered
          </button>

        </div>

      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-lg">

            <h3 className="text-lg font-semibold mb-2">
              Unlock Learning Features 🚀
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Login to mark words as mastered and track progress.
            </p>

            <div className="flex gap-3 justify-center">

              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 border rounded"
              >
                Maybe Later
              </button>

              <button
                onClick={login}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Login with Google
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}
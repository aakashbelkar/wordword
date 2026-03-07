"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Props = {
  word: string
  meaning?: string
  example?: string
  slug: string
  language?: string
}

export default function WordCard({
  word,
  meaning,
  example,
  slug,
}: Props) {

  const [status, setStatus] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    async function loadUser() {

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      setUser(user)

      const { data } = await supabase
        .from("learned_words")
        .select("status")
        .eq("user_id", user.id)
        .eq("word", word)
        .single()

      if (data) setStatus(data.status)
    }

    loadUser()

  }, [word])

async function updateStatus(newStatus: string) {

  if (!user) {
    setShowLoginPopup(true)
    return
  }

  setLoading(true)

  try {

    // If clicking the same status again → remove it
    if (status === newStatus) {

      await supabase
        .from("learned_words")
        .delete()
        .eq("user_id", user.id)
        .eq("word", word)

      setStatus(null)

    } else {

      // Check if row already exists
      const { data } = await supabase
        .from("learned_words")
        .select("id")
        .eq("user_id", user.id)
        .eq("word", word)
        .maybeSingle()

      if (data) {

        // update existing row
        await supabase
          .from("learned_words")
          .update({ status: newStatus })
          .eq("user_id", user.id)
          .eq("word", word)

      } else {

        // insert new row
        await supabase
          .from("learned_words")
          .insert({
            user_id: user.id,
            word: word,
            status: newStatus
          })

      }

      setStatus(newStatus)
    }

  } catch (err) {
    console.error(err)
  }

  setLoading(false)
}

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  return (
    <>
      <div className="relative rounded-2xl p-6 border bg-white shadow-sm">

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl z-10">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            {word}
          </h2>

          {status && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium
              ${
                status === "mastered"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {status === "mastered" ? "Strong 💪" : "Weak ⚠️"}
            </span>
          )}

        </div>

        {meaning && (
          <p className="text-gray-700 mt-3">
            {meaning}
          </p>
        )}

        {example && (
          <div className="mt-3">

            <p className="text-gray-500 italic">
              "{example}"
            </p>

            <a
              href={`/word/${slug}`}
              className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
            >
              Learn more →
            </a>

          </div>
        )}

        <div className="flex gap-3 mt-5">

          <button
            disabled={loading}
            onClick={() => updateStatus("mastered")}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            💪 Strong
          </button>

          <button
            disabled={loading}
            onClick={() => updateStatus("weak")}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            ⚠️ Weak
          </button>

        </div>

      </div>

      {showLoginPopup && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-xl">

            <h3 className="text-xl font-semibold mb-3">
              Login to track words
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Log in to mark words as Strong or Weak and track your learning.
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleLogin}
                className="px-5 py-2 bg-black text-white rounded-lg text-sm"
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
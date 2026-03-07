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
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  // LOGIN FUNCTION (same as header)
  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    })
  }

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

    const { data: userData } = await supabase.auth.getUser()

    // USER NOT LOGGED IN → SHOW POPUP
    if (!userData?.user) {
      setShowLoginPopup(true)
      return
    }

    setLoading(true)

    const userId = userData.user.id

    // If clicking same status → remove it
    if (status === type) {

      const { error } = await supabase
        .from("learned_words")
        .delete()
        .eq("user_id", userId)
        .eq("word", word)

      if (!error) {
        setStatus(null)
      }

    } else {

      const { error } = await supabase
        .from("learned_words")
        .upsert(
          {
            user_id: userId,
            word: word,
            status: type
          },
          { onConflict: "user_id,word" }
        )

      if (!error) {
        setStatus(type)
      }

    }

    setLoading(false)
  }



  return (
    <>
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


      {/* LOGIN POPUP */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg">

            <h3 className="text-lg font-semibold mb-2">
              Unlock Learning Features 🚀
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Login to mark words as <b>Mastered</b>, review <b>weak words</b>,
              and track your vocabulary progress.
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 text-sm border rounded"
              >
                Maybe Later
              </button>

              <button
                onClick={login}
                className="px-4 py-2 text-sm bg-black text-white rounded"
              >
                Register / Login with Google
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  )
}
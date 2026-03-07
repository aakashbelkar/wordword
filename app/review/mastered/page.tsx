"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function MasteredWords() {

  const [words, setWords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  // GOOGLE LOGIN
  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  useEffect(() => {

    async function load() {

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setShowLoginPopup(true)
        setLoading(false)
        return
      }

      setUser(user)

      const { data } = await supabase
        .from("learned_words")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "mastered")

      if (data) setWords(data)

      setLoading(false)
    }

    load()

  }, [])



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        Loading your mastered words...
      </div>
    )
  }



  return (

    <>
      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          Mastered Words
        </h1>

        {words.length === 0 && (
          <p className="text-gray-500 mb-6">
            You haven't mastered any words yet. Start learning!
          </p>
        )}

        <div className="grid gap-4">

          {words.map((w) => (

            <Link
              key={w.word}
              href={`/word/${w.word.toLowerCase()}`}
              className="border p-4 rounded-xl hover:bg-green-50 transition"
            >
              {w.word}
            </Link>

          ))}

        </div>

      </div>



      {/* LOGIN POPUP */}

      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg">

            <h3 className="text-lg font-semibold mb-3">
              Track Your Vocabulary Progress 🚀
            </h3>

            <ul className="text-sm text-gray-600 mb-4 space-y-1 text-left">
              <li>✔ Track mastered words</li>
              <li>✔ Review weak vocabulary</li>
              <li>✔ Build your learning streak</li>
              <li>✔ Access your personal word dashboard</li>
            </ul>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 text-sm border rounded"
              >
                Maybe Later
              </button>

              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm bg-black text-white rounded"
              >
                Continue with Google
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  )
}
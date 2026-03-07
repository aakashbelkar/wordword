"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function WordCard({ word }: { word: string }) {

  const [status, setStatus] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  // LOGIN WITH GOOGLE
  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  // GET USER + WORD STATUS
  useEffect(() => {
    async function load() {

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

    load()
  }, [word])


  async function updateStatus(newStatus: string) {

    if (!user) {
      setShowLoginPopup(true)
      return
    }

    // TOGGLE OFF IF SAME STATUS CLICKED AGAIN
    if (status === newStatus) {

      await supabase
        .from("learned_words")
        .delete()
        .eq("user_id", user.id)
        .eq("word", word)

      setStatus(null)
      return
    }

    await supabase
      .from("learned_words")
      .upsert({
        user_id: user.id,
        word: word,
        status: newStatus,
      })

    setStatus(newStatus)
  }

  return (

    <>
      <div className="border rounded-xl p-5 shadow-sm">

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            {word}
          </h2>

          {status && (
            <span className="text-xs px-2 py-1 rounded bg-gray-100">
              {status}
            </span>
          )}

        </div>


        <div className="flex gap-3 mt-4">

          <button
            onClick={() => updateStatus("mastered")}
            className={`px-3 py-1 rounded border text-sm ${
              status === "mastered"
                ? "bg-green-500 text-white"
                : ""
            }`}
          >
            Mastered
          </button>


          <button
            onClick={() => updateStatus("weak")}
            className={`px-3 py-1 rounded border text-sm ${
              status === "weak"
                ? "bg-yellow-400 text-black"
                : ""
            }`}
          >
            Mark Weak
          </button>

        </div>

      </div>


      {/* LOGIN POPUP */}

      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg">

            <h3 className="text-lg font-semibold mb-3">
              Unlock Vocabulary Tracking 🚀
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Login to track mastered words, review weak vocabulary,
              and build your personal word collection.
            </p>

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
                Register / Login with Google
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  )
}
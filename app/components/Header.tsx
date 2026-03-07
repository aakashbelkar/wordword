"use client"

import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()
  }, [])

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  async function logout() {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

        <Link href="/" className="text-xl font-bold tracking-tight">
          WordWord
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">

          {user && (
            <>
              <Link href="/review" className="hover:text-black/70">
                Review
              </Link>

              <Link href="/dashboard" className="hover:text-black/70">
                Dashboard
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Login
            </button>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-4 bg-white">

          {user && (
            <>
              <Link href="/review" className="block">
                Review
              </Link>

              <Link href="/dashboard" className="block">
                Dashboard
              </Link>
            </>
          )}

          {user ? (
            <button onClick={logout} className="block w-full text-left">
              Logout
            </button>
          ) : (
            <button onClick={login} className="block w-full text-left">
              Login
            </button>
          )}
        </div>
      )}
    </header>
  )
}
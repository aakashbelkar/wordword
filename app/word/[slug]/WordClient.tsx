"use client"

import words from "@/data/words.json"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function WordClient() {
  const params = useParams()
  const slug = params.slug as string

  const [language, setLanguage] = useState("en")
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState<string | null>(null)
  const [result, setResult] = useState<"correct" | "wrong" | null>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem("language")
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const word = words.find(w => w.slug === slug)

  // 1. EARLY RETURN: This tells TypeScript 'word' exists for everything below this block.
  if (!word) {
    return <div className="p-10 text-xl text-center">Word not found</div>
  }

  const related = words
    .filter(w => w.slug !== slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: word.word,
    description: word.meaning_en,
    inDefinedTermSet: "English Vocabulary",
    url: `https://wordword.app/word/${word.slug}`
  }

  useEffect(() => {
    const correctMeaning =
      language === "hi"
        ? word.meaning_hi
        : language === "mr"
        ? word.meaning_mr
        : word.meaning_en

    setCorrect(correctMeaning)

    const otherMeanings = words
      .filter(w => w.slug !== slug)
      .map(w => {
        if (language === "hi") return w.meaning_hi
        if (language === "mr") return w.meaning_mr
        return w.meaning_en
      })

    const shuffled = otherMeanings.sort(() => 0.5 - Math.random())

    const quizOptions = [
      correctMeaning,
      shuffled[0],
      shuffled[1],
      shuffled[2]
    ].sort(() => 0.5 - Math.random())

    setOptions(quizOptions)
  }, [language, slug, word])

  // HELPER FUNCTIONS (Now safe because 'word' is guaranteed to exist here)
  function getMeaning() {
    if (language === "hi") return word?.meaning_hi
    if (language === "mr") return word?.meaning_mr
    return word?.meaning_en
  }

  function getExample() {
    if (language === "hi") return word?.example_hi
    if (language === "mr") return word?.example_mr
    return word?.example_en
  }

  function getStory() {
    if (language === "hi") return word?.story_hi
    if (language === "mr") return word?.story_mr
    return word?.story_en
  }

  function selectOption(opt: string) {
    if (selected) return
    setSelected(opt)
    if (opt === correct) {
      setResult("correct")
    } else {
      setResult("wrong")
    }
  }

  async function markStatus(wordText: string, status: "mastered" | "weak") {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Please login first")
      return
    }

    await supabase
      .from("learned_words")
      .upsert({
        user_id: user.id,
        word: wordText,
        status: status
      })

    window.location.href = "/"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">{word.word}</h1>

        <Image
          src={word.image}
          alt={word.word}
          width={800}
          height={400}
          className="rounded-xl mb-6 object-cover"
        />

        <div className="space-y-3 text-lg">
          <p><strong>Meaning:</strong> {getMeaning()}</p>
          <p><strong>Example:</strong> {getExample()}</p>
          <p className="mt-6 leading-relaxed italic text-gray-700">
            {getStory()}
          </p>
        </div>

        <div className="mt-10 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Mini Test</h2>
          <p className="mb-4">
            What does <b>{word.word}</b> mean?
          </p>

          <div className="grid gap-3 mb-6">
            {options.map((opt, i) => {
              let bg = "bg-gray-50 hover:bg-gray-100"
              if (selected) {
                if (opt === correct) bg = "bg-green-200 border-green-500"
                else if (opt === selected) bg = "bg-red-200 border-red-500"
                else bg = "bg-gray-50 opacity-50"
              }

              return (
                <div
                  key={i}
                  onClick={() => selectOption(opt)}
                  className={`border p-4 rounded-lg cursor-pointer transition-colors ${bg}`}
                >
                  {opt}
                </div>
              )
            })}
          </div>

          {result === "correct" && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 font-semibold mb-3">Well done! 🎉</p>
              <button
                onClick={() => markStatus(word.word, "mastered")}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Mark Mastered
              </button>
            </div>
          )}

          {result === "wrong" && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 font-semibold mb-3">Not quite right.</p>
              <button
                onClick={() => markStatus(word.word, "weak")}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Mark Weak
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Related Words</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map(w => (
              <a
                key={w.slug}
                href={`/word/${w.slug}`}
                className="border p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all text-center"
              >
                {w.word}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
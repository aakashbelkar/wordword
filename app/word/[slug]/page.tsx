import { supabase } from "@/lib/supabase"
import WordClient from "./WordClient"

type PageProps = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params

  const { data: word } = await supabase
    .from("words")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!word) {
    return <div className="p-6">Word not found</div>
  }

  const language = "en" // you can replace later with user preference

  return (
    <WordClient
      word={word}
      language={language}
    />
  )
}
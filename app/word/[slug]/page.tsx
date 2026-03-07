import words from "@/data/words.json"
import WordClient from "./WordClient"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: PageProps) {

  const { slug } = await params

  const word = words.find(
    (w) => w.slug === slug
  )

  if (!word) {
    return <div className="p-6">Word not found</div>
  }

  return (
    <WordClient
      word={word}
      language="en"
    />
  )
}
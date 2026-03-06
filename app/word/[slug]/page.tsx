import words from "@/data/words.json"
import WordClient from "./WordClient"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params

  const word = words.find((w) => w.slug === slug)

  if (!word) {
    return {
      title: "Word not found"
    }
  }

  return {
    title: `${word.word} Meaning | WordWord`,
    description: `${word.word} meaning: ${word.meaning_en}. Example sentence and story.`,
    alternates: {
      canonical: `https://wordword.app/word/${slug}`
    }
  }
}

export default async function Page({ params }: Props) {

  const { slug } = await params

  return <WordClient slug={slug} />

}
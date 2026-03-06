import words from "@/data/words.json"
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {

const baseUrl = "https://wordword.app"

const wordPages = words.map((word) => ({
url: `${baseUrl}/word/${word.slug}`,
lastModified: new Date(),
changeFrequency: "weekly" as const,
priority: 0.8
}))

return [
{
url: baseUrl,
lastModified: new Date(),
changeFrequency: "daily",
priority: 1
},
...wordPages
]

}
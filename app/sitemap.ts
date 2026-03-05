import words from "@/data/words.json"

export default function sitemap(){

const baseUrl="https://wordword.app"

const wordPages = words.map(word=>({
url:`${baseUrl}/word/${word.slug}`,
lastModified:new Date()
}))

return[
{
url:baseUrl,
lastModified:new Date()
},
...wordPages
]

}
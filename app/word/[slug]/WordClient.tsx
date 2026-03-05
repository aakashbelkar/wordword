"use client"

import words from "@/data/words.json"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function WordClient() {

const params = useParams()
const slug = params.slug as string

const [language,setLanguage] = useState("en")
const [options,setOptions] = useState<string[]>([])
const [selected,setSelected] = useState<string | null>(null)
const [correct,setCorrect] = useState<string | null>(null)
const [result,setResult] = useState<"correct"|"wrong"|null>(null)

useEffect(()=>{

const savedLang = localStorage.getItem("language")

if(savedLang){
setLanguage(savedLang)
}

},[])

const word = words.find(w=>w.slug===slug)!

const related = words
.filter(w => w.slug !== slug)
.sort(() => 0.5 - Math.random())
.slice(0,5)

const schema = word ? {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: word.word,
  description: word.meaning_en,
  inDefinedTermSet: "English Vocabulary",
  url: `https://wordword.app/word/${word.slug}`
} : null

useEffect(()=>{

if(!word) return

const correctMeaning =
language==="hi"
? word.meaning_hi
: language==="mr"
? word.meaning_mr
: word.meaning_en

setCorrect(correctMeaning)

const otherMeanings = words
.filter(w=>w.slug!==slug)
.map(w=>{
if(language==="hi") return w.meaning_hi
if(language==="mr") return w.meaning_mr
return w.meaning_en
})

const shuffled = otherMeanings.sort(()=>0.5-Math.random())

const quizOptions=[
correctMeaning,
shuffled[0],
shuffled[1],
shuffled[2]
].sort(()=>0.5-Math.random())

setOptions(quizOptions)

},[language,slug,word])

if(!word){
return <div className="p-10 text-xl">Word not found</div>
}

function getMeaning(){

if(!word) return ""

if(language==="hi") return word.meaning_hi
if(language==="mr") return word.meaning_mr
return word.meaning_en

}

function getExample(){

if(!word) return ""

if(language==="hi") return word.example_hi
if(language==="mr") return word.example_mr
return word.example_en

}

function getStory(){

if(!word) return ""

if(language==="hi") return word.story_hi
if(language==="mr") return word.story_mr
return word.story_en

}

function selectOption(opt:string){

if(selected) return

setSelected(opt)

if(opt===correct){
setResult("correct")
}else{
setResult("wrong")
}

}

async function markStatus(word:string,status:"mastered"|"weak"){

const { data:{ user } } = await supabase.auth.getUser()

if(!user){
alert("Please login first")
return
}

await supabase
.from("learned_words")
.upsert({
user_id:user.id,
word:word,
status:status
})

window.location.href="/"

}

return(

<>
{schema && (
<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify(schema)
}}
/>
)}

<div className="max-w-3xl mx-auto p-6">

<h1 className="text-4xl font-bold mb-4">
{word.word}
</h1>

<Image
src={word.image}
alt={word.word}
width={800}
height={400}
className="rounded-xl mb-6"
/>

<p className="mb-3">
Meaning: {getMeaning()}
</p>

<p className="mb-3">
Example: {getExample()}
</p>

<p className="mt-6 leading-relaxed">
{getStory()}
</p>

<div className="mt-10 border-t pt-8">

<h2 className="text-2xl font-semibold mb-4">
Mini Test
</h2>

<p className="mb-4">
What does <b>{word.word}</b> mean?
</p>

<div className="grid gap-3 mb-6">

{options.map((opt,i)=>{

let bg="bg-gray-50"

if(selected){

if(opt===correct){
bg="bg-green-200"
}
else if(opt===selected){
bg="bg-red-200"
}

}

return(

<div
key={i}
onClick={()=>selectOption(opt)}
className={`border p-3 rounded-lg cursor-pointer ${bg}`}
>
{opt}
</div>

)

})}

</div>

{result==="correct" && (

<div className="mt-6">

<p className="text-green-700 font-semibold mb-3">
Well done! 🎉
</p>

<button
onClick={()=>markStatus(word.word,"mastered")}
className="px-4 py-2 bg-green-600 text-white rounded"
>
Mark Mastered
</button>

</div>

)}

{result==="wrong" && (

<div className="mt-6">

<p className="text-red-700 font-semibold mb-3">
Incorrect answer
</p>

<button
onClick={()=>markStatus(word.word,"weak")}
className="px-4 py-2 bg-red-600 text-white rounded"
>
Mark Weak
</button>

</div>

)}

</div>



<div className="mt-12">

<h3 className="text-2xl font-bold mb-4">
Related Words
</h3>

<div className="grid gap-3">

{related.map(w => (

<a
key={w.slug}
href={`/word/${w.slug}`}
className="border p-3 rounded-lg hover:bg-gray-50"
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
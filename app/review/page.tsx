import Link from "next/link"

export default function ReviewPage() {

return (

<div className="max-w-3xl mx-auto">

<h1 className="text-4xl font-bold text-center mb-2">
Review Words
</h1>

<p className="text-center text-gray-500 mb-10">
Practice and reinforce your vocabulary
</p>

<div className="grid md:grid-cols-2 gap-6">

<Link
href="/review/weak"
className="group p-8 rounded-2xl border border-red-200 bg-red-50 hover:shadow-lg hover:-translate-y-1 transition"
>

<h2 className="text-2xl font-semibold mb-2 group-hover:text-red-600 transition">
Review Weak Words
</h2>

<p className="text-gray-600">
Practice vocabulary you marked as weak.
</p>

</Link>

<Link
href="/review/mastered"
className="group p-8 rounded-2xl border border-green-200 bg-green-50 hover:shadow-lg hover:-translate-y-1 transition"
>

<h2 className="text-2xl font-semibold mb-2 group-hover:text-green-600 transition">
Review Mastered Words
</h2>

<p className="text-gray-600">
Revisit words you already mastered.
</p>

</Link>

</div>

</div>

)

}
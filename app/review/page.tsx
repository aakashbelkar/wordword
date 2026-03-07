import Link from "next/link"

export default function ReviewPage() {

return (

<div>

<h1 className="text-4xl font-bold text-center mb-10">
Review Words
</h1>

<div className="grid md:grid-cols-2 gap-8">

<Link
href="/review/weak"
className="p-8 border rounded-2xl bg-red-50 hover:shadow-md transition"
>

<h2 className="text-2xl font-semibold mb-2">
Review Weak Words
</h2>

<p className="text-gray-600">
Practice vocabulary you marked as weak.
</p>

</Link>

<Link
href="/review/mastered"
className="p-8 border rounded-2xl bg-green-50 hover:shadow-md transition"
>

<h2 className="text-2xl font-semibold mb-2">
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
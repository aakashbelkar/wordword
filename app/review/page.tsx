import Link from "next/link"

export default function ReviewPage() {

return (

<div className="max-w-4xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6 text-center">
Review Words
</h1>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

<Link
href="/review/weak"
className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition bg-red-50"
>

<h2 className="text-xl font-semibold mb-2">
Review Weak Words
</h2>

<p className="text-gray-600">
Practice words you marked as weak.
</p>

</Link>

<Link
href="/review/mastered"
className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition bg-green-50"
>

<h2 className="text-xl font-semibold mb-2">
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